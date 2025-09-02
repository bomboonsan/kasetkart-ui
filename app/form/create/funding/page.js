import CreateFundingForm from "@/components/CreateFundingForm";
import PageHeader from '@/components/PageHeader'

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="ทุนตำราหรือหนังสือ"
        showAddButton={false}
      />
      <CreateFundingForm />
    </div>
  );
}
