import ResearchTopicsTable from '@/components/ResearchTopicsTable'
import PageHeader from '@/components/PageHeader'
import Button from "@/components/Button";
import Link from 'next/link';

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="รายการหัวข้อโครงการวิจัย"
        showAddButton={false}
        // onAddClick={() => console.log('Add new research')}
      />
      <Link href="/dashboard/form/create">
        <Button variant="primary">เพิ่มโครงการใหม่</Button>
      </Link>
      <div className='mb-10'></div>

      <ResearchTopicsTable />
    </div>
  );
}
