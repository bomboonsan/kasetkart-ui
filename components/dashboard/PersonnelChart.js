'use client'

import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const JOB_TYPES = ['SA','PA','SP','IP','A']

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
  const [error, setError] = useState('')

  // Mock departments data
  useEffect(() => {
    const deps = [
      { id: 1, name: 'ภาควิชาบัญชีและการเงิน' },
      { id: 2, name: 'ภาควิชาการจัดการ' },
      { id: 3, name: 'ภาควิชาเศรษฐศาสตร์' }
    ]
    setDepartments(deps)
    if (!selectedDeptId && deps.length > 0) setSelectedDeptId(String(deps[0].id))
  }, [selectedDeptId])

  // Mock statistics data
  useEffect(() => {
    if (!selectedDeptId) return
    try {
      // Mock data based on selected department
      const mockCounts = { SA: 10, PA: 15, SP: 8, IP: 5, A: 12 }
      const total = JOB_TYPES.reduce((s, jt) => s + (mockCounts[jt] || 0), 0) || 1
      const list = JOB_TYPES.map((jt) => ({
        category: jt,
        personnel: mockCounts[jt] || 0,
        percentage: ((mockCounts[jt] || 0) / total * 100).toFixed(1)
      }))
      setComputedData(list)
    } catch (e) {
      setError('ไม่สามารถโหลดสถิติบุคลากรตามภาควิชา')
      setComputedData(null)
    }
  }, [selectedDeptId])

  const displayData = computedData || data

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
          <label className="text-xs text-gray-500">Dropdown ภาควิชา (Department)</label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="px-3 py-1 bg-white border border-gray-200 text-sm rounded-md text-gray-900"
          >
            {departments.map((d) => (
              <option key={d.id} value={String(d.id)}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>
      {error && <div className="text-xs text-red-600 mb-2">{error}</div>}
      
      {/* Custom legend with percentages */}
      <div className="flex flex-wrap gap-4 mb-0 hidden">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: colors[index] }}
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
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-sm text-gray-600">{item.category.replace('SA', 'Scholarly Academic (SA)').replace('PA', 'Practice Academic (PA)').replace('SP', 'Scholarly Practitioner (SP)').replace('IP', 'Instructional Practitioner (IP)')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900">{item.personnel} คน</span>
              <span className="text-sm text-gray-500">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
