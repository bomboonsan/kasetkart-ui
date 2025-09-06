'use client'
import { User, LockKeyhole, Briefcase } from "lucide-react"

/**
 * ProfileEditTabs
 * @param {object} props - The props object.
 * @param {string} props.activeTab - The key of the currently active tab.
 * @param {function} props.onTabChange - The handler function to change the active tab.
 * @returns {JSX.Element}
 * @description
 * คอมโพเนนต์สำหรับแสดงผลแท็บต่างๆ ในหน้าแก้ไขโปรไฟล์
 * แก้ไขเพื่อให้ ID ของแท็บตรงกับ Logic ที่จัดการใน ProfileEditForm (parent component)
 * - general: บัญชีของฉัน (ข้อมูลทั่วไปและสังกัด)
 * - work: ข้อมูลการทำงาน (ประวัติ, ประสบการณ์, วุฒิการศึกษา)
 * - security: ตั้งค่าความปลอดภัย (ยังไม่ได้แก้ไขในส่วนนี้ แต่เตรียมไว้)
 */
export default function ProfileEditTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'general', label: 'ข้อมูลทั่วไป', icon: <User /> },
    { id: 'work', label: 'ข้อมูลการทำงานและวุฒิ', icon: <Briefcase /> },
    { id: 'security', label: 'ตั้งค่าความปลอดภัย', icon: <LockKeyhole /> },
  ]

  return (
    <div className="mb-6">
      <nav className="flex space-x-4 sm:space-x-6">
        {tabs.map((tab) => {
          const Icon = tab.icon?.type || tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                py-2 px-3 rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}