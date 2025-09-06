'use client'

import { useState } from 'react'

const TYPE_TABS = [
  { key: 'icTypes', label: 'IC Type' },
  { key: 'impact', label: 'Impact' },
  { key: 'sdg', label: 'SDG' },
]

export default function ScholarshipTable({ title, subtitle }) {
  const [activeType, setActiveType] = useState('icTypes')
  const [selectedDeptId, setSelectedDeptId] = useState('all')

  // Mock data แทน API calls
  const mockScholarshipData = {
    icTypes: [
      { category: 'Technology', count: 15 },
      { category: 'Healthcare', count: 12 },
      { category: 'Education', count: 8 }
    ],
    impact: [
      { category: 'High', count: 20 },
      { category: 'Medium', count: 10 },
      { category: 'Low', count: 5 }
    ],
    sdg: [
      { category: 'SDG 1', count: 7 },
      { category: 'SDG 3', count: 12 },
      { category: 'SDG 4', count: 16 }
    ]
  }
  
  const mockDepartments = [
    { id: 1, name: 'ภาควิชาเศรษฐศาสตร์' },
    { id: 2, name: 'ภาควิชาการบัญชี' }
  ]
  
  const departments = mockDepartments

  const scholarshipData = mockScholarshipData
  const activeData = scholarshipData[activeType] || []

  console.log('activeData', activeData);

  // Calculate counts for tabs
  const counts = {
    icTypes: (scholarshipData.icTypes || []).reduce((sum, item) => sum + (item.count || 0), 0),
    impact: (scholarshipData.impact || []).reduce((sum, item) => sum + (item.count || 0), 0),
    sdg: (scholarshipData.sdg || []).reduce((sum, item) => sum + (item.count || 0), 0),
  }

  // Calculate total for percentage
  const totalCount = counts[activeType] || 1

  // if (scholarshipErr) {
  //   return (
  //     <div className="p-6 border rounded-lg shadow-sm bg-white">
  //       <div className="text-red-500 text-center">
  //         เกิดข้อผิดพลาดในการโหลดข้อมูล: {scholarshipErr.message}
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className='text-lg text-gray-900 font-medium'>{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
          <label className="text-xs text-gray-500 mr-2">ภาควิชา:</label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="px-3 py-1 bg-white border border-gray-200 text-sm rounded-md text-gray-900"
          >
            <option value="all">ทั้งหมด</option>
            {departments.map((d) => (
              <option key={d.id} value={String(d.id)}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-hidden">
        {/* Tabs */}
        <div className="flex gap-2 border-b mb-4">
          {TYPE_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveType(t.key)}
              className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
                activeType === t.key 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {t.label} {counts[t.key] ? `(${counts[t.key]})` : '(0)'}
            </button>
          ))}
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-700">ประเภท</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">จำนวน</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">เปอร์เซ็นต์</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">แสดงผล</th>
              </tr>
            </thead>
            <tbody>
              {activeData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    {!scholarshipRes ? 'กำลังโหลดข้อมูล...' : 'ไม่พบข้อมูล'}
                  </td>
                </tr>
              ) : (
                activeData.map((item, index) => {
                  const count = item.count || 0
                  const percentage = totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0.0'
                  
                  // Color mapping for different types
                  const colors = {
                    0: '#22c55e', // green
                    1: '#6366f1', // indigo  
                    2: '#ef4444', // red
                    3: '#f59e0b', // amber
                    4: '#8b5cf6', // violet
                  }
                  const color = colors[index % 5] || '#6b7280'
                  
                  return (
                    <tr key={item.value} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.label}
                        </div>
                      </td>
              <td className="py-3 px-4 text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          {(count || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm text-gray-600">
                          {percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end">
                          <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${percentage}%`, 
                                backgroundColor: color 
                              }}
                            ></div>
                          </div>
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: color }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        {activeData.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              รวม {activeType === 'icTypes' ? 'IC Types' : activeType === 'impact' ? 'Impact' : 'SDG'}: 
              <span className="font-semibold text-gray-900 ml-1">
                {totalCount.toLocaleString()} โครงการ
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
