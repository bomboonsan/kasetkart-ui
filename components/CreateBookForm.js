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
import { api } from '@/lib/api'

export default function CreateBookForm() {
  // Align to BookDetail fields
  const [formData, setFormData] = useState({
    kind: "", // BookDetail.kind (หนังสือ/ตำรา)
    titleTh: "", // BookDetail.titleTh
    titleEn: "", // BookDetail.titleEn
    detail: "", // BookDetail.detail
    level: "", // BookDetail.level (NATIONAL/INTERNATIONAL)
    occurredAt: "", // BookDetail.occurredAt (Date)

    // team-like
    isInternal: undefined,
    fullname: "",
    orgName: "",
    partnerType: "",
    attachments: [],
  });

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    setSubmitting(true)
    try {
      const detail = {
        kind: formData.kind || undefined,
        titleTh: formData.titleTh,
        titleEn: formData.titleEn || undefined,
        detail: formData.detail || undefined,
        level: formData.level || undefined,
        occurredAt: formData.occurredAt || undefined,
      }
      await api.post('/works', { type: 'BOOK', status: 'DRAFT', detail, authors: [], attachments: [] })
      alert('บันทึกหนังสือ/ตำราสำเร็จ')
    } catch (err) {
      setError(err.message || 'บันทึกไม่สำเร็จ')
    } finally {
      setSubmitting(false)
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
        )}
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
              value={formData.kind}
              onChange={(value) => handleInputChange("kind", value)}
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="ชื่อผลงาน (ไทย)"
              required
              value={formData.titleTh}
              onChange={(value) => handleInputChange("titleTh", value)}
              placeholder=""
            />

            <FormTextarea
              label="ชื่อผลงาน (อังกฤษ)"
              required
              value={formData.titleEn}
              onChange={(value) => handleInputChange("titleEn", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="รายละเอียดเบื่องต้นของหนังสือ หรือ ตำรา"
              required
              value={formData.detail}
              onChange={(value) => handleInputChange("detail", value)}
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
                  value: "NATIONAL",
                },
                {
                  label: "ระดับนานาชาติ",
                  value: "INTERNATIONAL",
                },
              ]}
              value={formData.level}
              onChange={(value) => handleInputChange("level", value)}
            />
            <FormInput
              mini={false}
              label="วันที่เกิดผลงาน"
              type="date"
              value={formData.occurredAt}
              onChange={(value) => handleInputChange("occurredAt", value)}
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
                label="ชื่อผู้ร่วมงาน"
                btnText="คลิกเพื่อเลือกชื่อผู้ร่วมงาน"
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
              <FormCheckbox
                inline={true}
                label="ผู้รับผิดชอบบทความ"
                options={[
                  {
                    label: "",
                    value: "ผู้รับผิดชอบบทความ",
                  },
                ]}
                value={formData.partnerType}
                onChange={(value) => handleInputChange("partnerType", value)}
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
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
}
