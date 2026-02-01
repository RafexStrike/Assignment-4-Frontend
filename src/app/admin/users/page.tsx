// src/app/admin/users/page.tsx

"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  UserX,
  UserCheck,
  Shield,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle,
  CheckCircle2,
  Eye,
  Ban,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  isBanned: boolean;
  banReason?: string;
  createdAt: string;
  image?: string;
  _count?: {
    bookings: number;
    reviews: number;
  };
  tutorProfile?: {
    rating?: number;
    hourlyRate?: number;
    isFeatured?: boolean;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", "10");
      if (search) queryParams.append("search", search);
      if (roleFilter) queryParams.append("role", roleFilter);

      const res = await fetch(`/api/admin/users?${queryParams}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({ type: "error", text: "Failed to load users" });
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleBan(userId: string, currentlyBanned: boolean) {
    if (!currentlyBanned && !banReason.trim()) {
      setSelectedUser(users.find(u => u.id === userId) || null);
      setBanModalOpen(true);
      return;
    }

    setProcessingId(userId);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isBanned: !currentlyBanned,
          reason: currentlyBanned ? undefined : banReason,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update user status");
      }

      setMessage({
        type: "success",
        text: `User ${currentlyBanned ? "unbanned" : "banned"} successfully`,
      });
      fetchUsers();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setProcessingId(null);
      setBanModalOpen(false);
      setBanReason("");
      setSelectedUser(null);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">User Management</h1>
          <p className="text-slate-400 mt-1">
            Manage platform users and their status
          </p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/30 text-green-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-950/60 border-slate-800/50"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 rounded-md bg-slate-950/60 border border-slate-800/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="TUTOR">Tutor</option>
              <option value="ADMIN">Admin</option>
            </select>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/50 border-b border-slate-800/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-400">User</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Role</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Joined</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">{user.name || "N/A"}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : user.role === "TUTOR"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.isBanned ? (
                      <div className="flex items-center gap-2 text-red-400">
                        <Ban className="h-4 w-4" />
                        <span className="text-sm">Banned</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-400">
                        <UserCheck className="h-4 w-4" />
                        <span className="text-sm">Active</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {user.role !== "ADMIN" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            user.isBanned
                              ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                              : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                          }
                          onClick={() => handleToggleBan(user.id, user.isBanned)}
                          disabled={processingId === user.id}
                        >
                          {processingId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : user.isBanned ? (
                            <>
                              <UserCheck className="h-4 w-4 mr-1" />
                              Unban
                            </>
                          ) : (
                            <>
                              <UserX className="h-4 w-4 mr-1" />
                              Ban
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No users found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-800/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </Card>

      {/* Ban Reason Modal */}
      {banModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-800/50 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-400" />
                Ban User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400 text-sm">
                You are about to ban <strong className="text-slate-200">{selectedUser.name || selectedUser.email}</strong>. 
                Please provide a reason for this action.
              </p>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter ban reason..."
                className="w-full min-h-[100px] px-3 py-2 rounded-md bg-slate-950/60 border border-slate-800/50 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  onClick={() => {
                    setBanModalOpen(false);
                    setBanReason("");
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-500"
                  onClick={() => handleToggleBan(selectedUser.id, false)}
                  disabled={!banReason.trim() || processingId === selectedUser.id}
                >
                  {processingId === selectedUser.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Confirm Ban"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}