"use client"

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import PageHeader from '@/components/PageHeader'
import FormSection from '@/components/FormSection'
import FormFieldBlock from '@/components/FormFieldBlock'
import FormInput from '@/components/FormInput'
import FormTextarea from '@/components/FormTextarea'
import { api } from '@/lib/api'

function toDash(v) {
  if (v === null || v === undefined) return '-'
  if (typeof v === 'string' && v.trim() === '') return '-'
  return String(v)
}

function isoDate(v) {
  if (!v) return '-'
  try { return String(v).slice(0,10) } catch { return '-' }
}

export default function ViewWorkPage() {
  const params = useParams()
  const id = params?.id
  const { data, error } = useSWR(id ? `/works/${id}` : null, api.get)
  const work = data || null
  const d = work?.detail || {}

  return (
    <div className="space-y-6">
      <PageHeader title="รายละเอียดผลงานวิจัย" />

      {error && (
        <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error.message || 'โหลดข้อมูลไม่ได้'}</div>
      )}

      {!work ? (
        <div className="p-4 text-gray-500">กำลังโหลด...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <form className="p-6 space-y-8">
            <FormSection>
              <FormFieldBlock>
                <FormInput label="ประเภทผลงาน" type="text" value={toDash(work.type)} readOnly />
                <FormInput label="โครงการวิจัย" type="text" value={toDash(work.Project?.nameTh || work.Project?.nameEn)} readOnly />
              </FormFieldBlock>

              {/* Fields aligned to Conference layout */}
              <FormFieldBlock>
                <FormTextarea label="ชื่อผลงาน (ไทย)" value={toDash(d.titleTh)} readOnly />
                <FormTextarea label="ชื่อผลงาน (อังกฤษ)" value={toDash(d.titleEn)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="เกี่ยวข้องสิ่งแวดล้อมและความยั่งยืน" type="text" value={d.isEnvironmentallySustainable === true ? 'เกี่ยวข้อง' : (d.isEnvironmentallySustainable === false ? 'ไม่เกี่ยวข้อง' : '-')} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormTextarea label="ชื่อการประชุมทางวิชาการ/วารสาร" value={toDash(d.journalName)} readOnly />
                <FormInput label="DOI" type="text" value={toDash(d.doi)} readOnly />
                <FormInput label="ISBN" type="text" value={toDash(d.isbn)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="เริ่มต้น" type="text" value={isoDate(d.durationStart)} readOnly />
                <FormInput label="สิ้นสุด" type="text" value={isoDate(d.durationEnd)} readOnly />
                <FormInput label="ค่าใช้จ่าย" type="text" value={toDash(d.cost)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="การนำเสนอผลงาน" type="text" value={toDash(d.presentationWork)} readOnly />
                <FormInput label="ประเภทการนำเสนอ" type="text" value={toDash(d.presentType)} readOnly />
                <FormInput label="ลักษณะของบทความ" type="text" value={toDash(d.articleType)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormTextarea label="บทคัดย่อ (ไทย)" value={toDash(d.abstractTh)} readOnly />
                <FormTextarea label="บทคัดย่อ (อังกฤษ)" value={toDash(d.abstractEn)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormTextarea label="สรุปเนื้อหาแบบย่อ" value={toDash(d.summary)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormTextarea label="คำสำคัญ" value={toDash(d.keywords)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="ระดับการนำเสนอ" type="text" value={toDash(d.level)} readOnly />
                <FormInput label="ประเทศ" type="text" value={toDash(d.countryCode)} readOnly />
                <FormInput label="มลรัฐ/จังหวัด" type="text" value={toDash(d.state)} readOnly />
                <FormInput label="เมือง" type="text" value={toDash(d.city)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormTextarea label="ชื่อแหล่งทุน" value={toDash(d.fundName)} readOnly />
              </FormFieldBlock>
            </FormSection>
          </form>
        </div>
      )}
    </div>
  )
}

