// โมดูล Lookup (ปรับให้ใช้ GraphQL แทน REST API)
import { 
  orgAPI as orgAPIGraphQL, 
  eduAPI as eduAPIGraphQL, 
  valueFromAPI as valueFromAPIGraphQL 
} from '../graphql/apis/lookup.js';

// Re-export GraphQL-based APIs with same interface for backward compatibility
// หมายเหตุ (ไทย): ปรับแล้วให้ใช้ GraphQL แทน REST API ภายในเพื่อเชื่อมต่อ Strapi v5
export const orgAPI = orgAPIGraphQL;
export const eduAPI = eduAPIGraphQL;
export const valueFromAPI = valueFromAPIGraphQL;
