// src/app/tutor/dashboard/page.tsx

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
  DollarSign,
  Star,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Booking {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  price: number;
  subject: string;
  notes?: string;
  student: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface Stats {
  totalSessions: number;
  completedSessions: number;
  totalEarnings: number;
  rating: number;
  upcomingCount: number;
}

export default function TutorDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    completedSessions: 0,
    totalEarnings: 0,
    rating: 0,
    upcomingCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [bookingsRes, profileRes] = await Promise.all([
        // fetch("/api/bookings", {
        fetch("http://localhost:5000/api/bookings", {
          credentials: "include",
        }),
        // fetch("/api/tutor/profile", {
        fetch("http://localhost:5000/api/tutor/profile", {
          credentials: "include",
        }),
      ]);

      const bookingsData = bookingsRes.ok ? await bookingsRes.json() : { data: [] };
      const profileData = profileRes.ok ? await profileRes.json() : { data: {} };

      // Calculate stats
      const allBookings = bookingsData.data || [];
      const completedBookings = allBookings.filter(
        (b: Booking) => b.status === "COMPLETED",
      );
      const upcomingBookings = allBookings.filter(
        (b: Booking) =>
          b.status === "CONFIRMED" && new Date(b.startAt) > new Date(),
      );

      setBookings(allBookings.slice(0, 5)); // Show last 5 bookings
      setStats({
        totalSessions: allBookings.length,
        completedSessions: completedBookings.length,
        totalEarnings: completedBookings.reduce(
          (sum: number, b: Booking) => sum + (b.price || 0),
          0,
        ),
        rating: profileData.data?.rating || 0,
        upcomingCount: upcomingBookings.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setMessage({ type: "error", text: "Failed to load dashboard data" });
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteBooking(bookingId: string) {
    setCompletingId(bookingId);
    setMessage(null);

    try {
      // const res = await fetch(`/api/bookings/${bookingId}/complete`, {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/complete`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to complete booking");
      }

      setMessage({ type: "success", text: "Session marked as completed!" });
      fetchDashboardData(); // Refresh data
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setCompletingId(null);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
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
          <h1 className="text-3xl font-bold text-slate-100">Tutor Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Manage your sessions and track your performance
          </p>
        </div>
        <Button
          onClick={() => router.push("/tutor/availability")}
          className="bg-blue-600 hover:bg-blue-500"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Manage Availability
        </Button>
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
                <Users className="h-5 w-5 text-blue-400" />
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
                <Clock className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Earnings</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  ${stats.totalEarnings.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Rating</p>
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-2xl font-bold text-slate-100">
                    {stats.rating.toFixed(1)}
                  </p>
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-slate-100">
            Recent Sessions
          </CardTitle>
          <CardDescription className="text-slate-400">
            Your latest booking activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No sessions yet</p>
              <Button
                variant="outline"
                className="mt-4 border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => router.push("/tutor/availability")}
              >
                Set Your Availability
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const isCompleted = booking.status === "COMPLETED";
                const isConfirmed = booking.status === "CONFIRMED";
                const canComplete =
                  isConfirmed && new Date() >= new Date(booking.endAt);

                return (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50 gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                        {booking.student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-100">
                          {booking.student.name}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {booking.subject || "General Session"}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(booking.startAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(booking.startAt)} -{" "}
                            {formatTime(booking.endAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "COMPLETED"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : booking.status === "CANCELLED"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {booking.status}
                      </span>

                      {canComplete && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-500 text-white"
                          onClick={() => handleCompleteBooking(booking.id)}
                          disabled={completingId === booking.id}
                        >
                          {completingId === booking.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                          )}
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
