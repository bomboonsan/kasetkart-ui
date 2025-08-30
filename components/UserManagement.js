"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import UserTable from "./UserTable";
import UserFilters from "./UserFilters";
import UserModal from "./UserModal";
import { userAPI } from "@/lib/api";

const mapRoleToLabel = (role) => {
  switch (role) {
    case "ADMIN":
      return "Moderator";
    case "SUPERADMIN":
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

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getUsers({ page: 1, pageSize: 100 });
      const usersData = res.data || res.items || res || [];
      const mapped = usersData.map((u) => {
        const prof = Array.isArray(u.Profile) ? u.Profile[0] : u.Profile;
        const displayName = prof
          ? `${prof.firstName || ""} ${prof.lastName || ""}`.trim() || u.email
          : u.email;
        return {
          id: u.id,
          name: displayName,
          email: u.email,
          role: mapRoleToLabel(u.role),
          department: u.Department?.name || "-",
          faculty: u.Faculty?.name || "-",
          organization: u.Organization?.name || "-",
          status: mapApprovalToStatus(u.approvalStatus),
          lastLogin: "Never",
          avatar: toAvatar(displayName || u.email),
          rawData: u,
        };
      });
      console.log("Mapped users:", mapped);
      setUsers(mapped);
      setFilteredUsers(mapped);
    } catch (err) {
      setError(err.message || "ไม่สามารถโหลดข้อมูลผู้ใช้");
    } finally {
      setLoading(false);
    }
  };

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
          // Note: Delete endpoint may not exist in API, this is placeholder
          console.log("Delete user:", user);
        }
        break;
      case "approve":
      case "activate":
        if (user) {
          try {
            await userAPI.updateUserApproval(user.id, "APPROVED");
            await loadUsers(); // Reload data
          } catch (err) {
            setError(err.message || "ไม่สามารถอนุมัติผู้ใช้");
          }
        }
        break;
      case "disable":
      case "deactivate":
        if (user) {
          try {
            await userAPI.updateUserApproval(user.id, "DISABLED");
            await loadUsers(); // Reload data
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
          email: userData.email,
          password: userData.password || "defaultpassword123",
          role:
            userData.role === "Moderator"
              ? "ADMIN"
              : userData.role === "Admin"
                ? "SUPERADMIN"
                : "USER",
        };
        await userAPI.createUser(payload);
      } else if (modalMode === "edit" && selectedUser) {
        const payload = {
          email: userData.email,
          role:
            userData.role === "Moderator"
              ? "ADMIN"
              : userData.role === "Admin"
                ? "SUPERADMIN"
                : "USER",
        };
        await userAPI.updateUser(selectedUser.id, payload);
      }
      await loadUsers(); // Reload data
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err.message || "ไม่สามารถบันทึกข้อมูลผู้ใช้");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}

      <UserFilters onFilter={handleFilter} />

      {loading ? (
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
