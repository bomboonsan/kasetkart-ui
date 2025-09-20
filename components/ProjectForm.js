'use client'

import { useState, useEffect } from 'react'
import { FormSection, FormFieldBlock, FormField } from '@/components/ui'
import UserPicker from "./UserPicker";
import { FormInput } from "@/components/ui";
import FormRadio from "./FormRadio";
import { FormTextarea } from "@/components/ui";
import { FormDateSelect } from "@/components/ui";
import { FormSelect } from "@/components/ui";
import ResearchTeamSection from './ResearchTeamSection'
import FileUploadSection from './FileUploadSection'
import { Button } from '@/components/ui'
import { projectAPI } from '@/lib/api'
import { createHandleChange } from '@/utils'

export default function ProjectForm({ projectId, readonly = true }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fiscalYear: '',
    projectType: '',
    projectMode: '',
    nameTh: '',
    nameEn: '',
    durationStart: '',
    durationEnd: '',
    researchKind: '',
    fundType: '',
    fundName: '',
    budget: '',
    keywords: '',
    icTypes: '',
    impact: '',
    sdg: '',
    status: 'DRAFT'
  })

  useEffect(() => {
    if (projectId) {
      loadProject()
    }
  }, [projectId])

  const loadProject = async () => {
    try {
      setLoading(true)
      const project = await projectAPI.getProject(projectId)
      setFormData({
        fiscalYear: project.fiscalYear || '',
        projectType: project.projectType || '',
        projectMode: project.projectMode || '',
        nameTh: project.nameTh || '',
        nameEn: project.nameEn || '',
        durationStart: project.durationStart ? String(project.durationStart).slice(0,10) : '',
        durationEnd: project.durationEnd ? String(project.durationEnd).slice(0,10) : '',
        researchKind: project.researchKind || '',
        fundType: project.fundType || '',
        fundName: project.fundName || '',
        budget: project.budget || '',
        keywords: project.keywords || '',
        icTypes: project.icTypes || '',
        impact: project.impact || '',
        sdg: project.sdg || '',
        status: project.status || 'DRAFT'
      })
    } catch (err) {
      setError(err.message || 'ไม่สามารถโหลดข้อมูลโครงการ')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = createHandleChange(setFormData)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if (projectId) {
        await projectAPI.updateProject(projectId, formData)
      } else {
        await projectAPI.createProject(formData)
      }
      window.location.href = '/research'
    } catch (err) {
      setError(err.message || 'ไม่สามารถบันทึกข้อมูลโครงการ')
    } finally {
      setLoading(false)
    }
  }

  if (loading && projectId) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">กำลังโหลดข้อมูลโครงการ...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <FormSection title="ข้อมูลโครงการ">
          <div className="space-y-6">
            <FormFieldBlock>
              <FormInput
                label="ปีงบประมาณ"
                value={formData.fiscalYear}
                onChange={(value) => handleInputChange('fiscalYear', value)}
                disabled={readonly}
                type="number"
              />
              <div className="md:col-span-2">
                <FormInput
                  label="ประเภทโครงการ"
                  value={formData.projectType}
                  onChange={(value) => handleInputChange('projectType', value)}
                  disabled={readonly}
                />
              </div>
            </FormFieldBlock>

            <FormFieldBlock>
              <FormInput
                label="รูปแบบโครงการ"
                value={formData.projectMode}
                onChange={(value) => handleInputChange('projectMode', value)}
                disabled={readonly}
              />
            </FormFieldBlock>

            <FormFieldBlock>
              <div className="md:col-span-3">
                <FormTextarea
                  label="ชื่อโครงการ (ไทย)"
                  value={formData.nameTh}
                  onChange={(value) => handleInputChange('nameTh', value)}
                  disabled={readonly}
                  rows={3}
                />
              </div>
            </FormFieldBlock>

            <FormFieldBlock>
              <div className="md:col-span-3">
                <FormTextarea
                  label="ชื่อโครงการ (อังกฤษ)"
                  value={formData.nameEn}
                  onChange={(value) => handleInputChange('nameEn', value)}
                  disabled={readonly}
                  rows={3}
                />
              </div>
            </FormFieldBlock>

            <FormFieldBlock>
              <FormInput
                label="วันที่เริ่มต้น"
                value={formData.durationStart}
                onChange={(value) => handleInputChange('durationStart', value)}
                disabled={readonly}
                type="date"
              />
              <FormInput
                label="วันที่สิ้นสุด"
                value={formData.durationEnd}
                onChange={(value) => handleInputChange('durationEnd', value)}
                disabled={readonly}
                type="date"
              />
            </FormFieldBlock>

            <FormFieldBlock>
              <FormInput
                label="ประเภทวิจัย"
                value={formData.researchKind}
                onChange={(value) => handleInputChange('researchKind', value)}
                disabled={readonly}
              />
              <FormInput
                label="ประเภททุน"
                value={formData.fundType}
                onChange={(value) => handleInputChange('fundType', value)}
                disabled={readonly}
              />
              <FormInput
                label="ชื่อทุน"
                value={formData.fundName}
                onChange={(value) => handleInputChange('fundName', value)}
                disabled={readonly}
              />
            </FormFieldBlock>

            <FormFieldBlock>
              <FormInput
                label="งบประมาณ"
                value={formData.budget}
                onChange={(value) => handleInputChange('budget', value)}
                disabled={readonly}
                type="number"
              />
            </FormFieldBlock>

            <FormFieldBlock>
              <div className="md:col-span-3">
                <FormTextarea
                  label="คำสำคัญ"
                  value={formData.keywords}
                  onChange={(value) => handleInputChange('keywords', value)}
                  disabled={readonly}
                  rows={2}
                />
              </div>
            </FormFieldBlock>

            <FormFieldBlock>
              <FormInput
                label="ประเภท IC"
                value={formData.icTypes}
                onChange={(value) => handleInputChange('icTypes', value)}
                disabled={readonly}
              />
              <FormInput
                label="Impact"
                value={formData.impact}
                onChange={(value) => handleInputChange('impact', value)}
                disabled={readonly}
              />
              <FormInput
                label="SDG"
                value={formData.sdg}
                onChange={(value) => handleInputChange('sdg', value)}
                disabled={readonly}
              />
            </FormFieldBlock>
          </div>
        </FormSection>
      </div>

      <ResearchTeamSection />
      <FileUploadSection />

      {!readonly && (
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </div>
      )}
    </div>
  )
}
