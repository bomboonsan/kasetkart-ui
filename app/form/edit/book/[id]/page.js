'use client'

import BookForm from '@/components/BookForm'

export default function EditBookPage({ params }) {
  return <BookForm mode="edit" workId={params.id} />
}
