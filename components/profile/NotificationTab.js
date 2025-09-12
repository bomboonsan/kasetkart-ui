'use client'

import { useState } from 'react'
import ProfileImageUpload from './ProfileImageUpload'
import FormField from '@/components/ui/FormField'
import SelectField from '@/components/ui/SelectField'
import { Button } from '@/components/ui'

export default function NotificationTab() {

  const initialNotifications = [
    { id: 1, label: 'New for you', email: true, browser: true, app: true },
    { id: 2, label: 'Account activity', email: true, browser: true, app: true },
    { id: 3, label: 'A new browser used to sign in', email: true, browser: true, app: false },
    { id: 4, label: 'A new device is linked', email: true, browser: false, app: false },
  ]

  const [notifications, setNotifications] = useState(initialNotifications)
  const [whenToSend, setWhenToSend] = useState('only-online')

  function toggleField(id, field) {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: !item[field] } : item))
    )
  }

  function handleSave() {
    // implement save logic (API call) here
    // Saved notification settings (silent)
  }

  function handleReset() {
    setNotifications(initialNotifications)
    setWhenToSend('only-online')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm mt-6">
      <div className="border-b px-6 py-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">การตั้งค่าการแจ้งเตือน</h3>
          <p className="text-sm text-gray-500 mt-1">
            เราต้องได้รับอนุญาตจากเบราว์เซอร์ของคุณเพื่อแสดงการแจ้งเตือน.{' '}
            <a href="#" className="text-indigo-600 underline">ขออนุญาต</a>
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-left divide-y divide-gray-100">
            <thead>
              <tr className="text-sm text-gray-500">
                <th className="py-3 pr-6">ประเภท</th>
                <th className="py-3 pr-6">อีเมล</th>
                <th className="py-3 pr-6">เบราว์เซอร์</th>
                <th className="py-3">แอป</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {notifications.map(row => (
                <tr key={row.id} className="text-sm text-gray-700">
                  <td className="py-4 pr-6">{row.label}</td>

                  <td className="py-4 pr-6">
                    <input
                      type="checkbox"
                      checked={row.email}
                      onChange={() => toggleField(row.id, 'email')}
                      className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                    />
                  </td>

                  <td className="py-4 pr-6">
                    <input
                      type="checkbox"
                      checked={row.browser}
                      onChange={() => toggleField(row.id, 'browser')}
                      className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                    />
                  </td>

                  <td className="py-4">
                    <input
                      type="checkbox"
                      checked={row.app}
                      onChange={() => toggleField(row.id, 'app')}
                      className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">เราควรส่งการแจ้งเตือนให้คุณเมื่อใด?</label>
            <SelectField
              value={whenToSend}
              onChange={e => setWhenToSend(e.target.value)}
              className="w-64"
            >
              <option value="only-online">เฉพาะเมื่อฉันออนไลน์</option>
              <option value="always">ตลอดเวลา</option>
              <option value="never">ไม่เคย</option>
            </SelectField>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={handleSave}>
            บันทึก
          </Button>
          <Button variant="outline" onClick={handleReset}>
            รีเซต
          </Button>
        </div>
      </div>
    </div>
  )
}
