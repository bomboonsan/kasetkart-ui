// This is Project Funding Form

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// ใช้ path alias (@/) สำหรับ API (คงพฤติกรรมเดิม)
import { projectAPI } from '@/lib/api/project'
import { api } from '@/lib/api-base'
import { stripUndefined } from '@/utils/strapi'
import { createHandleChange } from '@/utils/form'
import useSWR, { mutate } from 'swr'
import FormSection from './FormSection'
import FormFieldBlock from './FormFieldBlock'
import FormInput from "./FormInput";
import FormTextarea from './FormTextarea'
import FileUploadField from './FileUploadField'
import Button from '@/components/ui/Button'
import dynamic from 'next/dynamic'
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })

export default function CreateFundingForm({ mode = 'create', workId, initialData }) {
  const router = useRouter()
  const [swalProps, setSwalProps] = useState({})
  
  // Align state to project-funding schema
  const [formData, setFormData] = useState({
    writers: [], // json array of { fullName, department, faculty , phone, email }
    fundType:"", // ลักษณะของผลงานวิชาการที่จะขอรับทุน (Int) 0=ตำรา ใช้สอนในรายวิชา, 1=หนังสือ(ชื่อไทย และชื่อภาษาอังกฤษ)
    fundTypeText: '', // ข้อความจาก radio button ลักษณะของผลงานวิชาการที่จะขอรับทุน
    contentDesc: '', // คำอธิบายเนื้อหาของตำราหรือหนังสือ
    pastPublications: '', // เอกสารทางวิชาการ ตำรา หรือ หนังสือ
    purpose: '', // วัตถุประสงค์ของตำราหรือหนังสือ (schema: purpose)
    targetGroup: '', // กลุ่มเป้าหมายของตำราหรือหนังสือ (schema: targetGroup)
    chapterDetails: '', // การแบ่งบทและรายละเอียดในแต่ละบทของตำรา/หนังสือ
    pages: "", // ตำรา หรือ หนังสือ มีจำนวนประมาณ (Int)
    duration: '', // ระยะเวลา (ปี หรือ เดือน) ที่จะใช้ในการเขียนประมาณ (Date)
    references: '', // รายชื่อหนังสือและเอกสารอ้างอิง (บรรณานุกรม)
    attachments: [],
  });

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Load existing data when editing
  const { data: workRes, error: workError } = useSWR(
    mode === 'edit' && workId ? ['project-funding', workId] : null,
    () => projectAPI.getFunding(workId) // Assuming a getFunding exists
  )

  // Prefill when editing
  useEffect(() => {
    if (!workRes?.data) return
    const work = workRes.data
    setFormData(prev => ({
      ...prev,
      writers: work.writers || [],
      fundType: work.fundType ?? 0,
      fundTypeText: work.fundTypeText || '',
      contentDesc: work.contentDesc || '',
      pastPublications: work.pastPublications || '',
      purpose: work.purpose || '',
      targetGroup: work.targetGroup || '',
      chapterDetails: work.chapterDetails || '',
      pages: work.pages || 0,
      duration: work.duration ? String(work.duration).slice(0,10) : '',
      references: work.references || '',
      attachments: work.attachments || [],
    }))
  }, [workRes])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    setSubmitting(true)
    
    try {
      // Construct payload based on project-funding schema
      const payload = {
        writers: formData.writers.length > 0 ? formData.writers : undefined,
        fundType: formData.fundType,
        fundTypeText: formData.fundTypeText || undefined,
        contentDesc: formData.contentDesc || undefined,
        pastPublications: formData.pastPublications || undefined,
        purpose: formData.purpose || undefined,
        targetGroup: formData.targetGroup || undefined,
        chapterDetails: formData.chapterDetails || undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        duration: formData.duration || undefined,
        references: formData.references || undefined,
        attachments: (formData.attachments || []).map(a => a.id).filter(Boolean),
      }

  // Clean payload using shared helper
  const cleanPayload = stripUndefined(payload)

      let result;
      if (mode === 'edit' && workId) {
        // Using api.put with { data: payload } wrapper, similar to project-partner creation
  result = await api.put(`/project-fundings/${workId}`, { data: cleanPayload })
        setSwalProps({ show: true, icon: 'success', title: 'แก้ไขข้อมูลสำเร็จ', timer: 1600, showConfirmButton: false })
      } else {
        // Using api.post with { data: payload } wrapper
  result = await api.post('/project-fundings', { data: cleanPayload })
        setSwalProps({ show: true, icon: 'success', title: 'สร้างข้อมูลสำเร็จ', timer: 1600, showConfirmButton: false })
      }

      // Refresh data and navigate
      mutate('project-fundings') // SWR key to revalidate
      setTimeout(() => router.push('/form/overview'), 1200)

    } catch (err) {
      const errorMsg = err?.response?.data?.error?.message || err?.message || 'เกิดข้อผิดพลาดในการบันทึก'
      setError(errorMsg)
      setSwalProps({ 
        show: true, 
        icon: 'error', 
        title: 'บันทึกไม่สำเร็จ', 
        text: errorMsg, 
        timer: 2200 
      })
    } finally {
      setSubmitting(false)
    }
  };

  const handleInputChange = createHandleChange(setFormData)

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
              value={formData.purpose}
              onChange={(value) => handleInputChange("purpose", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="กลุ่มเป้าหมายของตำราหรือหนังสือ"
              value={formData.targetGroup}
              onChange={(value) => handleInputChange("targetGroup", value)}
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
              // ปรับให้รองรับการอัปโหลดไฟล์หลายครั้งแบบสะสม
              value={formData.attachments}
              onFilesChange={(attachments) => handleInputChange("attachments", attachments)}
              accept=".pdf,.doc,.docx"
              multiple
            />
          </FormFieldBlock>
        </FormSection>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            ยกเลิก
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'กำลังบันทึก...' : (mode === 'edit' ? 'แก้ไข' : 'บันทึก')}
          </Button>
        </div>
      </form>
    </div>
  );
}
