// โมดูล authAPI (ปรับให้ใช้ GraphQL แทน REST API)
import { authAPI as authAPIGraphQL } from '../graphql/apis/auth.js';

// Re-export GraphQL-based API with same interface for backward compatibility
// หมายเหตุ (ไทย): ปรับแล้วให้ใช้ GraphQL แทน REST API ภายในเพื่อเชื่อมต่อ Strapi v5
// อย่างไรก็ตาม แอปส่วนใหญ่ใช้ NextAuth แทน authAPI นี้แล้ว
export const authAPI = authAPIGraphQL;
