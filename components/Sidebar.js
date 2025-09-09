"use client"

import { useEffect, useState } from 'react'
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
import { profileAPI, API_BASE } from '@/lib/api'
import { getUserRole } from '@/lib/auth'

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

const adminMenuItems = [
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

export default function Sidebar() {
  const router = useRouter();
  const [openGroups, setOpenGroups] = useState({})
  const [userDisplayName, setUserDisplayName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [role, setRole] = useState('User')

  // Mock user data แทน API call
  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        const res = await profileAPI.getMyProfileSidebar()

        // res may be the user object directly or { data: ... }
        const user = res?.data || res || {}

        const backendURL = "http://localhost:1337"

        // Try multiple possible fields for display name
        const firstName = user.profile.firstNameTH || user.email
        const lastName = user.profile.lastNameTH || ''
        const display = [firstName, lastName].filter(Boolean).join(' ').trim()

        // Attempt to find avatar URL in common Strapi shapes
        let url = null
        // common shapes: user.avatar.data.attributes.url OR user.avatar.url OR user.profileImage.data.attributes.url
        const tryPaths = [
          user?.avatar?.data?.attributes?.url,
          user?.avatar?.url,
          user?.profileImage?.data?.attributes?.url,
          user?.profile_image?.data?.attributes?.url,
          user?.picture?.data?.attributes?.url,
          user?.image?.data?.attributes?.url,
          user?.avatarUrl,

          user?.profile?.avatarUrl?.url || user?.profile?.avatarUrl,
        ]

        for (const p of tryPaths) {
          if (p) { url = p; break }
        }

        // If url is relative (starts with /), prefix API base without /api
        if (url && !/^https?:\/\//i.test(url)) {
          const mediaBase = API_BASE.replace(/\/api\/?$/, '')
          url = `${mediaBase}${url}`
        }

        if (mounted) {
          setUserDisplayName(display || 'ผู้ใช้งาน')
          setUserEmail(user.email || '')
          setAvatarUrl(url || '')
          setRole(user.role.name || 'User')
        }
      } catch (err) {
    // fallback to mock values; avoid console logging in production UI
        if (mounted) {
          setUserDisplayName('ผู้ใช้งาน')
          setUserEmail('user@example.com')
          setAvatarUrl('')
          setRole(user.role.name || 'User')
        }
      }
    }

    loadProfile()

    return () => { mounted = false }
  }, [])

  function toggleGroup(id) {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function handleLogout() {
    // Clear client-side auth (localStorage + cookie) so middleware and client know user is logged out
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt')
        // remove cookie by setting it expired
        document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      }
    } catch (err) {
      // ignore token clearing errors
    }

    // Reset UI state
    setUserDisplayName('')
    setUserEmail('')

    // Redirect to login
    router.push('/login')
  }

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
        {role == "Super admin" || role == "Admin" ? (
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
      </div>

      {/* User Detail */}
      <div className="px-6">
        <hr className="my-4 border-gray-200" />
        <div className="flex items-center py-2">
          <div className="mr-3">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={userDisplayName || 'avatar'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xs font-semibold text-white">
                {(userDisplayName || userEmail || 'U').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-900">{userDisplayName || userEmail || '-'}</p>
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
