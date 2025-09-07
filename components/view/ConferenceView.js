'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { worksAPI } from '@/lib/api'
import ViewFormSection from './ViewFormSection'
import ViewFormField from './ViewFormField'
import Button from '../Button'

export default function ConferenceView({ conferenceId }) {
  const router = useRouter()
  const [conference, setConference] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadConference() {
      try {
        setLoading(true)
        const response = await worksAPI.getConference(conferenceId)
        setConference(response?.data || response)
      } catch (err) {
        setError(err?.message || 'ไม่สามารถโหลดข้อมูลการประชุมวิชาการได้')
      } finally {
        setLoading(false)
      }
    }

    if (conferenceId) {
      loadConference()
    }
  }, [conferenceId])

  if (loading) {
    return <div className="p-6 text-center">กำลังโหลด...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  if (!conference) {
    return <div className="p-6 text-center">ไม่พบข้อมูลการประชุมวิชาการ</div>
  }

  const getEnvironmentalLabel = (env) => {
    return env === 1 ? 'เกี่ยวข้อง' : 'ไม่เกี่ยวข้อง'
  }

  const getPresentationWorkLabel = (type) => {
    return type === 0 ? 'ได้รับเชิญ (Invited Paper)' : 'เสนอเอง'
  }

  const getPresentTypeLabel = (type) => {
    const types = ['ภาคบรรยาย (Oral)', 'ภาคโปสเตอร์ (Poster)', 'เข้าร่วมประชุมวิชาการ']
    return types[type] || '-'
  }

  const getArticleTypeLabel = (type) => {
    return type === 0 ? 'Abstract อย่างเดียว' : 'เรื่องเต็ม'
  }

  const getLevelLabel = (level) => {
    return level === 0 ? 'ระดับชาติ' : 'ระดับนานาชาติ'
  }

  const getCostTypeLabel = (type) => {
    const types = ['แหล่งทุนภายนอก', 'งบประมาณมหาวิทยาลัย', 'เงินส่วนตัว']
    return types[type] || '-'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ข้อมูลการประชุมวิชาการ</h1>
          <div className="space-x-3">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/form/edit/conference/${conferenceId}`)}
            >
              แก้ไข
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              กลับ
            </Button>
          </div>
        </div>

        <ViewFormSection title="ข้อมูลทั่วไป">
          <ViewFormField label="ชื่อผลงาน (ไทย)" value={conference.titleTH} />
          <ViewFormField label="ชื่อผลงาน (อังกฤษ)" value={conference.titleEN} />
          
          <ViewFormField 
            label="เกี่ยวข้องกับสิ่งแวดล้อมและความยั่งยืน" 
            value={getEnvironmentalLabel(conference.isEnvironmentallySustainable)} 
          />
          
          <ViewFormField label="ชื่อการประชุมทางวิชาการ" value={conference.journalName} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ViewFormField label="DOI" value={conference.doi} />
            <ViewFormField label="ISBN" value={conference.isbn} />
          </div>
        </ViewFormSection>

        <ViewFormSection title="ระยะเวลาและค่าใช้จ่าย">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ViewFormField label="วันที่เริ่มต้น" value={conference.durationStart} type="date" />
            <ViewFormField label="วันที่สิ้นสุด" value={conference.durationEnd} type="date" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ViewFormField label="ค่าใช้จ่าย (บาท)" value={conference.cost} type="number" />
            <ViewFormField label="ค่าใช้จ่ายมาจาก" value={getCostTypeLabel(conference.costType)} />
          </div>
        </ViewFormSection>

        <ViewFormSection title="การนำเสนอผลงาน">
          <ViewFormField label="การนำเสนอผลงาน" value={getPresentationWorkLabel(conference.presentationWork)} />
          <ViewFormField label="ประเภทการนำเสนอ" value={getPresentTypeLabel(conference.presentType)} />
          <ViewFormField label="ประเภทบทความ" value={getArticleTypeLabel(conference.articleType)} />
        </ViewFormSection>

        <ViewFormSection title="บทคัดย่อและรายละเอียด">
          <ViewFormField label="บทคัดย่อ (ไทย)" value={conference.abstractTH} />
          <ViewFormField label="บทคัดย่อ (อังกฤษ)" value={conference.abstractEN} />
          <ViewFormField label="สรุปเนื้อหาการประชุม" value={conference.summary} />
          <ViewFormField label="คำสำคัญ" value={conference.keywords} />
        </ViewFormSection>

        <ViewFormSection title="ข้อมูลเพิ่มเติม">
          <ViewFormField label="ระดับ" value={getLevelLabel(conference.level)} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ViewFormField label="รหัสประเทศ" value={conference.countryCode} />
            <ViewFormField label="รัฐ/จังหวัด" value={conference.state} />
            <ViewFormField label="เมือง" value={conference.city} />
          </div>
        </ViewFormSection>

        {conference.project_research && (
          <ViewFormSection title="โครงการวิจัยที่เกี่ยวข้อง">
            <ViewFormField 
              label="ชื่อโครงการ" 
              value={conference.project_research.nameTE || conference.project_research.nameEN || 'โครงการวิจัย'} 
            />
          </ViewFormSection>
        )}

      </div>
    </div>
  )
}
