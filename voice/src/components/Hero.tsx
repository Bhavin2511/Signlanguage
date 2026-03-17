"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const Hero = () => {
  const [showImages, setShowImages] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <section className="relative pt-16 pb-12 md:pt-28 md:pb-24 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-soft-blue rounded-full blur-[120px] -z-10 opacity-60" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-soft-purple rounded-full blur-[100px] -z-10 opacity-50" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-blue text-accent-blue text-xs font-bold mb-6 tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              NOW SUPPORTING 22+ INDIAN SIGN LANGUAGES
            </div>

            <h1 className="text-5xl md:text-7xl font-bold heading-font leading-tight tracking-tight text-foreground mb-4">
              Breaking Communication <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-blue-600">
                Barriers
              </span>{" "}
              with Sign Language
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6 max-w-xl">
              SilentVoice helps deaf and mute individuals communicate, learn Indian Sign Language,
              and connect with others through real-time translation and video interaction.
            </p>

            {/* ── Show Get Started ONLY if logged in ── */}
            {user && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-8 py-4 bg-accent-blue text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 hover:bg-blue-600 hover:shadow-2xl transition-all active:scale-95 group"
                >
                  Get Started
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            <div className="mt-10 flex items-center gap-4 text-sm text-foreground/50">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                  </div>
                ))}
              </div>
              <p>Joined by <span className="font-semibold text-foreground/80">5,000+</span> users this month</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 w-full aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[40px] shadow-premium overflow-hidden border border-white relative">
                <Image
                  src="/images/hero.png"
                  alt="SilentVoice Sign Language Illustration"
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>

            {/* Floating UI Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-10 -left-10 glass p-4 rounded-2xl shadow-premium z-20 flex items-center gap-3 border-white/50"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-wider">Detection</p>
                <p className="text-sm font-bold text-foreground/80">98.5% Accuracy</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute bottom-20 -right-5 glass p-4 rounded-2xl shadow-premium z-20 flex items-center gap-3 border-white/50"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                A
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-wider">Learning</p>
                <p className="text-sm font-bold text-foreground/80">ISL Alphabet</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;