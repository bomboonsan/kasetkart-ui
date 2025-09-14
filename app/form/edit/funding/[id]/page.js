'use client'

import { useParams } from 'next/navigation'
import FundingForm from "@/components/form/FundingForm";
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
      <FundingForm mode="edit" workId={id} />
    </div>
  );
}
