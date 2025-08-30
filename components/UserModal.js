'use client'

import { useState, useEffect } from 'react'
import FormField from './FormField'
import SelectField from './SelectField'
import Button from './Button'

export default function UserModal({ user, mode, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    department: '',
    approvalStatus: 'APPROVED'
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'User',
        department: user.department || '',
        approvalStatus: user.approvalStatus || 'APPROVED'
      })
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'User',
        department: '',
        approvalStatus: 'APPROVED'
      })
    }
  }, [user])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const isViewMode = mode === 'view'
  const isCreateMode = mode === 'create'
  const isEditMode = mode === 'edit'

  const getModalTitle = () => {
    switch (mode) {
      case 'view': return 'รายละเอียดผู้ใช้'
      case 'edit': return 'แก้ไขข้อมูลผู้ใช้'
      case 'create': return 'เพิ่มผู้ใช้ใหม่'
      default: return 'จัดการผู้ใช้'
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {getModalTitle()}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="ชื่อ-นามสกุล"
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            placeholder="กรุณาป้อนชื่อ-นามสกุล"
            required
            className={isViewMode ? 'bg-gray-50' : ''}
            disabled={isViewMode}
          />

          <FormField
            label="อีเมล"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            placeholder="กรุณาป้อนอีเมล"
            required
            className={isViewMode ? 'bg-gray-50' : ''}
            disabled={isViewMode}
          />

          <SelectField
            label="บทบาท"
            value={formData.role}
            onChange={(value) => handleInputChange('role', value)}
            options={[
              { value: 'User', label: 'ผู้ใช้' },
              { value: 'Moderator', label: 'ผู้ดูแล' },
              { value: 'Admin', label: 'ผู้ดูแลระบบ' }
            ]}
            className={isViewMode ? 'bg-gray-50' : ''}
            disabled={isViewMode}
          />

          <SelectField
            label="หน่วยงาน"
            value={formData.department}
            onChange={(value) => handleInputChange('department', value)}
            options={[
              { value: '', label: 'เลือกหน่วยงาน' },
              { value: 'IT Department', label: 'แผนกไอที' },
              { value: 'Research Department', label: 'แผนกวิจัย' },
              { value: 'Academic Affairs', label: 'กิจการนักศึกษา' },
              { value: 'Finance Department', label: 'แผนกการเงิน' },
              { value: 'HR Department', label: 'แผนกทรัพยากรมนุษย์' }
            ]}
            className={isViewMode ? 'bg-gray-50' : ''}
            disabled={isViewMode}
          />

          {!isCreateMode && (
            <SelectField
              label="สถานะ"
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              options={[
                { value: 'Pending', label: 'รอการอนุมัติ' },
                { value: 'Active', label: 'ใช้งานอยู่' },
                { value: 'Inactive', label: 'ไม่ใช้งาน' }
              ]}
              className={isViewMode ? 'bg-gray-50' : ''}
              disabled={isViewMode}
            />
          )}

          {isViewMode && user?.lastLogin && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                เข้าสู่ระบบครั้งล่าสุด
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900">
                {user.lastLogin}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              {isViewMode ? 'ปิด' : 'ยกเลิก'}
            </Button>
            {!isViewMode && (
              <Button variant="primary" type="submit">
                {isCreateMode ? 'เพิ่มผู้ใช้' : 'บันทึก'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
