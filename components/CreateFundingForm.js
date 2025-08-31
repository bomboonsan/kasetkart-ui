'use client'

import { useState, useEffect } from 'react'
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
import { api } from '@/lib/api'
import SweetAlert2 from 'react-sweetalert2'
import ProjectPicker from './ProjectPicker'
import UserPicker from './UserPicker'

export default function CreateFundingForm({ mode = 'create', workId, initialData }) {
  const [swalProps, setSwalProps] = useState({})
  // Align to FundingDetail fields
  const [formData, setFormData] = useState({
    fullName: "", // FundingDetail.fullName
    position: "", // FundingDetail.position
    faculty: "", // FundingDetail.faculty
    kind: "", // FundingDetail.kind
    contentDesc: "", // FundingDetail.contentDesc
    priorWorks: "", // FundingDetail.priorWorks
    objectives: "", // FundingDetail.objectives
    targetAudience: "", // FundingDetail.targetAudience
    chaptersOutline: "", // FundingDetail.chaptersOutline
    approxPages: "", // FundingDetail.approxPages
    approxTimeline: "", // FundingDetail.approxTimeline
    bibliography: "", // FundingDetail.bibliography
    projectId: "",
    attachments: [],
    // team-like (for ResearchTeamTable)
    isInternal: undefined,
    fullname: "",
    orgName: "",
    partnerType: "",
    partnerComment: "",
    partnerFullName: "",
    userId: undefined,
    __userObj: undefined,
  });

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Prefill when editing
  useEffect(() => {
    if (!initialData) return
    setFormData(prev => ({
      ...prev,
      ...initialData,
      projectId: initialData?.Project?.id ? String(initialData.Project.id) : (prev.projectId || ''),
    }))
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    setSubmitting(true)
    try {
      const detail = {
        fullName: formData.fullName,
        position: formData.position,
        faculty: formData.faculty,
        kind: formData.kind || undefined,
        contentDesc: formData.contentDesc || undefined,
        priorWorks: formData.priorWorks || undefined,
        objectives: formData.objectives || undefined,
        targetAudience: formData.targetAudience || undefined,
        chaptersOutline: formData.chaptersOutline || undefined,
        approxPages: formData.approxPages || undefined,
        approxTimeline: formData.approxTimeline || undefined,
        bibliography: formData.bibliography || undefined,
      }
      const attachments = (formData.attachments || []).map(a => ({ id: a.id }))
      const authors = formData.userId ? [{ userId: parseInt(formData.userId), isCorresponding: true }] : []
      const payload = { type: 'FUNDING', status: 'DRAFT', detail, authors, attachments }
      if (mode === 'edit' && workId) {
        await api.put(`/works/${workId}`, payload)
        setSwalProps({ show: true, icon: 'success', title: 'อัปเดตคำขอรับทุนเขียนตำราสำเร็จ', timer: 1600, showConfirmButton: false })
      } else if (formData.projectId) {
        // create under project context when projectId selected
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const res = await fetch(`${base}/projects/${formData.projectId}/works`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(payload),
          credentials: 'include'
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.error?.message || 'บันทึกไม่สำเร็จ')
        }
        setSwalProps({ show: true, icon: 'success', title: 'บันทึกคำขอรับทุนเขียนตำราสำเร็จ', timer: 1600, showConfirmButton: false })
      } else {
        await api.post('/works', payload)
        setSwalProps({ show: true, icon: 'success', title: 'บันทึกคำขอรับทุนเขียนตำราสำเร็จ', timer: 1600, showConfirmButton: false })
      }
    } catch (err) {
      setError(err.message || 'บันทึกไม่สำเร็จ')
      setSwalProps({ show: true, icon: 'error', title: 'บันทึกไม่สำเร็จ', text: err.message || '', timer: 2200 })
    } finally {
      setSubmitting(false)
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
        )}
        <FormSection title=" รายละเอียดของผู้แต่งร่วม (ถ้ามี)">
          <FormFieldBlock>
            <ProjectPicker
              label="โครงการวิจัย"
              selectedProject={formData.__projectObj}
              onSelect={(p) => setFormData(prev => ({ ...prev, projectId: String(p.id), __projectObj: p }))}
            />
            <FormInput
              mini={false}
              label="ชื่อ-นามสกุล"
              type="text"
              value={formData.fullName}
              onChange={(value) => handleInputChange("fullName", value)}
              placeholder=""
            />
            <FormInput
              mini={false}
              label="ตำแหน่ง"
              type="text"
              value={formData.position}
              onChange={(value) => handleInputChange("position", value)}
              placeholder=""
            />
            <FormInput
              mini={false}
              label="สังกัดคณะ/สถาบัน"
              type="text"
              value={formData.faculty}
              onChange={(value) => handleInputChange("faculty", value)}
              placeholder=""
            />
            <div>
                <button
                  type="button"
                  className={`
                    font-medium py-2 px-4 rounded-md transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    text-zinc-600 text-sm
                    bg-white hover:bg-gray-50 border border-gray-300 shadow-sm
                  `}
                >
                เพิ่มผู้แต่งร่วม
              </button>
            </div>
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="คำอธิบายเนื้อหาของตำราหรือหนังสือ"
              value={formData.contentDesc}
              onChange={(value) => handleInputChange("contentDesc", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="เอกสารทางวิชาการ ตำรา หรือ หนังสือ <br/> ที่ผู้ขอทุนเคยมีประสบการณ์แต่งมาแล้ว (ถ้ามีโปรดระบุ)"
              value={formData.priorWorks}
              onChange={(value) => handleInputChange("priorWorks", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="วัตถุประสงค์ของตำราหรือหนังสือ"
              value={formData.objectives}
              onChange={(value) => handleInputChange("objectives", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="กลุ่มเป้าหมายของตำราหรือหนังสือ"
              value={formData.targetAudience}
              onChange={(value) => handleInputChange("targetAudience", value)}
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
              value={formData.chaptersOutline}
              onChange={(value) => handleInputChange("chaptersOutline", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormInput
              mini={true}
              label="ตำรา หรือ หนังสือ มีจำนวนประมาณ"
              type="text"
              value={formData.approxPages}
              onChange={(value) => handleInputChange("approxPages", value)}
              placeholder=""
              after="หน้า"
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormInput
              mini={true}
              label="ระยะเวลา (ปี หรือ เดือน) ที่จะใช้ในการเขียนประมาณ"
              type="text"
              value={formData.approxTimeline}
              onChange={(value) => handleInputChange("approxTimeline", value)}
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
              value={formData.bibliography}
              onChange={(value) => handleInputChange("bibliography", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FileUploadField
              label="อัปโหลดไฟล์"
              onFilesChange={(attachments) => handleInputChange("attachments", attachments)}
              accept=".pdf,.doc,.docx"
              multiple
            />
          </FormFieldBlock>
        </FormSection>

        {/* Research Team Table */}
        <FormSection>
          <ResearchTeamTable projectId={formData.projectId} formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} />
        </FormSection>

        <FormSection title="* ผู้ร่วมวิจัย">
          <FormFieldBlock>
            <UserPicker
              label="ชื่อผู้ร่วมงาน"
              selectedUser={formData.__userObj}
              onSelect={(u) => {
                const display = (u.Profile ? `${u.Profile.firstName || ''} ${u.Profile.lastName || ''}`.trim() : u.email)
                setFormData(prev => ({ ...prev, fullName: display, userId: u.id, __userObj: u }))
              }}
            />
          </FormFieldBlock>
        </FormSection>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
}
