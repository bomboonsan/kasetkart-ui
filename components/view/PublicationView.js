'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { worksAPI } from '@/lib/api/works'
import ViewFormSection from './ViewFormSection'
import ViewFormField from './ViewFormField'
// ใช้ path alias (@/) แทน relative path
import { Button } from '@/components/ui'

export default function PublicationView({ publicationId }) {
  const router = useRouter()
  const [publication, setPublication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPublication() {
      try {
        setLoading(true)
        const response = await worksAPI.getPublication(publicationId)
        setPublication(response?.data || response)
      } catch (err) {
        setError(err?.message || 'ไม่สามารถโหลดข้อมูลการตีพิมพ์ทางวิชาการได้')
      } finally {
        setLoading(false)
      }
    }

    if (publicationId) {
      loadPublication()
    }
  }, [publicationId])

  if (loading) {
    return <div className="p-6 text-center">กำลังโหลด...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  if (!publication) {
    return <div className="p-6 text-center">ไม่พบข้อมูลการตีพิมพ์ทางวิชาการ</div>
  }

  const getEnvironmentalLabel = (env) => {
    return env === 1 ? 'เกี่ยวข้อง' : 'ไม่เกี่ยวข้อง'
  }

  const getLevelLabel = (level) => {
    return level === 0 ? 'ระดับชาติ' : 'ระดับนานาชาติ'
  }

  const getPublicationTypeLabel = (type) => {
    const types = ['วารสารวิชาการ', 'การประชุมวิชาการ', 'หนังสือ', 'บทความวิชาการ']
    return types[type] || '-'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ข้อมูลการตีพิมพ์ทางวิชาการ</h1>
          <div className="space-x-3">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/form/edit/publications/${publicationId}`)}
            >
              แก้ไข
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              กลับ
            </Button>
          </div>
        </div>

        <ViewFormSection title="ข้อมูลทั่วไป">
          <ViewFormField label="ชื่อผลงาน (ไทย)" value={publication.titleTH} />
          <ViewFormField label="ชื่อผลงาน (อังกฤษ)" value={publication.titleEN} />
          
          <ViewFormField 
            label="เกี่ยวข้องกับสิ่งแวดล้อมและความยั่งยืน" 
            value={getEnvironmentalLabel(publication.isEnvironmentallySustainable)} 
          />
          
          <ViewFormField label="ชื่อวารสารหรือสิ่งพิมพ์" value={publication.journalName} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ViewFormField label="DOI" value={publication.doi} />
            <ViewFormField label="ISBN/ISSN" value={publication.isbn} />
          </div>
        </ViewFormSection>

        <ViewFormSection title="รายละเอียดการตีพิมพ์">
          <ViewFormField label="ประเภทการตีพิมพ์" value={getPublicationTypeLabel(publication.publicationType)} />
          <ViewFormField label="ระดับ" value={getLevelLabel(publication.level)} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ViewFormField label="วันที่ตีพิมพ์" value={publication.publicationDate} type="date" />
            <ViewFormField label="ปีที่ตีพิมพ์" value={publication.publicationYear} type="number" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ViewFormField label="ปีที่" value={publication.volume} />
            <ViewFormField label="ฉบับที่" value={publication.issue} />
            <ViewFormField label="หน้า" value={publication.pages} />
          </div>
        </ViewFormSection>

        <ViewFormSection title="บทคัดย่อและรายละเอียด">
          <ViewFormField label="บทคัดย่อ (ไทย)" value={publication.abstractTH} />
          <ViewFormField label="บทคัดย่อ (อังกฤษ)" value={publication.abstractEN} />
          <ViewFormField label="คำสำคัญ" value={publication.keywords} />
        </ViewFormSection>

        <ViewFormSection title="ข้อมูลเพิ่มเติม">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ViewFormField label="รหัสประเทศ" value={publication.countryCode} />
            <ViewFormField label="รัฐ/จังหวัด" value={publication.state} />
            <ViewFormField label="เมือง" value={publication.city} />
          </div>
          
          <ViewFormField label="หมายเหตุ" value={publication.notes} />
        </ViewFormSection>

        {publication.project_research && (
          <ViewFormSection title="โครงการวิจัยที่เกี่ยวข้อง">
            <ViewFormField 
              label="ชื่อโครงการ" 
              value={publication.project_research.nameTE || publication.project_research.nameEN || 'โครงการวิจัย'} 
            />
          </ViewFormSection>
        )}

      </div>
    </div>
  )
}
