// โมดูล Profile API (ปรับให้ใช้ GraphQL แทน REST API)
import { profileAPI as profileAPIGraphQL } from "../graphql/apis/profile.js";
import { api, API_BASE } from "../api-base";
import { getDocumentId } from '../../utils/strapi/index.js';

// Re-export GraphQL-based profile API with same interface for backward compatibility
// หมายเหตุ (ไทย): ปรับแล้วให้ใช้ GraphQL แทน REST API ภายในเพื่อเชื่อมต่อ Strapi v5
export const profileAPI = profileAPIGraphQL;

export { API_BASE };
