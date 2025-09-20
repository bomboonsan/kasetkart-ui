import PublicationForm from '@/components/PublicationForm'
import PageHeader from '@/components/layout/PageHeader'

export default function CreateDetailPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="ผลงานตีพิมพ์ทางวิชาการ"
        showAddButton={false}
      />
      <PublicationForm />
    </div>
  )
}
