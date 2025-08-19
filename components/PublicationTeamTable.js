// Mock data for publication team members - same structure as research team
const mockPublicationTeam = [
  {
    id: 1,
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    position: 'หัวหน้าโครงการ',
    department: 'สำนักงานเจ้าพระยา',
    role: 'First Author',
    member: 'Co-Investigator',
    contribution: '10',
    color: 'green'
  },
  {
    id: 2,
    name: 'Mr.Pom Jakkawatt',
    email: 'cody.fisher@example.com',
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
    contribution: '2.5',
    color: 'green'
  },
  {
    id: 4,
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
    id: 5,
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
    id: 6,
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

export default function PublicationTeamTable() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 rounded-t-md">
        <h4 className="font-medium">นักวิจัย/ผู้ร่วมวิจัย ของผลงานนี้</h4>
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
                  หน่วยงานที่ปฏิบัติงาน
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  หน่วยงาน
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ผลงานของงาน (%)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockPublicationTeam.map((member, index) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[#065F46] text-sm font-medium
                          ${
                            member.color === "green"
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
                    <div className="text-sm text-gray-900">{member.member}</div>
                    {member.contribution && (
                      <div className="text-sm text-gray-500">
                        {member.contribution}
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
  );
}
