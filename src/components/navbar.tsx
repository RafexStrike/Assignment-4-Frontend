"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all duration-300" />
              <GraduationCap className="h-8 w-8 text-blue-500 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              TutorConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/tutors" 
              className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
            >
              Find Tutors
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
            >
              How It Works
            </Link>
            <Link 
              href="#features" 
              className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
            >
              Features
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-blue-400 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/50 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-4">
              <Link 
                href="/tutors" 
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Tutors
              </Link>
              <Link 
                href="#how-it-works" 
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="#features" 
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-800/50">
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}