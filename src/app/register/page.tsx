"use client";

// src/app/register/page.tsx

// import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { AnimatedBackground } from "@/components/animated-background";
import { register, getRedirectPath } from "@/lib/auth-client";

type Role = "STUDENT" | "TUTOR";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const data = await register(name, email, password, role);

      // Check if email is verified
      if (!data.user.emailVerified) {
        router.push("/verify-email");
        return;
      }

      // Redirect based on role
      const redirectPath = getRedirectPath(data.user.role);
      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background */}
      <AnimatedBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-slate-950 pointer-events-none" />

      {/* Card Wrapper */}
      {/* <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      > */}
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-30" />

        <Card className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl">
          <CardHeader className="space-y-6">
            {/* Badge */}
            <div className="mx-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">
                Create Your Account
              </span>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-slate-100 to-blue-100 bg-clip-text text-transparent">
                  Get Started
                </span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Join TutorConnect and start learning or teaching today
              </CardDescription>
            </div>

            {/* Form */}
            <form className="space-y-5 pt-4" onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Full name"
                  className="pl-10 bg-slate-950/60 border-slate-800/50 focus-visible:ring-0"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="Email address"
                  className="pl-10 bg-slate-950/60 border-slate-800/50 focus-visible:ring-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 bg-slate-950/60 border-slate-800/50 focus-visible:ring-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  className="pl-10 bg-slate-950/60 border-slate-800/50 focus-visible:ring-0"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Role Selector */}
              <div className="space-y-2">
                <p className="text-sm text-slate-400">I want to join as</p>

                <div className="grid grid-cols-2 gap-3">
                  {/* Student */}
                  <button
                    type="button"
                    onClick={() => {
                      setRole("STUDENT");
                      setError("");
                    }}
                    className={`relative rounded-xl border p-4 text-left transition
                      ${
                        role === "STUDENT"
                          ? "border-blue-500/50 bg-blue-500/10"
                          : "border-slate-800/50 bg-slate-950/40 hover:border-slate-700"
                      }`}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <GraduationCap className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">STUDENT</p>
                        <p className="text-xs text-slate-400">
                          Learn from expert tutors
                        </p>
                      </div>
                    </div>

                    {role === "STUDENT" && (
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-20" />
                    )}
                  </button>

                  {/* Tutor */}
                  <button
                    type="button"
                    onClick={() => {
                      setRole("TUTOR");
                      setError("");
                    }}
                    className={`relative rounded-xl border p-4 text-left transition
                      ${
                        role === "TUTOR"
                          ? "border-blue-500/50 bg-blue-500/10"
                          : "border-slate-800/50 bg-slate-950/40 hover:border-slate-700"
                      }`}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Briefcase className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">TUTOR</p>
                        <p className="text-xs text-slate-400">
                          Teach and earn money
                        </p>
                      </div>
                    </div>

                    {role === "TUTOR" && (
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-20" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full group relative overflow-hidden"
                disabled={loading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  )}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition" />
              </Button>
            </form>

            {/* Footer */}
            <p className="text-xs text-center text-slate-500 pt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:underline">
                Sign in
              </Link>
            </p>
          </CardHeader>
        </Card>
      {/* </motion.div> */}
    </div>
  );
}
