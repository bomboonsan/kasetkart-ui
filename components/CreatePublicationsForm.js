"use client";

import { useState } from "react";
import FormSection from "./FormSection";
import FormFieldBlock from "./FormFieldBlock";
import FormField from "./FormField";
import FormModal from "./FormModal";
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormCheckbox from "./FormCheckbox";
import FormTextarea from "./FormTextarea";
import FormDateSelect from "./FormDateSelect";
import FormSelect from "./FormSelect";
import FileUploadField from "./FileUploadField";
import ResearchTeamTable from "./ResearchTeamTable";
import Button from "./Button";
import { api } from '@/lib/api'

export default function CreateAcademicForm() {
  // Align form keys to PublicationDetail model in schema.prisma
  const [formData, setFormData] = useState({
    titleTh: "", // PublicationDetail.titleTh
    titleEn: "", // PublicationDetail.titleEn
    isEnvironmentallySustainable: undefined, // PublicationDetail.isEnvironmentallySustainable

    journalName: "", // PublicationDetail.journalName
    projectId: "", // For linking ResearchWork.projectId (placeholder)
    doi: "", // PublicationDetail.doi
    issn: "", // PublicationDetail.issn

    durationYearStart: "", // PublicationDetail.durationYearStart
    durationYearEnd: "", // PublicationDetail.durationYearEnd
    // durationMonthStart/End could be added later if needed

    level: "", // PublicationDetail.level (NATIONAL/INTERNATIONAL)
    isJournalDatabase: undefined, // PublicationDetail.isJournalDatabase (Boolean)

    // Database flags
    scopus: undefined,
    WebOfScience: undefined,
    ABDC: undefined,
    AJG: undefined,
    SocialScienceResearchNetwork: undefined,

    fundName: "", // PublicationDetail.fundName
    keywords: "", // PublicationDetail.keywords
    abstractTh: "", // PublicationDetail.abstractTh
    abstractEn: "", // PublicationDetail.abstractEn

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
        titleTh: formData.titleTh,
        titleEn: formData.titleEn || undefined,
        isEnvironmentallySustainable: formData.isEnvironmentallySustainable,
        journalName: formData.journalName || undefined,
        doi: formData.doi || undefined,
        issn: formData.issn || undefined,
        durationMonthStart: formData.durationMonthStart || '01',
        durationMonthEnd: formData.durationMonthEnd || '12',
        durationYearStart: formData.durationYearStart || String(new Date().getFullYear()),
        durationYearEnd: formData.durationYearEnd || String(new Date().getFullYear()),
        level: formData.level || undefined,
        isJournalDatabase: formData.isJournalDatabase,
        scopus: formData.scopus,
        WebOfScience: formData.WebOfScience,
        ABDC: formData.ABDC,
        AJG: formData.AJG,
        SocialScienceResearchNetwork: formData.SocialScienceResearchNetwork,
        fundName: formData.fundName || undefined,
        keywords: formData.keywords || undefined,
        abstractTh: formData.abstractTh || undefined,
        abstractEn: formData.abstractEn || undefined,
      }
      await api.post('/works', { type: 'PUBLICATION', status: 'DRAFT', detail, authors: [], attachments: [] })
      alert('บันทึกผลงานตีพิมพ์สำเร็จ')
    } catch (err) {
      setError(err.message || 'บันทึกไม่สำเร็จ')
    } finally {
      setSubmitting(false)
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleCheckboxChange = (field, value) => {
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
            <FormTextarea
              label="ชื่อวารสาร/แหล่งตีพิมพ์"
              required
              value={formData.journalName}
              onChange={(value) => handleInputChange("journalName", value)}
              placeholder=""
            />
            <FormModal
              mini={false}
              label="โครงการวิจัย"
              btnText="คลิกเพื่อเลือกโครงการวิจัย"
              type="text"
              value={formData.projectId}
              onChange={(value) => handleInputChange("projectId", value)}
              placeholder=""
            />
            <FormInput
              label="DOI (ถ้าไม่มีให้ใส่ “-”)"
              type="text"
              value={formData.doi}
              onChange={(value) => handleInputChange("doi", value)}
              placeholder=""
            />
            <FormInput
              label="ISSN (ถ้ามี)"
              type="text"
              value={formData.issn}
              onChange={(value) => handleInputChange("issn", value)}
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
                  value={formData.durationYearStart}
                  onChange={(value) => handleInputChange("durationYearStart", value)}
                />
              </div>
              <div>
                <FormDateSelect
                  title="สิ้นสุด"
                  value={formData.durationYearEnd}
                  onChange={(value) => handleInputChange("durationYearEnd", value)}
                />
              </div>
            </div>
            {/* No cost field in PublicationDetail; omitted for schema alignment */}
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
              value={""}
              onChange={() => {}}
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
              value={""}
              onChange={() => {}}
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
              value={""}
              onChange={() => {}}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="บทคัดย่อ (ไทย) (ไม่มีข้อมูลให้ใส่ “-”)"
              required
              value={formData.abstractTh}
              onChange={(value) => handleInputChange("abstractTh", value)}
              placeholder=""
            />
            <FormTextarea
              label="บทคัดย่อ (อังกฤษ) (ไม่มีข้อมูลให้ใส่ “-”)"
              required
              value={formData.abstractEn}
              onChange={(value) => handleInputChange("abstractEn", value)}
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
            <FormRadio
              disabled={formData.level === "NATIONAL"}
              inline={true}
              label=""
              options={[
                {
                  label: "วารสารที่อยู่ในฐานข้อมูล",
                  value: "true",
                },
                {
                  label: "วารสารที่ไม่อยู่ในฐานข้อมูล",
                  value: "false",
                },
              ]}
              value={String(formData.isJournalDatabase)}
              onChange={(value) => handleInputChange("isJournalDatabase", value === "true")}
            />
            {formData.isJournalDatabase === true && (
              <div>
                {/* Flags for journal database presence */}
                <FormRadio
                  inline={true}
                  label="Scopus"
                  options={[{ label: "ใช่", value: "true" }, { label: "ไม่ใช่", value: "false" }]}
                  value={String(formData.scopus)}
                  onChange={(value) => handleInputChange("scopus", value === "true")}
                />
                <FormRadio
                  inline={true}
                  label="Web of Science"
                  options={[{ label: "ใช่", value: "true" }, { label: "ไม่ใช่", value: "false" }]}
                  value={String(formData.WebOfScience)}
                  onChange={(value) => handleInputChange("WebOfScience", value === "true")}
                />
                <FormRadio
                  inline={true}
                  label="ABDC"
                  options={[{ label: "ใช่", value: "true" }, { label: "ไม่ใช่", value: "false" }]}
                  value={String(formData.ABDC)}
                  onChange={(value) => handleInputChange("ABDC", value === "true")}
                />
                <FormRadio
                  inline={true}
                  label="AJG"
                  options={[{ label: "ใช่", value: "true" }, { label: "ไม่ใช่", value: "false" }]}
                  value={String(formData.AJG)}
                  onChange={(value) => handleInputChange("AJG", value === "true")}
                />
                <FormRadio
                  inline={true}
                  label="Social Science Research Network"
                  options={[{ label: "ใช่", value: "true" }, { label: "ไม่ใช่", value: "false" }]}
                  value={String(formData.SocialScienceResearchNetwork)}
                  onChange={(value) => handleInputChange("SocialScienceResearchNetwork", value === "true")}
                />
              </div>
            )}
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
              value={formData.keywords}
              onChange={(value) => handleInputChange("keywords", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="บทคัดย่อ (ไทย) (ไม่มีข้อมูลให้ใส่ “-”)"
              required
              value={formData.abstractTh}
              onChange={(value) => handleInputChange("abstractTh", value)}
              placeholder=""
            />
            <FormTextarea
              label="บทคัดย่อ (อังกฤษ) (ไม่มีข้อมูลให้ใส่ “-”)"
              required
              value={formData.abstractEn}
              onChange={(value) => handleInputChange("abstractEn", value)}
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
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
}
