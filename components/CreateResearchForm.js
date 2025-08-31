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
import { api } from '@/lib/api'
import SweetAlert2 from 'react-sweetalert2'
import { use } from 'react'

export default function CreateResearchForm() {
  const [swalProps, setSwalProps] = useState({})
  // Align form keys to Project model in schema.prisma
  const [formData, setFormData] = useState({
    fiscalYear: "2568", // Project.fiscalYear (Int)
    projectType: "", // Project.projectType (String)
    projectMode: "", // Project.projectMode (String)
    subProjectCount: "", // Project.subProjectCount (Int)
    nameTh: "", // Project.nameTh (Text)
    nameEn: "", // Project.nameEn (Text)

    isEnvironmentallySustainable: undefined, // Project.isEnvironmentallySustainable (Boolean)
    durationStart: "", // Project.durationStart (DateTime)
    durationEnd: "", // Project.durationEnd (DateTime)

    researchKind: "", // Project.researchKind (String)
    fundType: "", // Project.fundType (String)
    fundSubType: "", // Project.fundType (String)
    fundName: "", // Project.fundName (String)
    budget: "", // Project.budget (Int)
    keywords: "", // Project.keywords (Text)
    icTypes: "", // Project.icTypes (String)
    impact: "", // Project.impact (String)
    sdg: "", // Project.sdg (String)

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

  console.log('formData', formData)

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
    ;(async () => {
      try {
        const [orgs, depts] = await Promise.all([
          api.get('/organizations'),
          api.get('/departments'),
        ])
        const orgOpts = (orgs?.data || []).map(o => ({ value: o.id, label: o.name }))
        const deptOpts = (depts?.data || []).map(d => ({ value: d.id, label: d.name }))
        setOrgOptions(orgOpts)
        setDeptOptions(deptOpts)
      } catch (err) {
        setError(err.message || 'โหลดข้อมูลตัวเลือกไม่สำเร็จ')
      }
    })()
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
        ['nameTh', 'ชื่อโครงการ (ไทย)'],
        ['nameEn', 'ชื่อโครงการ (อังกฤษ)'],
        ['durationStart', 'วันที่เริ่มต้น'],
        ['durationEnd', 'วันที่สิ้นสุด'],
        ['budget', 'งบวิจัย'],
        ['keywords', 'คำสำคัญ'],
        ['icTypes', 'IC Types'],
        ['impact', 'Impact'],
        ['sdg', 'SDG']
      ]
      const missing = required.filter(([k]) => !formData[k] || String(formData[k]).trim() === '')
      if (missing.length > 0) {
        const msg = `กรุณากรอก: ${missing.map(([, label]) => label).join(', ')}`
        setError(msg)
        setSwalProps({ show: true, icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: msg, timer: 2400 })
        setSubmitting(false)
        return
      }
      // เตรียมผู้ใช้ปัจจุบันให้เป็นหัวหน้าโครงการอัตโนมัติ
      let me = null
      try { me = await api.get('/profiles/me') } catch {}

      const mePartner = me ? {
        isInternal: true,
        userId: me.id,
        fullname: (me.Profile ? `${me.Profile.firstName || ''} ${me.Profile.lastName || ''}`.trim() : me.email) || me.email,
        orgName: me.Faculty?.name || me.Department?.name || me.Organization?.name || '',
        partnerType: 'หัวหน้าโครงการ',
        partnerComment: '',
      } : null

      // ผู้ร่วมจากแบบฟอร์ม (ถ้าผู้ใช้กรอกเพิ่ม)
      const hasExtraInternal = formData.isInternal === true && formData.userId
      const hasExtraExternal = formData.isInternal === false && (formData.partnerFullName || formData.fullname)
      const extraPartner = (hasExtraInternal || hasExtraExternal) ? {
        isInternal: formData.isInternal === true,
        userId: formData.userId ? parseInt(formData.userId) : undefined,
        fullname: (formData.partnerFullName || formData.fullname) || undefined,
        orgName: formData.orgName || undefined,
        partnerType: formData.partnerType || undefined,
        partnerComment: formData.partnerComment || undefined,
      } : null

      const partnersArray = []
      if (mePartner) partnersArray.push(mePartner)
      if (extraPartner) {
        const sameUser = mePartner && extraPartner.userId && mePartner.userId === extraPartner.userId
        const emptyExternal = !extraPartner.userId && !extraPartner.fullname
        if (!sameUser && !emptyExternal) partnersArray.push(extraPartner)
      }

      // Map to API payload
      const payload = {
        fiscalYear: parseInt(formData.fiscalYear) || undefined,
        projectType: formData.projectType || undefined,
        projectMode: formData.projectMode || undefined,
        subProjectCount: formData.subProjectCount ? parseInt(formData.subProjectCount) : undefined,
        nameTh: formData.nameTh || undefined,
        nameEn: formData.nameEn || undefined,
        isEnvironmentallySustainable: formData.isEnvironmentallySustainable,
        durationStart: formData.durationStart || undefined,
        durationEnd: formData.durationEnd || undefined,
        researchKind: formData.researchKind || undefined,
        fundType: formData.fundType || undefined,
        fundName: formData.fundName || undefined,
        budget: formData.budget ? parseInt(formData.budget) : undefined,
        keywords: formData.keywords || undefined,
        icTypes: formData.icTypes || undefined,
        impact: formData.impact || undefined,
        sdg: formData.sdg || undefined,
        partners: partnersArray,
      }
      const project = await api.post('/projects', payload)
      // attach files if any
      if ((formData.attachments || []).length > 0 && project?.id) {
        const ids = formData.attachments.map(a => a.id)
        await api.patch(`/projects/${project.id}/attachments`, { attachmentIds: ids })
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
              onChange={(value) => handleInputChange("fiscalYear", value)}
              placeholder="2568"
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormRadio
              inline={false}
              required
              label="ประเภทโครงการ"
              options={[
                { label: "โครงการวิจัย", value: "โครงการวิจัย" },
                {
                  label: "โครงการพัฒนาวิชาการประเภทงานวิจัย",
                  value: "โครงการพัฒนาวิชาการประเภทงานวิจัย",
                },                
              ]}
              value={formData.projectType}
              onChange={(value) => handleInputChange("projectType", value)}
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormRadio
              inline={true}
              required
              label="ลักษณะโครงการวิจัย"
              options={[
                { label: "โครงการวิจัยเดี่ยว", value: "โครงการวิจัยเดี่ยว" },
                {
                  label: "แผนงานวิจัย หรือชุดโครงการวิจัย",
                  value: "แผนงานวิจัย หรือชุดโครงการวิจัย",
                },
              ]}
              value={formData.projectMode}
              onChange={(value) => handleInputChange("projectMode", value)}
            />
          </FormFieldBlock>

          <FormFieldBlock className="grid grid-cols-1 gap-6">
            <FormInput
              mini={true}
              label="จำนวนโครงการย่อย"
              type="number"
              value={formData.projectMode !== "แผนงานวิจัย หรือชุดโครงการวิจัย" ? 0 :formData.subProjectCount}
              onChange={(value) => handleInputChange("subProjectCount", value)}
              placeholder="0"
              disabled={formData.projectMode === "แผนงานวิจัย หรือชุดโครงการวิจัย" ? false : true}
              className={`border border-gray-300 rounded-md p-2 ${formData.projectMode === "แผนงานวิจัย หรือชุดโครงการวิจัย" ? '' : 'bg-gray-100 cursor-not-allowed'}`}
            />
          </FormFieldBlock>

          <FormFieldBlock className="grid grid-cols-1 gap-6">
            <FormTextarea
              label="ชื่อแผนงานวิจัยหรือชุดโครงการวิจัย/โครงการวิจัย (ไทย)"
              value={formData.nameTh}
              onChange={(value) => handleInputChange("nameTh", value)}
              placeholder=""
              required
            />
          </FormFieldBlock>

          <FormFieldBlock className="grid grid-cols-1 gap-6">
            <FormTextarea
              label="ชื่อแผนงานวิจัยหรือชุดโครงการวิจัย/โครงการวิจัย (อังกฤษ)"
              value={formData.nameEn}
              onChange={(value) => handleInputChange("nameEn", value)}
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
                  checked={formData.isEnvironmentallySustainable === true}
                  onChange={() => handleInputChange("isEnvironmentallySustainable", true)}
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
                  checked={formData.isEnvironmentallySustainable === false}
                  onChange={() => handleInputChange("isEnvironmentallySustainable", false)}
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
              value={"ชื่อภาค คณะ มหาลัยจาก ข้อมูลผู้ใช้"}
              // onChange={(value) => handleInputChange("orgName", value)}
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
              options={[
                { value: '', label: 'เลือกข้อมูล' },
                { value: '1', label: 'Basic or Discovery Scholarship' },
                { value: '2', label: 'Applied or Integrative / Application Scholarship' },
                { value: '3', label: 'Teaching and Learning Scholarship' },
              ]}
            />

            <FormSelect
              label="Impact"
              required
              value={formData.impact}
              onChange={(value) => handleInputChange("impact", value)}
              className="max-w-lg"
              options={[
                { value: '', label: 'เลือกข้อมูล' },
                { value: '1', label: 'Teaching & Learning Imapct' },
                { value: '2', label: 'Research & Scholarly Impact' },
                { value: '3', label: 'Practice & Community Impact' },
                { value: '4', label: 'Societal Impact' },
              ]}
            />

            <FormSelect 
              label="SDG"
              required
              value={formData.sdg}
              onChange={(value) => handleInputChange("sdg", value)}
              className="max-w-lg"
              options={[
                { value: '', label: 'เลือกข้อมูล' },
                { value: '1', label: 'SDG 1 - No Poverty' },
                { value: '2', label: 'SDG 2 - Zero Hunger' },
                { value: '3', label: 'SDG 3 - Good Health and Well-Being' },
                { value: '4', label: 'SDG 4 - Quality Education' },
                { value: '5', label: 'SDG 5 - Gender Equality' },
                { value: '6', label: 'SDG 6 - Clean Water and Sanitation' },
                { value: '7', label: 'SDG 7 - Affordable and Clean Energy' },
                { value: '8', label: 'SDG 8 - Decent Work and Economic Growth' },
                { value: '9', label: 'SDG 9 - Industry, Innovation and Infrastructure' },
                { value: '10', label: 'SDG 10 - Reduced Inequalities' },
                { value: '11', label: 'SDG 11 - Sustainble Cities and Communities' },
                { value: '12', label: 'SDG 12 - Responsible Consumption and Production' },
                { value: '13', label: 'SDG 13 - Climate Action' },
                { value: '14', label: 'SDG 14 - Life Below Water' },
                { value: '15', label: 'SDG 15 - Life on Land' },
                { value: '16', label: 'SDG 16 - Peace, Justice and Strong Institutions' },
                { value: '17', label: 'SDG 17 - Partnerships for The Goals' },
              ]}
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
            accept=".pdf,.doc,.docx"
            multiple
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
