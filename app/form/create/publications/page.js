import PublicationsForm from "@/components/PublicationsForm";
import PageHeader from '@/components/layout/PageHeader'

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="ผลงานตีพิมพ์ทางวิชาการ" showAddButton={false} />
      <PublicationsForm mode="create" />
    </div>
  );
}
