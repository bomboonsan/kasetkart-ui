'use client'

import { useState } from 'react'
import FormSection from './FormSection'
import FormFieldBlock from './FormFieldBlock'
import FormField from './FormField'
import FormModal from './FormModal'
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormCheckbox from './FormCheckbox'
import FormTextarea from './FormTextarea'
import FormDateSelect from './FormDateSelect'
import FormSelect from "./FormSelect";
import FileUploadField from './FileUploadField'
import ResearchTeamTable from './ResearchTeamTable'
import Button from './Button'

export default function CreateBookForm() {
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
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <FormSection>
          <FormFieldBlock>
            <FormRadio
              inline={true}
              required
              label="ประเภทผลงาน"
              options={[
                {
                  label: "หนังสือ",
                  value: "หนังสือ",
                },
                {
                  label: "ตำรา",
                  value: "ตำรา",
                },
              ]}
              value={formData.type}
              onChange={(value) => handleInputChange("type", value)}
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="ชื่อผลงาน (ไทย)"
              required
              value={formData.titleThai}
              onChange={(value) => handleInputChange("titleThai", value)}
              placeholder=""
            />

            <FormTextarea
              label="ชื่อผลงาน (อังกฤษ)"
              required
              value={formData.titleEnglish}
              onChange={(value) => handleInputChange("titleEnglish", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="รายละเอียดเบื่องต้นของหนังสือ หรือ ตำรา"
              required
              value={formData.titleThai}
              onChange={(value) => handleInputChange("titleThai", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormRadio
              inline={true}
              required
              label="ระดับของผลงาน"
              options={[
                {
                  label: "ระดับชาติ",
                  value: "ระดับชาติ",
                },
                {
                  label: "ระดับนานาชาติ",
                  value: "ระดับนานาชาติ",
                },
              ]}
              value={formData.type}
              onChange={(value) => handleInputChange("type", value)}
            />
            <FormInput
              mini={false}
              label="วันที่เกิดผลงาน"
              type="date"
              value={formData.subProjectName}
              onChange={(value) => handleInputChange("subProjectName", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FileUploadField
              label="อัปโหลดไฟล์"
              onFilesChange={(files) => handleInputChange("attachments", files)}
              accept=".pdf,.doc,.docx"
              multiple
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
                label="ชื่อผู้ร่วมงาน"
                btnText="คลิกเพื่อเลือกชื่อผู้ร่วมงาน"
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
              <FormCheckbox
                inline={true}
                label="ผู้รับผิดชอบบทความ"
                options={[
                  {
                    label: "",
                    value: "ผู้รับผิดชอบบทความ",
                  },
                ]}
                value={formData.type}
                onChange={(value) => handleInputChange("type", value)}
              />
            </div>
          </FormFieldBlock>
        </FormSection>

        {/* Research Team Table */}
        <FormSection>
          <ResearchTeamTable />
        </FormSection>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button variant="secondary" type="button">
            Save Draft
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
