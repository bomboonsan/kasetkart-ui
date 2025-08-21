import CreatePublicationsForm from "@/components/CreatePublicationsForm";
import PageHeader from '@/components/PageHeader'

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="ผลงานตีพิมพ์ทางวิชาการ" showAddButton={false} />
      <CreatePublicationsForm />
    </div>
  );
}
