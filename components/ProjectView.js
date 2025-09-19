"use client"

import FormSection from '@/components/FormSection'
import FormFieldBlock from '@/components/FormFieldBlock'
import DisplayField from '@/components/DisplayField'

function formatDate(d) {
  if (!d) return '-'
  try { return new Date(d).toLocaleDateString('th-TH') } catch { return String(d) }
}

function formatBudget(b) {
  if (!b && b !== 0) return '-'
  try { return new Intl.NumberFormat('th-TH').format(b) + ' บาท' } catch { return String(b) }
}

export default function ProjectView({ project }) {
  if (!project) return null
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
      <FormSection title="ข้อมูลโครงการ">
        <FormFieldBlock>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DisplayField label="ปีงบประมาณ" value={project.fiscalYear} />
            <DisplayField label="ประเภทโครงการ" value={project.projectType} />
            <DisplayField label="รูปแบบโครงการ" value={project.projectMode} />
          </div>
        </FormFieldBlock>

        <FormFieldBlock>
          <DisplayField label="ชื่อโครงการ (ไทย)" value={project.nameTh} />
          <DisplayField label="ชื่อโครงการ (อังกฤษ)" value={project.nameEn} />
        </FormFieldBlock>

        <FormFieldBlock>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DisplayField label="เกี่ยวข้องกับสิ่งแวดล้อม/ความยั่งยืน" value={project.isEnvironmentallySustainable ? 'เกี่ยวข้อง' : 'ไม่เกี่ยวข้อง'} />
            <DisplayField label="วันที่เริ่มต้น" value={formatDate(project.durationStart)} />
            <DisplayField label="วันที่สิ้นสุด" value={formatDate(project.durationEnd)} />
          </div>
        </FormFieldBlock>

        <FormFieldBlock>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DisplayField label="ประเภทวิจัย" value={project.researchKind} />
            <DisplayField label="ประเภททุน" value={project.fundType} />
            <DisplayField label="ชื่อทุน" value={project.fundName} />
          </div>
        </FormFieldBlock>

        <FormFieldBlock>
          <DisplayField label="งบประมาณ" value={formatBudget(project.budget)} />
        </FormFieldBlock>

        <FormFieldBlock>
          <DisplayField label="คำสำคัญ" value={project.keywords} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DisplayField label="ประเภท IC" value={project.icTypes} />
            <DisplayField label="Impact" value={project.impact} />
            <DisplayField label="SDG" value={project.sdg} />
          </div>
        </FormFieldBlock>

        <FormFieldBlock>
          <DisplayField label="สถานะ" value={project.status} />
        </FormFieldBlock>
      </FormSection>

      {Array.isArray(project.ProjectPartner) && project.ProjectPartner.length > 0 && (
        <FormSection title="ผู้ร่วมโครงการ">
          <div className="space-y-3">
            {project.ProjectPartner.map((p) => (
              <div key={p.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium text-gray-900">{p.fullname || p.User?.email || '-'}</div>
                  <div className="text-sm text-gray-600">{p.orgName || (p.isInternal ? 'ภายใน มก.' : 'ภายนอก')}</div>
                </div>
                <div className="text-sm text-gray-700">{p.partnerType || '-'}</div>
              </div>
            ))}
          </div>
        </FormSection>
      )}

      {Array.isArray(project.ResearchWork) && project.ResearchWork.length > 0 && (
        <FormSection title="ผลงานภายใต้โครงการนี้">
          <div className="divide-y divide-gray-100 border rounded">
            {project.ResearchWork.map((w) => (
              <a key={w.id} href={`/works/view/${w.id}`} className="block hover:bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-gray-900 font-medium">{w.type}</div>
                  <div className="text-sm text-gray-600">{new Date(w.createdAt).toLocaleDateString('th-TH')}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">สถานะ: {w.status}</div>
              </a>
            ))}
          </div>
        </FormSection>
      )}
    </div>
  )
}
