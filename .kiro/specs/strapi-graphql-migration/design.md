# Design Document

## Overview

This design outlines the complete migration from REST API to GraphQL for Strapi connectivity. The current system uses a modular REST API architecture with separate modules for different domains (profile, project, works, admin, etc.). The migration will replace all REST endpoints with GraphQL queries and mutations while maintaining the same functionality and improving performance through optimized data fetching.

The migration will implement GraphQL best practices including proper query optimization, fragment usage, type safety with TypeScript, and comprehensive error handling. The design ensures zero downtime and maintains backward compatibility during the transition.

## Architecture

### Current REST Architecture
- **HTTP Client Layer**: `lib/http/client.js` - Generic HTTP client with token management
- **API Base Layer**: `lib/api-base.js` - Legacy API client wrapper
- **Domain API Modules**: Separate modules for each domain (profile, project, works, etc.)
- **Token Management**: `lib/auth/token-manager.js` - Centralized authentication
- **Error Handling**: `lib/http/error-handler.js` - Standardized error processing

### New GraphQL Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│                GraphQL Client Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Query Client  │  │ Mutation Client │  │ Type System │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                GraphQL Operations Layer                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Queries    │  │  Mutations  │  │     Fragments       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   Domain API Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Profile API │  │ Project API │  │    Works API        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                Infrastructure Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Auth Management │  │ Error Handling  │  │   Caching   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. GraphQL Client Configuration
**File**: `lib/graphql/client.js`
```javascript
interface GraphQLClientConfig {
  endpoint: string;
  headers: Record<string, string>;
  cache: CacheConfig;
  errorPolicy: 'none' | 'ignore' | 'all';
}

interface GraphQLClient {
  query<T>(query: string, variables?: Record<string, any>): Promise<T>;
  mutate<T>(mutation: string, variables?: Record<string, any>): Promise<T>;
  setHeaders(headers: Record<string, string>): void;
}
```

### 2. Query Builder
**File**: `lib/graphql/query-builder.js`
```javascript
interface QueryBuilder {
  buildQuery(operation: string, fields: string[], filters?: object): string;
  buildMutation(operation: string, input: object, returnFields: string[]): string;
  buildFragment(name: string, type: string, fields: string[]): string;
}
```

### 3. Type System
**File**: `lib/graphql/types.ts`
```typescript
interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
}

interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, any>;
}
```

### 4. Domain API Interfaces
Each domain API will maintain the same interface but use GraphQL internally:

**Profile API Interface**:
```javascript
interface ProfileAPI {
  getMyProfileSidebar(): Promise<UserProfile>;
  getMyProfile(): Promise<UserProfile>;
  getUserById(id: string): Promise<UserProfile>;
  updateProfile(id: string, data: ProfileData): Promise<UserProfile>;
  // ... other methods
}
```

## Data Models

### GraphQL Schema Mapping
The GraphQL operations will map to the existing Strapi content types:

1. **Users** (`users-permissions-user`)
   - Profile data with relations
   - Authentication and authorization
   - Role-based access control

2. **Profiles** (`profiles`)
   - User profile information
   - Avatar and personal data
   - Education and organization relations

3. **Projects** (`project-researches`)
   - Research project data
   - Partner relationships
   - Funding connections

4. **Works** (`work-books`, `work-conferences`, `work-publications`)
   - Academic publications
   - Conference presentations
   - Book publications

5. **Lookups** (Various lookup tables)
   - Organizations, faculties, departments
   - Education levels and types
   - Value lists and enumerations

### Fragment Definitions
Common fragments will be defined for reusable field selections:

```graphql
fragment UserBasic on UsersPermissionsUser {
  id
  documentId
  username
  email
  confirmed
  blocked
}

fragment ProfileComplete on Profile {
  id
  documentId
  firstName
  lastName
  avatarUrl {
    url
    alternativeText
  }
  organization {
    id
    name
  }
  faculty {
    id
    name
  }
  department {
    id
    name
  }
}

fragment ProjectBasic on ProjectResearch {
  id
  documentId
  title
  description
  startDate
  endDate
  status
}
```

## Error Handling

### GraphQL Error Processing
**File**: `lib/graphql/error-handler.js`

1. **Network Errors**: Connection issues, timeouts
2. **GraphQL Errors**: Query syntax, validation errors
3. **Authentication Errors**: Token expiration, unauthorized access
4. **Business Logic Errors**: Validation failures, constraint violations

```javascript
interface GraphQLErrorHandler {
  processGraphQLErrors(errors: GraphQLError[]): ProcessedError;
  handleNetworkError(error: NetworkError): ProcessedError;
  formatUserMessage(error: ProcessedError): string;
  shouldRetry(error: ProcessedError): boolean;
}
```

### Retry Mechanism
- Automatic retry for network failures (max 3 attempts)
- Exponential backoff for rate limiting
- Token refresh on authentication errors
- Circuit breaker pattern for persistent failures

## Testing Strategy

### 1. Unit Testing
- GraphQL query builder functions
- Error handling logic
- Type validation and transformation
- Fragment composition

### 2. Integration Testing
- GraphQL client configuration
- Authentication flow with GraphQL
- End-to-end API operations
- Error scenarios and recovery

### 3. Migration Testing
- Side-by-side comparison (REST vs GraphQL)
- Performance benchmarking
- Data consistency validation
- Rollback procedures

### 4. Type Safety Testing
- TypeScript compilation checks
- GraphQL schema validation
- Runtime type checking
- IntelliSense verification

## Implementation Phases

### Phase 1: Foundation
- GraphQL client setup and configuration
- Basic query and mutation infrastructure
- Authentication integration
- Error handling framework

### Phase 2: Core Operations
- User and profile operations
- Authentication and authorization
- Basic CRUD operations
- Fragment definitions

### Phase 3: Domain Migration
- Project and funding APIs
- Works and publications APIs
- Lookup and reference data APIs
- Admin and dashboard APIs

### Phase 4: Optimization
- Query optimization and caching
- Performance monitoring
- Type generation automation
- Documentation and testing

### Phase 5: Cleanup
- Remove REST API dependencies
- Update all imports and references
- Final testing and validation
- Performance optimization

## Performance Considerations

### Query Optimization
- Field selection optimization (only request needed fields)
- Batch queries to reduce round trips
- Proper use of fragments to avoid duplication
- Pagination for large datasets

### Caching Strategy
- In-memory caching for frequently accessed data
- Cache invalidation on mutations
- Optimistic updates for better UX
- Background refresh for stale data

### Bundle Size
- Tree-shaking unused GraphQL operations
- Code splitting for GraphQL client
- Lazy loading of complex queries
- Minimal runtime dependencies

## Security Considerations

### Authentication
- JWT token integration with GraphQL headers
- Automatic token refresh mechanism
- Secure token storage and management
- Session timeout handling

### Authorization
- Role-based access control in queries
- Field-level permissions
- Data filtering based on user context
- Audit logging for sensitive operations

### Data Validation
- Input validation on mutations
- Schema-based type checking
- Sanitization of user inputs
- Rate limiting and abuse prevention