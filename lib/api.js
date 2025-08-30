// Simple API client for frontend
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export async function request(
  path,
  { method = "GET", body, headers = {} } = {},
) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error?.message || "Request failed");
    err.status = res.status;
    err.code = data?.error?.code;
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  del: (path) => request(path, { method: "DELETE" }),
};

// User API functions
export const userAPI = {
  // Get all users (for admin)
  getUsers: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value);
      }
    });
    const query = searchParams.toString();
    console.log(query);
    return api.get(`/users${query ? `?${query}` : ""}`);
  },
  // Get user by id (admin)
  getUser: (userId) => api.get(`/users/${userId}`),

  // Create user
  createUser: (userData) => api.post("/users", userData),

  // Update user
  updateUser: (userId, userData) => api.patch(`/users/${userId}`, userData),

  // Update user approval status
  updateUserApproval: (userId, approvalStatus) =>
    api.patch(`/users/${userId}/approval`, { approvalStatus }),

  // Create or update profile for a user (admin)
  upsertUserProfile: (userId, profileData) =>
    api.post(`/users/${userId}/profile`, profileData),
};

// Profile API functions
export const profileAPI = {
  // Get current user profile
  getMyProfile: () => api.get("/profiles/me"),

  // Update current user profile
  updateMyProfile: (profileData) => api.patch("/profiles/me", profileData),
};

// Project API functions
export const projectAPI = {
  // Get projects
  getProjects: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value);
      }
    });
    const query = searchParams.toString();
    return api.get(`/projects${query ? `?${query}` : ""}`);
  },

  // Get project by ID
  getProject: (projectId) => api.get(`/projects/${projectId}`),

  // Create project
  createProject: (projectData) => api.post("/projects", projectData),

  // Update project
  updateProject: (projectId, projectData) =>
    api.put(`/projects/${projectId}`, projectData),

  // Delete project
  deleteProject: (projectId) => api.del(`/projects/${projectId}`),

  // Update project status
  updateProjectStatus: (projectId, status) =>
    api.patch(`/projects/${projectId}/status`, { status }),
};

// Organization API functions
export const orgAPI = {
  // Get organizations
  getOrganizations: () => api.get("/organizations"),
  // Get faculties
  getFaculties: () => api.get("/faculties"),

  // Get departments
  getDepartments: (orgId) => api.get(`/organizations/${orgId}/departments`),

  // Get all departments
  getAllDepartments: () => api.get("/departments"),
};

// Works API functions
export const worksAPI = {
  // Get works for a project
  getProjectWorks: (projectId, params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value);
      }
    });
    const query = searchParams.toString();
    return api.get(`/projects/${projectId}/works${query ? `?${query}` : ""}`);
  },

  // Get all works
  getWorks: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value);
      }
    });
    const query = searchParams.toString();
    return api.get(`/works${query ? `?${query}` : ""}`);
  },

  // Get single work by ID
  getWork: (workId) => api.get(`/works/${workId}`),

  // Create work (in project context)
  createWork: (projectId, workData) =>
    api.post(`/projects/${projectId}/works`, workData),

  // Update work (in project context)
  updateWork: (projectId, workId, workData) =>
    api.patch(`/projects/${projectId}/works/${workId}`, workData),

  // Delete work
  deleteWork: (projectId, workId) =>
    api.del(`/projects/${projectId}/works/${workId}`),

  // Standalone update work by id
  putWork: (workId, workData) => api.put(`/works/${workId}`, workData),
};

// Reports API functions
export const reportsAPI = {
  // Get user counts grouped by jobType
  getUsersByJobType: () => api.get('/reports/users-job-types'),
  // Get user counts grouped by jobType for a department
  getUsersByJobTypeByDepartment: (departmentId) =>
    api.get(`/reports/users-job-types/by-department?departmentId=${encodeURIComponent(departmentId)}`),
};

// Upload API functions
export const uploadAPI = {
  // Upload multiple files
  uploadFiles: async (files) => {
    const formData = new FormData();
    for (const f of files) formData.append('files', f);

    const token = getToken();
    const res = await fetch(`${API_BASE}/uploads`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const err = new Error(data?.error?.message || "Upload failed");
      err.status = res.status;
      err.code = data?.error?.code;
      throw err;
    }

    return res.json(); // array of {id,url,filename,mime,size}
  },

  // Delete uploaded file
  deleteFile: (fileId) => api.del(`/uploads/${fileId}`),
};
