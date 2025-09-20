import FundingForm from "@/components/FundingForm";
import PageHeader from '@/components/layout/PageHeader'

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="ทุนตำราหรือหนังสือ"
        showAddButton={false}
      />
      <FundingForm mode="create" />
    </div>
  );
}
