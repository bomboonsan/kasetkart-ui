import ItemDemoForm from '@/components/ItemDemoForm'
import PageHeader from '@/components/PageHeader'

export default function ItemDemoPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="รายละเอียดงานวิจัย" showAddButton={false} />
      <ItemDemoForm />
    </div>
  )
}
