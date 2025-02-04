"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Clock, Send } from "lucide-react";

interface Question {
  id: string;
  exam_id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

interface ExamDetails {
  id: string;
  title: string;
  description: string;
  duration: number;
  total_marks: number;
  teacher_name: string;
}

interface ExamSubmission {
  exam_id: string;
  answers: { [key: string]: string };
}

export default function ExamPage() {
  const params = useParams();
  const [exam, setExam] = useState<ExamDetails | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
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
          fetchExamDetails();
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    checkAuth();
  }, []);

  const fetchExamDetails = async () => {
    try {
      const [examRes, questionsRes] = await Promise.all([
        fetch(`/api/exams/${params.id}`),
        fetch(`/api/exams/${params.id}/questions`),
      ]);

      if (!examRes.ok || !questionsRes.ok) {
        throw new Error("Failed to fetch exam details");
      }

      const [examData, questionsData] = await Promise.all([
        examRes.json(),
        questionsRes.json(),
      ]);

      setExam(examData);
      setQuestions(questionsData);
      setTimeLeft(examData.duration * 60); // Convert minutes to seconds
    } catch (error) {
      console.error("Error fetching exam details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!confirm("Are you sure you want to submit the exam?")) return;

    try {
      const res = await fetch(`/api/exams/${params.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) throw new Error("Failed to submit exam");

      const data = await res.json();
      setScore(data.score);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!exam) return <div className="p-8">Exam not found</div>;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (submitted) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">Exam Submitted</h1>
          <p className="text-xl mb-4">
            Your score: {score} out of {exam.total_marks}
          </p>
          <p className="text-gray-600">
            Thank you for completing the exam. Your responses have been recorded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Exam Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
              <p className="text-gray-600 mb-2">{exam.description}</p>
              <p className="text-sm text-gray-500">
                Teacher: {exam.teacher_name} | Total Marks: {exam.total_marks}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-lg font-semibold text-indigo-600 mb-2">
                <Clock className="h-5 w-5 mr-2" />
                {timeLeft !== null && timeLeft > 0 ? (
                  formatTime(timeLeft)
                ) : (
                  <span className="text-red-600">Time's up!</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                {index + 1}. {question.question}
              </h3>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={() => handleAnswerChange(question.id, option)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={timeLeft !== null && timeLeft <= 0}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="h-5 w-5" />
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}