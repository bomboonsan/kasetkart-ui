// This is Book Work Form - relates to Project Funding
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSWR, { mutate } from 'swr'
// ใช้ path alias (@/) สำหรับ API ทั้งหมด
import { worksAPI } from '@/lib/api/works'
import { projectAPI } from '@/lib/api/project'
import { profileAPI } from '@/lib/api/profile'
import { api } from '@/lib/api-base'
import { getDocumentId } from '@/utils/strapi'
import { createHandleChange } from '@/utils/form'
import FormSection from './FormSection'
import FormFieldBlock from './FormFieldBlock'
import FormField from './FormField'
import ProjectFundingPicker from './ProjectFundingPicker'
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormCheckbox from './FormCheckbox'
import FormTextarea from './FormTextarea'
import FormDateSelect from './FormDateSelect'
import FormSelect from "./FormSelect";
import dynamic from 'next/dynamic'

const FileUploadField = dynamic(() => import('./FileUploadField'), { ssr: false });
const EditableResearchTeamSection = dynamic(() => import('./EditableResearchTeamSection'), { ssr: false });

import Button from '@/components/ui/Button'

// คอมเมนต์ (ไทย): แก้ไขให้ SweetAlert2 โหลดแบบ dynamic เฉพาะฝั่ง client เท่านั้น
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false });


export default function CreateBookForm({ mode = 'create', workId, initialData }) {
  const router = useRouter()
  const [swalProps, setSwalProps] = useState({})
  
  // Align state to work-book schema
  const [formData, setFormData] = useState({
    project_funding: null, // relation to project-funding (documentId)
    bookType: 0, // ประเภทผลงาน (0=หนังสือ,1=ตำรา)
    titleTH: "", // ชื่อผลงาน (ไทย)
    titleEN: "", // ชื่อผลงาน (อังกฤษ)
    detail: "", // รายละเอียดเบื้องต้นของหนังสือ หรือ ตำรา
    level: "", // ระดับ 0=ระดับชาติ, 1=ระดับนานาชาติ
    publicationDate: "", // วันที่เกิดผลงาน (Date)
    attachments: [],
    writers: [], // Writers array for dynamic management
    __projectFundingObj: undefined, // สำหรับเก็บ object โครงการขอทุนที่เลือก
  })
  const [isLoading, setIsLoading] = useState(false)

  // Fetch existing work-book when editing
  const { data: existingWorkBook } = useSWR(
    mode === 'edit' && workId ? ['work-book', workId] : null,
    () => api.get(`/work-books/${workId}?populate=*`)
  )

  // Prefill when editing
  useEffect(() => {
    if (existingWorkBook?.data) {
      const data = existingWorkBook.data
      setFormData(prev => ({
        ...prev,
    project_funding: getDocumentId(data.project_funding) || null,
        bookType: data.bookType || 0,
        titleTH: data.titleTH || '',
        titleEN: data.titleEN || '',
        detail: data.detail || '',
        level: data.level || 0,
        publicationDate: data.publicationDate ? String(data.publicationDate).slice(0,10) : '',
        attachments: data.attachments || [],
        writers: data.writers || [],
        __projectFundingObj: data.project_funding || undefined,
      }))
    } else if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        publicationDate: initialData.publicationDate ? String(initialData.publicationDate).slice(0,10) : '',
  project_funding: getDocumentId(initialData?.project_funding) || null,
        __projectFundingObj: initialData?.project_funding || undefined,
      }))
    }
  }, [existingWorkBook, initialData])

  // Writers management helpers (like in CreateFundingForm)
  const addWriter = () => {
    setFormData(prev => ({
      ...prev,
      writers: [...prev.writers, { name: '', email: '', affiliation: '' }]
    }))
  }

  const updateWriter = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      writers: prev.writers.map((writer, i) => 
        i === index ? { ...writer, [field]: value } : writer
      )
    }))
  }

  const removeWriter = (index) => {
    setFormData(prev => ({
      ...prev,
      writers: prev.writers.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Construct payload based on work-book schema
      const payload = {
        project_funding: formData.project_funding,
        bookType: formData.bookType,
        titleTH: formData.titleTH,
        titleEN: formData.titleEN,
        detail: formData.detail,
        level: formData.level,
        publicationDate: formData.publicationDate,
        attachments: formData.attachments?.map(att => att.id || att.documentId).filter(Boolean) || [],
        writers: formData.writers // Store writers as JSON
      }

      let result
      if (mode === 'edit' && workId) {
        result = await api.put(`/work-books/${workId}`, { data: payload })
        setSwalProps({ show: true, icon: 'success', title: 'อัปเดตหนังสือ/ตำราสำเร็จ', timer: 1600, showConfirmButton: false })
      } else {
        result = await api.post('/work-books', { data: payload })
        setSwalProps({ show: true, icon: 'success', title: 'บันทึกหนังสือ/ตำราสำเร็จ', timer: 1600, showConfirmButton: false })
      }

      mutate('work-books') // SWR key to revalidate
      
      setTimeout(() => router.push('/form/overview'), 1200)
      
    } catch (error) {
        const msg = error?.response?.data?.error?.message || error?.message || 'เกิดข้อผิดพลาด'
      setSwalProps({ 
        show: true, 
        icon: 'error', 
        title: 'บันทึกไม่สำเร็จ', 
          text: msg
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = createHandleChange(setFormData)

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        <FormSection>
          <FormFieldBlock>
            <ProjectFundingPicker
              label="โครงการขอทุน"
              selectedProject={formData.__projectFundingObj}
                      onSelect={(p) => setFormData(prev => ({ 
                        ...prev, 
                        project_funding: getDocumentId(p), 
                        __projectFundingObj: p,
                        __projectObj: p,
                      }))}
              
            />
          </FormFieldBlock>
          
          <FormFieldBlock>
            <FormRadio
              inline={true}
              
              label="ประเภทผลงาน"
              options={[
                { label: "หนังสือ", value: 0 },
                { label: "ตำรา", value: 1 },
              ]}
              value={formData.bookType}
              onChange={(value) => handleInputChange("bookType", parseInt(value))}
            />
          </FormFieldBlock>
          
          <FormFieldBlock>
            <FormTextarea
              label="ชื่อผลงาน (ไทย)"
              
              value={formData.titleTH}
              onChange={(value) => handleInputChange("titleTH", value)}
              placeholder="กรอกชื่อผลงานภาษาไทย"
            />

            <FormTextarea
              label="ชื่อผลงาน (อังกฤษ)"
              value={formData.titleEN}
              onChange={(value) => handleInputChange("titleEN", value)}
              placeholder="กรอกชื่อผลงานภาษาอังกฤษ"
            />
          </FormFieldBlock>
          
          <FormFieldBlock>
            <FormTextarea
              label="รายละเอียดเบื้องต้นของหนังสือ หรือ ตำรา"
              
              value={formData.detail}
              onChange={(value) => handleInputChange("detail", value)}
              placeholder="กรอกรายละเอียดของหนังสือหรือตำรา"
            />
          </FormFieldBlock>
          
          <FormFieldBlock>
            <FormRadio
              inline={true}
              
              label="ระดับของผลงาน"
              options={[
                { label: "ระดับชาติ", value: 0 },
                { label: "ระดับนานาชาติ", value: 1 },
              ]}
              value={formData.level}
              onChange={(value) => handleInputChange("level", parseInt(value))}
            />
            
            <FormInput
              label="วันที่เกิดผลงาน"
              type="date"
              
              value={formData.publicationDate}
              onChange={(value) => handleInputChange("publicationDate", value)}
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

        <div className='p-4 rounded-md border shadow border-gray-200/70'>
          <FormSection title="* ผู้ร่วมวิจัย">
            <EditableResearchTeamSection project={formData.__projectObj} />
          </FormSection>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            ยกเลิก
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'กำลังบันทึก...' : mode === 'edit' ? 'อัปเดต' : 'บันทึก'}
          </Button>
        </div>
      </form>
    </div>
  )
}
