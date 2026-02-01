// src/app/how-it-works/page.tsx

"use client";

import Link from "next/link";
import { 
  User, 
  GraduationCap, 
  Shield, 
  Search, 
  Calendar, 
  Star, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Database,
  Lock,
  BookOpen,
  Clock,
  MessageSquare,
  BarChart3,
  Users,
  Ban,
  Tags,
  ChevronRight,
  Workflow
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/animated-background";

const FlowArrow = () => (
  <div className="hidden lg:flex items-center justify-center w-12 h-12">
    <div className="relative">
      <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
      <ArrowRight className="h-6 w-6 text-blue-400 relative z-10" />
    </div>
  </div>
);

const VerticalArrow = () => (
  <div className="flex lg:hidden items-center justify-center h-8 my-2">
    <div className="relative">
      <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />
      <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500/50 to-cyan-500/50 relative" />
    </div>
  </div>
);

const StepCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color = "blue",
  children 
}: { 
  icon: any, 
  title: string, 
  description: string,
  color?: "blue" | "cyan" | "purple" | "green" | "red" | "yellow",
  children?: React.ReactNode
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500 border-blue-500/20 bg-blue-500/10 text-blue-400",
    cyan: "from-cyan-500 to-teal-500 border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
    purple: "from-purple-500 to-pink-500 border-purple-500/20 bg-purple-500/10 text-purple-400",
    green: "from-green-500 to-emerald-500 border-green-500/20 bg-green-500/10 text-green-400",
    red: "from-red-500 to-orange-500 border-red-500/20 bg-red-500/10 text-red-400",
    yellow: "from-yellow-500 to-amber-500 border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  };

  return (
    <div className="relative group">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorClasses[color]} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`} />
      <Card className="relative bg-slate-900/80 backdrop-blur-xl border-slate-800/50 h-full hover:border-slate-700/50 transition-all duration-300">
        <CardHeader>
          <div className={`inline-flex p-3 rounded-xl border ${colorClasses[color]} w-fit mb-3`}>
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg text-slate-100">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
          {children && <div className="mt-4 pt-4 border-t border-slate-800/50">{children}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

const ConnectionLine = ({ className = "" }: { className?: string }) => (
  <div className={`hidden lg:block absolute h-0.5 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 ${className}`} />
);

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-slate-950 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Workflow className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">System Architecture</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-100 via-blue-100 to-slate-100 bg-clip-text text-transparent">
              How SkillBridge
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Works
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            A comprehensive overview of the platform architecture, user flows, and data connections 
            that power the tutoring ecosystem.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-500" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
              <Link href="/tutors">Browse Tutors</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-24 relative z-10">
        
        {/* Authentication Layer */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Authentication Layer</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <StepCard 
              icon={User} 
              title="Registration" 
              description="Users register as Student, Tutor, or Admin. Credentials are securely stored via Better-Auth with PostgreSQL backend."
              color="blue"
            >
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-blue-500/10 text-xs text-blue-300 border border-blue-500/20">Student</span>
                <span className="px-2 py-1 rounded bg-cyan-500/10 text-xs text-cyan-300 border border-cyan-500/20">Tutor</span>
                <span className="px-2 py-1 rounded bg-purple-500/10 text-xs text-purple-300 border border-purple-500/20">Admin</span>
              </div>
            </StepCard>
            
            <FlowArrow />
            <VerticalArrow />
            
            <StepCard 
              icon={Shield} 
              title="Session Management" 
              description="JWT-based sessions stored in PostgreSQL. Middleware validates roles and protects routes based on user permissions."
              color="purple"
            >
              <div className="text-xs text-slate-500 font-mono">Role-based Access Control (RBAC)</div>
            </StepCard>
            
            <FlowArrow />
            <VerticalArrow />
            
            <StepCard 
              icon={Database} 
              title="Database Layer" 
              description="Prisma ORM manages PostgreSQL database with relations: Users ↔ Profiles ↔ Bookings ↔ Reviews ↔ Categories"
              color="cyan"
            >
              <div className="text-xs text-slate-500 font-mono">PostgreSQL + Prisma</div>
            </StepCard>
          </div>
        </section>

        {/* Student Journey */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-900/50 to-transparent" />
            <div className="flex items-center gap-2 text-blue-400">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Student Journey</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-900/50 to-transparent" />
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
              <StepCard 
                icon={Search} 
                title="1. Discover" 
                description="Browse tutor profiles with filters: subject, price range, rating, and availability. Public API endpoints serve tutor data."
                color="blue"
              >
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>• Search by name/subject</li>
                  <li>• Filter by category</li>
                  <li>• Sort by rating/price</li>
                </ul>
              </StepCard>
              
              <FlowArrow />
              <VerticalArrow />
              
              <StepCard 
                icon={Calendar} 
                title="2. Book Session" 
                description="Select available time slots from tutor's recurring weekly schedule. System validates against existing bookings to prevent double-booking."
                color="cyan"
              >
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>• Check availability slots</li>
                  <li>• Calculate session price</li>
                  <li>• Instant confirmation</li>
                </ul>
              </StepCard>
              
              <FlowArrow />
              <VerticalArrow />
              
              <StepCard 
                icon={Clock} 
                title="3. Attend" 
                description="Join session at scheduled time. Tutor marks attendance as 'Completed' after session ends. Status updates from CONFIRMED → COMPLETED."
                color="green"
              >
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>• Session reminders</li>
                  <li>• Real-time status updates</li>
                  <li>• Cancellation options</li>
                </ul>
              </StepCard>
              
              <FlowArrow />
              <VerticalArrow />
              
              <StepCard 
                icon={Star} 
                title="4. Review" 
                description="Rate completed sessions 1-10 scale. Reviews update tutor's aggregate rating and review count automatically via database triggers."
                color="yellow"
              >
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>• 1-10 rating scale</li>
                  <li>• Written feedback</li>
                  <li>• Updates tutor profile</li>
                </ul>
              </StepCard>
            </div>
          </div>
        </section>

        {/* Tutor Workflow */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />
            <div className="flex items-center gap-2 text-cyan-400">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Tutor Workflow</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <StepCard 
              icon={User} 
              title="Create Profile" 
              description="Set up tutor profile with bio, education, hourly rate, and subject categories. Profile is publicly visible to students."
              color="cyan"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <DollarSign className="h-3 w-3" />
                <span>Set pricing</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <Tags className="h-3 w-3" />
                <span>Select subjects</span>
              </div>
            </StepCard>
            
            <FlowArrow />
            <VerticalArrow />
            
            <StepCard 
              icon={Clock} 
              title="Set Availability" 
              description="Define recurring weekly availability slots (e.g., Monday 9:00-17:00). Students can only book within these windows."
              color="blue"
            >
              <div className="text-xs text-slate-500">Day-based recurring schedule</div>
            </StepCard>
            
            <FlowArrow />
            <VerticalArrow />
            
            <StepCard 
              icon={DollarSign} 
              title="Manage Sessions" 
              description="View upcoming bookings, mark sessions as complete, track earnings. Dashboard shows stats: total sessions, rating, revenue."
              color="green"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <BarChart3 className="h-3 w-3" />
                <span>Analytics & Revenue tracking</span>
              </div>
            </StepCard>
          </div>
        </section>

        {/* Admin Oversight */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-900/50 to-transparent" />
            <div className="flex items-center gap-2 text-purple-400">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Admin Oversight</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-900/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StepCard 
              icon={BarChart3} 
              title="Dashboard Analytics" 
              description="Real-time metrics: total users, booking statistics, revenue calculations, and platform growth trends."
              color="purple"
            />
            
            <StepCard 
              icon={Users} 
              title="User Management" 
              description="View all users, ban/unban accounts with reason logging. Filter by role (Student/Tutor/Admin) and search by email/name."
              color="red"
            >
              <div className="text-xs text-slate-500">Ban/unban functionality with audit trail</div>
            </StepCard>
            
            <StepCard 
              icon={BookOpen} 
              title="Booking Oversight" 
              description="Monitor all platform bookings, cancel sessions if necessary, view booking details and payment status."
              color="blue"
            />
            
            <StepCard 
              icon={Tags} 
              title="Category Management" 
              description="CRUD operations for subject categories. Categories link tutors to subjects. Cannot delete if tutors are assigned."
              color="cyan"
            />
          </div>
        </section>

        {/* Data Flow Architecture */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <div className="flex items-center gap-2 text-slate-400">
              <Database className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Data Flow & Relations</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          <div className="relative bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-800/50 p-8 lg:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 rounded-3xl" />
            
            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Database Schema Visualization */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-400" />
                  Core Entities
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium">
                    Users (Auth)
                  </div>
                  <div className="pl-4 space-y-2 border-l-2 border-blue-500/20">
                    <div className="p-2 rounded bg-slate-800/50 text-slate-400 text-xs">
                      TutorProfiles
                    </div>
                    <div className="p-2 rounded bg-slate-800/50 text-slate-400 text-xs">
                      Bookings
                    </div>
                    <div className="p-2 rounded bg-slate-800/50 text-slate-400 text-xs">
                      Reviews
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium">
                    Categories
                  </div>
                </div>
              </div>

              {/* Flow Diagram */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-cyan-400" />
                  Request Flow
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-200 font-medium">Frontend Request</div>
                      <div className="text-sm text-slate-500">Next.js App Router → API Routes</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-600" />
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                    <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-200 font-medium">Authentication Check</div>
                      <div className="text-sm text-slate-500">Better-Auth Middleware validates JWT session</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-600" />
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-200 font-medium">Business Logic</div>
                      <div className="text-sm text-slate-500">Express.js Controllers + Services (Port 5000)</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-600" />
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">
                      4
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-200 font-medium">Database Operations</div>
                      <div className="text-sm text-slate-500">Prisma ORM → PostgreSQL</div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-20" />
          <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/50 p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Ready to explore?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Whether you are here to learn or teach, SkillBridge provides the infrastructure 
              for seamless educational connections.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500" asChild>
                <Link href="/register" className="gap-2">
                  Join as Student <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
                <Link href="/register">Become a Tutor</Link>
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}