// โมดูล Works API (ปรับให้ใช้ GraphQL แทน REST API)
import { worksAPI as worksAPIGraphQL } from '../graphql/apis/works.js';

// Re-export GraphQL-based API with same interface for backward compatibility  
// หมายเหตุ (ไทย): ปรับแล้วให้ใช้ GraphQL แทน REST API ภายในเพื่อเชื่อมต่อ Strapi v5
export const worksAPI = worksAPIGraphQL;
