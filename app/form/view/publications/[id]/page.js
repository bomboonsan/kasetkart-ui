'use client'

import PublicationView from '@/components/view/PublicationView'

export default function ViewPublicationPage({ params }) {
  return <PublicationView publicationId={params.id} />
}
