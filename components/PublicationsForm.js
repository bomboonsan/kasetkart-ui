"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from 'next/navigation'
import useSWR, { mutate } from 'swr'
import { worksAPI, projectAPI, profileAPI } from '@/lib/api'
import { stripUndefined, getDocumentId, createHandleChange } from '@/utils'
import { api } from '@/lib/api-base'
import { extractResearchTeam } from '@/utils/team'
import dynamic from 'next/dynamic'

// UI Components
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
import Button from "@/components/Button";

const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })

// Constants
const INITIAL_FORM_DATA = {
  project_research: '',
  __projectObj: undefined,
  titleTH: null,
  titleEN: null,
  isEnvironmentallySustainable: 0,
  journalName: null,
  doi: null,
  isbn: null,
  volume: null,
  issue: null,
  durationStart: null,
  durationEnd: null,
  pageStart: null,
  pageEnd: null,
  level: null,
  isJournalDatabase: false,
  isScopus: false,
  scopusType: null,
  scopusValue: null,
  isACI: false,
  isABDC: false,
  abdcType: null,
  isTCI1: false,
  isTCI2: false,
  isAJG: false,
  ajgType: null,
  isSSRN: false,
  isWOS: false,
  wosType: null,
  fundName: null,
  keywords: null,
  abstractTH: null,
  abstractEN: null,
  attachments: [],
  standardScopus: 0,
  standardScopusSubset: 0,
  standardWebOfScience: 0,
  standardABDC: 0,
  standardAJG: 0,
};

const LISTS_STANDARD = [
  { label: "Scopus", key: "isScopus" },
  { label: "ACI", key: "isACI" },
  { label: "TCI1", key: "isTCI1" },
  { label: "ABDC", key: "isABDC" },
  { label: "TCI2", key: "isTCI2" },
  { label: "AJG", key: "isAJG" },
  { label: "SSRN", key: "isSSRN" },
  { label: "WOS", key: "isWOS" },
];

// Utility functions
const resolveNumericWorkId = async (workId) => {
  if (!workId) return null;
  if (typeof workId === 'number') return workId;
  
  try {
    const res = await api.get(`/work-publications?filters[documentId][$eq]=${workId}&populate=*`);
    return res.data?.data?.[0]?.id || null;
  } catch (error) {
    console.error('Error resolving work ID:', error);
    return null;
  }
};

const buildPayload = (formData) => {
  const teamUsers = extractResearchTeam(formData);
  
  return {
    project_research: formData.__projectObj?.id,
    titleTH: formData.titleTH || undefined,
    titleEN: formData.titleEN || undefined,
    isEnvironmentallySustainable: formData.isEnvironmentallySustainable,
    journalName: formData.journalName || undefined,
    doi: formData.doi || undefined,
    isbn: formData.isbn || undefined,
    volume: formData.volume ? parseInt(formData.volume, 10) : undefined,
    issue: formData.issue ? parseInt(formData.issue, 10) : undefined,
    durationStart: formData.durationStart || undefined,
    durationEnd: formData.durationEnd || undefined,
    pageStart: formData.pageStart ? parseInt(formData.pageStart, 10) : undefined,
    pageEnd: formData.pageEnd ? parseInt(formData.pageEnd, 10) : undefined,
    level: formData.level !== null ? parseInt(formData.level, 10) : undefined,
    
    // Standard fields
    isJournalDatabase: formData.isJournalDatabase,
    isScopus: formData.isScopus,
    scopusType: formData.scopusType ? parseInt(formData.scopusType, 10) : undefined,
    scopusValue: formData.scopusValue ? parseInt(formData.scopusValue, 10) : undefined,
    isACI: formData.isACI,
    isABDC: formData.isABDC,
    abdcType: formData.abdcType ? parseInt(formData.abdcType, 10) : undefined,
    isTCI1: formData.isTCI1,
    isTCI2: formData.isTCI2,
    isAJG: formData.isAJG,
    ajgType: formData.ajgType ? parseInt(formData.ajgType, 10) : undefined,
    isSSRN: formData.isSSRN,
    isWOS: formData.isWOS,
    wosType: formData.wosType ? parseInt(formData.wosType, 10) : undefined,
    
    fundName: formData.fundName || undefined,
    keywords: formData.keywords || undefined,
    abstractTH: formData.abstractTH || undefined,
    abstractEN: formData.abstractEN || undefined,
    attachments: (formData.attachments || []).map(a => ({ id: a.id })),
    
    // Team
    team_users: teamUsers,
  };
};

export default function PublicationsForm({ mode = 'create', workId, initialData, readonly = false }) {
  const router = useRouter();
  const [swalProps, setSwalProps] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing publication data when editing
  const { data: existingPublication } = useSWR(
    mode === 'edit' && workId ? ['work-publication', workId] : null,
    () => worksAPI.getPublication(workId)
  );

  // Memoized computed values
  const environmentOptions = useMemo(() => [
    { value: 0, label: "เกี่ยวข้อง" },
    { value: 1, label: "ไม่เกี่ยวข้อง" }
  ], []);

  const levelOptions = useMemo(() => [
    { value: 0, label: "ระดับชาติ" },
    { value: 1, label: "ระดับนานาชาติ" }
  ], []);

  // Input change handler with useCallback
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Project change handler
  const handleProjectChange = useCallback((projectId) => {
    setFormData(prev => ({ ...prev, project_research: projectId }));
  }, []);

  const handleProjectSelect = useCallback((projectObj) => {
    setFormData(prev => ({
      ...prev,
      project_research: projectObj?.documentId || '',
      __projectObj: projectObj
    }));
  }, []);

  // Form submission handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = buildPayload(formData);
      const cleanPayload = stripUndefined(payload);

      if (mode === 'edit' && workId) {
        const targetId = await resolveNumericWorkId(workId);
        if (!targetId) throw new Error('ไม่พบข้อมูลที่ต้องการแก้ไข');
        
        await worksAPI.updatePublication(targetId, cleanPayload);
        setSwalProps({
          show: true,
          title: 'สำเร็จ!',
          text: 'แก้ไขข้อมูลผลงานตีพิมพ์เรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          didClose: () => {
            setSwalProps({ show: false });
            router.push('/form/overview');
          }
        });
      } else {
        await worksAPI.createPublication(cleanPayload);
        setSwalProps({
          show: true,
          title: 'สำเร็จ!',
          text: 'บันทึกข้อมูลผลงานตีพิมพ์เรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          didClose: () => {
            setSwalProps({ show: false });
            router.push('/form/overview');
          }
        });
      }

      // Revalidate SWR data
      mutate('work-publications');
      mutate(['work-publication', workId]);
    } catch (error) {
      console.error('Submit error:', error);
      const errorMsg = error?.response?.data?.error?.message || error?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      setError(errorMsg);
      setSwalProps({
        show: true,
        title: 'เกิดข้อผิดพลาด!',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'ตกลง',
        didClose: () => setSwalProps({ show: false })
      });
    } finally {
      setSubmitting(false);
    }
  }, [formData, mode, workId, router]);

  // Prefill form data when editing
  useEffect(() => {
    if (existingPublication?.data) {
      const data = existingPublication.data;
      setFormData(prev => ({
        ...prev,
        project_research: data.project_research?.documentId || '',
        __projectObj: data.project_research || undefined,
        titleTH: data.titleTH || '',
        titleEN: data.titleEN || '',
        isEnvironmentallySustainable: data.isEnvironmentallySustainable ?? 0,
        journalName: data.journalName || '',
        doi: data.doi || '',
        isbn: data.isbn || '',
        volume: data.volume || '',
        issue: data.issue || '',
        durationStart: data.durationStart?.slice(0, 10) || '',
        durationEnd: data.durationEnd?.slice(0, 10) || '',
        pageStart: data.pageStart || '',
        pageEnd: data.pageEnd || '',
        level: data.level ?? null,
        isJournalDatabase: data.isJournalDatabase || false,
        isScopus: data.isScopus || false,
        scopusType: data.scopusType || null,
        scopusValue: data.scopusValue || null,
        isACI: data.isACI || false,
        isABDC: data.isABDC || false,
        abdcType: data.abdcType || null,
        isTCI1: data.isTCI1 || false,
        isTCI2: data.isTCI2 || false,
        isAJG: data.isAJG || false,
        ajgType: data.ajgType || null,
        isSSRN: data.isSSRN || false,
        isWOS: data.isWOS || false,
        wosType: data.wosType || null,
        fundName: data.fundName || '',
        keywords: data.keywords || '',
        abstractTH: data.abstractTH || '',
        abstractEN: data.abstractEN || '',
        attachments: data.attachments || [],
        // Team data
        team_users: data.team_users || [],
        team_external: data.team_external || [],
      }));
    }
  }, [existingPublication]);

  if (readonly) {
    return <PublicationView data={formData} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <SweetAlert2 {...swalProps} />
      
      {error && (
        <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Selection */}
        <FormSection title="โครงการวิจัย">
          <FormFieldBlock>
            <ProjectPicker
              label="เลือกโครงการวิจัย"
              value={formData.project_research}
              onChange={handleProjectChange}
              onSelect={handleProjectSelect}
              required
            />
          </FormFieldBlock>
        </FormSection>

        {/* Publication Details */}
        <FormSection title="รายละเอียดผลงานตีพิมพ์">
          <FormFieldBlock>
            <FormInput
              label="ชื่อผลงาน (ไทย)"
              value={formData.titleTH}
              onChange={(value) => handleInputChange("titleTH", value)}
              required
            />
            <FormInput
              label="ชื่อผลงาน (อังกฤษ)"
              value={formData.titleEN}
              onChange={(value) => handleInputChange("titleEN", value)}
              required
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormRadio
              label="เกี่ยวข้องกับสิ่งแวดล้อมและความยั่งยืน"
              options={environmentOptions}
              value={formData.isEnvironmentallySustainable}
              onChange={(value) => handleInputChange("isEnvironmentallySustainable", parseInt(value, 10))}
              required
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormInput
              label="ชื่อวารสาร"
              value={formData.journalName}
              onChange={(value) => handleInputChange("journalName", value)}
              required
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormInput
              label="DOI (ถ้าไม่มีให้ใส่ '-')"
              value={formData.doi}
              onChange={(value) => handleInputChange("doi", value)}
            />
            <FormInput
              label="ISBN"
              value={formData.isbn}
              onChange={(value) => handleInputChange("isbn", value)}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormDoubleInput
              label1="ปีที่ (Volume)"
              value1={formData.volume}
              onChange1={(value) => handleInputChange("volume", value)}
              label2="ฉบับที่ (Issue)"
              value2={formData.issue}
              onChange2={(value) => handleInputChange("issue", value)}
              type="number"
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormDateSelect
              label="วันที่เริ่มตีพิมพ์"
              value={formData.durationStart}
              onChange={(value) => handleInputChange("durationStart", value)}
            />
            <FormDateSelect
              label="วันที่สิ้นสุดการตีพิมพ์"
              value={formData.durationEnd}
              onChange={(value) => handleInputChange("durationEnd", value)}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormDoubleInput
              label1="หน้าเริ่มต้น"
              value1={formData.pageStart}
              onChange1={(value) => handleInputChange("pageStart", value)}
              label2="หน้าสิ้นสุด"
              value2={formData.pageEnd}
              onChange2={(value) => handleInputChange("pageEnd", value)}
              type="number"
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormRadio
              label="ระดับ"
              options={levelOptions}
              value={formData.level}
              onChange={(value) => handleInputChange("level", parseInt(value, 10))}
              required
            />
          </FormFieldBlock>
        </FormSection>

        {/* Database Standards */}
        <FormSection title="ฐานข้อมูลมาตรฐาน">
          <FormFieldBlock>
            {LISTS_STANDARD.map((standard) => (
              <FormCheckbox
                key={standard.key}
                label={standard.label}
                checked={formData[standard.key]}
                onChange={(checked) => handleInputChange(standard.key, checked)}
              />
            ))}
          </FormFieldBlock>
        </FormSection>

        {/* Additional Information */}
        <FormSection title="ข้อมูลเพิ่มเติม">
          <FormFieldBlock>
            <FormInput
              label="ชื่อแหล่งทุน (ถ้ามี)"
              value={formData.fundName}
              onChange={(value) => handleInputChange("fundName", value)}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormInput
              label="คำสำคัญ (คั่นด้วยเครื่องหมายจุลภาค)"
              value={formData.keywords}
              onChange={(value) => handleInputChange("keywords", value)}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="บทคัดย่อ (ไทย)"
              value={formData.abstractTH}
              onChange={(value) => handleInputChange("abstractTH", value)}
            />
            <FormTextarea
              label="บทคัดย่อ (อังกฤษ)"
              value={formData.abstractEN}
              onChange={(value) => handleInputChange("abstractEN", value)}
            />
          </FormFieldBlock>
        </FormSection>

        {/* File Upload */}
        <FormSection title="ไฟล์แนบ">
          <FileUploadField
            label="ส่งไฟล์บทความทางวิชาการ (PDF, DOC, DOCX)"
            value={formData.attachments}
            onFilesChange={(attachments) => handleInputChange("attachments", attachments)}
            accept=".pdf,.doc,.docx"
            multiple
          />
        </FormSection>

        {/* Research Team */}
        {formData.__projectObj && (
          <FormSection title="ผู้ร่วมวิจัย">
            <ResearchTeamTable
              formData={formData}
              setFormData={setFormData}
            />
          </FormSection>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button 
            variant="outline" 
            type="button"
            onClick={() => router.back()}
          >
            ยกเลิก
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={submitting}
          >
            {submitting ? 'กำลังบันทึก...' : (mode === 'edit' ? 'แก้ไข' : 'บันทึก')}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Read-only view component
function PublicationView({ data }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">ข้อมูลผลงานตีพิมพ์</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อผลงาน (ไทย)</label>
            <p className="mt-1 text-sm text-gray-900">{data.titleTH || '-'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อผลงาน (อังกฤษ)</label>
            <p className="mt-1 text-sm text-gray-900">{data.titleEN || '-'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อวารสาร</label>
            <p className="mt-1 text-sm text-gray-900">{data.journalName || '-'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">DOI</label>
            <p className="mt-1 text-sm text-gray-900">{data.doi || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}