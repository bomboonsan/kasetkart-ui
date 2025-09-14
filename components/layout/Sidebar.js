"use client";

import { useSWRConfig } from "swr";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserPen,
  Files,
  ChartArea,
  UsersRound,
  File,
  FileUser,
} from "lucide-react";
import { API_BASE } from "@/lib/api-base";
import { useSession, signOut } from "next-auth/react";

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
        label: "ทุนตำรวจหรือหนังสือ",
        active: false,
      },
      {
        id: "book",
        url: "/form/create/book",
        icon: <File />,
        label: "หนังสือและตำรา",
        active: false,
      },
    ],
  },
];

export default function Sidebar() {
  const { cache, mutate } = useSWRConfig();

  const clearAll = () => {
    for (const key of cache.keys()) {
      mutate(key, null, { revalidate: false });
    }
  };

  const router = useRouter();
  const [openGroups, setOpenGroups] = useState({});

  const { data: session, status } = useSession();
  const user = session?.user;
  const profile = user?.profile || {};
  useEffect(() => {
    if (status !== "loading") {
      // no-op
    }
  }, [status, session]);

  const resolveAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (typeof avatar === "string") return avatar;
    if (avatar.data?.attributes?.url) return avatar.data.attributes.url;
    if (typeof avatar.url === "string") return avatar.url;
    if (Array.isArray(avatar.data) && avatar.data[0]?.attributes?.url)
      return avatar.data[0].attributes.url;
    const fmt = avatar.data?.attributes?.formats || avatar.formats;
    if (fmt && typeof fmt === "object") {
      const firstKey = Object.keys(fmt)[0];
      if (firstKey && fmt[firstKey]?.url) return fmt[firstKey].url;
    }
    return null;
  };

  const displayName =
    [profile.firstNameTH || user?.email, profile.lastNameTH]
      .filter(Boolean)
      .join(" ")
      .trim() || "";
  let avatarUrl = resolveAvatarUrl(profile.avatarUrl);
  if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
    const mediaBase = API_BASE.replace(/\/api\/?$/, "");
    avatarUrl = `${mediaBase}${avatarUrl}`;
  }
  const roleId =
    user?.roleId ?? (typeof user?.role === "number" ? user.role : null);
  const roleNameFromUser =
    typeof user?.role === "string" ? user.role : user?.role?.name || null;
  const role =
    roleId === 1
      ? "Super admin"
      : roleId === 3
        ? "Admin"
        : roleNameFromUser || "User";
  const userEmail = user?.email || "";

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
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleLogout() {
    try {
      clearAll();
      const maybeKeys = [
        "nextauth.token",
        "next-auth.session-token",
        "next-auth.callback-url",
        "me",
        "user",
        "profile",
        "swr-cache",
      ];
      maybeKeys.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch (e) {
          /* ignore */
        }
      });
      try {
        sessionStorage.clear();
      } catch (e) {
        /* ignore */
      }
      const cookiesToClear = [
        "next-auth.session-token",
        "next-auth.callback-url",
        "next-auth.csrf-token",
        "__Secure-next-auth.session-token",
        "__Host-next-auth.csrf-token",
        "next-auth.pkce.code_verifier",
      ];
      cookiesToClear.forEach((cookieName) => {
        try {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; secure; samesite=lax`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=lax`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        } catch (e) {
          /* ignore */
        }
      });
    } finally {
      signOut({
        redirect: false,
        callbackUrl: "/login",
      }).finally(() => {
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      });
    }
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
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
												${item.active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                          <span className="flex items-center gap-3">
                            {item.icon}
                            {item.label}
                          </span>
                          <svg
                            className={`w-4 h-4 transform transition-transform ${openGroups[item.id] ? "rotate-90" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>

                        {/* children links */}
                        {openGroups[item.id] && (
                          <ul className="mt-2 space-y-1 pl-8">
                            {item.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={child.url ? child.url : "#"}
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
                        href={item.url ? item.url : "#"}
                        className={`
											flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
											${item.active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}
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
            <div className="px-6">
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
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
												${item.active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                          <span className="flex items-center gap-3">
                            {item.icon}
                            {item.label}
                          </span>
                          <svg
                            className={`w-4 h-4 transform transition-transform ${openGroups[item.id] ? "rotate-90" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>

                        {/* children links */}
                        {openGroups[item.id] && (
                          <ul className="mt-2 space-y-1 pl-8">
                            {item.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={child.url ? child.url : "#"}
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
                        href={item.url ? item.url : "#"}
                        className={`
											flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
											${item.active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}
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

      {/* User Menu */}
      <div className="p-4 border-t border-gray-200 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName || userEmail}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-600 font-semibold">
                  {(displayName || userEmail || "?").slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {displayName || userEmail || ""}
              </div>
              <div className="text-xs text-gray-500">{role}</div>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 text-center cursor-pointer block w-full text-white bg-red-700 hover:bg-red-600 rounded-md border border-gray-200 "
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
