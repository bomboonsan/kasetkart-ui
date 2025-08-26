'use client'

import { useState } from 'react'
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

export default function CreateResearchForm() {
  const [formData, setFormData] = useState({
    year: "2568",
    type: "",
    type2: "",
    type3: "",
    subProjectCount: "",
    titleThai: "",
    titleEnglish: "",

    budget: "",
    thaiAbstract: "",
    englishAbstract: "",
    objectives: "",
    methodology: "",
    researcher: "",
    coResearcher: "",
    budget: "",
    funding: "",
    impact: "",
    sdg: "",
    attachments: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Information */}
        <FormSection>
          <FormFieldBlock>
            <FormInput
              mini={true}
              label="ปีงบประมาณ"
              type="number"
              value={formData.year}
              onChange={(value) => handleInputChange("year", value)}
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
              value={formData.type}
              onChange={(value) => handleInputChange("type", value)}
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
              value={formData.type2}
              onChange={(value) => handleInputChange("type2", value)}
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
              value={formData.titleThai}
              onChange={(value) => handleInputChange("titleThai", value)}
              placeholder=""
            />
          </FormFieldBlock>

          <FormFieldBlock className="grid grid-cols-1 gap-6">
            <FormTextarea
              label="ชื่อแผนงานวิจัยหรือชุดโครงการวิจัย/โครงการวิจัย (อังกฤษ)"
              value={formData.titleEnglish}
              onChange={(value) => handleInputChange("titleEnglish", value)}
              placeholder=""
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <div className="flex items-center gap-10">
              <label className="flex items-center gap-3 text-zinc-700">
                <input
                  type="radio"
                  value="เกี่ยวข้อง กับสิ่งแวดล้อมและความยั่งยืน"
                  checked={
                    formData.type3 === "เกี่ยวข้อง กับสิ่งแวดล้อมและความยั่งยืน"
                  }
                  onChange={(e) => handleInputChange("type3", e.target.value)}
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
                  value="ไม่เกี่ยวข้อง กับสิ่งแวดล้อมและความยั่งยืน"
                  checked={
                    formData.type3 ===
                    "ไม่เกี่ยวข้อง กับสิ่งแวดล้อมและความยั่งยืน"
                  }
                  onChange={(e) => handleInputChange("type3", e.target.value)}
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
                  value={formData.researchDuration}
                  onChange={(value) =>
                    handleInputChange("researchDuration", value)
                  }
                />
              </div>
              <div>
                <FormDateSelect
                  title="สิ้นสุด"
                  value={formData.researchDuration}
                  onChange={(value) =>
                    handleInputChange("researchDuration", value)
                  }
                />
              </div>
            </div>
          </FormFieldBlock>

          <FormFieldBlock>
            <FormSelect
              label="หน่วยงานหลักที่รับผิดชอบโครงการวิจัย (หน่วยงานที่ขอทุน)"
              required
              value={formData.researchType}
              onChange={(value) => handleInputChange("researchType", value)}
              className="max-w-lg"
              options={[{ value: null, label: "คณะบริหารธุรกิจ" }]}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormSelect
              label="ประเภทงานวิจัย"
              required
              value={formData.researchType}
              onChange={(value) => handleInputChange("researchType", value)}
              className="max-w-lg"
              options={[{ value: null, label: "เลือกประเภทงานวิจัย" }]}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormSelect
              label="ประเภทแหล่งทุน"
              required
              value={formData.fundType}
              onChange={(value) => handleInputChange("fundType", value)}
              className="max-w-lg"
              options={[{ value: null, label: "เลือกข้อมูล" }]}
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
              value={formData.subProjectCount}
              onChange={(value) => handleInputChange("subProjectCount", value)}
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
              value={formData.icType}
              onChange={(value) => handleInputChange("icType", value)}
              className="max-w-lg"
              options={[{ value: null, label: "เลือกข้อมูล" }]}
            />

            <FormSelect
              label="Impact"
              required
              value={formData.icType}
              onChange={(value) => handleInputChange("impact", value)}
              className="max-w-lg"
              options={[{ value: null, label: "เลือกข้อมูล" }]}
            />

            <FormSelect
              label="SDG"
              required
              value={formData.icType}
              onChange={(value) => handleInputChange("sdg", value)}
              className="max-w-lg"
              options={[{ value: null, label: "เลือกข้อมูล" }]}
            />
          </FormFieldBlock>
        </FormSection>

        <FormSection title="* ผู้ร่วมวิจัย">
          <FormFieldBlock>
            <div className="flex items-center gap-10">
              <label className="flex items-center gap-3 text-zinc-700">
                <input
                  type="radio"
                  value="ภายใน มก."
                  checked={formData.type3 === "ภายใน มก."}
                  onChange={(e) => handleInputChange("type3", e.target.value)}
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
                  value="ภายนอก มก. (หัวหน้าโครงการวิจัยภายนอก มก. นิสิต และลูกจ้าง)"
                  checked={
                    formData.type3 ===
                    "ภายนอก มก. (หัวหน้าโครงการวิจัยภายนอก มก. นิสิต และลูกจ้าง)"
                  }
                  onChange={(e) => handleInputChange("type3", e.target.value)}
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
                value={formData.subProjectName}
                onChange={(value) => handleInputChange("subProjectName", value)}
                placeholder=""
              />
            </div>
            <div>
              <FormInput
                mini={false}
                label="ชื่อหน่วยงาน"
                type="text"
                value={formData.subProjectName}
                onChange={(value) => handleInputChange("subProjectName", value)}
                placeholder=""
              />
            </div>
            <div>
              <FormSelect
                label="ประเภทผู้ร่วมโครงการวิจัย"
                required
                value={formData.icType}
                onChange={(value) => handleInputChange("impact", value)}
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
                value={formData.subProjectName}
                onChange={(value) => handleInputChange("subProjectName", value)}
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
          <Button variant="primary" type="submit">
            Submits
          </Button>
        </div>
      </form>
    </div>
  );
}
