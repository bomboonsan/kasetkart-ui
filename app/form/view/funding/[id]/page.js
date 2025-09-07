'use client'

import { useParams } from 'next/navigation'
import CreateFundingForm from "@/components/CreateFundingForm";
import PageHeader from '@/components/PageHeader'

export default function ViewFundingPage() {
  const params = useParams()
  const { id } = params

  return (
    <div className="space-y-6">
      <PageHeader
        title="ดูรายละเอียดทุนตำราหรือหนังสือ"
        showAddButton={false}
      />
      <CreateFundingForm mode="view" workId={id} />
    </div>
  );
}
