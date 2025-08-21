import CreateConferenceForm from "@/components/CreateConferenceForm";
import PageHeader from '@/components/PageHeader'

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="ผลงานนำเสนอในการประชุมวิชาการ" showAddButton={false} />
      <CreateConferenceForm />
    </div>
  );
}
