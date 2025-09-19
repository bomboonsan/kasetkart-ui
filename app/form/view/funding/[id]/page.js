'use client'

import { useParams } from 'next/navigation'
import FundingForm from "@/components/FundingForm";
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
      <FundingForm mode="edit" workId={id} readonly={true} />
    </div>
  );
}
