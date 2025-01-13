"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, PencilIcon } from "lucide-react";

interface Lecture {
  id: string;
  name: string;
  day: string;
  created_at: string;
}

export default function LectureManagement() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [newLecture, setNewLecture] = useState({ name: "", day: "" });
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const res = await fetch("/api/lectures");
      const data = await res.json();
      setLectures(data);
    } catch (error) {
      console.error("Failed to fetch lectures:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/lectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLecture),
      });
      if (!res.ok) throw new Error("Failed to create lecture");
      setNewLecture({ name: "", day: "" });
      fetchLectures();
    } catch (error) {
      console.error("Error creating lecture:", error);
    }
  };

  const handleUpdateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLecture) return;

    try {
      const res = await fetch("/api/lectures", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingLecture),
      });
      if (!res.ok) throw new Error("Failed to update lecture");
      setEditingLecture(null);
      fetchLectures();
    } catch (error) {
      console.error("Error updating lecture:", error);
    }
  };

  const handleDeleteLecture = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lecture?")) return;
    try {
      const res = await fetch("/api/lectures", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete lecture");
      fetchLectures();
    } catch (error) {
      console.error("Error deleting lecture:", error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Lecture Management</h1>

        {/* Create Lecture Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Lecture</h2>
          <form
            onSubmit={handleCreateLecture}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Lecture Name"
              value={newLecture.name}
              onChange={(e) =>
                setNewLecture({ ...newLecture, name: e.target.value })
              }
              className="border rounded p-2"
              required
            />
            <select
              value={newLecture.day}
              onChange={(e) =>
                setNewLecture({ ...newLecture, day: e.target.value })
              }
              className="border rounded p-2"
              required
            >
              <option value="">Select Day</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Lecture
            </button>
          </form>
        </div>

        {/* Lectures Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
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
              {lectures.map((lecture) => (
                <tr key={lecture.id}>
                  {editingLecture?.id === lecture.id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {lecture.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editingLecture.name}
                          onChange={(e) =>
                            setEditingLecture({
                              ...editingLecture,
                              name: e.target.value,
                            })
                          }
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={editingLecture.day}
                          onChange={(e) =>
                            setEditingLecture({
                              ...editingLecture,
                              day: e.target.value,
                            })
                          }
                          className="border rounded p-1"
                        >
                          {daysOfWeek.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(lecture.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={handleUpdateLecture}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingLecture(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {lecture.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lecture.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {lecture.day}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(lecture.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => setEditingLecture(lecture)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLecture(lecture.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
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
