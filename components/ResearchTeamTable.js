"use client";

import FormFieldBlock from './FormFieldBlock'
import UserPicker from './UserPicker'
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormCheckbox from './FormCheckbox';
import { useEffect, useMemo, useState } from 'react'
import SweetAlert2 from 'react-sweetalert2'
import {
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { projectAPI, api, authAPI } from '../lib/api'

export default function ResearchTeamTable({ projectId, formData, handleInputChange, setFormData }) {
  const [swalProps, setSwalProps] = useState({})
  
  // Real data from API
  const [project, setProject] = useState(null)
  const [me, setMe] = useState(null)
  const [localPartners, setLocalPartners] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // คำนวณสัดส่วนสำหรับผู้ร่วมงานภายใน มก.
  function recomputeProportions(list = []) {
    const result = list.map(p => ({ ...p }))
    const internalIdx = result.reduce((arr, p, idx) => (p.isInternal ? [...arr, idx] : arr), [])
    const n = internalIdx.length
    if (n === 0) return result.map(p => ({ ...p, partnerProportion: undefined }))
    
    // แบ่งสัดส่วนเท่าๆ กันสำหรับผู้ใช้ภายในเท่านั้น
    const base = 1 / n
    let assigned = 0
    internalIdx.forEach((idx, i) => {
      if (i < n - 1) {
        result[idx].partnerProportion = base.toFixed(3)
        assigned += base
      } else {
        // คนสุดท้ายได้ส่วนที่เหลือ เพื่อให้รวมกันเป็น 1.000
        const last = 1 - assigned
        result[idx].partnerProportion = last.toFixed(3)
      }
    })
    
    // ผู้ร่วมงานภายนอกไม่มีสัดส่วน
    return result.map(p => (p.isInternal ? p : { ...p, partnerProportion: undefined }))
  }

  useEffect(() => {
    // When project (from API) has research_partners, normalize into localPartners
    if (!project) return
    // project may be returned in different shapes: { data: { id, attributes: { research_partners: { data: [...] }}}} or plain object
    let partners = []
    if (project.data && project.data.attributes) {
      partners = project.data.attributes.research_partners?.data || []
    } else if (project.research_partners) {
      partners = project.research_partners.data || project.research_partners
    }

    // Normalize Strapi partner entries to the UI shape
    const norm = (partners || []).map(item => {
      const p = item?.attributes ? item.attributes : item
      
      // Map participant_type numbers to labels
      const partnerTypeLabels = {
        1: 'หัวหน้าโครงการ',
        2: 'ที่ปรึกษาโครงการ',
        3: 'ผู้ประสานงาน',
        4: 'นักวิจัยร่วม',
        99: 'อื่นๆ',
      }
      
      return {
        id: item?.id || p.id,
        fullname: p.fullname || p.name || '',
        orgName: p.orgName || p.org || '',
        partnerType: partnerTypeLabels[p.participant_type] || p.partnerType || '',
        isInternal: !!p.users_permissions_user || !!p.userID || false,
        userID: p.users_permissions_user?.data?.id || p.users_permissions_user || p.userID || undefined,
        partnerComment: (p.isFirstAuthor ? 'First Author' : '') + (p.isCoreespondingAuthor ? ' Corresponding Author' : ''),
        partnerProportion: p.participation_percentage !== undefined ? String(p.participation_percentage) : undefined,
      }
    })

    if (norm.length > 0) setLocalPartners(recomputeProportions(norm))
  }, [project])

  // Fetch project data when projectId provided
  useEffect(() => {
    async function loadProject() {
      if (!projectId) return
      try {
        const resp = await projectAPI.getProject(projectId)
        setProject(resp)
      } catch (err) {
        console.error('Failed to load project', err)
      }
    }
    loadProject()
  }, [projectId])

  // Load current user
  useEffect(() => {
    async function loadMe() {
      try {
        const u = await authAPI.me()
        setMe(u?.data || u || null)
      } catch (err) {
        console.error('Failed to load current user', err)
      }
    }
    loadMe()
  }, [])

  // Keep parent formData in sync with local partners (so CreateResearchForm can read them)
  useEffect(() => {
    if (typeof setFormData === 'function') {
      setFormData(prev => ({ ...prev, partnersLocal: localPartners }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localPartners])

  async function syncToServer(partnersList) {
    if (!projectId) return; // ไม่มี project ให้ซิงค์
    setSaveError('')
    setSaving(true)
    try {
      // เตรียม payload สำหรับ API 
      const partnerTypeMap = {
        'หัวหน้าโครงการ': 1,
        'ที่ปรึกษาโครงการ': 2,
        'ผู้ประสานงาน': 3,
        'นักวิจัยร่วม': 4,
        'อื่นๆ': 99,
      }

      // ลบ partners เก่าที่เชื่อมโยงกับ project นี้ (ใช้ documentId สำหรับ Strapi v5)
      try {
        const existingPartners = await api.get(`/project-partners?filters[project_researches][documentId][$eq]=${projectId}`)
        const partnersToDelete = existingPartners?.data || []
        for (const partner of partnersToDelete) {
          await api.delete(`/project-partners/${partner.documentId || partner.id}`)
        }
      } catch (err) {
        console.warn('Failed to delete existing partners:', err)
      }

      // สร้าง partners ใหม่
      for (const p of partnersList || []) {
        const partnerData = {
          fullname: p.fullname || undefined,
          orgName: p.orgName || undefined,
          participation_percentage: p.partnerProportion ? parseFloat(p.partnerProportion) : undefined,
          participant_type: partnerTypeMap[p.partnerType] || undefined,
          isFirstAuthor: String(p.partnerComment || '').includes('First Author') || false,
          isCoreespondingAuthor: String(p.partnerComment || '').includes('Corresponding Author') || false,
          users_permissions_user: p.userID || undefined,
          project_researches: [projectId] // ใช้ documentId
        }

        // Remove undefined keys
        Object.keys(partnerData).forEach(k => partnerData[k] === undefined && delete partnerData[k])

        await api.post('/project-partners', { data: partnerData })
      }

      setSwalProps({ show: true, icon: 'success', title: 'บันทึกทีมสำเร็จ', timer: 1000, showConfirmButton: false })
    } catch (err) {
      setSaveError(err.message || 'บันทึกผู้ร่วมโครงการไม่สำเร็จ')
      setSwalProps({ show: true, icon: 'error', title: 'บันทึกทีมไม่สำเร็จ', text: err.message || '', timer: 2000 })
    } finally {
      setSaving(false)
    }
  }

  function resetForm() {
    setFormData(prev => ({
      ...prev,
      __userObj: undefined,
      partnerFullName: '',
      orgName: '',
      userId: undefined,
      partnerType: '',
      partnerComment: '',
    }))
    setEditingIndex(null)
  }

  function handleAddPartner() {
    const internal = formData.isInternal === true
    const u = formData.__userObj || null
    const prof = u ? (Array.isArray(u.profile) ? u.profile[0] : u.profile) : null
    const full = u ? (prof ? `${prof.firstName || ''} ${prof.lastName || ''}`.trim() : u.email) : ''
    const org = u ? [u.department?.name, u.faculty?.name, u.organization?.name].filter(Boolean).join(' ') : ''
    
    const pcArr = Array.isArray(formData.partnerComment)
      ? formData.partnerComment
      : (formData.partnerComment ? String(formData.partnerComment).split(',').map(s => s.trim()).filter(Boolean) : [])
    const pcJoined = pcArr.join(', ')
    
    const partner = {
      isInternal: internal,
      userID: internal && u ? u.id : undefined,
      fullname: internal ? (full || formData.partnerFullName || '') : (formData.partnerFullName || ''),
      orgName: internal ? (org || formData.orgName || '') : (formData.orgName || ''),
      partnerType: formData.partnerType || '',
      partnerComment: pcJoined,
      partnerProportion: undefined,
      User: internal && u ? { email: u.email } : undefined,
    }
    
    setLocalPartners(prev => {
      const base = prev || []
      let next
      if (editingIndex !== null && editingIndex >= 0 && editingIndex < base.length) {
        const updated = base.slice()
        updated[editingIndex] = { ...updated[editingIndex], ...partner }
        next = recomputeProportions(updated)
      } else {
        next = recomputeProportions([...(base || []), partner])
      }
      // ซิงค์ขึ้นเซิร์ฟเวอร์ (ไม่รวม mePartner ซึ่งไม่ได้อยู่ใน localPartners อยู่แล้ว)
      syncToServer(next)
      return next
    })
    
    const dlg = document.getElementById('my_modal_2');
    if (dlg && dlg.close) dlg.close()
    resetForm()
  }

  // ย้ายลำดับขึ้น
  function moveUp(idx) {
    if (idx <= 0) return
    setLocalPartners(prev => {
      const arr = [...(prev || [])]
      const tmp = arr[idx - 1]
      arr[idx - 1] = arr[idx]
      arr[idx] = tmp
      const next = recomputeProportions(arr)
      syncToServer(next)
      return next
    })
  }

  // ย้ายลำดับลง
  function moveDown(idx) {
    setLocalPartners(prev => {
      const arr = [...(prev || [])]
      if (idx >= arr.length - 1) return prev
      const tmp = arr[idx + 1]
      arr[idx + 1] = arr[idx]
      arr[idx] = tmp
      const next = recomputeProportions(arr)
      syncToServer(next)
      return next
    })
  }

  function handleRemovePartner(idx) {
    setLocalPartners(prev => {
      const next = recomputeProportions(prev.filter((_, i) => i !== idx))
      syncToServer(next)
      return next
    })
    // รีเซ็ตฟอร์มใน dialog
    setFormData(prev => ({
      ...prev,
      __userObj: undefined,
      partnerFullName: '',
      orgName: '',
      userId: undefined,
      partnerType: '',
      partnerComment: ''
    }))
    setEditingIndex(null)
  }

  function handleEditPartner(idx) {
    const p = localPartners[idx]
    if (!p) return
    setEditingIndex(idx)
    setFormData(prev => ({
      ...prev,
      isInternal: !!p.isInternal,
      partnerFullName: p.fullname || '',
      orgName: p.orgName || '',
      partnerType: p.partnerType || '',
      partnerComment: p.partnerComment || p.comment || '',
      userId: p.userID || undefined,
      __userObj: undefined
    }))
    const dlg = document.getElementById('my_modal_2');
    if (dlg && dlg.showModal) dlg.showModal()
  }

  const hasFirstAuthor = useMemo(() => (localPartners || []).some(p => ((p.partnerComment || p.comment || '')).includes('First Author')), [localPartners])
  const hasCorresponding = useMemo(() => (localPartners || []).some(p => ((p.partnerComment || p.comment || '')).includes('Corresponding Author')), [localPartners])

  // สร้างแถวผู้ใช้ปัจจุบันและคำนวณสัดส่วนรวมเพื่อใช้แสดงผล
  const mePartner = useMemo(() => {
    if (!me) return null;
    const prof = Array.isArray(me.profile) ? me.profile[0] : me.profile;
    const display = (prof ? `${prof.firstName || ''} ${prof.lastName || ''}`.trim() : me?.email) || me?.email || '-';
    const org = [me?.department?.name, me?.faculty?.name, me?.organization?.name].filter(Boolean).join(' ') || '-';
    return { 
      isInternal: true, 
      userID: me?.id, 
      fullname: display, 
      orgName: org, 
      partnerType: '-', 
      partnerComment: '', 
      partnerProportion: undefined, 
      User: { email: me?.email } 
    };
  }, [me]);

  const displayRows = useMemo(() => {
    const list = mePartner ? [mePartner, ...(localPartners || [])] : (localPartners || []);
    return recomputeProportions(list);
  }, [mePartner, localPartners]);

  return (
    <>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box w-11/12 max-w-5xl text-gray-700">
          <FormFieldBlock>
            <div className="flex items-center gap-10">
              <label className="flex items-center gap-3 text-zinc-700">
                <input
                  type="radio"
                  value="true"
                  checked={formData.isInternal === true}
                  onChange={() => handleInputChange("isInternal", true)}
                  className={`
                                text-zinc-700
                                px-3 py-2 border border-gray-300 rounded-md
                                placeholder-gray-400 focus:outline-none focus:ring-2
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200
                            `}
                />
                ภายใน มก.
              </label>
              <label className="flex items-center gap-3 text-zinc-700">
                <input
                  type="radio"
                  value="false"
                  checked={formData.isInternal === false}
                  onChange={() => handleInputChange("isInternal", false)}
                  className={`
                                text-zinc-700
                                px-3 py-2 border border-gray-300 rounded-md
                                placeholder-gray-400 focus:outline-none focus:ring-2
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200
                            `}
                />
                ภายนอก มก. (หัวหน้าโครงการวิจัยภายนอก มก. นิสิต และลูกจ้าง)
              </label>
            </div>
            {
              formData.isInternal === true ? (
                <>
                  <div>
                    <UserPicker
                      label="ผู้ร่วมโครงการวิจัย"
                      selectedUser={formData.__userObj}
                      onSelect={(u) => {
                        const prof = Array.isArray(u.profile) ? u.profile[0] : u.profile
                        const display = prof ? `${prof.firstName || ''} ${prof.lastName || ''}`.trim() : u.email
                        const org = [u.department?.name, u.faculty?.name, u.organization?.name].filter(Boolean).join(' ')
                        setFormData(prev => ({ 
                          ...prev, 
                          partnerFullName: display, 
                          orgName: org, 
                          userId: u.id, 
                          __userObj: u 
                        }))
                      }}
                    />
                  </div>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อผู้ร่วมโครงการวิจัย"
                      type="text"
                      value={(() => {
                        if (formData.__userObj) {
                          const prof = Array.isArray(formData.__userObj.profile) ? formData.__userObj.profile[0] : formData.__userObj.profile
                          return prof ? `${prof.firstName || ''} ${prof.lastName || ''}`.trim() : formData.__userObj.email
                        }
                        return formData.partnerFullName || ''
                      })()}
                      readOnly={true}
                    />
                  </div>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อหน่วยงาน"
                      type="text"
                      value={(() => {
                        if (formData.__userObj) {
                          return [
                            formData.__userObj.department?.name,
                            formData.__userObj.faculty?.name,
                            formData.__userObj.organization?.name
                          ].filter(Boolean).join(' ')
                        }
                        return formData.orgName || ''
                      })()}
                      readOnly={true}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อผู้ร่วมโครงการวิจัย"
                      type="text"
                      value={formData.partnerFullName}
                      onChange={(value) => handleInputChange("partnerFullName", value)}
                      placeholder="กรอกชื่อ-นามสกุล"
                    />
                  </div>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อหน่วยงาน"
                      type="text"
                      value={formData.orgName}
                      onChange={(value) => handleInputChange("orgName", value)}
                      placeholder="กรอกชื่อหน่วยงาน"
                    />
                  </div>
                </>
              )
            }
            <div>
              <FormSelect
                label="ประเภทผู้ร่วมโครงการวิจัย"
                required
                value={formData.partnerType}
                onChange={(value) => handleInputChange("partnerType", value)}
                className="max-w-lg"
                options={[
                  { value: '', label: 'เลือกประเภท' },
                  { value: 'หัวหน้าโครงการ', label: 'หัวหน้าโครงการ' },
                  { value: 'ที่ปรึกษาโครงการ', label: 'ที่ปรึกษาโครงการ' },
                  { value: 'ผู้ประสานงาน', label: 'ผู้ประสานงาน' },
                  { value: 'นักวิจัยร่วม', label: 'นักวิจัยร่วม' },
                  { value: 'อื่นๆ', label: 'อื่นๆ' },
                ]}
              />
            </div>
            <div>
              <FormCheckbox
                label="หมายเหตุ"
                inline={true}
                value={Array.isArray(formData.partnerComment) ? formData.partnerComment : (formData.partnerComment ? String(formData.partnerComment).split(',').map(s => s.trim()).filter(Boolean) : [])}
                onChange={(arr) => handleInputChange("partnerComment", arr)}
                className="max-w-lg"
                options={[
                  ...(!hasFirstAuthor || (Array.isArray(formData.partnerComment) && formData.partnerComment.includes('First Author')) ? [{ value: 'First Author', label: 'First Author' }] : []),
                  ...(!hasCorresponding || (Array.isArray(formData.partnerComment) && formData.partnerComment.includes('Corresponding Author')) ? [{ value: 'Corresponding Author', label: 'Corresponding Author' }] : []),
                ]}
              />
            </div>
          </FormFieldBlock>
          <div className="modal-action">
            <button onClick={handleAddPartner} type="button" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              {editingIndex !== null ? 'บันทึก' : 'เพิ่ม'}
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={() => { resetForm(); const dlg = document.getElementById('my_modal_2'); if (dlg && dlg.close) dlg.close(); }}
            >
              ยกเลิก
            </button>
          </div>
        </div>
        <div
          className="modal-backdrop backdrop-blur-sm"
          onClick={() => { resetForm(); const dlg = document.getElementById('my_modal_2'); if (dlg && dlg.close) dlg.close(); }}
        />
      </dialog>

      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      <div className="space-y-4">
        {!projectId && (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
            เมื่อเลือกโครงการแล้ว ระบบจะบันทึกรายชื่อผู้ร่วมโดยอัตโนมัติ
          </div>
        )}
        {saveError && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{saveError}</div>
        )}
        {/* Header */}
        <div className="flex justify-end gap-4 mb-5">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700" onClick={() => {
            resetForm();
            document.getElementById('my_modal_2').showModal();
          }}>
            เพิ่มสมาชิก
          </button>
        </div>
        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-b-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ลำดับ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หน่วยงาน
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ประเภทผู้ร่วมโครงการวิจัย
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หมายเหตุ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สัดส่วนการวิจัย (%)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayRows.map((p, i) => (
                  <tr key={p.id || p.userID || i} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[#065F46] text-sm font-medium
                          bg-[#D1FAE5]
                        `}
                        >
                          {i + 1}
                        </div>
                        {i > 0 && (
                          <div className='text-gray-700 flex items-center gap-2 ml-3'>
                            <button type="button" onClick={() => moveUp(i)} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-xs">
                              <ChevronUp />
                            </button>
                            <button type="button" onClick={() => moveDown(i)} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-xs">
                              <ChevronDown />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {p.fullname || p.User?.email || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {p.User?.email || ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {p.orgName || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{p.partnerType || '-'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{p.partnerComment || '-'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {p.partnerProportion && (
                        <div className="text-sm text-gray-900">
                          {(parseFloat(p.partnerProportion) * 100).toFixed(1)}%
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {i > 0 && (
                        <div className="flex items-center gap-3 justify-end">
                          <button type="button" onClick={() => handleEditPartner(i - 1)} className="text-blue-600 hover:text-blue-900">
                            แก้ไข
                          </button>
                          <button type="button" onClick={() => handleRemovePartner(i - 1)} className="text-red-600 hover:text-red-900">
                            ลบ
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
