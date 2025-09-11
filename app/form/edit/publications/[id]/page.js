'use client'

import EditPublicationsForm from '@/components/EditPublicationsForm'

export default function EditPublicationPage({ params }) {
  return <EditPublicationsForm mode="edit" workId={params.id} />
}
