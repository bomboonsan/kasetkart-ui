'use client'

import { useState } from 'react'
import ProfileImageUpload from './ProfileImageUpload'
import FormField from './FormField'
import SelectField from './SelectField'
import Button from './Button'

export default function GeneralInfoTab() {
  const [formData, setFormData] = useState({
    firstName: 'ธีรวิชญ์',
    lastName: 'วงศเพียร',
    email: 'theerawich@ku.ac.th',
    phone: '+66-2-942-8177 ต่อ 111205',
    nameEn: 'Theerawich Wongpaye',
    position: 'ผู้อำนวยการ',
    department: 'Accounting & Finance'
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log('Saving profile data:', formData)
    // TODO: Implement save logic
  }

  const handleCancel = () => {
    // TODO: Implement cancel logic or navigate back
    console.log('Cancel edit')
  }

  return (
    <div className="space-y-8">
      {/* Profile Image Section */}
      <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-8">
        <div className="flex-shrink-0">
          <ProfileImageUpload />
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="ชื่อ"
              value={formData.firstName}
              onChange={(value) => handleInputChange('firstName', value)}
              placeholder="กรุณาระบุชื่อ"
            />
            <FormField
              label="นามสกุล"
              value={formData.lastName}
              onChange={(value) => handleInputChange('lastName', value)}
              placeholder="กรุณาระบุนามสกุล"
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
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              placeholder="กรุณาระบุเบอร์โทร"
            />
          </div>

          <FormField
            label="ชื่อ-นามสกุล ภาษาอังกฤษ"
            value={formData.nameEn}
            onChange={(value) => handleInputChange('nameEn', value)}
            placeholder="กรุณาระบุชื่อ-นามสกุล ภาษาอังกฤษ"
          />
        </div>
      </div>

      {/* Work Information Section */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-6">ข้อมูลการทำงาน</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="ตำแหน่งงาน"
            value={formData.position}
            onChange={(value) => handleInputChange('position', value)}
            placeholder="กรุณาระบุตำแหน่งงาน"
          />
          
          <SelectField
            label="แผนกที่สังกัด"
            value={formData.department}
            onChange={(value) => handleInputChange('department', value)}
            options={[
              { value: 'Accounting & Finance', label: 'Accounting & Finance' },
              { value: 'IT Department', label: 'แผนกไอที' },
              { value: 'HR Department', label: 'แผนกทรัพยากรมนุษย์' },
              { value: 'Research Department', label: 'แผนกวิจัย' }
            ]}
          />

          <FormField
            label="ปีที่เข้าทำงาน"
            type="number"
            value="2019"
            onChange={(value) => handleInputChange('startYear', value)}
            placeholder="พ.ศ."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" onClick={handleCancel}>
          ยกเลิกการแก้ไข
        </Button>
        <Button variant="primary" onClick={handleSave}>
          บันทึก
        </Button>
      </div>
    </div>
  )
}
