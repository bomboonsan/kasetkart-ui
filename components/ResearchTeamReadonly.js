"use client"

import { useState, useEffect } from 'react'
import { projectAPI } from '@/lib/api/project'

export default function ResearchTeamReadonly({ projectId }) {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (projectId) {
      loadPartners()
    }
  }, [projectId])

  const loadPartners = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await projectAPI.getProjectPartners(projectId)
      
      // Handle different response structures
      const partnersData = response?.data || response || []
      setPartners(partnersData)
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลทีมได้')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-4 mb-2">
        <div className="text-sm text-gray-500">จำนวนสมาชิก: {partners.length}</div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="ml-2 text-gray-600">กำลังโหลดข้อมูลทีม...</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-b-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หน่วยงาน</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภทผู้ร่วมโครงการวิจัย</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {error && (
                  <tr><td colSpan={5} className="px-4 py-4 text-sm text-red-600">{error}</td></tr>
                )}
                {!error && partners.map((p, i) => (
                  <tr key={p.id || p.documentId || `partner-${i}`} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#065F46] text-sm font-medium bg-[#D1FAE5]">
                        {i + 1}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {p.fullname || p.users_permissions_user?.email || p.User?.email || '-'}
                        </div>
                        <div className="text-xs text-gray-500">{p.users_permissions_user?.email || p.User?.email || ''}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{p.orgName || '-'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{p.partnerType || '-'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{p.partnerComment || '-'}</div>
                    </td>
                  </tr>
                ))}
                {!error && partners.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-6 text-sm text-gray-500 text-center">ไม่มีข้อมูลผู้ร่วมโครงการ</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

