"use client";

import React, { useState, useEffect } from "react";
import TranslatorNavbar from "@/components/isl/TranslatorNavbar";
import { 
  Video, 
  Plus, 
  ArrowRight, 
  Copy, 
  Share2, 
  Monitor, 
  Mic, 
  MicOff, 
  Camera, 
  VideoOff, 
  PhoneOff, 
  MessageSquare,
  Users,
  ShieldCheck,
  Zap,
  Globe,
  Subtitles,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function VideoCallPage() {
  const [view, setView] = useState<"lobby" | "call">("lobby");
  const [meetingId, setMeetingId] = useState("");
  const [joinId, setJoinId] = useState("");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isAIDetectOn, setIsAIDetectOn] = useState(true);

  const generateMeeting = () => {
    const id = Math.random().toString(36).substring(2, 5) + "-" + 
               Math.random().toString(36).substring(2, 5) + "-" + 
               Math.random().toString(36).substring(2, 5);
    setMeetingId(id.toUpperCase());
  };

  const handleCreate = () => {
    generateMeeting();
  };

  const startMeeting = () => {
    setView("call");
  };

  const handleJoin = () => {
    if (joinId.trim()) {
      setView("call");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://silentvoice.ai/join/${meetingId}`);
    // Show toast or alert
  };

  if (view === "call") {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
        {/* Top Bar */}
        <header className="px-6 h-16 flex items-center justify-between border-b border-white/10 glass">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center">
              <Video className="text-white" size={20} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">Meeting ID: <span className="text-accent-blue">{meetingId || joinId}</span></p>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400">Connection Stable • 42ms Latency</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <Users size={16} className="text-slate-400" />
              <span className="text-xs font-bold">2 Participants</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="p-2 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer transition-all">
                  <ShieldCheck size={20} className="text-blue-400" />
               </div>
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white/20" />
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <main className="flex-1 relative flex">
          {/* Main Video Area */}
          <div className="flex-1 relative bg-slate-900 group">
             {/* Participant Video (Mock) */}
             <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop" 
                  alt="Remote Participant"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="glass px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-2">
                    <span className="text-xs font-bold">Sarah Williams</span>
                    <Mic size={14} className="text-green-400" />
                  </div>
                </div>
             </div>

             {/* Self Preview */}
             <div className="absolute bottom-8 right-8 w-64 aspect-video rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl z-10 transition-transform group-hover:scale-105">
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                  {isCamOn ? (
                    <Image 
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop" 
                      alt="Self Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User size={40} className="text-slate-600" />
                  )}
                </div>
                {!isMicOn && (
                  <div className="absolute top-3 right-3 p-1.5 bg-red-500 rounded-lg">
                    <MicOff size={12} className="text-white" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3 glass px-3 py-1 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold">Me (Signer)</span>
                </div>
             </div>

             {/* Sign Detection Overlay Lines (Animated) */}
             {isAIDetectOn && (
               <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] border border-blue-400/30 rounded-[40px] animate-pulse" />
                  <div className="absolute top-[20%] left-[30%] w-[40%] h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan" />
                  <div className="absolute top-12 left-12 flex flex-col gap-2">
                     <div className="bg-accent-blue/20 backdrop-blur-md px-4 py-2 rounded-xl border border-accent-blue/30 flex items-center gap-3">
                        <Zap size={14} className="text-accent-blue" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Detection Active</span>
                     </div>
                  </div>
               </div>
             )}
          </div>

          {/* Right Translation Panel */}
          <aside className="w-96 bg-slate-900/50 border-l border-white/10 flex flex-col glass overflow-hidden">
             <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-accent-blue" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Sign Translation</h3>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             </div>
             
             <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Stream</p>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 font-mono text-xs text-blue-400 leading-relaxed italic animate-pulse">
                      Processing hand gestures...
                   </div>
                </div>

                <div className="pt-4 space-y-4">
                   <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Latest Translation</p>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-accent-blue/10 border border-accent-blue/20 rounded-[28px] shadow-lg shadow-blue-500/5"
                      >
                         <h2 className="text-2xl font-black heading-font text-white mb-2 leading-tight">
                            "I NEED HELP"
                         </h2>
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">High Confidence • 98%</span>
                         </div>
                      </motion.div>
                   </div>
                   
                   <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">History</p>
                      <div className="space-y-2">
                         <div className="flex justify-between items-center text-xs p-2 hover:bg-white/5 rounded-lg transition-colors cursor-default">
                            <span className="font-bold text-white/80">"HELLO EVERYONE"</span>
                            <span className="text-[9px] text-slate-500">2:41 PM</span>
                         </div>
                         <div className="flex justify-between items-center text-xs p-2 hover:bg-white/5 rounded-lg transition-colors cursor-default">
                            <span className="font-bold text-white/80">"MY NAME IS SARAH"</span>
                            <span className="text-[9px] text-slate-500">2:40 PM</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                   <button className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl bg-accent-blue text-white">Translation</button>
                   <button className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl text-slate-400 hover:text-white transition-colors">Chat</button>
                </div>
             </div>
          </aside>
        </main>

        {/* Bottom Control Bar */}
        <footer className="h-24 bg-slate-900 border-t border-white/10 flex items-center justify-center px-12 relative z-50">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isMicOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                }`}
              >
                {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              
              <button 
                onClick={() => setIsCamOn(!isCamOn)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isCamOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                }`}
              >
                {isCamOn ? <Camera size={24} /> : <VideoOff size={24} />}
              </button>

              <div className="w-px h-10 bg-white/10 mx-2" />

              <button className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                <Monitor size={24} />
              </button>

              <button 
                onClick={() => setIsAIDetectOn(!isAIDetectOn)}
                className={`flex items-center gap-3 px-6 h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                  isAIDetectOn ? "bg-accent-blue text-white shadow-xl shadow-blue-500/20" : "bg-white/10 text-slate-400"
                }`}
              >
                <Zap size={18} fill={isAIDetectOn ? "white" : "none"} />
                {isAIDetectOn ? "AI Enabled" : "AI Disabled"}
              </button>

              <div className="w-px h-10 bg-white/10 mx-2" />

              <button 
                onClick={() => setView("lobby")}
                className="w-16 h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-xl shadow-red-500/30"
              >
                <PhoneOff size={24} />
              </button>
           </div>

           <div className="absolute right-12 hidden lg:flex items-center gap-4">
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sign Output</p>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
                    <p className="text-sm font-bold">Auto-Speech Disabled</p>
                 </div>
              </div>
              <button className="px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                 Settings
              </button>
           </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TranslatorNavbar />
      
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center">
        {/* Page Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-soft-blue rounded-2xl border border-accent-blue/10"
          >
            <Video size={18} className="text-accent-blue" />
            <span className="text-[10px] font-black text-accent-blue uppercase tracking-[0.2em]">Next-Gen Communication</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black heading-font text-slate-900 tracking-tight">
            Video Communication
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Connect with others using real-time sign language video calls powered by AI. Seamless, accessible, and inclusive by design.
          </p>
        </div>

        {/* Core Actions Layout */}
        <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl">
          
          {/* OPTION 1: Create Meeting */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="group p-10 bg-white rounded-[40px] shadow-premium border border-slate-100 flex flex-col items-center text-center transition-all hover:border-accent-blue/20"
          >
            <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mb-8 group-hover:bg-accent-blue group-hover:rotate-6 transition-all duration-500">
               <div className="relative">
                  <Video size={40} className="text-accent-blue group-hover:text-white transition-colors" />
                  <Plus size={20} className="absolute -top-1 -right-1 text-accent-blue group-hover:text-white font-black" strokeWidth={3} />
               </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 heading-font">Create Meeting</h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Start a new video call and invite others to join using a unique meeting link. Perfect for personal tutoring or group talks.
            </p>

            <AnimatePresence mode="wait">
              {!meetingId ? (
                <button 
                  onClick={handleCreate}
                  className="w-full py-5 px-8 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-200"
                >
                  Create Now <ArrowRight size={18} />
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full space-y-4"
                >
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <span className="text-lg font-black tracking-widest text-slate-700">{meetingId}</span>
                    <button onClick={copyLink} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-accent-blue">
                      <Copy size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-4 bg-soft-blue text-accent-blue font-black text-xs uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-all">
                      <Share2 size={14} /> Share
                    </button>
                    <button 
                      onClick={startMeeting}
                      className="py-4 bg-accent-blue text-white font-black text-xs uppercase rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
                    >
                      Start Now
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* OPTION 2: Join Meeting */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="group p-10 bg-white rounded-[40px] shadow-premium border border-slate-100 flex flex-col items-center text-center transition-all hover:border-accent-blue/20"
          >
            <div className="w-24 h-24 bg-purple-50 rounded-[32px] flex items-center justify-center mb-8 group-hover:bg-indigo-500 group-hover:-rotate-6 transition-all duration-500">
               <ArrowRight size={40} className="text-indigo-500 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 heading-font">Join Meeting</h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Enter a meeting ID or paste a link provided by another participant to join an existing video call session.
            </p>

            <div className="w-full space-y-4">
               <input 
                type="text" 
                placeholder="Enter Meeting ID (e.g. ABC-DEF-GHI)" 
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
                className="w-full p-5 bg-slate-50 rounded-[24px] border border-slate-100 text-center font-black tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:bg-white transition-all placeholder:text-slate-300 uppercase"
               />
               <button 
                onClick={handleJoin}
                disabled={!joinId.trim()}
                className={`w-full py-5 px-8 rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  joinId.trim() 
                  ? "bg-accent-blue text-white shadow-2xl shadow-blue-100 hover:bg-blue-600" 
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
               >
                 Join Now <ArrowRight size={18} />
               </button>
            </div>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl">
           {[
             { icon: Globe, title: "Real-time ISL Translation", desc: "Live gesture to text translation" },
             { icon: Zap, title: "No Latency Detection", desc: "Edge AI processed detection" },
             { icon: Subtitles, title: "AI-Powered Subtitles", desc: "Voice-to-sign visual cues" },
             { icon: ShieldCheck, title: "Secure & Encrypted", desc: "E2E encrypted sign streams" },
           ].map((item, i) => (
             <div key={i} className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                  <item.icon size={20} className="text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                  <p className="text-xs font-bold text-slate-400">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
}