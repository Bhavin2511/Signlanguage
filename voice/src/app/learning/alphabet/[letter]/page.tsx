"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ISLCamera from '@/components/isl/ISLCamera';
import { ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AlphabetLessonPage() {
  const router = useRouter();
  const params = useParams();
  const letter = (params.letter as string).toUpperCase();
  const [currentDetection, setCurrentDetection] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePrediction = (pred: string | null) => {
    setCurrentDetection(pred);
    if (pred === letter && !isSuccess) {
        setIsSuccess(true);
        // Play success sound logic here
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      <Navbar />
      
      <div className="pt-32 px-6">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Library
          </button>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-10">
                <span className="text-primary font-bold text-sm tracking-[0.2em] mb-4 block">ALPHABET LESSON</span>
                <h1 className="text-6xl font-display font-black text-slate-900 mb-6">Character "{letter}"</h1>
                <p className="text-xl text-slate-500 leading-relaxed font-medium">
                  Watch the guide below and try to replicate the "{letter}" sign in front of your camera. Our AI will provide instant feedback on your posture.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                    How to perform this sign:
                </h3>
                <ul className="space-y-4 text-slate-600 font-medium">
                    <li className="flex gap-4">
                        <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500 shrink-0">1</span>
                        Lift your dominant hand to chest height.
                    </li>
                    <li className="flex gap-4">
                        <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500 shrink-0">2</span>
                        Adjust your fingers according to the ISL standard for "{letter}".
                    </li>
                    <li className="flex gap-4">
                        <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500 shrink-0">3</span>
                        Hold the position until the AI confirms a match.
                    </li>
                </ul>
              </div>

              <AnimatePresence>
                {isSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-green-500 rounded-[32px] text-white flex items-center justify-between shadow-xl shadow-green-500/20"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-xl">Perfect Match!</p>
                                <p className="text-green-100 font-bold">You've mastered the letter {letter}</p>
                            </div>
                        </div>
                        <button className="bg-white text-green-600 px-6 py-2 rounded-xl font-bold hover:bg-green-50 transition-colors">
                            Next Lesson
                        </button>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <div className="sticky top-32">
                  <div className="relative">
                    <ISLCamera onPrediction={handlePrediction} />
                    
                    {currentDetection && (
                        <div className="absolute top-6 left-6 glass px-4 py-2 rounded-xl border-white/20">
                            <span className="text-white text-xs font-bold uppercase tracking-widest">Detected: {currentDetection}</span>
                        </div>
                    )}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
