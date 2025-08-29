import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        {/* <Header title="Dashboard" /> */}
        <main className="p-6 max-w-screen-2xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
