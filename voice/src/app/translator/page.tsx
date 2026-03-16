"use client";

import React, { useState, useEffect } from "react";
import TranslatorNavbar from "@/components/isl/TranslatorNavbar";
import { 
  Camera, 
  Settings, 
  RotateCw, 
  Play, 
  Square, 
  Volume2, 
  Trash2, 
  Copy, 
  Download,
  History,
  Info,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useISL } from "@/store/islStore";
import ISLCamera from "@/components/isl/ISLCamera";
import "@/styles/isl.css";

export default function TranslatorPage() {
  const { state, dispatch } = useISL();
  const [history, setHistory] = useState([
    { id: 1, time: "16:40", text: "I WANT WATER", type: "sent" },
    { id: 2, time: "16:35", text: "HELLO HOW ARE YOU", type: "sent" },
    { id: 3, time: "16:12", text: "THANK YOU SO MUCH", type: "received" },
  ]);

  const speak = () => {
    if (!state.sentence.trim()) return;
    const u = new SpeechSynthesisUtterance(state.sentence);
    u.lang = "en-IN";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(state.sentence);
  };

  const clearSentence = () => {
    dispatch({ type: "CLEAR_SENTENCE" });
  };

  const downloadText = () => {
    if (!state.sentence.trim()) return;
    const blob = new Blob([state.sentence], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translation-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <TranslatorNavbar />
      
      <main className="translator-container">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Gesture Translator</h1>
            <p className="text-slate-500 mt-1">Convert Indian Sign Language into speech and text in real-time.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-white/50 px-3 py-1.5 rounded-full border border-slate-100 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            AI Engine: v2.4 Active
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE: Camera Area */}
          <section className="space-y-6">
            <div className="modern-card overflow-hidden">
              <div className="card-title justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Camera size={18} />
                  </div>
                  <span>Live Sign Language Detection</span>
                </div>
                <div className="camera-status-indicator">
                  <div className={`status-dot ${state.isRunning ? "active" : ""}`}></div>
                  <span>{state.isRunning ? "Camera Active" : "Camera Offline"}</span>
                </div>
              </div>

              {/* Camera Container */}
              <div className="relative">
                <ISLCamera />
              </div>

              <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#ff6b35] shadow-sm">
                  <Info size={14} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Position both hands clearly within the frame. Hold each gesture for ~2.0 seconds 
                  to add it to your sentence. Ensure good lighting for best results.
                </p>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE: Translation Output */}
          <section className="space-y-6">
            {/* Detected Word Card */}
            <div className="modern-card">
              <div className="card-title">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                  <ChevronRight size={18} />
                </div>
                <span>Detected Gesture</span>
              </div>
              
              <div className="gesture-display">
                <AnimatePresence mode="wait">
                  {state.currentPrediction && state.currentPrediction.label !== "—" && state.currentPrediction.label !== "?" ? (
                    <motion.div
                      key={state.currentPrediction.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="flex flex-col items-center w-full"
                    >
                      <span className="gesture-label">Detected Letter</span>
                      <span className="gesture-word">{state.currentPrediction.label}</span>
                      {state.holdProgress > 0 ? (
                        <div style={{ width: "100%", marginTop: 12 }}>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, textAlign: "center" }}>
                            Hold steady to add to sentence... {Math.round(state.holdProgress)}%
                          </div>
                          <div style={{ background: "#e2e8f0", borderRadius: 6, height: 8 }}>
                            <div style={{ background: "#f97316", borderRadius: 6, height: 8, width: `${state.holdProgress}%`, transition: "width 0.1s" }} />
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Hold still for 2.0s to add to sentence</div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-slate-300 font-medium italic"
                    >
                      {state.isRunning ? "Show your hand to the camera..." : "Waiting for gesture..."}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sentence Builder Card */}
            <div className="modern-card h-full">
              <div className="card-title">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                  <History size={18} />
                </div>
                <span>Live Sentence Builder</span>
              </div>

              <div className="sentence-builder-box mb-6">
                <textarea 
                  className="sentence-textarea"
                  placeholder="Your translated sentence will appear here..."
                  value={state.sentence}
                  onChange={(e) => dispatch({ type: "ADD_LETTER", payload: e.target.value })}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                  onClick={speak}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 text-sm"
                >
                  <Volume2 size={18} />
                  Speak
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95 text-sm"
                >
                  <Copy size={18} />
                  Copy
                </button>
                <button 
                   onClick={downloadText}
                   className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95 text-sm"
                >
                  <Download size={18} />
                  Export
                </button>
                <button 
                  onClick={clearSentence}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 text-sm"
                >
                  <Trash2 size={18} />
                  Clear
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* BOTTOM SECTION: Recent Translations */}
        <section className="mt-8">
          <div className="modern-card">
            <div className="card-title mb-6">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <History size={18} />
              </div>
              <span>Recent Translations</span>
            </div>

            <div className="recent-table-container">
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Detected Sentence</th>
                    <th>Type</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="text-slate-400 text-sm">{item.time}</td>
                      <td className="font-semibold text-slate-700">{item.text}</td>
                      <td>
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          item.type === "sent" ? "bg-teal-50 text-teal-600" : "bg-blue-50 text-blue-600"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="btn-icon" title="Speak again"><Volume2 size={16} /></button>
                          <button className="btn-icon" title="Copy text"><Copy size={16} /></button>
                          <button className="btn-icon text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}