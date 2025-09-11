// ฐานกลางสำหรับ API (แยกจากไฟล์ใหญ่เดิม) - เก็บ instance และยูทิลพื้นฐาน
import axios from "axios";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

export const apiAuth = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

apiAuth.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      window.__NEXTAUTH?.token ||
      (typeof localStorage !== "undefined"
        ? localStorage.getItem("jwt")
        : null);
    if (token && !config.headers.Authorization)
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };
    if (config.body && typeof config.body === "object")
      config.body = JSON.stringify(config.body);
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        let errorText = "";
        try {
          const errorData = await response.json().catch(() => null);
          if (errorData && (errorData.error || errorData.message || errorData))
            errorText =
              errorData.error?.message ||
              errorData.message ||
              JSON.stringify(errorData);
        } catch (e) {}
        if (!errorText) {
          try {
            errorText = await response.text();
          } catch (e) {
            errorText = `HTTP ${response.status}`;
          }
        }
        throw new Error(errorText || `HTTP ${response.status}`);
      }
      const text = await response.text().catch(() => "");
      if (!text) return null;
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    } catch (error) {
      throw error;
    }
  }
  get(endpoint, params = {}) {
    const sp = new URLSearchParams(params);
    const url = sp.toString() ? `${endpoint}?${sp}` : endpoint;
    return this.request(url, { method: "GET" });
  }
  post(endpoint, data) {
    return this.request(endpoint, { method: "POST", body: data });
  }
  put(endpoint, data) {
    return this.request(endpoint, { method: "PUT", body: data });
  }
  patch(endpoint, data) {
    return this.request(endpoint, { method: "PUT", body: data });
  }
  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
  getToken() {
    if (typeof window !== "undefined") return localStorage.getItem("jwt");
    return null;
  }
  setToken(token) {
    if (typeof window !== "undefined") localStorage.setItem("jwt", token);
  }
  removeToken() {
    if (typeof window !== "undefined") localStorage.removeItem("jwt");
  }
}

export const api = new ApiClient();

export async function serverGet(endpoint) {
  // helper ฝั่ง server
  const url = `${API_BASE}${endpoint}`;
  const token =
    process.env.NEXT_ADMIN_JWT || process.env.STRAPI_ADMIN_JWT || null;
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json().catch(() => null);
        if (errorData && (errorData.error || errorData.message || errorData))
          errorText =
            errorData.error?.message ||
            errorData.message ||
            JSON.stringify(errorData);
      } catch (e) {}
      if (!errorText) {
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = `HTTP ${response.status}`;
        }
      }
      throw new Error(errorText || `HTTP ${response.status}`);
    }
    return await response.json();
    console.log("data", response.json());
  } catch (error) {
    throw error;
  }
}
