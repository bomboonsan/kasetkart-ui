import ProjectForm from '@/components/form/ProjectForm'
import PageHeader from '@/components/PageHeader'

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="หัวข้อโครงการวิจัย" showAddButton={false} />
      <ProjectForm />
    </div>
  );
}
