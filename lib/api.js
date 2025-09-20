// หมายเหตุ (ไทย): ไฟล์นี้ถูกลดรูป เหลือ re-export จากโครงสร้างใหม่ (Modular API)
// เพื่อให้โค้ดเดิมที่ยัง import จาก '@/lib/api' ทำงานได้ระยะเปลี่ยนผ่าน
// ปรับปรุงใหม่: ทุก API ถูกย้ายไปใช้ GraphQL แทน REST API เพื่อเชื่อมต่อ Strapi v5

export * from './api-base'      // api, API_BASE, apiAuth, serverGet (legacy compatibility)
export * from './api/profile'   // profileAPI (now uses GraphQL internally)
export * from './api/project'   // projectAPI, fundingAPI (now uses GraphQL internally)
export * from './api/works'     // worksAPI (now uses GraphQL internally)
export * from './api/lookup'    // orgAPI, eduAPI, valueFromAPI (now uses GraphQL internally)
export * from './api/dashboard' // dashboardAPI, reportAPI (now uses GraphQL internally)
export * from './api/admin'     // userAPI, uploadAPI (now uses GraphQL internally)
export * from './api/auth'      // authAPI (now uses GraphQL internally)

// TODO (ไทย): ภายหลังสามารถลบไฟล์นี้เมื่อทุกที่ปรับมา import จาก path ใหม่ทั้งหมด
