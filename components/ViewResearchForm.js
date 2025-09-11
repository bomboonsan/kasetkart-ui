"use client"

import { useEffect, useState } from 'react'
import FormSection from './FormSection'
import FormFieldBlock from './FormFieldBlock'
import FormField from './FormField'
import UserPicker from './UserPicker'
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormTextarea from './FormTextarea'
import FormDateSelect from './FormDateSelect'
import FormSelect from "./FormSelect";
import FileUploadField from './FileUploadField'
import ResearchTeamTable from './ResearchTeamTable'
import Button from './Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })
// ใช้ path alias (@/) เพื่อให้ import ชัดเจนและลดความซ้ำซ้อนของ path
import { projectAPI } from '@/lib/api/project'
import { api } from '@/lib/api-base'
import { authAPI } from '@/lib/api/auth'
import { valueFromAPI } from '@/lib/api/lookup'
// ยูทิลิตี้สำหรับจัดการ payload ให้สะอาด
import { stripUndefined } from '@/utils/strapi'
// ใช้ path alias (@/) สำหรับ helper
import { formatDateDMY } from '@/lib/helper'
import { use } from 'react'
import useSWR, { mutate } from 'swr'
import { createHandleChange } from '@/utils/form'

// เปลี่ยนชื่อเป็น ViewResearchForm และตั้งค่า default mode เป็น 'view' เพื่อใช้แสดงข้อมูลแบบอ่านอย่างเดียว
export default function ViewResearchForm({ mode = 'view', projectId: propProjectId, workId }) {
    // รับ props: mode และ projectId (รองรับ workId เดิมด้วย)
    const projectId = propProjectId || workId || null

    ////////////////////////////////////////////////////////
    // Setup form fields
    ////////////////////////////////////////////////////////
    const [icTypesLists, setIcTypesLists] = useState([])
    const [impactLists, setImpactLists] = useState([])
    const [sdgLists, setSdgLists] = useState([])

    const { data: icTypesRes, error: swrError } = useSWR('icTypes', () => valueFromAPI.getIcTypes())
    const { data: impactRes } = useSWR('impacts', () => valueFromAPI.getImpacts())
    const { data: sdgRes } = useSWR('sdgs', () => valueFromAPI.getSDGs())

    useEffect(() => {
        if (icTypesRes) {
            setIcTypesLists(icTypesRes.data || [])
        }
    }, [icTypesRes])

    useEffect(() => {
        if (impactRes) {
            setImpactLists(impactRes.data || [])
        }
    }, [impactRes])

    useEffect(() => {
        if (sdgRes) {
            setSdgLists(sdgRes.data || [])
        }
    }, [sdgRes])
    ////////////////////////////////////////////////////////
    // End setup form fields
    ////////////////////////////////////////////////////////
    // สำหรับ View component การ submit จะเป็น no-op เพื่อให้เป็น read-only
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSwalProps({ show: true, icon: 'info', title: 'หน้าดูข้อมูล (Read-only)', text: 'หน้านี้เป็นการแสดงข้อมูลเท่านั้น ไม่สามารถบันทึกได้', timer: 2000 })
        return
    }
                }
                setFormData(prev => ({ ...prev, partnersLocal: [mePartner] }))
            }
        }
        fetchData()
    }, [])
    // หมายเหตุ: ตัด log debug ออกเพื่อความสะอาดของโค้ด

    // console.log('formData', formData)

    const [subFundType, setSubFundType] = useState([])
    const subFundType1 = [
        { value: '', label: 'เลือกข้อมูล' },
        { value: '19', label: 'องค์กรรัฐ' },
        { value: '20', label: 'องค์กรอิสระและเอกชน' },
        { value: '21', label: 'แหล่งทุนต่างประเทศ' },
        { value: '23', label: 'รัฐวิสาหกิจ' },
    ]
    const subFundType2 = [
        { value: '', label: 'เลือกข้อมูล' },
        { value: '17', label: 'เงินรายได้มหาวิทยาลัย' },
        { value: '18', label: 'เงินรายได้ส่วนงาน' },
    ]
    const subFundType3 = [
        { value: '', label: 'เลือกข้อมูล' },
        { value: '22', label: 'เงินทุนส่วนตัว' },
    ]
    const subFundType4 = [
        { value: '', label: 'เลือกข้อมูล' },
        { value: '14', label: 'เงินอุดหนุนรัฐบาลและเงินอุดหนุนอื่นที่รัฐบาลจัดสรรให้' },
        { value: '15', label: 'เงินงบประมาณมหาวิทยาลัย' },
    ]


    useEffect(() => {
        setSubFundType([])
        if (formData.fundType === '12') {
            setSubFundType(subFundType1)
        } else if (formData.fundType === '11') {
            setSubFundType(subFundType2)
        } else if (formData.fundType === '13') {
            setSubFundType(subFundType3)
        } else if (formData.fundType === '10') {
            setSubFundType(subFundType4)
        } else {
            setSubFundType([])
        }
    }, [formData.fundType])


    useEffect(() => {
        // Mock data แทน API calls
        const mockOrgs = [
            { id: 1, name: 'มหาวิทยาลัยเกษตรศาสตร์' },
            { id: 2, name: 'จุฬาลงกรณ์มหาวิทยาลัย' }
        ]
        // สำหรับ View component การ submit จะเป็น no-op เพื่อให้เป็น read-only
        const handleSubmit = async (e) => {
            e.preventDefault()
            setSwalProps({ show: true, icon: 'info', title: 'หน้าดูข้อมูล (Read-only)', text: 'หน้านี้เป็นการแสดงข้อมูลเท่านั้น ไม่สามารถบันทึกได้', timer: 2000 })
            return
                // ถ้าไม่มี partners จาก ResearchTeamTable ให้ใช้แค่ current user
                if (mePartner) partnersArray.push(mePartner)
            }

            // Map to API payload matching Strapi content-type `project-research`
            // Only include fields that exist in the schema
            const payload = {
                fiscalYear: parseInt(formData.fiscalYear) || 2568,
                projectType: formData.projectType || 0,
                projectMode: formData.projectMode || 0,
                subProjectCount: formData.subProjectCount ? parseInt(formData.subProjectCount) : undefined,
                // แก้ไขฟิลด์ชื่อโครงการภาษาไทยให้ส่งตรงกับ schema (nameTH)
                nameTH: formData.nameTH || undefined,
                nameEN: formData.nameEN || undefined,
                durationStart: formData.durationStart || undefined,
                durationEnd: formData.durationEnd || undefined,
                fundType: formData.fundType ? parseInt(formData.fundType) : undefined,
                fundSubType: formData.fundSubType ? parseInt(formData.fundSubType) : undefined,
                fundName: formData.fundName || undefined,
                budget: formData.budget ? String(formData.budget) : undefined,
                keywords: formData.keywords || undefined,
                // คอมเมนต์ (ไทย): ผูกความสัมพันธ์ M2M ตาม schema ของ Strapi v5
                // UX เลือกได้ 1 ค่า แต่ API ต้องส่งเป็น array ของ id
                ic_types: formData.icTypes ? [Number(formData.icTypes)] : undefined,
                impacts: formData.impact ? [Number(formData.impact)] : undefined,
                sdgs: formData.sdg ? [Number(formData.sdg)] : undefined,
                // Include attachments if any files were uploaded
                attachments: Array.isArray(formData.attachments) && formData.attachments.length > 0
                    ? formData.attachments.map(att => att.id || att.documentId).filter(Boolean)
                    : undefined,
            }

            // แก้ไข: โหมดนี้เป็นการแก้ไขเท่านั้น (edit-only)
            // - เรียก updateProject แทน createProject
            // - ซิงค์ partner โดยการลบ partner เก่าแล้วสร้างใหม่ตาม partnersArray
            if (mode !== 'edit' || !projectId) {
                throw new Error('ไม่สามารถบันทึก: หน้าแก้ไขต้องมี projectId และอยู่ในโหมด edit')
            }

            // เรียก API อัปเดตโครงการ: แปลง documentId -> numeric id ถ้าจำเป็น
            const targetId = await resolveNumericProjectId(projectId)
            const resp = await projectAPI.updateProject(targetId, { ...payload })
            const updatedId = resp?.data?.id || resp?.id || targetId

            if (!updatedId) {
                throw new Error('ไม่สามารถอัปเดตโครงการได้ (no id returned)')
            }

            // Helper: map partnerType label -> integer for backend `participant_type`
            const partnerTypeMap = {
                'หัวหน้าโครงการ': 1,
                'ที่ปรึกษาโครงการ': 2,
                'ผู้ประสานงาน': 3,
                'นักวิจัยร่วม': 4,
                'อื่นๆ': 99,
            }

            // ลบ partners เก่าที่เชื่อมโยงกับ project นี้ แล้วสร้าง partners ใหม่ตาม form
            try {
                const existingPartners = await api.get(`/project-partners?filters[project_researches][documentId][$eq]=${updatedId}`)
                const partnersToDelete = existingPartners?.data || []
                for (const partner of partnersToDelete) {
                    await api.delete(`/project-partners/${partner.documentId || partner.id}`)
                }
            } catch (e) {
                // ignore delete errors but continue
            }

            const partnerErrors = []
            for (const p of partnersArray) {
                const userIdField = p.userId || p.userID || p.User?.id || undefined
                const commentField = p.partnerComment || p.comment || ''
                const fullnameField = p.fullname || p.partnerFullName || ''
                const orgField = p.orgName || p.org || p.orgFullName || ''
                const proportionField = p.partnerProportion !== undefined && p.partnerProportion !== null ? parseFloat(p.partnerProportion) : undefined
                const proportionCustomField = p.partnerProportion_percentage_custom !== undefined && p.partnerProportion_percentage_custom !== '' ? parseFloat(p.partnerProportion_percentage_custom) : undefined

                const partnerData = stripUndefined({
                    fullname: fullnameField || undefined,
                    orgName: orgField || undefined,
                    participation_percentage: proportionField,
                    participation_percentage_custom: proportionCustomField,
                    participant_type: partnerTypeMap[p.partnerType] || undefined,
                    isFirstAuthor: String(commentField).includes('First Author') || false,
                    isCoreespondingAuthor: String(commentField).includes('Corresponding Author') || false,
                    users_permissions_user: userIdField,
                    project_researches: [updatedId]
                })

                try {
                    await api.post('/project-partners', { data: partnerData })
                } catch (err) {
                    partnerErrors.push({ partner: partnerData, error: err?.message || String(err) })
                }
            }

            setSwalProps({ show: true, icon: 'success', title: 'อัปเดตโครงการสำเร็จ', timer: 1600, showConfirmButton: false })
        } catch (err) {
            setError(err.message || 'บันทึกโครงการไม่สำเร็จ')
            setSwalProps({ show: true, icon: 'error', title: 'บันทึกโครงการไม่สำเร็จ', text: err.message || '', timer: 2200 })
        } finally {
            setSubmitting(false)
        }
    }

    // ใช้ helper มาตรฐานสำหรับอัปเดตค่าในฟอร์ม (ลดโค้ดซ้ำ)
    const handleInputChange = createHandleChange(setFormData)

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
            <form noValidate onSubmit={handleSubmit} className="p-6 space-y-8">
                {error && (
                    <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
                )}
                {/* Basic Information */}
                <FormSection>
                    <FormFieldBlock>
                        <FormInput
                            mini={true}
                            label="ปีงบประมาณ"
                            type="number"
                            value={formData.fiscalYear}
                            onChange={(value) => handleInputChange("fiscalYear", parseInt(value))}
                            placeholder="2568"
                        />
                    </FormFieldBlock>
                    <FormFieldBlock>
                        <FormRadio
                            inline={false}

                            label="ประเภทโครงการ"
                            options={[
                                { label: "โครงการวิจัย", value: 0 },
                                {
                                    label: "โครงการพัฒนาวิชาการประเภทงานวิจัย",
                                    value: 1,
                                },
                            ]}
                            value={formData.projectType}
                            onChange={(value) => handleInputChange("projectType", parseInt(value))}
                        />
                    </FormFieldBlock>
                    <FormFieldBlock>
                        <FormRadio
                            inline={true}

                            label="ลักษณะโครงการวิจัย"
                            options={[
                                { label: "โครงการวิจัยเดี่ยว", value: 0 },
                                {
                                    label: "แผนงานวิจัย หรือชุดโครงการวิจัย",
                                    value: 1,
                                },
                            ]}
                            value={formData.projectMode}
                            onChange={(value) => handleInputChange("projectMode", parseInt(value))}
                        />
                    </FormFieldBlock>

                    <FormFieldBlock className="grid grid-cols-1 gap-6">
                        <FormInput
                            mini={true}
                            label="จำนวนโครงการย่อย"
                            type="number"
                            value={formData.projectMode !== 1 ? 0 : formData.subProjectCount}
                            onChange={(value) => handleInputChange("subProjectCount", parseInt(value))}
                            placeholder="0"
                            disabled={formData.projectMode === 1 ? false : true}
                            className={`border border-gray-300 rounded-md p-2 ${formData.projectMode === 1 ? '' : 'bg-gray-100 cursor-not-allowed'}`}
                        />
                    </FormFieldBlock>

                    <FormFieldBlock className="grid grid-cols-1 gap-6">
                        <FormTextarea
                            label="ชื่อแผนงานวิจัยหรือชุดโครงการวิจัย/โครงการวิจัย (ไทย)"
                            value={formData.nameTH}
                            onChange={(value) => handleInputChange("nameTH", value)}
                            placeholder=""

                        />
                    </FormFieldBlock>

                    <FormFieldBlock className="grid grid-cols-1 gap-6">
                        <FormTextarea
                            label="ชื่อแผนงานวิจัยหรือชุดโครงการวิจัย/โครงการวิจัย (อังกฤษ)"
                            value={formData.nameEN}
                            onChange={(value) => handleInputChange("nameEN", value)}
                            placeholder=""

                        />
                    </FormFieldBlock>

                    <FormFieldBlock>
                        <div className="flex items-center gap-10">
                            <label className="flex items-center gap-3 text-zinc-700">
                                <input
                                    type="radio"
                                    value="true"
                                    checked={formData.isEnvironmentallySustainable === 1}
                                    onChange={() => handleInputChange("isEnvironmentallySustainable", 1)}
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
                                    checked={formData.isEnvironmentallySustainable === 0}
                                    onChange={() => handleInputChange("isEnvironmentallySustainable", 0)}
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-zinc-700">
                                    ระยะเวลาการทำวิจัย{" "}
                                    <span className="text-blue-700">(ปี พ.ศ. 4 หลัก)</span>
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
                    </FormFieldBlock>

                    <FormFieldBlock>
                        <FormTextarea
                            label="หน่วยงานหลักที่รับผิดชอบโครงการวิจัย (หน่วยงานที่ขอทุน)"

                            className='bg-gray-100 cursor-not-allowed'
                            value={`${meData?.department?.name || ''}  ${meData?.faculty?.name} ${meData?.organization?.name || ''}`}
                        />
                    </FormFieldBlock>

                    <FormFieldBlock>
                        <FormSelect
                            label="ประเภทงานวิจัย"

                            value={formData.researchKind}
                            onChange={(value) => handleInputChange("researchKind", value)}
                            className="max-w-lg"
                            options={[
                                { value: '', label: "เลือกประเภทงานวิจัย" },
                                { value: 'การวิจัยพื้นฐานหรือการวิจัยบริสุทธิ์', label: 'การวิจัยพื้นฐานหรือการวิจัยบริสุทธิ์' },
                                { value: 'การวิจัยประยุกต์', label: 'การวิจัยประยุกต์' },
                                { value: 'การวิจัยเชิงปฏิบัติ', label: 'การวิจัยเชิงปฏิบัติ' },
                                { value: 'การวิจัยและพัฒนา', label: 'การวิจัยและพัฒนา' },
                                { value: 'การพัฒนาทดลอง', label: 'การพัฒนาทดลอง' },
                                { value: 'พื้นฐาน (basic Research)', label: 'พื้นฐาน (basic Research)' },
                                { value: 'พัฒนาและประยุกต์ (Development)', label: 'พัฒนาและประยุกต์ (Development)' },
                                { value: 'วิจัยเชิงปฏิบัติการ (Operational Research)', label: 'วิจัยเชิงปฏิบัติการ (Operational Research)' },
                                { value: 'วิจัยทางคลินิก (Clinical Trial)', label: 'วิจัยทางคลินิก (Clinical Trial)' },
                                { value: 'วิจัยต่อยอด (Translational research)', label: 'วิจัยต่อยอด (Translational research)' },
                                { value: 'การขยายผลงานวิจัย (Implementation)', label: 'การขยายผลงานวิจัย (Implementation)' },
                            ]}
                        />
                    </FormFieldBlock>

                    <FormFieldBlock>
                        <FormSelect
                            label="ประเภทแหล่งทุน"

                            value={formData.fundType}
                            onChange={(value) => handleInputChange("fundType", value)}
                            className="max-w-lg"
                            options={[
                                { value: '', label: 'เลือกข้อมูล' },
                                { value: '10', label: 'เงินอุดหนุนรัฐบาลและเงินอุดหนุนอื่นที่รัฐบาลจัดสรรให้' },
                                { value: '11', label: 'เงินรายได้มหาวิทยาลัยและส่วนงาน' },
                                { value: '12', label: 'แหล่งทุนภายนอกมหาวิทยาลัย' },
                                { value: '13', label: 'เงินทุนส่วนตัว' },
                            ]}
                        />
                        <FormSelect
                            label=""
                            value={formData.fundSubType}
                            onChange={(value) => handleInputChange("fundSubType", value)}
                            className="max-w-lg"
                            options={subFundType}
                        />
                    </FormFieldBlock>

                    <FormFieldBlock>
                        {
                            formData.fundType !== '13' && (
                                <FormSelect
                                    label="ชื่อแหล่งทุน"
                                    required
                                    value={formData.fundName}
                                    onChange={(value) => handleInputChange("fundName", value)}
                                    className="max-w-lg"
                                    options={[
                                        { value: '', label: 'เลือกชื่อแหล่งทุน' },
                                        { value: 'สำนักงานคณะกรรมการวิจัยแห่งชาติ', label: 'สำนักงานคณะกรรมการวิจัยแห่งชาติ' },
                                        { value: 'สำนักงานกองทุนสนับสนุนการวิจัย', label: 'สำนักงานกองทุนสนับสนุนการวิจัย' },
                                        { value: 'สำนักงานคณะกรรมการการอุดมศึกษา', label: 'สำนักงานคณะกรรมการการอุดมศึกษา' },
                                        { value: 'สำนักงานพัฒนาการวิจัยการเกษตร (สวก.)', label: 'สำนักงานพัฒนาการวิจัยการเกษตร (สวก.)' },
                                        { value: 'สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ', label: 'สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ' },
                                        { value: 'ศูนย์เทคโนโลยีโลหะและวัสดุแห่งชาติ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ', label: 'ศูนย์เทคโนโลยีโลหะและวัสดุแห่งชาติ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ' },
                                        { value: 'ศูนย์พันธุวิศวกรรมและเทคโนโลยีชีวภาพแห่งชาติ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ', label: 'ศูนย์พันธุวิศวกรรมและเทคโนโลยีชีวภาพแห่งชาติ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ' },
                                        { value: 'ศูนย์นาโนเทคโนโลยีแห่งชาติ', label: 'ศูนย์นาโนเทคโนโลยีแห่งชาติ' },
                                        { value: 'กระทรวงวิทยาศาสตร์และเทคโนโลยี', label: 'กระทรวงวิทยาศาสตร์และเทคโนโลยี' },
                                        { value: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร', label: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร' },
                                        { value: 'มูลนิธิชัยพัฒนา', label: 'มูลนิธิชัยพัฒนา' },
                                        { value: 'มูลนิธิโครงการหลวง', label: 'มูลนิธิโครงการหลวง' },
                                        { value: 'มูลนิธิเพื่อการส่งเสริมวิทยาศาสตร์ ประเทศไทย', label: 'มูลนิธิเพื่อการส่งเสริมวิทยาศาสตร์ ประเทศไทย' },
                                        { value: 'กองทุนสิ่งแวดล้อม สำนักงานนโยบายและแผนสิ่งแวดล้อม', label: 'กองทุนสิ่งแวดล้อม สำนักงานนโยบายและแผนสิ่งแวดล้อม' },
                                        { value: 'กองทุนสนับสนุนการวิจัย ร่วมกับสำนักงานคณะกรรมการการอุดมศึกษา', label: 'กองทุนสนับสนุนการวิจัย ร่วมกับสำนักงานคณะกรรมการการอุดมศึกษา' },
                                        { value: 'ทุนอุดหนุนวิจัยภายใต้โครงการความร่วมมือระหว่างไทย-ญี่ปุ่น (NRCT-JSPS)', label: 'ทุนอุดหนุนวิจัยภายใต้โครงการความร่วมมือระหว่างไทย-ญี่ปุ่น (NRCT-JSPS)' },
                                        { value: 'อื่นๆ', label: 'อื่นๆ' },
                                    ]}
                                />
                            )
                        }

                        <FormTextarea
                            label={formData.fundType === '13' ? "ชื่อแหล่งทุน" : ""}
                            value={formData.fundType === '13' ? "เงินทุนส่วนตัว" : formData.fundName}
                            onChange={(value) => handleInputChange("fundName", value)}
                            disabled={formData.fundName === 'อื่นๆ' ? false : true}
                            className={`border border-gray-300 rounded-md p-2 ${formData.fundName === 'อื่นๆ' ? '' : 'bg-gray-100 cursor-not-allowed'}`}
                            placeholder=""
                        />
                    </FormFieldBlock>

                    <FormFieldBlock>
                        <FormInput
                            mini={true}

                            label="งบวิจัย"
                            type="number"
                            value={formData.budget}
                            onChange={(value) => handleInputChange("budget", value)}
                            placeholder="0"
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
                        <FormSelect
                            label="IC Types"
                            required
                            value={formData.icTypes}
                            onChange={(value) => handleInputChange("icTypes", value)}
                            className="max-w-lg"
                            options={[{ value: '', label: 'เลือกข้อมูล' }, ...icTypesLists.map(ic => ({ value: String(ic.id), label: ic.name }))]}
                        />

                        <FormSelect
                            label="Impact"
                            required
                            value={formData.impact}
                            onChange={(value) => handleInputChange("impact", value)}
                            className="max-w-lg"
                            options={[{ value: '', label: 'เลือกข้อมูล' }, ...impactLists.map(ic => ({ value: String(ic.id), label: ic.name }))]}
                        />

                        <FormSelect
                            label="SDG"
                            required
                            value={formData.sdg}
                            onChange={(value) => handleInputChange("sdg", value)}
                            className="max-w-lg"
                            options={[{ value: '', label: 'เลือกข้อมูล' }, ...sdgLists.map(ic => ({ value: String(ic.id), label: ic.name }))]}
                        />
                    </FormFieldBlock>
                </FormSection>

                <div className='p-4 rounded-md border shadow border-gray-200/70'>
                    <FormSection title="* ผู้ร่วมวิจัย">
                        <ResearchTeamTable formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} />
                    </FormSection>
                </div>

                <FormSection>
                    <FileUploadField
                        label="อัปโหลดไฟล์"
                        onFilesChange={(attachments) => handleInputChange("attachments", attachments)}
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        multiple={true}
                    />
                </FormSection>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Link href="/dashboard/form/overview">
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Link>
                    <Button variant="primary" type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submits'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
