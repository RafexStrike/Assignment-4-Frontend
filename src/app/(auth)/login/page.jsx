"use client";

// src/app/(auth)/login/page.jsx

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
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { AnimatedBackground } from "@/components/animated-background";
import { login, getRedirectPath } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);

      // Check if email is verified
      if (!data.user.emailVerified) {
        router.push("/verify-email");
        return;
      }

      // Check if user is banned
      if (data.user.isBanned) {
        setError(data.user.banReason || "Your account has been banned");
        return;
      }

      // Redirect based on role
      const redirectPath = getRedirectPath(data.user.role);
      router.push(redirectPath);
    } catch (err) {
      setError(err.message);
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
                Secure Student Login
              </span>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-slate-100 to-blue-100 bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Sign in to continue your learning journey
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

              {/* Actions */}
              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/forgot-password"
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  Forgot password?
                </Link>
                <Link
                  href="/register"
                  className="text-slate-400 hover:text-slate-300 transition"
                >
                  Create account
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full group relative overflow-hidden"
                disabled={loading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  )}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition" />
              </Button>
            </form>

            {/* Footer */}
            <p className="text-xs text-center text-slate-500 pt-4">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-blue-400 hover:underline">
                Terms
              </Link>{" "}
              &{" "}
              <Link href="/privacy" className="text-blue-400 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </CardHeader>
        </Card>
      {/* </motion.div> */}
    </div>
  );
}
