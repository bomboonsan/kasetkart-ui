"use client";

import { FormFieldBlock } from '@/components/ui'
import UserPicker from './UserPicker'
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { FormCheckbox } from '@/components/ui';
import { useEffect, useMemo, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })
import {
  ChevronUp,
  ChevronDown
} from "lucide-react";
// ใช้ path alias (@/) เพื่อลด relative path และทำให้แก้ไขได้ง่ายขึ้น
import { projectAPI, fundingAPI } from '@/lib/api'
import { api } from '@/lib/api-base'
import { authAPI } from '@/lib/api'
import { stripUndefined } from '@/utils'

// ใช้ได้ทั้งหน้าโครงการวิจัย (project) และหน้า Funding (funding)
// แนะนำให้ส่ง fundingId เมื่อใช้ในหน้า FundingForm
export default function FundTeamTable({ projectId, fundingId, formData, handleInputChange, setFormData }) {
  const [swalProps, setSwalProps] = useState({})

  // Real data from API
  // สำหรับหน้า Funding จะใช้ state นี้แทน project
  const [funding, setFunding] = useState(null)
  // รองรับการใช้งานเดิมกับ Project (เผื่อถูกใช้ที่อื่น)
  const [project, setProject] = useState(null)
  const [me, setMe] = useState(null)
  const [localPartners, setLocalPartners] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const isSyncingRef = useRef(false)

  // Local modal state (prevent leaking into parent formData)
  const [modalIsInternal, setModalIsInternal] = useState(true)
  const [modalUserObj, setModalUserObj] = useState(undefined)
  const [modalPartnerFullName, setModalPartnerFullName] = useState('')
  const [modalOrgName, setModalOrgName] = useState('')
  const [modalPartnerType, setModalPartnerType] = useState('')
  const [modalPartnerCommentArr, setModalPartnerCommentArr] = useState([])
  const [modalPartnerProportionCustom, setModalPartnerProportionCustom] = useState('')

  // Ensure every partner has an integer order starting from 1, sorted ascending
  function ensureSequentialOrder(list = []) {
    const arr = (list || []).slice().sort((a, b) => {
      const ao = a?.order ?? Number.POSITIVE_INFINITY
      const bo = b?.order ?? Number.POSITIVE_INFINITY
      if (ao === bo) return 0
      return ao - bo
    })
    return arr.map((p, idx) => ({ ...p, order: idx + 1 }))
  }


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
    // ดึงรายชื่อผู้ร่วมจาก Funding (ถ้ามี)
    if (!funding && !project) return

    let partners = []
    // กรณี Funding (priority)
    if (funding) {
      // funding อาจอยู่ในรูป { data: { attributes: { funding_partners }}} หรือแบบ flat
      if (funding.data && funding.data.funding_partners) {
        partners = funding.data.funding_partners || []
      } else if (funding.funding_partners) {
        partners = funding.funding_partners.data || funding.funding_partners
      }
    }

    console.log('Loaded partners from funding/project:', partners)

    // Normalize Strapi partner entries to the UI shape (ใช้โครงเดียวกัน)
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
        partnerProportion_percentage_custom: p.partnerProportion_percentage_custom !== undefined && p.partnerProportion_percentage_custom !== null
          ? String(p.partnerProportion_percentage_custom)
          : undefined,
        order: p.order !== undefined ? parseInt(p.order) : (item?.order !== undefined ? parseInt(item.order) : undefined),
      }
    })

    if (norm.length > 0) setLocalPartners(recomputeProportions(ensureSequentialOrder(norm)))
  }, [funding, project])

  // ดึงรายชื่อผู้ร่วมโดยตรงจาก /funding-partners ด้วย fundingId (กรณีมีรหัสชัดเจน)
  useEffect(() => {
    async function loadFundingPartners() {
      if (!fundingId) return
      try {
        const resp = await api.get(`/funding-partners?populate=users_permissions_user&filters[project_fundings][documentId][$eq]=${fundingId}`)
        const items = resp?.data || resp || []
        const partnerTypeLabels = {
          1: 'หัวหน้าโครงการ',
          2: 'ที่ปรึกษาโครงการ',
          3: 'ผู้ประสานงาน',
          4: 'นักวิจัยร่วม',
          99: 'อื่นๆ',
        }
        const norm = (items || []).map(item => {
          const p = item?.attributes ? item.attributes : item
          return {
            id: item?.id || p.id,
            fullname: p.fullname || p.name || '',
            orgName: p.orgName || p.org || '',
            partnerType: partnerTypeLabels[p.participant_type] || p.partnerType || '',
            isInternal: !!p.users_permissions_user || !!p.userID || false,
            userID: p.users_permissions_user?.data?.id || p.users_permissions_user || p.userID || undefined,
            partnerComment: (p.isFirstAuthor ? 'First Author' : '') + (p.isCoreespondingAuthor ? ' Corresponding Author' : ''),
            partnerProportion: p.participation_percentage !== undefined ? String(p.participation_percentage) : undefined,
            partnerProportion_percentage_custom: p.partnerProportion_percentage_custom !== undefined && p.partnerProportion_percentage_custom !== null
              ? String(p.partnerProportion_percentage_custom)
              : undefined,
            order: p.order !== undefined ? parseInt(p.order) : (item?.order !== undefined ? parseInt(item.order) : undefined),
          }
        })
        setLocalPartners(recomputeProportions(ensureSequentialOrder(norm)))
      } catch (err) {
        setSaveError(err?.message || 'Failed to load funding partners')
      }
    }
    loadFundingPartners()
  }, [fundingId])

  // Fetch funding data when fundingId provided (ใช้กับ FundingForm)
  useEffect(() => {
    async function loadFunding() {
      if (!fundingId) return
      try {
        const resp = await fundingAPI.getFunding(fundingId)
        setFunding(resp)
      } catch (err) {
        setSaveError(err?.message || 'Failed to load funding')
      }
    }
    loadFunding()
  }, [fundingId])

  // รองรับการใช้งานเดิม: ถ้า projectId ถูกส่งมา ให้โหลดข้อมูลโครงการวิจัย
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

  // ถ้ามี partnersLocal ถูกส่งมาจาก Parent (`formData.partnersLocal`) ให้ใช้ค่านั้นเป็นค่าเริ่มต้น
  // (ใช้เมื่อไม่มี `project` โหลดมาจาก API เช่นในกรณี Create หรือเมื่อ Edit ใช้ parent เป็นแหล่งข้อมูล)
  // เพิ่ม effect นี้เพื่อให้ EditResearchForm ที่ตั้งค่า `formData.partnersLocal` สามารถทำให้ตารางแสดงได้ทันที
  useEffect(() => {
    if (!funding && !project && Array.isArray(formData?.partnersLocal) && formData.partnersLocal.length > 0) {
      // ใช้ recomputeProportions เพื่อคำนวณสัดส่วนให้ถูกต้องก่อนแสดง
      setLocalPartners(recomputeProportions(formData.partnersLocal))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.partnersLocal, funding, project])

  // Keep parent formData in sync with local partners (so CreateResearchForm can read them)
  useEffect(() => {
    if (typeof setFormData === 'function') {
      setFormData(prev => ({ ...prev, partnersLocal: localPartners }))
    }
  }, [localPartners, setFormData])

  function syncToServer(partnersList) {
    // ปิดการซิงก์ขึ้นเซิร์ฟเวอร์ตามคำขอ เพื่อให้คำนวณสัดส่วนจาก UI เท่านั้น
    // เหตุผล: เมื่อเพิ่ม/สลับสมาชิก ต้องคำนวณสัดส่วนใหม่ของทุกคนบน UI โดยไม่ถูกรบกวนจากการเรียก API
    return
  }

  function resetForm() {
    // clear modal-local state and parent temps
    setModalIsInternal(true)
    setModalUserObj(undefined)
    setModalPartnerFullName('')
    setModalOrgName('')
    setModalPartnerType('')
    setModalPartnerCommentArr([])
    setModalPartnerProportionCustom('')
    setFormData(prev => ({
      ...prev,
      __userObj: undefined,
      partnerFullName: '',
      orgName: '',
      userId: undefined,
      partnerType: '',
      partnerComment: '',
      partnerProportion_percentage_custom: undefined,
    }))
    setEditingIndex(null)
  }

  // helper to create a stable key for duplicate detection
  const makeKey = (p) => {
    let uid = p?.userID
    if (uid && typeof uid === 'object') uid = uid.id || uid.data?.id
    uid = uid !== undefined && uid !== null ? String(uid) : undefined
    const name = String(p?.fullname || '').trim().toLowerCase()
    const orgName = String(p?.orgName || '').trim().toLowerCase()
    return uid ? `u:${uid}` : `n:${name}|${orgName}`
  }

  function handleAddPartner() {
    // prevent action while a sync is in progress
    if (saving || isSyncingRef.current) {
      setSwalProps({ show: true, icon: 'warning', title: 'กำลังบันทึกข้อมูลอยู่', text: 'กรุณารอให้การบันทึกเสร็จก่อน', timer: 1500, showConfirmButton: false })
      return
    }

    const internal = modalIsInternal === true
    const u = modalUserObj || null
    const prof = u ? (Array.isArray(u.profile) ? u.profile[0] : u.profile) : null
    // ใช้ชื่อไทยก่อน ถ้าไม่มีค่อย fallback อังกฤษ / อีเมล
    const full = u ? (
      prof ? `${prof.firstNameTH || prof.firstName || ''} ${prof.lastNameTH || prof.lastName || ''}`.trim() || u.email : u.email
    ) : ''
    const org = u ? [u.department?.name, u.faculty?.name, u.organization?.name].filter(Boolean).join(' ') : ''

    const pcArr = Array.isArray(modalPartnerCommentArr)
      ? modalPartnerCommentArr
      : (modalPartnerCommentArr ? String(modalPartnerCommentArr).split(',').map(s => s.trim()).filter(Boolean) : [])
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
      // กำหนด order ต่อท้าย
      order: (() => {
        const maxOrder = Math.max(0, ...((localPartners || []).map(p => parseInt(p.order) || 0)))
        return maxOrder + 1
      })(),
      // แนบข้อมูลผู้ใช้เพิ่มเติมเพื่อใช้แสดงชื่อ (ลดการเรียก API ซ้ำ)
      User: internal && u ? {
        email: u.email,
        profile: prof ? {
          firstNameTH: prof.firstNameTH || prof.firstName,
          lastNameTH: prof.lastNameTH || prof.lastName
        } : undefined
      } : undefined,
    }

    // Duplicate prevention: do not add if key exists (allow editing to keep its own key)
    {
      const base = Array.isArray(localPartners) ? localPartners.slice() : []
      const keys = base.map(makeKey)
      const newKey = makeKey(partner)

      if (editingIndex !== null && editingIndex >= 0 && editingIndex < base.length) {
        const existsIdx = keys.findIndex((k, i) => i !== editingIndex && k === newKey)
        if (existsIdx !== -1) {
          setSwalProps({ show: true, icon: 'error', title: 'มีรายชื่อซ้ำ', text: 'ไม่สามารถเพิ่มบุคคลเดิมซ้ำในรายการได้', timer: 1800, showConfirmButton: false })
        } else {
          const updated = base.slice()
          updated[editingIndex] = { ...updated[editingIndex], ...partner }
          const next = recomputeProportions(ensureSequentialOrder(updated))
          setLocalPartners(next)
          if (typeof setFormData === 'function') setFormData(prev => ({ ...prev, partnersLocal: next }))
          syncToServer(next)
        }
      } else {
        if (keys.includes(newKey)) {
          setSwalProps({ show: true, icon: 'error', title: 'มีรายชื่อซ้ำ', text: 'บุคคลนี้ถูกเพิ่มแล้ว', timer: 1800, showConfirmButton: false })
        } else {
          const next = recomputeProportions(ensureSequentialOrder([...(base || []), partner]))
          setLocalPartners(next)
          if (typeof setFormData === 'function') setFormData(prev => ({ ...prev, partnersLocal: next }))
          syncToServer(next)
        }
      }
    }

    const dlg = document.getElementById('my_modal_2');
    if (dlg && dlg.close) dlg.close()
    resetForm()
  }

  // ย้ายลำดับขึ้น
  function moveUp(idx) {
    // ทำงานบนรายการที่เรียงตาม order แล้ว จากนั้นปรับ order ใหม่
    if (idx <= 0) return
    const arr = displayRows.slice()
      ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
    const renumbered = arr.map((p, i) => ({ ...p, order: i + 1 }))
    const next = recomputeProportions(renumbered)
    setLocalPartners(next)
    if (typeof setFormData === 'function') setFormData(prev => ({ ...prev, partnersLocal: next }))
    syncToServer(next)
  }

  // ย้ายลำดับลง
  function moveDown(idx) {
    const arr = displayRows.slice()
    if (idx >= arr.length - 1) return
      ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
    const renumbered = arr.map((p, i) => ({ ...p, order: i + 1 }))
    const next = recomputeProportions(renumbered)
    setLocalPartners(next)
    if (typeof setFormData === 'function') setFormData(prev => ({ ...prev, partnersLocal: next }))
    syncToServer(next)
  }

  function handleRemovePartner(idx) {
    // idx refers to displayRows; map to localPartners by filtering out me
    const current = displayRows
    const target = current[idx]
    // if the target is me, we can't remove the creator; ignore
    if (target && target.isMe) return
    const newLocal = current.filter((_, i) => i !== idx).filter(p => !p.isMe)
    const next = recomputeProportions(ensureSequentialOrder(newLocal))
    setLocalPartners(next)
    if (typeof setFormData === 'function') setFormData(prev => ({ ...prev, partnersLocal: next }))
    syncToServer(next)
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
    // populate modal-local state instead of parent formData to avoid leaks
    setModalIsInternal(!!p.isInternal)
    setModalUserObj(p.User ? { email: p.User.email, profile: p.User.profile, id: p.userID } : (p.userID ? { id: p.userID } : undefined))
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
    // แสดงผลโดยเรียงตาม order เสมอ แล้วค่อยคำนวณสัดส่วนใหม่
    const withOrder = ensureSequentialOrder(localPartners || [])
    return recomputeProportions(withOrder)
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
                          return prof ? `${prof.firstNameTH || ''} ${prof.lastNameTH || ''}`.trim() : formData.__userObj.email
                        }
                        return formData.partnerFullName || ''
                      })()}
                      readOnly={!!formData.__userObj}
                      onChange={(value) => {
                        // allow manual name editing when internal but not linked to a user
                        if (!formData.__userObj) handleInputChange("partnerFullName", value)
                      }}
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
                      readOnly={!!formData.__userObj}
                      onChange={(value) => {
                        if (!formData.__userObj) handleInputChange("orgName", value)
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

              <FormInput
                mini={false}
                label="สัดส่วนการมีส่วนร่วม (%)"
                type="number"
                step="0.001"
                min="0"
                max="100"
                value={formData.partnerProportion_percentage_custom || ''}
                onChange={(value) => {
                  // allow empty or valid number between 0-100
                  if (value === '' || value === null) {
                    handleInputChange('partnerProportion_percentage_custom', '')
                    return
                  }
                  const num = parseFloat(String(value))
                  if (Number.isNaN(num)) return
                  const clamped = Math.max(0, Math.min(100, num))
                  // store as string to match other partnerProportion fields used elsewhere
                  handleInputChange('partnerProportion_percentage_custom', String(clamped))
                }}
                placeholder="0%"
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
        {!fundingId && (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
            เมื่อบันทึกแบบฟอร์ม ระบบจะบันทึกรายชื่อผู้ร่วมโดยอัตโนมัติ (ต้องมีรหัสคำขอทุน)
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
                          {p.order ?? (i + 1)}
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
