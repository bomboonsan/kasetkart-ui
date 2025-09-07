'use client'

import { useParams } from 'next/navigation'
import CreateFundingForm from "@/components/CreateFundingForm";
import PageHeader from '@/components/PageHeader'

export default function EditFundingPage() {
  const params = useParams()
  const { id } = params

  return (
    <div className="space-y-6">
      <PageHeader
        title="แก้ไขทุนตำราหรือหนังสือ"
        showAddButton={false}
      />
      <CreateFundingForm mode="edit" workId={id} />
    </div>
  );
}
