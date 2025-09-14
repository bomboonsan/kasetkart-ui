"use client";

import { useEffect, useState } from "react";
import { FormSection, FormFieldBlock, FormField } from "@/components/ui";
import { FormInput } from "@/components/ui";
import FormRadio from "@/components/FormRadio";
import { FormTextarea } from "@/components/ui";
import { FormDateSelect } from "@/components/ui";
import { FormSelect } from "@/components/ui";
import FileUploadField from "@/components/FileUploadField";
import ResearchTeamTable from "@/components/ResearchTeamTable";
import { Button } from "@/components/ui";
import Link from "next/link";
import dynamic from "next/dynamic";
const SweetAlert2 = dynamic(() => import("react-sweetalert2"), { ssr: false });
import { projectAPI } from "@/lib/api";
import { api } from "@/lib/api-base";
import { authAPI, valueFromAPI } from "@/lib/api";
import { stripUndefined } from "@/utils";
import useSWR, { mutate } from "swr";
import { createHandleChange } from "@/utils";

export default function ProjectForm({
  mode = "create",
  projectId: propProjectId,
  workId,
}) {
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
  ////////////////////////////////////////////////////////
  // End setup form fields
  ////////////////////////////////////////////////////////

  const [swalProps, setSwalProps] = useState({});

  // Align form keys to Project model in schema.prisma
  const [formData, setFormData] = useState({
    fiscalYear: "2568", // ปีงบประมาณ (Int)
    projectType: null, // ประเภทโครงการ (Int)
    projectMode: null, // ลักษณะโครงการวิจัย (Int)
    subProjectCount: null, // จำนวนโครงการย่อย (Int)
    nameTH: null, // ชื่อโครงการ (ภาษาไทย) (String) - fixed field name
    nameEN: null, // ชื่อโครงการ (ภาษาอังกฤษ) (String)

    isEnvironmentallySustainable: null, // เกี่ยวข้องกับสิ่งแวดล้อมและความยั่งยืน (Int) 0=เกี่ยวข้อง, 1=ไม่เกี่ยวข้อง
    durationStart: null, // ระยะเวลาการทำวิจัย (Date)
    durationEnd: null, // ระยะเวลาการทำวิจัย (Date)

    researchKind: null, // ประเภทงานวิจัย (Int) Value จาก select
    fundType: null, // ประเภทแหล่งทุน (Int) Value จาก select
    fundSubType: null, // ประเภทแหล่งทุน (Int) Value จาก select
    fundName: null, // ชื่อแหล่งทุน (String)
    budget: null, // งบวิจัย (Int)
    keywords: null, // คำสำคัญ (คั่นระหว่างคำด้วยเครื่องหมาย “;” เช่น ข้าว; พืช; อาหาร) (String)
    icTypes: null, // IC Types // Relationship (Int)
    impact: null, // Impact // Relationship (Int)
    sdg: null, // SDG // Relationship (Int)

    // ProjectPartner-like fields for the team section
    isInternal: null, // ProjectPartner.isInternal (Boolean)
    fullname: null, // ProjectPartner.fullname (String) - legacy
    partnerFullName: null, // ใช้ร่วมกับ ResearchTeamTable ให้เติมจาก UserPicker อัตโนมัติ
    orgName: null, // ProjectPartner.orgName (String)
    partnerType: null, // ProjectPartner.partnerType (String)
    partnerComment: null, // ProjectPartner.partnerComment (String)
    partnerProportion: null, // ProjectPartner.partnerProportion (Int)
    attachments: [],
  });

  const [orgOptions, setOrgOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [meData, setMeData] = useState(null);

  const [realProjectId, setRealProjectId] = useState(null);

  // ถ้าเป็นโหมดแก้ไข ให้โหลดข้อมูลโครงการจาก API และเติมค่าใน formData
  useEffect(() => {
    async function loadProjectForEdit() {
      if (mode !== "edit" || !projectId) return;
      try {
        const resp = await projectAPI.getProject(projectId);
        const project = resp?.data || resp || null;
        /* debug removed */
        if (!project) return;
        console.log("Loaded project for edit:", project.documentId);
        setRealProjectId(project.documentId);

        // โครงสร้างอาจเป็น Strapi v5 shape: { data: { id, attributes: {...} } }
        const attrs =
          project.data && project.data.attributes
            ? project.data.attributes
            : project.attributes || project;

        // เติมค่า formData โดยตรง (เฉพาะฟิลด์ที่มีอยู่)
        setFormData((prev) => ({
          ...prev,
          fiscalYear: attrs.fiscalYear ?? prev.fiscalYear,
          projectType: attrs.projectType ?? prev.projectType,
          projectMode: attrs.projectMode ?? prev.projectMode,
          subProjectCount: attrs.subProjectCount ?? prev.subProjectCount,
          isEnvironmentallySustainable: attrs.isEnvironmentallySustainable ?? prev.isEnvironmentallySustainable,
          nameTH: attrs.nameTH ?? prev.nameTH,
          nameEN: attrs.nameEN ?? prev.nameEN,
          durationStart: attrs.durationStart ?? prev.durationStart,
          durationEnd: attrs.durationEnd ?? prev.durationEnd,
          researchKind: attrs.researchKind ?? prev.researchKind,
          fundType:
            attrs.fundType !== undefined
              ? String(attrs.fundType)
              : prev.fundType,
          fundSubType:
            attrs.fundSubType !== undefined
              ? String(attrs.fundSubType)
              : prev.fundSubType,
          fundName: attrs.fundName ?? prev.fundName,
          budget: attrs.budget ?? prev.budget,
          keywords: attrs.keywords ?? prev.keywords,
          icTypes:
            attrs.ic_types && attrs.ic_types.data && attrs.ic_types.data[0]
              ? String(attrs.ic_types.data[0].id)
              : attrs.ic_types &&
                Array.isArray(attrs.ic_types) &&
                attrs.ic_types[0]
                ? String(attrs.ic_types[0].id || attrs.ic_types[0])
                : prev.icTypes,
          impact:
            attrs.impacts && attrs.impacts.data && attrs.impacts.data[0]
              ? String(attrs.impacts.data[0].id)
              : attrs.impacts &&
                Array.isArray(attrs.impacts) &&
                attrs.impacts[0]
                ? String(attrs.impacts[0].id || attrs.impacts[0])
                : prev.impact,
          sdg:
            attrs.sdgs && attrs.sdgs.data && attrs.sdgs.data[0]
              ? String(attrs.sdgs.data[0].id)
              : attrs.sdgs && Array.isArray(attrs.sdgs) && attrs.sdgs[0]
                ? String(attrs.sdgs[0].id || attrs.sdgs[0])
                : prev.sdg,
        }));

        // attachments: ตัดเฉพาะ id ของ media
        const atts =
          attrs.attachments && attrs.attachments.data
            ? attrs.attachments.data.map((a) => ({
              id: a.id,
              url: a.attributes?.url || a.url,
            }))
            : attrs.attachments || [];
        if (atts.length > 0) {
          setFormData((prev) => ({ ...prev, attachments: atts }));
        }

        // partners: ตั้งค่า partnersLocal ผ่าน setFormData เพื่อให้ ResearchTeamTable รับค่าไปแสดง
        const partners =
          attrs.research_partners && attrs.research_partners.data
            ? attrs.research_partners.data
            : attrs.research_partners || [];
        if (partners && partners.length > 0) {
          const norm = partners.map((item) => {
            const p = item.attributes || item;
            return {
              id: item.id || p.id,
              fullname: p.fullname || p.name || "",
              orgName: p.orgName || p.org || "",
              partnerType: p.participant_type || p.partnerType || "",
              isInternal: !!p.users_permissions_user || !!p.userID || false,
              userID:
                p.users_permissions_user?.data?.id ||
                p.users_permissions_user ||
                p.userID ||
                undefined,
              partnerComment:
                (p.isFirstAuthor ? "First Author" : "") +
                (p.isCoreespondingAuthor ? " Corresponding Author" : ""),
              partnerProportion:
                p.participation_percentage !== undefined
                  ? String(p.participation_percentage)
                  : undefined,
              partnerProportion_percentage_custom:
                p.participation_percentage_custom !== undefined
                  ? String(p.participation_percentage_custom)
                  : undefined,
            };
          });
          setFormData((prev) => ({ ...prev, partnersLocal: norm }));
        }
      } catch (err) {
        // do not throw; allow user to edit with defaults
      }
    }
    loadProjectForEdit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, projectId]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const me = await authAPI.me();
  //     setMeData(me);

  //     // // Auto-add current user เป็น partner หัวหน้าโครงการ
  //     // if (me && !formData.partnersLocal) {
  //     //   const mePartner = {
  //     //     isInternal: true,
  //     //     userID: me.id,
  //     //     fullname:
  //     //       (me.profile
  //     //         ? `${me.profile.firstNameTH || me.profile.firstName || ""} ${me.profile.lastNameTH || me.profile.lastName || ""}`
  //     //         : me.Profile
  //     //           ? `${me.Profile.firstNameTH || me.Profile.firstName || ""} ${me.Profile.lastNameTH || me.Profile.lastName || ""}`
  //     //           : me.email) || "",
  //     //     orgName:
  //     //       me.faculty?.name ||
  //     //       me.department?.name ||
  //     //       me.organization?.name ||
  //     //       "",
  //     //     partnerType: "หัวหน้าโครงการ",
  //     //     partnerComment: "",
  //     //     partnerProportion: "1.00",
  //     //   };
  //     //   setFormData((prev) => ({ ...prev, partnersLocal: [mePartner] }));
  //     // }
  //   };
  //   fetchData();
  // }, []);
  // หมายเหตุ: ตัด log debug ออกเพื่อความสะอาดของโค้ด

  const [subFundType, setSubFundType] = useState([]);
  const subFundType1 = [
    { value: "", label: "เลือกข้อมูล" },
    { value: "19", label: "องค์กรรัฐ" },
    { value: "20", label: "องค์กรอิสระและเอกชน" },
    { value: "21", label: "แหล่งทุนต่างประเทศ" },
    { value: "23", label: "รัฐวิสาหกิจ" },
  ];
  const subFundType2 = [
    { value: "", label: "เลือกข้อมูล" },
    { value: "17", label: "เงินรายได้มหาวิทยาลัย" },
    { value: "18", label: "เงินรายได้ส่วนงาน" },
  ];
  const subFundType3 = [
    { value: "", label: "เลือกข้อมูล" },
    { value: "22", label: "เงินทุนส่วนตัว" },
  ];
  const subFundType4 = [
    { value: "", label: "เลือกข้อมูล" },
    {
      value: "14",
      label: "เงินอุดหนุนรัฐบาลและเงินอุดหนุนอื่นที่รัฐบาลจัดสรรให้",
    },
    { value: "15", label: "เงินงบประมาณมหาวิทยาลัย" },
  ];

  useEffect(() => {
    setSubFundType([]);
    if (formData.fundType === "12") {
      setSubFundType(subFundType1);
    } else if (formData.fundType === "11") {
      setSubFundType(subFundType2);
    } else if (formData.fundType === "13") {
      setSubFundType(subFundType3);
    } else if (formData.fundType === "10") {
      setSubFundType(subFundType4);
    } else {
      setSubFundType([]);
    }
  }, [formData.fundType]);

  useEffect(() => {
    // Mock data แทน API calls
    const mockOrgs = [
      { id: 1, name: "มหาวิทยาลัยเกษตรศาสตร์" },
      { id: 2, name: "จุฬาลงกรณ์มหาวิทยาลัย" },
    ];
    const mockDepts = [
      { id: 1, name: "ภาควิชาเศรษฐศาสตร์" },
      { id: 2, name: "ภาควิชาการบัญชี" },
    ];

    const orgOpts = mockOrgs.map((o) => ({ value: o.id, label: o.name }));
    const deptOpts = mockDepts.map((d) => ({ value: d.id, label: d.name }));
    setOrgOptions(orgOpts);
    setDeptOptions(deptOpts);
  }, []);

  function isEmptyValue(v) {
    // ว่างจริง: undefined หรือ null
    if (v === undefined || v === null) return true;

    // สตริงว่างหลัง trim
    if (typeof v === "string") return v.trim() === "";

    // อาเรย์ว่าง
    if (Array.isArray(v)) return v.length === 0;

    // ตัวเลข: อนุญาต 0 แต่ไม่อนุญาต NaN
    if (typeof v === "number") return Number.isNaN(v);

    // อ็อบเจ็กต์: ถือว่าไม่ว่าง (ปรับตามต้องการ)
    return false;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {

      const required = [
        ["projectType", "ประเภทโครงการ"],
        ["projectMode", "ลักษณะโครงการวิจัย"],
        ["nameTH", "ชื่อโครงการ (ไทย)"],
        ["nameEN", "ชื่อโครงการ (อังกฤษ)"],
        ["durationStart", "วันที่เริ่มต้น"],
        ["durationEnd", "วันที่สิ้นสุด"],
        ["budget", "งบวิจัย"],
        ["keywords", "คำสำคัญ"],
        // คอมเมนต์ (ไทย): บังคับเลือกความสัมพันธ์ M2M เพื่อให้บันทึกได้ครบถ้วน
        // สอดคล้องกับ requirement: ic_types, impacts, sdgs ต้องบันทึกได้จริง
        ["icTypes", "IC Types"],
        ["impact", "Impact"],
        ["sdg", "SDG"],
      ];
      // const missing = required.filter(
      //   ([k]) => !formData[k] || String(formData[k]).trim() === null,
      // );

      const missing = required.filter(([k]) => isEmptyValue(formData[k]));

      console.log("Missing required fields:", missing);
      if (missing.length > 0) {
        const msg = `กรุณากรอก: ${missing.map(([, label]) => label).join(", ")}`;
        setError(msg);
        setSwalProps({
          show: true,
          icon: "warning",
          title: "ข้อมูลไม่ครบถ้วน",
          text: msg,
          timer: 2400,
        });
        setSubmitting(false);
        return;
      }
      // Load current authenticated user to be project leader
      let meObj = null;
      try {
        const meResp = await authAPI.me();
        meObj = meResp?.data || meResp || null;
      } catch (e) {
        // proceed without explicit leader user; do not log to console
      }

      // สร้าง partner สำหรับผู้กรอกฟอร์ม (current user) เป็น หัวหน้าโครงการ
      const mePartner = null;
      // const mePartner = meObj
      //   ? {
      //     isInternal: true,
      //     userId: meObj.id || meObj?.data?.id,
      //     fullname:
      //       (meObj.profile
      //         ? `${meObj.profile.firstNameTH || meObj.profile.firstName || ""} ${meObj.profile.lastNameTH || meObj.profile.lastName || ""}`
      //         : meObj.Profile
      //           ? `${meObj.Profile.firstNameTH || meObj.Profile.firstName || ""} ${meObj.Profile.lastNameTH || meObj.Profile.lastName || ""}`
      //           : meObj.email) || "",
      //     orgName:
      //       meObj.faculty?.name ||
      //       meObj.department?.name ||
      //       meObj.organization?.name ||
      //       "",
      //     partnerType: "หัวหน้าโครงการ",
      //     partnerComment: "",
      //     partnerProportion: undefined,
      //   }
      //   : null;

      // prefer partners provided by ResearchTeamTable if present, otherwise construct from me
      let partnersArray = [];
      if (
        Array.isArray(formData.partnersLocal) &&
        formData.partnersLocal.length > 0
      ) {
        // ใช้ partners จาก ResearchTeamTable
        partnersArray = formData.partnersLocal.map((p) => ({ ...p }));
        // ถ้าไม่มี current user ใน partners แล้วให้เพิ่มเข้าไป
        const hasMe = partnersArray.some(
          (p) => p.userId === meObj?.id || p.userID === meObj?.id,
        );
        if (mePartner && !hasMe) {
          // partnersArray.unshift(mePartner); // เพิ่มที่ตำแหน่งแรก
        }
      } else {
        // ถ้าไม่มี partners จาก ResearchTeamTable ให้ใช้แค่ current user
        // if (mePartner) partnersArray.push(mePartner);
      }

      // Map to API payload matching Strapi content-type `project-research`
      // Only include fields that exist in the schema
      const payload = {
        fiscalYear: parseInt(formData.fiscalYear) || 2568,
        projectType: formData.projectType || 0,
        projectMode: formData.projectMode || 0,
        subProjectCount: formData.subProjectCount
          ? parseInt(formData.subProjectCount)
          : undefined,
        // แก้ไขฟิลด์ชื่อโครงการภาษาไทยให้ส่งตรงกับ schema (nameTH)
        isEnvironmentallySustainable: Number(formData.isEnvironmentallySustainable) || 0,
        nameTH: formData.nameTH || undefined,
        nameEN: formData.nameEN || undefined,
        durationStart: formData.durationStart || undefined,
        durationEnd: formData.durationEnd || undefined,
        fundType: formData.fundType ? parseInt(formData.fundType) : undefined,
        researchKind: formData.researchKind ? parseInt(formData.researchKind) : undefined,
        fundSubType: formData.fundSubType
          ? parseInt(formData.fundSubType)
          : undefined,
        fundName: formData.fundName || undefined,
        budget: formData.budget ? String(formData.budget) : undefined,
        keywords: formData.keywords || undefined,
        // คอมเมนต์ (ไทย): ผูกความสัมพันธ์ M2M ตาม schema ของ Strapi v5
        // UX ตอนนี้เป็น single select แต่ API ต้องส่งเป็น array ของ id
        // ic_types: formData.icTypes ? [Number(formData.icTypes)] : undefined,
        ic_types: formData.icTypes
          ? [{ id: Number(formData.icTypes) }]
          : undefined,
        impacts: formData.impact
          ? [{ id: Number(formData.impact) }]
          : undefined,
        sdgs: formData.sdg ? [{ id: Number(formData.sdg) }] : undefined,
        // Include attachments if any files were uploaded
        attachments:
          Array.isArray(formData.attachments) && formData.attachments.length > 0
            ? formData.attachments
              .map((att) => att.id || att.documentId)
              .filter(Boolean)
            : undefined,
      };

      // คอมเมนต์ (ไทย): ใช้ endpoint ใหม่ที่รองรับ M2M relations แทนการทำ 2 ขั้นตอน
      // หมายเหตุ: endpoint /project-researches/create-with-relations จัดการ M2M ให้อัตโนมัติ
      // สรุปสั้นๆ: เปลี่ยนจาก create + update เป็น createWithRelations ขั้นเดียว
      // --------------------------------------------------------------
      // Create project with M2M relations on backend
      // debug payload
      console.log("Submitting payload:", payload, "with partners:", partnersArray);
      let createdProjectId
      if (mode === "edit") {
        // Edit mode: update existing project
        console.log("Updating existing project ID:", realProjectId);
        const resp = await projectAPI.updateProject(realProjectId, { ...payload })
        createdProjectId = resp?.data?.id || resp?.id || null;

        if (!createdProjectId) {
          throw new Error("ไม่สามารถอัปเดตโครงการได้ (no id returned)");
        }

        // IMPORTANT: Remove existing project-partners of this project to prevent duplicates
        try {
          const existingPartners = await api.get(`/project-partners?filters[project_researches][documentId][$eq]=${realProjectId}`)
          const partnersToDelete = existingPartners?.data || []
          for (const partner of partnersToDelete) {
            await api.delete(`/project-partners/${partner.documentId || partner.id}`)
          }
        } catch (delErr) {
          // Don't block submit; continue to recreate latest list
        }

      } else {
        const resp = await projectAPI.createProjectWithRelations(payload);
        // parse created id from Strapi response shape
        createdProjectId =
          resp?.data?.id ||
          resp?.id ||
          (resp?.data && resp.data.documentId) ||
          null;

        if (!createdProjectId) {
          throw new Error("ไม่สามารถสร้างโครงการได้ (no id returned)");
        }
      }


      // Helper: map partnerType label -> integer for backend `participant_type`
      const partnerTypeMap = {
        หัวหน้าโครงการ: 1,
        ที่ปรึกษาโครงการ: 2,
        ผู้ประสานงาน: 3,
        นักวิจัยร่วม: 4,
        อื่นๆ: 99,
      };

      // สร้างข้อมูล project-partner สำหรับสมาชิกแต่ละคน
      // For edit, use realProjectId (documentId) for relations; for create, use createdProjectId
      const targetProjectIdForRelations = mode === 'edit' ? (realProjectId || createdProjectId) : createdProjectId
      const partnerErrors = [];
      for (let i = 0; i < partnersArray.length; i++) {
        const p = partnersArray[i]
        // หมายเหตุ: Normalize ชื่อคีย์จากตาราง (userID vs userId, partnerComment vs comment)
        const userIdField = p.userId || p.userID || p.User?.id || undefined;
        const commentField = p.partnerComment || p.comment || "";
        const fullnameField = p.fullname || p.partnerFullName || "";
        const orgField = p.orgName || p.org || p.orgFullName || "";
        const proportionField =
          p.partnerProportion !== undefined && p.partnerProportion !== null
            ? parseFloat(p.partnerProportion)
            : undefined;
        const proportionCustomField =
          p.partnerProportion_percentage_custom !== undefined &&
            p.partnerProportion_percentage_custom !== ""
            ? parseFloat(p.partnerProportion_percentage_custom)
            : undefined;

        const partnerData = stripUndefined({
          fullname: fullnameField || undefined,
          orgName: orgField || undefined,
          participation_percentage: proportionField,
          participation_percentage_custom: proportionCustomField,
          participant_type: partnerTypeMap[p.partnerType] || undefined,
          isFirstAuthor: String(commentField).includes("First Author") || false,
          isCoreespondingAuthor:
            String(commentField).includes("Corresponding Author") || false,
          users_permissions_user: userIdField,
          project_researches: [targetProjectIdForRelations],
          order: i,
        });

        try {
          await api.post("/project-partners", { data: partnerData });
        } catch (err) {
          // collect partner creation errors silently
          partnerErrors.push({
            partner: partnerData,
            error: err?.message || String(err),
          });
        }
      }

      setSwalProps({
        show: true,
        icon: "success",
        title: { edit: "อัปเดตโครงการสำเร็จ", create: "สร้างโครงการสำเร็จ" }[mode] || "Success",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message || "บันทึกโครงการไม่สำเร็จ");
      setSwalProps({
        show: true,
        icon: "error",
        title: "บันทึกโครงการไม่สำเร็จ",
        text: err.message || "",
        timer: 2200,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ใช้ helper มาตรฐานสำหรับอัปเดตค่าในฟอร์ม (ลดโค้ดซ้ำ)
  const handleInputChange = createHandleChange(setFormData);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      <form noValidate onSubmit={handleSubmit} className="p-6 space-y-8">
        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
          </div>
        )}
        {/* Basic Information */}
        <FormSection>
          <FormFieldBlock>
            <FormInput
              mini={true}
              label="ปีงบประมาณ"
              type="number"
              value={formData.fiscalYear}
              onChange={(value) =>
                handleInputChange("fiscalYear", parseInt(value))
              }
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
              onChange={(value) =>
                handleInputChange("projectType", parseInt(value))
              }
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
              onChange={(value) =>
                handleInputChange("projectMode", parseInt(value))
              }
            />
          </FormFieldBlock>

          <FormFieldBlock className="grid grid-cols-1 gap-6">
            <FormInput
              mini={true}
              label="จำนวนโครงการย่อย"
              type="number"
              value={formData.projectMode !== 1 ? 0 : formData.subProjectCount}
              onChange={(value) =>
                handleInputChange("subProjectCount", parseInt(value))
              }
              placeholder="0"
              disabled={formData.projectMode === 1 ? false : true}
              className={`border border-gray-300 rounded-md p-2 ${formData.projectMode === 1 ? "" : "bg-gray-100 cursor-not-allowed"}`}
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
          </FormFieldBlock>

          <FormFieldBlock>
            <FormTextarea
              label="หน่วยงานหลักที่รับผิดชอบโครงการวิจัย (หน่วยงานที่ขอทุน)"
              className="bg-gray-100 cursor-not-allowed"
              value={`${meData?.department?.name || ""}  ${meData?.faculty?.name} ${meData?.organization?.name || ""}`}
            />
          </FormFieldBlock>

          <FormFieldBlock>
            <FormSelect
              label="ประเภทงานวิจัย"
              value={formData.researchKind}
              onChange={(value) => handleInputChange("researchKind", value)}
              className="max-w-lg"
              options={[
                { value: "", label: "เลือกประเภทงานวิจัย" },
                {
                  value: "1",
                  label: "การวิจัยพื้นฐานหรือการวิจัยบริสุทธิ์",
                },
                { value: "2", label: "การวิจัยประยุกต์" },
                { value: "3", label: "การวิจัยเชิงปฏิบัติ" },
                { value: "4", label: "การวิจัยและพัฒนา" },
                { value: "5", label: "การพัฒนาทดลอง" },
                {
                  value: "6",
                  label: "พื้นฐาน (basic Research)",
                },
                {
                  value: "7",
                  label: "พัฒนาและประยุกต์ (Development)",
                },
                {
                  value: "8",
                  label: "วิจัยเชิงปฏิบัติการ (Operational Research)",
                },
                {
                  value: "9",
                  label: "วิจัยทางคลินิก (Clinical Trial)",
                },
                {
                  value: "10",
                  label: "วิจัยต่อยอด (Translational research)",
                },
                {
                  value: "11",
                  label: "การขยายผลงานวิจัย (Implementation)",
                },
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
                { value: "", label: "เลือกข้อมูล" },
                {
                  value: "10",
                  label:
                    "เงินอุดหนุนรัฐบาลและเงินอุดหนุนอื่นที่รัฐบาลจัดสรรให้",
                },
                { value: "11", label: "เงินรายได้มหาวิทยาลัยและส่วนงาน" },
                { value: "12", label: "แหล่งทุนภายนอกมหาวิทยาลัย" },
                { value: "13", label: "เงินทุนส่วนตัว" },
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
            {formData.fundType !== "13" && (
              <FormSelect
                label="ชื่อแหล่งทุน"
                required
                value={formData.fundName}
                onChange={(value) => handleInputChange("fundName", value)}
                className="max-w-lg"
                options={[
                  { value: "", label: "เลือกชื่อแหล่งทุน" },
                  {
                    value: "สำนักงานคณะกรรมการวิจัยแห่งชาติ",
                    label: "สำนักงานคณะกรรมการวิจัยแห่งชาติ",
                  },
                  {
                    value: "สำนักงานกองทุนสนับสนุนการวิจัย",
                    label: "สำนักงานกองทุนสนับสนุนการวิจัย",
                  },
                  {
                    value: "สำนักงานคณะกรรมการการอุดมศึกษา",
                    label: "สำนักงานคณะกรรมการการอุดมศึกษา",
                  },
                  {
                    value: "สำนักงานพัฒนาการวิจัยการเกษตร (สวก.)",
                    label: "สำนักงานพัฒนาการวิจัยการเกษตร (สวก.)",
                  },
                  {
                    value: "สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ",
                    label: "สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ",
                  },
                  {
                    value:
                      "ศูนย์เทคโนโลยีโลหะและวัสดุแห่งชาติ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ",
                    label:
                      "ศูนย์เทคโนโลยีโลหะและวัสดุแห่งชาติ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ",
                  },
                  {
                    value:
                      "ศูนย์พันธุวิศวกรรมและเทคโนโลยีชีวภาพแห่งชาติ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ",
                    label:
                      "ศูนย์พันธุวิศวกรรมและเทคโนโลยีชีวภาพแห่งชาติ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ",
                  },
                  {
                    value: "ศูนย์นาโนเทคโนโลยีแห่งชาติ",
                    label: "ศูนย์นาโนเทคโนโลยีแห่งชาติ",
                  },
                  {
                    value: "กระทรวงวิทยาศาสตร์และเทคโนโลยี",
                    label: "กระทรวงวิทยาศาสตร์และเทคโนโลยี",
                  },
                  {
                    value: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร",
                    label: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร",
                  },
                  { value: "มูลนิธิชัยพัฒนา", label: "มูลนิธิชัยพัฒนา" },
                  { value: "มูลนิธิโครงการหลวง", label: "มูลนิธิโครงการหลวง" },
                  {
                    value: "มูลนิธิเพื่อการส่งเสริมวิทยาศาสตร์ ประเทศไทย",
                    label: "มูลนิธิเพื่อการส่งเสริมวิทยาศาสตร์ ประเทศไทย",
                  },
                  {
                    value: "กองทุนสิ่งแวดล้อม สำนักงานนโยบายและแผนสิ่งแวดล้อม",
                    label: "กองทุนสิ่งแวดล้อม สำนักงานนโยบายและแผนสิ่งแวดล้อม",
                  },
                  {
                    value:
                      "กองทุนสนับสนุนการวิจัย ร่วมกับสำนักงานคณะกรรมการการอุดมศึกษา",
                    label:
                      "กองทุนสนับสนุนการวิจัย ร่วมกับสำนักงานคณะกรรมการการอุดมศึกษา",
                  },
                  {
                    value:
                      "ทุนอุดหนุนวิจัยภายใต้โครงการความร่วมมือระหว่างไทย-ญี่ปุ่น (NRCT-JSPS)",
                    label:
                      "ทุนอุดหนุนวิจัยภายใต้โครงการความร่วมมือระหว่างไทย-ญี่ปุ่น (NRCT-JSPS)",
                  },
                  { value: "อื่นๆ", label: "อื่นๆ" },
                ]}
              />
            )}

            <FormTextarea
              label={formData.fundType === "13" ? "ชื่อแหล่งทุน" : ""}
              value={
                formData.fundType === "13"
                  ? "เงินทุนส่วนตัว"
                  : formData.fundName
              }
              onChange={(value) => handleInputChange("fundName", value)}
              disabled={formData.fundName === "อื่นๆ" ? false : true}
              className={`border border-gray-300 rounded-md p-2 ${formData.fundName === "อื่นๆ" ? "" : "bg-gray-100 cursor-not-allowed"}`}
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
              options={[
                { value: "", label: "เลือกข้อมูล" },
                ...icTypesLists.map((ic) => ({
                  value: String(ic.id),
                  label: ic.name,
                })),
              ]}
            />

            <FormSelect
              label="Impact"
              required
              value={formData.impact}
              onChange={(value) => handleInputChange("impact", value)}
              className="max-w-lg"
              options={[
                { value: "", label: "เลือกข้อมูล" },
                ...impactLists.map((ic) => ({
                  value: String(ic.id),
                  label: ic.name,
                })),
              ]}
            />

            <FormSelect
              label="SDG"
              required
              value={formData.sdg}
              onChange={(value) => handleInputChange("sdg", value)}
              className="max-w-lg"
              options={[
                { value: "", label: "เลือกข้อมูล" },
                ...sdgLists.map((ic) => ({
                  value: String(ic.id),
                  label: ic.name,
                })),
              ]}
            />
          </FormFieldBlock>
        </FormSection>

        <div className="p-4 rounded-md border shadow border-gray-200/70">
          <FormSection title="* ผู้ร่วมวิจัย">
            <ResearchTeamTable
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          </FormSection>
        </div>

        <FormSection>
          <FileUploadField
            label="อัปโหลดไฟล์"
            onFilesChange={(attachments) =>
              handleInputChange("attachments", attachments)
            }
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
            {submitting ? "Submitting..." : "Submits"}
          </Button>
        </div>
      </form>
    </div>
  );
}
