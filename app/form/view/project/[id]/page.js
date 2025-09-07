'use client'

import ProjectView from '@/components/view/ProjectView'

export default function ViewProjectPage({ params }) {
  return <ProjectView projectId={params.id} />
}
