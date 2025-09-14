import PublicationsForm from "@/components/form/PublicationsForm";
import PageHeader from '@/components/PageHeader'

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="ผลงานตีพิมพ์ทางวิชาการ" showAddButton={false} />
      <PublicationsForm />
    </div>
  );
}
