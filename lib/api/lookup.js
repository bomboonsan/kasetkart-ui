// โมดูล Lookup (orgAPI, eduAPI, valueFromAPI)
import { api } from "../api-base";
import { getDocumentId } from '../../utils/strapi'

export const orgAPI = {
  getOrganizations: () => api.get("/organizations?status=draft"),
  getFaculties: () => api.get("/faculties?status=draft"),
  getDepartments: () => api.get("/departments?status=draft"),
  getAcademicTypes: () => api.get("/academic-types?status=draft"),
  getEducationLevels: () => api.get("/education-levels?status=draft"),
  getAcademicType: () => api.get("/academic-types?status=draft"),
  getParticipationTypes: () => api.get("/participation-types?status=draft"),
};

export const eduAPI = {
  listMine: (userId) => {
    const params = new URLSearchParams();
    params.set("filters[users_permissions_user][id][$eq]", userId);
    params.set("populate", "education_level");
    params.set("status", "draft");
    return api.get(`/educations?${params.toString()}`);
  },
  create: (data) => api.post("/educations", { data }),
  update: (documentId, data) => api.put(`/educations/${getDocumentId(documentId)}`, { data }),
  remove: (documentId) => api.delete(`/educations/${getDocumentId(documentId)}`),
};

export const valueFromAPI = {
  getDepartments: () => api.get("/departments?status=draft"),
  getIcTypes: () => api.get("/ic-types?status=draft"),
  getImpacts: () => api.get("/impacts?status=draft"),
  getSDGs: () => api.get("/sdgs?status=draft"),
};
