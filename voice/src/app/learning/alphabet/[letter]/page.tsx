"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Camera,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useISL } from "@/store/islStore";

// Data for different letters
const ALPHABET_DATA: Record<string, { desc: string, steps: string[] }> = {
  "A": {
    desc: "Tightly close your fingers into a fist. Ensure your thumb rests comfortably along the outer surface of your index and middle fingers.",
    steps: ["Lift your dominant hand to shoulder level", "Curl all four fingers into a closed fist", "Tuck thumb against the side of fingers", "Maintain posture and face camera directly"]
  },
  "B": {
    desc: "Hold your palm open and flat with all four fingers extended and pressed together. Tuck your thumb across the palm.",
    steps: ["Raise your palm and face it towards the camera", "Keep your four fingers straight and touching", "Fold your thumb onto your palm", "Keep the wrist straight and steady"]
  },
  "C": {
    desc: "Curve your fingers and thumb to form the shape of the letter 'C'. Keep your hand steady and palm facing sideways.",
    steps: ["Turn your hand sideways to the camera", "Arc your fingers upwards and thumb downwards", "Imagine holding a small glass or ball", "Form a clear 'C' shape with the whole hand"]
  },
  "D": {
    desc: "Extend your index finger straight up. The other three fingers and the thumb should curve and touch at the tips to form a circle.",
    steps: ["Form a circle with your thumb and 3 fingers", "Point your index finger straight upwards", "Ensure the circular loop is visible", "Hold the position steadily for the AI"]
  },
  "E": {
    desc: "Curl all four fingers onto your palm and tuck your thumb tightly across them. It looks like a squashed version of the letter 'A'.",
    steps: ["Curl your fingers towards your palm", "Fold your thumb across the base of fingers", "Keep the hand tight and compact", "Face your palm directly at the webcam"]
  },
  "F": {
    desc: "Touch the tips of your index finger and thumb to form a circle. Extend your other three fingers (middle, ring, pinky) straight up.",
    steps: ["Join thumb and index finger at the tips", "Hold remaining three fingers straight up", "Ensure the 'OK' sign is clearly visible", "Keep fingers separated and upright"]
  },
  "G": {
    desc: "Extend your thumb and index finger parallel to each other, pointing sideways, as if you are pinching something small.",
    steps: ["Turn your hand sideways to the camera", "Point index finger and thumb outwards", "Keep them parallel with a small gap", "Fold other fingers into the palm"]
  },
  "H": {
    desc: "Extend your index and middle fingers together, pointing sideways. Tuck the other fingers and thumb into your palm.",
    steps: ["Point index and middle fingers sideways", "Keep the two fingers joined together", "Fold thumb, ring, and pinky into palm", "Maintain a horizontal hand position"]
  },
  "I": {
    desc: "Extend only your pinky finger straight up. Tuck all other fingers and your thumb into a closed fist.",
    steps: ["Make a tight fist with your hand", "Extend the pinky finger straight upwards", "Hold the hand steady and face camera", "Keep other fingers firmly tucked in"]
  },
  "J": {
    desc: "Start with the 'I' sign (pinky up) and draw a small 'J' hook shape in the air by curving your pinky.",
    steps: ["Hold your pinky finger straight up", "Trace a small 'J' hook in the air", "Move the wrist slightly to assist", "Return to neutral position after the hook"]
  },
  "K": {
    desc: "Extend your index and middle fingers in a 'V' shape, and place your thumb between them. It looks like a funky peace sign.",
    steps: ["Make a 'V' sign with index and middle", "Nestle your thumb at the base of the 'V'", "Keep the hand upright and steady", "Face the palm toward the detector"]
  },
  "L": {
    desc: "Extend your index finger straight up and your thumb straight out to the side, forming a clear 'L' shape.",
    steps: ["Point the index finger straight upwards", "Stretch the thumb out at a 90° angle", "Keep the palm facing the camera", "Fold other three fingers into the palm"]
  },
  "M": {
    desc: "Tuck your thumb under your index, middle, and ring fingers. The tips of these three fingers should rest over the thumb.",
    steps: ["Fold your thumb across your palm", "Wrap index, middle, and ring over it", "Tuck the pinky finger underneath", "Hold the three 'humps' clearly visible"]
  },
  "N": {
    desc: "Tuck your thumb under your index and middle fingers. The tips of these two fingers should rest over the thumb.",
    steps: ["Fold your thumb across your palm", "Wrap only index and middle over it", "Tuck ring and pinky fingers underneath", "Show two 'humps' for the letter N"]
  },
  "O": {
    desc: "Curve all your fingers and your thumb so that their tips meet, forming a circle that looks like the letter 'O'.",
    steps: ["Curve your hand into a round shape", "Join all finger tips to the thumb tip", "Ensure the circular hole is visible", "Hold the hand steady for detection"]
  },
  "P": {
    desc: "Make the 'K' sign but point it downwards. Index finger points down, middle finger points out diagonally.",
    steps: ["Form the 'K' handshape (V with thumb)", "Rotate your wrist to point it downwards", "Keep the index finger straight down", "Ensure the gesture is in lower frame"]
  },
  "Q": {
    desc: "Make the 'G' sign (pinch) but point it downwards toward the ground.",
    steps: ["Form the 'G' pinch handshape", "Rotate your hand to point downwards", "Keep index and thumb parallel", "Focus on the downward orientation"]
  },
  "R": {
    desc: "Cross your middle finger over your index finger, as if you are making a 'fingers crossed' wish.",
    steps: ["Lift index and middle fingers", "Cross the middle finger over the index", "Keep other fingers tucked into palm", "Ensure the twist is visible to AI"]
  },
  "S": {
    desc: "Make a tight fist and place your thumb across the front of your four fingers. It's the standard fist shape.",
    steps: ["Curl all fingers tightly into palm", "Place thumb horizontally over fingers", "Keep the fist solid and unmoving", "Face the knuckles toward the camera"]
  },
  "T": {
    desc: "Make a fist and tuck your thumb between your index and middle fingers. Only the tip of the thumb shows.",
    steps: ["Curl fingers into a closed fist", "Tuck thumb between index and middle", "Keep the thumb tip visible over fist", "Hold the hand shape vertically"]
  },
  "U": {
    desc: "Extend your index and middle fingers straight up and press them together tightly. Tuck others into palm.",
    steps: ["Point index and middle fingers up", "Keep them touching and parallel", "Fold thumb over the ring and pinky", "Ensure no gap between the two fingers"]
  },
  "V": {
    desc: "Extend your index and middle fingers in a 'V' shape (peace sign). Keep them separated and upright.",
    steps: ["Point index and middle fingers up", "Spread them apart to form a 'V'", "Keep other fingers tucked in with thumb", "Ensure the 'V' gap is clearly visible"]
  },
  "W": {
    desc: "Extend your index, middle, and ring fingers straight up in a 'W' shape. Spread them slightly apart.",
    steps: ["Point index, middle, and ring fingers up", "Spread them to form a clear 'W'", "Hold pinky down with your thumb", "Keep the three fingers separated"]
  },
  "X": {
    desc: "Extend your index finger and hook it into a curve. All other fingers should be tucked into your palm.",
    steps: ["Point index finger straight up first", "Bend the top joint into a hook shape", "Tuck all other fingers into a fist", "Face the side of the hook to camera"]
  },
  "Y": {
    desc: "Extend your thumb and pinky finger out, while keeping the middle three fingers tucked into your palm.",
    steps: ["Stretch the thumb out to one side", "Point the pinky out to the other side", "Keep the middle 3 fingers folded down", "Make a 'call me' or 'hang loose' sign"]
  },
  "Z": {
    desc: "Extend your index finger and draw the shape of the Z in the air, or hold it in a final pointing gesture.",
    steps: ["Point the index finger towards camera", "Trace a 3-stroke 'Z' shape in the air", "End with finger steady at the finish", "Keep other fingers tightly folded"]
  }
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AlphabetLessonPage() {
  const router = useRouter();
  const params = useParams();
  const letter = (params.letter as string).toUpperCase();
  const { state } = useISL();
  const [isSuccess, setIsSuccess] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const cameraRef = useRef<ISLCameraRef>(null);

  // Navigation Logic
  const currentIndex = ALPHABET.indexOf(letter);
  const prevLetter = ALPHABET[(currentIndex - 1 + 26) % 26];
  const nextLetter = ALPHABET[(currentIndex + 1) % 26];

  // Reset state on letter change
  useEffect(() => {
    setIsSuccess(false);
    setConfidence(0);
  }, [letter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") router.push(`/learning/alphabet/${nextLetter}`);
      if (e.key === "ArrowLeft") router.push(`/learning/alphabet/${prevLetter}`);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextLetter, prevLetter, router]);

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

  // Save progress
  useEffect(() => {
    if (letter) localStorage.setItem("last_alphabet_lesson", letter);
  }, [letter]);

  const currentData = ALPHABET_DATA[letter] || ALPHABET_DATA["A"];

  return (
    <main className="h-screen bg-[#F8FAFC] overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 pt-16 pb-6 px-6 lg:px-12 max-w-screen-2xl mx-auto w-full flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={letter}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Minimal Header */}
            <header className="mb-4 shrink-0">
              <button
                onClick={() => router.push("/learning")}
                className="group flex items-center gap-2 text-slate-500 hover:text-accent-blue font-bold transition-all text-sm"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Library
              </button>
            </header>

            {/* Main Layout Grid - Single Screen Optimized */}
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 items-start flex-1 overflow-hidden min-h-0">
              
              {/* LEFT: Camera Area */}
              <section className="flex flex-col h-full gap-4 overflow-hidden min-h-0">
                {/* Camera Box */}
                <div className={`flex-1 rounded-[40px] shadow-premium border-2 transition-all duration-700 overflow-hidden relative min-h-0 flex items-center justify-center p-2 ${
                  state.isRunning 
                  ? "bg-white border-accent-blue/20 ring-4 ring-accent-blue/5" 
                  : "bg-[#010816] border-slate-100"
                }`}>
                   <ISLCamera ref={cameraRef} hideStats={true} hideControls={true} />
                   
                   {/* Floating Camera Status */}
                   <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                      <motion.div 
                        className="glass px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2.5 shadow-xl"
                      >
                        <div className="relative">
                          <Camera size={14} className="text-white/80" />
                          <div className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full ${state.isRunning ? "bg-green-500" : "bg-slate-400"}`} />
                        </div>
                        <span className="text-white text-[9px] font-black uppercase tracking-widest leading-none">
                          {state.isRunning ? "Live Active" : "Offline"}
                        </span>
                      </motion.div>
                   </div>

                   {/* Success Animation */}
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
                          className="bg-white p-5 rounded-full shadow-2xl border-4 border-green-500"
                         >
                            <Trophy size={48} className="text-green-500" />
                         </motion.div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>

                {/* Pill Controls - Compact */}
                <div className="shrink-0 bg-white p-2.5 rounded-full border border-slate-100 shadow-sm flex items-center justify-between px-4">
                  {/* Previous Pill */}
                  <button 
                    onClick={() => router.push(`/learning/alphabet/${prevLetter}`)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-50 text-slate-500 font-black hover:bg-soft-blue hover:text-accent-blue transition-all group border border-transparent hover:border-accent-blue/10"
                  >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] uppercase tracking-widest leading-none mt-0.5 font-black">{prevLetter}</span>
                  </button>

                  {/* Engine Controls (Center) */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => cameraRef.current?.startCamera()}
                      disabled={state.isRunning}
                      className={`h-10 flex items-center gap-2 px-5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                        state.isRunning 
                        ? "bg-slate-100 text-slate-300" 
                        : "bg-accent-blue text-white shadow-lg shadow-blue-100"
                      }`}
                    >
                      <Play size={12} fill="currentColor" />
                      {state.isRunning ? "Running" : "Start Engine"}
                    </button>
                    <button 
                      onClick={() => cameraRef.current?.stopCamera()}
                      className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                    >
                      <Square size={14} fill="currentColor" />
                    </button>
                  </div>

                  {/* Next Pill */}
                  <button 
                    onClick={() => router.push(`/learning/alphabet/${nextLetter}`)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white font-black hover:bg-slate-800 transition-all group shadow-lg shadow-slate-200"
                  >
                    <span className="text-[10px] uppercase tracking-widest leading-none mt-0.5 font-black">{nextLetter}</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </section>

              {/* RIGHT: Instruction Panel - One Screen Optimized */}
              <section className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-premium flex flex-col h-full overflow-hidden min-h-0">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <h3 className="text-xl font-black text-slate-900 heading-font leading-none">Sign Guide: {letter}</h3>
                  <div className="px-2.5 py-1 bg-soft-blue text-accent-blue rounded-lg text-[9px] font-black uppercase tracking-widest leading-none">Active</div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto pr-1">
                  {/* Compact Illustration Container */}
                  <div className="w-full aspect-square bg-slate-50 rounded-[28px] border border-slate-100 flex items-center justify-center p-4 relative overflow-hidden group shrink-0 max-h-[250px] sm:max-h-[280px] lg:max-h-[300px]">
                    <Image 
                      src={`/images/alphabet/${letter}.png`} 
                      alt={`Sign ${letter}`}
                      width={280}
                      height={280}
                      className="h-full w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors" />
                    <span className="absolute bottom-4 right-6 text-[8px] font-bold text-slate-300 uppercase tracking-widest">AI GUIDE</span>
                  </div>

                  {/* Descriptions - Compact Style */}
                  <div className="shrink-0 p-5 bg-blue-50/80 rounded-2xl border border-blue-100">
                    <p className="text-blue-700 font-bold text-sm leading-relaxed italic text-center">
                      "{currentData.desc}"
                    </p>
                  </div>

                  {/* Action/Tip Card */}
                  <div className="shrink-0 p-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center mb-1">Learning Tip</p>
                    <p className="text-xs text-slate-600 font-bold text-center leading-relaxed">
                      Hold the position steady for at least 3 seconds. Ensure your hand is centered in the camera frame for the best AI detection results.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
