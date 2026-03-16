"use client";

import React from "react";
import TranslatorNavbar from "@/components/isl/TranslatorNavbar";
import AlphabetCard from "@/components/learning/AlphabetCard";
import { LABELS } from "@/store/islStore";
import { motion } from "framer-motion";

export default function LearningDashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <TranslatorNavbar />
      
      <main className="max-w-[1200px] mx-auto px-6 pt-24 pb-16">
        {/* Header section */}
        <section className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
          >
            Learn Indian Sign Language
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 font-medium"
          >
            Practice and master Indian Sign Language step-by-step.
          </motion.p>
        </section>

        {/* Alphabet Learning Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-[40px] p-8 md:p-12 border border-white shadow-premium">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-800">Alphabet Learning</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {LABELS.map((letter, idx) => (
              <motion.div
                key={letter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <AlphabetCard letter={letter} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}