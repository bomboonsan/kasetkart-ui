"use client";

import { useState, useEffect } from "react";
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
import Button from "./Button";
import SweetAlert2 from 'react-sweetalert2'

export default function CreateAcademicForm({ mode = 'create', workId, initialData }) {
  const [swalProps, setSwalProps] = useState({})
  // Align form keys to PublicationDetail model in schema.prisma
  const [formData, setFormData] = useState({
    project_research: '', // relation to project-research
    __projectObj: undefined, // สำหรับเก็บ object โครงการวิจัยที่เลือก
    titleTH: "", // ชื่อผลงาน (ไทย)
    titleEN: "", // ชื่อผลงาน (อังกฤษ)
    isEnvironmentallySustainable: 0, // เกี่ยวข้องกับสิ่งแวดล้อมและความยั่งยืน (Int) 0=เกี่ยวข้อง, 1=ไม่เกี่ยวข้อง
    journalName: "", // ชื่อการประชุมทางวิชาการ (ใช้ชื่อไทยถ้าไม่มีชื่อไทยให้ใช้ภาษาอื่น)
    doi: "", // DOI (ถ้าไม่มีให้ใส่ “-”) ความหมายของ DOI
    isbn: "", // ISBN (ป้อนอักษร 10 ตัว หรือ 13 ตัว ไม่ต้องใส่ “-”)
    volume: 0, // ปีที่ (Volume) (Int)
    issue: 0, // ฉบับที่ (Issue) (Int)
    durationStart: "", // วัน/เดือน/ปี ที่ตีพิมพ์  (Date)
    durationEnd: "", // วัน/เดือน/ปี ที่ตีพิมพ์  (Date)
    pageStart: 0, // หน้าเริ่มต้น (Int)
    pageEnd: 0, // หน้าสิ้นสุด (Int)
    level: 0, // ระดับ 0=ระดับชาติ, 1=ระดับนานาชาติ
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

  });

  console.log('formData.listsStandardScopus', formData.listsStandardScopus)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Prefill when editing
  useEffect(() => {
    if (!initialData) return
    setFormData(prev => ({
      ...prev,
      ...initialData,
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
        issn: formData.issn || undefined,
        durationMonthStart: formData.durationMonthStart || '01',
        durationMonthEnd: formData.durationMonthEnd || '12',
        durationYearStart: formData.durationYearStart || String(new Date().getFullYear()),
        durationYearEnd: formData.durationYearEnd || String(new Date().getFullYear()),
        level: formData.level || undefined,
        isJournalDatabase: formData.isJournalDatabase,
        scopus: formData.scopus,
        WebOfScience: formData.WebOfScience,
        ABDC: formData.ABDC,
        AJG: formData.AJG,
        SocialScienceResearchNetwork: formData.SocialScienceResearchNetwork,
        fundName: formData.fundName || undefined,
        keywords: formData.keywords || undefined,
        abstractTh: formData.abstractTh || undefined,
        abstractEn: formData.abstractEn || undefined,
      }
      if (mode === 'edit' && workId) {
        // Mock API call
        console.log('Would update publication:', { type: 'PUBLICATION', status: 'DRAFT', detail, authors: [], attachments: [] })
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSwalProps({ show: true, icon: 'success', title: 'อัปเดตผลงานตีพิมพ์สำเร็จ', timer: 1600, showConfirmButton: false })
      } else {
      const attachments = (formData.attachments || []).map(a => ({ id: a.id }))
      const authors = formData.userId ? [{ userId: parseInt(formData.userId), isCorresponding: true }] : []
      const payload = { type: 'PUBLICATION', status: 'DRAFT', detail, authors, attachments }
      if (mode === 'edit' && workId) {
        // Mock API call
        console.log('Would update publication:', payload)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSwalProps({ show: true, icon: 'success', title: 'อัปเดตผลงานตีพิมพ์สำเร็จ', timer: 1600, showConfirmButton: false })
      } else if (formData.projectId) {
        // Mock API call
        console.log('Would create publication for project:', payload)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSwalProps({ show: true, icon: 'success', title: 'บันทึกผลงานตีพิมพ์สำเร็จ', timer: 1600, showConfirmButton: false })
      } else {
        // Mock API call
        console.log('Would create publication:', payload)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSwalProps({ show: true, icon: 'success', title: 'บันทึกผลงานตีพิมพ์สำเร็จ', timer: 1600, showConfirmButton: false })
      }
      }
    } catch (err) {
      setError(err.message || 'บันทึกไม่สำเร็จ')
    } finally {
      setSubmitting(false)
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleCheckboxChange = (field, value) => {
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
              label="ชื่อวารสาร/แหล่งตีพิมพ์"
              required
              value={formData.journalName}
              onChange={(value) => handleInputChange("journalName", value)}
              placeholder=""
            />
            <ProjectPicker
              label="โครงการวิจัย"
              required
              selectedProject={formData.__projectObj}
              onSelect={(p) => {
                setFormData(prev => ({
                  ...prev,
                  projectId: String(p.id),
                  __projectObj: p,
                  isEnvironmentallySustainable: p.isEnvironmentallySustainable ?? prev.isEnvironmentallySustainable,
                  fundName: p.fundName || prev.fundName,
                  keywords: p.keywords || prev.keywords,
                }))
              }}
            />
            <FormInput
              label="DOI (ถ้าไม่มีให้ใส่ “-”)"
              required
              type="text"
              value={formData.doi}
              onChange={(value) => handleInputChange("doi", value)}
              placeholder=""
            />
            <FormInput
              label="ISSN (ถ้ามี)"
              required
              type="text"
              value={formData.issn}
              onChange={(value) => handleInputChange("issn", value)}
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
                  value={formData.durationYearStart}
                  onChange={(value) => handleInputChange("durationYearStart", value)}
                />
              </div>
              <div>
                <FormDateSelect
                  title="สิ้นสุด"
                  noDay={true}
                  value={formData.durationYearEnd}
                  onChange={(value) => handleInputChange("durationYearEnd", value)}
                />
              </div>
            </div>
            {/* No cost field in PublicationDetail; omitted for schema alignment */}
            <FormDoubleInput
              label="จากหน้า"
              after="ถึง"
              type="number"
              value={formData.articleTitleTh}
              value2={formData.articleTitleEn}
              onChange={(value, field) => handleInputChange(field, value)}
              placeholder=""
              required
            />
            {/* <FormRadio
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
              onChange={(v) => handleInputChange('presentationWork', v)}
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
              onChange={(v) => handleInputChange('presentType', v)}
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
              onChange={(v) => handleInputChange('articleType', v)}
            /> */}
          </FormFieldBlock>

          {/* <FormFieldBlock>
            <FormTextarea
              label="กรณีเข้าร่วมประชุมวิชาการ สรุปเนื้อหาการประชุมแบบย่อ(ถ้าไม่มีข้อมูลให้ใส่ -)"
              required
              value={formData.fundName}
              onChange={(value) => handleInputChange("fundName", value)}
              placeholder=""
            />
          </FormFieldBlock> */}


          <FormFieldBlock>
            <FormRadio
              inline={true}
              required
              label="ระดับการตีพิมพ์"
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
                                        const selectedValue = e.target.value;
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
                                <option value={''}>-- กรุณาเลือก --</option>
                                {formData.listsStandardScopus.map((item, idx) => (
                                  
                                  <option key={idx} value={item.label}>{item.label}</option>
                                ))}
                              </select>
                            </div>
                            }
                            { 
                              // SUBSET SCOPUS
                              (formData.listsStandard[idx].label === 'Scopus' && item.value && (formData.standardScopus == "Q1" || formData.standardScopus == "Q2" || formData.standardScopus == "Q3" || formData.standardScopus == "Q4")) &&
                              <div>
                                <select className="text-zinc-700
                                  block w-full px-3 py-2 border border-gray-300 rounded-md
                                  bg-white focus:outline-none focus:ring-2 
                                  focus:ring-blue-500 focus:border-blue-500
                                  transition-colors duration-200">
                                  <option value={''}>-- กรุณาเลือก --</option>
                                    {formData.listsStandardScopusSubset.map((item, idx) => (
                                    <option key={idx} value={item.label}>{item.label}</option>
                                  ))}
                                </select>
                              </div>
                            }
                            {
                              // Web of Science = true
                              formData.listsStandard[idx].label === 'Web of Science' && item.value &&
                              <div>
                                <select
                                  onChange={
                                    (e) => {
                                      const selectedValue = e.target.value;
                                      setFormData(prev => ({
                                        ...prev,
                                        standardWebOfScience: selectedValue
                                      }));
                                    }
                                  }
                                  className="text-zinc-700
                                block w-full px-3 py-2 border border-gray-300 rounded-md
                                bg-white focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200">
                                  <option value={''}>-- กรุณาเลือก --</option>
                                    {formData.listsStandardWebOfScience.map((item, idx) => (

                                    <option key={idx} value={item.label}>{item.label}</option>
                                  ))}
                                </select>
                              </div>
                            }
                            {
                              // ABDC = true
                              formData.listsStandard[idx].label === 'ABDC' && item.value &&
                              <div>
                                <select
                                  onChange={
                                    (e) => {
                                      const selectedValue = e.target.value;
                                      setFormData(prev => ({
                                        ...prev,
                                        standardABDC: selectedValue
                                      }));
                                    }
                                  }
                                  className="text-zinc-700
                                block w-full px-3 py-2 border border-gray-300 rounded-md
                                bg-white focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200">
                                  <option value={''}>-- กรุณาเลือก --</option>
                                  {formData.listsStandardABDC.map((item, idx) => (

                                    <option key={idx} value={item.label}>{item.label}</option>
                                  ))}
                                </select>
                              </div>
                            }
                            {
                              // Social Science Research Network = true
                              formData.listsStandard[idx].label === 'AJG' && item.value &&
                              <div>
                                <select
                                  onChange={
                                    (e) => {
                                      const selectedValue = e.target.value;
                                      setFormData(prev => ({
                                        ...prev,
                                        standardAJG: selectedValue
                                      }));
                                    }
                                  }
                                  className="text-zinc-700
                                block w-full px-3 py-2 border border-gray-300 rounded-md
                                bg-white focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200">
                                  <option value={''}>-- กรุณาเลือก --</option>
                                    {formData.listsStandardAJG.map((item, idx) => (

                                    <option key={idx} value={item.label}>{item.label}</option>
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
        </FormSection>

        <FormSection>
                  <FileUploadField
                    label="* ส่งไฟล์บทความทางวิชาการ (ขอให้ Scan หน้าปกวารสาร สารบัญ พร้อมบทความ เพื่อการตรวจสอบหลักฐาน)"
                    onFilesChange={(attachments) => handleInputChange("attachments", attachments)}
                    accept=".pdf,.doc,.docx"
                    multiple
                  />
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
