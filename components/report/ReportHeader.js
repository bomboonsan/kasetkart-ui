'use client'
import SelectField from '@/components/SelectField'
import Button from '@/components/Button'

export default function ReportHeader() {
  const reportOptions = [
    { 
      value: 'table-a', 
      label: 'Table 8-1 Part A: Intellectual Contribution (IC) Strategies for SA and PA (2019-2023)' 
    },
    { 
      value: 'table-b', 
      label: 'Table 8-1 Part B: Research Output Summary' 
    },
    { 
      value: 'table-c', 
      label: 'Table 8-2: Publication Analytics Report' 
    }
  ]

  const exportOptions = [
    { value: 'pdf', label: 'Export as PDF' },
    { value: 'excel', label: 'Export as Excel' },
    { value: 'csv', label: 'Export as CSV' }
  ]

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Button 
              variant="success"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <span>Export</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-3 3-3-3M12 12v9M5 20h14" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ประเภทรายงาน
        </label>
        <SelectField
          value="table-8-1-part-a"
          options={reportOptions}
          className="max-w-2xl"
        />
      </div>
    </div>
  )
}
