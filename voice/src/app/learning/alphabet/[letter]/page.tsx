"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ISLCamera, { ISLCameraRef } from "@/components/isl/ISLCamera";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Play, 
  Square, 
  Pause, 
  RotateCw,
  Trophy,
  ArrowLeft,
  Settings,
  Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useISL } from "@/store/islStore";

export default function AlphabetLessonPage() {
  const router = useRouter();
  const params = useParams();
  const letter = (params.letter as string).toUpperCase();
  const { state } = useISL();
  const [isSuccess, setIsSuccess] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const cameraRef = useRef<ISLCameraRef>(null);

  // Success detection logic
  useEffect(() => {
    if (state.currentPrediction?.label === letter) {
      setConfidence(state.currentPrediction.confidence * 100);
      if (state.currentPrediction.confidence > 0.85 && !isSuccess) {
        setIsSuccess(true);
      }
    } else {
      setConfidence(0);
    }
  }, [state.currentPrediction, letter, isSuccess]);

  const sessionTime = state.sessionStart
    ? (() => { const s = Math.floor((Date.now() - state.sessionStart) / 1000); return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`; })()
    : "0:00";

  // Navigation Logic
  const charCode = (letter as string).charCodeAt(0);
  const prevLetter = charCode > 65 ? String.fromCharCode(charCode - 1) : "Z";
  const nextLetter = charCode < 90 ? String.fromCharCode(charCode + 1) : "A";

  // Data for different letters
  const ALPHABET_DATA: Record<string, { desc: string, steps: string[] }> = {
    "A": {
      desc: "Tightly close your fingers into a fist. Ensure your thumb rests comfortably along the outer surface of your index and middle fingers.",
      steps: [
        "Lift your dominant hand to shoulder level",
        "Curl all four fingers into a closed fist",
        "Tuck thumb against the side of fingers",
        "Maintain posture and face camera directly"
      ]
    },
    "B": {
      desc: "Hold your palm open and flat with all four fingers extended and pressed together. Tuck your thumb across the palm.",
      steps: [
        "Raise your palm and face it towards the camera",
        "Keep your four fingers straight and touching",
        "Fold your thumb onto your palm",
        "Keep the wrist straight and steady"
      ]
    },
    "C": {
      desc: "Curve your fingers and thumb to form the shape of the letter 'C'. Keep your hand steady and palm facing sideways.",
      steps: [
        "Turn your hand sideways to the camera",
        "Arc your fingers upwards and thumb downwards",
        "Imagine holding a small glass or ball",
        "Form a clear 'C' shape with the whole hand"
      ]
    },
    "D": {
      desc: "Extend your index finger straight up. The other three fingers and the thumb should curve and touch at the tips to form a circle.",
      steps: [
        "Form a circle with your thumb and 3 fingers",
        "Point your index finger straight upwards",
        "Ensure the circular loop is visible",
        "Hold the position steadily for the AI"
      ]
    },
    "E": {
      desc: "Curl all four fingers onto your palm and tuck your thumb tightly across them. It looks like a squashed version of the letter 'A'.",
      steps: [
        "Curl your fingers towards your palm",
        "Fold your thumb across the base of fingers",
        "Keep the hand tight and compact",
        "Face your palm directly at the webcam"
      ]
    },
    "F": {
      desc: "Touch the tips of your index finger and thumb to form a circle. Extend your other three fingers (middle, ring, pinky) straight up.",
      steps: [
        "Join thumb and index finger at the tips",
        "Hold remaining three fingers straight up",
        "Ensure the 'OK' sign is clearly visible",
        "Keep fingers separated and upright"
      ]
    },
    "G": {
      desc: "Extend your thumb and index finger parallel to each other, pointing sideways, as if you are pinching something small.",
      steps: [
        "Turn your hand sideways to the camera",
        "Point index finger and thumb outwards",
        "Keep them parallel with a small gap",
        "Fold other fingers into the palm"
      ]
    },
    "H": {
      desc: "Extend your index and middle fingers together, pointing sideways. Tuck the other fingers and thumb into your palm.",
      steps: [
        "Point index and middle fingers sideways",
        "Keep the two fingers joined together",
        "Fold thumb, ring, and pinky into palm",
        "Maintain a horizontal hand position"
      ]
    },
    "I": {
      desc: "Extend only your pinky finger straight up. Tuck all other fingers and your thumb into a closed fist.",
      steps: [
        "Make a tight fist with your hand",
        "Extend the pinky finger straight upwards",
        "Hold the hand steady and face camera",
        "Keep other fingers firmly tucked in"
      ]
    },
    "J": {
      desc: "Start with the 'I' sign (pinky up) and draw a small 'J' hook shape in the air by curving your pinky.",
      steps: [
        "Hold your pinky finger straight up",
        "Trace a small 'J' hook in the air",
        "Move the wrist slightly to assist",
        "Return to neutral position after the hook"
      ]
    },
    "K": {
      desc: "Extend your index and middle fingers in a 'V' shape, and place your thumb between them. It looks like a funky peace sign.",
      steps: [
        "Make a 'V' sign with index and middle",
        "Nestle your thumb at the base of the 'V'",
        "Keep the hand upright and steady",
        "Face the palm toward the detector"
      ]
    },
    "L": {
      desc: "Extend your index finger straight up and your thumb straight out to the side, forming a clear 'L' shape.",
      steps: [
        "Point the index finger straight upwards",
        "Stretch the thumb out at a 90° angle",
        "Keep the palm facing the camera",
        "Fold other three fingers into the palm"
      ]
    },
    "M": {
      desc: "Tuck your thumb under your index, middle, and ring fingers. The tips of these three fingers should rest over the thumb.",
      steps: [
        "Fold your thumb across your palm",
        "Wrap index, middle, and ring over it",
        "Tuck the pinky finger underneath",
        "Hold the three 'humps' clearly visible"
      ]
    },
    "N": {
      desc: "Tuck your thumb under your index and middle fingers. The tips of these two fingers should rest over the thumb.",
      steps: [
        "Fold your thumb across your palm",
        "Wrap only index and middle over it",
        "Tuck ring and pinky fingers underneath",
        "Show two 'humps' for the letter N"
      ]
    },
    "O": {
      desc: "Curve all your fingers and your thumb so that their tips meet, forming a circle that looks like the letter 'O'.",
      steps: [
        "Curve your hand into a round shape",
        "Join all finger tips to the thumb tip",
        "Ensure the circular hole is visible",
        "Hold the hand steady for detection"
      ]
    },
    "P": {
      desc: "Make the 'K' sign but point it downwards. Index finger points down, middle finger points out diagonally.",
      steps: [
        "Form the 'K' handshape (V with thumb)",
        "Rotate your wrist to point it downwards",
        "Keep the index finger straight down",
        "Ensure the gesture is in lower frame"
      ]
    },
    "Q": {
      desc: "Make the 'G' sign (pinch) but point it downwards toward the ground.",
      steps: [
        "Form the 'G' pinch handshape",
        "Rotate your hand to point downwards",
        "Keep index and thumb parallel",
        "Focus on the downward orientation"
      ]
    },
    "R": {
      desc: "Cross your middle finger over your index finger, as if you are making a 'fingers crossed' wish.",
      steps: [
        "Lift index and middle fingers",
        "Cross the middle finger over the index",
        "Keep other fingers tucked into palm",
        "Ensure the twist is visible to AI"
      ]
    },
    "S": {
      desc: "Make a tight fist and place your thumb across the front of your four fingers. It's the standard fist shape.",
      steps: [
        "Curl all fingers tightly into palm",
        "Place thumb horizontally over fingers",
        "Keep the fist solid and unmoving",
        "Face the knuckles toward the camera"
      ]
    },
    "T": {
      desc: "Make a fist and tuck your thumb between your index and middle fingers. Only the tip of the thumb shows.",
      steps: [
        "Curl fingers into a closed fist",
        "Tuck thumb between index and middle",
        "Keep the thumb tip visible over fist",
        "Hold the hand shape vertically"
      ]
    },
    "U": {
      desc: "Extend your index and middle fingers straight up and press them together tightly. Tuck others into palm.",
      steps: [
        "Point index and middle fingers up",
        "Keep them touching and parallel",
        "Fold thumb over the ring and pinky",
        "Ensure no gap between the two fingers"
      ]
    },
    "V": {
      desc: "Extend your index and middle fingers in a 'V' shape (peace sign). Keep them separated and upright.",
      steps: [
        "Point index and middle fingers up",
        "Spread them apart to form a 'V'",
        "Keep other fingers tucked in with thumb",
        "Ensure the 'V' gap is clearly visible"
      ]
    },
    "W": {
      desc: "Extend your index, middle, and ring fingers straight up in a 'W' shape. Spread them slightly apart.",
      steps: [
        "Point index, middle, and ring fingers up",
        "Spread them to form a clear 'W'",
        "Hold pinky down with your thumb",
        "Keep the three fingers separated"
      ]
    },
    "X": {
      desc: "Extend your index finger and hook it into a curve. All other fingers should be tucked into your palm.",
      steps: [
        "Point index finger straight up first",
        "Bend the top joint into a hook shape",
        "Tuck all other fingers into a fist",
        "Face the side of the hook to camera"
      ]
    },
    "Y": {
      desc: "Extend your thumb and pinky finger out, while keeping the middle three fingers tucked into your palm.",
      steps: [
        "Stretch the thumb out to one side",
        "Point the pinky out to the other side",
        "Keep the middle 3 fingers folded down",
        "Make a 'call me' or 'hang loose' sign"
      ]
    },
    "Z": {
      desc: "Extend your index finger and draw the shape of the Z in the air, or hold it in a final pointing gesture.",
      steps: [
        "Point the index finger towards camera",
        "Trace a 3-stroke 'Z' shape in the air",
        "End with finger steady at the finish",
        "Keep other fingers tightly folded"
      ]
    }
  };

  const currentData = ALPHABET_DATA[letter as string] || ALPHABET_DATA["A"];

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="pt-24 pb-12 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        {/* Page Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <button
              onClick={() => router.push("/learning")}
              className="group flex items-center gap-2 text-slate-500 hover:text-accent-blue font-bold transition-all text-sm mb-2"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Library
            </button>
            <div className="space-y-1">
              <h1 className="text-5xl md:text-6xl font-black heading-font text-slate-900 tracking-tight">
                Character <span className="text-accent-blue">"{letter}"</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
                Watch the guide below and try to replicate the "{letter}" sign in front of your camera. Our AI will provide instant, real-time feedback on your posture.
              </p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-4 py-2 px-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-accent-blue/10 rounded-full flex items-center justify-center text-accent-blue font-black">
              {letter}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Sign</p>
              <p className="text-sm font-black text-slate-800">Indian Sign Language</p>
            </div>
          </div>
        </header>

        {/* Main Layout Grid: 55/45 split */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
          
          {/* LEFT: Camera Detection Area (55%) */}
          <section className="space-y-6">
            <div className={`bg-white p-2 rounded-[40px] shadow-premium border-2 transition-all duration-700 overflow-hidden relative ${
              state.isRunning ? "border-accent-blue/20 ring-4 ring-accent-blue/5" : "border-slate-100"
            }`}>
               <ISLCamera ref={cameraRef} hideStats={true} hideControls={true} />
               
               {/* Floating Camera Status */}
               <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3 shadow-xl"
                  >
                    <div className="relative">
                      <Camera size={16} className="text-white/80" />
                      {state.isRunning && <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />}
                      <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${state.isRunning ? "bg-green-500" : "bg-slate-400"}`} />
                    </div>
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">
                      {state.isRunning ? "Live Detection Active" : "Camera Offline"}
                    </span>
                  </motion.div>
               </div>

               {/* Success Animation Overlay */}
               <AnimatePresence>
                 {isSuccess && (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-green-500/10 backdrop-blur-[2px] pointer-events-none flex items-center justify-center z-20"
                   >
                     <motion.div 
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="bg-white p-6 rounded-full shadow-2xl border-4 border-green-500"
                     >
                        <Trophy size={60} className="text-green-500" />
                     </motion.div>
                     
                     {/* Scanning Effect during Success */}
                     <div className="absolute inset-y-0 w-full animate-scan bg-gradient-to-b from-transparent via-green-400/20 to-transparent h-20" />
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Custom Camera Controls */}
            <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={() => cameraRef.current?.startCamera()}
                disabled={state.isRunning}
                className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 ${
                  state.isRunning 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : "bg-accent-blue text-white shadow-lg shadow-blue-200 hover:scale-105 active:scale-95"
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${state.isRunning ? "bg-slate-200" : "bg-white/20"}`}>
                   <Play size={14} fill="currentColor" className={state.isRunning ? "text-slate-400" : "text-white"} />
                </div>
                Start Engine
              </button>
              
              <div className="flex items-center p-1 bg-slate-50 rounded-2xl border border-slate-100 gap-1">
                <button 
                  onClick={() => cameraRef.current?.togglePause()}
                  disabled={!state.isRunning}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                    !state.isRunning 
                    ? "text-slate-200 cursor-not-allowed" 
                    : "text-slate-600 hover:bg-white hover:shadow-sm active:scale-95"
                  }`}
                >
                  {state.isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                </button>

                <button 
                  onClick={() => cameraRef.current?.switchCamera()}
                  className="flex items-center justify-center w-12 h-12 rounded-xl text-slate-600 hover:bg-white hover:shadow-sm active:scale-95 transition-all"
                >
                  <RotateCw size={20} />
                </button>

                <button 
                  onClick={() => cameraRef.current?.stopCamera()}
                  disabled={!state.isRunning}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                    !state.isRunning
                    ? "text-slate-200 cursor-not-allowed"
                    : "text-red-400 hover:bg-red-50 active:scale-95"
                  }`}
                >
                  <Square size={20} fill="currentColor" />
                </button>
              </div>
            </div>

            {/* Detection Feedback & Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Feedback Status */}
               <div className={`p-8 rounded-[36px] border flex items-center gap-6 transition-all duration-500 ${
                  confidence > 80 ? "bg-green-50 border-green-200 shadow-inner" : "bg-white border-slate-100 shadow-sm"
               }`}>
                  <div className={`relative shrink-0`}>
                    <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-500 ${
                      confidence > 80 ? "bg-green-500 text-white shadow-xl shadow-green-200" : "bg-slate-100 text-slate-400"
                    }`}>
                      {confidence > 80 ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                    </div>
                    {confidence > 80 && (
                       <span className="absolute -top-2 -right-2 bg-green-200 text-green-700 text-[8px] font-black px-2 py-1 rounded-lg border border-green-300">
                          VALIDATED
                       </span>
                    )}
                  </div>
                  <div>
                    <h4 className={`text-lg font-black tracking-tight mb-1 ${
                      confidence > 80 ? "text-green-700" : "text-slate-900"
                    }`}>
                      {confidence > 80 ? "Sign Matches Successfully" : "Awaiting Recognition..."}
                    </h4>
                    <p className="text-sm font-bold text-slate-500 leading-none">
                      {confidence > 80 ? "Perfect posture! Keep it up." : "Place your hand in view."}
                    </p>
                  </div>
               </div>

               {/* Stats Summary */}
               <div className="p-8 bg-white rounded-[36px] border border-slate-100 grid grid-cols-2 gap-2 shadow-sm relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-50" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence Score</p>
                    <div className="flex items-end gap-1">
                       <p className={`text-3xl font-black heading-font ${confidence > 80 ? "text-green-500" : "text-slate-900"}`}>
                        {Math.round(confidence)}
                      </p>
                      <span className="text-sm font-black text-slate-300 mb-1.5">%</span>
                    </div>
                  </div>
                  <div className="space-y-1 border-l border-slate-50 pl-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Time</p>
                    <p className="text-3xl font-black heading-font text-slate-900 tracking-tight">{sessionTime}</p>
                  </div>
               </div>
            </div>

            {/* Comprehensive Stats Bar */}
            <div className="bg-slate-900 p-8 rounded-[44px] text-white flex flex-wrap gap-10 justify-around shadow-2xl relative overflow-hidden group">
               {/* Pattern Overlay */}
               <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
               
               <div className="text-center relative z-10 transition-transform group-hover:scale-105">
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/5">
                    <Activity size={18} className="text-blue-400" />
                  </div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.25em] mb-1">Inference</p>
                  <p className="text-2xl font-black text-blue-400">{state.fps} <span className="text-[10px] text-white/20">FPS</span></p>
               </div>

               <div className="text-center relative z-10 transition-transform group-hover:scale-105">
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/5">
                    <div className="flex gap-px">
                      <div className={`w-1.5 h-4 rounded-full ${state.handsVisible >= 1 ? "bg-green-400" : "bg-white/20"}`} />
                      <div className={`w-1.5 h-4 rounded-full ${state.handsVisible >= 2 ? "bg-green-400" : "bg-white/20"}`} />
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.25em] mb-1">Hands</p>
                  <p className={`text-2xl font-black ${state.handsVisible === 2 ? "text-green-400" : "text-orange-400"}`}>
                    {state.handsVisible}<span className="text-[10px] text-white/20">/2</span>
                  </p>
               </div>

               <div className="text-center relative z-10 transition-transform group-hover:scale-105">
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/5">
                    <Trophy size={18} className="text-yellow-400/80" />
                  </div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.25em] mb-1">Detections</p>
                  <p className="text-2xl font-black text-white">{state.detectionCount}</p>
               </div>

               <div className="text-center relative z-10 transition-transform group-hover:scale-105">
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/5">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                       <Settings size={18} className="text-slate-400" />
                    </motion.div>
                  </div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.25em] mb-1">Latency</p>
                  <p className="text-2xl font-black text-white">42<span className="text-[10px] text-white/20">ms</span></p>
               </div>
            </div>
          </section>

          {/* RIGHT: Guide & Steps (45%) */}
          <section className="space-y-8">
            {/* Sign Guide Card */}
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-premium">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900 heading-font">Sign Instruction: {letter}</h3>
                <div className="glass px-4 py-2 rounded-xl border-slate-100 flex items-center gap-2">
                   <div className="w-2 h-2 bg-accent-blue rounded-full" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Guide Active</span>
                </div>
              </div>

              {/* Central Illustration Area */}
              <div className="flex flex-col items-center">
                <div className="bg-slate-50 w-full aspect-square rounded-[32px] border border-slate-100 flex items-center justify-center p-8 mb-8 relative overflow-hidden group">
                   <Image 
                    src={`/images/alphabet/${letter}.png`} 
                    alt={`Sign for ${letter}`} 
                    width={320} 
                    height={320}
                    className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  {/* Watermark/Logo */}
                  <span className="absolute bottom-6 right-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">SilentVoice AI Guide</span>
                </div>

                <div className="w-full space-y-6">
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <p className="text-blue-700 font-bold text-sm leading-relaxed">
                      "{currentData.desc}"
                    </p>
                  </div>

                  {/* Step by Step */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Step-by-Step Breakdown</p>
                    <div className="grid gap-3">
                      {currentData.steps.map((stepText, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-2xl group">
                          <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-400 group-hover:border-accent-blue group-hover:text-accent-blue transition-colors shrink-0">
                            0{idx + 1}
                          </span>
                          <span className="text-slate-600 font-bold text-sm tracking-tight leading-none">{stepText}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-2 gap-4">
                 <button 
                  onClick={() => router.push(`/learning/alphabet/${prevLetter}`)}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-left"
                 >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                      <ChevronLeft size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Previous</p>
                      <p className="text-sm font-black text-slate-700">Letter {prevLetter}</p>
                    </div>
                 </button>
                 <button 
                  onClick={() => router.push(`/learning/alphabet/${nextLetter}`)}
                  className="flex items-center justify-end gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-right"
                 >
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Continue</p>
                      <p className="text-sm font-black text-slate-700">Letter {nextLetter}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                      <ChevronRight size={20} />
                    </div>
                 </button>
              </div>
            </div>

            {/* Progress/Mastery Card */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Trophy size={80} className="text-accent-blue" />
               </div>
               
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Practice Progress</p>
               <div className="flex items-center gap-6 mb-6">
                  <div className="text-4xl font-black text-slate-900">
                    {isSuccess ? "98%" : "85%"}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Accuracy</span>
                      <span>Target: 95%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: isSuccess ? "98%" : "85%" }}
                        className={`h-full rounded-full ${isSuccess ? "bg-green-500" : "bg-accent-blue"}`}
                      />
                    </div>
                  </div>
               </div>
               <p className="text-xs font-bold text-slate-500">
                 {isSuccess ? "Great job! You've mastered this character. Move to the next one." : "You're getting close! Maintain steady hands for 3 more seconds."}
               </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

