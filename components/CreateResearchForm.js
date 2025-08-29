"use client"

import { useEffect, useState } from 'react'
import FormSection from './FormSection'
import FormFieldBlock from './FormFieldBlock'
import FormField from './FormField'
import FormModal from './FormModal'
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
    fullname: "", // ProjectPartner.fullname (String)
    orgName: "", // ProjectPartner.orgName (String)
    partnerType: "", // ProjectPartner.partnerType (String)
    proportion: "", // ProjectPartner.proportion (Int)

    attachments: [],
  });

  const [orgOptions, setOrgOptions] = useState([])
  const [deptOptions, setDeptOptions] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
            fullname: formData.fullname || undefined,
            orgName: formData.orgName || undefined,
            partnerType: formData.partnerType || undefined,
            proportion: formData.proportion ? parseInt(formData.proportion) : undefined,
          },
        ],
      }
      await api.post('/projects', payload)
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
              options={[{ value: '', label: "เลือกข้อมูล" }]}
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
              options={[{ value: '', label: "เลือกข้อมูล" }]}
            />

            <FormSelect
              label="Impact"
              required
              value={formData.impact}
              onChange={(value) => handleInputChange("impact", value)}
              className="max-w-lg"
              options={[{ value: '', label: "เลือกข้อมูล" }]}
            />

            <FormSelect
              label="SDG"
              required
              value={formData.sdg}
              onChange={(value) => handleInputChange("sdg", value)}
              className="max-w-lg"
              options={[{ value: '', label: "เลือกข้อมูล" }]}
            />
          </FormFieldBlock>
        </FormSection>

        <FormSection title="* ผู้ร่วมวิจัย">
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
            <div>
              <FormModal
                mini={false}
                label="ผู้ร่วมโครงการวิจัย"
                btnText="คลิกเพื่อเลือกผู้ร่วมโครงการวิจัย"
                type="text"
                value={formData.fullname}
                onChange={(value) => handleInputChange("fullname", value)}
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
            <div>
              <FormSelect
                label="ประเภทผู้ร่วมโครงการวิจัย"
                required
                value={formData.partnerType}
                onChange={(value) => handleInputChange("partnerType", value)}
                className="max-w-lg"
                options={[
                  { value: null, label: "เลือกประเภทผู้ร่วมโครงการวิจัย" },
                ]}
              />
            </div>
            <div>
              <FormInput
                mini={false}
                label="สัดส่วนการวิจัย"
                type="text"
                value={formData.proportion}
                onChange={(value) => handleInputChange("proportion", value)}
                placeholder="0.00%"
              />
            </div>
          </FormFieldBlock>
        </FormSection>
        
        {/* Research Team Table */}
        <FormSection>
          <ResearchTeamTable />
        </FormSection>

        <FormSection>
          <FileUploadField
            label="อัปโหลดไฟล์"
            onFilesChange={(files) => handleInputChange("attachments", files)}
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
          <Button variant="secondary" type="button">
            Save Draft
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submits'}
          </Button>
        </div>
      </form>
    </div>
  );
}
