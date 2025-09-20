// โมดูล Project / Funding API (ปรับให้ใช้ GraphQL แทน REST API)
import { 
  projectAPI as projectAPIGraphQL, 
  fundingAPI as fundingAPIGraphQL 
} from '../graphql/apis/project.js';

// Re-export GraphQL-based APIs with same interface for backward compatibility
// หมายเหตุ (ไทย): ปรับแล้วให้ใช้ GraphQL แทน REST API ภายในเพื่อเชื่อมต่อ Strapi v5
export const projectAPI = projectAPIGraphQL;
export const fundingAPI = fundingAPIGraphQL;
