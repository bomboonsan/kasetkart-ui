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

export default function CreateResearchForm() {
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
        partners: [
          {
            isInternal: formData.isInternal === true,
            userId: formData.userId ? parseInt(formData.userId) : undefined,
            fullname: (formData.partnerFullName || formData.fullname) || undefined,
            orgName: formData.orgName || undefined,
            partnerType: formData.partnerType || undefined,
            partnerComment: formData.partnerComment || undefined,
            partnerProportion: formData.partnerProportion ? parseInt(formData.partnerProportion) : undefined,
          },
        ],
      }
      const project = await api.post('/projects', payload)
      // attach files if any
      if ((formData.attachments || []).length > 0 && project?.id) {
        const ids = formData.attachments.map(a => a.id)
        await api.patch(`/projects/${project.id}/attachments`, { attachmentIds: ids })
      }
      alert('สร้างโครงการสำเร็จ')
    } catch (err) {
      setError(err.message || 'บันทึกโครงการไม่สำเร็จ')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
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
              value={formData.subProjectCount}
              onChange={(value) => handleInputChange("subProjectCount", value)}
              placeholder="0"
            />
          </FormFieldBlock>

          <FormFieldBlock className="grid grid-cols-1 gap-6">
            <FormTextarea
              label="ชื่อแผนงานวิจัยหรือชุดโครงการวิจัย/โครงการวิจัย (ไทย)"
              value={formData.nameTh}
              onChange={(value) => handleInputChange("nameTh", value)}
              placeholder=""
            />
          </FormFieldBlock>

          <FormFieldBlock className="grid grid-cols-1 gap-6">
            <FormTextarea
              label="ชื่อแผนงานวิจัยหรือชุดโครงการวิจัย/โครงการวิจัย (อังกฤษ)"
              value={formData.nameEn}
              onChange={(value) => handleInputChange("nameEn", value)}
              placeholder=""
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
            <FormSelect
              label="หน่วยงานหลักที่รับผิดชอบโครงการวิจัย (หน่วยงานที่ขอทุน)"
              required
              value={formData.orgName}
              onChange={(value) => handleInputChange("orgName", value)}
              className="max-w-lg"
              options={[{ value: '', label: 'เลือกหน่วยงาน' }, ...orgOptions]}
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
                { label: "ประชุมวิชาการ", value: "ประชุมวิชาการ" },
                { label: "ตีพิมพ์ทางวิชาการ", value: "ตีพิมพ์ทางวิชาการ" },
                { label: "ขอรับทุนเขียนตำรา", value: "ขอรับทุนเขียนตำรา" },
                { label: "หนังสือและตำรา", value: "หนังสือและตำรา" },
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
                { value: 'ราชการ', label: 'ราชการ' },
                { value: 'เอกชน', label: 'เอกชน' },
                { value: 'มก', label: 'มหาวิทยาลัย (มก.)' },
                { value: 'ทุนต่างประเทศ', label: 'ทุนต่างประเทศ' },
              ]}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="ชื่อแหล่งทุน"
              required
              value={formData.fundName}
              onChange={(value) => handleInputChange("fundName", value)}
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
                { value: 'Basic or Discovery Scholarship', label: 'Basic or Discovery Scholarship' },
                { value: 'Applied or Integrative / Application Scholarship', label: 'Applied or Integrative / Application Scholarship' },
                { value: 'Teaching and Learning Scholarship', label: 'Teaching and Learning Scholarship' },
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
                { value: 'Teaching & Learning Imapct', label: 'Teaching & Learning Imapct' },
                { value: 'Research & Scholarly Impact', label: 'Research & Scholarly Impact' },
                { value: 'Practice & Community Impact', label: 'Practice & Community Impact' },
                { value: 'Societal Impact', label: 'Societal Impact' },
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
                { value: 'SDG 1 - No Poverty', label: 'SDG 1 - No Poverty' },
                { value: 'SDG 2 - Zero Hunger', label: 'SDG 2 - Zero Hunger' },
                { value: 'SDG 3 - Good Health and Well-Being', label: 'SDG 3 - Good Health and Well-Being' },
                { value: 'SDG 4 - Quality Education', label: 'SDG 4 - Quality Education' },
                { value: 'SDG 5 - Gender Equality', label: 'SDG 5 - Gender Equality' },
                { value: 'SDG 6 - Clean Water and Sanitation', label: 'SDG 6 - Clean Water and Sanitation' },
                { value: 'SDG 7 - Affordable and Clean Energy', label: 'SDG 7 - Affordable and Clean Energy' },
                { value: 'SDG 8 - Decent Work and Economic Growth', label: 'SDG 8 - Decent Work and Economic Growth' },
                { value: 'SDG 9 - Industry, Innovation and Infrastructure', label: 'SDG 9 - Industry, Innovation and Infrastructure' },
                { value: 'SDG 10 - Reduced Inequalities', label: 'SDG 10 - Reduced Inequalities' },
                { value: 'SDG 11 - Sustainble Cities and Communities', label: 'SDG 11 - Sustainble Cities and Communities' },
                { value: 'SDG 12 - Responsible Consumption and Production', label: 'SDG 12 - Responsible Consumption and Production' },
                { value: 'SDG 13 - Climate Action', label: 'SDG 13 - Climate Action' },
                { value: 'SDG 14 - Life Below Water', label: 'SDG 14 - Life Below Water' },
                { value: 'SDG 15 - Life on Land', label: 'SDG 15 - Life on Land' },
                { value: 'SDG 16 - Peace, Justice and Strong Institutions', label: 'SDG 16 - Peace, Justice and Strong Institutions' },
                { value: 'SDG 17 - Partnerships for The Goals', label: 'SDG 17 - Partnerships for The Goals' },
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
