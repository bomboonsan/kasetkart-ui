'use client'
import PublicationsForm from "@/components/form/PublicationsForm";
import EditPublicationsForm from '@/components/EditPublicationsForm'

export default function EditPublicationPage({ params }) {
  return <PublicationsForm mode="edit" workId={params.id} />
}
