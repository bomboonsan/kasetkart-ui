import { CSVLink, CSVDownload } from "react-csv";
import Button from '@/components/Button'
export default function ReportTableA() {
  const csvData = [
    [
      "Discipline",
      "TotalMembers",
      "MembersWithoutICS",
      "MembersWithICS",
      "Portfolio_BDS",
      "Portfolio_AIS",
      "Portfolio_TLS",
      "Portfolio_Total",
      "Types_BDS",
      "Types_APR_ER_Proceeding",
      "Types_AllOther",
      "Types_Total",
      "%_Part",
      "%_All"
    ],
    ["Accounting (19 members)", 19, 2, 17, 100.5, 41.8, 13, 155.3, 42.8, 100.5, 12, 155.3, 42.8, 155.3],
    ["Finance (9 members)", 9, 9, 0, 12.5, 115, 0.5, 128, 42, 86, 0, 128, 42.8, 155.3],
    ["Management (12 members)", 12, 12, 0, 12.5, 115, 0.5, 128, 101, 118.8, 0.3, 220.2, 42.8, 155.3],
    ["Marketing (12 members)", 12, 12, 0, 12.5, 115, 0.5, 128, 95.7, 79.2, 0.3, 175.2, 42.8, 155.3],
    ["Technology and Operation Management (10 members)", 10, 10, 0, 12.5, 115, 0.5, 128, 71.5, 61.5, 5.3, 138.3, 42.8, 155.3],
    ["Total", 62, 62, 62, 12.5, 115, 0.5, 128, 353, 446, 18, 817, 42.8, 155.3]
  ];
  const reportData = [
    {
      discipline: "Accounting (19 members)",
      totalMembers: 19,
      membersWithoutICs: 2,
      membersWithICs: 2,
      bds: 100.5,
      ais: 41.8,
      tls: 13.0,
      total: 155.3,
      bdsTypes: 42.8,
      aprEr: 100.5,
      allOther: 12.0,
      totalTypes: 155.3,
      part: 42.8,
      all: 155.3
    },
    {
      discipline: "Finance (9 members)",
      subdiscipline: "8 participating, 1 supporting",
      totalMembers: 9,
      membersWithoutICs: 9,
      membersWithICs: 9,
      bds: 12.5,
      ais: 115.0,
      tls: 0.5,
      total: 128.0,
      bdsTypes: 42.0,
      aprEr: 86.0,
      allOther: 0.0,
      totalTypes: 128.0,
      part: 42.8,
      all: 155.3
    },
    {
      discipline: "Management (12 members)",
      totalMembers: 12,
      membersWithoutICs: 12,
      membersWithICs: 12,
      bds: 12.5,
      ais: 115.0,
      tls: 0.5,
      total: 128.0,
      bdsTypes: 101.0,
      aprEr: 118.8,
      allOther: 0.3,
      totalTypes: 220.2,
      part: 42.8,
      all: 155.3
    },
    {
      discipline: "Marketing (12 members)",
      totalMembers: 12,
      membersWithoutICs: 12,
      membersWithICs: 12,
      bds: 12.5,
      ais: 115.0,
      tls: 0.5,
      total: 128.0,
      bdsTypes: 95.7,
      aprEr: 79.2,
      allOther: 0.3,
      totalTypes: 175.2,
      part: 42.8,
      all: 155.3
    },
    {
      discipline: "Technology and Operation Management (10 members)",
      totalMembers: 10,
      membersWithoutICs: 10,
      membersWithICs: 10,
      bds: 12.5,
      ais: 115.0,
      tls: 0.5,
      total: 128.0,
      bdsTypes: 71.5,
      aprEr: 61.5,
      allOther: 5.3,
      totalTypes: 138.3,
      part: 42.8,
      all: 155.3
    }
  ]

  const totalRow = {
    discipline: "Total",
    totalMembers: 62,
    membersWithoutICs: 62,
    membersWithICs: 62,
    bds: 12.5,
    ais: 115.0,
    tls: 0.5,
    total: 128.0,
    bdsTypes: 353.0,
    aprEr: 446.0,
    allOther: 18.0,
    totalTypes: 817.0,
    part: 42.8,
    all: 155.3
  }

  return (
    <>
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th
                className="bg-blue-100 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r"
                rowSpan="2"
              >
                Discipline
              </th>
              <th
                className="bg-blue-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r"
                rowSpan="2"
              >
                Total<br />Members
              </th>
              <th
                className="bg-blue-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r"
                rowSpan="2"
              >
                Members<br />Without<br />ICs
              </th>
              <th
                className="bg-blue-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r"
                rowSpan="2"
              >
                Members<br />With ICs
              </th>
              <th
                className="bg-pink-200 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r"
                colSpan="4"
              >
                Portfolio Of ICs
              </th>
              <th
                className="bg-green-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r"
                colSpan="4"
              >
                Types Of Intellectual Contribution
              </th>
              <th
                className="bg-yellow-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider"
                colSpan="2"
              >
                % Faculty Producing ICs
              </th>
            </tr>
            <tr>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">BDS</th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">AIS</th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">TLS</th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">TOTAL</th>

              <th className="bg-green-100 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">BDS</th>
              <th className="bg-green-100 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                APR/ER<br /><span className="text-[10px]">PROCEEDING</span>
              </th>
              <th className="bg-green-100 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">ALL OTHER</th>
              <th className="bg-green-100 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">TOTAL</th>

              <th className="bg-yellow-100 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">PART</th>
              <th className="bg-yellow-100 px-2 py-2 text-center text-xs font-medium text-gray-700">ALL</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 border-r">
                  <div>
                    <div className="font-medium">{row.discipline}</div>
                    {row.subdiscipline && (
                      <div className="text-xs text-gray-500">
                        {row.subdiscipline}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">
                  {row.totalMembers}
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">
                  {row.membersWithoutICs}
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">
                  {row.membersWithICs}
                </td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                  {row.bds}
                </td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                  {row.ais}
                </td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                  {row.tls}
                </td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r font-medium">
                  {row.total}
                </td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                  {row.bdsTypes}
                </td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                  {row.aprEr}
                </td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                  {row.allOther}
                </td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r font-medium">
                  {row.totalTypes}
                </td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                  {row.part}
                </td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 font-medium">
                  {row.all}
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-3 text-sm text-gray-900 border-r font-bold">
                {totalRow.discipline}
              </td>
              <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">
                {totalRow.totalMembers}
              </td>
              <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">
                {totalRow.membersWithoutICs}
              </td>
              <td className="px-4 py-3 text-sm text-center text-gray-900 border-r">
                {totalRow.membersWithICs}
              </td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                {totalRow.bds}
              </td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                {totalRow.ais}
              </td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                {totalRow.tls}
              </td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r font-bold">
                {totalRow.total}
              </td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                {totalRow.bdsTypes}
              </td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                {totalRow.aprEr}
              </td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                {totalRow.allOther}
              </td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r font-bold">
                {totalRow.totalTypes}
              </td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">
                {totalRow.part}
              </td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 font-bold">
                {totalRow.all}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
      <CSVLink data={csvData}><Button 
        variant="success"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
      >
        <span>Export</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-3 3-3-3M12 12v9M5 20h14" />
        </svg>
      </Button></CSVLink>
    </>
  );
}
