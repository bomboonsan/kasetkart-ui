"use client"
// ใช้ path alias (@/) แทน relative path
import { useState } from 'react'
import ReportHeader from '@/components/report/ReportHeader'
import ReportFilters from '@/components/report/ReportFilters'
import ReportTableA from '@/components/report/ReportTableA'
import ReportTableB from '@/components/report/ReportTableB'
import ReportTableC from '@/components/report/ReportTableC'
import ReportTableD from '@/components/report/ReportTableD'

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('table-a')

  return (
    <div className="space-y-6">
      <ReportHeader selectedReport={selectedReport} onChange={setSelectedReport} />
      <ReportFilters />
      {/* Render only the selected table */}
      {selectedReport === 'table-a' && <ReportTableA />}
      {selectedReport === 'table-b' && <ReportTableB />}
      {selectedReport === 'table-c' && <ReportTableC />}
      {selectedReport === 'table-d' && <ReportTableD />}

    </div>
  )
}
