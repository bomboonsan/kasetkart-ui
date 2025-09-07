'use client'

import ConferenceView from '@/components/view/ConferenceView'

export default function ViewConferencePage({ params }) {
  return <ConferenceView conferenceId={params.id} />
}
