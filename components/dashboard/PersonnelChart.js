'use client'

import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { valueFromAPI, dashboardAPI } from '@/lib/api'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function PersonnelChart({ 
  title,
  subtitle,
  data = [],
  colors = ['#6366f1', '#22c55e', '#06b6d4', '#f59e0b', '#ef4444'],
  height = 200 
}) {
  const [departments, setDepartments] = useState([])
  const [selectedDeptId, setSelectedDeptId] = useState('')
  const [computedData, setComputedData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load departments
  useEffect(() => {
    loadDepartments()
  }, [])

  // Load personnel data when department changes
  useEffect(() => {
    if (selectedDeptId !== '') {
      loadPersonnelData()
    }
  }, [selectedDeptId])

  const loadDepartments = async () => {
    try {
      const response = await valueFromAPI.getDepartments()
      const raw = response?.data || response || []

      // Normalize various shapes returned by the API to { id, documentId, name }
      const depts = (raw || []).map(d => {
        // d may be a string, an object with attributes, or an object with id/documentId
        const attributes = d?.attributes || {}
        const id = d?.id || attributes?.id || null
        const documentId = attributes?.documentId || d?.documentId || null
        const name = attributes?.name || d?.name || attributes?.displayName || d?.displayName || String(d)
        return { id, documentId, name }
      })

      setDepartments(depts)
      // default to 'all' so parent/consumer can decide; keep existing behaviour if user explicitly wants first
      if (!selectedDeptId) {
        setSelectedDeptId('all')
      }
    } catch (err) {
      console.error('Error loading departments:', err)
      setError('ไม่สามารถโหลดข้อมูลภาควิชาได้')
    }
  }

  const loadPersonnelData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const personnel = await dashboardAPI.getPersonnelByAcademicType(selectedDeptId === 'all' ? null : selectedDeptId)
      
      // Convert to chart format
      const total = Object.values(personnel).reduce((sum, count) => sum + count, 0) || 1
      const chartData = Object.entries(personnel).map(([academicType, count]) => ({
        category: academicType,
        personnel: count,
        percentage: ((count / total) * 100).toFixed(1)
      }))
      
      setComputedData(chartData)
    } catch (err) {
      console.error('Error loading personnel data:', err)
      setError('ไม่สามารถโหลดสถิติบุคลากรได้')
      setComputedData([])
    } finally {
      setLoading(false)
    }
  }

  const displayData = computedData || data
  console.log('Display data:', displayData)
  console.log('data:', data)

  // Create series data for stacked bar
  const seriesData = displayData.map((item) => ({
    name: item.category,
    data: [item.percentage]
  }))

  const options = {
    chart: {
      type: 'bar',
      fontFamily: 'Inter, sans-serif',
      stacked: true,
      stackType: '100%',
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    colors: colors,
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50px',
        borderRadius: 8
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        if (val < 8) return '' // Hide labels for small segments
        return val.toFixed(1) + '%'
      },
      style: {
        colors: ['#fff'],
        fontSize: '12px',
        fontWeight: 600
      }
    },
    xaxis: {
      categories: ['Personnel Distribution'],
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    grid: {
      show: false
    },
    legend: {
      show: false
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      y: {
        formatter: function (val, opts) {
          const seriesIndex = opts.seriesIndex
          const category = displayData[seriesIndex]?.category || ''
          const personnel = displayData[seriesIndex]?.personnel || 0
          return `${personnel} คน (${val.toFixed(1)}%)`
        }
      }
    }
  }

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className='text-lg text-gray-900 font-medium'>{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">เลือกภาควิชา</label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="px-3 py-1 bg-white border border-gray-200 text-sm rounded-md text-gray-900"
            disabled={loading}
          >
            <option value="all">ทั้งหมด</option>
              {departments.map((dept) => (
                <option key={dept.id || dept.documentId || dept.name} value={String(dept.documentId || dept.id || '')}>
                  {dept.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      {error && <div className="text-xs text-red-600 mb-2">{error}</div>}
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      ) : (
        <>
          {/* Custom legend with percentages */}
          <div className="flex flex-wrap gap-4 mb-4">
            {displayData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-xs text-gray-600">{item.category}</span>
                <span className="text-xs font-medium text-gray-900">{item.percentage}%</span>
              </div>
            ))}
          </div>
          
          <Chart
            options={options}
            series={seriesData}
            type="bar"
            height={height}
          />
          
          {/* Personnel details table */}
          <div className="mt-6 space-y-2">
            {displayData.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm text-gray-600">{item.category}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">{item.personnel} คน</span>
                  <span className="text-sm text-gray-500">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
