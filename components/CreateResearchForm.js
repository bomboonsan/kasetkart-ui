'use client'

import { useState } from 'react'
import FormSection from './FormSection'
import FormField from './FormField'
import SelectField from './SelectField'
import TextAreaField from './TextAreaField'
import FileUploadField from './FileUploadField'
import ResearchTeamTable from './ResearchTeamTable'
import Button from './Button'

export default function CreateResearchForm() {
  const [formData, setFormData] = useState({
    code: '',
    titleThai: '',
    titleEnglish: '',
    budget: '',
    thaiAbstract: '',
    englishAbstract: '',
    objectives: '',
    methodology: '',
    researcher: '',
    coResearcher: '',
    budget: '',
    funding: '',
    type: '',
    impact: '',
    sdg: '',
    attachments: []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* Basic Information */}
        <FormSection title="ข้อมูลพื้นฐาน">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="รหัสโครงการ"
              value={formData.code}
              onChange={(value) => handleInputChange('code', value)}
              placeholder="2548"
            />
            <div /> {/* Empty div for spacing */}
          </div>

          <div className="space-y-4">
            <FormField
              label="ชื่อโครงการวิจัย"
              required
              value={formData.titleThai}
              onChange={(value) => handleInputChange('titleThai', value)}
              placeholder="กรุณาป้อนชื่อโครงการวิจัยภาษาไทย"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="ตั้งแต่วันที่โครงการ"
                type="date"
                value={formData.startDate}
                onChange={(value) => handleInputChange('startDate', value)}
              />
              <FormField
                label="สิ้นสุดโครงการ"
                type="date"
                value={formData.endDate}
                onChange={(value) => handleInputChange('endDate', value)}
              />
            </div>

            <FormField
              label="งบประมาณโครงการ"
              type="number"
              value={formData.budget}
              onChange={(value) => handleInputChange('budget', value)}
              placeholder="0"
            />
          </div>
        </FormSection>

        {/* Research Details */}
        <FormSection title="รายละเอียดการวิจัย">
          <div className="space-y-4">
            <TextAreaField
              label="บทคัดย่อโครงการวิจัยภาษาไทย (Thai)"
              required
              value={formData.thaiAbstract}
              onChange={(value) => handleInputChange('thaiAbstract', value)}
              placeholder="กรุณาป้อนบทคัดย่อโครงการวิจัยภาษาไทย"
              rows={5}
            />

            <TextAreaField
              label="บทคัดย่อโครงการวิจัยภาษาอังกฤษ (English)"
              value={formData.englishAbstract}
              onChange={(value) => handleInputChange('englishAbstract', value)}
              placeholder="Please enter project abstract in English"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextAreaField
              label="วัตถุประสงค์ โครงการวิจัย/การดำเนินงาน"
              value={formData.objectives}
              onChange={(value) => handleInputChange('objectives', value)}
              rows={3}
            />
            <TextAreaField
              label="ประโยชน์ที่คาดว่าจะได้รับ"
              value={formData.methodology}
              onChange={(value) => handleInputChange('methodology', value)}
              rows={3}
            />
          </div>
        </FormSection>

        {/* Research Team */}
        <FormSection title="ข้อมูลนักวิจัย">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="หัวหน้าโครงการวิจัย โครงการวิจัย/ผู้ประสานการดำเนินงาน"
                value={formData.researcher}
                onChange={(value) => handleInputChange('researcher', value)}
                options={[
                  { value: '', label: 'เลือกหัวหน้าโครงการ' },
                  { value: 'researcher1', label: 'นักวิจัยคนที่ 1' },
                  { value: 'researcher2', label: 'นักวิจัยคนที่ 2' }
                ]}
              />
              <SelectField
                label="สถาบันเจ้าของผลงาน"
                value={formData.institution}
                onChange={(value) => handleInputChange('institution', value)}
                options={[
                  { value: '', label: 'เลือกสถาบัน' },
                  { value: 'ku', label: 'มหาวิทยาลัยเกษตรศาสตร์' }
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="ประเภทผลงาน"
                value={formData.workType}
                onChange={(value) => handleInputChange('workType', value)}
                options={[
                  { value: '', label: 'เลือกประเภทผลงาน' },
                  { value: 'research', label: 'งานวิจัย' },
                  { value: 'development', label: 'งานพัฒนา' }
                ]}
              />
              <SelectField
                label="ลักษณะผลงาน"
                value={formData.workNature}
                onChange={(value) => handleInputChange('workNature', value)}
                options={[
                  { value: '', label: 'เลือกลักษณะผลงาน' },
                  { value: 'individual', label: 'ผลงานเดี่ยว' },
                  { value: 'collaborative', label: 'ผลงานร่วม' }
                ]}
              />
            </div>

            <SelectField
              label="ทีมนักวิจัย"
              value={formData.teamType}
              onChange={(value) => handleInputChange('teamType', value)}
              options={[
                { value: '', label: 'เลือกประเภททีม' },
                { value: 'internal', label: 'ทีมภายใน' },
                { value: 'external', label: 'ทีมภายนอก' }
              ]}
            />

            <TextAreaField
              label="รายชื่อ"
              value={formData.teamMembers}
              onChange={(value) => handleInputChange('teamMembers', value)}
              placeholder="กรุณาระบุรายชื่อสมาชิกทีม"
              rows={4}
            />
          </div>
        </FormSection>

        {/* Project Classification */}
        <FormSection title="การจำแนกโครงการ">
          <div className="space-y-4">
            <FormField
              label="งบวิจัย"
              value={formData.researchBudget}
              onChange={(value) => handleInputChange('researchBudget', value)}
              placeholder="0"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full-Time ข้อมูลผู้วิจัยหลักภาษา * และ Part-time project
              </label>
              <div className="text-sm text-gray-600">
                กรอก ชม. กรอกเอง บัณฑิต ปริญญาเอก ยอมรับวิทยาเขตนำส่ง ประเทศ และ site project
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SelectField
                label="ประเภท"
                value={formData.type}
                onChange={(value) => handleInputChange('type', value)}
                options={[
                  { value: '', label: 'เลือกประเภท' },
                  { value: 'basic', label: 'พื้นฐาน' },
                  { value: 'applied', label: 'ประยุกต์' }
                ]}
              />
              <SelectField
                label="Impact"
                value={formData.impact}
                onChange={(value) => handleInputChange('impact', value)}
                options={[
                  { value: '', label: 'เลือกผลกระทบ' },
                  { value: 'high', label: 'สูง' },
                  { value: 'medium', label: 'ปานกลาง' },
                  { value: 'low', label: 'ต่ำ' }
                ]}
              />
              <SelectField
                label="SDG"
                value={formData.sdg}
                onChange={(value) => handleInputChange('sdg', value)}
                options={[
                  { value: '', label: 'เลือก SDG' },
                  { value: '1', label: 'SDG 1' },
                  { value: '2', label: 'SDG 2' }
                ]}
              />
            </div>
          </div>
        </FormSection>

        {/* File Upload */}
        <FormSection title="ไฟล์แนบ">
          <FileUploadField
            label="อัปโหลดไฟล์"
            onFilesChange={(files) => handleInputChange('attachments', files)}
            accept=".pdf,.doc,.docx"
            multiple
          />
        </FormSection>

        {/* Research Team Table */}
        <FormSection title="นักวิจัย/ผู้ร่วมวิจัย ของโครงการนี้">
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
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>

      </form>
    </div>
  )
}
