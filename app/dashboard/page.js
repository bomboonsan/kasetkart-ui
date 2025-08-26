import Link from 'next/link'

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className='grid grid-cols-6 gap-5'>
        <div className='col-span-6 p-6 border rounded-lg shadow-sm space-y-2 bg-white'>
          <h2 className='text-lg text-gray-900'>สรุปจำนวนผลงานวิชาการทั้งหมดของคณะ</h2>
        </div>
        <div className='col-span-6 md:col-span-2 p-6 border rounded-lg shadow-sm space-y-2 bg-white'>
          <h2 className='text-lg text-gray-900'>ภาพรวมประเภทบุคคลากรของคณะ</h2>
        </div>
        <div className='col-span-6 md:col-span-4 p-6 border rounded-lg shadow-sm space-y-2 bg-white'>
          <h2 className='text-lg text-gray-900'>ภาพรวมประเภทบุคคลากรของภาควิชา</h2>
        </div>
        <div className='col-span-6 md:col-span-3 p-6 border rounded-lg shadow-sm space-y-2 bg-white'>
          <h2 className='text-lg text-gray-900'>ภาพรวมตามสาขาวิชา</h2>
        </div>
      </div>
    </div>
  )
}
