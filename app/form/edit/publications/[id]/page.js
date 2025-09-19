'use client'
import PublicationsForm from "@/components/PublicationsForm";

export default function EditPublicationPage({ params }) {
  return <PublicationsForm mode="edit" workId={params.id} />
}
