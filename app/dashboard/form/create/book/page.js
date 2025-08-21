import CreateBookForm from "@/components/CreateBookForm";
import PageHeader from '@/components/PageHeader'

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="หนังสือ / ตำรา" showAddButton={false} />
      <CreateBookForm />
    </div>
  );
}
