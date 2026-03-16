"use client";
import { useRef, useEffect, useCallback, useState } from "react";
import { useISL } from "@/store/islStore";
import { useISLModel } from "@/hooks/useISLModel";
import { Play, Square, RotateCw } from "lucide-react";

// MediaPipe Hands is loaded via CDN script tag
// It detects BOTH hands and returns landmarks for each
declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

interface ISLCameraProps {
  onPrediction?: (label: string | null) => void;
}

export default function ISLCamera({ onPrediction }: ISLCameraProps) {
  const { state, dispatch } = useISL();
  const { processHands } = useISLModel();
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<any>(null);
  const animRef = useRef<number>(0);
  const fpsRef = useRef({ last: Date.now(), count: 0 });
  const [mpLoaded, setMpLoaded] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const latestHandsData = useRef<{ left: number[][] | null; right: number[][] | null }>({ left: null, right: null });

  // Load MediaPipe Hands from CDN
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

  // Init MediaPipe Hands after scripts load
  const initMediaPipe = useCallback(() => {
    if (!mpLoaded || !window.Hands) return;
    const hands = new window.Hands({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 2,           // ← DETECT BOTH HANDS
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.6,
    });
    hands.onResults((results: any) => {
      let left: number[][] | null = null;
      let right: number[][] | null = null;

      if (results.multiHandLandmarks && results.multiHandedness) {
        results.multiHandLandmarks.forEach((landmarks: any[], idx: number) => {
          const label = results.multiHandedness[idx].label; // "Left" or "Right"
          const pts = landmarks.map((lm: any) => [lm.x, lm.y, lm.z]);
          // Note: MediaPipe mirrors — "Left" from camera = user's Right hand
          if (label === "Left") right = pts;
          else left = pts;
        });
      }

      latestHandsData.current = { left, right };
      drawHandOverlay(results, left, right);
    });

    handsRef.current = hands;
  }, [mpLoaded]);

  useEffect(() => { initMediaPipe(); }, [initMediaPipe]);

  const startCamera = useCallback(async () => {
    if (!state.modelReady) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: facingMode },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      dispatch({ type: "SET_RUNNING", payload: true });
      dispatch({ type: "SET_SESSION_START", payload: Date.now() });
    } catch (e: any) {
      alert("Camera error: " + e.message);
    }
  }, [state.modelReady, dispatch]);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    dispatch({ type: "STOP_SESSION" });
  }, [dispatch]);

  const togglePause = useCallback(() => {
    dispatch({ type: "SET_PAUSED", payload: !state.isPaused });
  }, [state.isPaused, dispatch]);

  const switchCamera = useCallback(() => {
    setFacingMode(f => f === "user" ? "environment" : "user");
    if (state.isRunning) {
      stopCamera();
      setTimeout(startCamera, 300);
    }
  }, [state.isRunning, startCamera, stopCamera]);

  // Main prediction loop — sends frames to MediaPipe
  useEffect(() => {
    if (!state.isRunning || state.isPaused) {
      cancelAnimationFrame(animRef.current);
      return;
    }
    const loop = async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      // Send frame to MediaPipe Hands for landmark detection
      if (handsRef.current) {
        await handsRef.current.send({ image: video });
      }

      // Send detected landmarks to CNN model
      const { left, right } = latestHandsData.current;
      processHands(left, right);

      // FPS counter
      const now = Date.now();
      fpsRef.current.count++;
      if (now - fpsRef.current.last >= 1000) {
        dispatch({ type: "SET_FPS", payload: fpsRef.current.count });
        fpsRef.current = { last: now, count: 0 };
      }
      dispatch({ type: "SET_FRAME_COUNT", payload: state.frameCount + 1 });

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [state.isRunning, state.isPaused, processHands, state.frameCount]);

  // Effect to notify parent about predictions
  useEffect(() => {
    if (onPrediction) {
      onPrediction(state.currentPrediction?.label || null);
    }
  }, [state.currentPrediction?.label, onPrediction]);

  // Draw hand skeleton + landmarks on overlay canvas
  const drawHandOverlay = (results: any, left: number[][] | null, right: number[][] | null) => {
    const oc = overlayRef.current;
    if (!oc) return;
    const ctx = oc.getContext("2d")!;
    const video = videoRef.current;
    oc.width = video?.clientWidth || 640;
    oc.height = video?.clientHeight || 480;
    ctx.clearRect(0, 0, oc.width, oc.height);

    // Draw corner brackets
    ctx.strokeStyle = "#00f5c4"; ctx.lineWidth = 3; ctx.lineCap = "round";
    const s = 28, p = 14;
    [[p,p,1,1],[oc.width-p,p,-1,1],[p,oc.height-p,1,-1],[oc.width-p,oc.height-p,-1,-1]].forEach(([x,y,dx,dy]) => {
      ctx.beginPath(); ctx.moveTo(x+dx*s,y); ctx.lineTo(x,y); ctx.lineTo(x,y+dy*s); ctx.stroke();
    });

    // Draw hand skeleton for each detected hand
    if (results.multiHandLandmarks) {
      results.multiHandLandmarks.forEach((landmarks: any[], idx: number) => {
        const isRight = results.multiHandedness[idx].label === "Left"; // mirrored
        const color = isRight ? "#00f5c4" : "#ff6b35"; // teal=right, orange=left

        // Hand connections (MediaPipe hand topology)
        const connections = [
          [0,1],[1,2],[2,3],[3,4],         // thumb
          [0,5],[5,6],[6,7],[7,8],          // index
          [0,9],[9,10],[10,11],[11,12],     // middle
          [0,13],[13,14],[14,15],[15,16],   // ring
          [0,17],[17,18],[18,19],[19,20],   // pinky
          [5,9],[9,13],[13,17],             // palm
        ];

        ctx.strokeStyle = color; ctx.lineWidth = 2.5;
        connections.forEach(([a, b]) => {
          const ptA = landmarks[a], ptB = landmarks[b];
          ctx.beginPath();
          ctx.moveTo((1 - ptA.x) * oc.width, ptA.y * oc.height); // mirror X
          ctx.lineTo((1 - ptB.x) * oc.width, ptB.y * oc.height);
          ctx.stroke();
        });

        // Draw landmark dots
        landmarks.forEach((lm: any, i: number) => {
          const x = (1 - lm.x) * oc.width;
          const y = lm.y * oc.height;
          ctx.beginPath();
          ctx.arc(x, y, i === 0 ? 6 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = i === 0 ? color : "#fff";
          ctx.fill();
        });

        // Hand label
        const wrist = landmarks[0];
        ctx.font = "bold 13px monospace";
        ctx.fillStyle = color;
        ctx.fillText(isRight ? "RIGHT ✋" : "LEFT 🤚", (1 - wrist.x) * oc.width - 20, wrist.y * oc.height - 12);
      });
    }

    // Prediction label top-left
    const pred = state.currentPrediction;
    if (pred && pred.label !== "?" && pred.label !== "—") {
      ctx.font = "bold 44px sans-serif"; ctx.fillStyle = "#00f5c4";
      ctx.fillText(pred.label, p + 6, 54);
      ctx.font = "13px monospace"; ctx.fillStyle = "rgba(0,245,196,0.8)";
      ctx.fillText(Math.round(pred.confidence * 100) + "%", p + 6, 72);
      if (state.holdProgress > 0) {
        ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(p, 80, 130, 7);
        ctx.fillStyle = "#ff6b35"; ctx.fillRect(p, 80, 130 * state.holdProgress / 100, 7);
      }
    } else if (pred?.label === "?") {
      ctx.font = "bold 12px monospace"; ctx.fillStyle = "#ff4060";
      ctx.fillText("⚠ LOW CONFIDENCE", p + 6, 54);
    }

    // Hands counter badge
    const hCount = state.handsVisible;
    ctx.fillStyle = hCount === 2 ? "rgba(0,245,196,0.15)" : hCount === 1 ? "rgba(255,184,48,0.15)" : "rgba(255,64,96,0.15)";
    ctx.strokeStyle = hCount === 2 ? "#00f5c4" : hCount === 1 ? "#ffb830" : "#ff4060";
    ctx.lineWidth = 1.5;
    roundRect(ctx, oc.width - 100, p, 86, 28, 6);
    ctx.fill(); ctx.stroke();
    ctx.font = "bold 12px monospace";
    ctx.fillStyle = hCount === 2 ? "#00f5c4" : hCount === 1 ? "#ffb830" : "#ff4060";
    ctx.fillText(`✋ ${hCount}/2 hands`, oc.width - 94, p + 18);
  };

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  const sessionTime = state.sessionStart
    ? (() => { const s = Math.floor((Date.now() - state.sessionStart) / 1000); return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`; })()
    : "0:00";

  return (
    <div className="isl-camera-panel">
      <div className="isl-panel-header">
        <div className="isl-panel-title">📷 Live Sign Language Detection</div>
        <div className={`isl-status-badge ${state.modelReady ? "ready" : "loading"}`}>
          {state.modelReady ? "● MODEL READY" : "⟳ LOADING..."}
        </div>
      </div>

      {/* Two-hand guide bar */}
      <div className="isl-hand-guide">
        <div className={`isl-hand-indicator ${state.handsVisible >= 1 ? "detected" : ""}`}>
          🤚 Left Hand {state.handsVisible >= 1 ? "✓" : "—"}
        </div>
        <div className="isl-hand-divider">+</div>
        <div className={`isl-hand-indicator ${state.handsVisible === 2 ? "detected" : ""}`}>
          ✋ Right Hand {state.handsVisible === 2 ? "✓" : "—"}
        </div>
        <div className={`isl-hand-status ${state.handsVisible === 2 ? "ok" : "warn"}`}>
          {state.handsVisible === 2 ? "BOTH DETECTED ✓" : state.handsVisible === 1 ? "1 HAND ✓" : "NO HANDS"}
        </div>
      </div>

      <div className="isl-camera-area">
        <video ref={videoRef} className="isl-video" autoPlay playsInline muted />
        <canvas ref={overlayRef} className="isl-overlay" />
        {!state.isRunning && (
          <div className="isl-placeholder">
            <div className="isl-placeholder-icon">🤲</div>
            <p>Click <strong>Start Camera</strong> to begin</p>
            <p className="isl-placeholder-sub">Keep <strong>both hands</strong> visible in frame</p>
          </div>
        )}
        {state.isRunning && <div className="isl-scan-line" />}
      </div>

      <div className="isl-camera-controls">
        <button className="isl-btn isl-btn-primary" onClick={startCamera} disabled={state.isRunning || !state.modelReady}>
          <Play size={18} /> Start
        </button>
        <button className="isl-btn isl-btn-secondary" onClick={togglePause} disabled={!state.isRunning}>
          {state.isPaused ? <Play size={18} /> : <span>⏸</span>} {state.isPaused ? "Resume" : "Pause"}
        </button>
        <button className="isl-btn isl-btn-secondary" onClick={switchCamera}>
          <RotateCw size={18} /> Switch
        </button>
        <button className="isl-btn isl-btn-danger" onClick={stopCamera} disabled={!state.isRunning}>
          <Square size={18} /> Stop
        </button>
      </div>

      <div className="isl-stats-row">
        {[
          { v: state.fps || "—", k: "FPS" },
          { v: `${state.handsVisible}/2`, k: "Hands" },
          { v: state.detectionCount, k: "Detections" },
          { v: sessionTime, k: "Session" },
        ].map(({ v, k }) => (
          <div key={k} className="isl-stat">
            <div className="isl-stat-val" style={{ color: k === "Hands" ? (state.handsVisible === 2 ? "var(--isl-accent)" : "var(--isl-warn)") : undefined }}>{v}</div>
            <div className="isl-stat-key">{k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}