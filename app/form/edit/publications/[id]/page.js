'use client'

import CreatePublicationsForm from '@/components/CreatePublicationsForm'

export default function EditPublicationPage({ params }) {
  return <CreatePublicationsForm mode="edit" workId={params.id} />
}
