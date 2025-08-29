'use client'

import ProjectForm from './ProjectForm'

export default function ItemDemoForm({ projectId, readonly = true }) {
  // Use ProjectForm component which has all the API integration
  return <ProjectForm projectId={projectId} readonly={readonly} />
}
import FormTextarea from "./FormTextarea";
import FormDateSelect from "./FormDateSelect";
import FormSelect from "./FormSelect";
import SelectField from './SelectField'
import TextAreaField from './TextAreaField'
import ResearchTeamSection from './ResearchTeamSection'
import FileUploadSection from './FileUploadSection'
import Button from './Button'

export default function ItemDemoForm() {
  const [formData, setFormData] = useState({
    projectNumber: '19',
    projectTitle: 'การปรับตัวของผู้ประกอบการในตลาดอีคอมเมิร์ซในประเทศไทยยุคหลังโควิด',
    year: '2568',
    organizationType: 'ภายในมหาวิทยาลัย',
    researchType: 'ภายนอกมหาวิทยาลัย',
    category: 'ศ',
    titleThai: 'การปรับตัวของผู้ประกอบการในตลาดอีคอมเมิร์ซในประเทศไทยยุคหลังโควิด-19',
    titleEnglish: 'The Adaptation of The Entrepreneurs in E-commerce Market after COVID-19 Crisis',
    duration: 'ดำเนินการต่อเนื่องจนสิ้นสุดโครงการ',
    period: 'ตั้งแต่ วันที่ 1 มกราคม 2565 ถึง วันที่ 1 มกราคม 2568',
    researcherInfo: 'หัวหน้าโครงการวิจัยและผู้ประสานงาน (ภายในมหาวิทยาลัย)',
    participants: 'ผู้เข้าร่วมโครงการ\nส่วนต่างในจำงาน',
    methodology: 'ผู้ร่วมสร้างอาชีพ\nวิจัยเศรษฐกิจใหม่',
    objectives: 'เพื่อศึกษาแนวการเสริม',
    budget: '200,000',
    funding: 'ทุนอุดหุน : ปกติ',
    apType: 'Applied',
    impact: 'Research & Scholarly Impact',
    sdg: 'SDG 8 - Decent Work and Economic Growth'
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    console.log('Submitting form data:', formData)
  }

  return (
    <div className="space-y-6">
          {/* Project Info Section */}
    <div className="bg-white rounded-lg shadow-sm p-6">
              
      <FormSection title="">
        <div className="space-y-6">
          <FormFieldBlock>
            <FormTextarea
              label="โครงการเลขที่"
              value={formData.projectNumber}
              onChange={(value) => handleInputChange('projectNumber', value)}
              disabled
            />
            <div className="md:col-span-2">
              <FormTextarea
                label="หัวข้อโครงการวิจัย"
                value={formData.projectTitle}
                onChange={(value) => handleInputChange('projectTitle', value)}
                disabled
              />
            </div>
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="ปีงบประมาณ"
              value={formData.year}
              onChange={(value) => handleInputChange('year', value)}
              disabled
            />
            <FormTextarea
              label="ประเภทหน่วยงาน"
              value={formData.organizationType}
              onChange={(value) => handleInputChange('organizationType', value)}
              disabled
            />
            <FormTextarea
              label="ประเภทผู้ประกอบการ"
              value={formData.researchType}
              onChange={(value) => handleInputChange('researchType', value)}
              disabled
            />
          </FormFieldBlock>

          <FormFieldBlock className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <FormTextarea
              label="ประเภทตามหมวดหมู่"
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              disabled
            />
            <div className="md:col-span-2">
              <FormTextarea
                label="ชื่อแผนงานวิจัยคานและเงื่อนไขการดำเนินงาน (ไทย)"
                value={formData.titleThai}
                onChange={(value) => handleInputChange('titleThai', value)}
                disabled
              />
            </div>
            <div className="md:col-span-2">
              <FormTextarea
                label="ชื่อแผนงานวิจัยผลงานตามแบบแผนดำเนินงาน (อังกฤษ)"
                value={formData.titleEnglish}
                onChange={(value) => handleInputChange('titleEnglish', value)}
                disabled
              />
            </div>
            <FormTextarea
              label="ระยะเวลาดำเนินงาน"
              value={formData.duration}
              onChange={(value) => handleInputChange('duration', value)}
              disabled
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="ตั้งแต่/จนถึงกำหนดเวลา"
              value={formData.period}
              onChange={(value) => handleInputChange('period', value)}
              disabled
            />
            <FormTextarea
              label="ค่าใช้จ่ายและสถานการณ์ดำเนินการวิจัย (ภายในมหาวิทยาลัย)"
              value={formData.researcherInfo}
              onChange={(value) => handleInputChange('researcherInfo', value)}
              rows={2}
              disabled
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="ผู้เข้าร่วม"
              value={formData.participants}
              onChange={(value) => handleInputChange('participants', value)}
              rows={2}
              disabled
            />
            <FormTextarea
              label="กำหนดดำเนินงาน"
              value={formData.methodology}
              onChange={(value) => handleInputChange('methodology', value)}
              rows={2}
              disabled
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="วัตถุประสงค์"
              value={formData.objectives}
              onChange={(value) => handleInputChange('objectives', value)}
              rows={1}
              disabled
            />
            <FormTextarea
              label="งบประมาณ"
              value={formData.budget}
              onChange={(value) => handleInputChange('budget', value)}
              disabled
            />
            <FormTextarea
              label="ที่มาของทุน"
              value={formData.funding}
              onChange={(value) => handleInputChange('funding', value)}
              disabled
            />
            <FormTextarea
              label="IC Types"
              value={formData.apType}
              onChange={(value) => handleInputChange('apType', value)}
              disabled
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="Impact"
              value={formData.impact}
              onChange={(value) => handleInputChange('impact', value)}
              disabled
            />
            <FormTextarea
              label="SDG"
              value={formData.sdg}
              onChange={(value) => handleInputChange('sdg', value)}
              disabled
            />
          </FormFieldBlock>
        </div>
      </FormSection>
    </div>

      {/* Research Team Section */}
        <ResearchTeamSection />
          {/* File Upload Section */}
          <FileUploadSection />

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          variant="success"
          onClick={handleSubmit}
          className="px-8 py-3 text-white font-medium"
        >
          สร้างข้อมูลพื้นฐานการรูปแบบบรรณานุกรม
        </Button>
      </div>
    </div>
  )
}
