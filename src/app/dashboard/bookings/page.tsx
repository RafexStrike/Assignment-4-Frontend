// src/app/dashboard/bookings/page.tsx

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
  Star,
  Loader2,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Booking {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  subject: string;
  notes?: string;
  price?: number;
  tutor: {
    id: string;
    user: {
      name?: string;
      image?: string;
    };
  };
  review?: {
    id: string;
    rating: number;
  };
}

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<{
    upcoming: Booking[];
    past: Booking[];
    cancelled: Booking[];
  }>({
    upcoming: [],
    past: [],
    cancelled: [],
  });
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/bookings", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      setBookings(data.data || { upcoming: [], past: [], cancelled: [] });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelBooking(bookingId: string) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to cancel booking");
      }

      setMessage({ type: "success", text: "Booking cancelled successfully" });
      fetchBookings();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBooking) return;

    setSubmittingReview(true);
    setMessage(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId: selectedBooking.tutor.id,
          bookingId: selectedBooking.id,
          rating: reviewRating,
          comment: reviewComment || undefined,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit review");
      }

      setMessage({ type: "success", text: "Review submitted successfully!" });
      setReviewModalOpen(false);
      setReviewComment("");
      setReviewRating(5);
      fetchBookings();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmittingReview(false);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  const currentBookings = bookings[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">My Bookings</h1>
        <p className="text-slate-400 mt-1">
          Manage your tutoring sessions and reviews
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800/50">
        {(["upcoming", "past", "cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {currentBookings.length === 0 ? (
          <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No {activeTab} bookings</p>
            </CardContent>
          </Card>
        ) : (
          currentBookings.map((booking) => (
            <Card key={booking.id} className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                      {booking.tutor.user?.name?.charAt(0).toUpperCase() || "T"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 text-lg">
                        {booking.subject || "General Session"}
                      </h3>
                      <p className="text-slate-400">
                        with {booking.tutor.user?.name || "Tutor"}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(booking.startAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
                        </span>
                      </div>
                      {booking.notes && (
                        <p className="text-sm text-slate-500 mt-2 italic">
                          Notes: {booking.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {booking.status === "CONFIRMED" && activeTab === "upcoming" && (
                      <>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Confirmed
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}

                    {booking.status === "COMPLETED" && (
                      <>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          Completed
                        </span>
                        {!booking.review && activeTab === "past" && (
                          <Button
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-500 text-white"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setReviewModalOpen(true);
                            }}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Leave Review
                          </Button>
                        )}
                        {booking.review && (
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-yellow-500" />
                            <span className="text-sm">{booking.review.rating}/5</span>
                          </div>
                        )}
                      </>
                    )}

                    {booking.status === "CANCELLED" && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-800/50 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-slate-100">Leave a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Rating (1-10)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setReviewRating(num)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                          reviewRating === num
                            ? "bg-blue-500 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full min-h-[100px] px-3 py-2 rounded-md bg-slate-950/60 border border-slate-800/50 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={() => setReviewModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500"
                    disabled={submittingReview}
                  >
                    {submittingReview ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}