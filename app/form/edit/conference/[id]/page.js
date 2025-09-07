'use client'

import CreateConferenceForm from '@/components/CreateConferenceForm'

export default function EditConferencePage({ params }) {
  return <CreateConferenceForm mode="edit" workId={params.id} />
}
