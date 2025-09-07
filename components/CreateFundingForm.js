// This is Project Funding Form

'use client'

import { useState, useEffect } from 'react'
import FormSection from './FormSection'
import FormFieldBlock from './FormFieldBlock'
import FormInput from "./FormInput";
import FormTextarea from './FormTextarea'
import FileUploadField from './FileUploadField'
import ResearchTeamTable from './ResearchTeamTable'
import Button from './Button'
import { api } from '@/lib/api'
import SweetAlert2 from 'react-sweetalert2'

export default function CreateFundingForm({ mode = 'create', workId, initialData }) {
  const [swalProps, setSwalProps] = useState({})
  // Align to FundingDetail fields
  const [formData, setFormData] = useState({
    writers: [], // ผู้แต่งร่วม // json array of { fullName, department, faculty , phone, email }
    fundType: 0, // ลักษณะของผลงานวิชาการที่จะขอรับทุน (Int) 0=ตำรา ใช้สอนในรายวิชา, 1=หนังสือ(ชื่อไทย และชื่อภาษาอังกฤษ)
    fundTypeText: '', // ข้อความจาก radio button ลักษณะของผลงานวิชาการที่จะขอรับทุน
    contentDesc: '', // คำอธิบายเนื้อหาของตำราหรือหนังสือ
    pastPublications: '', // เอกสารทางวิชาการ ตำรา หรือ หนังสือ
    purposes: '', // วัตถุประสงค์ของตำราหรือหนังสือ
    targetGroups: '', // กลุ่มเป้าหมายของตำราหรือหนังสือ
    chapterDetails: '', // การแบ่งบทและรายละเอียดในแต่ละบทของตำรา/หนังสือ
    pages: 0, // ตำรา หรือ หนังสือ มีจำนวนประมาณ (Int)
    duration: '', // ระยะเวลา (ปี หรือ เดือน) ที่จะใช้ในการเขียนประมาณ
    references: '', // รายชื่อหนังสือและเอกสารอ้างอิง (บรรณานุกรม)
    attachments: [],
  });

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Prefill when editing
  useEffect(() => {
    if (!initialData) return
    setFormData(prev => ({
      ...prev,
      fundType: initialData?.fundType ?? prev.fundType,
      fundTypeText: initialData?.fundTypeText ?? prev.fundTypeText,
      contentDesc: initialData?.contentDesc ?? initialData?.detail?.contentDesc ?? prev.contentDesc,
      pastPublications: initialData?.pastPublications ?? initialData?.detail?.pastPublications ?? prev.pastPublications,
      purposes: initialData?.purposes ?? initialData?.detail?.purposes ?? prev.purposes,
      targetGroups: initialData?.targetGroups ?? initialData?.detail?.targetGroups ?? prev.targetGroups,
      chapterDetails: initialData?.chapterDetails ?? initialData?.detail?.chapterDetails ?? prev.chapterDetails,
      pages: initialData?.pages ?? initialData?.detail?.pages ?? prev.pages,
      duration: initialData?.duration ?? initialData?.detail?.duration ?? prev.duration,
      references: initialData?.references ?? initialData?.detail?.references ?? prev.references,
      attachments: initialData?.attachments ?? initialData?.detail?.attachments ?? prev.attachments,
      writers: initialData?.writers ?? initialData?.detail?.writers ?? prev.writers,
      projectId: initialData?.Project?.id ? String(initialData.Project.id) : (prev.projectId || ''),
    }))
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    setSubmitting(true)
    try {
      const detail = {
        fundType: formData.fundType ?? undefined,
        fundTypeText: formData.fundTypeText || undefined,
        contentDesc: formData.contentDesc || undefined,
        pastPublications: formData.pastPublications || undefined,
        purposes: formData.purposes || undefined,
        targetGroups: formData.targetGroups || undefined,
        chapterDetails: formData.chapterDetails || undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        duration: formData.duration || undefined,
        references: formData.references || undefined,
      }
      const attachments = (formData.attachments || []).map(a => ({ id: a.id }))
      const writers = (formData.writers || []).map(w => ({
        fullName: w.fullName || '',
        department: w.department || '',
        faculty: w.faculty || '',
        phone: w.phone || '',
        email: w.email || '',
      }))
      const payload = { type: 'FUNDING', status: 'DRAFT', detail, writers: writers.length ? writers : undefined, attachments }
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

  // Writers helpers
  const addWriter = () => {
    setFormData(prev => ({ ...prev, writers: [...(prev.writers || []), { fullName: '', department: '', faculty: '', phone: '', email: '' }] }))
  }

  const removeWriter = (index) => {
    setFormData(prev => ({ ...prev, writers: (prev.writers || []).filter((_, i) => i !== index) }))
  }

  const updateWriterField = (index, field, value) => {
    setFormData(prev => {
      const writers = [...(prev.writers || [])]
      writers[index] = { ...(writers[index] || {}), [field]: value }
      return { ...prev, writers }
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
        )}
        <FormSection title=" รายละเอียดของผู้แต่งร่วม (ถ้ามี)">
          <FormFieldBlock>
            {/* Display existing writers */}
            {(formData.writers || []).map((writer, index) => (
              <div key={index} className="rounded p-3 mb-3 bg-gray-50/5 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">ผู้แต่งคนที่ {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeWriter(index)}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    ลบ
                  </button>
                </div>
                <FormInput
                  mini={false}
                  label="ชื่อ-นามสกุล"
                  type="text"
                  value={writer.fullName}
                  onChange={(value) => updateWriterField(index, "fullName", value)}
                  placeholder=""
                />
                <FormInput
                  mini={false}
                  label="ภาควิชา"
                  type="text"
                  value={writer.department}
                  onChange={(value) => updateWriterField(index, "department", value)}
                  placeholder=""
                />
                <FormInput
                  mini={false}
                  label="โทรศัพท์"
                  type="text"
                  value={writer.phone}
                  onChange={(value) => updateWriterField(index, "phone", value)}
                  placeholder=""
                />
                <FormInput
                  mini={false}
                  label="อีเมล"
                  type="text"
                  value={writer.email}
                  onChange={(value) => updateWriterField(index, "email", value)}
                  placeholder=""
                />
                <FormInput
                  mini={false}
                  label="สังกัดคณะ/สถาบัน"
                  type="text"
                  value={writer.faculty}
                  onChange={(value) => updateWriterField(index, "faculty", value)}
                  placeholder=""
                />
              </div>
            ))}
            <div>
                <button
                  type="button"
                  onClick={addWriter}
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
            <div className="space-y-1 flex items-center">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">
                  ลักษณะของผลงานวิชาการที่จะขอรับทุน
                </label>
              </div>
              <div className="flex-1 space-y-3">

                <div className='flex gap-4 items-center'>
                  <input
                    type="radio"
                    name="fundType"
                    value="0"
                    checked={formData.fundType === 0}
                    onChange={() => handleInputChange("fundType", 0)}
                    className={`
                  w-auto inline-block
          text-zinc-700
            px-3 py-2 border border-gray-300 rounded-md
            placeholder-gray-400 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
          `}
                  />
                  <span className='text-gray-700 inline-block w-96'>ตำรา ใช้สอนในรายวิชา</span>
                  <input
                    type="text"
                    value={formData.fundType === 0 ? formData.fundTypeText : ''}
                    onChange={(e) => handleInputChange("fundTypeText", e.target.value)}
                    className={`
                  w-full inline-block
          text-zinc-700
            px-3 py-2 border border-gray-300 rounded-md
            placeholder-gray-400 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
          `}
                  />
                </div>
                <div className='flex gap-4 items-center'>
                  <input
                    type="radio"
                    name="fundType"
                    value="1"
                    checked={formData.fundType === 1}
                    onChange={() => handleInputChange("fundType", 1)}
                    className={`
                  w-auto inline-block
          text-zinc-700
            px-3 py-2 border border-gray-300 rounded-md
            placeholder-gray-400 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
          `}
                  />
                  <span className='text-gray-700 inline-block w-96'>หนังสือ(ชื่อไทย และชื่อภาษาอังกฤษ)</span>
                  <input
                    type="text"
                    value={formData.fundType === 1 ? formData.fundTypeText : ''}
                    onChange={(e) => handleInputChange("fundTypeText", e.target.value)}
                    className={`
                  w-full inline-block
          text-zinc-700
            px-3 py-2 border border-gray-300 rounded-md
            placeholder-gray-400 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
          `}
                  />
                </div>
              </div>
            </div>
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
              value={formData.pastPublications}
              onChange={(value) => handleInputChange("pastPublications", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="วัตถุประสงค์ของตำราหรือหนังสือ"
              value={formData.purposes}
              onChange={(value) => handleInputChange("purposes", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="กลุ่มเป้าหมายของตำราหรือหนังสือ"
              value={formData.targetGroups}
              onChange={(value) => handleInputChange("targetGroups", value)}
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
              value={formData.chapterDetails}
              onChange={(value) => handleInputChange("chapterDetails", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormInput
              mini={true}
              label="ตำรา หรือ หนังสือ มีจำนวนประมาณ"
              type="number"
              value={formData.pages}
              onChange={(value) => handleInputChange("pages", parseInt(value))}
              placeholder=""
              after="หน้า"
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormInput
              mini={true}
              label="ระยะเวลา (ปี หรือ เดือน) ที่จะใช้ในการเขียนประมาณ"
              type="date"
              value={formData.duration}
              onChange={(value) => handleInputChange("duration", value)}
              placeholder=""
              after="(ระบุเป็นช่วงเวลาได้)"
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
              value={formData.references}
              onChange={(value) => handleInputChange("references", value)}
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
          <FormSection title="* ผู้ร่วมวิจัย">
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
