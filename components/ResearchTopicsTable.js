import ResearchTopicRow from './ResearchTopicRow'

// Mock data for research topics
const mockResearchData = [
  {
    id: 1,
    number: '2548',
    title: 'ข้อนำเสนอข้อมูลการวิจัยเก่าที่สำคัญแก่ประเทศ',
    budget: 0,
    status: 'Done',
    color: 'green'
  },
  {
    id: 2,
    number: '2547',
    title: 'Stent PM 2.5 กับการ์บอนของหิน',
    budget: 120000,
    status: 'Draft',
    color: 'green'
  },
  {
    id: 3,
    number: '2546',
    title: 'AIR CONDITIONER FOR YOUTH THAN AND',
    budget: 1000000,
    status: 'Draft',
    color: 'green'
  },
  {
    id: 4,
    number: '2545',
    title: 'Telemeter for thai people',
    budget: 50000,
    status: 'Draft',
    color: 'green'
  },
  {
    id: 5,
    number: '2543',
    title: 'คิวอนแลกซ์',
    budget: 200000,
    status: 'Draft',
    color: 'green'
  }
]

export default function ResearchTopicsTable() {
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Table Header */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-100">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
          <div className="col-span-1">No.</div>
          <div className="col-span-1">ปีงบประมาณ</div>
          <div className="col-span-3">ชื่อโครงการวิจัย หรือ ผลงาน</div>
          <div className="col-span-2">วันที่ครบกำหนด</div>
          <div className="col-span-2">งบประมาณ</div>
          <div className="col-span-2">สถานะ</div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {mockResearchData.map((research, index) => (
          <ResearchTopicRow
            key={research.id}
            research={research}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
