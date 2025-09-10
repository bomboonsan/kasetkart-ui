'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSWR, { mutate } from 'swr'
// ใช้ path alias (@/) เพื่อให้ import สั้นและชัดเจน
import { worksAPI } from '@/lib/api/works'
import { projectAPI } from '@/lib/api/project'
import { profileAPI } from '@/lib/api/profile'
import { stripUndefined, getDocumentId } from '@/utils/strapi'
import { createHandleChange } from '@/utils/form'
import FormSection from './FormSection'
import FormFieldBlock from './FormFieldBlock'
import FormField from './FormField'
import ProjectPicker from './ProjectPicker'
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormCheckbox from './FormCheckbox'
import FormTextarea from './FormTextarea'
import FormDateSelect from './FormDateSelect'
import FormSelect from "./FormSelect";
import FileUploadField from './FileUploadField'
import EditableResearchTeamSection from './EditableResearchTeamSection'
import Button from './Button'
import SweetAlert2 from 'react-sweetalert2'

export default function CreateConferenceForm({ mode = 'create', workId, initialData }) {
  const router = useRouter()
  const [swalProps, setSwalProps] = useState({})
  
  // Form state aligned to work-conference schema
  const [formData, setFormData] = useState({
    project_research: '', // relation to project-research
    titleTH: "", // ชื่อผลงาน (ไทย)
    titleEN: "", // ชื่อผลงาน (อังกฤษ)
    isEnvironmentallySustainable: 0, // เกี่ยวข้องกับสิ่งแวดล้อมและความยั่งยืน (Int) 0=เกี่ยวข้อง, 1=ไม่เกี่ยวข้อง
    journalName: "", // ชื่อการประชุมทางวิชาการ (ใช้ชื่อไทยถ้าไม่มีชื่อไทยให้ใช้ภาษาอื่น)
    doi: "", // DOI (ถ้าไม่มีให้ใส่ “-”) ความหมายของ DOI
    isbn: "", // ISBN (ป้อนอักษร 10 ตัว หรือ 13 ตัว ไม่ต้องใส่ “-”)
    durationStart: "", // ระยะเวลาการทำวิจัย (Date)
    durationEnd: "", // ระยะเวลาการทำวิจัย (Date)
    cost: "", // ค่าใช้จ่าย (Int)
    costType: "", // ค่าใช้จ่ายมาจาก  (Int) Value จาก select
    __projectObj: undefined, // สำหรับเก็บ object โครงการวิจัยที่เลือก
    presentationWork: "", // การนำเสนอผลงาน (Int) 0=ได้รับเชิญ (Invited Paper.), 1=เสนอเอง
    presentType: "", // ประเภทการนำเสนอ (Int) 0=ภาคบรรยาย (Oral), 1=ภาคโปสเตอร์ (Poster), 2=เข้าร่วมประชุมวิชาการ
    articleType: "", // ประเภทบทความ (Int) 0=Abstract อย่างเดียว, 1=เรื่องเต็ม
    abstractTH: "", // บทคัดย่อ (ไทย) (ไม่มีข้อมูลให้ใส่ “-”)
    abstractEN: "", // บทคัดย่อ (อังกฤษ) (ไม่มีข้อมูลให้ใส่ “-”)
    summary: "", // กรณีเข้าร่วมประชุมวิชาการ สรุปเนื้อหาการประชุมแบบย่อ(ถ้าไม่มีข้อมูลให้ใส่ -)
    keywords: "", // คำสำคัญ (คั่นระหว่างคำด้วยเครื่องหมาย “;” เช่น ข้าว; พืช; อาหาร)
    level: "", // ระดับ 0=ระดับชาติ, 1=ระดับนานาชาติ
    countryCode: "", // รหัสประเทศ   (Int) Value จาก select
    state: "", // รัฐ/จังหวัด   (Int) Value จาก select
    city: "", // เมือง   (Int) Value จาก select
    fundName: "", // ชื่อแหล่งทุน (String)
    attachments: [],
  });

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Load current user for context
  const { data: userRes, error: userError } = useSWR('users/me', () => profileAPI.getCurrentUser())
  
  // Load existing work when editing
  const { data: workRes, error: workError } = useSWR(
    mode === 'edit' && workId ? ['work-conference', workId] : null,
    () => worksAPI.getConference(workId)
  )

  // Prefill when editing
  useEffect(() => {
    if (!workRes?.data) return
    const work = workRes.data
    setFormData(prev => ({
      ...prev,
    project_research: getDocumentId(work.project_research) || '',
      titleTH: work.titleTH || '',
      titleEN: work.titleEN || '',
      isEnvironmentallySustainable: work.isEnvironmentallySustainable || 0,
      journalName: work.journalName || '',
      doi: work.doi || '',
      isbn: work.isbn || '',
      durationStart: work.durationStart ? String(work.durationStart).slice(0,10) : '',
      durationEnd: work.durationEnd ? String(work.durationEnd).slice(0,10) : '',
      cost: work.cost || 0,
      costType: work.costType || 0,
      presentationWork: work.presentationWork || 0,
      presentType: work.presentType || 0,
      articleType: work.articleType || 0,
      abstractTH: work.abstractTH || '',
      abstractEN: work.abstractEN || '',
      summary: work.summary || '',
      keywords: work.keywords || '',
      level: work.level || 0,
      countryCode: work.countryCode || 0,
      state: work.state || 0,
      city: work.city || 0,
      fundName: work.fundName || '',
      attachments: work.attachments || [],
      __projectObj: work.project_research || undefined,
    }))
  }, [workRes])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    setSubmitting(true)
    
    try {
      // Prepare payload aligned to work-conference schema
      const payload = {
    project_research: getDocumentId(formData.project_research) || undefined,
        titleTH: formData.titleTH || undefined,
        titleEN: formData.titleEN || undefined,
        isEnvironmentallySustainable: parseInt(formData.isEnvironmentallySustainable) || 0,
        journalName: formData.journalName || undefined,
        doi: formData.doi || undefined,
        isbn: formData.isbn || undefined,
        durationStart: formData.durationStart || undefined,
        durationEnd: formData.durationEnd || undefined,
        cost: formData.cost ? parseInt(formData.cost) : undefined,
        costType: parseInt(formData.costType) || 0,
        presentationWork: parseInt(formData.presentationWork) || 0,
        presentType: parseInt(formData.presentType) || 0,
        articleType: parseInt(formData.articleType) || 0,
        abstractTH: formData.abstractTH || undefined,
        abstractEN: formData.abstractEN || undefined,
        summary: formData.summary || undefined,
        keywords: formData.keywords || undefined,
        level: parseInt(formData.level) || 0,
        countryCode: formData.countryCode ? parseInt(formData.countryCode) : undefined,
        state: formData.state ? parseInt(formData.state) : undefined,
        city: formData.city ? parseInt(formData.city) : undefined,
        fundName: formData.fundName || undefined,
        attachments: (formData.attachments || []).map(a => ({ id: a.id })),
      }

  // Clean payload
  const cleanPayload = stripUndefined(payload)

      let result
      if (mode === 'edit' && workId) {
  result = await worksAPI.updateConference(workId, cleanPayload)
        setSwalProps({ 
          show: true, 
          icon: 'success', 
          title: 'แก้ไขผลงานการประชุมสำเร็จ', 
          timer: 1600, 
          showConfirmButton: false 
        })
      } else {
  result = await worksAPI.createConference(cleanPayload)
        setSwalProps({ 
          show: true, 
          icon: 'success', 
          title: 'สร้างผลงานการประชุมสำเร็จ', 
          timer: 1600, 
          showConfirmButton: false 
        })
      }

      // Refresh data and navigate
      mutate('work-conferences')
      setTimeout(() => router.push('/form/overview'), 1200)

    } catch (err) {
        const msg = err?.response?.data?.error?.message || err?.message || 'เกิดข้อผิดพลาด'
        setError(msg)
        setSwalProps({ 
          show: true, 
          icon: 'error', 
          title: 'บันทึกไม่สำเร็จ', 
          text: msg, 
          timer: 2200 
        })
    } finally {
      setSubmitting(false)
    }
  };

  const handleInputChange = createHandleChange(setFormData)

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
        )}
        {/* <FormSection>
          <FormFieldBlock>
            <ProjectPicker
              label="โครงการวิจัย"
              
              selectedProject={formData.__projectObj}
              onSelect={(project) => {
                handleInputChange('project_research', getDocumentId(project))
                handleInputChange('__projectObj', project)
              }}
            />
          </FormFieldBlock>
        </FormSection> */}

        <FormSection>
          <FormFieldBlock>
            <FormTextarea
              label="ชื่อผลงาน (ไทย)"
              
              value={formData.titleTH}
              onChange={(value) => handleInputChange("titleTH", value)}
              placeholder=""
            />

            <FormTextarea
              label="ชื่อผลงาน (อังกฤษ)"
              
              value={formData.titleEN}
              onChange={(value) => handleInputChange("titleEN", value)}
              placeholder=""
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <div className="flex items-center gap-10">
              <label className="flex items-center gap-3 text-zinc-700">
                <input
                  type="radio"
                  value="true"
                  checked={formData.isEnvironmentallySustainable === true}
                  onChange={() => handleInputChange("isEnvironmentallySustainable", true)}
                  className={`
                    text-zinc-700
                    px-3 py-2 border border-gray-300 rounded-md
                    placeholder-gray-400 focus:outline-none focus:ring-2
                    focus:ring-blue-500 focus:border-blue-500
                    transition-colors duration-200
                `}
                />
                <strong>เกี่ยวข้อง</strong> กับสิ่งแวดล้อมและความยั่งยืน
              </label>
              <label className="flex items-center gap-3 text-zinc-700">
                <input
                  type="radio"
                  value="false"
                  checked={formData.isEnvironmentallySustainable === false}
                  onChange={() => handleInputChange("isEnvironmentallySustainable", false)}
                  className={`
                    text-zinc-700
                    px-3 py-2 border border-gray-300 rounded-md
                    placeholder-gray-400 focus:outline-none focus:ring-2
                    focus:ring-blue-500 focus:border-blue-500
                    transition-colors duration-200
                `}
                />
                <strong>ไม่เกี่ยวข้อง</strong> กับสิ่งแวดล้อมและความยั่งยืน
              </label>
            </div>
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="ชื่อการประชุมทางวิชาการ (ใช้ชื่อไทยถ้าไม่มีชื่อไทยให้ใช้ภาษาอื่น)"
              
              value={formData.journalName}
              onChange={(value) => handleInputChange("journalName", value)}
              placeholder=""
            />
            <ProjectPicker
              label="โครงการวิจัย"
              selectedProject={formData.__projectObj}
              onSelect={(p) => {
                const ds = p.durationStart ? String(p.durationStart).slice(0,10) : ''
                const de = p.durationEnd ? String(p.durationEnd).slice(0,10) : ''
                setFormData(prev => ({
                  ...prev,
                  projectId: String(p.id),
                  __projectObj: p,
                  // Prefill from Project
                  isEnvironmentallySustainable: p.isEnvironmentallySustainable ?? prev.isEnvironmentallySustainable,
                  fundName: p.fundName || prev.fundName,
                  keywords: p.keywords || prev.keywords,
                  durationStart: ds || prev.durationStart,
                  durationEnd: de || prev.durationEnd,
                }))
              }}
            />
            <FormInput
              label="DOI (ถ้าไม่มีให้ใส่ “-”) ความหมายของ DOI"
              type="text"
              value={formData.doi}
              onChange={(value) => handleInputChange("doi", value)}
              placeholder=""
            />
            <FormInput
              label="ISBN (ป้อนอักษร 10 ตัว หรือ 13 ตัว ไม่ต้องใส่ “-”)"
              type="text"
              value={formData.isbn}
              onChange={(value) => handleInputChange("isbn", value)}
              placeholder=""
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-zinc-700">
                  วัน/เดือน/ปี ที่นำเสนอ
                  <span className="text-red-500 ml-1">*</span>
                </p>
              </div>
              <div>
                <FormDateSelect
                  title="เริ่มต้น"
                  value={formData.durationStart}
                  onChange={(value) => handleInputChange("durationStart", value)}
                />
              </div>
              <div>
                <FormDateSelect
                  title="สิ้นสุด"
                  value={formData.durationEnd}
                  onChange={(value) => handleInputChange("durationEnd", value)}
                />
              </div>
            </div>
            <div className="space-y-1 flex items-center">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">
                  ค่าใช้จ่าย <span className="text-red-500 ml-1">*</span>
                </label>
              </div>
              <div className="flex-1 space-x-3">
                
                <div className='flex gap-4 items-center'>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                    placeholder="0"
                    
                    className={`
                  w-auto inline-block
          text-zinc-700
            px-3 py-2 border border-gray-300 rounded-md
            placeholder-gray-400 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
          `}
                  />
                  <span className='text-gray-700'>จาก</span>
                  <select
                    value={formData.costType}
                    onChange={(e) => handleInputChange("costType", e.target.value)}
                    
                    className="text-zinc-700
                                block w-auto px-3 py-2 border border-gray-300 rounded-md
                                bg-white focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200">
                    <option value={''}>-- กรุณาเลือก --</option>
                    <option value="1">เงินทุนส่วนตัว</option>
                    <option value="10">เงินอุดหนุนรัฐบาลและเงินอุดหนุนอื่นที่รัฐบาลจัดสรรให้</option>
                    <option value="11">เงินงบประมาณมหาวิทยาลัย</option>
                    <option value="12">เงินรายได้ส่วนกลาง มก.</option>
                    <option value="13">ทุนอุดหนุนวิจัย มก.</option>
                    <option value="14">เงินรายได้มหาวิทยาลัย</option>
                    <option value="15">เงินรายได้ส่วนงาน</option>
                    <option value="16">องค์กรรัฐ</option>
                    <option value="17">องค์กรอิสระและเอกชน</option>
                    <option value="18">แหล่งทุนต่างประเทศ</option>
                    <option value="20">รัฐวิสาหกิจ</option>
                  </select>
                </div>
              </div>
            </div>
            <FormRadio
              inline={true}
              
              label="การนำเสนอผลงาน"
              options={[
                {
                  label: "ได้รับเชิญ (Invited Paper.)",
                  value: 0,
                },
                {
                  label: "เสนอเอง",
                  value: 1,
                },
              ]}
              value={formData.presentationWork}
              onChange={(value) => handleInputChange("presentationWork", parseInt(value))}
            />
            <FormRadio
              inline={true}
              
              label="ประเภทการนำเสนอ"
              options={[
                {
                  label: "ภาคบรรยาย (Oral)",
                  value: "ภาคบรรยาย (Oral)",
                },
                {
                  label: "ภาคโปสเตอร์ (Poster)",
                  value: "ภาคโปสเตอร์ (Poster)",
                },
                {
                  label: "เข้าร่วมประชุมวิชาการ",
                  value: "เข้าร่วมประชุมวิชาการ",
                },
              ]}
              value={formData.presentType}
              onChange={(value) => handleInputChange("presentType", value)}
            />
            <FormRadio
              inline={true}
              
              label="ลักษณะของบทความ"
              options={[
                {
                  label: "Abstract อย่างเดียว",
                  value: "Abstract อย่างเดียว",
                },
                {
                  label: "เรื่องเต็ม",
                  value: "เรื่องเต็ม",
                },
              ]}
              value={formData.articleType}
              onChange={(value) => handleInputChange("articleType", value)}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="บทคัดย่อ (ไทย) (ไม่มีข้อมูลให้ใส่ “-”)"
              
              value={formData.abstractTH}
              onChange={(value) => handleInputChange("abstractTH", value)}
              placeholder=""
            />
            <FormTextarea
              label="บทคัดย่อ (อังกฤษ) (ไม่มีข้อมูลให้ใส่ “-”)"
              
              value={formData.abstractEN}
              onChange={(value) => handleInputChange("abstractEN", value)}
              placeholder=""
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="กรณีเข้าร่วมประชุมวิชาการ สรุปเนื้อหาการประชุมแบบย่อ(ถ้าไม่มีข้อมูลให้ใส่ -)"
              
              value={formData.summary}
              onChange={(value) => handleInputChange("summary", value)}
              placeholder=""
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FileUploadField
              label="* ส่งไฟล์หลักฐาน (ขอให้ Scan หน้าปก สารบัญ และไฟล์เรื่องเต็ม ของการประชุม เพื่อการตรวจสอบหลักฐาน)"
              // ปรับให้รองรับการอัปโหลดไฟล์หลายครั้งแบบสะสม
              value={formData.attachments}
              onFilesChange={(attachments) => handleInputChange("attachments", attachments)}
              accept=".pdf,.doc,.docx"
              multiple
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormRadio
              inline={true}
              
              label="ระดับการนำเสนอ"
              options={[
                {
                  label: "ระดับชาติ",
                  value: "NATIONAL",
                },
                {
                  label: "ระดับนานาชาติ",
                  value: "INTERNATIONAL",
                },
              ]}
              value={formData.level}
              onChange={(value) => handleInputChange("level", value)}
            />
            <FormSelect
              label="ประเทศ"
              
              value={formData.countryCode}
              onChange={(value) => handleInputChange("countryCode", value)}
              className="max-w-lg"
              options={[
                { value: '', label: 'เลือกประเทศ' },
                { value: 'TH', label: 'Thailand' },
                { value: 'US', label: 'United States' },
                { value: 'UK', label: 'United Kingdom' },
              ]}
            />
            <FormSelect
              label="มลรัฐ/จังหวัด"
              
              value={formData.state}
              onChange={(value) => handleInputChange("state", value)}
              className="max-w-lg"
              options={[
                { value: '', label: 'เลือกมลรัฐ/จังหวัด' },
                { value: 'Bangkok', label: 'Bangkok' },
                { value: 'ChiangMai', label: 'Chiang Mai' },
                { value: 'Phuket', label: 'Phuket' },
              ]}
            />
            <FormSelect
              label="เมือง"
              
              value={formData.city}
              onChange={(value) => handleInputChange("city", value)}
              className="max-w-lg"
              options={[
                { value: '', label: 'เลือกเมือง' },
                { value: 'เมือง1', label: 'เมือง 1' },
                { value: 'เมือง2', label: 'เมือง 2' },
                { value: 'เมือง3', label: 'เมือง 3' },
              ]}
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="ชื่อแหล่งทุน"
              
              value={formData.fundName}
              onChange={(value) => handleInputChange("fundName", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="คำสำคัญ (คั่นระหว่างคำด้วยเครื่องหมาย “;” เช่น ข้าว; พืช; อาหาร)"
              
              value={formData.keywords}
              onChange={(value) => handleInputChange("keywords", value)}
              placeholder=""
            />
          </FormFieldBlock>
        </FormSection>

        {/* Research Team Section (Editable) */}
        {formData.__projectObj && (
          <div className='p-4 rounded-md border shadow border-gray-200/70'>
            <EditableResearchTeamSection project={formData.__projectObj} />
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" type="button">
            ยกเลิก
          </Button>
          
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'กำลังบันทึก...' : (mode === 'edit' ? 'แก้ไข' : 'บันทึก')}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Component to display project partners
function ProjectPartnersDisplay({ project }) {
  const { data: partnersRes, error: partnersError } = useSWR(
    project ? ['project-partners', project.documentId || project.id] : null,
    () => projectAPI.getProjectPartners(project.documentId || project.id)
  )

  const partners = partnersRes?.data || partnersRes || []

  if (partnersError) {
    return <div className="text-sm text-gray-500">ไม่สามารถโหลดข้อมูลผู้ร่วมวิจัยได้</div>
  }

  if (!partners.length) {
    return <div className="text-sm text-gray-500">ไม่มีผู้ร่วมวิจัยในโครงการนี้</div>
  }

  return (
    <div className="space-y-2">
      {partners.map((partner, idx) => (
        <div key={partner.documentId || partner.id || idx} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {partner.users_permissions_user ? (
                `${partner.users_permissions_user.firstName || ''} ${partner.users_permissions_user.lastName || ''}`
              ) : (
                partner.fullname || 'ไม่ระบุชื่อ'
              )}
            </div>
            <div className="text-sm text-gray-600">
              {partner.users_permissions_user?.email || partner.orgName || 'ผู้ร่วมวิจัย'}
            </div>
            {partner.participation_percentage && (
              <div className="text-xs text-gray-500">
                การมีส่วนร่วม: {partner.participation_percentage}%
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
