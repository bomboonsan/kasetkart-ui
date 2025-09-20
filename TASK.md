
# Планการย้ายข้อมูลจาก REST API ไปยัง GraphQL

## 1. ตรวจสอบและลบไฟล์ที่ไม่ได้ใช้งาน

- **`lib/auth.js`**: ไฟล์นี้ถูกระบุว่าเลิกใช้งานแล้วและถูกแทนที่ด้วย NextAuth.js ให้ลบไฟล์นี้ออก
- **`lib/http/axios.js`**: ตรวจสอบว่ามีการใช้งาน `axiosInstance` ที่อื่นในโปรเจกต์หรือไม่ หากไม่มี ให้ลบไฟล์นี้
- **`lib/http/client.js`**: ตรวจสอบว่ามีการใช้งาน `HttpClient` ที่อื่นในโปรเจกต์หรือไม่ หากไม่มี ให้ลบไฟล์นี้
- **`lib/http/error-handler.js`**: ตรวจสอบว่ามีการใช้งาน `ErrorHandler` ที่อื่นในโปรเจกต์หรือไม่ หากไม่มี ให้ลบไฟล์นี้

## 2. ย้าย `profileAPI` ไปยัง GraphQL ทั้งหมด

- **`lib/api/profile.js`**:
    - `getMyProfileSidebar`: ย้ายไปใช้ `executeGraphQL` กับ `GET_MY_PROFILE_SIDEBAR`
    - `getMyProfile`: ย้ายไปใช้ `executeGraphQL` กับ `GET_MY_PROFILE`
    - `getUserById`: ย้ายไปใช้ `executeGraphQL` กับ `GET_USER_BY_ID`
    - `updateProfile`: ย้ายไปใช้ `executeGraphQL` กับ `UPDATE_USER`
    - `getProfiles`: ย้ายไปใช้ `executeGraphQL` กับ `GET_PROFILES`
    - `getProfile`: ย้ายไปใช้ `executeGraphQL` กับ `GET_PROFILE`
    - `createProfile`: ย้ายไปใช้ `executeGraphQL` กับ `CREATE_PROFILE`
    - `updateProfileData`: ย้ายไปใช้ `executeGraphQL` กับ `UPDATE_PROFILE`
    - `findProfileByUserId`: ย้ายไปใช้ `executeGraphQL` กับ `GET_PROFILES`
    - `updateUserRelations`: **ยังคงใช้ REST API** เนื่องจากเป็น custom endpoint

## 3. ย้าย `admin.js` ไปยัง GraphQL ทั้งหมด

- **`lib/api/admin.js`**:
    - `updateUser`: ย้ายไปใช้ `executeGraphQL` กับ `UPDATE_USER`
    - `createUser`: ย้ายส่วนที่ยังเป็น REST API ไปใช้ `executeGraphQL` กับ `CREATE_USER` และ `UPDATE_USER` สำหรับการอัปเดต relations
    - `uploadAPI`: **ยังคงใช้ REST API** สำหรับการอัปโหลดไฟล์

## 4. ลบโค้ด REST API ที่ไม่จำเป็น

- **`lib/api-base.js`**:
    - ลบคลาส `LegacyApiClient`
    - ลบ `api` และ `apiAuth` ที่ถูก export
    - ลบฟังก์ชัน `serverGet`
- **`lib/config/api.js`**:
    - ลบ `API_BASE` ที่ถูก export

## 5. สร้างไฟล์ GraphQL Queries

- สร้างไฟล์ `lib/graphql/queries.js` และ `lib/graphql/mutations.js` เพื่อเก็บ GraphQL queries และ mutations ทั้งหมด

## 6. อัปเดตไฟล์ที่เรียกใช้ API

- ค้นหาและอัปเดตไฟล์ทั้งหมดที่เรียกใช้ฟังก์ชันที่ถูกย้ายไปใช้ GraphQL

## 7. ลบไฟล์ที่ไม่เกี่ยวข้อง

- **`test-profile-fix.js`**: ลบไฟล์นี้เนื่องจากเป็นไฟล์ทดสอบ
- **`swagger.json`**: ลบไฟล์นี้เนื่องจากการย้ายไปใช้ GraphQL ทำให้เอกสาร Swagger นี้ไม่จำเป็นอีกต่อไป
- **`api-spec.json`**: ลบไฟล์นี้เนื่องจากการย้ายไปใช้ GraphQL ทำให้เอกสาร API นี้ไม่จำเป็นอีกต่อไป
- **`full_documentation.json`**: ลบไฟล์นี้เนื่องจากการย้ายไปใช้ GraphQL ทำให้เอกสารนี้ไม่จำเป็นอีกต่อไป
