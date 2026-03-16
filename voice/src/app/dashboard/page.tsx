"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import { HandMetal, BookOpen, Video, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Dashboard Top Bar */}
      <nav className="glass sticky top-0 z-50 py-4 px-6 border-b border-gray-100 shadow-subtle flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold heading-font text-accent-blue tracking-tight">
            SilentVoice
          </span>
        </Link>

        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-foreground/50 hover:text-accent-blue hover:bg-soft-blue rounded-xl transition-all"
          >
            <Settings size={22} />
          </button>

          <AnimatePresence>
            {showSettings && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowSettings(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-premium border border-gray-100 py-2 z-50"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors font-semibold text-sm"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-4xl font-bold heading-font mb-4">Good morning, Aman 👋</h1>
          <p className="text-foreground/50 text-lg">What would you like to do today?</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard
            icon={HandMetal}
            title="Sign Language Translator"
            description=""
            buttonText="Start Translation"
            color="blue"
          />
          <FeatureCard
            icon={BookOpen}
            title="Learn Sign Language"
            description=""
            buttonText="Start Learning"
            color="teal"
          />
          <FeatureCard
            icon={Video}
            title="Sign Language Video Call"
            description=""
            buttonText="Start Call"
            color="purple"
          />
        </div>

        <div className="mt-20 glass p-10 rounded-[32px] border border-white shadow-premium">
           <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="max-w-lg">
                 <h2 className="text-2xl font-bold heading-font mb-4">Resume your last lesson</h2>
                 <p className="text-foreground/60 mb-6">You were learning "Common Everyday Phrases". Continue where you left off to maintain your 5-day streak!</p>
                 <button className="px-8 py-3 bg-foreground text-white font-bold rounded-xl hover:bg-gray-800 transition-all">
                    Continue Lesson
                 </button>
              </div>
              <div className="w-full md:w-64 aspect-video bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-100">
                 <p className="text-foreground/30 font-bold text-sm uppercase">Lesson Preview</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}