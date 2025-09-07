"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { projectAPI } from '@/lib/api'
import PageHeader from '@/components/PageHeader'
import FormSection from '@/components/FormSection'
import FormFieldBlock from '@/components/FormFieldBlock'
import FormInput from '@/components/FormInput'
import FormTextarea from '@/components/FormTextarea'
import ResearchTeamReadonly from '@/components/ResearchTeamReadonly'

function toDash(v) {
  if (v === null || v === undefined) return '-'
  if (typeof v === 'string' && v.trim() === '') return '-'
  return String(v)
}

function isoDate(v) {
  if (!v) return '-'
  try { return String(v).slice(0,10) } catch { return '-' }
}

export default function ViewProjectPage() {
  const params = useParams()
  const id = params?.id
  
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadProject()
    }
  }, [id])

  const loadProject = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await projectAPI.getProject(id)
      
      // Handle different response structures
      const projectData = response?.data || response
      setProject(projectData)
    } catch (err) {
      console.error('Error loading project:', err)
      setError('ไม่สามารถโหลดข้อมูลโครงการได้')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="รายละเอียดโครงการวิจัย" />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">
          <p>{error}</p>
        </div>
      ) : !project ? (
        <div className="p-4 text-gray-500">ไม่พบข้อมูลโครงการ</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <form className="p-6 space-y-8">
            <FormSection title="ข้อมูลโครงการ">
              <FormFieldBlock>
                <FormInput label="ปีงบประมาณ" type="text" value={toDash(project.fiscalYear)} readOnly />
                <div className="md:col-span-2">
                  <FormInput label="ประเภทโครงการ" type="text" value={toDash(project.projectType)} readOnly />
                </div>
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="รูปแบบโครงการ" type="text" value={toDash(project.projectMode)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <div className="md:col-span-3">
                  <FormTextarea label="ชื่อโครงการ (ไทย)" value={toDash(project.nameTh)} readOnly rows={3} />
                </div>
              </FormFieldBlock>

              <FormFieldBlock>
                <div className="md:col-span-3">
                  <FormTextarea label="ชื่อโครงการ (อังกฤษ)" value={toDash(project.nameEn)} readOnly rows={3} />
                </div>
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="วันที่เริ่มต้น" type="text" value={isoDate(project.durationStart)} readOnly />
                <FormInput label="วันที่สิ้นสุด" type="text" value={isoDate(project.durationEnd)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="ประเภทวิจัย" type="text" value={toDash(project.researchKind)} readOnly />
                <FormInput label="ประเภททุน" type="text" value={toDash(project.fundType)} readOnly />
                <FormInput label="ชื่อทุน" type="text" value={toDash(project.fundName)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="งบประมาณ" type="text" value={toDash(project.budget)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <div className="md:col-span-3">
                  <FormTextarea label="คำสำคัญ" value={toDash(project.keywords)} readOnly rows={2} />
                </div>
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="ประเภท IC" type="text" value={toDash(project.icTypes)} readOnly />
                <FormInput label="Impact" type="text" value={toDash(project.impact)} readOnly />
                <FormInput label="SDG" type="text" value={toDash(project.sdg)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="สถานะ" type="text" value={toDash(project.status)} readOnly />
              </FormFieldBlock>
            </FormSection>

            <FormSection title="ผู้ร่วมวิจัย">
              <ResearchTeamReadonly projectId={project.id || project.documentId} />
            </FormSection>
          </form>
        </div>
      )}
    </div>
  )
}
