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
    // พยายามได้ token จากหลายแหล่ง: local getToken() ก่อน
    let token = this.getToken();
    // debug: แจ้งว่าการดึง token เบื้องต้นเป็นอย่างไร
    try {
      console.debug('[api-base] initial getToken ->', token ? 'token present' : 'no token');
    } catch (e) {}
    // ถ้ายังไม่มี token ให้พยายามดึง NextAuth session ทาง client (dynamic import)
    // เพื่อรองรับการเก็บ JWT ไว้ใน session.jwt ตามการตั้งค่า callbacks ของ NextAuth
    if (!token && typeof window !== 'undefined') {
      try {
        const nextAuth = await import('next-auth/react');
        const sess = await nextAuth.getSession();
        // session.jwt เป็นชื่อที่เราเก็บไว้ใน callbacks.session
        if (sess?.jwt) token = sess.jwt;
        if (sess?.jwt) {
          try { console.debug('[api-base] next-auth.getSession -> session.jwt present'); } catch (e) {}
        }
        // บางครั้ง session อาจมีโครงสร้างอื่นๆ
        else if (sess?.session?.jwt) token = sess.session.jwt;
        else if (sess?.session?.jwt) {
          try { console.debug('[api-base] next-auth.getSession -> session.session.jwt present'); } catch (e) {}
        }
        else if (sess?.user?.jwt) token = sess.user.jwt;
        else if (sess?.user?.jwt) {
          try { console.debug('[api-base] next-auth.getSession -> session.user.jwt present'); } catch (e) {}
        }
        else {
          try { console.debug('[api-base] next-auth.getSession -> no jwt found in session'); } catch (e) {}
        }
      } catch (e) {
        // ไม่ต้องโยน error ที่นี่ เพราะยังมี fallback อื่นๆ
      }
    }
    // ก่อนเรียก fetch ให้บอกว่าจะส่ง Authorization หรือไม่ (ไม่พิมพ์ token เต็ม)
    try {
      console.debug('[api-base] request to', url, 'Authorization:', token ? 'present' : 'missing');
    } catch (e) {}
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
    // คอมเมนต์ (ไทย): ตรวจทั้ง NextAuth runtime (window.__NEXTAUTH?.token)
    // และ localStorage 'jwt' (legacy) เพื่อรองรับทั้ง flows
    if (typeof window !== "undefined") {
      const nextAuthToken = window.__NEXTAUTH?.token || window.__NEXTAUTH?.session?.accessToken || null
      if (nextAuthToken) {
        try { console.debug('[api-base] getToken -> found token in window.__NEXTAUTH'); } catch (e) {}
        return nextAuthToken
      }
      try {
        const jwt = localStorage.getItem("jwt")
        if (jwt) {
          try { console.debug('[api-base] getToken -> found token in localStorage (jwt)'); } catch (e) {}
          return jwt
        }
      } catch (e) { /* ignore */ }
      try { console.debug('[api-base] getToken -> no token found in window.__NEXTAUTH or localStorage'); } catch (e) {}
    }
    return null;
  }
  setToken(token) {
    // คอมเมนต์ (ไทย): ตั้งค่า token ใน localStorage และพยายามตั้งที่ window.__NEXTAUTH
    if (typeof window !== "undefined") {
      try { localStorage.setItem("jwt", token) } catch (e) {}
      try { if (window.__NEXTAUTH) window.__NEXTAUTH.token = token; else window.__NEXTAUTH = { token } } catch (e) {}
    }
  }
  removeToken() {
    // คอมเมนต์ (ไทย): ล้าง token ทั้งจาก localStorage และ runtime ของ NextAuth
    if (typeof window !== "undefined") {
      try { localStorage.removeItem("jwt") } catch (e) {}
      try { if (window.__NEXTAUTH) delete window.__NEXTAUTH.token } catch (e) {}
    }
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
