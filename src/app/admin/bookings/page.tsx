// src/app/admin/bookings/page.tsx

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
  Calendar,
  Clock,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle,
  CheckCircle2,
  Search,
  DollarSign,
} from "lucide-react";

interface Booking {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  subject: string;
  price?: number;
  notes?: string;
  student: {
    id: string;
    name?: string;
    email: string;
    image?: string;
  };
  tutor: {
    id: string;
    user: {
      name?: string;
      email: string;
      image?: string;
    };
  };
  review?: {
    id: string;
    rating: number;
  };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter]);

  async function fetchBookings() {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", "10");
      if (statusFilter && statusFilter !== "ALL") queryParams.append("status", statusFilter);

      const res = await fetch(`https://assignment-4-backend-mkn7.onrender.com/api/admin/bookings?${queryParams}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      setBookings(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setMessage({ type: "error", text: "Failed to load bookings" });
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelBooking(bookingId: string) {
    if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      return;
    }

    setCancellingId(bookingId);
    setMessage(null);

    try {
      const res = await fetch(`https://assignment-4-backend-mkn7.onrender.com/api/admin/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Cancelled by admin" }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to cancel booking");
      }

      setMessage({ type: "success", text: "Booking cancelled successfully" });
      fetchBookings();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setCancellingId(null);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Booking Management</h1>
        <p className="text-slate-400 mt-1">
          View and manage all platform bookings
        </p>
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
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 rounded-md bg-slate-950/60 border border-slate-800/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
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
                    {booking.price && (
                      <span className="flex items-center gap-1 text-sm text-slate-400">
                        <DollarSign className="h-3 w-3" />
                        {booking.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                        {booking.student.name?.charAt(0).toUpperCase() || "S"}
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Student</p>
                        <p className="font-medium text-slate-200">
                          {booking.student.name || "N/A"}
                        </p>
                        <p className="text-sm text-slate-500">{booking.student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                        {booking.tutor.user.name?.charAt(0).toUpperCase() || "T"}
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Tutor</p>
                        <p className="font-medium text-slate-200">
                          {booking.tutor.user.name || "N/A"}
                        </p>
                        <p className="text-sm text-slate-500">{booking.tutor.user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(booking.startAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(booking.startAt).toLocaleTimeString()} -{" "}
                      {new Date(booking.endAt).toLocaleTimeString()}
                    </span>
                  </div>

                  {booking.subject && (
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-500">Subject:</span> {booking.subject}
                    </p>
                  )}

                  {booking.notes && (
                    <p className="text-sm text-slate-400 italic bg-slate-950/50 p-2 rounded">
                      Notes: {booking.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                  {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                    >
                      {cancellingId === booking.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {bookings.length === 0 && (
          <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No bookings found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}