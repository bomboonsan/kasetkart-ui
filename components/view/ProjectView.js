'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { projectAPI } from '@/lib/api/project'
import ViewFormSection from './ViewFormSection'
import ViewFormField from './ViewFormField'
// ใช้ path alias (@/) แทน relative path
import { Button } from '@/components/ui'

export default function ProjectView({ projectId }) {
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true)
        const response = await projectAPI.getProject(projectId)
        setProject(response?.data || response)
      } catch (err) {
        setError(err?.message || 'ไม่สามารถโหลดข้อมูลโครงการได้')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      loadProject()
    }
  }, [projectId])

  if (loading) {
    return <div className="p-6 text-center">กำลังโหลด...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  if (!project) {
    return <div className="p-6 text-center">ไม่พบข้อมูลโครงการ</div>
  }

  const getProjectTypeLabel = (type) => {
    return type === 0 ? 'โครงการวิจัย' : 'โครงการพัฒนาวิชาการประเภทงานวิจัย'
  }

  const getProjectModeLabel = (mode) => {
    return mode === 0 ? 'โครงการวิจัยเดี่ยว' : 'แผนงานวิจัย หรือชุดโครงการวิจัย'
  }

  const getLevelLabel = (level) => {
    return level === 0 ? 'ระดับชาติ' : 'ระดับนานาชาติ'
  }

  const getEnvironmentalLabel = (env) => {
    return env === 1 ? 'เกี่ยวข้อง' : 'ไม่เกี่ยวข้อง'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ข้อมูลโครงการวิจัย</h1>
          <div className="space-x-3">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/form/edit/project/${projectId}`)}
            >
              แก้ไข
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              กลับ
            </Button>
          </div>
        </div>

        <ViewFormSection title="ข้อมูลทั่วไป">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ViewFormField label="ปีงบประมาณ" value={project.fiscalYear} type="number" />
            <ViewFormField label="ประเภทโครงการ" value={getProjectTypeLabel(project.projectType)} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ViewFormField label="ลักษณะโครงการวิจัย" value={getProjectModeLabel(project.projectMode)} />
            <ViewFormField label="จำนวนโครงการย่อย" value={project.subProjectCount} type="number" />
          </div>
          
          <ViewFormField label="ชื่อโครงการ (ไทย)" value={project.nameTH} />
          <ViewFormField label="ชื่อโครงการ (อังกฤษ)" value={project.nameEN} />
          
          <ViewFormField 
            label="เกี่ยวข้องกับสิ่งแวดล้อมและความยั่งยืน" 
            value={getEnvironmentalLabel(project.isEnvironmentallySustainable)} 
          />
        </ViewFormSection>

        <ViewFormSection title="ระยะเวลาและงบประมาณ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ViewFormField label="วันที่เริ่มต้น" value={project.durationStart} type="date" />
            <ViewFormField label="วันที่สิ้นสุด" value={project.durationEnd} type="date" />
          </div>
          
          <ViewFormField label="งบวิจัย (บาท)" value={project.budget} type="number" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ViewFormField label="ประเภทแหล่งทุน" value={project.fundType} />
            <ViewFormField label="ชื่อแหล่งทุน" value={project.fundName} />
          </div>
        </ViewFormSection>

        <ViewFormSection title="รายละเอียดโครงการ">
          <ViewFormField label="หน่วยงานหลักที่รับผิดชอบโครงการวิจัย" value={project.organization} />
          <ViewFormField label="ประเภทงานวิจัย" value={project.researchKind} />
          <ViewFormField label="คำสำคัญ" value={project.keywords} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ViewFormField label="IC Types" value={project.icTypes} />
            <ViewFormField label="Impact" value={project.impact} />
            <ViewFormField label="SDG" value={project.sdg} />
          </div>
        </ViewFormSection>

        {project.research_partners && project.research_partners.length > 0 && (
          <ViewFormSection title="ผู้ร่วมวิจัย">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">ชื่อ-นามสกุล</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">หน่วยงาน</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">ประเภท</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">สัดส่วนการมีส่วนร่วม (%)</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">สัดส่วนการวิจัย (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {project.research_partners.map((partner, index) => {
                    // Format custom participation if present
                    const custom = partner.participation_percentage_custom
                    const customDisplay = (custom !== undefined && custom !== null && String(custom) !== '') ? `${parseFloat(custom)}%` : '-'

                    // Format computed participation: if stored as fraction (<=1) treat as fraction and multiply by 100
                    const pp = partner.participation_percentage
                    let computedDisplay = '-'
                    if (pp !== undefined && pp !== null && String(pp) !== '') {
                      const num = parseFloat(pp)
                      if (!Number.isNaN(num)) {
                        computedDisplay = `${num <= 1 ? (num * 100).toFixed(1) : num.toFixed(1)}%`
                      }
                    }

                    return (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2 text-sm text-gray-900">{partner.fullname || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{partner.orgName || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{partner.participant_type || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{customDisplay}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{computedDisplay}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </ViewFormSection>
        )}

      </div>
    </div>
  )
}
