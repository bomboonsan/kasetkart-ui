"use client"

import FormSection from '@/components/ui/FormSection'
import FormFieldBlock from '@/components/ui/FormFieldBlock'
import DisplayField from '@/components/ui/DisplayField'

function Row({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{children}</div>
}

function formatDate(d) {
  if (!d) return '-'
  try { return new Date(d).toLocaleDateString('th-TH') } catch { return String(d) }
}

export default function WorkView({ work }) {
  if (!work) return null
  const { type, status, createdAt, detail } = work
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
      <FormSection title={`ข้อมูลผลงาน (${type})`}>
        <FormFieldBlock>
          <Row>
            <DisplayField label="สถานะ" value={status} />
            <DisplayField label="วันที่สร้าง" value={formatDate(createdAt)} />
          </Row>
        </FormFieldBlock>

        {type === 'PUBLICATION' && (
          <>
            <FormFieldBlock>
              <DisplayField label="ชื่อเรื่อง (ไทย)" value={detail?.titleTh} />
              <DisplayField label="ชื่อเรื่อง (อังกฤษ)" value={detail?.titleEn} />
            </FormFieldBlock>
            <FormFieldBlock>
              <Row>
                <DisplayField label="เกี่ยวข้องสิ่งแวดล้อม/ยั่งยืน" value={detail?.isEnvironmentallySustainable ? 'เกี่ยวข้อง' : 'ไม่เกี่ยวข้อง'} />
                <DisplayField label="ชื่อวารสาร" value={detail?.journalName} />
                <DisplayField label="DOI" value={detail?.doi} />
              </Row>
              <Row>
                <DisplayField label="ISSN" value={detail?.issn} />
                <DisplayField label="ช่วงปี (เริ่ม)" value={detail?.durationYearStart} />
                <DisplayField label="ช่วงปี (สิ้นสุด)" value={detail?.durationYearEnd} />
              </Row>
              <Row>
                <DisplayField label="ระดับ" value={detail?.level} />
                <DisplayField label="อยู่ในฐานข้อมูลวารสาร" value={detail?.isJournalDatabase ? 'ใช่' : 'ไม่ใช่'} />
              </Row>
              {detail?.isJournalDatabase === true && (
                <Row>
                  <DisplayField label="Scopus" value={detail?.scopus ? 'ใช่' : 'ไม่ใช่'} />
                  <DisplayField label="Web of Science" value={detail?.WebOfScience ? 'ใช่' : 'ไม่ใช่'} />
                  <DisplayField label="ABDC" value={detail?.ABDC ? 'ใช่' : 'ไม่ใช่'} />
                  <DisplayField label="AJG" value={detail?.AJG ? 'ใช่' : 'ไม่ใช่'} />
                  <DisplayField label="SSRN" value={detail?.SocialScienceResearchNetwork ? 'ใช่' : 'ไม่ใช่'} />
                </Row>
              )}
            </FormFieldBlock>
            <FormFieldBlock>
              <DisplayField label="คำสำคัญ" value={detail?.keywords} />
              <DisplayField label="บทคัดย่อ (ไทย)" value={detail?.abstractTh} />
              <DisplayField label="บทคัดย่อ (อังกฤษ)" value={detail?.abstractEn} />
            </FormFieldBlock>
          </>
        )}

        {type === 'CONFERENCE' && (
          <>
            <FormFieldBlock>
              <DisplayField label="ชื่อเรื่อง (ไทย)" value={detail?.titleTh} />
              <DisplayField label="ชื่อเรื่อง (อังกฤษ)" value={detail?.titleEn} />
            </FormFieldBlock>
            <FormFieldBlock>
              <Row>
                <DisplayField label="เกี่ยวข้องสิ่งแวดล้อม/ยั่งยืน" value={detail?.isEnvironmentallySustainable ? 'เกี่ยวข้อง' : 'ไม่เกี่ยวข้อง'} />
                <DisplayField label="ชื่อการประชุม/วารสาร" value={detail?.journalName} />
                <DisplayField label="DOI" value={detail?.doi} />
              </Row>
              <Row>
                <DisplayField label="ISBN" value={detail?.isbn} />
                <DisplayField label="เริ่มต้น" value={formatDate(detail?.durationStart)} />
                <DisplayField label="สิ้นสุด" value={formatDate(detail?.durationEnd)} />
              </Row>
              <Row>
                <DisplayField label="ค่าใช้จ่าย" value={detail?.cost} after="บาท" />
                <DisplayField label="การนำเสนอผลงาน" value={detail?.presentationWork} />
                <DisplayField label="ประเภทการนำเสนอ" value={detail?.presentType} />
              </Row>
              <Row>
                <DisplayField label="ลักษณะบทความ" value={detail?.articleType} />
                <DisplayField label="ระดับ" value={detail?.level} />
                <DisplayField label="แหล่งทุน" value={detail?.fundName} />
              </Row>
            </FormFieldBlock>
            <FormFieldBlock>
              <DisplayField label="บทคัดย่อ (ไทย)" value={detail?.abstractTh} />
              <DisplayField label="บทคัดย่อ (อังกฤษ)" value={detail?.abstractEn} />
              <DisplayField label="สรุปเนื้อหา" value={detail?.summary} />
              <DisplayField label="คำสำคัญ" value={detail?.keywords} />
            </FormFieldBlock>
          </>
        )}

        {type === 'FUNDING' && (
          <>
            <FormFieldBlock>
              <Row>
                <DisplayField label="ชื่อ-นามสกุล" value={detail?.fullName} />
                <DisplayField label="ตำแหน่ง" value={detail?.position} />
                <DisplayField label="คณะ/สถาบัน" value={detail?.faculty} />
              </Row>
            </FormFieldBlock>
            <FormFieldBlock>
              <DisplayField label="คำอธิบายเนื้อหา" value={detail?.contentDesc} />
              <DisplayField label="ผลงานเดิม" value={detail?.priorWorks} />
              <DisplayField label="วัตถุประสงค์" value={detail?.objectives} />
              <DisplayField label="กลุ่มเป้าหมาย" value={detail?.targetAudience} />
              <DisplayField label="โครงร่างบท" value={detail?.chaptersOutline} />
              <Row>
                <DisplayField label="จำนวนหน้าโดยประมาณ" value={detail?.approxPages} />
                <DisplayField label="ระยะเวลาโดยประมาณ" value={detail?.approxTimeline} />
              </Row>
              <DisplayField label="บรรณานุกรม" value={detail?.bibliography} />
            </FormFieldBlock>
          </>
        )}

        {type === 'BOOK' && (
          <>
            <FormFieldBlock>
              <Row>
                <DisplayField label="ประเภทผลงาน" value={detail?.kind} />
                <DisplayField label="ระดับ" value={detail?.level} />
                <DisplayField label="วันที่เกิดผลงาน" value={formatDate(detail?.occurredAt)} />
              </Row>
            </FormFieldBlock>
            <FormFieldBlock>
              <DisplayField label="ชื่อเรื่อง (ไทย)" value={detail?.titleTh} />
              <DisplayField label="ชื่อเรื่อง (อังกฤษ)" value={detail?.titleEn} />
              <DisplayField label="รายละเอียด" value={detail?.detail} />
            </FormFieldBlock>
          </>
        )}
      </FormSection>
    </div>
  )
}

