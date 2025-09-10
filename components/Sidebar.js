"use client"

import { useState , useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  UserPen,
  Files,
  ChartArea,
  UsersRound,
  File,
  FileUser,
} from "lucide-react";
import { API_BASE } from '@/lib/api-base'
import { useSession, signOut } from 'next-auth/react'

const menuItems = [
  {
    id: "profile",
    url: "/profile",
    icon: <UserPen />,
    label: "โปรไฟล์ของฉัน",
    active: false,
  },
  {
    id: "form/overview",
    url: "/form/overview",
    icon: <FileUser />,
    label: "โครงการของฉัน",
    active: false,
  },
  // Forms will be rendered as a nav-group (collapsible). children are defined below
  {
    id: "dashboard/form/add",
    url: "#",
    icon: <Files />,
    label: "สร้างโครงการ",
    active: false,
    children: [
      {
        id: "project",
        url: "/form/create/project",
        icon: <File />,
        label: "ทุนโครงการวิจัย",
        active: false,
      },
      {
        id: "conference",
        url: "/form/create/conference",
        icon: <File />,
        label: "ประชุมวิชาการ",
        active: false,
      },
      {
        id: "publications",
        url: "/form/create/publications",
        icon: <File />,
        label: "ตีพิมพ์ทางวิชาการ",
        active: false,
      },
      {
        id: "funding",
        url: "/form/create/funding",
        icon: <File />,
        label: "ทุนตำราหรือหนังสือ",
        active: false,
      },
      {
        id: "book",
        url: "/form/create/book",
        icon: <File />,
        label: "หนังสือและตำรา",
        active: false,
      }
    ]
  },
];

export default function Sidebar() {
  const router = useRouter()
  const [openGroups, setOpenGroups] = useState({})

  // เปลี่ยนแนวทาง: ไม่ใช้ useEffect + state ในการเซ็ตข้อมูลผู้ใช้
  // เพราะอาจเกิดปัญหา timing/hydration ทำให้ข้อมูลไม่แสดงบน client
  // ให้คำนวณค่าจาก session โดยตรงใน render เพื่อความคงที่
  const { data: session , status } = useSession()
  const user = session?.user
  const profile = user?.profile || {}
  useEffect(() => {
    if (status !== 'loading') {
      console.debug('Session status:', status, 'user:', session?.user)
    }
  }, [status, session])

  // ฟังก์ชันช่วยแปลงรูปแบบ avatar ที่ต่างกันของ Strapi เป็นสตริง URL
  const resolveAvatarUrl = (avatar) => {
    if (!avatar) return null
    if (typeof avatar === 'string') return avatar
    if (avatar.data?.attributes?.url) return avatar.data.attributes.url
    if (typeof avatar.url === 'string') return avatar.url
    if (Array.isArray(avatar.data) && avatar.data[0]?.attributes?.url) return avatar.data[0].attributes.url
    const fmt = avatar.data?.attributes?.formats || avatar.formats
    if (fmt && typeof fmt === 'object') {
      const firstKey = Object.keys(fmt)[0]
      if (firstKey && fmt[firstKey]?.url) return fmt[firstKey].url
    }
    return null
  }

  const displayName = [profile.firstNameTH || user?.email, profile.lastNameTH].filter(Boolean).join(' ').trim() || ''
  let avatarUrl = resolveAvatarUrl(profile.avatarUrl)
  if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
    const mediaBase = API_BASE.replace(/\/api\/?$/, '')
    avatarUrl = `${mediaBase}${avatarUrl}`
  }
  // กำหนด role โดยพยายามอ่าน roleId ก่อน (ถ้ามีเป็นตัวเลข)
  // ตามข้อกำหนด: 1 = Super admin, 2 = User, 3 = Admin
  // ถ้าไม่มี roleId ให้ fallback ไปใช้ชื่อ role ที่ backend ส่งมา
  const roleId = user?.roleId ?? (typeof user?.role === 'number' ? user.role : null)
  const roleNameFromUser = typeof user?.role === 'string' ? user.role : (user?.role?.name || null)
  const role = roleId === 1 ? 'Super admin' : roleId === 3 ? 'Admin' : (roleNameFromUser || 'User')
  const userEmail = user?.email || ''

  let adminMenuItems;
  if (role == "Admin") {
    adminMenuItems = [
      {
        id: "form/overview",
        url: "/dashboard/admin/form/overview",
        icon: <FileUser />,
        label: "โครงการทั้งหมด",
        active: false,
      },
      {
        id: "dashboard/user/manage",
        url: "#",
        icon: <UsersRound />,
        label: "จัดการผู้ใช้",
        active: false,
        children: [
          {
            id: "dashboard/admin/manage-users",
            url: "/dashboard/admin/manage-users",
            icon: <UsersRound />,
            label: "รายชื่อผู้ใช้",
            active: false,
          },
          {
            id: "dashboard/admin/add-user",
            url: "/dashboard/admin/add-user",
            icon: <UsersRound />,
            label: "เพิ่มผู้ใช้",
            active: false,
          },
        ],
      },
    ];
  }
  if (role == "Super admin") {
    adminMenuItems = [
      {
        id: "dashbaord",
        url: "/dashboard",
        icon: <LayoutDashboard />,
        label: "แดชบอร์ด",
        active: false,
      },
      {
        id: "reports",
        url: "/dashboard/report",
        icon: <ChartArea />,
        label: "ดูรายงาน",
        active: false,
      },
      {
        id: "form/overview",
        url: "/dashboard/admin/form/overview",
        icon: <FileUser />,
        label: "โครงการทั้งหมด",
        active: false,
      },
      {
        id: "dashboard/user/manage",
        url: "#",
        icon: <UsersRound />,
        label: "จัดการผู้ใช้",
        active: false,
        children: [
          {
            id: "dashboard/admin/manage-users",
            url: "/dashboard/admin/manage-users",
            icon: <UsersRound />,
            label: "รายชื่อผู้ใช้",
            active: false,
          },
          {
            id: "dashboard/admin/add-user",
            url: "/dashboard/admin/add-user",
            icon: <UsersRound />,
            label: "เพิ่มผู้ใช้",
            active: false,
          },
        ],
      },
    ];
  }

  function toggleGroup(id) {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function handleLogout() { signOut({ callbackUrl: '/login' }) }

  return (
    <div className="sticky top-0 w-64 bg-white border-r border-gray-200 h-screen flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Image
              src="/Logo.png"
              alt="KU Logo"
              width={32}
              height={32}
              className="rounded"
              unoptimized
            />
            <span className="font-bold text-2xl text-gray-800">Kasetsart</span>
          </div>
        </div>

        {role != "Admin" && (
          <>
          {/* Navigation */}
          <nav className="mt-4 desktop-nav">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleGroup(item.id)}
                        aria-expanded={!!openGroups[item.id]}
                        className={
                          `w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${item.active ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
                        }
                      >
                        <span className="flex items-center gap-3">
                          {item.icon}
                          {item.label}
                        </span>
                        <svg
                          className={`w-4 h-4 transform transition-transform ${openGroups[item.id] ? 'rotate-90' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* children links */}
                      {openGroups[item.id] && (
                        <ul className="mt-2 space-y-1 pl-8">
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={child.url ? child.url : '#'}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100`}
                              >
                                {child.icon}
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
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
                  )}
                </li>
              ))}
            </ul>
            
          </nav>
          </>
        )}
        {role == "Super admin" ? (
          <>
          <div className='px-6'>
            <hr className="my-4 border-gray-200" />
          </div>
          {/* Admin Section */}
          <nav className="mt-4 desktop-nav">
            <ul className="space-y-1 px-2">
              {adminMenuItems.map((item) => (
                <li key={item.id}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleGroup(item.id)}
                        aria-expanded={!!openGroups[item.id]}
                        className={
                          `w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${item.active ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
                        }
                      >
                        <span className="flex items-center gap-3">
                          {item.icon}
                          {item.label}
                        </span>
                        <svg
                          className={`w-4 h-4 transform transition-transform ${openGroups[item.id] ? 'rotate-90' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* children links */}
                      {openGroups[item.id] && (
                        <ul className="mt-2 space-y-1 pl-8">
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={child.url ? child.url : '#'}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100`}
                              >
                                {child.icon}
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
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
                  )}
                </li>
              ))}
            </ul>
          </nav>
          </>
        ) : null}

        {role == "Admin" ? (
          <>
          <div className='px-6'>
            <hr className="my-4 border-gray-200" />
            </div>
            <nav className="mt-4 desktop-nav">
              <ul className="space-y-1 px-2">
                {adminMenuItems.map((item) => (
                  <li key={item.id}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleGroup(item.id)}
                          aria-expanded={!!openGroups[item.id]}
                          className={
                            `w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${item.active ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
                          }
                        >
                          <span className="flex items-center gap-3">
                            {item.icon}
                            {item.label}
                          </span>
                          <svg
                            className={`w-4 h-4 transform transition-transform ${openGroups[item.id] ? 'rotate-90' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* children links */}
                        {openGroups[item.id] && (
                          <ul className="mt-2 space-y-1 pl-8">
                            {item.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={child.url ? child.url : '#'}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100`}
                                >
                                  {child.icon}
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
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
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </>
          
        ) : null}
      </div>

      {/* User Detail */}
      <div className="px-6">
        <hr className="my-4 border-gray-200" />
        <div className="flex items-center py-2">
          <div className="mr-3">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                // แก้ไข: ใช้ตัวแปร displayName แทน userDisplayName ที่ถูกลบไป
                alt={displayName || 'avatar'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xs font-semibold text-white">
                {(displayName || userEmail || 'U').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            {/* แสดงชื่อผู้ใช้ ถ้าไม่มีให้ใช้ email หรือ '-' */}
            <p className="text-sm text-gray-900">{displayName || userEmail || '-'}</p>
            <Link href="/profile" className="text-xs text-gray-600">โปรไฟล์ของฉัน</Link>
          </div>
        </div>
        {/* Logout */}
        <div className='mt-3 pb-2'>
          <button onClick={handleLogout} className='flex justify-center items-center w-full gap-4 p-2 rounded-md bg-red-700 text-white font-bold uppercase cursor-pointer hover:bg-red-600'>
            Logout
          </button>
        </div>
      </div>

    </div>
  )
}
