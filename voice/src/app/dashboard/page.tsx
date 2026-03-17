"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import { HandMetal, BookOpen, Video, LogOut, Settings, User, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [showSettings, setShowSettings] = useState(false);
  const [lastLetter, setLastLetter] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("last_alphabet_lesson");
    if (saved) setLastLetter(saved);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

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

        <div className="mt-20 glass p-10 rounded-[40px] border border-white shadow-premium bg-gradient-to-br from-white to-slate-50">
           <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="max-w-lg">
                 <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-accent-blue/10">In Progress</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{today}</span>
                 </div>
                 <h2 className="text-3xl font-black heading-font text-slate-900 mb-4">Resume your last lesson</h2>
                 <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                   {lastLetter 
                    ? `You were practicing Character "${lastLetter}". Continue your journey to master the entire Indian Sign Language alphabet!`
                    : "Start your first lesson today and begin mastering the A-Z alphabet in Indian Sign Language."}
                 </p>
                 <button 
                  onClick={() => router.push(lastLetter ? `/learning/alphabet/${lastLetter}` : "/learning")}
                  className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200"
                 >
                    Continue Lesson {lastLetter && `(${lastLetter})`}
                 </button>
              </div>
              
              <div className="w-full md:w-80 aspect-square bg-white rounded-[40px] flex items-center justify-center border border-slate-100 shadow-xl p-8 relative group overflow-hidden">
                 <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors" />
                 {lastLetter ? (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                       <Image 
                        src={`/images/alphabet/${lastLetter}.png`} 
                        alt="Last Lesson" 
                        width={200}
                        height={200}
                        className="object-contain drop-shadow-2xl"
                       />
                       <p className="mt-4 text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Lesson Preview</p>
                    </motion.div>
                 ) : (
                    <div className="text-center">
                       <BookOpen size={48} className="text-slate-200 mx-auto mb-4" />
                       <p className="text-slate-300 font-bold text-sm uppercase tracking-widest">No Recent Activity</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}