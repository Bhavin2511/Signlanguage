"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "glass py-3 shadow-subtle" : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold heading-font text-accent-blue tracking-tight">
            SilentVoice
          </span>
        </Link>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!user && (
            <>
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-medium text-foreground/80 hover:text-accent-blue transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-accent-blue text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground/80"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t p-6 flex flex-col gap-4"
        >
          {!user ? (
            <div className="flex flex-col gap-3 mt-4">
              <Link
                href="/login"
                className="w-full py-3 text-center font-medium border border-gray-100 rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="w-full py-3 text-center font-semibold bg-accent-blue text-white rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <Link
              href="/dashboard"
              className="w-full py-3 text-center font-semibold bg-accent-blue text-white rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;