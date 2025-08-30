import FormFieldBlock from './FormFieldBlock'
import UserPicker from './UserPicker'
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormCheckbox from './FormCheckbox';
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useEffect, useMemo, useState } from 'react'
import {
  ChevronUp,
  ChevronDown
} from "lucide-react";

export default function ResearchTeamTable({ projectId, formData, handleInputChange, setFormData }) {
  const { data: project } = useSWR(projectId ? `/projects/${projectId}` : null, api.get)
  const { data: me } = useSWR('/profiles/me', api.get)
  const [localPartners, setLocalPartners] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)

  // คำนวณสัดส่วนสำหรับผู้ร่วมงานภายใน มก.
  function recomputeProportions(list = []) {
    const result = list.map(p => ({ ...p }))
    const internalIdx = result.reduce((arr, p, idx) => (p.isInternal ? [...arr, idx] : arr), [])
    const n = internalIdx.length
    if (n === 0) return result.map(p => ({ ...p, partnerProportion: undefined }))
    const base = parseFloat((1 / n).toFixed(2))
    let assigned = 0
    internalIdx.forEach((idx, i) => {
      if (i < n - 1) {
        result[idx].partnerProportion = base.toFixed(2)
        assigned += base
      } else {
        const last = parseFloat((1 - assigned).toFixed(2))
        result[idx].partnerProportion = last.toFixed(2)
      }
    })
    return result.map(p => (p.isInternal ? p : { ...p, partnerProportion: undefined }))
  }

  useEffect(() => {
    if (project?.ProjectPartner) setLocalPartners(recomputeProportions(project.ProjectPartner))
  }, [project])

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
    const prof = u ? (Array.isArray(u.Profile) ? u.Profile[0] : u.Profile) : null
    const full = u ? (prof ? `${prof.firstName || ''} ${prof.lastName || ''}`.trim() : u.email) : ''
    const org = u ? (u.Faculty?.name || u.Department?.name || '') : ''
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
      if (editingIndex !== null && editingIndex >= 0 && editingIndex < base.length) {
        const updated = base.slice()
        updated[editingIndex] = { ...updated[editingIndex], ...partner }
        return recomputeProportions(updated)
      }
      return recomputeProportions([...(base || []), partner])
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
      return recomputeProportions(arr)
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
      return recomputeProportions(arr)
    })
  }

  function handleRemovePartner(idx) {
    setLocalPartners(prev => recomputeProportions(prev.filter((_, i) => i !== idx)))
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

  const hasFirstAuthor = useMemo(() => (localPartners || []).some(p => (p.partnerComment || p.comment).includes('First Author')), [localPartners])
  const hasCorresponding = useMemo(() => (localPartners || []).some(p => (p.partnerComment || p.comment).includes('Corresponding Author')), [localPartners])

  // สร้างแถวผู้ใช้ปัจจุบันและคำนวณสัดส่วนรวมเพื่อใช้แสดงผล
  const mePartner = useMemo(() => {
    if (!me) return null;
    const prof = me?.Profile?.[0] || me?.profile;
    const display = (prof ? `${prof.firstName || ''} ${prof.lastName || ''}`.trim() : me?.email) || me?.email || '-';
    const org = me?.Faculty?.name || me?.Department?.name || me?.Organization?.name || '-';
    return { isInternal: true, userID: me?.id, fullname: display, orgName: org, partnerType: '-', partnerComment: '', partnerProportion: undefined, User: { email: me?.email } };
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
                        const display = (u.Profile ? `${u.Profile.firstName || ''} ${u.Profile.lastName || ''}`.trim() : u.email)
                        setFormData(prev => ({ ...prev, partnerFullName: display, orgName: (u.Faculty?.name || u.Department?.name || ''), userId: u.id, __userObj: u }))
                      }}
                    />
                  </div>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อผู้ร่วมโครงการวิจัย"
                      type="text"
                      value={formData.__userObj?.Profile ? `${formData.__userObj.Profile[0].firstName || ''} ${formData.__userObj.Profile[0].lastName || ''}`.trim() : ''}
                      readOnly={true}
                    />
                  </div>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อหน่วยงาน"
                      type="text"
                      value={formData.__userObj?.Department?.name ? formData.__userObj?.Department?.name + ' ' + formData.__userObj?.Faculty?.name + ' ' + formData.__userObj?.Organization?.name : ''}
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
                      placeholder=""
                    />
                  </div>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อหน่วยงาน"
                      type="text"
                      value={formData.orgName}
                      onChange={(value) => handleInputChange("orgName", value)}
                      placeholder=""
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
            <form method="dialog">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300" onClick={resetForm}>
                ยกเลิก
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop backdrop-blur-sm">
          <button>close</button>
        </form>
      </dialog>

      <div className="space-y-4">
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
                          {p.partnerProportion}
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