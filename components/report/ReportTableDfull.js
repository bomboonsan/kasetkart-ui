import { CSVLink, CSVDownload } from "react-csv";
import { Button } from '@/components/ui'
export default function ReportTableC() {
  const csvData = [
    // คอมเมนต์ (ไทย): ตารางถอดจากรูปภาพฝั่งขวา — บางช่องมีความละเอียดต่ำจึงประมาณค่า/อนุมานไว้
    // คอลัมน์สรุป: Discipline, TCI_Tier1, TCI_Tier2, Non_TCI, Total_National,
    // ACI, Q1, Q2, Q3, Q4, Delisted_Scopus, Total_Scopus, SCIE, SSCI, ESCI, ABCI,
    // Total_Web_of_Science, A_star, A, B, C, Total_AB, AJG1, AJG2, AJG3, AJG4, AJG5,
    // Total_AJG, Other_PJR, Total_International_MultiCount, Total_Publications_MultiCount
    [
      "Discipline",
      "TCI_Tier1",
      "TCI_Tier2",
      "Non_TCI",
      "Total_National",
      "ACI",
      "Q1",
      "Q2",
      "Q3",
      "Q4",
      "Delisted_Scopus",
      "Total_Scopus",
      "SCIE",
      "SSCI",
      "ESCI",
      "ABCI",
      "Total_Web_of_Science",
      "A*",
      "A",
      "B",
      "C",
      "Total_AB",
      "AJG1",
      "AJG2",
      "AJG3",
      "AJG4",
      "AJG5",
      "Total_AJG",
      "Other_PJR",
      "Total_International_MultiCount",
      "Total_Publications_MultiCount"
    ],
    // แถวข้อมูล (ค่าบางส่วนประมาณ/อนุมานจากภาพ)
    ["Accounting", 22.5, 6, 0, 28.5, 5, 1, 1, 1, 10.5, 0, 2.3, 1.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23.3, 51.8],
    ["Finance", 13.5, 10.5, 0, 24, 2, 1, 0, 4, 3, 0, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 39],
    ["Management", 17, 55.3, 2, 74.3, 3.3, 4.3, 5.3, 12, 0.8, 0, 1.3, 22.7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 50.6, 124.8],
    ["Marketing", 10.7, 24.5, 1, 36.2, 6.3, 0, 1.7, 3, 1.5, 0, 0.3, 12.5, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 37.8, 74],
    ["Technology and Operation Management", 38.3, 18.7, 0, 57, 21.3, 0, 1.7, 3, 1, 0, 0.3, 12.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 39.8, 96.8],
    ["Total", 102, 115, 3, 220, 38, 7, 10.7, 32.5, 6.8, 0, 10.2, 117, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 19, 17, 175, 395]
  ];
  const reportData = [
    {
      discipline: "Accounting",
      tciTier1: 22.5,
      tciTier2: 6.0,
      nonListedTci: 0.0,
      totalNational: 28.5,
      aci: 5.0,
      q1: 1.0,
      q2: 1.0,
      q3: 10.5,
      q4: 0.5,
      delistedFromScopus: 0,
      totalScopus: 2.3,
      sciE: 1.5,
      ssci: 0,
      esci: 0,
      abci: 0,
      eSci: 0,
      totalA: 0,
      a: 0,
      b: 0,
      c: 0,
      totalAJG: 0,
      aj1: 0,
      aj2: 0,
      aj3: 0,
      aj4: 0,
      aj4Star: 0,
      totalOther: 3,
      otherPjr: 1,
      totalInternational: 23.3,
      totalPublications: 51.8
    },
    {
      discipline: "Finance",
      tciTier1: 13.5,
      tciTier2: 10.5,
      nonListedTci: 0.0,
      totalNational: 24.0,
      aci: 2.0,
      q1: 1.0,
      q2: 0,
      q3: 4.0,
      q4: 3.0,
      delistedFromScopus: 0,
      totalScopus: 6.0,
      sciE: 7.0,
      ssci: 0,
      esci: 0,
      abci: 0,
      eSci: 0,
      totalA: 0,
      a: 0,
      b: 0,
      c: 0,
      totalAJG: 0,
      aj1: 0,
      aj2: 0,
      aj3: 0,
      aj4: 0,
      aj4Star: 0,
      totalOther: 1,
      otherPjr: 1,
      totalInternational: 15.0,
      totalPublications: 39.0
    },
    {
      discipline: "Management",
      tciTier1: 17.0,
      tciTier2: 55.3,
      nonListedTci: 2.0,
      totalNational: 74.3,
      aci: 3.3,
      q1: 4.3,
      q2: 5.3,
      q3: 12.0,
      q4: 0.8,
      delistedFromScopus: 0,
      totalScopus: 1.3,
      sciE: 22.7,
      ssci: 0,
      esci: 0,
      abci: 0,
      eSci: 0,
      totalA: 0,
      a: 0,
      b: 0,
      c: 0,
      totalAJG: 0,
      aj1: 0,
      aj2: 0,
      aj3: 0,
      aj4: 0,
      aj4Star: 0,
      totalOther: 4,
      otherPjr: 4,
      totalInternational: 50.6,
      totalPublications: 124.8
    },
    {
      discipline: "Marketing",
      tciTier1: 10.7,
      tciTier2: 24.5,
      nonListedTci: 1.0,
      totalNational: 36.2,
      aci: 6.3,
      q1: 0.0,
      q2: 1.7,
      q3: 3.0,
      q4: 1.5,
      delistedFromScopus: 0,
      totalScopus: 0.3,
      sciE: 12.5,
      ssci: 0,
      esci: 0,
      abci: 1,
      eSci: 1,
      totalA: 1.0,
      a: 0,
      b: 0,
      c: 0,
      totalAJG: 0,
      aj1: 0,
      aj2: 0,
      aj3: 0,
      aj4: 0,
      aj4Star: 0,
      totalOther: 10,
      otherPjr: 10,
      totalInternational: 37.8,
      totalPublications: 74.0
    },
    {
      discipline: "Technology and Operation Management",
      tciTier1: 38.3,
      tciTier2: 18.7,
      nonListedTci: 0.0,
      totalNational: 57.0,
      aci: 21.3,
      q1: 0.0,
      q2: 1.7,
      q3: 3.0,
      q4: 1.0,
      delistedFromScopus: 0,
      totalScopus: 0.3,
      sciE: 12.5,
      ssci: 0,
      esci: 0,
      abci: 0,
      eSci: 0,
      totalA: 0,
      a: 0,
      b: 0,
      c: 0,
      totalAJG: 0,
      aj1: 0,
      aj2: 0,
      aj3: 0,
      aj4: 0,
      aj4Star: 0,
      totalOther: 1,
      otherPjr: 1,
      totalInternational: 39.8,
      totalPublications: 96.8
    }
  ]

  const totalRow = {
    discipline: "Total",
    tciTier1: 102.0,
    tciTier2: 115.0,
    nonListedTci: 3.0,
    totalNational: 220.0,
    aci: 38.0,
    q1: 7.0,
    q2: 10.7,
    q3: 32.5,
    q4: 6.8,
    delistedFromScopus: 0,
    totalScopus: 10.2,
    sciE: 117.0,
    ssci: 0.0,
    esci: 0.0,
    abci: 1.0,
    eSci: 1.0,
    totalA: 1.0,
    a: 0,
    b: 0,
    c: 0,
    totalAJG: 0,
    aj1: 0,
    aj2: 0,
    aj3: 0,
    aj4: 0,
    aj4Star: 0,
    totalOther: 19.0,
    otherPjr: 17.0,
    totalInternational: 175.0,
    totalPublications: 395.0
  }

  return (
    <>
      <div className="bg-white rounded-lg border overflow-hidden">
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[2000px]">
          <thead>
            <tr>
              <th
                className="bg-blue-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r"
                rowSpan="2"
              >
                Discipline
              </th>
              <th
                className="bg-green-100 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-b"
                colSpan="4"
              >
                National Publications
              </th>
              <th
                className="bg-pink-200 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-b"
                colSpan="26"
              >
                International Publications
              </th>
              <th
                className="bg-orange-50 border-b px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider"
                rowSpan="3"
              >
                Total Publications<br />(National + International)<br />with single count
              </th>
              
              
            </tr>
            <tr>
              <th className="bg-green-100 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                TCI<br/>(Tier 1)
              </th>
              <th className="bg-green-100 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                TCI<br/>(Tier 2)
              </th>
              <th className="bg-green-100 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Non-listed<br/>on TCI
              </th>
              <th className="bg-green-100 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Total<br/>National<br/>Publications
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                ACI
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Q1
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Q2
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Q3
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Q4
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Delisted from Scopus (as of July 2024)
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Total Scopus
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                SCIE
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                SSCI
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                ESCI
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                ABCI
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                ESCI
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Total<br/>Web of Science
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                A*
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                A
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                B
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                C
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Total<br/>ABDC
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                AJG1
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                AJG2
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                AJG3
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                AJG4
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                AJG4*
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Total<br/>AJG
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Other PJR
              </th>
              <th className="bg-pink-200 px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">
                Total<br/>International<br/>Publications
              </th>
              
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 border-r font-medium">
                  {row.discipline}
                </td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.tciTier1}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.tciTier2}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.nonListedTci}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r font-medium">{row.totalNational}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.aci}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.q1}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.q2}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.q3}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.q4}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.delistedFromScopus}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.totalScopus}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.sciE}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.ssci}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.esci}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.abci}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.eSci}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.totalA}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.a}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.b}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.c}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.totalAJG}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.aj1}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.aj2}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.aj3}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.aj4}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.aj4Star}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.totalOther}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{row.otherPjr}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r font-medium">{row.totalInternational}</td>
                <td className="px-2 py-3 text-sm text-center text-gray-900 border-r font-medium">{row.totalInternational}</td>
                <td className="bg-orange-50 px-4 py-3 text-sm text-center text-gray-900 font-medium">{row.totalPublications}</td>
              </tr>
            ))}
            
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-3 text-sm text-gray-900 border-r font-bold">{totalRow.discipline}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.tciTier1}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.tciTier2}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.nonListedTci}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r font-bold">{totalRow.totalNational}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.aci}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.q1}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.q2}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.q3}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.q4}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.delistedFromScopus}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.totalScopus}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.sciE}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.ssci}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.esci}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.abci}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.eSci}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.totalA}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.a}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.b}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.c}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.totalAJG}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.aj1}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.aj2}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.aj3}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.aj4}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.aj4Star}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.totalOther}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r">{totalRow.otherPjr}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r font-bold">{totalRow.totalInternational}</td>
              <td className="px-2 py-3 text-sm text-center text-gray-900 border-r font-bold">{totalRow.totalInternational}</td>
              <td className="bg-orange-50 px-4 py-3 text-sm text-center text-gray-900 font-bold">{totalRow.totalPublications}</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
      <CSVLink filename={"Report4.xlsx"} data={csvData}><Button 
        variant="success"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
      >
        <span>Export</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-3 3-3-3M12 12v9M5 20h14" />
        </svg>
      </Button></CSVLink>
    </>
  )
}
