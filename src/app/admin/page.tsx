// src/app/admin/page.tsx

"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserX,
  Calendar,
  Activity,
  Loader2,
} from "lucide-react";

interface DashboardStats {
  users: {
    total: number;
    students: number;
    tutors: number;
    active: number;
    banned: number;
  };
  bookings: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  revenue: number;
  recentActivity: {
    newUsers: number;
    newBookings: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    console.log("[admin/page.tsx] ENTER fetchStats");

    try {
      console.log("[admin/page.tsx] BEFORE API CALL - fetching admin dashboard stats");

      const res = await fetch("https://backend-three-liard-74.vercel.app/api/admin/dashboard", {
        credentials: "include",
      });

      console.log("[admin/page.tsx] AFTER API CALL - response status:", res.status);

      if (!res.ok) throw new Error("Failed to fetch stats");

      const data = await res.json();

      console.log("[admin/page.tsx] AFTER DATA PARSE - setting stats, users total:", data.data?.users?.total);

      setStats(data.data);

      console.log("[admin/page.tsx] EXIT fetchStats - success");
    } catch (error) {
      console.error("[admin/page.tsx] Error fetching stats:", error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Platform overview and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Users</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  {stats.users.total}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {stats.users.students} students, {stats.users.tutors} tutors
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  {stats.bookings.total}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  {stats.bookings.completed} completed
                </p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <BookOpen className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Revenue</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  ${stats.revenue.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  From completed sessions
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Users</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  {stats.users.active}
                </p>
                <p className="text-xs text-red-400 mt-1">
                  {stats.users.banned} banned
                </p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <Activity className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-slate-100 text-lg">User Breakdown</CardTitle>
            <CardDescription className="text-slate-400">
              Distribution of user types and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Users className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-slate-300">Students</span>
              </div>
              <span className="text-lg font-semibold text-slate-100">
                {stats.users.students}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <UserCheck className="h-4 w-4 text-cyan-400" />
                </div>
                <span className="text-slate-300">Tutors</span>
              </div>
              <span className="text-lg font-semibold text-slate-100">
                {stats.users.tutors}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <UserCheck className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-slate-300">Active</span>
              </div>
              <span className="text-lg font-semibold text-slate-100">
                {stats.users.active}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <UserX className="h-4 w-4 text-red-400" />
                </div>
                <span className="text-slate-300">Banned</span>
              </div>
              <span className="text-lg font-semibold text-slate-100">
                {stats.users.banned}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-slate-100 text-lg">Booking Overview</CardTitle>
            <CardDescription className="text-slate-400">
              Status distribution of all bookings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Calendar className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-slate-300">Confirmed</span>
              </div>
              <span className="text-lg font-semibold text-slate-100">
                {stats.bookings.confirmed}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-slate-300">Completed</span>
              </div>
              <span className="text-lg font-semibold text-slate-100">
                {stats.bookings.completed}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Activity className="h-4 w-4 text-red-400" />
                </div>
                <span className="text-slate-300">Cancelled</span>
              </div>
              <span className="text-lg font-semibold text-slate-100">
                {stats.bookings.cancelled}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/50">
              <p className="text-sm text-slate-400 mb-2">Recent Activity (Last 7 Days)</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/50 text-center">
                  <p className="text-2xl font-bold text-blue-400">
                    {stats.recentActivity.newUsers}
                  </p>
                  <p className="text-xs text-slate-500">New Users</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/50 text-center">
                  <p className="text-2xl font-bold text-cyan-400">
                    {stats.recentActivity.newBookings}
                  </p>
                  <p className="text-xs text-slate-500">New Bookings</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}