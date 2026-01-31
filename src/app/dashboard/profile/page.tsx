// src/app/dashboard/profile/page.tsx

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
  User,
  Mail,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { getSession } from "@/lib/auth-client";

interface UserProfile {
  id: string;
  name?: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt?: string;
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const session = await getSession();
      if (session?.user) {
        setProfile(session.user as UserProfile);
        setFormData({ name: session.user.name || "" });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Note: You'll need to implement this endpoint in backend
      // For now, this is a placeholder that would update the user profile
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
      fetchProfile();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">My Profile</h1>
        <p className="text-slate-400 mt-1">
          Manage your account information
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

      {/* Profile Info */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            Personal Information
          </CardTitle>
          <CardDescription className="text-slate-400">
            View and update your profile details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="pl-10 bg-slate-950/60 border-slate-800/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="pl-10 bg-slate-950/60 border-slate-800/50 text-slate-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
              <div className={`p-2 rounded-full ${profile?.emailVerified ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                <Shield className={`h-5 w-5 ${profile?.emailVerified ? 'text-green-400' : 'text-yellow-400'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Email {profile?.emailVerified ? "Verified" : "Not Verified"}
                </p>
                <p className="text-xs text-slate-500">
                  {profile?.emailVerified 
                    ? "Your email has been verified" 
                    : "Please verify your email address"}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-slate-100">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between py-2 border-b border-slate-800/50">
            <span className="text-slate-400">Role</span>
            <span className="text-slate-200 capitalize">{profile?.role?.toLowerCase()}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/50">
            <span className="text-slate-400">Member Since</span>
            <span className="text-slate-200">
              {profile?.createdAt 
                ? new Date(profile.createdAt).toLocaleDateString() 
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">User ID</span>
            <span className="text-slate-200 text-sm font-mono">{profile?.id}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}