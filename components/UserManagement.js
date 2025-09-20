"use client";

// ใช้ SWR โหลดรายชื่อผู้ใช้ และใช้ mutate หลัง action เพื่อรีเฟรช
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import useSWR, { mutate } from 'swr'
import UserTable from "./UserTable";
import UserFilters from "./UserFilters";
import UserModal from "./UserModal";
import { api, API_BASE } from "@/lib/api";

// คอมเมนต์ (ไทย): สร้าง Base URL สำหรับไฟล์โดยเฉพาะ
const API_PUBLIC_URL = API_BASE.replace('/api', '');

// User API functions for Strapi v5
const userAPI = {
  async updateUser(documentId, data) {
    return api.put(`/users/${documentId}`, data);
  },
  
  async updateUserStatus(documentId, blocked, confirmed) {
    return api.put(`/users/${documentId}`, { blocked, confirmed });
  },
  
  async createUser(data) {
    return api.post('/auth/local/register', data);
  },
  
  async deleteUser(documentId) {
    return api.delete(`/users/${documentId}`);
  }
};

const mapRoleToLabel = (role) => {
  switch (role) {
    case "SUPERADMIN":
      return "Super Admin";
    case "ADMIN":
      return "Admin";
    case "USER":
    default:
      return "User";
  }
};

const mapApprovalToStatus = (approvalStatus) => {
  switch (approvalStatus) {
    case "APPROVED":
      return "Active";
    case "DISABLED":
      return "Inactive";
    case "PENDING":
    default:
      return "Pending";
  }
};

function toAvatar(text) {
  const src = (text || "").trim();
  if (!src) return "U";
  const parts = src.split(/[\s.@_-]+/).filter(Boolean);
  const first = parts[0]?.[0] || "U";
  const second = parts[1]?.[0] || "";
  return (first + second).toUpperCase();
}

const UserManagement = forwardRef((props, ref) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', 'create'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // โหลดรายชื่อผู้ใช้ด้วย SWR - populate relations เพื่อได้ department, role, faculty
  const { data: usersRes, error: usersErr, isLoading } = useSWR(
    'users-all', 
    () => api.get('/users?populate[department]=*&populate[role]=*&populate[faculty]=*&populate[academic_type]=*&populate[organization]=*&populate[profile][populate][avatarUrl]=*&pagination[pageSize]=30'),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  // เมื่อข้อมูลผู้ใช้เปลี่ยน แปลงเป็นโครงสร้างที่ตารางใช้งาน แล้วเซ็ต filteredUsers เริ่มต้น
  useEffect(() => {
    try {
      const usersData = usersRes?.data || usersRes || [];
  const mapped = usersData.map((u) => {
  // Extract data from Strapi v5 structure
  const profile = u.profile;
        const firstName = profile?.firstNameTH || '';
        const lastName = profile?.lastNameTH || '';
        const displayName = `${firstName} ${lastName}`.trim() || u.username || u.email;
        
        // Map role from Strapi role relation
        const roleType = u.role?.name || 'authenticated';
        const roleLabel = roleType === 'Super admin' ? 'SUPERADMIN' : 
          roleType === 'Admin' ? 'ADMIN' : 'USER';
        // Map department, faculty, organization
        const department = u.department?.name || '-';
        const faculty = u.faculty?.name || '-';
        const organization = u.organization?.name || '-';

        // mapping completed for user
        
        // Map status from user fields
        const status = u.blocked ? 'Inactive' : 
          u.confirmed ? 'Active' : 'Pending';
    
    
        console.log("Mapped user:", profile, displayName, roleType, roleLabel, department, faculty, status);

        return {
          id: u.id,
          documentId: u.documentId, // Strapi v5 documentId
          name: displayName,
          email: u.email,
          username: u.username,
          role: roleLabel,
          department: department,
          faculty: faculty,
          organization: u.organization?.name || '-',
          status: status,
          lastLogin: "Never", // Strapi doesn't track this by default
          avatar: toAvatar(displayName || u.email),
          // คอมเมนต์ (ไทย): แก้ไขให้สร้าง URL ของรูปภาพให้สมบูรณ์
          avatarUrl: profile?.avatarUrl?.url ? `${API_PUBLIC_URL}${profile.avatarUrl.url}` : '',
          blocked: u.blocked,
          confirmed: u.confirmed,
          rawData: u,
        };
      });
      setUsers(mapped);
      setFilteredUsers(mapped);
    } catch (err) {
      setError(err.message || "ไม่สามารถโหลดข้อมูลผู้ใช้");
    }
  }, [usersRes]);

  useImperativeHandle(ref, () => ({
    openCreateModal: () => {
      handleUserAction("create");
    },
  }));

  const handleFilter = (filters) => {
    let filtered = users;

    if (filters.search) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    if (filters.role && filters.role !== "all") {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((user) => user.status === filters.status);
    }

    if (filters.department && filters.department !== "all") {
      filtered = filtered.filter(
        (user) => user.department === filters.department,
      );
    }

    if (filters.organization && filters.organization !== "all") {
      filtered = filtered.filter(
        (user) => user.organization === filters.organization,
      );
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (action, user = null) => {
    switch (action) {
      case "view":
        setSelectedUser(user);
        setModalMode("view");
        setIsModalOpen(true);
        break;
      case "edit":
        setSelectedUser(user);
        setModalMode("edit");
        setIsModalOpen(true);
        break;
      case "create":
        setSelectedUser(null);
        setModalMode("create");
        setIsModalOpen(true);
        break;
      case "delete":
        if (
          user &&
          window.confirm("Are you sure you want to delete this user?")
        ) {
          try {
            await userAPI.deleteUser(user.id || user.documentId);
            mutate('users-all'); // รีเฟรชรายการ
          } catch (err) {
            setError(err.message || "ไม่สามารถลบผู้ใช้");
          }
        }
        break;
      case "approve":
      case "activate":
        if (user) {
          try {
            await userAPI.updateUserStatus(user.id || user.documentId, false, true); // unblock and confirm
            mutate('users-all'); // รีเฟรชรายการ
          } catch (err) {
            setError(err.message || "ไม่สามารถอนุมัติผู้ใช้");
          }
        }
        break;
      case "disable":
      case "deactivate":
        if (user) {
          try {
            await userAPI.updateUserStatus(user.id || user.documentId, true, true); // block user
            mutate('users-all'); // รีเฟรชรายการ
          } catch (err) {
            setError(err.message || "ไม่สามารถปิดใช้งานผู้ใช้");
          }
        }
        break;
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (modalMode === "create") {
        const payload = {
          username: userData.username || userData.email,
          email: userData.email,
          password: userData.password || "defaultpassword123",
          confirmed: true,
          blocked: false
        };
        await userAPI.createUser(payload);
      } else if (modalMode === "edit" && selectedUser) {
        // Resolve role code/name to numeric role id that Strapi expects
        let roleId = undefined;
        try {
          const rolesRes = await api.get('/users-permissions/roles');
          // roles may be at rolesRes.roles or rolesRes.data or rolesRes
          const rolesList = rolesRes?.roles || rolesRes?.data || rolesRes || [];
          const match = rolesList.find(r => {
            const code = (r.code || '').toString();
            const name = (r.name || '').toString().toUpperCase();
            return code === userData.role || name === userData.role;
          });
          if (match) roleId = match.id;
        } catch (err) {
          /* ignore role resolution failure */
        }

        const payload = {
          email: userData.email,
          username: userData.username,
          // if we resolved a numeric role id, send it; otherwise try sending raw value
          ...(roleId ? { role: roleId } : { role: userData.role }),
          blocked: userData.status === 'Inactive',
          confirmed: userData.status !== 'Pending'
        };

        await userAPI.updateUser(selectedUser.id || selectedUser.documentId, payload);
      }
      mutate('users-all'); // Reload data with SWR
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err.message || "ไม่สามารถบันทึกข้อมูลผู้ใช้");
    }
  };

  return (
    <div className="space-y-6">
      {(error || usersErr) && (
        <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
          {error || usersErr?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล"}
        </div>
      )}

      <UserFilters onFilter={handleFilter} />

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <UserTable users={filteredUsers} onUserAction={handleUserAction} />
      )}

      {isModalOpen && (
        <UserModal
          user={selectedUser}
          mode={modalMode}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
});

UserManagement.displayName = "UserManagement";

export default UserManagement;
