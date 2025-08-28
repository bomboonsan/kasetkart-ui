'use client'

import { useState } from 'react'
import GeneralInfoTab from './GeneralInfoTab'
import ProfileEditTabs from './ProfileEditTabs'
import NotificationTab from './NotificationTab'
import SecurityTab from './SecurityTab'

export default function ProfileEditForm() {
  const [activeTab, setActiveTab] = useState('general')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralInfoTab />
      case 'security':
        return <SecurityTab />
      case 'notification':
        return <NotificationTab />
      default:
        return <GeneralInfoTab />
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
