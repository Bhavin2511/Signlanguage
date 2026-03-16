"use client";

import React from "react";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold heading-font text-accent-blue tracking-tight">
              SilentVoice
            </span>
          </Link>
          <p className="text-foreground/50 max-w-sm leading-relaxed">
            SilentVoice is an AI-powered platform dedicated to removing communication 
            barriers for the deaf and mute community through innovative Sign Language technology.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-6">Platform</h4>
          <ul className="space-y-4">
            {["Features", "About", "Contact", "Privacy Policy"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-foreground/60 hover:text-accent-blue transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-6">Connect</h4>
          <div className="flex gap-4">
            <Link href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-foreground/60 hover:bg-accent-blue hover:text-white transition-all">
              <Github size={20} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-foreground/60 hover:bg-accent-blue hover:text-white transition-all">
              <Linkedin size={20} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-foreground/60 hover:bg-accent-blue hover:text-white transition-all">
              <Twitter size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-foreground/40 text-sm">
          © {new Date().getFullYear()} SilentVoice. All rights reserved.
        </p>
        <div className="flex gap-8 text-sm text-foreground/40">
          <Link href="#" className="hover:text-foreground/80">Terms of Service</Link>
          <Link href="#" className="hover:text-foreground/80">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;