"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AlphabetCardProps {
  letter: string;
}

export default function AlphabetCard({ letter }: AlphabetCardProps) {
  return (
    <Link href={`/learning/alphabet/${letter}`}>
      <motion.div
        whileHover={{ 
          y: -8, 
          backgroundColor: "var(--isl-accent-soft)",
          borderColor: "var(--isl-accent)",
          boxShadow: "var(--isl-shadow-lg)"
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white border-2 border-slate-100 rounded-[24px] p-6 flex flex-col items-center justify-center cursor-pointer transition-all h-full min-h-[160px]"
      >
        <span className="text-5xl font-extrabold text-slate-800 mb-2">{letter}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Practice Sign</span>
      </motion.div>
    </Link>
  );
}