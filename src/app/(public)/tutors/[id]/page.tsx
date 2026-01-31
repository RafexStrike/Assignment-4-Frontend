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
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
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

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TutorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchTutor();
  }, [params.id]);

  async function fetchTutor() {
    try {
      const res = await fetch(`https://assignment-4-backend-mkn7.onrender.com/api/tutors/getTutors/${params.id}`);
      if (!res.ok) throw new Error("Tutor not found");
      const data = await res.json();
      setTutor(data.data);
    } catch (error) {
      console.error("Error fetching tutor:", error);
    } finally {
      setLoading(false);
    }
  }

  // Helper to group availability by day
  const groupedAvailability = tutor?.availability.reduce((acc, slot) => {
    const day = DAYS[slot.dayOfWeek];
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

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

    const startAt = new Date(`${selectedDate}T${selectedTime}`);
    const endAt = new Date(startAt.getTime() + 60 * 60 * 1000);

    setBookingLoading(true);
    try {
      const res = await fetch("https://assignment-4-backend-mkn7.onrender.com/api/bookings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId: params.id,
          subject: selectedSubject,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          notes,
        }),
      });

      if (!res.ok) throw new Error("Booking failed");

      setMessage({ type: "success", text: "Session booked successfully!" });
      setTimeout(() => router.push("/dashboard/bookings"), 2000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (!tutor) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Tutor not found</div>;

  const currentAvailableSlots = selectedDate 
    ? tutor.availability.filter(s => s.dayOfWeek === new Date(selectedDate).getDay())
    : [];

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => router.push("/tutors")} className="text-slate-400">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        {/* --- Header Section --- */}
        <Card className="bg-slate-900/60 border-slate-800">
          <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="h-32 w-32 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-4xl font-bold text-blue-400">
              {tutor.user.name?.[0]}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">{tutor.user.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                <span className="flex items-center text-yellow-500"><Star className="h-4 w-4 fill-current mr-1"/> {tutor.rating || "New"}</span>
                <span className="flex items-center text-green-400"><DollarSign className="h-4 w-4 mr-1"/> {tutor.hourlyRate}/hr</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                {tutor.categories.map(c => <span key={c.id} className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs border border-blue-500/20">{c.name}</span>)}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left Content (Info & Availability) --- */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader><CardTitle className="text-white">About the Tutor</CardTitle></CardHeader>
              <CardContent><p className="text-slate-400">{tutor.bio}</p></CardContent>
            </Card>

            {/* NEW: VISUAL AVAILABILITY SECTION */}
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" /> Weekly Schedule
                </CardTitle>
                <CardDescription>Standard working hours for this tutor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DAYS.map((day, index) => {
                    const slots = tutor.availability.filter(s => s.dayOfWeek === index);
                    return (
                      <div key={day} className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
                        <p className="text-sm font-semibold text-slate-300 mb-2">{day}</p>
                        {slots.length > 0 ? (
                          <div className="space-y-1">
                            {slots.map(slot => (
                              <p key={slot.id} className="text-xs text-blue-400 bg-blue-500/5 px-2 py-1 rounded">
                                {slot.startTime} - {slot.endTime}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-600 italic">No availability</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader><CardTitle className="text-white">Reviews</CardTitle></CardHeader>
              <CardContent>
                {tutor.reviews.length === 0 ? <p className="text-slate-500">No reviews yet</p> : tutor.reviews.map(r => (
                  <div key={r.id} className="border-b border-slate-800 py-4 last:border-0">
                    <div className="flex gap-1 mb-1">{[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-yellow-500 text-yellow-500" : "text-slate-700"}`} />)}</div>
                    <p className="text-sm text-slate-300">{r.comment}</p>
                    <p className="text-xs text-slate-500 mt-1">— {r.author.name}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* --- Right Content (Booking Form) --- */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/60 border-slate-800 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Book a Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {message && (
                   <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="h-4 w-4"/> : <AlertCircle className="h-4 w-4"/>}
                    {message.text}
                   </div>
                )}
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Select Subject</label>
                    <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required className="w-full bg-slate-950 border-slate-800 rounded-md p-2 text-sm">
                      <option value="">Choose subject...</option>
                      {tutor.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Date</label>
                    <Input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }} min={new Date().toISOString().split('T')[0]} className="bg-slate-950 border-slate-800" required />
                  </div>

                  {selectedDate && (
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Available Times for {DAYS[new Date(selectedDate).getDay()]}</label>
                      <div className="grid grid-cols-1 gap-2">
                        {currentAvailableSlots.length > 0 ? currentAvailableSlots.map(slot => (
                          <button key={slot.id} type="button" onClick={() => setSelectedTime(slot.startTime)} className={`p-2 text-xs rounded border transition ${selectedTime === slot.startTime ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"}`}>
                            {slot.startTime} - {slot.endTime}
                          </button>
                        )) : <p className="text-xs text-red-400">Tutor is not available on this day.</p>}
                      </div>
                    </div>
                  )}

                  <Button type="submit" disabled={!selectedTime || bookingLoading} className="w-full bg-blue-600 hover:bg-blue-700">
                    {bookingLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirm Booking"}
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