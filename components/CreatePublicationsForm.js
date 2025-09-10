"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import useSWR, { mutate } from 'swr'
// ใช้ path alias (@/) สำหรับ API
import { worksAPI } from '@/lib/api/works'
import { projectAPI } from '@/lib/api/project'
import { profileAPI } from '@/lib/api/profile'
import { stripUndefined, getDocumentId } from '@/utils/strapi'
import { createHandleChange } from '@/utils/form'
import FormSection from "./FormSection";
import FormFieldBlock from "./FormFieldBlock";
import FormField from "./FormField";
import ProjectPicker from './ProjectPicker'
import UserPicker from './UserPicker'
import FormDoubleInput from './FormDoubleInput'
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormCheckbox from "./FormCheckbox";
import FormTextarea from "./FormTextarea";
import FormDateSelect from "./FormDateSelect";
import FormSelect from "./FormSelect";
import FileUploadField from "./FileUploadField";
import ResearchTeamTable from "./ResearchTeamTable";
import EditableResearchTeamSection from './EditableResearchTeamSection'
import Button from "./Button";
import SweetAlert2 from 'react-sweetalert2'

export default function CreatePublicationsForm({ mode = 'create', workId, initialData }) {
  const [swalProps, setSwalProps] = useState({})

  // Fetch existing work-publication when editing
  const { data: existingWorkPublication } = useSWR(
    mode === 'edit' && workId ? ['work-publication', workId] : null,
    () => worksAPI.getPublication(workId)
  )
  // Align form keys to PublicationDetail model in schema.prisma
  const [formData, setFormData] = useState({
    project_research: '', // relation to project-research (documentId expected by Strapi v5)
    __projectObj: undefined, // สำหรับเก็บ object โครงการวิจัยที่เลือก
    titleTH: "", // ชื่อผลงาน (ไทย)
    titleEN: "", // ชื่อผลงาน (อังกฤษ)
    isEnvironmentallySustainable: 0, // เกี่ยวข้องกับสิ่งแวดล้อมและความยั่งยืน (Int) 0=เกี่ยวข้อง, 1=ไม่เกี่ยวข้อง
    journalName: "", // ชื่อการประชุมทางวิชาการ (ใช้ชื่อไทยถ้าไม่มีชื่อไทยให้ใช้ภาษาอื่น)
    doi: "", // DOI (ถ้าไม่มีให้ใส่ “-”) ความหมายของ DOI
    isbn: "", // ISBN (ป้อนอักษร 10 ตัว หรือ 13 ตัว ไม่ต้องใส่ “-”)
    volume: "", // ปีที่ (Volume) (Int)
    issue: "", // ฉบับที่ (Issue) (Int)
    durationStart: "", // วัน/เดือน/ปี ที่ตีพิมพ์  (Date)
    durationEnd: "", // วัน/เดือน/ปี ที่ตีพิมพ์  (Date)
    pageStart: 0, // หน้าเริ่มต้น (Int)
    pageEnd: 10, // หน้าสิ้นสุด (Int)
    level: "", // ระดับ 0=ระดับชาติ, 1=ระดับนานาชาติ
    isJournalDatabase: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูลหรือไม่
    isScopus: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล Scopus หรือไม่
    scopusType: 0, // Scopus (ถ้าเลือก) (Int) Value จาก select
    scopusValue: 0, // Scopus (ถ้าเลือก) (Int) Value จาก select
    isACI: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล ACI หรือไม่
    isTCI1: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล TCI1 หรือไม่
    isTCI2: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล TCI2 หรือไม่
    isAJG: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล isAJG หรือไม่
    ajgType: 0, // AJG (ถ้าเลือก) (Int) Value จาก select
    isSSRN: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล Social Science Research Network หรือไม่
    isWOS: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล Web of Science หรือไม่
    wosType: 0, // Web of Science (ถ้าเลือก) (Int) Value จาก select
    fundName: "", // ชื่อแหล่งทุน (ถ้ามี)
    keywords: "", // คำสำคัญ (ถ้ามี) คั่นด้วย ,
    abstractTH: "", // บทคัดย่อ (ไทย)
    abstractEN: "", // บทคัดย่อ (อังกฤษ)
    attachments: [],

    // #listsStandard

    listsStandard: [
      {
        "label": "Scopus",
      },
      {
        "label": "ACI",
      },
      {
        "label": "TCI1",

      },
      {
        "label": "ABDC",

      },
      {
        "label": "TCI2",

      },
      {
        "label": "AJG",

      },
      {
        "label": "Social Science Research Network",

      },
      {
        "label": "Web of Science",

      },
    ],

    listsStandardScopus: [
      {
        "label": "Q1",

      },
      {
        "label": "Q2",

      },
      {
        "label": "Q3",

      },
      {
        "label": "Q4",

      },
      {
        "label": "Delisted from Scopus",

      }
    ],

    listsStandardScopusSubset: [
      {
        "label": "Accounting",

      },
      {
        "label": "Analysis",

      },
      {
        "label": "Applied Mathematics",

      },
      {
        "label": "Artificial Intelligence",

      },
      {
        "label": "Business and International Management",

      },
      {
        "label": "Business, Management and Accounting (miscellaneous)",

      },
      {
        "label": "Computational Mathematics",

      },
      {
        "label": "Computational Theory and Mathematics",

      },
      {
        "label": "Computer Graphics and Computer-Aided Design",

      },
      {
        "label": "Computer Networks and Communications",

      },
      {
        "label": "Computer Science (miscellaneous)",

      },
      {
        "label": "Computer Science Application",

      },
      {
        "label": "Computer Vision and Pattern Recognition",

      },
      {
        "label": "Control and Optimisation",

      },
      {
        "label": "Control and Systems Engineering",

      },
      {
        "label": "Decision Science (miscellaneous)",

      },
      {
        "label": "Discrete Mathematics and Combinatorics",

      },
      {
        "label": "Economics and Econometrics",

      },
      {
        "label": "Economics, Econometrics and Finance (miscellaneous)",

      },
      {
        "label": "Education",

      },
      {
        "label": "Finance",

      },
      {
        "label": "General Business, Management and Accounting",

      },
      {
        "label": "General Computer Sciences",

      },
      {
        "label": "General Decision Sciences",

      },
      {
        "label": "General Economics, Econometrics and Finance",

      },
      {
        "label": "General Engineering",

      },
      {
        "label": "General Mathematics",

      },
      {
        "label": "General Social Sciences",

      },
      {
        "label": "Hardware and Architecture",

      },
      {
        "label": "Human-Computer Interaction",

      },
      {
        "label": "Industrial and Manufacturing Engineering",

      },
      {
        "label": "Industrial Relations",

      },
      {
        "label": "Information Systems",

      },
      {
        "label": "Information Systems and Management",

      },
      {
        "label": "Issues, Ethics and Legal Aspects",

      },
      {
        "label": "Leadership and Management",

      },
      {
        "label": "Library and Information Sciences",

      },
      {
        "label": "Logic",

      },
      {
        "label": "Management Information Systems",

      },
      {
        "label": "Management of Technology and Innovation",

      },
      {
        "label": "Management Science and Operations Research",

      },
      {
        "label": "Management, Monitoring, Policy and Law",

      },
      {
        "label": "Marketing",

      },
      {
        "label": "Mathematics (miscellaneous)",

      },
      {
        "label": "Media Technology",

      },
      {
        "label": "Modelling and Simulation",

      },
      {
        "label": "Multidisciplinary",

      },
      {
        "label": "Numerical Analysis",

      },
      {
        "label": "Organisational Behaviour and Human Resource Management",

      },
      {
        "label": "Public Administration",

      },
      {
        "label": "Renewable Energy, Sustainability and the Environment",

      },
      {
        "label": "Research and Theory",

      },
      {
        "label": "Review and Exam Preparation",

      },
      {
        "label": "Safety, Risk, Reliability and Quality",

      },
      {
        "label": "Sensory Systems",

      },
      {
        "label": "Signal Processing",

      },
      {
        "label": "Social Psychology",

      },
      {
        "label": "Social Sciences (miscellaneous)",

      },
      {
        "label": "Sociology and Political Sciences",

      },
      {
        "label": "Software",

      },
      {
        "label": "Statistics and Probability",

      },
      {
        "label": "Statistics, Probability and Uncertainty",

      },
      {
        "label": "Strategy and Management",

      },
      {
        "label": "Stratigraphy",

      },
      {
        "label": "Theoretical Computer Science",

      },
      {
        "label": "Tourism, Leisure and Hospitality Management",

      },
      {
        "label": "Transportation",

      },
      {
        "label": "Urban Studies",

      }
    ],

    listsStandardWebOfScience: [
      {
        "label": "SCIE",
      },
      {
        "label": "SSCI",
      },
      {
        "label": "AHCI",
      },
      {
        "label": "ESCI",
      },
    ],

    listsStandardABDC: [
      {
        "label": "A*",
      },
      {
        "label": "A",
      },
      {
        "label": "B",
      },
      {
        "label": "C",
      },
      {
        "label": "Other",
      },
    ],

    listsStandardAJG: [
      {
        "label": "ระดับ 4*",
      },
      {
        "label": "ระดับ 4",
      },
      {
        "label": "ระดับ 3",
      },
      {
        "label": "ระดับ 2",
      },
      {
        "label": "ระดับอื่น",
      },
    ],
  // selected standard values (use ints for API)
  standardScopus: 0,
  standardScopusSubset: 0,
  standardWebOfScience: 0,
  standardABDC: 0,
  standardAJG: 0,

  });

  // ตัด log debug ออกเพื่อความเรียบร้อยของโค้ด

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Prefill when editing
  useEffect(() => {
    if (existingWorkPublication?.data) {
      const data = existingWorkPublication.data
      setFormData(prev => ({
        ...prev,
        project_research: data.project_research?.documentId || null,
        __projectObj: data.project_research || undefined,
        titleTH: data.titleTH || '',
        titleEN: data.titleEN || '',
        isEnvironmentallySustainable: data.isEnvironmentallySustainable || 0,
        journalName: data.journalName || '',
        doi: data.doi || '',
        isbn: data.isbn || '',
        volume: data.volume || 0,
        issue: data.issue || 0,
        durationStart: data.durationStart ? String(data.durationStart).slice(0,10) : '',
        durationEnd: data.durationEnd ? String(data.durationEnd).slice(0,10) : '',
        pageStart: data.pageStart || 0,
        pageEnd: data.pageEnd || 0,
        level: data.level || 0,
        isJournalDatabase: data.isJournalDatabase || false,
        isScopus: data.isScopus || false,
        scopusType: data.scopusType || 0,
        scopusValue: data.scopusValue || 0,
        isACI: data.isACI || false,
        isTCI1: data.isTCI1 || false,
        isTCI2: data.isTCI2 || false,
        isABDC: data.isABDC || false,
        isAJG: data.isAJG || false,
  isSSRN: data.isSSRN || false,
  // Strapi schema uses `isWOS` (upper-case WOS) — keep state consistent
  isWOS: data.isWOS || false,
        isDifferent: data.isDifferent || false,
        differentDetail: data.differentDetail || '',
        isReceiveAward: data.isReceiveAward || false,
        awardName: data.awardName || '',
        isCorrespondingAuthor: data.isCorrespondingAuthor || false,
        scopusGrade: data.scopusGrade || 0,
        impactFactor: data.impactFactor || 0,
        attachments: data.attachments || [],
        team: data.team || [],
      }))
    } else if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // If initial data contains project_research relation, map to documentId
    project_research: getDocumentId(initialData?.project_research) || prev.project_research || '',
        __projectObj: initialData?.project_research || prev.__projectObj,
      }))
    }
  }, [existingWorkPublication, initialData])

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    setSubmitting(true)
    try {
      // Basic validation for volume/issue
      if (formData.volume < 0 || formData.volume > 9999) {
        throw new Error('ค่าปี (volume) ต้องอยู่ระหว่าง 0 - 9999')
      }
      if (formData.issue < 0 || formData.issue > 9999) {
        throw new Error('ค่าฉบับที่ (issue) ต้องอยู่ระหว่าง 0 - 9999')
      }
      // Build payload matching Strapi v5 schema (see api/src/api/work-publication/content-types/work-publication/schema.json)
      const payload = {
        // relation to project-research: Strapi v5 prefers documentId when searching (we store documentId)
        ...(formData.project_research ? { project_research: formData.project_research } : {}),
        titleTH: formData.titleTH || undefined,
        titleEN: formData.titleEN || undefined,
        isEnvironmentallySustainable: !!formData.isEnvironmentallySustainable,
        journalName: formData.journalName || undefined,
        doi: formData.doi || undefined,
        isbn: formData.isbn || undefined,
        durationStart: formData.durationStart || undefined,
        durationEnd: formData.durationEnd || undefined,
        pageStart: formData.pageStart ? parseInt(formData.pageStart, 10) : undefined,
        pageEnd: formData.pageEnd ? parseInt(formData.pageEnd, 10) : undefined,
        volume: Number.isFinite(Number(formData.volume)) ? Number(formData.volume) : undefined,
        issue: Number.isFinite(Number(formData.issue)) ? Number(formData.issue) : undefined,
        level: parseInt(formData.level) || 0,
        isJournalDatabase: !!formData.isJournalDatabase,
        isScopus: !!formData.isScopus,
        scopusType: formData.scopusType ? parseInt(formData.scopusType, 10) : undefined,
        scopusValue: formData.scopusValue ? parseInt(formData.scopusValue, 10) : undefined,
        isACI: !!formData.isACI,
        isTCI1: !!formData.isTCI1,
        isTCI2: !!formData.isTCI2,
        isAJG: !!formData.isAJG,
        ajgType: formData.ajgType ? parseInt(formData.ajgType, 10) : undefined,
        isSSRN: !!formData.isSSRN,
        isWOS: !!formData.isWOS,
        wosType: formData.wosType ? parseInt(formData.wosType, 10) : undefined,
        fundName: formData.fundName || undefined,
        keywords: formData.keywords || undefined,
        abstractTH: formData.abstractTH || undefined,
        abstractEN: formData.abstractEN || undefined,
        // attachments as media relations
        attachments: (formData.attachments || []).map(a => ({ id: a.id })),
      }
  // Clean payload using shared helper (removes undefined keys)
  const cleanPayload = stripUndefined(payload)

      if (mode === 'edit' && workId) {
  await worksAPI.updatePublication(workId, cleanPayload)
        setSwalProps({ show: true, icon: 'success', title: 'อัปเดตผลงานตีพิมพ์สำเร็จ', timer: 1600, showConfirmButton: false })
      } else {
  await worksAPI.createPublication(cleanPayload)
        setSwalProps({ show: true, icon: 'success', title: 'บันทึกผลงานตีพิมพ์สำเร็จ', timer: 1600, showConfirmButton: false })
      }

      // Refresh list and navigate back
      mutate('work-publications')
      setTimeout(() => router.push('/form/overview'), 1200)
    } catch (err) {
      setError(err.message || 'บันทึกไม่สำเร็จ')
    } finally {
      setSubmitting(false)
    }
  };

  // standard input handler from utils/form
  const handleInputChange = createHandleChange(setFormData)
  const handleCheckboxChange = handleInputChange

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
              label="ชื่อวารสาร/แหล่งตีพิมพ์"
              
              value={formData.journalName}
              onChange={(value) => handleInputChange("journalName", value)}
              placeholder=""
            />
    <ProjectPicker
              label="โครงการวิจัย"
              
              selectedProject={formData.__projectObj}
              onSelect={(p) => {
                setFormData(prev => ({
      ...prev,
      project_research: getDocumentId(p),
                  __projectObj: p,
                  isEnvironmentallySustainable: p.isEnvironmentallySustainable ?? prev.isEnvironmentallySustainable,
                  fundName: p.fundName || prev.fundName,
                  keywords: p.keywords || prev.keywords,
                }))
              }}
            />
            <FormInput
              label="DOI (ถ้าไม่มีให้ใส่ “-”)"
              
              type="text"
              value={formData.doi}
              onChange={(value) => handleInputChange("doi", value)}
              placeholder=""
            />
            <FormInput
              label="ISSN (ถ้ามี)"
              
              type="text"
              value={formData.isbn}
              onChange={(value) => handleInputChange("isbn", value)}
              placeholder=""
            />
            <div className="space-y-1 flex items-center">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">
                </label>
              </div>
              <div className="flex-1 flex items-center space-x-3 md:max-w-60">
                <div className="flex gap-3 items-center">
                  <span className="text-gray-700 inline-block w-[120px]">ปีที่ (Volume) <span className="text-red-500 ml-1">*</span></span>
          <input
            type="number"
            min={0}
            max={9999}
            value={formData.volume}
            onChange={(e) => handleInputChange('volume', Number(e.target.value))}
                    className="text-zinc-700
                            px-3 py-2 border border-gray-300 rounded-md
                            placeholder-gray-400 focus:outline-none focus:ring-2 
                            focus:ring-blue-500 focus:border-blue-500
                            transition-colors duration-200
                            w-[100px]"
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <span className="text-gray-700 inline-block w-[120px]">ฉบับที่ (Issue) <span className="text-red-500 ml-1">*</span></span>
                <input
                  type="number"
                  min={0}
                  max={9999}
                  value={formData.issue}
                  onChange={(e) => handleInputChange('issue', Number(e.target.value))}
                  className="text-zinc-700
                            px-3 py-2 border border-gray-300 rounded-md
                            placeholder-gray-400 focus:outline-none focus:ring-2 
                            focus:ring-blue-500 focus:border-blue-500
                            transition-colors duration-200
                            w-[100px]"
                />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-zinc-700">
                  วัน/เดือน/ปี ที่ตีพิมพ์ <span className="text-red-500 ml-1">*</span>
                </p>
              </div>
              <div>
                <FormDateSelect
                  title="เริ่มต้น"
                  noDay={true}
                  value={formData.durationStart}
                  onChange={(value) => handleInputChange("durationStart", value)}
                />
              </div>
              <div>
                <FormDateSelect
                  title="สิ้นสุด"
                  noDay={true}
                  value={formData.durationEnd}
                  onChange={(value) => handleInputChange("durationEnd", value)}
                />
              </div>
            </div>
            {/* No cost field in PublicationDetail; omitted for schema alignment */}
            <FormDoubleInput
              label="จากหน้า"
              after="ถึง"
              type="number"
              value={formData.pageStart}
              value2={formData.pageEnd}
              onChange={(value, field) => handleInputChange(field, value)}
              placeholder=""
              
            />
            {/* <FormRadio
              inline={true}
              
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
              onChange={(v) => handleInputChange('presentationWork', v)}
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
              onChange={(v) => handleInputChange('presentType', v)}
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
              onChange={(v) => handleInputChange('articleType', v)}
            /> */}
          </FormFieldBlock>

          {/* <FormFieldBlock>
            <FormTextarea
              label="กรณีเข้าร่วมประชุมวิชาการ สรุปเนื้อหาการประชุมแบบย่อ(ถ้าไม่มีข้อมูลให้ใส่ -)"
              
              value={formData.fundName}
              onChange={(value) => handleInputChange("fundName", value)}
              placeholder=""
            />
          </FormFieldBlock> */}


          <FormFieldBlock>
            <FormRadio
              inline={true}
              
              label="ระดับการตีพิมพ์"
              options={[
                {
                  label: "ระดับชาติ",
                  value: 0,
                },
                {
                  label: "ระดับนานาชาติ",
                  value: 1,
                },
              ]}
              value={formData.level}
              onChange={(value) => handleInputChange("level", parseInt(value))}
            />
            <FormRadio
              // disabled={formData.level === "NATIONAL"}
              inline={true}
              label=""
              options={[
                {
                  label: "วารสารที่อยู่ในฐานข้อมูล",
                  value: "true",
                },
                {
                  label: "วารสารที่ไม่อยู่ในฐานข้อมูล",
                  value: "false",
                },
              ]}
              value={String(formData.isJournalDatabase)}
              onChange={(value) => handleInputChange("isJournalDatabase", value === "true")}
            />
            <div>
              {/* Flags for journal database presence */}
              <section className="space-y-1 flex items-center flex-wrap">
                <div className="w-full md:w-1/3">
                  
                </div>
                <div className="flex-1">
                  <div className="flex gap-3 items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* #listsStandard */}
                      {
                        formData.listsStandard.map((item, idx) => (
                          <div key={idx}>

                            <label className="flex items-center gap-3 text-zinc-700">
                              <input
                                type="checkbox"
                                className={`
                                  text-zinc-700
                                  px-3 py-2 border border-gray-300 rounded-md
                                  placeholder-gray-400 focus:outline-none focus:ring-2
                                  focus:ring-blue-500 focus:border-blue-500
                                  transition-colors duration-200
                              `}
                                checked={item.value}
                                onChange={(e) =>
                                  setFormData(prev => ({
                                    ...prev,
                                    // สร้างอาเรย์ใหม่ + อ็อบเจ็กต์ใหม่ เฉพาะตัวที่เปลี่ยน
                                    listsStandard: prev.listsStandard.map((it, i) =>
                                      i === idx ? { ...it, value: e.target.checked } : it
                                    ),
                                  }))
                                } />
                              {item.label}
                            </label>
                            {
                            // SCOPUS = true
                              formData.listsStandard[idx].label === 'Scopus' && item.value &&
                            <div>
                              <select
                                    onChange={
                                      (e) => {
                                        const selectedValue = parseInt(e.target.value || '0', 10);
                                        setFormData(prev => ({
                                          ...prev,
                                          standardScopus: selectedValue
                                        }));
                                      }
                                    }
                                className="text-zinc-700
                                block w-full px-3 py-2 border border-gray-300 rounded-md
                                bg-white focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200">
                                <option value={0}>-- กรุณาเลือก --</option>
                                {formData.listsStandardScopus.map((item, idx) => (
                                  <option key={idx} value={idx + 1}>{item.label}</option>
                                ))}
                              </select>
                            </div>
                            }
                            {
                              // SUBSET SCOPUS
                              (formData.listsStandard[idx].label === 'Scopus' && item.value && (formData.standardScopus === 1 || formData.standardScopus === 2 || formData.standardScopus === 3 || formData.standardScopus === 4)) &&
                              <div>
                                <select
                                  onChange={(e) => setFormData(prev => ({ ...prev, standardScopusSubset: parseInt(e.target.value || '0', 10) }))}
                                  className="text-zinc-700
                                  block w-full px-3 py-2 border border-gray-300 rounded-md
                                  bg-white focus:outline-none focus:ring-2 
                                  focus:ring-blue-500 focus:border-blue-500
                                  transition-colors duration-200">
                                  <option value={0}>-- กรุณาเลือก --</option>
                                    {formData.listsStandardScopusSubset.map((item, idx) => (
                                    <option key={idx} value={idx + 1}>{item.label}</option>
                                  ))}
                                </select>
                              </div>
                            }
                            {
                              // Web of Science = true
                              formData.listsStandard[idx].label === 'Web of Science' && item.value &&
                              <div>
                                <select
                                  onChange={(e) => setFormData(prev => ({ ...prev, standardWebOfScience: parseInt(e.target.value || '0', 10) }))}
                                  className="text-zinc-700
                                block w-full px-3 py-2 border border-gray-300 rounded-md
                                bg-white focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200">
                                  <option value={0}>-- กรุณาเลือก --</option>
                                    {formData.listsStandardWebOfScience.map((item, idx) => (
                                    <option key={idx} value={idx + 1}>{item.label}</option>
                                  ))}
                                </select>
                              </div>
                            }
                            {
                              // ABDC = true
                              formData.listsStandard[idx].label === 'ABDC' && item.value &&
                              <div>
                                <select
                                  onChange={(e) => setFormData(prev => ({ ...prev, standardABDC: parseInt(e.target.value || '0', 10) }))}
                                  className="text-zinc-700
                                block w-full px-3 py-2 border border-gray-300 rounded-md
                                bg-white focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200">
                                  <option value={0}>-- กรุณาเลือก --</option>
                                  {formData.listsStandardABDC.map((item, idx) => (
                                    <option key={idx} value={idx + 1}>{item.label}</option>
                                  ))}
                                </select>
                              </div>
                            }
                            {
                              // Social Science Research Network = true
                              formData.listsStandard[idx].label === 'AJG' && item.value &&
                              <div>
                                <select
                                  onChange={(e) => setFormData(prev => ({ ...prev, standardAJG: parseInt(e.target.value || '0', 10) }))}
                                  className="text-zinc-700
                                block w-full px-3 py-2 border border-gray-300 rounded-md
                                bg-white focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200">
                                  <option value={0}>-- กรุณาเลือก --</option>
                                    {formData.listsStandardAJG.map((item, idx) => (
                                    <option key={idx} value={idx + 1}>{item.label}</option>
                                  ))}
                                </select>
                              </div>
                            }
                          </div>
                        )
                        )
                      }
                    </div>                    
                  </div>
                </div>
              </section>
            </div>
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
        </FormSection>

        <FormSection>
                  <FileUploadField
                    label="* ส่งไฟล์บทความทางวิชาการ (ขอให้ Scan หน้าปกวารสาร สารบัญ พร้อมบทความ เพื่อการตรวจสอบหลักฐาน)"
                    // ปรับให้รองรับการอัปโหลดไฟล์หลายครั้งแบบสะสม
                    value={formData.attachments}
                    onFilesChange={(attachments) => handleInputChange("attachments", attachments)}
                    accept=".pdf,.doc,.docx"
                    multiple
                  />
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
