// ใช้ path alias (@/) แทน relative path
import ReportHeader from '@/components/ReportHeader'
import ReportFilters from '@/components/ReportFilters'
import ReportTable from '@/components/ReportTable'

export default function Reports() {
  return (
    <div className="space-y-6">
      <ReportHeader />
      <ReportFilters />
      <ReportTable />
    </div>
  )
}
