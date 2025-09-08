// ใช้ path alias (@/) แทน relative path
import ReportHeader from '@/components/report/ReportHeader'
import ReportFilters from '@/components/report/ReportFilters'
import ReportTableA from '@/components/report/ReportTableA'
import ReportTableB from '@/components/report/ReportTableB'
import ReportTableC from '@/components/report/ReportTableC'

export default function Reports() {
  return (
    <div className="space-y-6">
      <ReportHeader />
      <ReportFilters />
      <ReportTableA />
      <ReportTableB />
      <ReportTableC />
    </div>
  )
}
