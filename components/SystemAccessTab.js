'use client'

import { useState } from 'react'
import { createHandleChange } from '@/utils/form'
import SelectField from '@/components/ui/SelectField'
import { Button } from '@/components/ui'

export default function SystemAccessTab() {
  const [formData, setFormData] = useState({
    role: 'researcher',
    permissions: {
      research: true,
      publication: true,
      admin: false
    },
    status: 'active'
  })

  const handleInputChange = createHandleChange(setFormData)

  const handlePermissionChange = (permission, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [permission]: value }
    }))
  }

  const handleSave = () => {
    // no-op save handler placeholder
  }

  const roleOptions = [
    { value: 'admin', label: 'ผู้ดูแลระบบ' },
    { value: 'researcher', label: 'นักวิจัย' },
    { value: 'assistant', label: 'ผู้ช่วยนักวิจัย' },
    { value: 'viewer', label: 'ผู้ใช้งานทั่วไป' }
  ]

  const statusOptions = [
    { value: 'active', label: 'ใช้งานได้' },
    { value: 'inactive', label: 'ไม่ได้ใช้งาน' },
    { value: 'suspended', label: 'ถูกระงับ' }
  ]

  return (
    <div className="space-y-8">
      {/* Role Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">บทบาทของผู้ใช้งาน</h3>
        <SelectField
          label="บทบาท"
          value={formData.role}
          onChange={(value) => handleInputChange('role', value)}
          options={roleOptions}
        />
      </div>

      {/* Status Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">สถานะการใช้งาน</h3>
        <SelectField
          label="สถานะ"
          value={formData.status}
          onChange={(value) => handleInputChange('status', value)}
          options={statusOptions}
        />
      </div>

      {/* Permissions Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">สิทธิการเข้าถึง</h3>
        <div className="space-y-4">
          {/* Research Permission */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">จัดการโครงการวิจัย</h4>
              <p className="text-sm text-gray-600">สามารถสร้าง แก้ไข และลบโครงการวิจัย</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.permissions.research}
                onChange={(e) => handlePermissionChange('research', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Publication Permission */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">จัดการผลงานตีพิมพ์</h4>
              <p className="text-sm text-gray-600">สามารถสร้าง แก้ไข และลบผลงานตีพิมพ์</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.permissions.publication}
                onChange={(e) => handlePermissionChange('publication', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Admin Permission */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">จัดการผู้ใช้งาน</h4>
              <p className="text-sm text-gray-600">สามารถจัดการบัญชีผู้ใช้งานและสิทธิการเข้าถึง</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.permissions.admin}
                onChange={(e) => handlePermissionChange('admin', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Last Login Info */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลการเข้าใช้งาน</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">เข้าใช้งานครั้งล่าสุด:</span>
            <span className="text-sm font-medium">15 ธันวาคม 2567 - 14:30 น.</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">IP Address:</span>
            <span className="text-sm font-medium">192.168.1.100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">อุปกรณ์:</span>
            <span className="text-sm font-medium">Chrome on Windows</span>
          </div>
        </div>
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
