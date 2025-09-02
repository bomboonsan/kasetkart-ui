'use client'

import { useState, useEffect } from 'react'
import FormSection from './FormSection'
import FormFieldBlock from './FormFieldBlock'
import FormField from './FormField'
import ProjectPicker from './ProjectPicker'
import UserPicker from './UserPicker'
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

export default function CreateBookForm({ mode = 'create', workId, initialData }) {
  const [swalProps, setSwalProps] = useState({})
  // Align to BookDetail fields
  const [formData, setFormData] = useState({
    kind: "", // BookDetail.kind (หนังสือ/ตำรา)
    titleTh: "", // BookDetail.titleTh
    titleEn: "", // BookDetail.titleEn
    detail: "", // BookDetail.detail
    level: "", // BookDetail.level (NATIONAL/INTERNATIONAL)
    occurredAt: "", // BookDetail.occurredAt (Date)

    // team-like (for ResearchTeamTable)
    isInternal: undefined,
    fullname: "",
    orgName: "",
    partnerType: "",
    partnerComment: "",
    partnerFullName: "",
    userId: undefined,
    __userObj: undefined,
    projectId: "",
    attachments: [],
  });

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Prefill when editing
  useEffect(() => {
    if (!initialData) return
    setFormData(prev => ({
      ...prev,
      ...initialData,
      occurredAt: initialData.occurredAt ? String(initialData.occurredAt).slice(0,10) : '',
      projectId: initialData?.Project?.id ? String(initialData.Project.id) : (prev.projectId || ''),
    }))
  }, [initialData])

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
      if (mode === 'edit' && workId) {
        await api.put(`/works/${workId}`, { type: 'BOOK', status: 'DRAFT', detail, authors: [], attachments: [] })
        setSwalProps({ show: true, icon: 'success', title: 'อัปเดตหนังสือ/ตำราสำเร็จ', timer: 1600, showConfirmButton: false })
      } else {
      const attachments = (formData.attachments || []).map(a => ({ id: a.id }))
      const authors = formData.userId ? [{ userId: parseInt(formData.userId), isCorresponding: true }] : []
      const payload = { type: 'BOOK', status: 'DRAFT', detail, authors, attachments }
      if (mode === 'edit' && workId) {
        await api.put(`/works/${workId}`, payload)
        setSwalProps({ show: true, icon: 'success', title: 'อัปเดตหนังสือ/ตำราสำเร็จ', timer: 1600, showConfirmButton: false })
      } else if (formData.projectId) {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const res = await fetch(`${base}/projects/${formData.projectId}/works`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(payload), credentials: 'include'
        })
        if (!res.ok) { const data = await res.json().catch(()=>({})); throw new Error(data?.error?.message || 'บันทึกไม่สำเร็จ') }
        setSwalProps({ show: true, icon: 'success', title: 'บันทึกหนังสือ/ตำราสำเร็จ', timer: 1600, showConfirmButton: false })
      } else {
        await api.post('/works', payload)
        setSwalProps({ show: true, icon: 'success', title: 'บันทึกหนังสือ/ตำราสำเร็จ', timer: 1600, showConfirmButton: false })
      }
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
        <FormSection>
          <FormFieldBlock>
            <ProjectPicker
              label="โครงการวิจัย"
              selectedProject={formData.__projectObj}
              onSelect={(p) => setFormData(prev => ({ ...prev, projectId: String(p.id), __projectObj: p }))}
            />
          </FormFieldBlock>
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
              onFilesChange={(attachments) => handleInputChange("attachments", attachments)}
              accept=".pdf,.doc,.docx"
              multiple
            />
          </FormFieldBlock>
        </FormSection>

        <div className='p-4 rounded-md border shadow border-gray-200/70'>
                          <FormSection title="* ผู้แต่งร่วม">
                            <ResearchTeamTable projectId={formData.projectId} formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} />
                          </FormSection>
                        </div>

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
