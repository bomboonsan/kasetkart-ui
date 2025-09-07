'use client'

import CreateResearchForm from '@/components/CreateResearchForm'

export default function EditProjectPage({ params }) {
  return <CreateResearchForm mode="edit" workId={params.id} />
}
