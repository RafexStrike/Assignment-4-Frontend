// src/app/tutor/profile/page.tsx

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
import { Input } from "@/components/ui/input";
import {
  User,
  BookOpen,
  DollarSign,
  FileText,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
  GraduationCap,
  Star,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface TutorProfile {
  id: string;
  bio: string | null;
  education: string | null;
  hourlyRate: number | null;
  rating: number | null;
  totalReviews: number;
  categories: Category[];
}

export default function TutorProfilePage() {
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [profileRes, categoriesRes] = await Promise.all([
        fetch("http://localhost:5000/api/tutor/profile", { credentials: "include" }),
        fetch("http://localhost:5000/api/tutors/categories", { credentials: "include" }),
      ]);

      if (profileRes.status === 404) {
        setProfile(null);
      } else if (!profileRes.ok) {
        throw new Error("Failed to fetch profile");
      } else {
        const profileData = await profileRes.json();
        setProfile(profileData.data);
        setBio(profileData.data?.bio || "");
        setEducation(profileData.data?.education || "");
        setHourlyRate(profileData.data?.hourlyRate?.toString() || "");
        setSelectedSubjects(
          profileData.data?.categories?.map((c: Category) => c.id) || []
        );
      }

      if (categoriesRes.ok) {
        const catData = await categoriesRes.json();
        setAllCategories(catData.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({ type: "error", text: "Failed to load profile data" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const method = profile ? "PUT" : "POST";
      const res = await fetch("http://localhost:5000/api/tutor/profile", {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          education,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
          subjectIds: selectedSubjects,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save profile");
      }

      setMessage({
        type: "success",
        text: profile ? "Profile updated!" : "Profile created!",
      });
      fetchData(); // Refresh to get updated data
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  function toggleSubject(subjectId: string) {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
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
          {profile ? "Edit Profile" : "Create Tutor Profile"}
        </h1>
        <p className="text-slate-400 mt-1">
          {profile
            ? "Update your profile information and teaching details"
            : "Set up your tutor profile to start accepting students"}
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

      {/* Profile Stats if exists */}
      {profile && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Rating</p>
                <p className="text-lg font-bold text-slate-100">
                  {profile.rating?.toFixed(1) || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Reviews</p>
                <p className="text-lg font-bold text-slate-100">
                  {profile.totalReviews || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Hourly Rate</p>
                <p className="text-lg font-bold text-slate-100">
                  ${profile.hourlyRate || 0}/hr
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Form */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-slate-400">
            Tell students about yourself and your expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your teaching experience, methodology, and what students can expect..."
                className="w-full min-h-[120px] px-3 py-2 rounded-md bg-slate-950/60 border border-slate-800/50 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                {bio.length}/500 characters
              </p>
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Education & Qualifications
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g., M.S. in Mathematics, Stanford University"
                  className="pl-10 bg-slate-950/60 border-slate-800/50"
                />
              </div>
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Hourly Rate (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="50.00"
                  className="pl-10 bg-slate-950/60 border-slate-800/50"
                />
              </div>
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">
                Teaching Subjects
              </label>
              {allCategories.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No categories available. Please contact admin.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleSubject(category.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-left transition ${
                        selectedSubjects.includes(category.id)
                          ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                          : "border-slate-800/50 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <BookOpen className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {category.name}
                      </span>
                      {selectedSubjects.includes(category.id) && (
                        <CheckCircle2 className="h-4 w-4 ml-auto text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="bg-blue-600 hover:bg-blue-500"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {profile
                  ? "Save Changes"
                  : "Create Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}