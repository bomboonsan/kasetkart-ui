'use client'

import { useState, useEffect } from 'react'
import FormSection from './FormSection'
import FormFieldBlock from './FormFieldBlock'
import FormField from './FormField'
import ProjectPicker from './ProjectPicker'
import UserPicker from './UserPicker'
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormCheckbox from './FormCheckbox'
import FormTextarea from './FormTextarea'
import FormDateSelect from './FormDateSelect'
import FormSelect from "./FormSelect";
import FileUploadField from './FileUploadField'
import ResearchTeamTable from './ResearchTeamTable'
import Button from './Button'
import { api } from '@/lib/api'
import SweetAlert2 from 'react-sweetalert2'

export default function CreateAcademicForm({ mode = 'create', workId, initialData }) {
  const [swalProps, setSwalProps] = useState({})
  // Align to ConferenceDetail fields
  const [formData, setFormData] = useState({
    titleTh: "",
    titleEn: "",
    isEnvironmentallySustainable: undefined,
    journalName: "",
    projectId: "",
    doi: "",
    isbn: "",
    durationStart: "",
    durationEnd: "",
    cost: "",
    presentationWork: "",
    presentType: "",
    articleType: "",
    abstractTh: "",
    abstractEn: "",
    summary: "",
    keywords: "",
    level: "",
    countryCode: "",
    state: "",
    city: "",
    fundName: "",
    // team-like (for ResearchTeamTable)
    isInternal: undefined,
    fullname: "",
    orgName: "",
    partnerType: "",
    partnerComment: "",
    partnerFullName: "",
    userId: undefined,
    __userObj: undefined,
    attachments: [],
  });

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Prefill when editing
  useEffect(() => {
    if (!initialData) return
    setFormData(prev => ({
      ...prev,
      ...initialData,
      durationStart: initialData.durationStart ? String(initialData.durationStart).slice(0,10) : '',
      durationEnd: initialData.durationEnd ? String(initialData.durationEnd).slice(0,10) : '',
      projectId: initialData?.Project?.id ? String(initialData.Project.id) : (prev.projectId || ''),
    }))
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    setSubmitting(true)
    try {
      const detail = {
        titleTh: formData.titleTh,
        titleEn: formData.titleEn || undefined,
        isEnvironmentallySustainable: formData.isEnvironmentallySustainable,
        journalName: formData.journalName || undefined,
        doi: formData.doi || undefined,
        isbn: formData.isbn || undefined,
        durationStart: formData.durationStart,
        durationEnd: formData.durationEnd,
        cost: formData.cost ? parseInt(formData.cost) : undefined,
        presentationWork: formData.presentationWork || undefined,
        presentType: formData.presentType || undefined,
        articleType: formData.articleType || undefined,
        abstractTh: formData.abstractTh || undefined,
        abstractEn: formData.abstractEn || undefined,
        summary: formData.summary || undefined,
        keywords: formData.keywords || undefined,
        level: formData.level || undefined,
        countryCode: formData.countryCode || undefined,
        state: formData.state || undefined,
        city: formData.city || undefined,
        fundName: formData.fundName || undefined,
      }
      const attachments = (formData.attachments || []).map(a => ({ id: a.id }))
      const authors = formData.userId ? [{ userId: parseInt(formData.userId), isCorresponding: true }] : []
      const payload = { type: 'CONFERENCE', status: 'DRAFT', detail, authors, attachments }
      if (mode === 'edit' && workId) {
        await api.put(`/works/${workId}`, payload)
        setSwalProps({ show: true, icon: 'success', title: 'อัปเดตผลงานประชุมวิชาการสำเร็จ', timer: 1600, showConfirmButton: false })
      } else if (formData.projectId) {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const res = await fetch(`${base}/projects/${formData.projectId}/works`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(payload), credentials: 'include'
        })
        if (!res.ok) { const data = await res.json().catch(()=>({})); throw new Error(data?.error?.message || 'บันทึกไม่สำเร็จ') }
        setSwalProps({ show: true, icon: 'success', title: 'บันทึกผลงานประชุมวิชาการสำเร็จ', timer: 1600, showConfirmButton: false })
      } else {
        await api.post('/works', payload)
        setSwalProps({ show: true, icon: 'success', title: 'บันทึกผลงานประชุมวิชาการสำเร็จ', timer: 1600, showConfirmButton: false })
      }
    } catch (err) {
      setError(err.message || 'บันทึกไม่สำเร็จ')
      setSwalProps({ show: true, icon: 'error', title: 'บันทึกไม่สำเร็จ', text: err.message || '', timer: 2200 })
    } finally {
      setSubmitting(false)
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
        )}
        <FormSection>
          <FormFieldBlock>
            <FormTextarea
              label="ชื่อผลงาน (ไทย)"
              required
              value={formData.titleTh}
              onChange={(value) => handleInputChange("titleTh", value)}
              placeholder=""
            />

            <FormTextarea
              label="ชื่อผลงาน (อังกฤษ)"
              required
              value={formData.titleEn}
              onChange={(value) => handleInputChange("titleEn", value)}
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
              required
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
                    required
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
              required
              label="การนำเสนอผลงาน"
              options={[
                {
                  label: "ได้รับเชิญ (Invited Paper.)",
                  value: "ได้รับเชิญ (Invited Paper.)",
                },
                {
                  label: "เสนอเอง",
                  value: "เสนอเอง",
                },
              ]}
              value={formData.presentationWork}
              onChange={(value) => handleInputChange("presentationWork", value)}
            />
            <FormRadio
              inline={true}
              required
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
              required
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
              required
              value={formData.abstractTh}
              onChange={(value) => handleInputChange("abstractTh", value)}
              placeholder=""
            />
            <FormTextarea
              label="บทคัดย่อ (อังกฤษ) (ไม่มีข้อมูลให้ใส่ “-”)"
              required
              value={formData.abstractEn}
              onChange={(value) => handleInputChange("abstractEn", value)}
              placeholder=""
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="กรณีเข้าร่วมประชุมวิชาการ สรุปเนื้อหาการประชุมแบบย่อ(ถ้าไม่มีข้อมูลให้ใส่ -)"
              required
              value={formData.summary}
              onChange={(value) => handleInputChange("summary", value)}
              placeholder=""
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FileUploadField
              label="* ส่งไฟล์หลักฐาน (ขอให้ Scan หน้าปก สารบัญ และไฟล์เรื่องเต็ม ของการประชุม เพื่อการตรวจสอบหลักฐาน)"
              onFilesChange={(attachments) => handleInputChange("attachments", attachments)}
              accept=".pdf,.doc,.docx"
              multiple
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormRadio
              inline={true}
              required
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
              required
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
              required
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
              required
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
              required
              value={formData.fundName}
              onChange={(value) => handleInputChange("fundName", value)}
              placeholder=""
            />
          </FormFieldBlock>
          <FormFieldBlock>
            <FormTextarea
              label="คำสำคัญ (คั่นระหว่างคำด้วยเครื่องหมาย “;” เช่น ข้าว; พืช; อาหาร)"
              required
              value={formData.keywords}
              onChange={(value) => handleInputChange("keywords", value)}
              placeholder=""
            />
          </FormFieldBlock>
        </FormSection>

        <div className='p-4 rounded-md border shadow border-gray-200/70'>
                  <FormSection title="* ผู้ร่วมวิจัย">
                    <ResearchTeamTable projectId={formData.projectId} formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} />
                  </FormSection>
                </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
}
