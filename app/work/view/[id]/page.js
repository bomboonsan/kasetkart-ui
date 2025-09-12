"use client"

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import FormSection from '@/components/ui/FormSection'
import FormFieldBlock from '@/components/ui/FormFieldBlock'
import FormInput from '@/components/ui/FormInput'
import FormTextarea from '@/components/ui/FormTextarea'

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
  
  // Mock data แทน API call
  const mockWork = {
    id: id,
    type: 'PUBLICATION',
    status: 'ACTIVE',
    detail: {
      title: 'ตัวอย่างงานตีพิมพ์',
      journal: 'วารสารตัวอย่าง',
      volume: '10',
      issue: '2',
      pages: '123-145',
      year: '2024',
      doi: '10.1234/example',
      abstract: 'บทคัดย่อตัวอย่าง'
    }
  }
  
  const work = mockWork
  const d = work?.detail || {}

  return (
    <div className="space-y-6">
      <PageHeader title="รายละเอียดผลงานวิจัย" />

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

