import FormFieldBlock from './FormFieldBlock'
import UserPicker from './UserPicker'
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import useSWR from 'swr'
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function ResearchTeamTable({ projectId, formData, handleInputChange, setFormData }) {
  const { data: project } = useSWR(projectId ? `/projects/${projectId}` : null, api.get)
  const [localPartners, setLocalPartners] = useState([])
  useEffect(() => {
    if (project?.ProjectPartner) setLocalPartners(project.ProjectPartner)
  }, [project])

  function handleAddPartner() {
    const internal = formData.isInternal === true
    const u = formData.__userObj || null
    const prof = u ? (Array.isArray(u.Profile) ? u.Profile[0] : u.Profile) : null
    const full = u ? (prof ? `${prof.firstName || ''} ${prof.lastName || ''}`.trim() : u.email) : ''
    const org = u ? (u.Faculty?.name || u.Department?.name || '') : ''
    const partner = {
      isInternal: internal,
      userID: internal && u ? u.id : undefined,
      fullname: internal ? (full || formData.partnerFullName || '') : (formData.partnerFullName || ''),
      orgName: internal ? (org || formData.orgName || '') : (formData.orgName || ''),
      partnerType: formData.partnerType || '',
      partnerComment: formData.partnerComment || '',
      proportion: undefined,
      User: internal && u ? { email: u.email } : undefined,
    }
    setLocalPartners(prev => [...prev, partner])
    const dlg = document.getElementById('my_modal_2'); if (dlg && dlg.close) dlg.close()
  }

  function handleRemovePartner(idx) {
    setLocalPartners(prev => prev.filter((_, i) => i !== idx))
  }
  return (
    <>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box w-11/12 max-w-5xl text-gray-700">
          <FormFieldBlock>
            <div className="flex items-center gap-10">
              <label className="flex items-center gap-3 text-zinc-700">
                <input
                  type="radio"
                  value="true"
                  checked={formData.isInternal === true}
                  onChange={() => handleInputChange("isInternal", true)}
                  className={`
                                text-zinc-700
                                px-3 py-2 border border-gray-300 rounded-md
                                placeholder-gray-400 focus:outline-none focus:ring-2
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200
                            `}
                />
                ภายใน มก.
              </label>
              <label className="flex items-center gap-3 text-zinc-700">
                <input
                  type="radio"
                  value="false"
                  checked={formData.isInternal === false}
                  onChange={() => handleInputChange("isInternal", false)}
                  className={`
                                text-zinc-700
                                px-3 py-2 border border-gray-300 rounded-md
                                placeholder-gray-400 focus:outline-none focus:ring-2
                                focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200
                            `}
                />
                ภายนอก มก. (หัวหน้าโครงการวิจัยภายนอก มก. นิสิต และลูกจ้าง)
              </label>
            </div>
            {
              formData.isInternal == true ? (
                <>
                  <div>
                    <UserPicker
                      label="ผู้ร่วมโครงการวิจัย"
                      selectedUser={formData.__userObj}
                      onSelect={(u) => {
                        const display = (u.Profile ? `${u.Profile.firstName || ''} ${u.Profile.lastName || ''}`.trim() : u.email)
                        setFormData(prev => ({ ...prev, partnerFullName: display, orgName: (u.Faculty?.name || u.Department?.name || ''), userId: u.id, __userObj: u }))
                      }}
                    />
                  </div>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อผู้ร่วมโครงการวิจัย"
                      type="text"
                      value={formData.partnerFullName || ''}
                      onChange={(value) => handleInputChange("partnerFullName", value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อหน่วยงาน"
                      type="text"
                      value={formData.orgName || ''}
                      onChange={(value) => handleInputChange("orgName", value)}
                      placeholder=""
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อผู้ร่วมโครงการวิจัย"
                      type="text"
                      value={formData.partnerFullName}
                      onChange={(value) => handleInputChange("partnerFullName", value)}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <FormInput
                      mini={false}
                      label="ชื่อหน่วยงาน"
                      type="text"
                      value={formData.orgName}
                      onChange={(value) => handleInputChange("orgName", value)}
                      placeholder=""
                    />
                  </div>
                </>
              )
            }



            <div>
              <FormSelect
                label="ประเภทผู้ร่วมโครงการวิจัย"
                required
                value={formData.partnerType}
                onChange={(value) => handleInputChange("partnerType", value)}
                className="max-w-lg"
                options={[
                  { value: '', label: 'เลือกประเภท' },
                  { value: 'หัวหน้าโครงการ', label: 'หัวหน้าโครงการ' },
                  { value: 'ที่ปรึกษาโครงการ', label: 'ที่ปรึกษาโครงการ' },
                  { value: 'ผู้ประสานงาน', label: 'ผู้ประสานงาน' },
                  { value: 'นักวิจัยร่วม', label: 'นักวิจัยร่วม' },
                  { value: 'อื่นๆ', label: 'อื่นๆ' },
                ]}
              />
            </div>
            <div>
              <FormSelect
                label="หมายเหตุ"
                value={formData.partnerComment}
                onChange={(value) => handleInputChange("partnerComment", value)}
                className="max-w-lg"
                options={[
                  { value: '', label: 'เลือก' },
                  { value: 'First Author', label: 'First Author' },
                  { value: 'Corresponding Author', label: 'Corresponding Author' },
                ]}
              />
            </div>
          </FormFieldBlock>
          <button onClick={handleAddPartner} type="button" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            เพิ่ม
          </button>
        </div>
        <form method="dialog" className="modal-backdrop backdrop-blur-sm">
          <button>close</button>
        </form>
      </dialog>
      
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-end gap-4 mb-5">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700" onClick={() => document.getElementById('my_modal_2').showModal()}>
            เพิ่มสมาชิก
          </button>
        </div>
        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-b-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ลำดับ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หน่วยงาน
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ประเภทผู้ร่วมโครงการวิจัย
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หมายเหตุ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สัดส่วนการวิจัย (%)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(localPartners || []).map((p, index) => (
                  <tr key={p.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[#065F46] text-sm font-medium
                          bg-[#D1FAE5]
                        `}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {p.fullname || p.User?.email || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {p.User?.email || ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {p.orgName || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{p.partnerType || '-'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{p.partnerComment || '-'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {p.proportion && (
                        <div className="text-sm text-gray-500">
                          {p.proportion}%
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button type="button" onClick={() => handleRemovePartner(index)} className="text-red-600 hover:text-red-900">
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
