"use client";

import { useState } from "react";
import FormSection from "./FormSection";
import FormFieldBlock from "./FormFieldBlock";
import FormField from "./FormField";
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormCheckbox from "./FormCheckbox";
import FormTextarea from "./FormTextarea";
import FormDateSelect from "./FormDateSelect";
import FormSelect from "./FormSelect";
import FileUploadField from "./FileUploadField";
import ResearchTeamTable from "./ResearchTeamTable";
import Button from "./Button";

export default function CreateAcademicForm() {
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
            <FormTextarea
              label="ชื่อการประชุมทางวิชาการ (ใช้ชื่อไทยถ้าไม่มีชื่อไทยให้ใช้ภาษาอื่น)"
              required
              value={formData.titleThai}
              onChange={(value) => handleInputChange("titleThai", value)}
              placeholder=""
            />
            <FormInput
              label="DOI (ถ้าไม่มีให้ใส่ “-”) ความหมายของ DOI"
              type="text"
              value={formData.doi}
              onChange={(value) => handleInputChange("doi", value)}
              placeholder=""
            />
            <FormInput
              label="ISBN (ป้อนอักษร 10 ตัว หรือ 13 ตัว ไม่ต้องใส่ “-”)"
              type="text"
              value={formData.isbn}
              onChange={(value) => handleInputChange("isbn", value)}
              placeholder=""
            />
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
            <FormInput
              mini={true}
              required
              label="ค่าใช้จ่าย"
              type="number"
              value={formData.subProjectCount}
              onChange={(value) => handleInputChange("subProjectCount", value)}
              placeholder="0"
            />
            <FormRadio
              inline={true}
              required
              label="การนำเสนอผลงาน"
              options={[
                {
                  label: "ได้รับเชิญ (Invited Paper.)",
                  value: "ได้รับเชิญ (Invited Paper.)",
                },
                {
                  label: "เสนอเอง",
                  value: "เสนอเอง",
                },
              ]}
              value={formData.type}
              onChange={(value) => handleInputChange("type", value)}
            />
            <FormRadio
              inline={true}
              required
              label="ประเภทการนำเสนอ"
              options={[
                {
                  label: "ภาคบรรยาย (Oral)",
                  value: "ภาคบรรยาย (Oral)",
                },
                {
                  label: "ภาคโปสเตอร์ (Poster)",
                  value: "ภาคโปสเตอร์ (Poster)",
                },
                {
                  label: "เข้าร่วมประชุมวิชาการ",
                  value: "เข้าร่วมประชุมวิชาการ",
                },
              ]}
              value={formData.type2}
              onChange={(value) => handleInputChange("type2", value)}
            />
            <FormRadio
              inline={true}
              required
              label="ลักษณะของบทความ"
              options={[
                {
                  label: "Abstract อย่างเดียว",
                  value: "Abstract อย่างเดียว",
                },
                {
                  label: "เรื่องเต็ม",
                  value: "เรื่องเต็ม",
                },
              ]}
              value={formData.type3}
              onChange={(value) => handleInputChange("type3", value)}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="บทคัดย่อ (ไทย) (ไม่มีข้อมูลให้ใส่ “-”)"
              required
              value={formData.fundName}
              onChange={(value) => handleInputChange("fundName", value)}
              placeholder=""
            />
            <FormTextarea
              label="บทคัดย่อ (อังกฤษ) (ไม่มีข้อมูลให้ใส่ “-”)"
              required
              value={formData.fundName}
              onChange={(value) => handleInputChange("fundName", value)}
              placeholder=""
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="กรณีเข้าร่วมประชุมวิชาการ สรุปเนื้อหาการประชุมแบบย่อ(ถ้าไม่มีข้อมูลให้ใส่ -)"
              required
              value={formData.fundName}
              onChange={(value) => handleInputChange("fundName", value)}
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

          <FormFieldBlock>
            <FormRadio
              inline={true}
              required
              label="ระดับการนำเสนอ"
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
              value={formData.type3}
              onChange={(value) => handleInputChange("type3", value)}
            />
            <FormSelect
              label="ประเทศ"
              required
              value={formData.icType}
              onChange={(value) => handleInputChange("impact", value)}
              className="max-w-lg"
              options={[{ value: null, label: "เลือกประเทศ" }]}
            />
            <FormSelect
              label="มลรัฐ/จังหวัด"
              required
              value={formData.icType}
              onChange={(value) => handleInputChange("impact", value)}
              className="max-w-lg"
              options={[{ value: null, label: "เลือกมลรัฐ/จังหวัด" }]}
            />
            <FormSelect
              label="เมือง"
              required
              value={formData.icType}
              onChange={(value) => handleInputChange("impact", value)}
              className="max-w-lg"
              options={[{ value: null, label: "เลือกเมือง" }]}
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
            <FormTextarea
              label="คำสำคัญ (คั่นระหว่างคำด้วยเครื่องหมาย “;” เช่น ข้าว; พืช; อาหาร)"
              required
              value={formData.fundName}
              onChange={(value) => handleInputChange("fundName", value)}
              placeholder=""
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
