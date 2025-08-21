import Image from 'next/image'
import Link from 'next/link'
import {
  LayoutDashboard,
  UserPen,
  Files,
  ChartArea,
  UsersRound,
  Hash,
} from "lucide-react";


const menuItems = [
  {
    id: "dashbaord",
    url: "/dashboard",
    icon: <LayoutDashboard />,
    label: "Dashboard",
    active: false,
  },
  {
    id: "profile",
    url: "/dashboard/profile",
    icon: <UserPen />,
    label: "Profile",
    active: false,
  },
  {
    id: "dashboard/form/overview",
    url: "/dashboard/form/overview",
    icon: <Files />,
    label: "Forms",
    active: false,
  },
  {
    id: "conference",
    url: "/dashboard/form/create/conference",
    icon: <Hash />,
    label: "SubForm 1 [DEMO]",
    active: false,
  },
  {
    id: "publications",
    url: "/dashboard/form/create/publications",
    icon: <Hash />,
    label: "SubForm 2 [DEMO]",
    active: false,
  },
  {
    id: "funding",
    url: "/dashboard/form/create/funding",
    icon: <Hash />,
    label: "SubForm 3 [DEMO]",
    active: false,
  },
  {
    id: "book",
    url: "/dashboard/form/create/book",
    icon: <Hash />,
    label: "SubForm 4 [DEMO]",
    active: false,
  },
  {
    id: "reports",
    url: "/dashboard/report",
    icon: <ChartArea />,
    label: "Reports",
    active: false,
  },
];

const adminMenuItems = [
  {
    id: "dashboard/admin/manage-users",
    url: "/dashboard/admin/manage-users",
    icon: <UsersRound />,
    label: "Manage Users",
    active: false,
  },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Image
            src="/Logo.png"
            alt="KU Logo"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="font-bold text-2xl text-gray-800">Kasetsart</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.url ? item.url : '#'}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${item.active 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className='px-6'>
        <hr className="my-4 border-gray-200" />
      </div>
      {/* Admin Section */}
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {adminMenuItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.url ? item.url : '#'}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${item.active 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
