"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useISL } from "@/store/islStore";
import { useISLModel } from "@/hooks/useISLModel";
import { Play, Square, RotateCw } from "lucide-react";

declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

interface TrainingCameraProps {
  onDetect: (label: string, confidence: number) => void;
  targetLetter: string;
}

export default function TrainingCamera({ onDetect, targetLetter }: TrainingCameraProps) {
  const { state, dispatch } = useISL();
  const { processHands } = useISLModel();
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<any>(null);
  const animRef = useRef<number>(0);
  const [mpLoaded, setMpLoaded] = useState(false);
  const latestHandsData = useRef<{ left: number[][] | null; right: number[][] | null }>({ left: null, right: null });
  const [handDetected, setHandDetected] = useState(false);

  // Load MediaPipe
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
    const script2 = document.createElement("script");
    script2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
    script2.onload = () => setMpLoaded(true);
    document.head.appendChild(script1);
    document.head.appendChild(script2);
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  const initMediaPipe = useCallback(() => {
    if (!mpLoaded || !window.Hands) return;
    const hands = new window.Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.6,
    });
    hands.onResults((results: any) => {
      let left: number[][] | null = null;
      let right: number[][] | null = null;
      let isHandVisible = false;

      if (results.multiHandLandmarks && results.multiHandedness) {
        isHandVisible = true;
        results.multiHandLandmarks.forEach((landmarks: any[], idx: number) => {
          const label = results.multiHandedness[idx].label;
          const pts = landmarks.map((lm: any) => [lm.x, lm.y, lm.z]);
          if (label === "Left") right = pts; else left = pts;
        });
      }
      setHandDetected(isHandVisible);
      latestHandsData.current = { left, right };
      drawOverlay(results);
    });
    handsRef.current = hands;
  }, [mpLoaded]);

  useEffect(() => { initMediaPipe(); }, [initMediaPipe]);

  const drawOverlay = (results: any) => {
    const oc = overlayRef.current;
    const ctx = oc?.getContext("2d");
    if (!oc || !ctx) return;

    oc.width = videoRef.current?.clientWidth || 640;
    oc.height = videoRef.current?.clientHeight || 480;
    ctx.clearRect(0, 0, oc.width, oc.height);

    if (results.multiHandLandmarks) {
      results.multiHandLandmarks.forEach((landmarks: any[]) => {
        // Calculate bounding box
        let minX = 1, minY = 1, maxX = 0, maxY = 0;
        landmarks.forEach(lm => {
          minX = Math.min(minX, lm.x);
          minY = Math.min(minY, lm.y);
          maxX = Math.max(maxX, lm.x);
          maxY = Math.max(maxY, lm.y);
        });

        // Mirror X
        const x = (1 - maxX) * oc.width; 
        const y = minY * oc.height;
        const w = (maxX - minX) * oc.width;
        const h = (maxY - minY) * oc.height;

        // Draw bounding box
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x - 10, y - 10, w + 20, h + 20);
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = "#3b82f6";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText("DETECTED HAND", x - 10, y - 15);

        // Draw skeleton
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 1.5;
        // Connections (thumb, fingers etc) - simplified for visibility
        [0, 1, 2, 3, 4, 0, 5, 6, 7, 8, 0, 17, 18, 19, 20].forEach((idx, i, arr) => {
            if (i === 0) return;
            const p1 = landmarks[arr[i-1]], p2 = landmarks[idx];
            ctx.beginPath();
            ctx.moveTo((1 - p1.x) * oc.width, p1.y * oc.height);
            ctx.lineTo((1 - p2.x) * oc.width, p2.y * oc.height);
            ctx.stroke();
        });
      });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      dispatch({ type: "SET_RUNNING", payload: true });
    } catch (e) { alert("Camera failed"); }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    dispatch({ type: "SET_RUNNING", payload: false });
  };

  useEffect(() => {
    if (!state.isRunning) return;
    const loop = async () => {
      if (videoRef.current && handsRef.current) {
        await handsRef.current.send({ image: videoRef.current });
        const { left, right } = latestHandsData.current;
        processHands(left, right);
        
        // Callback if we have a prediction
        if (state.currentPrediction) {
            onDetect(state.currentPrediction.label, state.currentPrediction.confidence);
        }
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [state.isRunning, state.currentPrediction, onDetect, processHands]);

  return (
    <div className={`relative rounded-3xl overflow-hidden bg-slate-900 aspect-video transition-all duration-500 ${handDetected ? "ring-8 ring-blue-500/20" : "ring-0"}`}>
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror scale-x-[-1]" />
      <canvas ref={overlayRef} className="absolute inset-0 z-10 w-full h-full" />
      
      {!state.isRunning && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm text-white p-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-4 animate-bounce">
            <Play size={32} />
          </div>
          <p className="font-bold text-center">Ready to verify your sign?</p>
          <p className="text-xs text-slate-400 mt-2">Click start to activate AI tracking</p>
        </div>
      )}

      {handDetected && <div className="absolute top-4 left-4 z-30 px-3 py-1 bg-blue-500 rounded-full text-[10px] font-black text-white shadow-lg animate-pulse">TRACKING ACTIVE</div>}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        <button 
           onClick={state.isRunning ? stopCamera : startCamera}
           className={`px-6 py-2 rounded-full font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center gap-2 ${state.isRunning ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          {state.isRunning ? <Square size={16} /> : <Play size={16} />}
          {state.isRunning ? "Stop Session" : "Start Practice"}
        </button>
      </div>
    </div>
  );
}