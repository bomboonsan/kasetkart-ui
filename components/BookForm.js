"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { worksAPI, projectAPI, fundingAPI } from '@/lib/api';
import { getDocumentId, createHandleChange, stripUndefined } from '@/utils';
import dynamic from 'next/dynamic';

// UI Components
import { FormSection, FormFieldBlock, FormField, Button } from '@/components/ui';
import ProjectFundingPicker from '@/components/ProjectFundingPicker';
import { FormInput } from "@/components/ui";
import FormRadio from "@/components/FormRadio";
import { FormCheckbox, FormTextarea, FormDateSelect } from '@/components/ui';
import { FormSelect } from "@/components/ui";
import ResearchTeamTable from '@/components/ResearchTeamTable';

const FileUploadField = dynamic(() => import('@/components/FileUploadField'), { ssr: false });
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false });

// Constants
const INITIAL_FORM_DATA = {
  project_funding: null,
  bookType: 0,
  titleTH: null,
  titleEN: null,
  detail: null,
  level: null,
  publicationDate: null,
  attachments: [],
  writers: [],
  __projectFundingObj: undefined,
};

// Utility functions
const resolveNumericWorkId = async (workId) => {
  if (!workId) return null;
  if (typeof workId === 'number') return workId;
  
  try {
    const res = await api.get(`/work-books?filters[documentId][$eq]=${workId}&populate=*`);
    return res.data?.data?.[0]?.id || null;
  } catch (error) {
    console.error('Error resolving work ID:', error);
    return null;
  }
};

const buildPayload = (formData) => {
  return {
    project_funding: formData.__projectFundingObj?.id,
    bookType: parseInt(formData.bookType, 10),
    titleTH: formData.titleTH || undefined,
    titleEN: formData.titleEN || undefined,
    detail: formData.detail || undefined,
    level: formData.level !== null ? parseInt(formData.level, 10) : undefined,
    publicationDate: formData.publicationDate || undefined,
    attachments: (formData.attachments || []).map(a => ({ id: a.id })),
    writers: formData.writers || [],
  };
};

export default function BookForm({ mode = 'create', workId, initialData, readonly = false }) {
  const router = useRouter();
  const [swalProps, setSwalProps] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing work-book when editing
  const { data: existingWorkBook } = useSWR(
    mode === 'edit' && workId ? ['work-book', workId] : null,
    () => worksAPI.getBook(workId)
  );

  // Memoized options
  const bookTypeOptions = useMemo(() => [
    { value: 0, label: "หนังสือ" },
    { value: 1, label: "ตำรา" }
  ], []);

  const levelOptions = useMemo(() => [
    { value: 0, label: "ระดับชาติ" },
    { value: 1, label: "ระดับนานาชาติ" }
  ], []);

  // Input change handler
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Project funding handlers
  const handleProjectFundingChange = useCallback((projectFundingId) => {
    setFormData(prev => ({ ...prev, project_funding: projectFundingId }));
  }, []);

  const handleProjectFundingSelect = useCallback((projectFundingObj) => {
    setFormData(prev => ({
      ...prev,
      project_funding: projectFundingObj?.documentId || '',
      __projectFundingObj: projectFundingObj
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
        
        await worksAPI.updateBook(targetId, cleanPayload);
        setSwalProps({
          show: true,
          title: 'สำเร็จ!',
          text: 'แก้ไขข้อมูลผลงานหนังสือ/ตำราเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          didClose: () => {
            setSwalProps({ show: false });
            router.push('/form/overview');
          }
        });
      } else {
        await worksAPI.createBook(cleanPayload);
        setSwalProps({
          show: true,
          title: 'สำเร็จ!',
          text: 'บันทึกข้อมูลผลงานหนังสือ/ตำราเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          didClose: () => {
            setSwalProps({ show: false });
            router.push('/form/overview');
          }
        });
      }

      // Revalidate SWR data
      mutate('work-books');
      mutate(['work-book', workId]);
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
    if (existingWorkBook?.data) {
      const data = existingWorkBook.data;
      setFormData(prev => ({
        ...prev,
        project_funding: data.project_funding?.documentId || '',
        __projectFundingObj: data.project_funding || undefined,
        bookType: data.bookType ?? 0,
        titleTH: data.titleTH || '',
        titleEN: data.titleEN || '',
        detail: data.detail || '',
        level: data.level ?? null,
        publicationDate: data.publicationDate?.slice(0, 10) || '',
        attachments: data.attachments || [],
        writers: data.writers || [],
      }));
    }
  }, [existingWorkBook]);

  if (readonly) {
    return <BookView data={formData} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <SweetAlert2 {...swalProps} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Funding Selection */}
        <FormSection title="โครงการขอทุน">
          <FormFieldBlock>
            <ProjectFundingPicker
              label="เลือกโครงการขอทุน"
              value={formData.project_funding}
              onChange={handleProjectFundingChange}
              onSelect={handleProjectFundingSelect}
              required
            />
          </FormFieldBlock>
        </FormSection>

        {/* Book Details */}
        <FormSection title="รายละเอียดผลงาน">
          <FormFieldBlock>
            <FormRadio
              label="ประเภทผลงาน"
              options={bookTypeOptions}
              value={formData.bookType}
              onChange={(value) => handleInputChange("bookType", parseInt(value, 10))}
              required
            />
          </FormFieldBlock>

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
            <FormTextarea
              label="รายละเอียดเบื้องต้น"
              value={formData.detail}
              onChange={(value) => handleInputChange("detail", value)}
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
            <FormDateSelect
              label="วันที่เกิดผลงาน"
              value={formData.publicationDate}
              onChange={(value) => handleInputChange("publicationDate", value)}
              required
            />
          </FormFieldBlock>
        </FormSection>

        {/* File Upload */}
        <FormSection title="ไฟล์แนบ">
          <FileUploadField
            label="ส่งไฟล์ผลงาน (PDF, DOC, DOCX)"
            value={formData.attachments}
            onFilesChange={(attachments) => handleInputChange("attachments", attachments)}
            accept=".pdf,.doc,.docx"
            multiple
          />
        </FormSection>

        {/* Research Team */}
        {formData.__projectFundingObj && (
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
function BookView({ data }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">ข้อมูลผลงานหนังสือ/ตำรา</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ประเภทผลงาน</label>
            <p className="mt-1 text-sm text-gray-900">
              {data.bookType === 0 ? 'หนังสือ' : 'ตำรา'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อผลงาน (ไทย)</label>
            <p className="mt-1 text-sm text-gray-900">{data.titleTH || '-'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อผลงาน (อังกฤษ)</label>
            <p className="mt-1 text-sm text-gray-900">{data.titleEN || '-'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">ระดับ</label>
            <p className="mt-1 text-sm text-gray-900">
              {data.level === 0 ? 'ระดับชาติ' : data.level === 1 ? 'ระดับนานาชาติ' : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}