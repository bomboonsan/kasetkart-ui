 'use client'

import { useState, useEffect, useRef, useTransition, useMemo } from 'react'
import useSWR from 'swr'
import { valueFromAPI, dashboardAPI } from '@/lib/api'

const TYPE_TABS = [
  { key: 'icTypes', label: 'IC Type' },
  { key: 'impacts', label: 'Impact' },
  { key: 'sdgs', label: 'SDG' },
]

export default function ScholarshipTable({ title, subtitle, researchStats = {} }) {
  const [activeType, setActiveType] = useState('icTypes')
  const [selectedDeptId, setSelectedDeptId] = useState('all')
  const [departments, setDepartments] = useState([])
  const [currentStats, setCurrentStats] = useState({ icTypes: [], impacts: [], sdgs: [] })
  const [loading, setLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const debounceRef = useRef(null)
  const [isPending, startTransition] = useTransition()

  const handleCheckboxChange = (e) => {
    const value = parseInt(e.target.value)
    if (e.target.checked) {
      setSelectedItems([...selectedItems, value])
    } else {
      setSelectedItems(selectedItems.filter(i => i !== value))
    }
  }

  // console.log('departments:', departments)

  // Load departments on mount
  useEffect(() => {
  loadDepartments()
  }, [])

  // Load research stats when department changes
  useEffect(() => {
    if (selectedDeptId !== '') {
  // loadResearchStats()
    }
  }, [selectedDeptId])

  // Use passed stats initially
  useEffect(() => {
    if (researchStats && Object.keys(researchStats).length > 0) {
      setCurrentStats(researchStats)
    }
  }, [researchStats])

  const loadDepartments = async () => {
    try {
      const response = await valueFromAPI.getDepartments()
      const depts = response?.data || response || []
      setDepartments(depts)
    } catch (err) {
  // Graceful fallback: clear departments on error
  setDepartments([])
  setLoading(false)
    }
  }
  // Use SWR for research stats per-department
  const researchKey = selectedDeptId === '' ? null : ['researchStats', selectedDeptId === 'all' ? 'all' : selectedDeptId]
  const { data: researchRaw, isLoading: swrLoading, isValidating: isValidatingResearch } = useSWR(
    researchKey,
    () => dashboardAPI.getResearchStatsByTypes(selectedDeptId === 'all' ? null : selectedDeptId),
    { revalidateOnFocus: false, dedupingInterval: 60000, keepPreviousData: true }
  )

  // map swr data to expected shape
  useEffect(() => {
    if (researchRaw && Object.keys(researchRaw).length > 0) {
      setCurrentStats(researchRaw)
    }
  }, [researchRaw])
  const activeData = currentStats[activeType] || []

  // Default: mark all items checked whenever activeData changes
  useEffect(() => {
    if (Array.isArray(activeData) && activeData.length) {
      setSelectedItems(activeData.map((_, i) => i))
    } else {
      setSelectedItems([])
    }
  }, [activeData])

  // Calculate counts for tabs
  const counts = {
    icTypes: (currentStats.icTypes || []).reduce((sum, item) => sum + (item.count || 0), 0),
    impacts: (currentStats.impacts || []).reduce((sum, item) => sum + (item.count || 0), 0),
    sdgs: (currentStats.sdgs || []).reduce((sum, item) => sum + (item.count || 0), 0),
  }

  // Calculate total for percentage
  const totalCount = counts[activeType] || 1

  // Sum only checked items for summary
  const selectedSum = (selectedItems || []).reduce((sum, idx) => {
    const item = activeData[idx]
    return sum + (item && item.count ? item.count : 0)
  }, 0)

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
    <div className="p-6 border border-gray-50 rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className='text-lg text-gray-900 font-medium'>{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">เลือกภาควิชา</label>
          <select
            value={selectedDeptId}
            onChange={(e) => {
              const v = e.target.value
              startTransition(() => {
                if (debounceRef.current) clearTimeout(debounceRef.current)
                debounceRef.current = setTimeout(() => setSelectedDeptId(v), 250)
              })
            }}
            className="px-3 py-1 bg-white border border-gray-200 text-sm rounded-md text-gray-900"
            disabled={loading}
          >
            <option value="all">ทั้งหมด</option>
            {departments.map((dept) => (
              <option key={dept.documentId} value={String(dept.documentId)}>
                {dept.name}
              </option>
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
              <tr className="border-b border-b-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">ประเภท</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">จำนวน</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">เปอร์เซ็นต์</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">แสดงผล</th>
              </tr>
            </thead>
            <tbody>
              {loading && (!activeData || activeData.length === 0) ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : activeData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              ) : (
                // Render rows; while isFetching show slightly dimmed rows and a skeleton for clarity
                activeData.map((item, index) => {
                  const count = item.count || 0
                  const totalCount = counts[activeType] || 1
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
                    <tr key={item.name || index} className={`border-b border-b-gray-200 hover:bg-gray-50 ${isFetching || isPending ? 'opacity-80' : ''}`}>
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <input type="checkbox" value={index} checked={selectedItems.includes(index)} onChange={handleCheckboxChange} />
                          {item.name}
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

          {/* subtle fetching indicator */}
          {(isFetching || isPending) && (
            <div className="mt-2 text-xs text-gray-500">อัปเดตข้อมูล...</div>
          )}

        {/* Summary */}
        {activeData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-t-gray-300">
              <div className="text-sm text-gray-600">
                รวม {activeType === 'icTypes' ? 'IC Types' : activeType === 'impacts' ? 'Impact' : 'SDG'}: 
                <span className="font-semibold text-gray-900 ml-1">
                  {selectedSum.toLocaleString()} โครงการ
                </span>
              </div>
            </div>
        )}
      </div>
    </div>
  )
}
