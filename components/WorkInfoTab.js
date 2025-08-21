'use client'

import { useState } from 'react'
import FormField from './FormField'
import TextAreaField from './TextAreaField'
import Button from './Button'

export default function WorkInfoTab() {
  const [formData, setFormData] = useState({
    biography: '',
    experience: '',
    specialization: '',
    education: [
      'ปริญญาเอก & ดร.ปรัชญา',
      'บริหารธุรกิจมหาบัณฑิต (M.B.A.) การจัดการทั่วไป',
      'ปริญญาตรี 1 ระดับ (ครุ)',
      'ปริญญาตรี 1 ระดับ กลุ่ม (S.S./ครู หรือ)' 
    ]
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log('Saving work info:', formData)
  }

  return (
    <div className="space-y-8">
      {/* Biography Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ประวัติย่อ</h3>
        <TextAreaField
          label="เกี่ยวกับตัวคุณ"
          value={formData.biography}
          onChange={(value) => handleInputChange('biography', value)}
          placeholder="กรุณาระบุประวัติย่อของคุณ..."
          rows={4}
        />
      </div>

      {/* Experience Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ประสบการณ์การทำงาน</h3>
        <TextAreaField
          label="ประสบการณ์ทำงาน"
          value={formData.experience}
          onChange={(value) => handleInputChange('experience', value)}
          placeholder="กรุณาระบุประสบการณ์การทำงานของคุณ..."
          rows={4}
        />
      </div>

      {/* Education Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">การศึกษาที่ได้รับการยอมรับ</h3>
        <div className="space-y-3">
          {formData.education.map((edu, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <FormField
                value={edu}
                onChange={(value) => {
                  const newEducation = [...formData.education]
                  newEducation[index] = value
                  handleInputChange('education', newEducation)
                }}
                placeholder="กรุณาระบุการศึกษา"
              />
              <button className="text-red-500 hover:text-red-700 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => {
            const newEducation = [...formData.education, '']
            handleInputChange('education', newEducation)
          }}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>เพิ่มการศึกษา</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline">
          ยกเลิก
        </Button>
        <Button variant="primary" onClick={handleSave}>
          บันทึก
        </Button>
      </div>
    </div>
  )
}
