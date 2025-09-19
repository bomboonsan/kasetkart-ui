'use client'

import ConferenceForm from "@/components/ConferenceForm";

export default function EditConferencePage({ params }) {
  return <ConferenceForm mode="edit" workId={params.id} />
}
