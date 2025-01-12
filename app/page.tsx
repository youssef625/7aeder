'use client';

import { ArrowRight, BookOpen, GraduationCap, Users, CheckCircle2, PlayCircle, Menu, X, Clock, Star, BookOpenCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-indigo-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="h-8 w-8" />
              7ader
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/courses" className="hover:text-indigo-200 transition">
                Courses
              </Link>
              <Link href="/teachers" className="hover:text-indigo-200 transition">
                Teachers
              </Link>
              <Link href="/about" className="hover:text-indigo-200 transition">
                About
              </Link>
              <Link href="/contact" className="hover:text-indigo-200 transition">
                Contact
              </Link>
              <Link 
                href="/login" 
                className="bg-white text-indigo-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-indigo-200 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/courses" 
                  className="hover:bg-indigo-800 px-4 py-2 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link 
                  href="/teachers" 
                  className="hover:bg-indigo-800 px-4 py-2 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Teachers
                </Link>
                <Link 
                  href="/about" 
                  className="hover:bg-indigo-800 px-4 py-2 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="hover:bg-indigo-800 px-4 py-2 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link 
                  href="/login" 
                  className="bg-white text-indigo-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition inline-block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Learn From The Best Online Education Platform
              </h1>
              <p className="text-lg text-indigo-100">
                Access world-class education from anywhere. Learn from expert instructors and join a global community of learners.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-indigo-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-2">
                  Get Started <ArrowRight className="h-5 w-5" />
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition flex items-center gap-2">
                  Watch Demo <PlayCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <h3 className="text-3xl font-bold">15K+</h3>
                  <p className="text-indigo-200">Active Students</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold">45+</h3>
                  <p className="text-indigo-200">Expert Tutors</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold">100+</h3>
                  <p className="text-indigo-200">Video Courses</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="Students learning"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose 7ader?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best online learning experience with our expert instructors and comprehensive course materials.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <BookOpenCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Teachers</h3>
              <p className="text-gray-600">
                Learn from industry experts who are passionate about teaching and helping you succeed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexible Learning</h3>
              <p className="text-gray-600">
                Study at your own pace with 24/7 access to course materials and recorded lectures.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Star className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Content</h3>
              <p className="text-gray-600">
                Access high-quality, up-to-date course materials designed to help you master new skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning on 7ader. Start your journey today!
          </p>
          <Link 
            href="/courses"
            className="bg-white text-indigo-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2"
          >
            Browse Courses <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}