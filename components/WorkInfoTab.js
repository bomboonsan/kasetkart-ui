'use client'

import TextAreaField from '@/components/ui/TextAreaField'
import EducationSection from './EducationSection'

/**
 * WorkInfoTab (Presentational Component)
 * @param {object} props - The props object.
 * @param {object} props.formData - The form data state from the parent component.
 * @param {Array} props.educations - The array of education objects.
 * @param {object} props.options - The options for select fields, specifically educationLevels.
 * @param {function} props.onFormChange - The handler function to update form data in the parent.
 * @param {function} props.onEducationsChange - The handler function to update the educations array.
 * @returns {JSX.Element}
 * @description
 * คอมโพเนนต์นี้รับผิดชอบการแสดงผลข้อมูลเกี่ยวกับประวัติการทำงาน, ประสบการณ์, และวุฒิการศึกษา
 * เป็น "Dumb Component" ที่รับข้อมูลและฟังก์ชันทั้งหมดมาจาก Parent Component (ProfileEditForm)
 */
export default function WorkInfoTab({
  formData,
  educations,
  options,
  onFormChange,
  onEducationsChange,
}) {

  // Handler สำหรับการเปลี่ยนแปลงค่าในฟอร์ม (Biography, Experience, etc.)
  const handleInputChange = (field, value) => {
    onFormChange(field, value)
  }

  // Handler สำหรับการเปลี่ยนแปลงข้อมูลใน EducationSection
  const handleEducationsChange = (updatedEducations) => {
    onEducationsChange(updatedEducations)
  }

  return (
    <div className="space-y-8">
      {/* ส่วนของประวัติย่อ */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ประวัติย่อ (Biography)</h3>
        <TextAreaField
          value={formData.biography}
          onChange={(value) => handleInputChange('biography', value)}
          placeholder="กรุณาระบุประวัติย่อของคุณ..."
          rows={4}
        />
      </div>

      {/* ส่วนของประสบการณ์ */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ประสบการณ์ (Experience)</h3>
        <TextAreaField
          value={formData.experience}
          onChange={(value) => handleInputChange('experience', value)}
          placeholder="กรุณาระบุประสบการณ์การทำงานของคุณ..."
          rows={4}
        />
      </div>

      {/* ส่วนของความเชี่ยวชาญ */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ความเชี่ยวชาญ (Specialization)</h3>
        <TextAreaField
          value={formData.specialization}
          onChange={(value) => handleInputChange('specialization', value)}
          placeholder="กรุณาระบุความเชี่ยวชาญของคุณ..."
          rows={4}
        />
      </div>

      {/* ส่วนของวุฒิการศึกษา */}
      <EducationSection 
        educations={educations}
        educationLevels={options.educationLevels} // ส่ง educationLevels จาก options prop
        onChange={handleEducationsChange}
        userId={formData.userId} // ส่ง userId จาก formData prop
      />

      {/* ปุ่มบันทึกและยกเลิกถูกย้ายไปที่ Parent Component (ProfileEditForm) แล้ว */}
    </div>
  )
}