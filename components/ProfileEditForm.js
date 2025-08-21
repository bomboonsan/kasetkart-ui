'use client'

import { useState } from 'react'
import ProfileEditTabs from './ProfileEditTabs'
import GeneralInfoTab from './GeneralInfoTab'
import WorkInfoTab from './WorkInfoTab'
import SystemAccessTab from './SystemAccessTab'

export default function ProfileEditForm() {
  const [activeTab, setActiveTab] = useState('general')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralInfoTab />
      case 'work':
        return <WorkInfoTab />
      case 'access':
        return <SystemAccessTab />
      default:
        return <GeneralInfoTab />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <ProfileEditTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  )
}
