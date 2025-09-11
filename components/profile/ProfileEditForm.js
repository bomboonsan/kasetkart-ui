'use client'

import { useState } from 'react'
import GeneralInfoTab from './GeneralInfoTab'
import ProfileEditTabs from './ProfileEditTabs'
import NotificationTab from './NotificationTab'
import SecurityTab from './SecurityTab'

// คอมเมนต์ (ไทย): แก้ไขให้รับ userId และส่งต่อไปยัง Tab ที่เกี่ยวข้อง
export default function ProfileEditForm({ userId }) {
  const [activeTab, setActiveTab] = useState('general')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralInfoTab userId={userId} />
      case 'security':
        return <SecurityTab userId={userId} />
      case 'notification':
        return <NotificationTab userId={userId} />
      default:
        return <GeneralInfoTab userId={userId} />
    }
  }

  return (
    <>
    <ProfileEditTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      {renderTabContent()}
    </>
  )
}
