import CreateFundingForm from "@/components/CreateFundingForm";
import PageHeader from '@/components/PageHeader'

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="แบบฟอร์มเสนอรายละเอียดเพื่อขอรับทุนพัฒนาอาจารย์ข้อที่ 3.1 ทุนเขียนตำราหรือหนังสือ"
        showAddButton={false}
      />
      <CreateFundingForm />
    </div>
  );
}
