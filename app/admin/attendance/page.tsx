"use client";

import { useState, useEffect } from "react";
import { Search, Check, X } from "lucide-react";

interface User {
  id: string;
  name: string;
}

interface Lecture {
  id: string;
  name: string;
  day: string;
}

interface Attendance {
  id: string;
  user_id: string;
  lecture_id: string;
  attended: boolean;
  user_name: string;
  lecture_name: string;
  lecture_day: string;
}

export default function AttendancePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, lecturesRes, attendanceRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/lectures"),
        fetch("/api/attendance"),
      ]);

      if (!usersRes.ok || !lecturesRes.ok || !attendanceRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [usersData, lecturesData, attendanceData] = await Promise.all([
        usersRes.json(),
        lecturesRes.json(),
        attendanceRes.json(),
      ]);

      // Transform attendance data to include user and lecture information
      const enrichedAttendance = attendanceData.map((record: any) => {
        const user = usersData.find((u: User) => u.id === record.user_id);
        const lecture = lecturesData.find(
          (l: Lecture) => l.id === record.lecture_id
        );
        return {
          ...record,
          user_name: user?.name || "",
          lecture_name: lecture?.name || "",
          lecture_day: lecture?.day || "",
        };
      });

      setUsers(usersData);
      setLectures(lecturesData);
      setAttendance(enrichedAttendance);
      if (lecturesData.length > 0) {
        setSelectedLecture(lecturesData[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (
    userId: string,
    lectureId: string,
    attended: boolean
  ) => {
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, lectureId, attended }),
      });

      if (!res.ok) throw new Error("Failed to update attendance");

      // Update local state with all attendance information
      setAttendance((prev) => {
        const existingRecord = prev.find(
          (a) => a.user_id === userId && a.lecture_id === lectureId
        );

        if (existingRecord) {
          // Update existing record
          return prev.map((a) =>
            a.user_id === userId && a.lecture_id === lectureId
              ? { ...a, attended }
              : a
          );
        } else {
          // Create new record if it doesn't exist
          const user = users.find((u) => u.id === userId);
          const lecture = lectures.find((l) => l.id === lectureId);
          return [
            ...prev,
            {
              id: `${userId}-${lectureId}`, // temporary ID
              user_id: userId,
              lecture_id: lectureId,
              attended,
              user_name: user?.name || "",
              lecture_name: lecture?.name || "",
              lecture_day: lecture?.day || "",
            },
          ];
        }
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Attendance Management</h1>

        {/* Search and Lecture Selection */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedLecture}
            onChange={(e) => setSelectedLecture(e.target.value)}
            className="p-2 border rounded-lg min-w-[200px]"
          >
            {lectures.map((lecture) => (
              <option key={lecture.id} value={lecture.id}>
                {lecture.name} ({lecture.day})
              </option>
            ))}
          </select>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const attendanceRecord = attendance.find(
                  (a) => a.user_id == user.id && a.lecture_id == selectedLecture
                );

                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          attendanceRecord?.attended
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {attendanceRecord?.attended ? "Present" : "Absent"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleAttendanceChange(
                              user.id,
                              selectedLecture,
                              true
                            )
                          }
                          className={`p-1 rounded-full ${
                            attendanceRecord?.attended
                              ? "bg-green-100 text-green-600"
                              : "hover:bg-green-100 text-gray-400"
                          }`}
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleAttendanceChange(
                              user.id,
                              selectedLecture,
                              false
                            )
                          }
                          className={`p-1 rounded-full ${
                            !attendanceRecord?.attended
                              ? "bg-red-100 text-red-600"
                              : "hover:bg-red-100 text-gray-400"
                          }`}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
