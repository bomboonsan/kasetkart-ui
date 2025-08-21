export default function ResearchTeamSection() {
  const teamMembers = [
    {
      id: 1,
      name: 'Jane Cooper',
      email: 'jane.cooper@example.com',
      department: 'สำนักวิชาเกษตร',
      position: 'อาจารย์ประจำมหาวิทยาลัยเกษตรศาสตร์',
      responsibility: 'หัวหน้าโครงการวิจัย',
      workload: 'ประจำ_un',
      percentage: '100.00'
    },
    {
      id: 2,
      name: 'สมชาย สายธารดี',
      email: 'somchai.saytundee@ku.th',
      department: 'คณะวนเกษตรศาสตร์',
      position: 'ผู้ช่วยศาสตราจารย์',
      responsibility: 'นักวิจัยหลัก',
      workload: 'นักวิจัยร่วม_un',
      percentage: '85'
    },
    {
      id: 3,
      name: 'Esther Howard',
      email: 'esther.howard@example.com',
      department: 'Forward Response Developer',
      position: 'Office Head',
      responsibility: 'Member',
      workload: 'Member',
      percentage: '75'
    },
    {
      id: 4,
      name: 'Jenny Wilson',
      email: 'jenny.wilson@example.com',
      department: 'Central Security Manager',
      position: 'Program',
      responsibility: 'Member',
      workload: 'Member',
      percentage: '5'
    },
    {
      id: 5,
      name: 'Kristin Watson',
      email: 'kristin.watson@example.com',
      department: 'Lead Implementation Liaison',
      position: 'Mobility',
      responsibility: 'Admin',
      workload: 'Admin',
      percentage: ''
    },
    {
      id: 6,
      name: 'Cameron Williamson',
      email: 'cameron.williamson@example.com',
      department: 'Internal Applications Engineer',
      position: 'Security',
      responsibility: 'Member',
      workload: 'Member',
      percentage: ''
    }
  ]

  return (
    <div className="bg-white rounded-lg border">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">ทีมนักวิจัย</h3>
      </div>
      
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
                หน้าที่ความรับผิดชอบ (%)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamMembers.map((member, index) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                  {index + 1}
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
                  <div>
                    <div>{member.position}</div>
                    <div className="text-xs text-gray-500">{member.responsibility}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <div>
                    <div className="font-medium text-gray-900">{member.workload}</div>
                    {member.percentage && (
                      <div className="text-xs text-gray-500">{member.percentage}</div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
