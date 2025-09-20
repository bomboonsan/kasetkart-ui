// โมดูล Admin (ปรับให้ใช้ GraphQL แทน REST API)
import { 
  userAPI as userAPIGraphQL, 
  uploadAPI as uploadAPIGraphQL 
} from '../graphql/apis/admin.js';

// Re-export GraphQL-based APIs with same interface for backward compatibility
// หมายเหตุ (ไทย): ปรับแล้วให้ใช้ GraphQL แทน REST API ภายในเพื่อเชื่อมต่อ Strapi v5
export const userAPI = userAPIGraphQL;
export const uploadAPI = uploadAPIGraphQL;
