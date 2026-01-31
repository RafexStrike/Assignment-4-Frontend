// src/app/(public)/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  // CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatedBackground } from "@/components/animated-background";
import {
  // GraduationCap,
  Search,
  Video,
  Star,
  Clock,
  Users,
  BookOpen,
  Target,
  CheckCircle2,
  TrendingUp,
  Award,
  Calendar,
  MessageSquare,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-slate-950 pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm text-blue-300 font-medium">
                Trusted by 10,000+ students worldwide
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <span className="bg-gradient-to-r from-slate-100 via-blue-100 to-slate-100 bg-clip-text text-transparent">
                Find Your Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Tutor Today
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Connect with expert tutors who are passionate about helping you
              achieve your academic goals. Personalized learning, flexible
              scheduling, proven results.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
                <div className="relative flex gap-2 p-2 bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-800/50">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="Search for subjects, topics, or tutors..."
                      className="pl-10 border-0 bg-transparent focus-visible:ring-0"
                    />
                  </div>
                  <Button size="lg" className="px-8">
                    Find Tutors
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              {[
                { icon: Users, label: "Active Tutors", value: "2,500+" },
                { icon: BookOpen, label: "Subjects", value: "150+" },
                { icon: Star, label: "Average Rating", value: "4.9" },
                { icon: Video, label: "Lessons Completed", value: "50K+" },
              ].map((stat, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition duration-300" />
                  <div className="relative p-4 rounded-lg bg-slate-900/50 backdrop-blur-sm border border-slate-800/50">
                    <stat.icon className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-100">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="relative py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-100 to-blue-100 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-lg text-slate-400">
              Getting started with SkillBridge is simple. Follow these three
              easy steps to find your perfect tutor.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: Search,
                title: "Search & Discover",
                description:
                  "Browse our extensive network of qualified tutors by subject, availability, and expertise level.",
              },
              {
                step: "02",
                icon: Calendar,
                title: "Schedule a Session",
                description:
                  "Book a trial lesson at your convenience. Choose between video calls or in-person sessions.",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Start Learning",
                description:
                  "Begin your personalized learning journey and track your progress with regular assessments.",
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-600/50 to-cyan-600/50 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />
                <Card className="relative h-full border-slate-800/50 bg-slate-900/50 group-hover:border-blue-500/30 transition-all duration-500">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <item.icon className="h-6 w-6 text-blue-400" />
                      </div>
                      <span className="text-6xl font-bold text-slate-800/50">
                        {item.step}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-blue-950/5"
      >
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-100 to-blue-100 bg-clip-text text-transparent">
                Why Choose SkillBridge
              </span>
            </h2>
            <p className="text-lg text-slate-400">
              We provide everything you need for a successful online learning
              experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Verified Tutors",
                description:
                  "All tutors are background-checked and verified for quality and safety.",
              },
              {
                icon: Clock,
                title: "Flexible Scheduling",
                description:
                  "Book sessions that fit your schedule, with 24/7 availability.",
              },
              {
                icon: Video,
                title: "Interactive Learning",
                description:
                  "High-quality video calls with screen sharing and digital whiteboard.",
              },
              {
                icon: Target,
                title: "Personalized Plans",
                description:
                  "Custom learning paths tailored to your goals and learning style.",
              },
              {
                icon: MessageSquare,
                title: "Direct Messaging",
                description:
                  "Chat with your tutor anytime for questions and support.",
              },
              {
                icon: Award,
                title: "Progress Tracking",
                description:
                  "Monitor your improvement with detailed analytics and reports.",
              },
            ].map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500" />
                <Card className="relative h-full border-slate-800/50 bg-slate-900/50 group-hover:border-blue-500/30 transition-all duration-500">
                  <CardHeader>
                    <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-fit">
                      <feature.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-100 to-blue-100 bg-clip-text text-transparent">
                Student Success Stories
              </span>
            </h2>
            <p className="text-lg text-slate-400">
              Hear from students who transformed their learning journey with
              SkillBridge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "High School Student",
                image: "SJ",
                content:
                  "My math grades improved from C to A in just 3 months. The personalized attention made all the difference!",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "College Student",
                image: "MC",
                content:
                  "Found an amazing physics tutor who explained complex concepts in ways I could actually understand. Highly recommend!",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Graduate Student",
                image: "ER",
                content:
                  "The flexibility to schedule sessions around my work schedule was perfect. My tutor was patient and knowledgeable.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-slate-800/50 bg-slate-900/50">
                <CardHeader>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {testimonial.image}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {testimonial.role}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-slate-300 text-sm leading-relaxed">
                    {testimonial.content}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-30" />
            <Card className="relative border-blue-500/30 bg-gradient-to-br from-slate-900/90 to-blue-950/50 backdrop-blur-xl">
              <CardHeader className="text-center space-y-6 py-16">
                <CardTitle className="text-4xl sm:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-slate-100 to-blue-100 bg-clip-text text-transparent">
                    Ready to Start Learning?
                  </span>
                </CardTitle>
                <CardDescription className="text-lg text-slate-300 max-w-2xl mx-auto">
                  Join thousands of students who are already achieving their
                  academic goals with expert tutors.
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="text-base px-8" asChild>
                    <Link href="/register">Get Started Free</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8"
                    asChild
                  >
                    <Link href="/tutors">Browse Tutors</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-6 pt-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
