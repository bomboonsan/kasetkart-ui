'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
// ใช้ path alias (@/) แทน relative path
import { projectAPI } from '@/lib/api'
import Button from '@/components/Button'
import dynamic from 'next/dynamic'
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })

export default function EditableResearchTeamSection({ project }) {
  const [swalProps, setSwalProps] = useState({})
  const [partners, setPartners] = useState([])
  const [originalPartners, setOriginalPartners] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Load project partners
  const { data: partnersRes, error: partnersError, isLoading } = useSWR(
    project ? ['project-partners', project.documentId || project.id] : null,
    () => projectAPI.getProjectPartners(project.documentId || project.id)
  )

  useEffect(() => {
    if (partnersRes?.data) {
      const normalizedPartners = partnersRes.data.map((partner, index) => ({
        documentId: partner.documentId,
        id: partner.id,
        fullname: partner.fullname || '',
        orgName: partner.orgName || '',
        participation_percentage: partner.participation_percentage || 0,
        participant_type: partner.participant_type || 0,
        isFirstAuthor: partner.isFirstAuthor || false,
        isCoreespondingAuthor: partner.isCoreespondingAuthor || false,
        users_permissions_user: partner.users_permissions_user || null,
        order: index + 1, // For ordering display
        email: partner.users_permissions_user?.email || '',
        name: partner.users_permissions_user 
          ? `${partner.users_permissions_user.firstName || ''} ${partner.users_permissions_user.lastName || ''}`.trim()
          : partner.fullname || '',
        department: partner.orgName || '',
        position: getPositionText(partner.participant_type),
        responsibility: getResponsibilityText(partner.participant_type, partner.isFirstAuthor, partner.isCoreespondingAuthor),
        workload: getWorkloadText(partner.participant_type),
        percentage: partner.participation_percentage ? partner.participation_percentage.toString() : ''
      }))
      setPartners(normalizedPartners)
      setOriginalPartners(JSON.parse(JSON.stringify(normalizedPartners)))
    }
  }, [partnersRes])

  const getPositionText = (type) => {
    const positions = {
      0: 'หัวหน้าโครงการ',
      1: 'นักวิจัยหลัก', 
      2: 'นักวิจัยร่วม',
      3: 'ผู้ช่วยนักวิจัย',
      4: 'ที่ปรึกษา'
    }
    return positions[type] || 'ผู้ร่วมวิจัย'
  }

  const getResponsibilityText = (type, isFirst, isCorresponding) => {
    let base = getPositionText(type)
    if (isFirst) base += ', ผู้เขียนหลัก'
    if (isCorresponding) base += ', ผู้ติดต่อ'
    return base
  }

  const getWorkloadText = (type) => {
    const workloads = {
      0: 'ประจำ_un',
      1: 'นักวิจัยหลัก_un',
      2: 'นักวิจัยร่วม_un', 
      3: 'ผู้ช่วย_un',
      4: 'ที่ปรึกษา_un'
    }
    return workloads[type] || 'ร่วม_un'
  }

  const movePartner = (fromIndex, toIndex) => {
    if (!isEditing) return
    
    const newPartners = [...partners]
    const [movedPartner] = newPartners.splice(fromIndex, 1)
    newPartners.splice(toIndex, 0, movedPartner)
    
    // Update order numbers
    const reorderedPartners = newPartners.map((partner, index) => ({
      ...partner,
      order: index + 1
    }))
    
    setPartners(reorderedPartners)
  }

  const updatePartnerPercentage = (index, percentage) => {
    if (!isEditing) return
    
    const newPartners = [...partners]
    newPartners[index] = {
      ...newPartners[index],
      percentage: percentage,
      participation_percentage: parseFloat(percentage) || 0
    }
    setPartners(newPartners)
  }

  const updatePartnerType = (index, type) => {
    if (!isEditing) return
    
    const newPartners = [...partners]
    newPartners[index] = {
      ...newPartners[index],
      participant_type: parseInt(type),
      position: getPositionText(parseInt(type)),
      responsibility: getResponsibilityText(parseInt(type), newPartners[index].isFirstAuthor, newPartners[index].isCoreespondingAuthor),
      workload: getWorkloadText(parseInt(type))
    }
    setPartners(newPartners)
  }

  const toggleFirstAuthor = (index) => {
    if (!isEditing) return
    
    const newPartners = [...partners]
    newPartners[index] = {
      ...newPartners[index],
      isFirstAuthor: !newPartners[index].isFirstAuthor,
      responsibility: getResponsibilityText(
        newPartners[index].participant_type, 
        !newPartners[index].isFirstAuthor, 
        newPartners[index].isCoreespondingAuthor
      )
    }
    setPartners(newPartners)
  }

  const toggleCorrespondingAuthor = (index) => {
    if (!isEditing) return
    
    const newPartners = [...partners]
    newPartners[index] = {
      ...newPartners[index],
      isCoreespondingAuthor: !newPartners[index].isCoreespondingAuthor,
      responsibility: getResponsibilityText(
        newPartners[index].participant_type, 
        newPartners[index].isFirstAuthor, 
        !newPartners[index].isCoreespondingAuthor
      )
    }
    setPartners(newPartners)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    
    try {
      // Update each partner's data in Strapi
      for (const partner of partners) {
        const updateData = {
          participation_percentage: partner.participation_percentage,
          participant_type: partner.participant_type,
          isFirstAuthor: partner.isFirstAuthor,
          isCoreespondingAuthor: partner.isCoreespondingAuthor
        }
        
        await projectAPI.updatePartner(partner.documentId, updateData)
      }
      
      // Refresh data
      mutate(['project-partners', project.documentId || project.id])
      
      setIsEditing(false)
      setSwalProps({
        show: true,
        icon: 'success',
        title: 'บันทึกข้อมูลทีมวิจัยสำเร็จ',
        timer: 1600,
        showConfirmButton: false
      })
      
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || 'บันทึกไม่สำเร็จ'
      setError(msg)
      setSwalProps({
        show: true,
        icon: 'error',
        title: 'บันทึกไม่สำเร็จ',
        text: msg,
        timer: 2200
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setPartners(JSON.parse(JSON.stringify(originalPartners)))
    setIsEditing(false)
    setError('')
  }

  if (partnersError) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="text-sm text-red-600">ไม่สามารถโหลดข้อมูลทีมวิจัยได้</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="text-sm text-gray-500">กำลังโหลดข้อมูลทีมวิจัย...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">ทีมนักวิจัย</h3>
        <div className="flex space-x-2">
          {!isEditing ? (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              disabled={!partners.length}
            >
              แก้ไข
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={saving}
              >
                ยกเลิก
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm border-b">{error}</div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                ลำดับ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                ชื่อ-นามสกุล
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                สังกัดคณะ/หน่วยงาน
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                ตำแหน่งทางวิชาการ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                หน้าที่ความรับผิดชอบ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                การมีส่วนร่วม (%)
              </th>
              {isEditing && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  จัดเรียง
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partners.map((member, index) => (
              <tr key={member.documentId || member.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                  {member.order}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-gray-500 text-xs">{member.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {member.department}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {isEditing ? (
                    <select
                      value={member.participant_type}
                      onChange={(e) => updatePartnerType(index, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value={0}>หัวหน้าโครงการ</option>
                      <option value={1}>นักวิจัยหลัก</option>
                      <option value={2}>นักวิจัยร่วม</option>
                      <option value={3}>ผู้ช่วยนักวิจัย</option>
                      <option value={4}>ที่ปรึกษา</option>
                    </select>
                  ) : (
                    <div>
                      <div>{member.position}</div>
                      <div className="text-xs text-gray-500">{member.workload}</div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div>
                    <div>{member.responsibility}</div>
                    {isEditing && (
                      <div className="mt-1 space-x-2">
                        <label className="inline-flex items-center text-xs">
                          <input
                            type="checkbox"
                            checked={member.isFirstAuthor}
                            onChange={() => toggleFirstAuthor(index)}
                            className="mr-1"
                          />
                          ผู้เขียนหลัก
                        </label>
                        <label className="inline-flex items-center text-xs">
                          <input
                            type="checkbox"
                            checked={member.isCoreespondingAuthor}
                            onChange={() => toggleCorrespondingAuthor(index)}
                            className="mr-1"
                          />
                          ผู้ติดต่อ
                        </label>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={member.percentage}
                      onChange={(e) => updatePartnerPercentage(index, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                    />
                  ) : (
                    <div>
                      <div className="font-medium text-gray-900">{member.workload}</div>
                      {member.percentage && (
                        <div className="text-xs text-gray-500">{member.percentage}%</div>
                      )}
                    </div>
                  )}
                </td>
                {isEditing && (
                  <td className="px-4 py-3 text-sm text-center">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => movePartner(index, Math.max(0, index - 1))}
                        disabled={index === 0}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded disabled:opacity-50"
                      >
                        ขึ้น
                      </button>
                      <button
                        onClick={() => movePartner(index, Math.min(partners.length - 1, index + 1))}
                        disabled={index === partners.length - 1}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded disabled:opacity-50"
                      >
                        ลง
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {partners.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          ไม่มีข้อมูลทีมวิจัยในโครงการนี้
        </div>
      )}
    </div>
  )
}
