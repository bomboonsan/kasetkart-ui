"use client";

import { useState, useEffect, useMemo } from "react";
import { Country, State, City } from "country-state-city";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
// ใช้ path alias (@/) เพื่อให้ import สั้นและชัดเจน
import { worksAPI, projectAPI, profileAPI } from "@/lib/api";
import { stripUndefined, getDocumentId, createHandleChange } from "@/utils";
import { FormSection, FormFieldBlock, FormField } from "@/components/ui";
import ProjectPicker from "@/components/ProjectPicker";
import FormInput from "@/components/FormInput";
import FormRadio from "@/components/FormRadio";
import { FormCheckbox } from "@/components/ui";
import { FormTextarea } from "@/components/ui";
import { FormDateSelect } from "@/components/ui";
import FormSelect from "@/components/FormSelect";
import FileUploadField from "@/components/FileUploadField";
import ResearchTeamTable from "@/components/ResearchTeamTable";
import { Button } from "@/components/ui";
import dynamic from "next/dynamic";
import { api } from "@/lib/api-base";
import { extractResearchTeam, applyTeamToProject } from "@/utils";
const SweetAlert2 = dynamic(() => import("react-sweetalert2"), { ssr: false });

// ฟังก์ชันช่วย map เป็น {value,label} สำหรับ FormSelect ของคุณ
const toOptions = (items, getValue, getLabel) =>
  [{ value: "", label: "เลือก" }, ...items.map(i => ({ value: getValue(i), label: getLabel(i) }))];

export default function CreateConferenceForm({
  mode = "create",
  workId,
  initialData,
}) {
  const router = useRouter();
  const [swalProps, setSwalProps] = useState({});

  // Helpers: map between UI labels/values and numeric codes used by backend
  const presentTypeCodeFromLabel = (v) => {
    if (v === 0 || v === 1 || v === 2) return v;
    switch (v) {
      case "ภาคบรรยาย (Oral)":
        return 0;
      case "ภาคโปสเตอร์ (Poster)":
        return 1;
      case "เข้าร่วมประชุมวิชาการ":
        return 2;
      default:
        return 0;
    }
  };
  const presentTypeLabelFromCode = (v) => {
    if (v === "ภาคบรรยาย (Oral)" || v === "ภาคโปสเตอร์ (Poster)" || v === "เข้าร่วมประชุมวิชาการ") return v;
    switch (Number(v)) {
      case 0:
        return "ภาคบรรยาย (Oral)";
      case 1:
        return "ภาคโปสเตอร์ (Poster)";
      case 2:
        return "เข้าร่วมประชุมวิชาการ";
      default:
        return "ภาคบรรยาย (Oral)";
    }
  };

  const articleTypeCodeFromLabel = (v) => {
    if (v === 0 || v === 1) return v;
    switch (v) {
      case "Abstract อย่างเดียว":
        return 0;
      case "เรื่องเต็ม":
        return 1;
      default:
        return 0;
    }
  };
  const articleTypeLabelFromCode = (v) => {
    if (v === "Abstract อย่างเดียว" || v === "เรื่องเต็ม") return v;
    switch (Number(v)) {
      case 0:
        return "Abstract อย่างเดียว";
      case 1:
        return "เรื่องเต็ม";
      default:
        return "Abstract อย่างเดียว";
    }
  };

  const levelCodeFromValue = (v) => {
    if (v === 0 || v === 1) return v;
    switch (v) {
      case "NATIONAL":
        return 0;
      case "INTERNATIONAL":
        return 1;
      default:
        return 0;
    }
  };
  const levelValueFromCode = (v) => {
    if (v === "NATIONAL" || v === "INTERNATIONAL") return v;
    switch (Number(v)) {
      case 0:
        return "NATIONAL";
      case 1:
        return "INTERNATIONAL";
      default:
        return "NATIONAL";
    }
  };

  // Form state aligned to work-conference schema
  const [formData, setFormData] = useState({
    project_research: null, // relation to project-research
    titleTH: null, // ชื่อผลงาน (ไทย)
    titleEN: null, // ชื่อผลงาน (อังกฤษ)
    isEnvironmentallySustainable: null, // เกี่ยวข้องกับสิ่งแวดล้อมและความยั่งยืน (Int) 0=เกี่ยวข้อง, 1=ไม่เกี่ยวข้อง
    journalName: null, // ชื่อการประชุมทางวิชาการ (ใช้ชื่อไทยถ้าไม่มีชื่อไทยให้ใช้ภาษาอื่น)
    doi: null, // DOI (ถ้าไม่มีให้ใส่ “-”) ความหมายของ DOI
    isbn: null, // ISBN (ป้อนอักษร 10 ตัว หรือ 13 ตัว ไม่ต้องใส่ “-”)
    durationStart: null, // ระยะเวลาการทำวิจัย (Date)
    durationEnd: null, // ระยะเวลาการทำวิจัย (Date)
    cost: null, // ค่าใช้จ่าย (Int)
    costType: null, // ค่าใช้จ่ายมาจาก  (Int) Value จาก select
    __projectObj: undefined, // สำหรับเก็บ object โครงการวิจัยที่เลือก
    presentationWork: null, // การนำเสนอผลงาน (Int) 0=ได้รับเชิญ (Invited Paper.), 1=เสนอเอง
    presentType: null, // ประเภทการนำเสนอ (Int) 0=ภาคบรรยาย (Oral), 1=ภาคโปสเตอร์ (Poster), 2=เข้าร่วมประชุมวิชาการ
    articleType: null, // ประเภทบทความ (Int) 0=Abstract อย่างเดียว, 1=เรื่องเต็ม
    abstractTH: null, // บทคัดย่อ (ไทย) (ไม่มีข้อมูลให้ใส่ “-”)
    abstractEN: null, // บทคัดย่อ (อังกฤษ) (ไม่มีข้อมูลให้ใส่ “-”)
    summary: null, // กรณีเข้าร่วมประชุมวิชาการ สรุปเนื้อหาการประชุมแบบย่อ(ถ้าไม่มีข้อมูลให้ใส่ -)
    keywords: null, // คำสำคัญ (คั่นระหว่างคำด้วยเครื่องหมาย “;” เช่น ข้าว; พืช; อาหาร)
    level: null, // ระดับ 0=ระดับชาติ, 1=ระดับนานาชาติ
    country: null, // รหัสประเทศ   (str) Value จาก select
    state: null, // รัฐ/จังหวัด   (str) Value จาก select
    city: null, // เมือง   (str) Value จาก select
    fundName: null, // ชื่อแหล่งทุน (String)
    attachments: [],
  });

  // debug
  console.log("Form data:", formData);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dynamic Country/State/City options (memoized)
  const countryOptions = useMemo(() => {
    try {
      const all = Country.getAllCountries() || [];
      return [
        { value: "", label: "เลือกประเทศ" },
        ...all.map((c) => ({ value: c.isoCode, label: c.name })),
      ];
    } catch (e) {
      return [{ value: "", label: "เลือกประเทศ" }];
    }
  }, []);

  const stateOptions = useMemo(() => {
    if (!formData.country) return [{ value: "", label: "เลือกมลรัฐ/จังหวัด" }];
    try {
      const states = State.getStatesOfCountry(String(formData.country)) || [];
      return [
        { value: "", label: "เลือกมลรัฐ/จังหวัด" },
        ...states.map((s) => ({ value: s.isoCode, label: s.name })),
      ];
    } catch (e) {
      return [{ value: "", label: "เลือกมลรัฐ/จังหวัด" }];
    }
  }, [formData.country]);

  const cityOptions = useMemo(() => {
    if (!formData.country || !formData.state) return [{ value: "", label: "เลือกเมือง" }];
    try {
      const cities = City.getCitiesOfState(
        String(formData.country),
        String(formData.state),
      ) || [];
      return [
        { value: "", label: "เลือกเมือง" },
        ...cities.map((c) => ({ value: c.name, label: c.name })),
      ];
    } catch (e) {
      return [{ value: "", label: "เลือกเมือง" }];
    }
  }, [formData.country, formData.state]);

  // Load current user for context
  const { data: userRes, error: userError } = useSWR("users/me", () =>
    profileAPI.getCurrentUser(),
  );

  // Load existing work when editing
  const { data: workRes, error: workError } = useSWR(
    mode === "edit" && workId ? ["work-conference", workId] : null,
    () => worksAPI.getConference(workId),
  );

  // Prefill when editing
  useEffect(() => {
    if (!workRes?.data) return;
    const work = workRes.data;
    setFormData((prev) => ({
      ...prev,
      // Project relation
      project_research: work.project_research?.id || work.project_research || "",
      __projectObj: work.project_research || prev.__projectObj,
      // Text fields
      titleTH: work.titleTH ?? "",
      titleEN: work.titleEN ?? "",
      journalName: work.journalName ?? "",
      doi: work.doi ?? "",
      isbn: work.isbn ?? "",
      abstractTH: work.abstractTH ?? "",
      abstractEN: work.abstractEN ?? "",
      summary: work.summary ?? "",
      keywords: work.keywords ?? "",
      fundName: work.fundName ?? "",
      // Dates
      durationStart: work.durationStart ? String(work.durationStart).slice(0, 10) : "",
      durationEnd: work.durationEnd ? String(work.durationEnd).slice(0, 10) : "",
      // Numbers / enums
      isEnvironmentallySustainable: Number(work.isEnvironmentallySustainable ?? prev.isEnvironmentallySustainable ?? 0),
      cost: work.cost ?? 0,
      costType: work.costType ?? "",
      presentationWork: Number(work.presentationWork ?? 0),
      presentType: presentTypeLabelFromCode(work.presentType),
      articleType: articleTypeLabelFromCode(work.articleType),
      level: levelValueFromCode(work.level),
      // Location (strings)
      country: work.country ?? "",
      state: work.state ?? "",
      city: work.city ?? "",
      // Files
      attachments: work.attachments || [],
    }));
  }, [workRes]);

  // Initialize local team from selected project
  useEffect(() => {
    const project = formData.__projectObj;
    if (!project) return;
    const team = extractResearchTeam(project);
    if (team.length > 0) {
      setFormData((prev) => ({ ...prev, partnersLocal: team }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.__projectObj?.id]);

  // Prefill from initialData when provided (useful for SSR or preloaded data)
  useEffect(() => {
    if (!initialData) return;
    const work = initialData;
    setFormData((prev) => ({
      ...prev,
      project_research: work.project_research?.id || work.project_research || "",
      __projectObj: work.project_research || prev.__projectObj,
      titleTH: work.titleTH ?? "",
      titleEN: work.titleEN ?? "",
      journalName: work.journalName ?? "",
      doi: work.doi ?? "",
      isbn: work.isbn ?? "",
      abstractTH: work.abstractTH ?? "",
      abstractEN: work.abstractEN ?? "",
      summary: work.summary ?? "",
      keywords: work.keywords ?? "",
      fundName: work.fundName ?? "",
      durationStart: work.durationStart ? String(work.durationStart).slice(0, 10) : "",
      durationEnd: work.durationEnd ? String(work.durationEnd).slice(0, 10) : "",
      isEnvironmentallySustainable: Number(work.isEnvironmentallySustainable ?? prev.isEnvironmentallySustainable ?? 0),
      cost: work.cost ?? 0,
      costType: work.costType ?? "",
      presentationWork: Number(work.presentationWork ?? 0),
      presentType: presentTypeLabelFromCode(work.presentType),
      articleType: articleTypeLabelFromCode(work.articleType),
      level: levelValueFromCode(work.level),
      country: work.country ?? "",
      state: work.state ?? "",
      city: work.city ?? "",
      attachments: work.attachments || [],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // console.log(formData.__projectObj.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Prepare payload aligned to work-conference schema
      const payload = {
        project_research: formData.__projectObj?.id || undefined,
        titleTH: formData.titleTH || undefined,
        titleEN: formData.titleEN || undefined,
        isEnvironmentallySustainable:
          Number(formData.isEnvironmentallySustainable) || 0,
        journalName: formData.journalName || undefined,
        doi: formData.doi || undefined,
        isbn: formData.isbn || undefined,
        durationStart: formData.durationStart || undefined,
        durationEnd: formData.durationEnd || undefined,
        cost: formData.cost !== "" && formData.cost !== null ? Number(formData.cost) : undefined,
        costType:
          formData.costType !== "" && formData.costType !== null
            ? Number(formData.costType)
            : undefined,
        presentationWork: Number(formData.presentationWork) || 0,
        presentType: presentTypeCodeFromLabel(formData.presentType),
        articleType: articleTypeCodeFromLabel(formData.articleType),
        abstractTH: formData.abstractTH || undefined,
        abstractEN: formData.abstractEN || undefined,
        summary: formData.summary || undefined,
        keywords: formData.keywords || undefined,
        level: levelCodeFromValue(formData.level),
        country:
          formData.country && String(formData.country).trim() !== ""
            ? String(formData.country)
            : undefined,
        state:
          formData.state && String(formData.state).trim() !== ""
            ? String(formData.state)
            : undefined,
        city:
          formData.city && String(formData.city).trim() !== ""
            ? String(formData.city)
            : undefined,
        fundName: formData.fundName || undefined,
        attachments: (formData.attachments || []).map((a) => ({ id: a.id })),
      };

      // Clean payload
      const cleanPayload = stripUndefined(payload);

      let result;
      if (mode === "edit" && workId) {
        // console.log(workId, cleanPayload);
        result = await worksAPI.updateConference(workId, cleanPayload);
        setSwalProps({
          show: true,
          icon: "success",
          title: "แก้ไขผลงานการประชุมสำเร็จ",
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        // console.log("payload", payload);
        result = await worksAPI.createConference(cleanPayload);
        setSwalProps({
          show: true,
          icon: "success",
          title: "สร้างผลงานการประชุมสำเร็จ",
          timer: 1600,
          showConfirmButton: false,
        });
      }

      // Sync research team back to ProjectResearch (truth source)
      try {
        const projectId = formData.__projectObj?.documentId || formData.__projectObj?.id;
        if (projectId && Array.isArray(formData.partnersLocal)) {
          // 1) Remove existing partners to avoid duplicates
          const existing = await api.get(`/project-partners?filters[project_researches][documentId][$eq]=${projectId}`);
          const items = existing?.data || [];
          for (const item of items) {
            const pid = item.documentId || item.id;
            if (pid) await api.delete(`/project-partners/${pid}`);
          }

          // 2) Recreate from local
          const typeMap = {
            "หัวหน้าโครงการ": 1,
            "ที่ปรึกษาโครงการ": 2,
            "ผู้ประสานงาน": 3,
            "นักวิจัยร่วม": 4,
            "อื่นๆ": 99,
          };

          for (let i = 0; i < formData.partnersLocal.length; i++) {
            const p = formData.partnersLocal[i];
            const partnerData = stripUndefined({
              fullname: p.fullname || p.partnerFullName || undefined,
              orgName: p.orgName || undefined,
              participation_percentage:
                p.partnerProportion !== undefined && p.partnerProportion !== ""
                  ? parseFloat(p.partnerProportion)
                  : undefined,
              participation_percentage_custom:
                p.partnerProportion_percentage_custom !== undefined && p.partnerProportion_percentage_custom !== ""
                  ? parseFloat(p.partnerProportion_percentage_custom)
                  : undefined,
              participant_type: typeMap[p.partnerType] || undefined,
              isFirstAuthor: String(p.partnerComment || "").includes("First Author"),
              isCoreespondingAuthor: String(p.partnerComment || "").includes("Corresponding Author"),
              users_permissions_user: p.userId || p.userID || p.User?.id,
              project_researches: [projectId],
              order: i,
            });
            await api.post("/project-partners", { data: partnerData });
          }
        }
      } catch (syncErr) {
        // Don't block conference save; just ignore
      }

      // Refresh data and navigate
      mutate("work-conferences");
      setTimeout(() => router.push("/form/overview"), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message || err?.message || "เกิดข้อผิดพลาด";
      setError(msg);
      setSwalProps({
        show: true,
        icon: "error",
        title: "บันทึกไม่สำเร็จ",
        text: msg,
        timer: 2200,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = createHandleChange(setFormData);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
          </div>
        )}
        {/* <FormSection>
          <FormFieldBlock>
            <ProjectPicker
              label="โครงการวิจัย"

              selectedProject={formData.__projectObj}
              onSelect={(project) => {
                handleInputChange('project_research', getDocumentId(project))
                handleInputChange('__projectObj', project)
              }}
            />
          </FormFieldBlock>
        </FormSection> */}

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
                  value="1"
                  checked={formData.isEnvironmentallySustainable == 1}
                  onChange={() =>
                    handleInputChange("isEnvironmentallySustainable", 1)
                  }
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
                  value="0"
                  checked={formData.isEnvironmentallySustainable == 0}
                  onChange={() =>
                    handleInputChange("isEnvironmentallySustainable", 0)
                  }
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
              value={formData.journalName}
              onChange={(value) => handleInputChange("journalName", value)}
              placeholder=""
            />
            <ProjectPicker
              label="โครงการวิจัย"
              selectedProject={formData.__projectObj}
              onSelect={(p) => {
                const ds = p.durationStart
                  ? String(p.durationStart).slice(0, 10)
                  : "";
                const de = p.durationEnd
                  ? String(p.durationEnd).slice(0, 10)
                  : "";
                setFormData((prev) => ({
                  ...prev,
                  projectId: String(p.id),
                  __projectObj: p,
                  // Prefill from Project
                  isEnvironmentallySustainable:
                    p.isEnvironmentallySustainable ??
                    prev.isEnvironmentallySustainable,
                  fundName: p.fundName || prev.fundName,
                  keywords: p.keywords || prev.keywords,
                  durationStart: ds || prev.durationStart,
                  durationEnd: de || prev.durationEnd,
                }));
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
                  onChange={(value) =>
                    handleInputChange("durationStart", value)
                  }
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
                <div className="flex gap-4 items-center">
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                    placeholder="0"
                    className={`
                  w-auto inline-block
          text-zinc-700
            px-3 py-2 border border-gray-300 rounded-md
            placeholder-gray-400 focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
          `}
                  />
                  <span className="text-gray-700">จาก</span>
                  <select
                    value={formData.costType}
                    onChange={(e) =>
                      handleInputChange("costType", e.target.value)
                    }
                    className="text-zinc-700
                                block w-auto px-3 py-2 border border-gray-300 rounded-md
                                bg-white focus:outline-none focus:ring-2
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200"
                  >
                    <option value={""}>-- กรุณาเลือก --</option>
                    <option value="1">เงินทุนส่วนตัว</option>
                    <option value="10">
                      เงินอุดหนุนรัฐบาลและเงินอุดหนุนอื่นที่รัฐบาลจัดสรรให้
                    </option>
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
              label="การนำเสนอผลงาน"
              options={[
                {
                  label: "ได้รับเชิญ (Invited Paper.)",
                  value: 0,
                },
                {
                  label: "เสนอเอง",
                  value: 1,
                },
              ]}
              value={formData.presentationWork}
              onChange={(value) =>
                handleInputChange("presentationWork", parseInt(value))
              }
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
              onChange={(value) => handleInputChange("presentType", value)}
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
              onChange={(value) => handleInputChange("articleType", value)}
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

          <FormFieldBlock>
            <FormTextarea
              label="กรณีเข้าร่วมประชุมวิชาการ สรุปเนื้อหาการประชุมแบบย่อ(ถ้าไม่มีข้อมูลให้ใส่ -)"
              value={formData.summary}
              onChange={(value) => handleInputChange("summary", value)}
              placeholder=""
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FileUploadField
              label="* ส่งไฟล์หลักฐาน (ขอให้ Scan หน้าปก สารบัญ และไฟล์เรื่องเต็ม ของการประชุม เพื่อการตรวจสอบหลักฐาน)"
              // ปรับให้รองรับการอัปโหลดไฟล์หลายครั้งแบบสะสม
              value={formData.attachments}
              onFilesChange={(attachments) =>
                handleInputChange("attachments", attachments)
              }
              accept=".pdf,.doc,.docx"
              multiple
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormRadio
              inline={true}
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
              value={formData.country}
              onChange={(value) => {
                handleInputChange("country", value);
                // reset state and city when country changes
                handleInputChange("state", "");
                handleInputChange("city", "");
              }}
              className="max-w-lg"
              options={countryOptions}
            />
            <FormSelect
              label="มลรัฐ/จังหวัด"
              value={formData.state}
              onChange={(value) => {
                handleInputChange("state", value);
                // reset city when state changes
                handleInputChange("city", "");
              }}
              className="max-w-lg"
              options={stateOptions}
            />
            <FormSelect
              label="เมือง"
              value={formData.city}
              onChange={(value) => handleInputChange("city", value)}
              className="max-w-lg"
              options={cityOptions}
            />
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
        </FormSection>

        {/* Research Team Section (Editable) */}
        {formData.__projectObj ? (
          <div className="p-4 rounded-md border shadow border-gray-200/70">
            <FormSection title="* ผู้ร่วมวิจัย">
              <ResearchTeamTable
                formData={formData}
                handleInputChange={handleInputChange}
                setFormData={setFormData}
              />
            </FormSection>
          </div>
        ) : (
          <div className="p-3 rounded bg-amber-50 text-amber-800 border border-amber-200">
            ต้องเลือกโครงการวิจัยก่อนจึงจะแก้ไขทีมวิจัยได้
            <div className="mt-2">
              <Button type="button" variant="outline" onClick={() => mutate(["work-conference", workId])}>
                ลองโหลดใหม่
              </Button>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" type="button">
            ยกเลิก
          </Button>

          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting
              ? "กำลังบันทึก..."
              : mode === "edit"
                ? "แก้ไข"
                : "บันทึก"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Component to display project partners
function ProjectPartnersDisplay({ project }) {
  const { data: partnersRes, error: partnersError } = useSWR(
    project ? ["project-partners", project.documentId || project.id] : null,
    () => projectAPI.getProjectPartners(project.documentId || project.id),
  );

  const partners = partnersRes?.data || partnersRes || [];

  if (partnersError) {
    return (
      <div className="text-sm text-gray-500">
        ไม่สามารถโหลดข้อมูลผู้ร่วมวิจัยได้
      </div>
    );
  }

  if (!partners.length) {
    return (
      <div className="text-sm text-gray-500">ไม่มีผู้ร่วมวิจัยในโครงการนี้</div>
    );
  }

  return (
    <div className="space-y-2">
      {partners.map((partner, idx) => (
        <div
          key={partner.documentId || partner.id || idx}
          className="flex items-center space-x-4 p-3 bg-gray-50 rounded"
        >
          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {partner.users_permissions_user
                ? `${partner.users_permissions_user.firstName || ""} ${partner.users_permissions_user.lastName || ""}`
                : partner.fullname || "ไม่ระบุชื่อ"}
            </div>
            <div className="text-sm text-gray-600">
              {partner.users_permissions_user?.email ||
                partner.orgName ||
                "ผู้ร่วมวิจัย"}
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
  );
}
