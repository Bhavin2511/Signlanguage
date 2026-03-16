"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressProps {
  currentLetter: string;
  accuracy: number;
}

export default function LearningProgressBar({ currentLetter, accuracy }: ProgressProps) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const currentIndex = letters.indexOf(currentLetter.toUpperCase());
  const progressPercent = ((currentIndex + 1) / letters.length) * 100;

  return (
    <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-slate-800">Practice Progress</h4>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          Letter {currentLetter}
        </span>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
            <span>Progress (A-Z)</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-blue-500 rounded-full"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
          <span className="text-xs text-slate-500 font-medium">Session Accuracy</span>
          <span className="text-sm font-bold text-green-600">{accuracy}%</span>
        </div>
      </div>
    </div>
  );
}