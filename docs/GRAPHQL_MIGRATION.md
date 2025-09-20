# GraphQL Migration Guide

This document outlines the migration from REST API to GraphQL implementation in the kasetkart-ui frontend.

## Overview

The entire frontend has been migrated from using REST API calls to GraphQL while maintaining backward compatibility and the same API interface structure.

## Changes Made

### 1. GraphQL Client Setup
- **Location**: `lib/graphql/client.js`
- **Features**: 
  - Configured GraphQL client using `graphql-request`
  - Dynamic token management integration
  - Error handling wrapper

### 2. GraphQL Queries & Mutations
- **Location**: `lib/graphql/queries/`
- **Modules**:
  - `user.js` - User and profile operations
  - `auth.js` - Authentication operations
  - `lookup.js` - Organizations, departments, education levels
  - `project.js` - Projects and funding operations
  - `works.js` - Books, conferences, publications
  
### 3. Updated API Modules
All API modules in `lib/api/` have been updated to use GraphQL:
- `profile.js` - Profile and user management
- `auth.js` - Authentication
- `admin.js` - User administration and file uploads
- `project.js` - Projects and funding
- `works.js` - Academic works
- `lookup.js` - Reference data
- `dashboard.js` - Dashboard statistics (mixed GraphQL/REST)

### 4. Component Updates
Key components updated to use GraphQL API modules:
- `components/UserManagement.js`
- `components/admin/user/AdminUserEditForm.js`
- `components/UserFilters.js`

## Technical Details

### GraphQL Endpoint
- **URL**: `{API_BASE}/graphql` (replaces `/api` with `/graphql`)
- **Client**: `graphql-request` library
- **Authentication**: Bearer token in Authorization header

### Backward Compatibility
- All API modules maintain the same function signatures
- Response formats preserved for existing components
- SWR integration remains unchanged

### Hybrid Approach
Some endpoints remain as REST API due to:
- File upload operations (`uploadAPI`)
- Custom dashboard endpoints
- Strapi admin endpoints (roles, custom relations)

## Usage Examples

### Before (REST):
```javascript
const users = await api.get('/users?populate=*')
```

### After (GraphQL):
```javascript
const users = await profileAPI.getUsers() // Now uses GraphQL internally
```

### Direct GraphQL Usage:
```javascript
import { executeGraphQL, GET_USERS } from '@/lib/graphql'

const result = await executeGraphQL(GET_USERS, { 
  pagination: { pageSize: 10 } 
})
```

## Benefits

1. **Type Safety**: GraphQL provides better type checking
2. **Efficient Queries**: Only request needed fields
3. **Single Endpoint**: All data operations through one endpoint
4. **Real-time**: Better support for subscriptions (future)
5. **Documentation**: Self-documenting schema

## Testing

The migration has been tested with:
- Successful Next.js build compilation
- All existing components maintained
- API module compatibility preserved

## Next Steps

1. Test with actual Strapi GraphQL backend
2. Optimize GraphQL queries for performance
3. Add GraphQL subscriptions for real-time updates
4. Remove any remaining direct REST API calls
5. Add GraphQL error boundary components

## Notes

- Google Fonts temporarily disabled due to network restrictions in build environment
- Some TypeScript warnings may appear during build (can be safely ignored)
- Custom Strapi endpoints may need manual GraphQL schema updates on backend