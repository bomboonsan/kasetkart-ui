"use client"

import { useEffect, useMemo, useState } from 'react'
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

export default function ViewProjectPage() {
  const params = useParams()
  const id = params?.id
  const { data, error } = useSWR(id ? `/projects/${id}` : null, api.get)
  const project = data || null

  return (
    <div className="space-y-6">
      <PageHeader title="รายละเอียดโครงการวิจัย" />

      {error && (
        <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error.message || 'โหลดข้อมูลไม่ได้'}</div>
      )}

      {!project ? (
        <div className="p-4 text-gray-500">กำลังโหลด...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <form className="p-6 space-y-8">
            <FormSection>
              <FormFieldBlock>
                <FormInput label="ปีงบประมาณ" type="text" value={toDash(project.fiscalYear)} readOnly />
              </FormFieldBlock>
              <FormFieldBlock>
                <FormInput label="ประเภทโครงการ" type="text" value={toDash(project.projectType)} readOnly />
              </FormFieldBlock>
              <FormFieldBlock>
                <FormInput label="ลักษณะโครงการวิจัย" type="text" value={toDash(project.projectMode)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="จำนวนโครงการย่อย" type="text" value={toDash(project.subProjectCount ?? 0)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock className="grid grid-cols-1 gap-6">
                <FormTextarea label="ชื่อแผนงานวิจัยหรือชุดโครงการวิจัย/โครงการวิจัย (ไทย)" value={toDash(project.nameTh)} readOnly />
              </FormFieldBlock>
              <FormFieldBlock className="grid grid-cols-1 gap-6">
                <FormTextarea label="ชื่อแผนงานวิจัยหรือชุดโครงการวิจัย/โครงการวิจัย (อังกฤษ)" value={toDash(project.nameEn)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="เกี่ยวข้องสิ่งแวดล้อมและความยั่งยืน" type="text" value={project.isEnvironmentallySustainable === true ? 'เกี่ยวข้อง' : (project.isEnvironmentallySustainable === false ? 'ไม่เกี่ยวข้อง' : '-')} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="วันที่เริ่มต้น" type="text" value={isoDate(project.durationStart)} readOnly />
                <FormInput label="วันที่สิ้นสุด" type="text" value={isoDate(project.durationEnd)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="ประเภทงานวิจัย" type="text" value={toDash(project.researchKind)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="แหล่งทุน" type="text" value={toDash(project.fundType)} readOnly />
                <FormInput label="ชื่อแหล่งทุน" type="text" value={toDash(project.fundName)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="งบวิจัย" type="text" value={toDash(project.budget)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormTextarea label="คำสำคัญ" value={toDash(project.keywords)} readOnly />
              </FormFieldBlock>

              <FormFieldBlock>
                <FormInput label="IC Types" type="text" value={toDash(project.icTypes)} readOnly />
                <FormInput label="Impact" type="text" value={toDash(project.impact)} readOnly />
                <FormInput label="SDG" type="text" value={toDash(project.sdg)} readOnly />
              </FormFieldBlock>
            </FormSection>
          </form>
        </div>
      )}
    </div>
  )
}

