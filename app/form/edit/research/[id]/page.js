'use client'

import CreateResearchForm from '@/components/CreateResearchForm'

export default function EditResearchPage({ params }) {
  return <CreateResearchForm mode="edit" projectId={params.id} />
}
