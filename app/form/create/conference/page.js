import ConferenceForm from "@/components/ConferenceForm";
import PageHeader from '@/components/PageHeader'

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="ผลงานนำเสนอในการประชุมวิชาการ" showAddButton={false} />
      <ConferenceForm mode="create" />
    </div>
  );
}
