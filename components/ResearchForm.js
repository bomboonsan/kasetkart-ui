"use client";

import { useEffect, useState } from "react";
import { FormSection, FormFieldBlock, FormField } from "@/components/ui";
import UserPicker from "./UserPicker";
import { FormInput } from "@/components/ui";
import FormRadio from "./FormRadio";
import { FormTextarea } from "@/components/ui";
import { FormDateSelect } from "@/components/ui";
import { FormSelect } from "@/components/ui";
import FileUploadField from "./FileUploadField";
import ResearchTeamTable from "./ResearchTeamTable";
import { Button } from "@/components/ui";
import Link from "next/link";
import dynamic from "next/dynamic";
const SweetAlert2 = dynamic(() => import("react-sweetalert2"), { ssr: false });
// ใช้ path alias (@/) เพื่อให้ import ชัดเจนและลดความซ้ำซ้อนของ path
import { projectAPI, valueFromAPI } from "@/lib/api";
import { useSession } from 'next-auth/react';
// ยูทิลิตี้สำหรับจัดการ payload ให้สะอาด
import { stripUndefined } from "@/utils";
// ใช้ path alias (@/) สำหรับ helper
import { formatDateDMY } from "@/utils";
import { use } from "react";
import useSWR, { mutate } from "swr";
import { createHandleChange } from "@/utils";

export default function ResearchForm({
  mode = "create",
  projectId: propProjectId,
  workId,
}) {
  // รับ props: mode และ projectId (รองรับ workId เดิมด้วย)
  const projectId = propProjectId || workId || null;

  ////////////////////////////////////////////////////////
  // Setup form fields
  ////////////////////////////////////////////////////////
  const [icTypesLists, setIcTypesLists] = useState([]);
  const [impactLists, setImpactLists] = useState([]);
  const [sdgLists, setSdgLists] = useState([]);

  const { data: icTypesRes, error: swrError } = useSWR("icTypes", () =>
    valueFromAPI.getIcTypes(),
  );
  const { data: impactRes } = useSWR("impacts", () =>
    valueFromAPI.getImpacts(),
  );
  const { data: sdgRes } = useSWR("sdgs", () => valueFromAPI.getSDGs());

  useEffect(() => {
    if (icTypesRes) {
      setIcTypesLists(icTypesRes.data || []);
    }
  }, [icTypesRes]);

  useEffect(() => {
    if (impactRes) {
      setImpactLists(impactRes.data || []);
    }
  }, [impactRes]);

  useEffect(() => {
    if (sdgRes) {
      setSdgLists(sdgRes.data || []);
    }
  }, [sdgRes]);

  // Form state management
  const [formData, setFormData] = useState({
    titleTH: "",
    titleEN: "",
    icType: "",
    startDate: "",
    endDate: "",
    impact: "",
    sdg: "",
    budget: "",
    description: "",
    researchTeam: [],
    files: [],
  });

  const [swalProps, setSwalProps] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load existing data for edit mode
  useEffect(() => {
    if (mode === "edit" && projectId) {
      setIsLoading(true);
      projectAPI
        .getProject(projectId)
        .then((res) => {
          if (res.data) {
            const project = res.data;
            setFormData({
              titleTH: project.titleTH || "",
              titleEN: project.titleEN || "",
              icType: project.icType || "",
              startDate: project.startDate || "",
              endDate: project.endDate || "",
              impact: project.impact || "",
              sdg: project.sdg || "",
              budget: project.budget || "",
              description: project.description || "",
              researchTeam: project.researchTeam || [],
              files: project.files || [],
            });
          }
        })
        .catch((error) => {
          console.error("Error loading project:", error);
          setSwalProps({
            show: true,
            title: "Error",
            text: "Failed to load project data",
            icon: "error",
            showConfirmButton: true,
            onConfirm: () => setSwalProps({}),
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [mode, projectId]);

  const handleChange = createHandleChange(setFormData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = stripUndefined(formData);
      
      if (mode === "create") {
        const response = await projectAPI.createProject(payload);
        setSwalProps({
          show: true,
          title: "Success",
          text: "Research project created successfully",
          icon: "success",
          showConfirmButton: true,
          onConfirm: () => {
            setSwalProps({});
            // Redirect or refresh as needed
          },
        });
      } else {
        const response = await projectAPI.updateProject(projectId, payload);
        setSwalProps({
          show: true,
          title: "Success",
          text: "Research project updated successfully",
          icon: "success",
          showConfirmButton: true,
          onConfirm: () => setSwalProps({}),
        });
      }
    } catch (error) {
      console.error("Error saving project:", error);
      setSwalProps({
        show: true,
        title: "Error",
        text: `Failed to ${mode === "create" ? "create" : "update"} project`,
        icon: "error",
        showConfirmButton: true,
        onConfirm: () => setSwalProps({}),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <SweetAlert2 {...swalProps} />
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormSection title="Project Information">
          <FormFieldBlock>
            <FormField label="Title (Thai)" required>
              <FormInput
                name="titleTH"
                value={formData.titleTH}
                onChange={handleChange}
                placeholder="Enter project title in Thai"
                required
              />
            </FormField>
            
            <FormField label="Title (English)" required>
              <FormInput
                name="titleEN"
                value={formData.titleEN}
                onChange={handleChange}
                placeholder="Enter project title in English"
                required
              />
            </FormField>
          </FormFieldBlock>

          <FormFieldBlock>
            <FormField label="IC Type" required>
              <FormSelect
                name="icType"
                value={formData.icType}
                onChange={handleChange}
                options={icTypesLists}
                placeholder="Select IC Type"
                required
              />
            </FormField>
          </FormFieldBlock>

          <FormFieldBlock>
            <FormField label="Start Date" required>
              <FormDateSelect
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </FormField>
            
            <FormField label="End Date" required>
              <FormDateSelect
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </FormField>
          </FormFieldBlock>

          <FormFieldBlock>
            <FormField label="Impact">
              <FormSelect
                name="impact"
                value={formData.impact}
                onChange={handleChange}
                options={impactLists}
                placeholder="Select Impact"
              />
            </FormField>
            
            <FormField label="SDG">
              <FormSelect
                name="sdg"
                value={formData.sdg}
                onChange={handleChange}
                options={sdgLists}
                placeholder="Select SDG"
              />
            </FormField>
          </FormFieldBlock>

          <FormFieldBlock>
            <FormField label="Budget">
              <FormInput
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter budget amount"
                type="number"
              />
            </FormField>
          </FormFieldBlock>

          <FormFieldBlock>
            <FormField label="Description">
              <FormTextarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description"
                rows={4}
              />
            </FormField>
          </FormFieldBlock>
        </FormSection>

        <FormSection title="Research Team">
          <ResearchTeamTable
            formData={formData}
            setFormData={setFormData}
          />
        </FormSection>

        <FormSection title="File Attachments">
          <FileUploadField
            name="files"
            value={formData.files}
            onChange={handleChange}
            multiple
          />
        </FormSection>

        <div className="flex gap-4 pt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create Project" : "Update Project"}
          </Button>
          
          <Link href="/form/projects">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}