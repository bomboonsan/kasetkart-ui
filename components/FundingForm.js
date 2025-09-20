"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { worksAPI, fundingAPI } from '@/lib/api';
import { stripUndefined, getDocumentId } from '@/utils';
import { extractResearchTeam } from '@/utils/team';
import dynamic from 'next/dynamic';

// UI Components
import { FormSection, FormFieldBlock, FormField, Button } from '@/components/ui';
import FundingPicker from '@/components/FundingPicker';
import { FormInput } from "@/components/ui";
import FormRadio from "@/components/FormRadio";
import { FormCheckbox, FormTextarea, FormDateSelect } from '@/components/ui';
import { FormSelect } from "@/components/ui";
import FileUploadField from "@/components/FileUploadField";
import ResearchTeamTable from '@/components/ResearchTeamTable';

const SweetAlert2 = dynamic(() => import("react-sweetalert2"), { ssr: false });

// Constants
const INITIAL_FORM_DATA = {
  funding: null,
  __fundingObj: undefined,
  titleTH: null,
  titleEN: null,
  isEnvironmentallySustainable: 0,
  detail: null,
  budgetTotal: null,
  budgetReceived: null,
  durationStart: null,
  durationEnd: null,
  level: null,
  attachments: [],
};

// Utility functions
const resolveNumericWorkId = async (workId) => {
  if (!workId) return null;
  if (typeof workId === 'number') return workId;
  
  try {
    const res = await api.get(`/work-fundings?filters[documentId][$eq]=${workId}&populate=*`);
    return res.data?.data?.[0]?.id || null;
  } catch (error) {
    console.error('Error resolving work ID:', error);
    return null;
  }
};

const buildPayload = (formData) => {
  const teamUsers = extractResearchTeam(formData);
  
  return {
    funding: formData.__fundingObj?.id,
    titleTH: formData.titleTH || undefined,
    titleEN: formData.titleEN || undefined,
    isEnvironmentallySustainable: parseInt(formData.isEnvironmentallySustainable, 10),
    detail: formData.detail || undefined,
    budgetTotal: formData.budgetTotal ? parseFloat(formData.budgetTotal) : undefined,
    budgetReceived: formData.budgetReceived ? parseFloat(formData.budgetReceived) : undefined,
    durationStart: formData.durationStart || undefined,
    durationEnd: formData.durationEnd || undefined,
    level: formData.level !== null ? parseInt(formData.level, 10) : undefined,
    attachments: (formData.attachments || []).map(a => ({ id: a.id })),
    team_users: teamUsers,
  };
};

export default function FundingForm({ mode = 'create', workId, initialData, readonly = false }) {
  const router = useRouter();
  const [swalProps, setSwalProps] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing work-funding when editing
  const { data: existingWorkFunding } = useSWR(
    mode === 'edit' && workId ? ['work-funding', workId] : null,
    () => worksAPI.getFunding(workId)
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

  // Input change handler
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Funding handlers
  const handleFundingChange = useCallback((fundingId) => {
    setFormData(prev => ({ ...prev, funding: fundingId }));
  }, []);

  const handleFundingSelect = useCallback((fundingObj) => {
    setFormData(prev => ({
      ...prev,
      funding: fundingObj?.documentId || '',
      __fundingObj: fundingObj
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
        
        await worksAPI.updateFunding(targetId, cleanPayload);
        setSwalProps({
          show: true,
          title: 'สำเร็จ!',
          text: 'แก้ไขข้อมูลทุนวิจัยเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          didClose: () => {
            setSwalProps({ show: false });
            router.push('/form/overview');
          }
        });
      } else {
        await worksAPI.createFunding(cleanPayload);
        setSwalProps({
          show: true,
          title: 'สำเร็จ!',
          text: 'บันทึกข้อมูลทุนวิจัยเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          didClose: () => {
            setSwalProps({ show: false });
            router.push('/form/overview');
          }
        });
      }

      // Revalidate SWR data
      mutate('work-fundings');
      mutate(['work-funding', workId]);
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
    if (existingWorkFunding?.data) {
      const data = existingWorkFunding.data;
      setFormData(prev => ({
        ...prev,
        funding: data.funding?.documentId || '',
        __fundingObj: data.funding || undefined,
        titleTH: data.titleTH || '',
        titleEN: data.titleEN || '',
        isEnvironmentallySustainable: data.isEnvironmentallySustainable ?? 0,
        detail: data.detail || '',
        budgetTotal: data.budgetTotal || '',
        budgetReceived: data.budgetReceived || '',
        durationStart: data.durationStart?.slice(0, 10) || '',
        durationEnd: data.durationEnd?.slice(0, 10) || '',
        level: data.level ?? null,
        attachments: data.attachments || [],
        // Team data
        team_users: data.team_users || [],
        team_external: data.team_external || [],
      }));
    }
  }, [existingWorkFunding]);

  if (readonly) {
    return <FundingView data={formData} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <SweetAlert2 {...swalProps} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Funding Selection */}
        <FormSection title="ข้อมูลทุนวิจัย">
          <FormFieldBlock>
            <FundingPicker
              label="เลือกทุนวิจัย"
              value={formData.funding}
              onChange={handleFundingChange}
              onSelect={handleFundingSelect}
              required
            />
          </FormFieldBlock>
        </FormSection>

        {/* Project Details */}
        <FormSection title="รายละเอียดโครงการ">
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
            <FormTextarea
              label="รายละเอียดโครงการ"
              value={formData.detail}
              onChange={(value) => handleInputChange("detail", value)}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormInput
              label="งบประมาณรวม (บาท)"
              value={formData.budgetTotal}
              onChange={(value) => handleInputChange("budgetTotal", value)}
              type="number"
              step="0.01"
            />
            <FormInput
              label="งบประมาณที่ได้รับ (บาท)"
              value={formData.budgetReceived}
              onChange={(value) => handleInputChange("budgetReceived", value)}
              type="number"
              step="0.01"
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormDateSelect
              label="วันที่เริ่มโครงการ"
              value={formData.durationStart}
              onChange={(value) => handleInputChange("durationStart", value)}
              required
            />
            <FormDateSelect
              label="วันที่สิ้นสุดโครงการ"
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
        </FormSection>

        {/* File Upload */}
        <FormSection title="ไฟล์แนบ">
          <FileUploadField
            label="ส่งไฟล์เอกสารทุนวิจัย (PDF, DOC, DOCX)"
            value={formData.attachments}
            onFilesChange={(attachments) => handleInputChange("attachments", attachments)}
            accept=".pdf,.doc,.docx"
            multiple
          />
        </FormSection>

        {/* Research Team */}
        {formData.__fundingObj && (
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
function FundingView({ data }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">ข้อมูลทุนวิจัย</h2>
        
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
            <label className="block text-sm font-medium text-gray-700">งบประมาณรวม</label>
            <p className="mt-1 text-sm text-gray-900">
              {data.budgetTotal ? `${parseFloat(data.budgetTotal).toLocaleString()} บาท` : '-'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">งบประมาณที่ได้รับ</label>
            <p className="mt-1 text-sm text-gray-900">
              {data.budgetReceived ? `${parseFloat(data.budgetReceived).toLocaleString()} บาท` : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}