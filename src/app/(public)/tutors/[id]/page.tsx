// src/app/(public)/tutors/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  DollarSign,
  BookOpen,
  Calendar,
  Clock,
  Loader2,
  ArrowLeft,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getSession } from "@/lib/auth-client";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  author: {
    name?: string;
  };
}

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Tutor {
  id: string;
  bio?: string;
  education?: string;
  hourlyRate?: number;
  rating?: number;
  totalReviews?: number;
  user: {
    id: string;
    name?: string;
    image?: string;
    email?: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
  availability: AvailabilitySlot[];
  reviews: Review[];
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TutorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Booking form state
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchTutor();
  }, [params.id]);

  async function fetchTutor() {
    try {
      const res = await fetch(`http://localhost:5000/api/tutors/getTutors/${params.id}`);
      if (!res.ok) throw new Error("Tutor not found");
      const data = await res.json();
      setTutor(data.data);
    } catch (error) {
      console.error("Error fetching tutor:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    
    const session = await getSession();
    if (!session) {
      router.push(`/login?redirect=/tutors/${params.id}`);
      return;
    }

    if (session.user.role !== "STUDENT") {
      setMessage({ type: "error", text: "Only students can book sessions" });
      return;
    }

    if (!selectedDate || !selectedTime || !selectedSubject) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    setBookingLoading(true);

    try {
      // Calculate start and end times
      const startAt = new Date(`${selectedDate}T${selectedTime}`);
      const endAt = new Date(startAt.getTime() + 60 * 60 * 1000); // 1 hour session

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId: params.id,
          subject: selectedSubject,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to book session");
      }

      setMessage({ type: "success", text: "Session booked successfully!" });
      setTimeout(() => router.push("/dashboard/bookings"), 2000);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setBookingLoading(false);
    }
  }

  function getAvailableTimesForDate(dateStr: string) {
    if (!dateStr || !tutor) return [];
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    return tutor.availability.filter(slot => slot.dayOfWeek === dayOfWeek);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400">Tutor not found</p>
          <Button onClick={() => router.push("/tutors")} className="mt-4">
            Back to Tutors
          </Button>
        </div>
      </div>
    );
  }

  const availableSlots = getAvailableTimesForDate(selectedDate);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="text-slate-400 hover:text-slate-200"
          onClick={() => router.push("/tutors")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tutors
        </Button>

        {/* Tutor Header */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20" />
          <Card className="relative bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="h-24 w-24 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl font-bold text-blue-400">
                  {tutor.user?.name?.charAt(0).toUpperCase() || "T"}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-100">
                    {tutor.user?.name || "Anonymous Tutor"}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg text-slate-200">
                        {tutor.rating?.toFixed(1) || "New"}
                      </span>
                      <span className="text-slate-500">
                        ({tutor.totalReviews || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <span className="font-semibold">${tutor.hourlyRate || 0}/hr</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tutor.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Info */}
          <div className="space-y-6">
            <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-slate-100">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  {tutor.bio || "No bio available"}
                </p>
                {tutor.education && (
                  <div className="pt-4 border-t border-slate-800/50">
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Education</h4>
                    <p className="text-slate-300">{tutor.education}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-slate-100">Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {tutor.reviews.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {tutor.reviews.map((review) => (
                      <div key={review.id} className="border-b border-slate-800/50 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-slate-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">{review.comment}</p>
                        <p className="text-xs text-slate-500 mt-1">By {review.author?.name || "Anonymous"}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking */}
          <div>
            <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50 sticky top-24">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  Book a Session
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Select your preferred date and time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {message && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
                      message.type === "success"
                        ? "bg-green-500/10 border border-green-500/30 text-green-400"
                        : "bg-red-500/10 border border-red-500/30 text-red-400"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>
                )}

                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Subject
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-slate-950/60 border border-slate-800/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      required
                    >
                      <option value="">Select a subject</option>
                      {tutor.categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime("");
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className="bg-slate-950/60 border-slate-800/50"
                      required
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Available Times
                      </label>
                      {availableSlots.length === 0 ? (
                        <p className="text-sm text-slate-500">No availability on this day</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => setSelectedTime(slot.startTime)}
                              className={`p-2 rounded-lg border text-sm transition ${
                                selectedTime === slot.startTime
                                  ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                                  : "border-slate-800/50 bg-slate-950/40 text-slate-300 hover:border-slate-700"
                              }`}
                            >
                              {slot.startTime} - {slot.endTime}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific topics or requirements..."
                      className="w-full min-h-[80px] px-3 py-2 rounded-md bg-slate-950/60 border border-slate-800/50 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500"
                    disabled={bookingLoading || !selectedTime}
                  >
                    {bookingLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <BookOpen className="h-4 w-4 mr-2" />
                    )}
                    Book Session (${tutor.hourlyRate || 0}/hr)
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}