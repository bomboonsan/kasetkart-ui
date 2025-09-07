'use client'

import BookView from '@/components/view/BookView'

export default function ViewBookPage({ params }) {
  return <BookView bookId={params.id} />
}
