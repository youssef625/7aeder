"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, PencilIcon, Eye } from "lucide-react";
import Link from "next/link";

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  created_at: string;
  teacher_id: string;
  total_marks: number;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [newExam, setNewExam] = useState({
    title: "",
    description: "",
    duration: 60,
    total_marks: 100,
  });
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", {
          headers: {
            Authorization: `Bearer ${document.cookie.split("token=")[1]?.split(";")[0]}`,
          },
        });
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          fetchExams();
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    checkAuth();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/exams");
      if (!res.ok) throw new Error("Failed to fetch exams");
      const data = await res.json();
      setExams(data);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExam),
      });
      if (!res.ok) throw new Error("Failed to create exam");
      setNewExam({
        title: "",
        description: "",
        duration: 60,
        total_marks: 100,
      });
      fetchExams();
    } catch (error) {
      console.error("Error creating exam:", error);
    }
  };

  const handleUpdateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam) return;

    try {
      const res = await fetch("/api/exams", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingExam),
      });
      if (!res.ok) throw new Error("Failed to update exam");
      setEditingExam(null);
      fetchExams();
    } catch (error) {
      console.error("Error updating exam:", error);
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    try {
      const res = await fetch("/api/exams", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete exam");
      fetchExams();
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Exam Management</h1>

        {/* Create Exam Form */}
        {["teacher", "assistant", "admin"].includes(user?.role) && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Exam</h2>
            <form onSubmit={handleCreateExam} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Exam Title"
                value={newExam.title}
                onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                className="border rounded p-2"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newExam.description}
                onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                className="border rounded p-2"
                required
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={newExam.duration}
                onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) })}
                className="border rounded p-2"
                required
                min="1"
              />
              <input
                type="number"
                placeholder="Total Marks"
                value={newExam.total_marks}
                onChange={(e) => setNewExam({ ...newExam, total_marks: parseInt(e.target.value) })}
                className="border rounded p-2"
                required
                min="1"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" /> Create Exam
              </button>
            </form>
          </div>
        )}

        {/* Exams Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr key={exam.id}>
                  {editingExam?.id === exam.id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editingExam.title}
                          onChange={(e) =>
                            setEditingExam({
                              ...editingExam,
                              title: e.target.value,
                            })
                          }
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editingExam.description}
                          onChange={(e) =>
                            setEditingExam({
                              ...editingExam,
                              description: e.target.value,
                            })
                          }
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={editingExam.duration}
                          onChange={(e) =>
                            setEditingExam({
                              ...editingExam,
                              duration: parseInt(e.target.value),
                            })
                          }
                          className="border rounded p-1 w-20"
                          min="1"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={editingExam.total_marks}
                          onChange={(e) =>
                            setEditingExam({
                              ...editingExam,
                              total_marks: parseInt(e.target.value),
                            })
                          }
                          className="border rounded p-1 w-20"
                          min="1"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(exam.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={handleUpdateExam}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingExam(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">{exam.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{exam.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{exam.duration} min</td>
                      <td className="px-6 py-4 whitespace-nowrap">{exam.total_marks}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(exam.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        {["teacher", "assistant", "admin"].includes(user?.role) && (
                          <>
                            <button
                              onClick={() => setEditingExam(exam)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteExam(exam.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        <Link
                          href={`/admin/exams/${exam.id}`}
                          className="text-indigo-600 hover:text-indigo-900 inline-block"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}