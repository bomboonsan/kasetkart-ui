"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import useSWR, { mutate } from 'swr'
// ใช้ path alias (@/) สำหรับ API
import { worksAPI, projectAPI, profileAPI } from '@/lib/api'
import { stripUndefined, getDocumentId, createHandleChange } from '@/utils'
// นำเข้า api base เพื่อช่วยค้นหา record เมื่อรับ documentId (UUID)
import { api } from '@/lib/api-base'
import FormSection from "@/components/FormSection";
import FormFieldBlock from "@/components/FormFieldBlock";
import FormField from "@/components/FormField";
import ProjectPicker from '@/components/ProjectPicker'
import UserPicker from '@/components/UserPicker'
import { FormDoubleInput } from '@/components/ui'
import FormInput from "@/components/FormInput";
import FormRadio from "@/components/FormRadio";
import FormCheckbox from "@/components/FormCheckbox";
import FormTextarea from "@/components/FormTextarea";
import FormDateSelect from "@/components/FormDateSelect";
import FormSelect from "@/components/FormSelect";
import FileUploadField from "@/components/FileUploadField";
import ResearchTeamTable from "@/components/ResearchTeamTable";
import { extractResearchTeam } from '@/utils/team'
import Button from "@/components/Button";
import dynamic from 'next/dynamic'

const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })

// สรุปการแก้ไข (ไทย):
// - รองรับโหมด edit โดยพยายามแปลง workId (documentId/UUID) เป็น numeric id
// - เพิ่ม helper `resolveNumericWorkId` เพื่อความเข้ากันได้กับ Strapi v5 ที่ใช้ทั้ง id และ documentId
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
    titleTH: null, // ชื่อผลงาน (ไทย)
    titleEN: null, // ชื่อผลงาน (อังกฤษ)
    isEnvironmentallySustainable: 0, // เกี่ยวข้องกับสิ่งแวดล้อมและความยั่งยืน (Int) 0=เกี่ยวข้อง, 1=ไม่เกี่ยวข้อง
    journalName: null, // ชื่อการประชุมทางวิชาการ (ใช้ชื่อไทยถ้าไม่มีชื่อไทยให้ใช้ภาษาอื่น)
    doi: null, // DOI (ถ้าไม่มีให้ใส่ “-”) ความหมายของ DOI
    isbn: null, // ISBN (ป้อนอักษร 10 ตัว หรือ 13 ตัว ไม่ต้องใส่ “-”)
    volume: null, // ปีที่ (Volume) (Int)
    issue: null, // ฉบับที่ (Issue) (Int)
    durationStart: null, // วัน/เดือน/ปี ที่ตีพิมพ์  (Date)
    durationEnd: null, // วัน/เดือน/ปี ที่ตีพิมพ์  (Date)
    pageStart: null, // หน้าเริ่มต้น (Int)
    pageEnd: null, // หน้าสิ้นสุด (Int)
    level: null, // ระดับ 0=ระดับชาติ, 1=ระดับนานาชาติ
    isJournalDatabase: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูลหรือไม่
    isScopus: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล Scopus หรือไม่
    scopusType: null, // Scopus (ถ้าเลือก) (Int) Value จาก select
    scopusValue: null, // Scopus (ถ้าเลือก) (Int) Value จาก select
    isACI: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล ACI หรือไม่
    isABDC: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล ABDC หรือไม่
    abdcType: null, // ABDC (ถ้าเลือก) (Int) Value จาก select
    isTCI1: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล TCI1 หรือไม่
    isTCI2: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล TCI2 หรือไม่
    isAJG: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล isAJG หรือไม่
    ajgType: null, // AJG (ถ้าเลือก) (Int) Value จาก select
    isSSRN: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล Social Science Research Network หรือไม่
    isWOS: false, // วารสารที่เผยแพร่ผลงานวิจัยอยู่ในฐานข้อมูล Web of Science หรือไม่
    wosType: null, // Web of Science (ถ้าเลือก) (Int) Value จาก select
    fundName: null, // ชื่อแหล่งทุน (ถ้ามี)
    keywords: null, // คำสำคัญ (ถ้ามี) คั่นด้วย ,
    abstractTH: null, // บทคัดย่อ (ไทย)
    abstractEN: null, // บทคัดย่อ (อังกฤษ)
    attachments: [],

    // #listsStandard

    listsStandard: [
      {
        "label": "Scopus",
        "key": "isScopus",
      },
      {
        "label": "ACI",
        "key": "isACI",
      },
      {
        "label": "TCI1",
        "key": "isTCI1",
      },
      {
        "label": "ABDC",
        "key": "isABDC",
      },
      {
        "label": "TCI2",
        "key": "isTCI2",
      },
      {
        "label": "AJG",
        "key": "isAJG",
      },
      {
        "label": "Social Science Research Network",
        "key": "isSSRN",
      },
      {
        "label": "Web of Science",
        "key": "isWOS",
      },
    ],

    listsStandardScopus: [
      {
        "label": "Q1",
        "value": 1
      },
      {
        "label": "Q2",
        "value": 2
      },
      {
        "label": "Q3",
        "value": 3
      },
      {
        "label": "Q4",
        "value": 4
      },
      {
        "label": "Delisted from Scopus",
        "value": 5
      }
    ],

    listsStandardScopusSubset: [
      {
        "label": "Accounting",
        "value": 1
      },
      {
        "label": "Analysis",
        "value": 2
      },
      {
        "label": "Applied Mathematics",
        "value": 3
      },
      {
        "label": "Artificial Intelligence",
        "value": 4
      },
      {
        "label": "Business and International Management",
        "value": 5
      },
      {
        "label": "Business, Management and Accounting (miscellaneous)",
        "value": 6
      },
      {
        "label": "Computational Mathematics",
        "value": 7
      },
      {
        "label": "Computational Theory and Mathematics",
        "value": 8
      },
      {
        "label": "Computer Graphics and Computer-Aided Design",
        "value": 9
      },
      {
        "label": "Computer Networks and Communications",
        "value": 10
      },
      {
        "label": "Computer Science (miscellaneous)",
        "value": 11
      },
      {
        "label": "Computer Science Application",
        "value": 12
      },
      {
        "label": "Computer Vision and Pattern Recognition",
        "value": 13
      },
      {
        "label": "Control and Optimisation",
        "value": 14
      },
      {
        "label": "Control and Systems Engineering",
        "value": 15
      },
      {
        "label": "Decision Science (miscellaneous)",
        "value": 16
      },
      {
        "label": "Discrete Mathematics and Combinatorics",
        "value": 17
      },
      {
        "label": "Economics and Econometrics",
        "value": 18
      },
      {
        "label": "Economics, Econometrics and Finance (miscellaneous)",
        "value": 19
      },
      {
        "label": "Education",
        "value": 20
      },
      {
        "label": "Finance",
        "value": 21
      },
      {
        "label": "General Business, Management and Accounting",
        "value": 22
      },
      {
        "label": "General Computer Sciences",
        "value": 23
      },
      {
        "label": "General Decision Sciences",
        "value": 24
      },
      {
        "label": "General Economics, Econometrics and Finance",
        "value": 25
      },
      {
        "label": "General Engineering",
        "value": 26
      },
      {
        "label": "General Mathematics",
        "value": 27
      },
      {
        "label": "General Social Sciences",
        "value": 28
      },
      {
        "label": "Hardware and Architecture",
        "value": 29
      },
      {
        "label": "Human-Computer Interaction",
        "value": 30
      },
      {
        "label": "Industrial and Manufacturing Engineering",
        "value": 31
      },
      {
        "label": "Industrial Relations",
        "value": 32
      },
      {
        "label": "Information Systems",
        "value": 33
      },
      {
        "label": "Information Systems and Management",
        "value": 34
      },
      {
        "label": "Issues, Ethics and Legal Aspects",
        "value": 35
      },
      {
        "label": "Leadership and Management",
        "value": 36
      },
      {
        "label": "Library and Information Sciences",
        "value": 37
      },
      {
        "label": "Logic",
        "value": 38
      },
      {
        "label": "Management Information Systems",
        "value": 39
      },
      {
        "label": "Management of Technology and Innovation",
        "value": 40
      },
      {
        "label": "Management Science and Operations Research",
        "value": 41
      },
      {
        "label": "Management, Monitoring, Policy and Law",
        "value": 42
      },
      {
        "label": "Marketing",
        "value": 43
      },
      {
        "label": "Mathematics (miscellaneous)",
        "value": 44
      },
      {
        "label": "Media Technology",
        "value": 45
      },
      {
        "label": "Modelling and Simulation",
        "value": 46
      },
      {
        "label": "Multidisciplinary",
        "value": 47
      },
      {
        "label": "Numerical Analysis",
        "value": 48
      },
      {
        "label": "Organisational Behaviour and Human Resource Management",
        "value": 49
      },
      {
        "label": "Public Administration",
        "value": 50
      },
      {
        "label": "Renewable Energy, Sustainability and the Environment",
        "value": 51
      },
      {
        "label": "Research and Theory",
        "value": 52
      },
      {
        "label": "Review and Exam Preparation",
        "value": 53
      },
      {
        "label": "Safety, Risk, Reliability and Quality",
        "value": 54
      },
      {
        "label": "Sensory Systems",
        "value": 55
      },
      {
        "label": "Signal Processing",
        "value": 56
      },
      {
        "label": "Social Psychology",
        "value": 57
      },
      {
        "label": "Social Sciences (miscellaneous)",
        "value": 58
      },
      {
        "label": "Sociology and Political Sciences",
        "value": 59
      },
      {
        "label": "Software",
        "value": 60
      },
      {
        "label": "Statistics and Probability",
        "value": 61
      },
      {
        "label": "Statistics, Probability and Uncertainty",
        "value": 62
      },
      {
        "label": "Strategy and Management",
        "value": 63
      },
      {
        "label": "Stratigraphy",
        "value": 64
      },
      {
        "label": "Theoretical Computer Science",
        "value": 65
      },
      {
        "label": "Tourism, Leisure and Hospitality Management",
        "value": 66
      },
      {
        "label": "Transportation",
        "value": 67
      },
      {
        "label": "Urban Studies",
        "value": 68
      }
    ],

    listsStandardWebOfScience: [
      {
        "label": "SCIE",
        "value": 1
      },
      {
        "label": "SSCI",
        "value": 2
      },
      {
        "label": "AHCI",
        "value": 3
      },
      {
        "label": "ESCI",
        "value": 4
      },
    ],

    listsStandardABDC: [
      {
        "label": "A*",
        "value": 1
      },
      {
        "label": "A",
        "value": 2
      },
      {
        "label": "B",
        "value": 3
      },
      {
        "label": "C",
        "value": 4
      },
      {
        "label": "Other",
        "value": 5
      },
    ],

    listsStandardAJG: [
      {
        "label": "ระดับ 4*",
        "value": 1
      },
      {
        "label": "ระดับ 4",
        "value": 2
      },
      {
        "label": "ระดับ 3",
        "value": 3
      },
      {
        "label": "ระดับ 2",
        "value": 4
      },
      {
        "label": "ระดับอื่น",
        "value": 5
      },
    ],
    // selected standard values (use ints for API)
    standardScopus: 0,
    standardScopusSubset: 0,
    standardWebOfScience: 0,
    standardABDC: 0,
    standardAJG: 0,

  });

  console.log('formData', formData)

  // ตัด log debug ออกเพื่อความเรียบร้อยของโค้ด

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Prefill when editing
  useEffect(() => {
    if (existingWorkPublication?.data) {
      const data = existingWorkPublication.data
      console.log('existingWorkPublication', data)
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
        durationStart: data.durationStart ? String(data.durationStart).slice(0, 10) : '',
        durationEnd: data.durationEnd ? String(data.durationEnd).slice(0, 10) : '',
        pageStart: data.pageStart || 0,
        pageEnd: data.pageEnd || 0,
        level: data.level || 0,
        isJournalDatabase: data.isJournalDatabase || false,
        isScopus: data.isScopus || false,
        scopusType: data.scopusType || 0,
        scopusValue: data.scopusValue || 0,
        isACI: data.isACI || false,
        isABDC: data.isABDC || false,
        abdcType: data.abdcType || null,
        isTCI1: data.isTCI1 || false,
        isTCI2: data.isTCI2 || false,
        isAJG: data.isAJG || false,
        ajgType: data.ajgType || null,
        isSSRN: data.isSSRN || false,
        // Strapi schema uses `isWOS` (upper-case WOS) — keep state consistent
        isWOS: data.isWOS || false,
        wosType: data.wosType || null,
        isDifferent: data.isDifferent || false,
        differentDetail: data.differentDetail || '',
        isReceiveAward: data.isReceiveAward || false,
        awardName: data.awardName || '',
        isCorrespondingAuthor: data.isCorrespondingAuthor || false,
        scopusGrade: data.scopusGrade || 0,
        impactFactor: data.impactFactor || 0,
        keywords: data.keywords || '',
        fundName: data.fundName || '',
        abstractTH: data.abstractTH || '',
        abstractEN: data.abstractEN || '',
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

  // Ensure full Project object and initialize partnersLocal once (do not override active edits)
  useEffect(() => {
    async function ensureProjectLoaded() {
      try {
        const maybe = formData.__projectObj || formData.project_research
        if (!maybe) return
        if (typeof maybe !== 'object') {
          const id = getDocumentId({ documentId: maybe }) || maybe
          const res = await projectAPI.getProject(id)
          const proj = res?.data || res
          setFormData(prev => {
            const next = { ...prev, __projectObj: proj }
            if (!Array.isArray(prev.partnersLocal) || prev.partnersLocal.length === 0) {
              const team = extractResearchTeam(proj) || []
              next.partnersLocal = team
            }
            return next
          })
          return
        }
        if (!Array.isArray(formData.partnersLocal) || formData.partnersLocal.length === 0) {
          const team = extractResearchTeam(maybe) || []
          if (team.length > 0) setFormData(prev => ({ ...prev, partnersLocal: team }))
        }
      } catch { /* ignore */ }
    }
    ensureProjectLoaded()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.__projectObj, formData.project_research, formData.__projectObj?.id, formData.__projectObj?.documentId])

  // หาก workId เป็น documentId (UUID) ให้ค้นหา numeric id ที่เกี่ยวข้อง
  // คอมเมนต์ (ไทย): helper นี้ช่วยให้หน้าแก้ไขรองรับทั้ง numeric id และ documentId
  async function resolveNumericWorkId(maybeId) {
    if (!maybeId) throw new Error('workId หายไป')
    const s = String(maybeId)
    if (s.includes('-')) {
      try {
        const q = `/work-publications?filters[documentId][$eq]=${encodeURIComponent(s)}&pagination[pageSize]=1`
        const res = await api.get(q)
        const found = (res && (res.data || res)) ? (res.data?.[0] || (res?.data && res.data[0]) || res[0] || res) : null
        const id = found?.id || found?.data?.id || found?.documentId || found?.attributes?.id
        if (!id) throw new Error('ไม่พบ work-publication ด้วย documentId นี้')
        return id
      } catch (e) {
        throw e
      }
    }
    return maybeId
  }

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    setSubmitting(true)
    try {
      // Ensure full project and upsert research_partners back to Project first
      try {
        const projectId = (formData.__projectObj?.documentId || formData.__projectObj?.id || formData.project_research)
        if (projectId && Array.isArray(formData.partnersLocal)) {
          // stable key by user or name|org
          const makeKey = (p) => {
            let uid = p?.userID
            if (uid && typeof uid === 'object') uid = uid.id || uid.data?.id
            uid = uid !== undefined && uid !== null ? String(uid) : undefined
            const name = String(p?.fullname || '').trim().toLowerCase()
            const orgName = String(p?.orgName || '').trim().toLowerCase()
            return uid ? `u:${uid}` : `n:${name}|${orgName}`
          }
          const partnerTypeMap = {
            'หัวหน้าโครงการ': 1,
            'ที่ปรึกษาโครงการ': 2,
            'ผู้ประสานงาน': 3,
            'นักวิจัยร่วม': 4,
            'อื่นๆ': 99,
          }
          // load existing for diff
          let existingItems = []
          try {
            const resp = await api.get(`/project-partners?populate=users_permissions_user&filters[project_researches][documentId][$eq]=${projectId}`)
            existingItems = resp?.data || resp || []
          } catch { existingItems = [] }
          const serverEntries = (existingItems || []).map(item => {
            const attr = item?.attributes || item || {}
            const userId = attr.users_permissions_user?.data?.id || attr.users_permissions_user || attr.userID
            const partnerType = (() => {
              const t = attr.participant_type
              if (t === 1) return 'หัวหน้าโครงการ'
              if (t === 2) return 'ที่ปรึกษาโครงการ'
              if (t === 3) return 'ผู้ประสานงาน'
              if (t === 4) return 'นักวิจัยร่วม'
              if (t === 99) return 'อื่นๆ'
              return ''
            })()
            return {
              documentId: item?.documentId || item?.id,
              fullname: attr.fullname || attr.name || '',
              orgName: attr.orgName || attr.org || '',
              partnerType,
              userID: userId,
              partnerComment: `${attr.isFirstAuthor ? 'First Author' : ''}${attr.isCoreespondingAuthor ? (attr.isFirstAuthor ? ', ' : '') + 'Corresponding Author' : ''}`.trim(),
              partnerProportion: attr.participation_percentage !== undefined ? String(attr.participation_percentage) : undefined,
            }
          })
          const serverMap = new Map(serverEntries.map(e => [makeKey(e), e]))
          const seen = new Set()
          for (const [idx, p] of (formData.partnersLocal || []).entries()) {
            const key = makeKey(p)
            seen.add(key)
            const dataPayload = stripUndefined({
              fullname: p.fullname || undefined,
              orgName: p.orgName || undefined,
              participation_percentage: p.partnerProportion !== undefined && p.partnerProportion !== '' ? parseFloat(p.partnerProportion) : undefined,
              participant_type: partnerTypeMap[p.partnerType] || undefined,
              isFirstAuthor: String(p.partnerComment || '').includes('First Author') || false,
              isCoreespondingAuthor: String(p.partnerComment || '').includes('Corresponding Author') || false,
              users_permissions_user: p.userID || undefined,
              partnerProportion_percentage_custom: (p.partnerProportion_percentage_custom !== undefined && p.partnerProportion_percentage_custom !== '') ? Number(p.partnerProportion_percentage_custom) : undefined,
              order: p.order !== undefined ? parseInt(p.order) : idx,
              project_researches: [projectId],
            })
            const existing = serverMap.get(key)
            if (existing?.documentId) {
              try { await api.put(`/project-partners/${existing.documentId}`, { data: dataPayload }) } catch { }
            } else {
              try { await api.post('/project-partners', { data: dataPayload }) } catch { }
            }
          }
          for (const [key, entry] of serverMap.entries()) {
            if (!seen.has(key) && entry?.documentId) {
              try { await api.delete(`/project-partners/${entry.documentId}`) } catch { }
            }
          }
        }
      } catch { /* do not block work save */ }
      // Basic validation for volume/issue
      if (formData.volume < 0 || formData.volume > 9999) {
        throw new Error('ค่าปี (volume) ต้องอยู่ระหว่าง 0 - 9999')
      }
      if (formData.issue < 0 || formData.issue > 9999) {
        throw new Error('ค่าฉบับที่ (issue) ต้องอยู่ระหว่าง 0 - 9999')
      }
      // Build payload matching Strapi v5 schema (see api/src/api/work-publication/content-types/work-publication/schema.json)
      const payload = {
        // relation to project-research (store numeric id for saving work)
        project_research: formData.__projectObj?.id || undefined,
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
        isABDC: !!formData.isABDC,
        abdcType: formData.abdcType ? parseInt(formData.abdcType, 10) : undefined,
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

      // ถ้าเป็นโหมดแก้ไข ให้แปลง workId เป็น numeric id ถ้าจำเป็น แล้วเรียก update
      if (mode === 'edit' && workId) {
        const targetId = await resolveNumericWorkId(workId)
        await worksAPI.updatePublication(targetId, cleanPayload)
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
                                checked={formData[item.key] || false}
                                onChange={(e) =>
                                  setFormData(prev => ({
                                    ...prev,
                                    // เอาค่า item.key มาใช้เป็น key ใน formData
                                    [item.key]: e.target.checked,
                                    // อัปเดตค่าใน listsStandard ด้วย
                                    listsStandard: prev.listsStandard.map((it, i) => i === idx ? { ...it, value: e.target.checked } : it)

                                  }))
                                } />
                              {item.label}
                            </label>
                            {
                              // SCOPUS = true
                              formData.listsStandard[idx].label === 'Scopus' && formData.isScopus &&
                              <div>
                                <select
                                  onChange={
                                    (e) => {
                                      const selectedValue = parseInt(e.target.value || '0', 10);
                                      setFormData(prev => ({
                                        ...prev,
                                        scopusType: selectedValue
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
                                    <option key={idx} value={item.value} selected={item.value == formData.scopusType}>{item.label}</option>
                                  ))}
                                </select>
                              </div>
                            }
                            {
                              // SUBSET SCOPUS
                              (formData.listsStandard[idx].label === 'Scopus' && (formData.scopusType === 1 || formData.scopusType === 2 || formData.scopusType === 3 || formData.scopusType === 4)) &&
                              <div>
                                <select
                                  onChange={(e) => setFormData(prev => ({ ...prev, scopusValue: parseInt(e.target.value || '0', 10) }))}
                                  className="text-zinc-700
                                  block w-full px-3 py-2 border border-gray-300 rounded-md
                                  bg-white focus:outline-none focus:ring-2 
                                  focus:ring-blue-500 focus:border-blue-500
                                  transition-colors duration-200">
                                  <option value={0}>-- กรุณาเลือก --</option>
                                  {formData.listsStandardScopusSubset.map((item, idx) => (
                                    <option key={idx} value={item.value} selected={item.value == formData.scopusValue}>{item.label}</option>
                                  ))}
                                </select>
                              </div>
                            }
                            {
                              // Web of Science = true
                              formData.listsStandard[idx].label === 'Web of Science' && formData.isWOS &&
                              <div>
                                <select
                                  onChange={(e) => setFormData(prev => ({ ...prev, wosType: parseInt(e.target.value || '0', 10) }))}
                                  className="text-zinc-700
                                block w-full px-3 py-2 border border-gray-300 rounded-md
                                bg-white focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200">
                                  <option value={0}>-- กรุณาเลือก --</option>
                                  {formData.listsStandardWebOfScience.map((item, idx) => (
                                    <option key={idx} value={item.value} selected={item.value == formData.wosType}>{item.label}</option>
                                  ))}
                                </select>
                              </div>
                            }
                            {
                              // ABDC = true
                              formData.listsStandard[idx].label === 'ABDC' && formData.isABDC &&
                              <div>
                                <select
                                  onChange={(e) => setFormData(prev => ({ ...prev, abdcType: parseInt(e.target.value || '0', 10) }))}
                                  className="text-zinc-700
                                block w-full px-3 py-2 border border-gray-300 rounded-md
                                bg-white focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200">
                                  <option value={0}>-- กรุณาเลือก --</option>
                                  {formData.listsStandardABDC.map((item, idx) => (
                                    <option key={idx} value={item.value} selected={item.value == formData.abdcType}>{item.label}</option>
                                  ))}
                                </select>
                              </div>
                            }
                            {
                              // Social Science Research Network = true
                              formData.listsStandard[idx].label === 'AJG' && formData.isAJG &&
                              <div>
                                <select
                                  onChange={(e) => setFormData(prev => ({ ...prev, ajgType: parseInt(e.target.value || '0', 10) }))}
                                  className="text-zinc-700
                                block w-full px-3 py-2 border border-gray-300 rounded-md
                                bg-white focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200">
                                  <option value={0}>-- กรุณาเลือก --</option>
                                  {formData.listsStandardAJG.map((item, idx) => (
                                    <option key={idx} value={item.value} selected={item.value == formData.ajgType}>{item.label}</option>
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
        {formData.__projectObj ? (
          <div className='p-4 rounded-md border shadow border-gray-200/70'>
            <FormSection title="* ผู้ร่วมวิจัย">
              <ResearchTeamTable
                formData={formData}
                setFormData={setFormData}
              />
            </FormSection>
          </div>
        ) : null}

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
