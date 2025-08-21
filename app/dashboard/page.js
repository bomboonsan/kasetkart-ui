import Link from 'next/link'

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          ยินดีต้อนรับสู่ระบบ Portfolio
        </h1>
        <p className="text-gray-600 mb-8">
          จัดการข้อมูลส่วนตัว ผลงานวิจัย และข้อมูลทางวิชาการของคุณ
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/dashboard/profile"
            className="block p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <h3 className="font-semibold text-blue-900 mb-2">โปรไฟล์</h3>
            <p className="text-blue-700 text-sm">ดูและแก้ไขข้อมูลส่วนตัว</p>
          </Link>

          <Link 
            href="/dashboard/form/overview"
            className="block p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <h3 className="font-semibold text-green-900 mb-2">งานวิจัย</h3>
            <p className="text-green-700 text-sm">จัดการโครงการวิจัยของคุณ</p>
          </Link>

          <Link 
            href="/dashboard/form/create"
            className="block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <h3 className="font-semibold text-purple-900 mb-2">สร้างโครงการใหม่</h3>
            <p className="text-purple-700 text-sm">เริ่มต้นโครงการวิจัยใหม่</p>
          </Link>

          <Link 
            href="/dashboard/form/create-detail"
            className="block p-6 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <h3 className="font-semibold text-orange-900 mb-2">ผลงานตีพิมพ์</h3>
            <p className="text-orange-700 text-sm">จัดการผลงานทางวิชาการ</p>
          </Link>

          <Link 
            href="/dashboard/admin/manage-users"
            className="block p-6 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <h3 className="font-semibold text-indigo-900 mb-2">จัดการผู้ใช้</h3>
            <p className="text-indigo-700 text-sm">จัดการบัญชีผู้ใช้งาน</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
