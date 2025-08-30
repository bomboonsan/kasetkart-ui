import FormFieldBlock from './FormFieldBlock'
import UserPicker from './UserPicker'
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
// Mock data for research team members
const mockTeamData = [
  {
    id: 1,
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    position: 'หัวหน้าโครงการ',
    department: 'สำนักงานเจ้าพระยา',
    role: 'Principal Investigator',
    member: 'First Author',
    contribution: '10',
    color: 'green'
  },
  {
    id: 2,
    name: 'Mr.Pom Jakkawatt',
    email: 'rocky.fisher@example.com',
    position: 'ตำแหน่งรองผู้อำนวยการ',
    department: 'ที่ปรึกษาโครงการ',
    role: 'Co-Investigator',
    member: 'Corresponding Author',
    contribution: '3.5',
    color: 'green'
  },
  {
    id: 3,
    name: 'Esther Howard',
    email: 'esther.howard@example.com',
    position: 'Forward Response Developer',
    department: 'Developer',
    role: 'Member',
    member: '',
    contribution: '5.5',
    color: 'green'
  },
  {
    id: 4,
    name: 'Jacob Jones',
    email: 'jacob.jones@example.com',
    position: 'Principal Functionality Specialist',
    department: 'Payroll',
    role: 'Member',
    member: '',
    contribution: '',
    color: 'green'
  },
  {
    id: 5,
    name: 'Jenny Wilson',
    email: 'jenny.wilson@example.com',
    position: 'Central Security Manager',
    department: 'Payroll',
    role: 'Member',
    member: '',
    contribution: '',
    color: 'green'
  },
  {
    id: 6,
    name: 'Kristin Watson',
    email: 'kristin.watson@example.com',
    position: 'Lead Implementation Liaison',
    department: 'Admin',
    role: 'Member',
    member: '',
    contribution: '',
    color: 'green'
  },
  {
    id: 7,
    name: 'Cameron Williamson',
    email: 'cameron.williamson@example.com',
    position: 'Internal Applications Engineer',
    department: 'Security',
    role: 'Member',
    member: '',
    contribution: '',
    color: 'green'
  }
]

export default function ResearchTeamTable({ formData, handleInputChange, setFormData }) {
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
                        setFormData(prev => ({ ...prev, fullname: display, userId: u.id, __userObj: u }))
                      }}
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
                value={formData.partnerType}
                onChange={(value) => handleInputChange("partnerType", value)}
                className="max-w-lg"
                options={[
                  { value: '', label: 'เลือก' },
                  { value: 'First Author', label: 'First Author' },
                  { value: 'Corresponding Author', label: 'Corresponding Author' },
                ]}
              />
            </div>
          </FormFieldBlock>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            เพิ่ม
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
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
                    สถานะ
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
                {mockTeamData.map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[#065F46] text-sm font-medium
                          ${member.color === "green"
                              ? "bg-[#D1FAE5]"
                              : "bg-blue-500"
                            }
                        `}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {member.position}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.department}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.role}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">-</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {/* <div className="text-sm text-gray-900">{member.member}</div> */}
                      {member.contribution && (
                        <div className="text-sm text-gray-500">
                          {member.contribution}%
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-red-600 hover:text-red-900">
                        Edit
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
