// src/app/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Star,
  BookOpen,
  ArrowRight,
  Loader2,
  User,
} from "lucide-react";

interface Booking {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  subject: string;
  tutor: {
    id: string;
    user: {
      name?: string;
      image?: string;
    };
  };
  review?: {
    id: string;
  };
}

export default function StudentDashboard() {
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingCount: 0,
    completedCount: 0,
    pendingReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const res = await fetch("https://assignment-4-backend-mkn7.onrender.com/api/bookings", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      
      // Handle grouped data format from backend
      const bookings = data.data || {};
      const upcoming = bookings.upcoming || [];
      const past = bookings.past || [];
      const cancelled = bookings.cancelled || [];

      setUpcomingBookings(upcoming.slice(0, 3));
      setPastBookings(past.slice(0, 3));

      // Calculate stats
      const completedWithoutReview = past.filter(
        (b: Booking) => b.status === "COMPLETED" && !b.review
      );

      setStats({
        totalSessions: upcoming.length + past.length + cancelled.length,
        upcomingCount: upcoming.length,
        completedCount: past.filter((b: Booking) => b.status === "COMPLETED").length,
        pendingReviews: completedWithoutReview.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Student Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Track your learning journey and upcoming sessions
          </p>
        </div>
        <Button
          onClick={() => router.push("/tutors")}
          className="bg-blue-600 hover:bg-blue-500"
        >
          Find a Tutor
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Sessions</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  {stats.totalSessions}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Upcoming</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  {stats.upcomingCount}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <Calendar className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  {stats.completedCount}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <Clock className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Reviews</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  {stats.pendingReviews}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-slate-100">Upcoming Sessions</CardTitle>
            <CardDescription className="text-slate-400">
              Your scheduled tutoring sessions
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-400" onClick={() => router.push("/dashboard/bookings")}>
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No upcoming sessions</p>
              <Button
                variant="outline"
                className="mt-4 border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => router.push("/tutors")}
              >
                Book a Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                      {booking.tutor.user?.name?.charAt(0).toUpperCase() || "T"}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-100">
                        {booking.subject || "General Session"}
                      </h3>
                      <p className="text-sm text-slate-400">
                        with {booking.tutor.user?.name || "Tutor"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(booking.startAt)}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-slate-100">Recent Activity</CardTitle>
          <CardDescription className="text-slate-400">
            Your past sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pastBookings.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No past sessions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold">
                      {booking.tutor.user?.name?.charAt(0).toUpperCase() || "T"}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-100">
                        {booking.subject || "General Session"}
                      </h3>
                      <p className="text-sm text-slate-400">
                        with {booking.tutor.user?.name || "Tutor"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(booking.startAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === "COMPLETED"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}