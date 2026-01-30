import Link from "next/link"
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-blue-950/10 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                <GraduationCap className="h-8 w-8 text-blue-500 relative z-10" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                TutorConnect
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs">
              Connecting passionate students with expert tutors for personalized learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-100 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tutors" className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/become-tutor" className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  Become a Tutor
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-slate-100 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-100 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-blue-500" />
                <a href="mailto:hello@tutorconnect.com" className="hover:text-blue-400 transition-colors duration-200">
                  hello@tutorconnect.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="h-4 w-4 text-blue-500" />
                <a href="tel:+1234567890" className="hover:text-blue-400 transition-colors duration-200">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                <span>123 Education St,<br />Learning City, LC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} TutorConnect. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-blue-400 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-blue-400 transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}