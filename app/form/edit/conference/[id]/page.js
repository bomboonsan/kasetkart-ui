'use client'

import ConferenceForm from "@/components/form/ConferenceForm";

export default function EditConferencePage({ params }) {
  return <ConferenceForm mode="edit" workId={params.id} />
}
