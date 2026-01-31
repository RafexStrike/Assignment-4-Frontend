// src/app/admin/categories/page.tsx

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
  Plus,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Tag,
  X,
  Save,
  BookOpen,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string;
  tutorCount?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Form state
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("http://localhost:5000/api/admin/categories", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage({ type: "error", text: "Failed to load categories" });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/admin/categories", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create category");
      }

      setMessage({ type: "success", text: "Category created successfully" });
      setIsCreating(false);
      setFormData({ name: "", description: "" });
      fetchCategories();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !formData.name.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`http://localhost:5000/api/admin/categories/${editingId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update category");
      }

      setMessage({ type: "success", text: "Category updated successfully" });
      setEditingId(null);
      setFormData({ name: "", description: "" });
      fetchCategories();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(categoryId: string, tutorCount: number) {
    if (tutorCount > 0) {
      alert(`Cannot delete category. It is assigned to ${tutorCount} tutor(s). Please reassign tutors first.`);
      return;
    }

    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/admin/categories/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete category");
      }

      setMessage({ type: "success", text: "Category deleted successfully" });
      fetchCategories();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsCreating(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: "", description: "" });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Category Management</h1>
          <p className="text-slate-400 mt-1">
            Manage subject categories for tutors
          </p>
        </div>
        {!isCreating && !editingId && (
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        )}
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

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-slate-100 text-lg">
              {editingId ? "Edit Category" : "Create New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={editingId ? handleUpdate : handleCreate}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Category Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className="bg-slate-950/60 border-slate-800/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category..."
                  className="w-full min-h-[80px] px-3 py-2 rounded-md bg-slate-950/60 border border-slate-800/50 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  {editingId ? "Save Changes" : "Create Category"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50 group hover:border-slate-700 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Tag className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-slate-400 mt-1">{category.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                      <BookOpen className="h-3 w-3" />
                      <span>{category.tutorCount || 0} tutors</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                    onClick={() => startEdit(category)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDelete(category.id, category.tutorCount || 0)}
                    disabled={(category.tutorCount || 0) > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50 md:col-span-2">
            <CardContent className="p-12 text-center">
              <Tag className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No categories found</p>
              <p className="text-sm text-slate-500 mt-1">
                Create your first category to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}