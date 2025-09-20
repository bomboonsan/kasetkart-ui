// โมดูล Dashboard สถิติ (ปรับให้ใช้ GraphQL แทน REST API)
import { 
  dashboardAPI as dashboardAPIGraphQL, 
  reportAPI as reportAPIGraphQL 
} from '../graphql/apis/admin.js';

// Re-export GraphQL-based APIs with same interface for backward compatibility
// หมายเหตุ (ไทย): ปรับแล้วให้ใช้ GraphQL แทน REST API ภายในเพื่อเชื่อมต่อ Strapi v5
export const dashboardAPI = dashboardAPIGraphQL;
export const reportAPI = reportAPIGraphQL;
