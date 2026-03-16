"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import { HandMetal, BookOpen, Video, Target, Heart, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-accent-blue/10 selection:text-accent-blue">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  );
}