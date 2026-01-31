// src/app/(public)/tutors/page.tsx

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
  Search,
  Star,
  DollarSign,
  BookOpen,
  Filter,
  Loader2,
  User,
  ChevronRight,
} from "lucide-react";

interface Tutor {
  id: string;
  bio?: string;
  hourlyRate?: number;
  rating?: number;
  totalReviews?: number;
  user: {
    id: string;
    name?: string;
    image?: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
}

interface Category {
  id: string;
  name: string;
}

export default function TutorsBrowsePage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    minRating: "",
    sortBy: "rating",
  });
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    fetchTutors();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("https://assignment-4-backend-mkn7.onrender.com/api/tutors/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function fetchTutors() {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.categoryId) queryParams.append("categoryId", filters.categoryId);
      if (filters.minRating) queryParams.append("minRating", filters.minRating);
      queryParams.append("sortBy", filters.sortBy);

      const res = await fetch(
        `https://assignment-4-backend-mkn7.onrender.com/api/tutors/getTutors?${queryParams.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch tutors");
      
      const data = await res.json();
      console.log("Fetched tutors:", data.data);
      setTutors(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchTutors();
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Tutor
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Browse our verified tutors by subject, expertise, and availability
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search tutors..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 bg-slate-950/60 border-slate-800/50"
                />
              </div>
              
              <select
                value={filters.categoryId}
                onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                className="h-10 px-3 rounded-md bg-slate-950/60 border border-slate-800/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Subjects</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                className="h-10 px-3 rounded-md bg-slate-950/60 border border-slate-800/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>

              <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No tutors found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <Card
                key={tutor.id}
                className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50 group cursor-pointer hover:border-blue-500/30 transition-all duration-300"
                onClick={() => router.push(`/tutors/${tutor.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl font-bold text-blue-400">
                      {tutor.user?.name?.charAt(0).toUpperCase() || "T"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-slate-100 truncate">
                        {tutor.user?.name || "Anonymous Tutor"}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-slate-300">
                          {tutor.rating?.toFixed(1) || "New"}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({tutor.totalReviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {tutor.bio || "No bio available"}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {tutor.categories.slice(0, 3).map((cat) => (
                      <span
                        key={cat.id}
                        className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-slate-300">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="font-semibold">${tutor.hourlyRate || 0}</span>
                      <span className="text-sm text-slate-500">/hr</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition">
                      View Profile <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}