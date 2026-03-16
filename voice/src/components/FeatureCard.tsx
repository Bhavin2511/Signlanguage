"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  color: "blue" | "purple" | "teal";
}

const routeMap: Record<string, string> = {
  "Start Translation": "/translator",
  "Start Learning":    "/learning",
  "Start Call":        "/video-call",
};

const FeatureCard = ({ icon: Icon, title, description, buttonText, color }: FeatureCardProps) => {
  const router = useRouter();

  const colorMap = {
    blue:   "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    teal:   "bg-teal-50 text-teal-600",
  };

  const btnColorMap = {
    blue:   "bg-blue-600 shadow-blue-500/20",
    purple: "bg-purple-600 shadow-purple-500/20",
    teal:   "bg-teal-600 shadow-teal-500/20",
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass p-8 rounded-[32px] shadow-subtle hover:shadow-premium transition-all duration-300 border border-white flex flex-col items-center text-center"
    >
      <div className={`w-16 h-16 ${colorMap[color]} rounded-2xl flex items-center justify-center mb-6`}>
        <Icon size={32} />
      </div>

      <h3 className="text-2xl font-bold heading-font text-foreground mb-4">{title}</h3>
      {description && <p className="text-foreground/60 leading-relaxed mb-8">{description}</p>}

      <button
        onClick={() => router.push(routeMap[buttonText] || "/dashboard")}
        className={`mt-auto w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 ${btnColorMap[color]} hover:opacity-90`}
      >
        {buttonText}
      </button>
    </motion.div>
  );
};

export default FeatureCard;