'use client'

import ProfileImageUpload from './ProfileImageUpload'
import FormField from '@/components/FormField'
import SelectField from '@/components/SelectField'

/**
 * GeneralInfoTab (Presentational Component)
 * @param {object} props - The props object.
 * @param {object} props.formData - The form data state from the parent component.
 * @param {object} props.options - The options for all select fields.
 * @param {function} props.onFormChange - The handler function to update form data in the parent.
 * @returns {JSX.Element}
 * @description
 * คอมโพเนนต์นี้เป็น "Presentational Component" หรือ "Dumb Component" ที่รับผิดชอบเฉพาะการแสดงผล UI ของแท็บข้อมูลทั่วไป
 * ไม่มีการจัดการ State หรือ Logic ในการดึง/บันทึกข้อมูลเอง แต่จะรับข้อมูลและฟังก์ชันทั้งหมดมาจาก Parent Component (ProfileEditForm)
 */
export default function GeneralInfoTab({ formData, options, onFormChange }) {

  // Handler สำหรับการเปลี่ยนแปลงค่าในฟอร์ม
  // โดยจะเรียกฟังก์ชัน onFormChange ที่ได้รับมาจาก props เพื่อส่งข้อมูลกลับไปให้ Parent Component อัปเดต
  const handleInputChange = (field, value) => {
    onFormChange(field, value)
  }

  return (
    <div className="space-y-8">
      {/* ส่วนข้อมูลโปรไฟล์พื้นฐาน */}
      <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-8">
        <div className="flex-shrink-0">
          {/* หมายเหตุ: คอมโพเนนต์ ProfileImageUpload อาจจะต้องมีการ refactor เพิ่มเติม
              เพื่อให้ทำงานกับ State ที่ถูกยกขึ้นไปจัดการที่ ProfileEditForm ได้อย่างสมบูรณ์ 
              แต่ในที่นี้จะคงไว้ตามเดิมก่อนเพื่อให้ส่วนอื่นทำงานได้ */}
          <ProfileImageUpload />
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="ชื่อ (ภาษาไทย)"
              value={formData.firstNameTH}
              onChange={(value) => handleInputChange('firstNameTH', value)}
              placeholder="กรุณาระบุชื่อ"
            />
            <FormField
              label="นามสกุล (ภาษาไทย)"
              value={formData.lastNameTH}
              onChange={(value) => handleInputChange('lastNameTH', value)}
              placeholder="กรุณาระบุนามสกุล"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="ชื่อ (ภาษาอังกฤษ)"
              value={formData.firstNameEN}
              onChange={(value) => handleInputChange('firstNameEN', value)}
              placeholder="First Name"
            />
            <FormField
              label="นามสกุล (ภาษาอังกฤษ)"
              value={formData.lastNameEN}
              onChange={(value) => handleInputChange('lastNameEN', value)}
              placeholder="Last Name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="อีเมล"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              placeholder="กรุณาระบุอีเมล"
            />
            <FormField
              label="เบอร์โทร"
              value={formData.telephoneNo}
              onChange={(value) => handleInputChange('telephoneNo', value)}
              placeholder="กรุณาระบุเบอร์โทร"
            />
          </div>
        </div>
      </div>

      {/* ส่วนข้อมูลการทำงานที่เกี่ยวข้องกับ Relations */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-6">ข้อมูลการทำงานและสังกัด</h3>
        
        {/* เพิ่มฟิลด์สำหรับ Relations ที่ขาดไป */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="ประเภทนักวิชาการ"
            value={formData.academic_type}
            onChange={(value) => handleInputChange('academic_type', value)}
            options={options.academicTypes}
            placeholder="เลือกประเภทนักวิชาการ"
          />
          <SelectField
            label="ประเภทการมีส่วนร่วม"
            value={formData.participation_type}
            onChange={(value) => handleInputChange('participation_type', value)}
            options={options.participationTypes}
            placeholder="เลือกประเภทการมีส่วนร่วม"
          />
          <SelectField
            label="หน่วยงาน"
            value={formData.organization}
            onChange={(value) => handleInputChange('organization', value)}
            options={options.organizations}
            placeholder="เลือกหน่วยงาน"
          />
           <SelectField
            label="คณะ"
            value={formData.faculty}
            onChange={(value) => handleInputChange('faculty', value)}
            options={options.faculties}
            placeholder="เลือกคณะ"
          />
          <SelectField
            label="ภาควิชา/แผนก"
            value={formData.department}
            onChange={(value) => handleInputChange('department', value)}
            options={options.departments}
            placeholder="เลือกภาควิชา/แผนก"
          />
        </div>
      </div>
    </div>
  )
}