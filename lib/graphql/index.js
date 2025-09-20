// GraphQL APIs index - Central export for all GraphQL-based APIs
export { profileAPI as profileAPIGraphQL } from './apis/profile.js';
export { projectAPI as projectAPIGraphQL, fundingAPI as fundingAPIGraphQL } from './apis/project.js';
export { worksAPI as worksAPIGraphQL } from './apis/works.js';
export { userAPI as userAPIGraphQL, uploadAPI as uploadAPIGraphQL, dashboardAPI as dashboardAPIGraphQL, reportAPI as reportAPIGraphQL } from './apis/admin.js';
export { orgAPI as orgAPIGraphQL, eduAPI as eduAPIGraphQL, valueFromAPI as valueFromAPIGraphQL } from './apis/lookup.js';
export { authAPI as authAPIGraphQL } from './apis/auth.js';

// Re-export client and utilities for direct access
export { default as graphqlClient, graphqlAPI } from './api.js';
export { GraphQLErrorHandler } from './error-handler.js';
export * from './types.ts';
export * from './fragments.js';