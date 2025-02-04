"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Users, GraduationCap } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TeacherManagementData {
  students?: User[];
  assistants?: User[];
}

export default function TeacherManagementPage() {
  const [data, setData] = useState<TeacherManagementData>({});
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "assistant">("student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [managementRes, usersRes] = await Promise.all([
        fetch("/api/teacher-management"),
        fetch("/api/users")
      ]);

      if (!managementRes.ok || !usersRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [managementData, usersData] = await Promise.all([
        managementRes.json(),
        usersRes.json()
      ]);

      setData(managementData);
      setAvailableUsers(usersData.filter((user: User) => 
        user.role === selectedRole &&
        !managementData.students?.find((s: User) => s.id === user.id) &&
        !managementData.assistants?.find((a: User) => a.id === user.id)
      ));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch("/api/teacher-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          userId: selectedUser,
          type: selectedRole
        }),
      });

      if (!res.ok) throw new Error("Failed to add user");
      
      fetchData();
      setSelectedUser("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleRemoveUser = async (userId: string, type: "student" | "assistant") => {
    if (!confirm(`Are you sure you want to remove this ${type}?`)) return;

    try {
      const res = await fetch("/api/teacher-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove",
          userId,
          type
        }),
      });

      if (!res.ok) throw new Error(`Failed to remove ${type}`);
      
      fetchData();
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Student & Assistant Management</h1>

        {/* Add User Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <form onSubmit={handleAddUser} className="flex gap-4">
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value as "student" | "assistant");
                setSelectedUser("");
              }}
              className="border rounded p-2"
            >
              <option value="student">Student</option>
              <option value="assistant">Assistant</option>
            </select>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border rounded p-2 flex-1"
            >
              <option value="">Select a user...</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!selectedUser}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add {selectedRole}
            </button>
          </form>
        </div>

        {/* Assistants Section */}
        {data.assistants && (
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Assistants
              </h2>
            </div>
            <div className="p-6">
              {data.assistants.length === 0 ? (
                <p className="text-gray-500">No assistants assigned yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.assistants.map((assistant) => (
                    <div
                      key={assistant.id}
                      className="border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{assistant.name}</p>
                        <p className="text-sm text-gray-500">{assistant.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveUser(assistant.id, "assistant")}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Students Section */}
        {data.students && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
                Students
              </h2>
            </div>
            <div className="p-6">
              {data.students.length === 0 ? (
                <p className="text-gray-500">No students assigned yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.students.map((student) => (
                    <div
                      key={student.id}
                      className="border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveUser(student.id, "student")}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}