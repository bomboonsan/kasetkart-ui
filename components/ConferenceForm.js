"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Country, State, City } from "country-state-city";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { worksAPI, projectAPI } from "@/lib/api";
import { stripUndefined, getDocumentId } from "@/utils";
import { extractResearchTeam } from "@/utils/team";
import dynamic from "next/dynamic";

// UI Components
import { FormSection, FormFieldBlock, FormField, Button } from "@/components/ui";
import ProjectPicker from "@/components/ProjectPicker";
import { FormInput } from "@/components/ui";
import FormRadio from "@/components/FormRadio";
import { FormCheckbox, FormTextarea, FormDateSelect } from "@/components/ui";
import { FormSelect } from "@/components/ui";
import FileUploadField from "@/components/FileUploadField";
import ResearchTeamTable from "@/components/ResearchTeamTable";

const SweetAlert2 = dynamic(() => import("react-sweetalert2"), { ssr: false });

// Constants
const INITIAL_FORM_DATA = {
  project_research: '',
  __projectObj: undefined,
  titleTH: null,
  titleEN: null,
  isEnvironmentallySustainable: 0,
  conferenceName: null,
  eventCountry: null,
  eventProvince: null,
  eventCity: null,
  eventLocation: null,
  durationStart: null,
  durationEnd: null,
  level: null,
  presentType: 0,
  presentationTitle: null,
  doi: null,
  keyword: null,
  abstractTH: null,
  abstractEN: null,
  attachments: [],
};

// Utility functions
const resolveNumericWorkId = async (workId) => {
  if (!workId) return null;
  if (typeof workId === 'number') return workId;
  
  try {
    const res = await api.get(`/work-conferences?filters[documentId][$eq]=${workId}&populate=*`);
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
    isEnvironmentallySustainable: parseInt(formData.isEnvironmentallySustainable, 10),
    conferenceName: formData.conferenceName || undefined,
    eventCountry: formData.eventCountry || undefined,
    eventProvince: formData.eventProvince || undefined,
    eventCity: formData.eventCity || undefined,
    eventLocation: formData.eventLocation || undefined,
    durationStart: formData.durationStart || undefined,
    durationEnd: formData.durationEnd || undefined,
    level: formData.level !== null ? parseInt(formData.level, 10) : undefined,
    presentType: parseInt(formData.presentType, 10),
    presentationTitle: formData.presentationTitle || undefined,
    doi: formData.doi || undefined,
    keyword: formData.keyword || undefined,
    abstractTH: formData.abstractTH || undefined,
    abstractEN: formData.abstractEN || undefined,
    attachments: (formData.attachments || []).map(a => ({ id: a.id })),
    team_users: teamUsers,
  };
};

// Helper functions
const toOptions = (items, getValue, getLabel) =>
  [{ value: "", label: "เลือก" }, ...items.map(i => ({ value: getValue(i), label: getLabel(i) }))];

export default function ConferenceForm({ mode = "create", workId, initialData, readonly = false }) {
  const router = useRouter();
  const [swalProps, setSwalProps] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing work-conference when editing
  const { data: existingWorkConference } = useSWR(
    mode === 'edit' && workId ? ['work-conference', workId] : null,
    () => worksAPI.getConference(workId)
  );

  // Memoized options
  const environmentOptions = useMemo(() => [
    { value: 0, label: "เกี่ยวข้อง" },
    { value: 1, label: "ไม่เกี่ยวข้อง" }
  ], []);

  const levelOptions = useMemo(() => [
    { value: 0, label: "ระดับชาติ" },
    { value: 1, label: "ระดับนานาชาติ" }
  ], []);

  const presentTypeOptions = useMemo(() => [
    { value: 0, label: "ภาคบรรยาย (Oral)" },
    { value: 1, label: "ภาคโปสเตอร์ (Poster)" },
    { value: 2, label: "เข้าร่วมประชุมวิชาการ" }
  ], []);

  const countryOptions = useMemo(() => 
    toOptions(Country.getAllCountries(), c => c.isoCode, c => c.name), []
  );

  const stateOptions = useMemo(() => {
    if (!formData.eventCountry) return [{ value: "", label: "เลือกประเทศก่อน" }];
    return toOptions(State.getStatesOfCountry(formData.eventCountry), s => s.isoCode, s => s.name);
  }, [formData.eventCountry]);

  const cityOptions = useMemo(() => {
    if (!formData.eventProvince) return [{ value: "", label: "เลือกจังหวัดก่อน" }];
    return toOptions(City.getCitiesOfState(formData.eventCountry, formData.eventProvince), c => c.name, c => c.name);
  }, [formData.eventCountry, formData.eventProvince]);

  // Input change handler
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields
      if (field === 'eventCountry') {
        newData.eventProvince = '';
        newData.eventCity = '';
      } else if (field === 'eventProvince') {
        newData.eventCity = '';
      }
      
      return newData;
    });
  }, []);

  // Project handlers
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

  // Form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = buildPayload(formData);
      const cleanPayload = stripUndefined(payload);

      if (mode === 'edit' && workId) {
        const targetId = await resolveNumericWorkId(workId);
        if (!targetId) throw new Error('ไม่พบข้อมูลที่ต้องการแก้ไข');
        
        await worksAPI.updateConference(targetId, cleanPayload);
        setSwalProps({
          show: true,
          title: 'สำเร็จ!',
          text: 'แก้ไขข้อมูลการประชุมวิชาการเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          didClose: () => {
            setSwalProps({ show: false });
            router.push('/form/overview');
          }
        });
      } else {
        await worksAPI.createConference(cleanPayload);
        setSwalProps({
          show: true,
          title: 'สำเร็จ!',
          text: 'บันทึกข้อมูลการประชุมวิชาการเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          didClose: () => {
            setSwalProps({ show: false });
            router.push('/form/overview');
          }
        });
      }

      // Revalidate SWR data
      mutate('work-conferences');
      mutate(['work-conference', workId]);
    } catch (error) {
      console.error('Submit error:', error);
      const errorMsg = error?.response?.data?.error?.message || error?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      setSwalProps({
        show: true,
        title: 'เกิดข้อผิดพลาด!',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'ตกลง',
        didClose: () => setSwalProps({ show: false })
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, mode, workId, router]);

  // Prefill form data when editing
  useEffect(() => {
    if (existingWorkConference?.data) {
      const data = existingWorkConference.data;
      setFormData(prev => ({
        ...prev,
        project_research: data.project_research?.documentId || '',
        __projectObj: data.project_research || undefined,
        titleTH: data.titleTH || '',
        titleEN: data.titleEN || '',
        isEnvironmentallySustainable: data.isEnvironmentallySustainable ?? 0,
        conferenceName: data.conferenceName || '',
        eventCountry: data.eventCountry || '',
        eventProvince: data.eventProvince || '',
        eventCity: data.eventCity || '',
        eventLocation: data.eventLocation || '',
        durationStart: data.durationStart?.slice(0, 10) || '',
        durationEnd: data.durationEnd?.slice(0, 10) || '',
        level: data.level ?? null,
        presentType: data.presentType ?? 0,
        presentationTitle: data.presentationTitle || '',
        doi: data.doi || '',
        keyword: data.keyword || '',
        abstractTH: data.abstractTH || '',
        abstractEN: data.abstractEN || '',
        attachments: data.attachments || [],
        // Team data
        team_users: data.team_users || [],
        team_external: data.team_external || [],
      }));
    }
  }, [existingWorkConference]);

  if (readonly) {
    return <ConferenceView data={formData} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <SweetAlert2 {...swalProps} />

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

        {/* Conference Details */}
        <FormSection title="รายละเอียดการประชุมวิชาการ">
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
              label="ชื่อการประชุมทางวิชาการ"
              value={formData.conferenceName}
              onChange={(value) => handleInputChange("conferenceName", value)}
              required
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormSelect
              label="ประเทศ"
              options={countryOptions}
              value={formData.eventCountry}
              onChange={(value) => handleInputChange("eventCountry", value)}
              required
            />
            <FormSelect
              label="จังหวัด/รัฐ"
              options={stateOptions}
              value={formData.eventProvince}
              onChange={(value) => handleInputChange("eventProvince", value)}
              required
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormSelect
              label="เมือง"
              options={cityOptions}
              value={formData.eventCity}
              onChange={(value) => handleInputChange("eventCity", value)}
              required
            />
            <FormInput
              label="สถานที่จัดการประชุม"
              value={formData.eventLocation}
              onChange={(value) => handleInputChange("eventLocation", value)}
              required
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormDateSelect
              label="วันที่เริ่มการประชุม"
              value={formData.durationStart}
              onChange={(value) => handleInputChange("durationStart", value)}
              required
            />
            <FormDateSelect
              label="วันที่สิ้นสุดการประชุม"
              value={formData.durationEnd}
              onChange={(value) => handleInputChange("durationEnd", value)}
              required
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

          <FormFieldBlock>
            <FormRadio
              label="รูปแบบการนำเสนอ"
              options={presentTypeOptions}
              value={formData.presentType}
              onChange={(value) => handleInputChange("presentType", parseInt(value, 10))}
              required
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormInput
              label="ชื่อเรื่องที่นำเสนอ"
              value={formData.presentationTitle}
              onChange={(value) => handleInputChange("presentationTitle", value)}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormInput
              label="DOI (ถ้าไม่มีให้ใส่ '-')"
              value={formData.doi}
              onChange={(value) => handleInputChange("doi", value)}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormInput
              label="คำสำคัญ (คั่นด้วยเครื่องหมายจุลภาค)"
              value={formData.keyword}
              onChange={(value) => handleInputChange("keyword", value)}
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
            label="ส่งไฟล์เอกสารการประชุม (PDF, DOC, DOCX)"
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
            disabled={isLoading}
          >
            {isLoading ? 'กำลังบันทึก...' : (mode === 'edit' ? 'แก้ไข' : 'บันทึก')}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Read-only view component
function ConferenceView({ data }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">ข้อมูลการประชุมวิชาการ</h2>
        
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
            <label className="block text-sm font-medium text-gray-700">ชื่อการประชุม</label>
            <p className="mt-1 text-sm text-gray-900">{data.conferenceName || '-'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">สถานที่</label>
            <p className="mt-1 text-sm text-gray-900">
              {[data.eventLocation, data.eventCity, data.eventProvince, data.eventCountry]
                .filter(Boolean).join(', ') || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}