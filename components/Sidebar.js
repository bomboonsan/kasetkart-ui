import Image from 'next/image'
import Link from 'next/link'

const menuItems = [
  { id: "home", url: "/dashboard", label: "Home", active: false },
  { id: "profile", url: "/dashboard/profile", label: "Profile", active: false },
  {
    id: "dashboard/form/overview",
    url: "/dashboard/form/overview",
    label: "Forms",
    active: false,
  },
  { id: "reports", url: "#", label: "Reports", active: false },
  {
    id: "dashboard/admin/manage-users",
    url: "/dashboard/admin/manage-users",
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
                  block px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${item.active 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
