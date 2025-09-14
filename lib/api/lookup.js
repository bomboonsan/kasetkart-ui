// โมดูล Lookup (orgAPI, eduAPI, valueFromAPI)
import { api } from "../api-base";

export const orgAPI = {
  getOrganizations: () => api.get("/organizations"),
  getFaculties: () => api.get("/faculties"),
  getDepartments: () => api.get("/departments"),
  getAcademicTypes: () => api.get("/academic-types"),
  getEducationLevels: () => api.get("/education-levels"),
  getAcademicType: () => api.get("/academic-types"),
  getParticipationTypes: () => api.get("/participation-types"),
};

export const eduAPI = {
  listMine: (userId) => {
    const params = new URLSearchParams();
    params.set("filters[users_permissions_user][id][$eq]", userId);
    params.set("populate", "education_level");
    params.set("publicationState", "preview");
    return api.get(`/educations?${params.toString()}`);
  },
  create: (data) => api.post("/educations", { data }),
  update: (documentId, data) => api.put(`/educations/${documentId}`, { data }),
  remove: (documentId) => api.delete(`/educations/${documentId}`),
};

export const valueFromAPI = {
  getDepartments: () => api.get("/departments"),
  getIcTypes: () => api.get("/ic-types"),
  getImpacts: () => api.get("/impacts"),
  getSDGs: () => api.get("/sdgs"),
};
