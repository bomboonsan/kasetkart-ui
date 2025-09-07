"use client"

import { useEffect, useState } from 'react'
import FormSection from './FormSection'
import FormFieldBlock from './FormFieldBlock'
import FormField from './FormField'
import UserPicker from './UserPicker'
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormTextarea from './FormTextarea'
import FormDateSelect from './FormDateSelect'
import FormSelect from "./FormSelect";
import FileUploadField from './FileUploadField'
import ResearchTeamTable from './ResearchTeamTable'
import Button from './Button'
import Link from 'next/link'
import SweetAlert2 from 'react-sweetalert2'
import { projectAPI, api, authAPI, valueFromAPI } from '../lib/api'
import { formatDateDMY } from '../lib/helper'
import { use } from 'react'
import useSWR, { mutate } from 'swr'

export default function CreateResearchForm() {

  ////////////////////////////////////////////////////////
  // Setup form fields
  ////////////////////////////////////////////////////////
  const [icTypesLists, setIcTypesLists] = useState([])
  const [impactLists, setImpactLists] = useState([])
  const [sdgLists, setSdgLists] = useState([])

  const { data: icTypesRes, error: swrError } = useSWR('icTypes', () => valueFromAPI.getIcTypes())
  const { data: impactRes } = useSWR('impacts', () => valueFromAPI.getImpacts())
  const { data: sdgRes } = useSWR('sdgs', () => valueFromAPI.getSDGs())

  useEffect(() => {
    if (icTypesRes) {
      setIcTypesLists(icTypesRes.data || [])
    }
  }, [icTypesRes])

  useEffect(() => {
    if (impactRes) {
      setImpactLists(impactRes.data || [])
    }
  }, [impactRes])

  useEffect(() => {
    if (sdgRes) {
      setSdgLists(sdgRes.data || [])
    }
  }, [sdgRes])
  // console.log('icTypesLists', icTypesLists)
  // console.log('impactLists', impactLists)
  // console.log('sdgLists', sdgLists)
  ////////////////////////////////////////////////////////
  // End setup form fields
  ////////////////////////////////////////////////////////



  const [swalProps, setSwalProps] = useState({})

  // Align form keys to Project model in schema.prisma
  const [formData, setFormData] = useState({
    fiscalYear: "2568", // ปีงบประมาณ (Int)
    projectType: 0, // ประเภทโครงการ (Int)
    projectMode: 0, // ลักษณะโครงการวิจัย (Int)
    subProjectCount: 0, // จำนวนโครงการย่อย (Int)
    nameTH: "", // ชื่อโครงการ (ภาษาไทย) (String) - fixed field name
    nameEN: "", // ชื่อโครงการ (ภาษาอังกฤษ) (String)

    isEnvironmentallySustainable: 0, // เกี่ยวข้องกับสิ่งแวดล้อมและความยั่งยืน (Int) 0=เกี่ยวข้อง, 1=ไม่เกี่ยวข้อง
    durationStart: "", // ระยะเวลาการทำวิจัย (Date)
    durationEnd: "", // ระยะเวลาการทำวิจัย (Date)

    researchKind: "", // ประเภทงานวิจัย (Int) Value จาก select
    fundType: "", // ประเภทแหล่งทุน (Int) Value จาก select
    fundSubType: "", // ประเภทแหล่งทุน (Int) Value จาก select
    fundName: "", // ชื่อแหล่งทุน (String)
    budget: "", // งบวิจัย (Int)
    keywords: "", // คำสำคัญ (คั่นระหว่างคำด้วยเครื่องหมาย “;” เช่น ข้าว; พืช; อาหาร) (String)
    icTypes: "", // IC Types // Relationship (Int)
    impact: "", // Impact // Relationship (Int)
    sdg: "", // SDG // Relationship (Int)

    // ProjectPartner-like fields for the team section
    isInternal: undefined, // ProjectPartner.isInternal (Boolean)
    fullname: "", // ProjectPartner.fullname (String) - legacy
    partnerFullName: "", // ใช้ร่วมกับ ResearchTeamTable ให้เติมจาก UserPicker อัตโนมัติ
    orgName: "", // ProjectPartner.orgName (String)
    partnerType: "", // ProjectPartner.partnerType (String)
    partnerComment: "", // ProjectPartner.partnerComment (String)
    partnerProportion: "", // ProjectPartner.partnerProportion (Int)
    attachments: [],
  });
  

  const [orgOptions, setOrgOptions] = useState([])
  const [deptOptions, setDeptOptions] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [meData, setMeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const me = await authAPI.me()
      setMeData(me)
      
      // Auto-add current user เป็น partner หัวหน้าโครงการ
      if (me && !formData.partnersLocal) {
        const mePartner = {
          isInternal: true,
          userID: me.id,
          fullname: (me.profile ? `${me.profile.firstNameTH || me.profile.firstName || ''} ${me.profile.lastNameTH || me.profile.lastName || ''}` : 
                    me.Profile ? `${me.Profile.firstNameTH || me.Profile.firstName || ''} ${me.Profile.lastNameTH || me.Profile.lastName || ''}` : 
                    me.email) || '',
          orgName: me.faculty?.name || me.department?.name || me.organization?.name || '',
          partnerType: 'หัวหน้าโครงการ',
          partnerComment: '',
          partnerProportion: '1.00',
        }
        setFormData(prev => ({ ...prev, partnersLocal: [mePartner] }))
      }
    }
    fetchData()
  }, [])
  console.log('meData', meData)

  // console.log('formData', formData)

  const [subFundType, setSubFundType] = useState([])
  const subFundType1 = [
    { value: '', label: 'เลือกข้อมูล' },
    { value: '19', label: 'องค์กรรัฐ' },
    { value: '20', label: 'องค์กรอิสระและเอกชน' },
    { value: '21', label: 'แหล่งทุนต่างประเทศ' },
    { value: '23', label: 'รัฐวิสาหกิจ' },
  ]
  const subFundType2 = [
    { value: '', label: 'เลือกข้อมูล' },
    { value: '17', label: 'เงินรายได้มหาวิทยาลัย' },
    { value: '18', label: 'เงินรายได้ส่วนงาน' },
  ]
  const subFundType3 = [
    { value: '', label: 'เลือกข้อมูล' },
    { value: '22', label: 'เงินทุนส่วนตัว' },
  ]
  const subFundType4 = [
    { value: '', label: 'เลือกข้อมูล' },
    { value: '14', label: 'เงินอุดหนุนรัฐบาลและเงินอุดหนุนอื่นที่รัฐบาลจัดสรรให้' },
    { value: '15', label: 'เงินงบประมาณมหาวิทยาลัย' },
  ]

  
  useEffect(() => {
    setSubFundType([])
    if (formData.fundType === '12') {
      setSubFundType(subFundType1)
    } else if (formData.fundType === '11') {
      setSubFundType(subFundType2)
    } else if (formData.fundType === '13') {
      setSubFundType(subFundType3)
    } else if (formData.fundType === '10') {
      setSubFundType(subFundType4)
    } else {
      setSubFundType([])
    }
  }, [formData.fundType])


  useEffect(() => {
    // Mock data แทน API calls
    const mockOrgs = [
      { id: 1, name: 'มหาวิทยาลัยเกษตรศาสตร์' },
      { id: 2, name: 'จุฬาลงกรณ์มหาวิทยาลัย' }
    ]
    const mockDepts = [
      { id: 1, name: 'ภาควิชาเศรษฐศาสตร์' },
      { id: 2, name: 'ภาควิชาการบัญชี' }
    ]
    
    const orgOpts = mockOrgs.map(o => ({ value: o.id, label: o.name }))
    const deptOpts = mockDepts.map(d => ({ value: d.id, label: d.name }))
    setOrgOptions(orgOpts)
    setDeptOptions(deptOpts)
  }, [])  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // Basic client-side validation to avoid native form freeze
      const required = [
        ['projectType', 'ประเภทโครงการ'],
        ['projectMode', 'ลักษณะโครงการวิจัย'],
        ['nameTH', 'ชื่อโครงการ (ไทย)'],
        ['nameEN', 'ชื่อโครงการ (อังกฤษ)'],
        ['durationStart', 'วันที่เริ่มต้น'],
        ['durationEnd', 'วันที่สิ้นสุด'],
        ['budget', 'งบวิจัย'],
        ['keywords', 'คำสำคัญ'],
        // NOTE: icTypes, impact, sdg removed - not in project-research schema
      ]
      const missing = required.filter(([k]) => !formData[k] || String(formData[k]).trim() === '')
      if (missing.length > 0) {
        const msg = `กรุณากรอก: ${missing.map(([, label]) => label).join(', ')}`
        setError(msg)
        setSwalProps({ show: true, icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: msg, timer: 2400 })
        setSubmitting(false)
        return
      }
      // Load current authenticated user to be project leader
      let meObj = null
      try {
        const meResp = await authAPI.me()
        meObj = meResp?.data || meResp || null
      } catch (e) {
        console.warn('Unable to fetch current user; proceeding without explicit leader user', e)
      }

      // สร้าง partner สำหรับผู้กรอกฟอร์ม (current user) เป็น หัวหน้าโครงการ
      const mePartner = meObj ? {
        isInternal: true,
        userId: meObj.id || meObj?.data?.id,
        fullname: (meObj.profile ? `${meObj.profile.firstNameTH || meObj.profile.firstName || ''} ${meObj.profile.lastNameTH || meObj.profile.lastName || ''}` : 
                  meObj.Profile ? `${meObj.Profile.firstNameTH || meObj.Profile.firstName || ''} ${meObj.Profile.lastNameTH || meObj.Profile.lastName || ''}` : 
                  meObj.email) || '',
        orgName: meObj.faculty?.name || meObj.department?.name || meObj.organization?.name || '',
        partnerType: 'หัวหน้าโครงการ',
        partnerComment: '',
        partnerProportion: undefined,
      } : null      

      // prefer partners provided by ResearchTeamTable if present, otherwise construct from me
      let partnersArray = []
      if (Array.isArray(formData.partnersLocal) && formData.partnersLocal.length > 0) {
        // ใช้ partners จาก ResearchTeamTable
        partnersArray = formData.partnersLocal.map(p => ({ ...p }))
        // ถ้าไม่มี current user ใน partners แล้วให้เพิ่มเข้าไป
        const hasMe = partnersArray.some(p => p.userId === meObj?.id || p.userID === meObj?.id)
        if (mePartner && !hasMe) {
          partnersArray.unshift(mePartner) // เพิ่มที่ตำแหน่งแรก
        }
      } else {
        // ถ้าไม่มี partners จาก ResearchTeamTable ให้ใช้แค่ current user
        if (mePartner) partnersArray.push(mePartner)
      }

      // Map to API payload matching Strapi content-type `project-research`
      // Only include fields that exist in the schema
      const payload = {
        fiscalYear: parseInt(formData.fiscalYear) || 2568,
        projectType: formData.projectType || 0,
        projectMode: formData.projectMode || 0,
        subProjectCount: formData.subProjectCount ? parseInt(formData.subProjectCount) : undefined,
        nameTE: formData.nameTE || undefined,
        nameEN: formData.nameEN || undefined,
        durationStart: formData.durationStart || undefined,
        durationEnd: formData.durationEnd || undefined,
        fundType: formData.fundType ? parseInt(formData.fundType) : undefined,
        fundSubType: formData.fundSubType ? parseInt(formData.fundSubType) : undefined,
        fundName: formData.fundName || undefined,
        budget: formData.budget ? String(formData.budget) : undefined,
        keywords: formData.keywords || undefined,
        // Include attachments if any files were uploaded
        attachments: Array.isArray(formData.attachments) && formData.attachments.length > 0 
          ? formData.attachments.map(att => att.id || att.documentId).filter(Boolean) 
          : undefined,
      }      // Create project on backend
      const resp = await projectAPI.createProject(payload)
      // parse created id from Strapi response shape
      const createdProjectId = resp?.data?.id || resp?.id || (resp?.data && resp.data.documentId) || null

      if (!createdProjectId) {
        throw new Error('ไม่สามารถสร้างโครงการได้ (no id returned)')
      }

      // Helper: map partnerType label -> integer for backend `participant_type`
      const partnerTypeMap = {
        'หัวหน้าโครงการ': 1,
        'ที่ปรึกษาโครงการ': 2,
        'ผู้ประสานงาน': 3,
        'นักวิจัยร่วม': 4,
        'อื่นๆ': 99,
      }

      // Create project-partner records for each partner
      for (const p of partnersArray) {
        // Normalize keys that ResearchTeamTable may use (userID vs userId, partnerComment vs comment)
        const userIdField = p.userId || p.userID || p.User?.id || undefined
        const commentField = p.partnerComment || p.comment || ''
        const fullnameField = p.fullname || p.partnerFullName || ''
        const orgField = p.orgName || p.org || p.orgFullName || ''
        const proportionField = p.partnerProportion !== undefined && p.partnerProportion !== null ? parseFloat(p.partnerProportion) : undefined

        const partnerData = {
          fullname: fullnameField || undefined,
          orgName: orgField || undefined,
          participation_percentage: proportionField,
          participant_type: partnerTypeMap[p.partnerType] || undefined,
          isFirstAuthor: String(commentField).includes('First Author') || false,
          isCoreespondingAuthor: String(commentField).includes('Corresponding Author') || false,
          users_permissions_user: userIdField,
          project_researches: [createdProjectId]
        }

        // Remove undefined keys to keep payload clean
        Object.keys(partnerData).forEach(k => partnerData[k] === undefined && delete partnerData[k])

        try {
          await api.post('/project-partners', { data: partnerData })
        } catch (err) {
          // don't fail whole submission for partner creation; collect/log instead
          console.error('Failed creating partner', partnerData, err)
        }
      }

      setSwalProps({ show: true, icon: 'success', title: 'สร้างโครงการสำเร็จ', timer: 1600, showConfirmButton: false })
    } catch (err) {
      setError(err.message || 'บันทึกโครงการไม่สำเร็จ')
      setSwalProps({ show: true, icon: 'error', title: 'บันทึกโครงการไม่สำเร็จ', text: err.message || '', timer: 2200 })
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      <form noValidate onSubmit={handleSubmit} className="p-6 space-y-8">
        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
        )}
        {/* Basic Information */}
        <FormSection>
          <FormFieldBlock>
            <FormInput
              mini={true}
              label="ปีงบประมาณ"
              type="number"
              value={formData.fiscalYear}
              onChange={(value) => handleInputChange("fiscalYear", parseInt(value))}
              placeholder="2568"
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormRadio
              inline={false}
              required
              label="ประเภทโครงการ"
              options={[
                { label: "โครงการวิจัย", value: 0 },
                {
                  label: "โครงการพัฒนาวิชาการประเภทงานวิจัย",
                  value: 1,
                },
              ]}
              value={formData.projectType}
              onChange={(value) => handleInputChange("projectType", parseInt(value))}
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormRadio
              inline={true}
              required
              label="ลักษณะโครงการวิจัย"
              options={[
                { label: "โครงการวิจัยเดี่ยว", value: 0 },
                {
                  label: "แผนงานวิจัย หรือชุดโครงการวิจัย",
                  value: 1,
                },
              ]}
              value={formData.projectMode}
              onChange={(value) => handleInputChange("projectMode", parseInt(value))}
            />
          </FormFieldBlock>

          <FormFieldBlock className="grid grid-cols-1 gap-6">
            <FormInput
              mini={true}
              label="จำนวนโครงการย่อย"
              type="number"
              value={formData.projectMode !== 1 ? 0 :formData.subProjectCount}
              onChange={(value) => handleInputChange("subProjectCount", parseInt(value))}
              placeholder="0"
              disabled={formData.projectMode === 1 ? false : true}
              className={`border border-gray-300 rounded-md p-2 ${formData.projectMode === 1 ? '' : 'bg-gray-100 cursor-not-allowed'}`}
            />
          </FormFieldBlock>

          <FormFieldBlock className="grid grid-cols-1 gap-6">
            <FormTextarea
              label="ชื่อแผนงานวิจัยหรือชุดโครงการวิจัย/โครงการวิจัย (ไทย)"
              value={formData.nameTH}
              onChange={(value) => handleInputChange("nameTH", value)}
              placeholder=""
              required
            />
          </FormFieldBlock>

          <FormFieldBlock className="grid grid-cols-1 gap-6">
            <FormTextarea
              label="ชื่อแผนงานวิจัยหรือชุดโครงการวิจัย/โครงการวิจัย (อังกฤษ)"
              value={formData.nameEN}
              onChange={(value) => handleInputChange("nameEN", value)}
              placeholder=""
              required
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <div className="flex items-center gap-10">
              <label className="flex items-center gap-3 text-zinc-700">
                <input
                  type="radio"
                  value="true"
                  checked={formData.isEnvironmentallySustainable === 1}
                  onChange={() => handleInputChange("isEnvironmentallySustainable", 1)}
                  className={`
                    text-zinc-700
                    px-3 py-2 border border-gray-300 rounded-md
                    placeholder-gray-400 focus:outline-none focus:ring-2
                    focus:ring-blue-500 focus:border-blue-500
                    transition-colors duration-200
                `}
                />
                <strong>เกี่ยวข้อง</strong> กับสิ่งแวดล้อมและความยั่งยืน
              </label>
              <label className="flex items-center gap-3 text-zinc-700">
                <input
                  type="radio"
                  value="false"
                  checked={formData.isEnvironmentallySustainable === 0}
                  onChange={() => handleInputChange("isEnvironmentallySustainable", 0)}
                  className={`
                    text-zinc-700
                    px-3 py-2 border border-gray-300 rounded-md
                    placeholder-gray-400 focus:outline-none focus:ring-2
                    focus:ring-blue-500 focus:border-blue-500
                    transition-colors duration-200
                `}
                />
                <strong>ไม่เกี่ยวข้อง</strong> กับสิ่งแวดล้อมและความยั่งยืน
              </label>
            </div>
          </FormFieldBlock>
          <FormFieldBlock>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-zinc-700">
                  ระยะเวลาการทำวิจัย{" "}
                  <span className="text-blue-700">(ปี พ.ศ. 4 หลัก)</span>
                  <span className="text-red-500 ml-1">*</span>
                </p>
              </div>
              <div>
                <FormDateSelect
                  title="เริ่มต้น"
                  value={formData.durationStart}
                  onChange={(value) => handleInputChange("durationStart", value)}
                />
              </div>
              <div>
                <FormDateSelect
                  title="สิ้นสุด"
                  value={formData.durationEnd}
                  onChange={(value) => handleInputChange("durationEnd", value)}
                />
              </div>
            </div>
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="หน่วยงานหลักที่รับผิดชอบโครงการวิจัย (หน่วยงานที่ขอทุน)"
              required
              className='bg-gray-100 cursor-not-allowed'
              value={`${meData?.department?.name || ''}  ${meData?.faculty?.name} ${meData?.organization?.name || ''}`}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormSelect
              label="ประเภทงานวิจัย"
              required
              value={formData.researchKind}
              onChange={(value) => handleInputChange("researchKind", value)}
              className="max-w-lg"
              options={[
                { value: '', label: "เลือกประเภทงานวิจัย" },
                { value: 'การวิจัยพื้นฐานหรือการวิจัยบริสุทธิ์', label: 'การวิจัยพื้นฐานหรือการวิจัยบริสุทธิ์' },
                { value: 'การวิจัยประยุกต์', label: 'การวิจัยประยุกต์' },
                { value: 'การวิจัยเชิงปฏิบัติ', label: 'การวิจัยเชิงปฏิบัติ' },
                { value: 'การวิจัยและพัฒนา', label: 'การวิจัยและพัฒนา' },
                { value: 'การพัฒนาทดลอง', label: 'การพัฒนาทดลอง' },
                { value: 'พื้นฐาน (basic Research)', label: 'พื้นฐาน (basic Research)' },
                { value: 'พัฒนาและประยุกต์ (Development)', label: 'พัฒนาและประยุกต์ (Development)' },
                { value: 'วิจัยเชิงปฏิบัติการ (Operational Research)', label: 'วิจัยเชิงปฏิบัติการ (Operational Research)' },
                { value: 'วิจัยทางคลินิก (Clinical Trial)', label: 'วิจัยทางคลินิก (Clinical Trial)' },
                { value: 'วิจัยต่อยอด (Translational research)', label: 'วิจัยต่อยอด (Translational research)' },
                { value: 'การขยายผลงานวิจัย (Implementation)', label: 'การขยายผลงานวิจัย (Implementation)' },
              ]}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormSelect
              label="ประเภทแหล่งทุน"
              required
              value={formData.fundType}
              onChange={(value) => handleInputChange("fundType", value)}
              className="max-w-lg"
              options={[
                { value: '', label: 'เลือกข้อมูล' },
                { value: '10', label: 'เงินอุดหนุนรัฐบาลและเงินอุดหนุนอื่นที่รัฐบาลจัดสรรให้' },
                { value: '11', label: 'เงินรายได้มหาวิทยาลัยและส่วนงาน' },
                { value: '12', label: 'แหล่งทุนภายนอกมหาวิทยาลัย' },
                { value: '13', label: 'เงินทุนส่วนตัว' },
              ]}
            />
            <FormSelect
              label=""
              value={formData.fundSubType}
              onChange={(value) => handleInputChange("fundSubType", value)}
              className="max-w-lg"
              options={subFundType}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            {
              formData.fundType !== '13' && (
                <FormSelect
                  label="ชื่อแหล่งทุน"
                  required
                  value={formData.fundName}
                  onChange={(value) => handleInputChange("fundName", value)}
                  className="max-w-lg"
                  options={[
                    { value: '', label: 'เลือกชื่อแหล่งทุน' },
                    { value: 'สำนักงานคณะกรรมการวิจัยแห่งชาติ', label: 'สำนักงานคณะกรรมการวิจัยแห่งชาติ' },
                    { value: 'สำนักงานกองทุนสนับสนุนการวิจัย', label: 'สำนักงานกองทุนสนับสนุนการวิจัย' },
                    { value: 'สำนักงานคณะกรรมการการอุดมศึกษา', label: 'สำนักงานคณะกรรมการการอุดมศึกษา' },
                    { value: 'สำนักงานพัฒนาการวิจัยการเกษตร (สวก.)', label: 'สำนักงานพัฒนาการวิจัยการเกษตร (สวก.)' },
                    { value: 'สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ', label: 'สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ' },
                    { value: 'ศูนย์เทคโนโลยีโลหะและวัสดุแห่งชาติ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ', label: 'ศูนย์เทคโนโลยีโลหะและวัสดุแห่งชาติ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ' },
                    { value: 'ศูนย์พันธุวิศวกรรมและเทคโนโลยีชีวภาพแห่งชาติ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ', label: 'ศูนย์พันธุวิศวกรรมและเทคโนโลยีชีวภาพแห่งชาติ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ' },
                    { value: 'ศูนย์นาโนเทคโนโลยีแห่งชาติ', label: 'ศูนย์นาโนเทคโนโลยีแห่งชาติ' },
                    { value: 'กระทรวงวิทยาศาสตร์และเทคโนโลยี', label: 'กระทรวงวิทยาศาสตร์และเทคโนโลยี' },
                    { value: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร', label: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร' },
                    { value: 'มูลนิธิชัยพัฒนา', label: 'มูลนิธิชัยพัฒนา' },
                    { value: 'มูลนิธิโครงการหลวง', label: 'มูลนิธิโครงการหลวง' },
                    { value: 'มูลนิธิเพื่อการส่งเสริมวิทยาศาสตร์ ประเทศไทย', label: 'มูลนิธิเพื่อการส่งเสริมวิทยาศาสตร์ ประเทศไทย' },
                    { value: 'กองทุนสิ่งแวดล้อม สำนักงานนโยบายและแผนสิ่งแวดล้อม', label: 'กองทุนสิ่งแวดล้อม สำนักงานนโยบายและแผนสิ่งแวดล้อม' },
                    { value: 'กองทุนสนับสนุนการวิจัย ร่วมกับสำนักงานคณะกรรมการการอุดมศึกษา', label: 'กองทุนสนับสนุนการวิจัย ร่วมกับสำนักงานคณะกรรมการการอุดมศึกษา' },
                    { value: 'ทุนอุดหนุนวิจัยภายใต้โครงการความร่วมมือระหว่างไทย-ญี่ปุ่น (NRCT-JSPS)', label: 'ทุนอุดหนุนวิจัยภายใต้โครงการความร่วมมือระหว่างไทย-ญี่ปุ่น (NRCT-JSPS)' },
                    { value: 'อื่นๆ', label: 'อื่นๆ' },
                  ]}
                />
              )
            }
            
            <FormTextarea
              label={formData.fundType === '13' ? "ชื่อแหล่งทุน" : ""}
              value={formData.fundType === '13' ? "เงินทุนส่วนตัว" : formData.fundName}
              onChange={(value) => handleInputChange("fundName", value)}
              disabled={formData.fundName === 'อื่นๆ' ? false : true}
              className={`border border-gray-300 rounded-md p-2 ${formData.fundName === 'อื่นๆ' ? '' : 'bg-gray-100 cursor-not-allowed'}`}
              placeholder=""
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormInput
              mini={true}
              required
              label="งบวิจัย"
              type="number"
              value={formData.budget}
              onChange={(value) => handleInputChange("budget", value)}
              placeholder="0"
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="คำสำคัญ (คั่นระหว่างคำด้วยเครื่องหมาย “;” เช่น ข้าว; พืช; อาหาร)"
              required
              value={formData.keywords}
              onChange={(value) => handleInputChange("keywords", value)}
              placeholder=""
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormSelect
              label="IC Types"
              required
              value={formData.icTypes}
              onChange={(value) => handleInputChange("icTypes", value)}
              className="max-w-lg"
              options={[{ value: '', label: 'เลือกข้อมูล' }, ...icTypesLists.map(ic => ({ value: String(ic.id), label: ic.name }))]}
            />

            <FormSelect
              label="Impact"
              required
              value={formData.impact}
              onChange={(value) => handleInputChange("impact", value)}
              className="max-w-lg"
              options={[{ value: '', label: 'เลือกข้อมูล' }, ...impactLists.map(ic => ({ value: String(ic.id), label: ic.name }))]}
            />

            <FormSelect 
              label="SDG"
              required
              value={formData.sdg}
              onChange={(value) => handleInputChange("sdg", value)}
              className="max-w-lg"
              options={[{ value: '', label: 'เลือกข้อมูล' }, ...sdgLists.map(ic => ({ value: String(ic.id), label: ic.name }))]}
            />
          </FormFieldBlock>
        </FormSection>

        <div className='p-4 rounded-md border shadow border-gray-200/70'>
          <FormSection title="* ผู้ร่วมวิจัย">
            <ResearchTeamTable formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} />
          </FormSection>
        </div>

        <FormSection>
          <FileUploadField
            label="อัปโหลดไฟล์"
            onFilesChange={(attachments) => handleInputChange("attachments", attachments)}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            multiple={true}
          />
        </FormSection>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Link href="/dashboard/form/overview">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submits'}
          </Button>
        </div>
      </form>
    </div>
  );
}
