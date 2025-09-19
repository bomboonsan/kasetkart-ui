'use client'

import PublicationsForm from '@/components/PublicationsForm'

export default function ViewPublicationPage({ params }) {
  return <PublicationsForm mode="edit" workId={params.id} readonly={true} />
}
