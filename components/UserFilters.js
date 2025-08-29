'use client'

import { useState } from 'react'
import FormField from './FormField'
import SelectField from './SelectField'
import Button from './Button'

export default function UserFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    department: 'all'
  })

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      search: '',
      role: 'all',
      status: 'all',
      department: 'all'
    }
    setFilters(resetFilters)
    onFilter(resetFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField
          label="ค้นหา"
          value={filters.search}
          onChange={(value) => handleFilterChange('search', value)}
          placeholder="ชื่อหรืออีเมล"
        />

        <SelectField
          label="บทบาท"
          value={filters.role}
          onChange={(value) => handleFilterChange('role', value)}
          options={[
            { value: 'all', label: 'ทั้งหมด' },
            { value: 'Admin', label: 'ผู้ดูแลระบบ' },
            { value: 'Moderator', label: 'ผู้ดูแล' },
            { value: 'User', label: 'ผู้ใช้' }
          ]}
        />

        <SelectField
          label="สถานะ"
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
          options={[
            { value: 'all', label: 'ทั้งหมด' },
            { value: 'Active', label: 'ใช้งานอยู่' },
            { value: 'Inactive', label: 'ไม่ใช้งาน' },
            { value: 'Pending', label: 'รอการอนุมัติ' }
          ]}
        />

        <SelectField
          label="ภาควิชา"
          value={filters.department}
          onChange={(value) => handleFilterChange('department', value)}
          options={[
            { value: 'all', label: 'ทั้งหมด' },
            { value: 'คณะแพทยศาสตร์', label: 'คณะแพทยศาสตร์' },
            { value: 'คณะนิเทศศาสตร์', label: 'คณะนิเทศศาสตร์' },
            { value: 'Academic Affairs', label: 'กิจการนักศึกษา' },
            { value: 'Finance Department', label: 'แผนกการเงิน' },
            { value: 'HR Department', label: 'แผนกทรัพยากรมนุษย์' }
          ]}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={handleReset}>
          รีเซ็ต
        </Button>
      </div>
    </div>
  )
}
