'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import FormField from '@/components/FormField'
import SelectField from '@/components/SelectField'
import Button from '@/components/Button'
import { api } from '@/lib/api-base'

export default function UserFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    department: 'all'
  })

  // Load departments from API
  const { data: departmentsRes } = useSWR(
    'departments', 
    () => api.get('/departments'),
    { revalidateOnFocus: false, dedupingInterval: 300000 } // cache for 5 minutes
  )

  const departmentOptions = [
    { value: 'all', label: 'ทั้งหมด' },
    ...((departmentsRes?.data || departmentsRes || []).map(dept => ({
      value: dept.name,
      label: dept.name
    })))
  ]

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
    <div className="bg-white rounded-lg shadow p-6 flex gap-4">
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
          options={departmentOptions}
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
