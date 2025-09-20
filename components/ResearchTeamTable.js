"use client";

import { FormFieldBlock } from '@/components/ui'
import UserPicker from './UserPicker'
import { FormInput } from "@/components/ui";
import { FormSelect } from "@/components/ui";
import { FormCheckbox } from '@/components/ui';
import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })
import {
  ChevronUp,
  ChevronDown
} from "lucide-react";
// ใช้ path alias (@/) เพื่อลด relative path และทำให้แก้ไขได้ง่ายขึ้น
import { projectAPI } from '@/lib/api'
import { api } from '@/lib/api-base'
import { authAPI } from '@/lib/api'
import { stripUndefined } from '@/utils'

export default function ResearchTeamTable({ projectId, formData, handleInputChange, setFormData }) {
  const [swalProps, setSwalProps] = useState({})

  // Real data from API
  const [project, setProject] = useState(null)
  const [me, setMe] = useState(null)
  const [localPartners, setLocalPartners] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [initializedFromParent, setInitializedFromParent] = useState(false)
  // Local modal state to avoid mutating parent formData while editing modal
  const [modalIsInternal, setModalIsInternal] = useState(true)
  const [modalUserObj, setModalUserObj] = useState(undefined)
  const [modalPartnerFullName, setModalPartnerFullName] = useState('')
  const [modalOrgName, setModalOrgName] = useState('')
  const [modalPartnerType, setModalPartnerType] = useState('')
  const [modalPartnerCommentArr, setModalPartnerCommentArr] = useState([])
  const [modalPartnerProportionCustom, setModalPartnerProportionCustom] = useState('')

  // คำนวณสัดส่วนสำหรับผู้ร่วมงานภายใน มก.
  function recomputeProportions(list = []) {
    // หมายเหตุ: ฟังก์ชันนี้รับลิสต์สมาชิก team แล้วคำนวณค่า partnerProportion ใหม่
    // โดยแบ่งสัดส่วนเท่า ๆ กันเฉพาะสมาชิกที่เป็นภายใน (isInternal=true)
    // และดูแลไม่ให้รวมกันเกิน/ขาด 1.000 (แก้จุดปัดเศษที่คนสุดท้าย)
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
        partnerProportion_percentage_custom: p.participation_percentage_custom !== undefined ? String(p.participation_percentage_custom) : undefined,
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
        setSaveError(err?.message || 'Failed to load project')
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
        // do not log to console; surface via state if needed
        setSaveError(err?.message || 'Failed to load current user')
      }
    }
    loadMe()
  }, [])

  // Initialize from parent partnersLocal once (for create/edit initial fill) when no project is loaded
  useEffect(() => {
    if (
      !initializedFromParent &&
      !project &&
      Array.isArray(formData?.partnersLocal) &&
      formData.partnersLocal.length > 0
    ) {
      setLocalPartners(recomputeProportions(formData.partnersLocal))
      setInitializedFromParent(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.partnersLocal, project, initializedFromParent])

  // Keep parent formData in sync with local partners for submit
  useEffect(() => {
    if (typeof setFormData === 'function') {
      setFormData(prev => ({ ...prev, partnersLocal: localPartners }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localPartners])

  // NOTE: server sync was moved to ProjectForm submit to avoid repeated network
  // calls on every local edit. ResearchTeamTable now only manages local state
  // (localPartners) and updates parent `formData.partnersLocal` via setFormData.

  function resetForm() {
    // clear modal-local fields
    setModalIsInternal(true)
    setModalUserObj(undefined)
    setModalPartnerFullName('')
    setModalOrgName('')
    setModalPartnerType('')
    setModalPartnerCommentArr([])
    setModalPartnerProportionCustom('')
    // also clear parent temporary fields used elsewhere
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

  function handleAddPartner() {
    // Build partner object from modal-local state to avoid mutating parent formData
    const internal = modalIsInternal === true
    const u = modalUserObj || null
    const prof = u ? (Array.isArray(u.profile) ? u.profile[0] : u.profile) : null
    // display name fallback
    const full = u ? (prof ? `${prof.firstNameTH || prof.firstName || ''} ${prof.lastNameTH || prof.lastName || ''}`.trim() || u.email : u.email) : ''
    const org = u ? [u.department?.name, u.faculty?.name, u.organization?.name].filter(Boolean).join(' ') : ''

    const pcArr = Array.isArray(modalPartnerCommentArr) ? modalPartnerCommentArr : (modalPartnerCommentArr ? String(modalPartnerCommentArr).split(',').map(s => s.trim()).filter(Boolean) : [])
    const pcJoined = pcArr.join(', ')

    const partner = {
      isInternal: internal,
      userID: internal && u ? u.id : undefined,
      fullname: internal ? (full || modalPartnerFullName || '') : (modalPartnerFullName || ''),
      orgName: internal ? (org || modalOrgName || '') : (modalOrgName || ''),
      partnerType: modalPartnerType || '',
      partnerComment: pcJoined,
      partnerProportion: undefined,
      partnerProportion_percentage_custom: modalPartnerProportionCustom !== undefined && modalPartnerProportionCustom !== '' ? String(modalPartnerProportionCustom) : undefined,
      // include user info for display
      User: internal && u ? {
        email: u.email,
        profile: prof ? {
          firstNameTH: prof.firstNameTH || prof.firstName,
          lastNameTH: prof.lastNameTH || prof.lastName
        } : undefined
      } : undefined,
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
      // Note: server sync is handled by ProjectForm on submit
      return next
    })

    const dlg = document.getElementById('my_modal_2');
    if (dlg && dlg.close) dlg.close()
    resetForm()
  }

  // ย้ายลำดับขึ้น
  function moveUp(idx) {
    if (idx <= 0) return
    // work on displayRows to allow moving `me` as well
    const current = displayRows
    const arr = current.slice()
    const tmp = arr[idx - 1]
    arr[idx - 1] = arr[idx]
    arr[idx] = tmp
    // Convert any me entries into normal partner objects so they are persisted
    const newLocal = arr
      .filter(p => true)
      .map(p => p.isMe ? ({
        isInternal: true,
        userID: p.userID,
        fullname: p.fullname,
        orgName: p.orgName,
        partnerType: p.partnerType || '',
        partnerComment: p.partnerComment || '',
        partnerProportion: p.partnerProportion,
        partnerProportion_percentage_custom: p.partnerProportion_percentage_custom,
        User: p.User
      }) : p)
      .filter(p => true)

    setLocalPartners(() => recomputeProportions(newLocal))
  }

  // ย้ายลำดับลง
  function moveDown(idx) {
    // operate on displayRows
    const current = displayRows
    const arr = current.slice()
    if (idx >= arr.length - 1) return
    const tmp = arr[idx + 1]
    arr[idx + 1] = arr[idx]
    arr[idx] = tmp
    const newLocal = arr
      .map(p => p.isMe ? ({
        isInternal: true,
        userID: p.userID,
        fullname: p.fullname,
        orgName: p.orgName,
        partnerType: p.partnerType || '',
        partnerComment: p.partnerComment || '',
        partnerProportion: p.partnerProportion,
        partnerProportion_percentage_custom: p.partnerProportion_percentage_custom,
        User: p.User
      }) : p)

    setLocalPartners(() => recomputeProportions(newLocal))
  }

  function handleRemovePartner(idx) {
    // idx refers to displayRows; map to localPartners by filtering out me
    const current = displayRows
    const target = current[idx]
    // if the target is me, we can't remove the creator; ignore
    if (target && target.isMe) return
    const newLocal = current.filter((_, i) => i !== idx).filter(p => !p.isMe)
    const next = recomputeProportions(newLocal)
    setLocalPartners(next)
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
    // idx is display index; map to localPartners entry
    const current = displayRows
    const p = current[idx]
    if (!p) return
    // find index in localPartners
    const lpIdx = (localPartners || []).findIndex(x => (x.userID && x.userID === p.userID) || x.fullname === p.fullname)
    setEditingIndex(lpIdx >= 0 ? lpIdx : null)
    // Populate modal-local fields
    setModalIsInternal(!!p.isInternal)
    setModalUserObj(p.User ? { email: p.User.email, profile: p.User.profile } : (p.userID ? { id: p.userID } : undefined))
    setModalPartnerFullName(p.fullname || '')
    setModalOrgName(p.orgName || '')
    setModalPartnerType(p.partnerType || '')
    setModalPartnerCommentArr(p.partnerComment ? String(p.partnerComment).split(',').map(s => s.trim()).filter(Boolean) : [])
    setModalPartnerProportionCustom(p.partnerProportion_percentage_custom || '')
    const dlg = document.getElementById('my_modal_2');
    if (dlg && dlg.showModal) dlg.showModal()
  }

  const hasFirstAuthor = useMemo(() => (localPartners || []).some(p => ((p.partnerComment || p.comment || '')).includes('First Author')), [localPartners])
  const hasCorresponding = useMemo(() => (localPartners || []).some(p => ((p.partnerComment || p.comment || '')).includes('Corresponding Author')), [localPartners])

  // สร้างแถวผู้ใช้ปัจจุบันและคำนวณสัดส่วนรวมเพื่อใช้แสดงผล
  // display only the local partners in the table (hide the creator/me row)
  const displayRows = useMemo(() => {
    return recomputeProportions(localPartners || [])
  }, [localPartners])

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
                  checked={modalIsInternal === true}
                  onChange={() => setModalIsInternal(true)}
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
                  checked={modalIsInternal === false}
                  onChange={() => setModalIsInternal(false)}
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
              modalIsInternal === true ? (
                <>
                  <div>
                    <UserPicker
                      label="ผู้ร่วมโครงการวิจัย"
                      selectedUser={modalUserObj}
                      onSelect={(u) => {
                        setModalUserObj(u)
                        const prof = Array.isArray(u.profile) ? u.profile[0] : u.profile
                        const display = prof ? `${prof.firstName || ''} ${prof.lastName || ''}`.trim() : u.email
                        const org = [u.department?.name, u.faculty?.name, u.organization?.name].filter(Boolean).join(' ')
                        setModalPartnerFullName(display)
                        setModalOrgName(org)
                      }}
                    />
                  </div>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อผู้ร่วมโครงการวิจัย"
                      type="text"
                      value={(() => {
                        if (modalUserObj) {
                          const prof = Array.isArray(modalUserObj.profile) ? modalUserObj.profile[0] : modalUserObj.profile
                          return prof ? `${prof.firstNameTH || ''} ${prof.lastNameTH || ''}`.trim() : modalUserObj.email
                        }
                        return modalPartnerFullName || ''
                      })()}
                      readOnly={!!modalUserObj}
                      onChange={(value) => {
                        // allow manual name editing when internal but not linked to a user
                        if (!modalUserObj) setModalPartnerFullName(value)
                      }}
                    />
                  </div>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อหน่วยงาน"
                      type="text"
                      value={(() => {
                        if (modalUserObj) {
                          return [
                            modalUserObj.department?.name,
                            modalUserObj.faculty?.name,
                            modalUserObj.organization?.name
                          ].filter(Boolean).join(' ')
                        }
                        return modalOrgName || ''
                      })()}
                      readOnly={!!modalUserObj}
                      onChange={(value) => {
                        if (!modalUserObj) setModalOrgName(value)
                      }}
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
                      value={modalPartnerFullName}
                      onChange={(value) => setModalPartnerFullName(value)}
                      placeholder="กรอกชื่อ-นามสกุล"
                    />
                  </div>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อหน่วยงาน"
                      type="text"
                      value={modalOrgName}
                      onChange={(value) => setModalOrgName(value)}
                      placeholder="กรอกชื่อหน่วยงาน"
                    />
                  </div>
                </>
              )
            }
            <div>
              <FormSelect
                label="ประเภทผู้ร่วมโครงการวิจัย"
                value={modalPartnerType}
                onChange={(value) => setModalPartnerType(value)}
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

              <FormInput
                mini={false}
                label="สัดส่วนการมีส่วนร่วม (%)"
                type="number"
                step="0.001"
                min="0"
                max="100"
                value={modalPartnerProportionCustom || ''}
                onChange={(value) => {
                  // allow empty or valid number between 0-100
                  if (value === '' || value === null) {
                    setModalPartnerProportionCustom('')
                    return
                  }
                  const num = parseFloat(String(value))
                  if (Number.isNaN(num)) return
                  const clamped = Math.max(0, Math.min(100, num))
                  setModalPartnerProportionCustom(String(clamped))
                }}
                placeholder="0%"
              />
            </div>
            <div>
              <FormCheckbox
                label="หมายเหตุ"
                inline={true}
                value={Array.isArray(modalPartnerCommentArr) ? modalPartnerCommentArr : (modalPartnerCommentArr ? String(modalPartnerCommentArr).split(',').map(s => s.trim()).filter(Boolean) : [])}
                onChange={(arr) => setModalPartnerCommentArr(arr)}
                className="max-w-lg"
                options={[
                  ...(!hasFirstAuthor || (Array.isArray(modalPartnerCommentArr) && modalPartnerCommentArr.includes('First Author')) ? [{ value: 'First Author', label: 'First Author' }] : []),
                  ...(!hasCorresponding || (Array.isArray(modalPartnerCommentArr) && modalPartnerCommentArr.includes('Corresponding Author')) ? [{ value: 'Corresponding Author', label: 'Corresponding Author' }] : []),
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
          {/*
            แก้บั๊ก: ปุ่มเปิด modal อยู่ภายในฟอร์มหลัก ถ้าไม่กำหนด type จะเป็นค่า default "submit"
            ทำให้เมื่อกดแล้วฟอร์มใหญ่ถูก submit ไปด้วย --> กำหนด type="button" เพื่อป้องกัน
          */}
          <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700" onClick={() => {
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
                    สัดส่วนการมีส่วนร่วม (%)
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
                        {(displayRows.length >= 2) && (
                          <div className='text-gray-700 flex items-center gap-2 ml-3'>
                            <button
                              type="button"
                              onClick={() => moveUp(i)}
                              disabled={i === 0}
                              className={`px-2 py-1 rounded bg-gray-100 text-xs ${i === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                            >
                              <ChevronUp />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveDown(i)}
                              disabled={i === displayRows.length - 1}
                              className={`px-2 py-1 rounded bg-gray-100 text-xs ${i === displayRows.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                            >
                              <ChevronDown />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {/* แสดงชื่อเต็มจาก profile (ไทย) เป็นหลัก */}
                          {(() => {
                            if (p.fullname) return p.fullname
                            const prof = p.User?.profile
                            if (prof && (prof.firstNameTH || prof.lastNameTH)) {
                              return `${prof.firstNameTH || ''} ${prof.lastNameTH || ''}`.trim()
                            }
                            return p.User?.email || '-'
                          })()}
                        </div>
                        {p.User?.email && (
                          <div className="text-sm text-gray-500">
                            {p.User.email}
                          </div>
                        )}
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
                      {p.partnerProportion_percentage_custom && (
                        <div className="text-sm text-gray-900">
                          {(parseFloat(p.partnerProportion_percentage_custom))}%
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {p.partnerProportion && (
                        <div className="text-sm text-gray-900">
                          {(Number(p.partnerProportion).toFixed(1))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {(displayRows.length >= 2) && (
                        <div className="flex items-center gap-3 justify-end">
                          <button type="button" onClick={() => handleEditPartner(i)} className="text-blue-600 hover:text-blue-900">
                            แก้ไข
                          </button>
                          <button type="button" onClick={() => handleRemovePartner(i)} className="text-red-600 hover:text-red-900">
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
