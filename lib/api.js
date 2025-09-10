// หมายเหตุ (ไทย): ไฟล์นี้ถูกลดรูป เหลือ re-export จากโครงสร้างใหม่ (Modular API)
// เพื่อให้โค้ดเดิมที่ยัง import จาก '@/lib/api' ทำงานได้ระยะเปลี่ยนผ่าน

export * from './api-base'      // api, API_BASE, apiAuth, serverGet
export * from './api/profile'   // profileAPI
export * from './api/project'   // projectAPI, fundingAPI
export * from './api/works'     // worksAPI
export * from './api/lookup'    // orgAPI, eduAPI, valueFromAPI
export * from './api/dashboard' // dashboardAPI, reportAPI
export * from './api/admin'     // userAPI, uploadAPI
export * from './api/auth'      // authAPI (legacy)

// TODO (ไทย): ภายหลังสามารถลบไฟล์นี้เมื่อทุกที่ปรับมา import จาก path ใหม่ทั้งหมด
