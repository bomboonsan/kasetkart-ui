'use client'

import { useState } from 'react'
import FormSection from './FormSection'
import FormFieldBlock from './FormFieldBlock'
import FormField from './FormField'
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormCheckbox from './FormCheckbox'
import FormTextarea from './FormTextarea'
import FormDateSelect from './FormDateSelect'
import FormSelect from "./FormSelect";
import FileUploadField from './FileUploadField'
import ResearchTeamTable from './ResearchTeamTable'
import Button from './Button'

export default function CreateFundingForm() {
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
        <FormSection title=" รายละเอียดของผู้แต่งร่วม (ถ้ามี)">
          <FormFieldBlock>
            <FormInput
              mini={false}
              label="ชื่อ-นามสกุล"
              type="text"
              value={formData.subProjectName}
              onChange={(value) => handleInputChange("subProjectName", value)}
              placeholder=""
            />
            <FormInput
              mini={false}
              label="ตำแหน่ง"
              type="text"
              value={formData.subProjectName}
              onChange={(value) => handleInputChange("subProjectName", value)}
              placeholder=""
            />
            <FormInput
              mini={false}
              label="สังกัดคณะ/สถาบัน"
              type="text"
              value={formData.subProjectName}
              onChange={(value) => handleInputChange("subProjectName", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="คำอธิบายเนื้อหาของตำราหรือหนังสือ"
              value={formData.titleEnglish}
              onChange={(value) => handleInputChange("titleEnglish", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="เอกสารทางวิชาการ ตำรา หรือ หนังสือ <br/> ที่ผู้ขอทุนเคยมีประสบการณ์แต่งมาแล้ว (ถ้ามีโปรดระบุ)"
              value={formData.titleEnglish}
              onChange={(value) => handleInputChange("titleEnglish", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="วัตถุประสงค์ของตำราหรือหนังสือ"
              value={formData.titleEnglish}
              onChange={(value) => handleInputChange("titleEnglish", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="กลุ่มเป้าหมายของตำราหรือหนังสือ"
              value={formData.titleThai}
              onChange={(value) => handleInputChange("titleThai", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label={`
                การแบ่งบทและรายละเอียดในแต่ละบทของตำรา/หนังสือ <br/>
                <span class="text-blue-600">
                • หากเป็นตำรา หัวข้อจะต้องตรงตามประมวลการสอน<br/> ไม่ตกหล่นหัวข้อใดหัวข้อหนึ่ง แต่สามารถเพิ่มเติมมากกว่าได้<br/>
                • ระบุหัวข้อในแต่ละบท พร้อมอธิบายเนื้อหาโดยสรุปเกี่ยวกับหัวข้อในบท
                </span>
                `}
              value={formData.titleThai}
              onChange={(value) => handleInputChange("titleThai", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormInput
              mini={true}
              label="ตำรา หรือ หนังสือ มีจำนวนประมาณ"
              type="text"
              value={formData.subProjectName}
              onChange={(value) => handleInputChange("subProjectName", value)}
              placeholder=""
              after="หน้า"
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormInput
              mini={true}
              label="ระยะเวลา (ปี หรือ เดือน) ที่จะใช้ในการเขียนประมาณ"
              type="text"
              value={formData.subProjectName}
              onChange={(value) => handleInputChange("subProjectName", value)}
              placeholder=""
              after="(ระบุเป้นช่วงเวลาได้)"
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label={`
                รายชื่อหนังสือและเอกสารอ้างอิง (บรรณานุกรม) <br/>
                <span class="text-blue-600">
                เพิ่มเติมความเหมาะสมได้
                </span>
                `}
              value={formData.titleThai}
              onChange={(value) => handleInputChange("titleThai", value)}
              placeholder=""
            />
          </FormFieldBlock>
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
