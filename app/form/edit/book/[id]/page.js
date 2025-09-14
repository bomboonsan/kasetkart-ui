'use client'

import BookForm from '@/components/form/BookForm'

export default function EditBookPage({ params }) {
  return <BookForm mode="edit" workId={params.id} />
}
