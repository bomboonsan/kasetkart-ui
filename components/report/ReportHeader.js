"use client"
import SelectField from '@/components/ui/SelectField'
import { Button } from '@/components/ui'
import { CSVLink, CSVDownload } from "react-csv";

// คอมเมนต์ (ไทย): ข้อมูลตารางถอดจากรูปภาพ (อ่านค่าบางค่าจากภาพที่ความละเอียดต่ำ จึงประมาณ/อนุมานบางช่อง)
// คอลัมน์: Discipline, TotalMembers, MembersWithoutICS, MembersWithICS,
// Portfolio_BDS, Portfolio_AIS, Portfolio_TLS, Portfolio_Total,
// Types_BDS, Types_APR_ER_Proceeding, Types_AllOther, Types_Total,
// Percent_Part, Percent_All
const csvData1 = [
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

const csvData2 = [

];

const csvData3 = [
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

// controlled: accept selectedReport and onChange so parent can drive which table shows
export default function ReportHeader({ selectedReport, onChange }) {
  const reportOptions = [
    { 
  value: 'table-a', 
      label: 'Table 8-1 Part A: Intellectual Contribution (IC) Strategies for SA and PA (2019-2023)' 
    },
    { 
  value: 'table-b', 
      label: 'Table 8-1 Part B: Alignment with Mission ' 
    },
    { 
  value: 'table-c', 
      label: 'Table 8-1 Part C: Quality of Intellectual Contribution (Multiple counts)' 
    },
    { 
  value: 'table-d', 
      label: 'Table 8-1 Part C: Quality of Intellectual Contribution (Single count)' 
    },
    { 
  value: 'table-e', 
      label: 'รายงานข้อมูลการตีพิมพ์ผลงานวิจัยในวารสารวิชาการระดับชาติและนานาชาติ' 
    },
    {
  value: 'table-f',
      label: 'รายงานนำเสนอผลงานทางวิชาการระดับชาติและนานาชาติ'
    }
  ]

  const exportOptions = [
    // { value: 'pdf', label: 'Export as PDF' },
    { value: 'excel', label: 'Export as Excel' },
    // { value: 'csv', label: 'Export as CSV' }
  ]

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            {/* <CSVLink data={csvData1}><Button 
              variant="success"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <span>Export</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-3 3-3-3M12 12v9M5 20h14" />
              </svg>
            </Button></CSVLink> */}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ประเภทรายงาน
        </label>
        <SelectField
          value={selectedReport || 'table-a'}
          onChange={onChange}
          options={reportOptions}
          className="max-w-2xl"
        />
      </div>
    </div>
  )
}
