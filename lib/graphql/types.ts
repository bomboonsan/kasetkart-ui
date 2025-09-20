// GraphQL TypeScript interfaces and types for Strapi v5

// Generic Strapi Response Types
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

// GraphQL Error Types
export interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, any>;
}

export interface ProcessedError {
  type: 'GraphQLError' | 'NetworkError' | 'UnknownError';
  message: string;
  statusCode?: number;
  errors?: GraphQLError[];
  originalError?: any;
}

// Strapi Media/File Type
export interface StrapiMedia {
  id: string;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
}

// User and Profile Types
export interface UsersPermissionsUser {
  id: string;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
  role?: UsersPermissionsRole;
  profile?: Profile;
  organization?: Organization;
  faculty?: Faculty;
  department?: Department;
  academic_type?: AcademicType;
  participation_type?: ParticipationType;
}

export interface UsersPermissionsRole {
  id: string;
  documentId: string;
  name: string;
  description?: string;
  type: string;
}

export interface Profile {
  id: string;
  documentId: string;
  firstNameTH?: string;
  lastNameTH?: string;
  firstNameEN?: string;
  lastNameEN?: string;
  academicPosition?: string;
  citizenId?: string;
  passportId?: string;
  phoneNumber?: string;
  lineId?: string;
  avatarUrl?: StrapiMedia;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
}

// Organization Types
export interface Organization {
  id: string;
  documentId: string;
  name: string;
  nameEN?: string;
  code?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
}

export interface Faculty {
  id: string;
  documentId: string;
  name: string;
  nameEN?: string;
  code?: string;
  organization?: Organization;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
}

export interface Department {
  id: string;
  documentId: string;
  name: string;
  nameEN?: string;
  code?: string;
  faculty?: Faculty;
  organization?: Organization;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
}

// Lookup Types
export interface AcademicType {
  id: string;
  documentId: string;
  name: string;
  description?: string;
}

export interface ParticipationType {
  id: string;
  documentId: string;
  name: string;
  description?: string;
}

export interface Education {
  id: string;
  documentId: string;
  name: string;
  nameEN?: string;
  description?: string;
  level?: number;
}

export interface IcType {
  id: string;
  documentId: string;
  name: string;
  description?: string;
}

export interface Impact {
  id: string;
  documentId: string;
  name: string;
  description?: string;
}

export interface SDG {
  id: string;
  documentId: string;
  name: string;
  description?: string;
  icon?: StrapiMedia;
}

// Project Types
export interface ProjectResearch {
  id: string;
  documentId: string;
  title: string;
  titleEN?: string;
  description?: string;
  descriptionEN?: string;
  objective?: string;
  objectiveEN?: string;
  methodology?: string;
  methodologyEN?: string;
  expectedResults?: string;
  expectedResultsEN?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  budget?: number;
  currency?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
  owner?: UsersPermissionsUser;
  organization?: Organization;
  faculty?: Faculty;
  department?: Department;
  participants?: UsersPermissionsUser[];
  fundings?: ProjectFunding[];
}

export interface ProjectFunding {
  id: string;
  documentId: string;
  title: string;
  titleEN?: string;
  fundingAgency?: string;
  fundingAgencyEN?: string;
  amount?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  description?: string;
  descriptionEN?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
  owner?: UsersPermissionsUser;
  project?: ProjectResearch;
}

// Works Types
export interface WorkBook {
  id: string;
  documentId: string;
  title: string;
  titleEN?: string;
  isbn?: string;
  publisher?: string;
  publisherEN?: string;
  publicationDate?: string;
  pages?: number;
  language?: string;
  abstract?: string;
  abstractEN?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
  authors?: UsersPermissionsUser[];
}

export interface WorkConference {
  id: string;
  documentId: string;
  title: string;
  titleEN?: string;
  conferenceName?: string;
  conferenceNameEN?: string;
  venue?: string;
  venueEN?: string;
  startDate?: string;
  endDate?: string;
  abstract?: string;
  abstractEN?: string;
  presentationType?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
  presenters?: UsersPermissionsUser[];
}

export interface WorkPublication {
  id: string;
  documentId: string;
  title: string;
  titleEN?: string;
  journalName?: string;
  journalNameEN?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  publicationDate?: string;
  abstract?: string;
  abstractEN?: string;
  keywords?: string;
  keywordsEN?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
  authors?: UsersPermissionsUser[];
}