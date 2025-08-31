"use client"

import useSWR from 'swr'
import { api } from '@/lib/api'

export default function ResearchTeamReadonly({ projectId }) {
  const { data: project, error } = useSWR(projectId ? `/projects/${projectId}` : null, api.get)
  const partners = (project?.ProjectPartner || [])

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-4 mb-2">
        <div className="text-sm text-gray-500">จำนวนสมาชิก: {partners.length}</div>
      </div>
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
                <tr><td colSpan={5} className="px-4 py-4 text-sm text-red-600">{error.message || 'โหลดข้อมูลทีมไม่สำเร็จ'}</td></tr>
              )}
              {partners.map((p, i) => (
                <tr key={p.id || `${p.userID || 'ext'}-${i}`} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#065F46] text-sm font-medium bg-[#D1FAE5]">
                      {i + 1}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {p.fullname || p.User?.email || '-'}
                      </div>
                      <div className="text-xs text-gray-500">{p.User?.email || ''}</div>
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
              {partners.length === 0 && !error && (
                <tr><td colSpan={5} className="px-4 py-6 text-sm text-gray-500 text-center">ไม่มีข้อมูลผู้ร่วมโครงการ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

