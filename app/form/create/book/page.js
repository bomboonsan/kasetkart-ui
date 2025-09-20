import BookForm from "@/components/BookForm";
import PageHeader from '@/components/PageHeader'

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="หนังสือ / ตำรา" showAddButton={false} />
      <BookForm mode="create" />
    </div>
  );
}
