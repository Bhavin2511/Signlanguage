"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface StatusProps {
  isCorrect: boolean | null;
  confidence: number;
}

export default function DetectionStatus({ isCorrect, confidence }: StatusProps) {
  if (isCorrect === null) return (
    <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 text-center italic text-slate-400 font-medium">
      Perform the sign to see results
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isCorrect ? "correct" : "incorrect"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`rounded-[24px] p-6 border-2 flex flex-col items-center gap-3 transition-colors ${
          isCorrect 
            ? "bg-green-50 border-green-200 text-green-700" 
            : "bg-red-50 border-red-200 text-red-700"
        }`}
      >
        <div className="flex items-center gap-3">
          {isCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
          <span className="text-xl font-bold">
            {isCorrect ? "Correct Sign Detected" : "Incorrect Sign — Try Again"}
          </span>
        </div>
        
        <div className="w-full h-[1px] bg-current opacity-10 my-1"></div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold opacity-70">Detection Confidence:</span>
          <span className="text-lg font-black">{Math.round(confidence)}%</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}