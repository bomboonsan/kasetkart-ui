"use client"

import ProjectForm from './ProjectForm'

export default function ItemDemoForm({ projectId, readonly = true }) {
  // Wrap ProjectForm so pages/components can render the real form in read-only/demo mode
  return <ProjectForm projectId={projectId} readonly={readonly} />
}
