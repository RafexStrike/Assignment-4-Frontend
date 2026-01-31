// src/app/tutor/availability/page.tsx

"use client";

import { useEffect, useState } from "react";
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
  Clock,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default to Monday
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchAvailability();
  }, []);

  async function fetchAvailability() {
    try {
      const res = await fetch("/api/tutor/availability", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch availability");

      const data = await res.json();
      setSlots(data.data || []);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setMessage({ type: "error", text: "Failed to load availability" });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!startTime || !endTime) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/tutor/availability", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayOfWeek: selectedDay,
          startTime,
          endTime,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add slot");
      }

      setMessage({ type: "success", text: "Availability slot added!" });
      setStartTime("");
      setEndTime("");
      fetchAvailability();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSlot(slotId: string) {
    if (!confirm("Are you sure you want to delete this time slot?")) return;

    try {
      const res = await fetch(`/api/tutor/availability/${slotId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete slot");

      setMessage({ type: "success", text: "Slot deleted successfully" });
      fetchAvailability();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete slot" });
    }
  }

  function formatTime(time: string) {
    // Convert "14:00" to "2:00 PM"
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">
          Manage Availability
        </h1>
        <p className="text-slate-400 mt-1">
          Set your weekly schedule for students to book sessions
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

      {/* Add New Slot */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-400" />
            Add Time Slot
          </CardTitle>
          <CardDescription className="text-slate-400">
            Add a new recurring weekly availability slot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSlot} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Day of Week
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                  className="w-full h-10 px-3 rounded-md bg-slate-950/60 border border-slate-800/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {daysOfWeek.map((day, index) => (
                    <option key={index} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-slate-950/60 border-slate-800/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  End Time
                </label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-slate-950/60 border-slate-800/50"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Availability
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Schedule */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Your Weekly Schedule
          </CardTitle>
          <CardDescription className="text-slate-400">
            View and manage your current availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          {slots.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
              <Clock className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                No availability set yet
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Add your first time slot above
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {daysOfWeek.map((day, dayIndex) => {
                const daySlots = slots.filter(
                  (slot) => slot.dayOfWeek === dayIndex
                );

                if (daySlots.length === 0) return null;

                return (
                  <div key={day}>
                    <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {day}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50 group hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-2 text-slate-300">
                            <Clock className="h-4 w-4 text-slate-500" />
                            <span>
                              {formatTime(slot.startTime)} -{" "}
                              {formatTime(slot.endTime)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition"
                            onClick={() => handleDeleteSlot(slot.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
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