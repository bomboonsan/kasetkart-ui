// Duplicate legacy ProfileHeader removed in favor of '@/components/profile/ProfileHeader'
// ไฟล์นี้ถูกลดรูปเพื่อหลีกเลี่ยงการ import ซ้ำ ใช้งานไฟล์ในโฟลเดอร์ profile แทน
export default function ProfileHeader(){
  if (process.env.NODE_ENV !== 'production') {
  // legacy component loaded message removed
  }
  return null
}
