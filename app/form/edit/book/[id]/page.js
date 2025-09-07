'use client'

import CreateBookForm from '@/components/CreateBookForm'

export default function EditBookPage({ params }) {
  return <CreateBookForm mode="edit" workId={params.id} />
}
