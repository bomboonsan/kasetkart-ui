'use client'
import { User , LockKeyhole , Bell } from "lucide-react"
export default function ProfileEditTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'general', label: 'บัญชีของฉัน', icon: <User /> },
    { id: 'security', label: 'ตั้งค่าความปลอดภัย', icon: <LockKeyhole /> },
    { id: 'notification', label: 'การแจ้งเตือน', icon: <Bell /> }
  ]

  return (
    <div className="">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon?.type || tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                py-2 px-3 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors
                ${activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span><Icon className="w-5 h-5" /></span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
