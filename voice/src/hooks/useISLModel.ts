"use client";
import { useRef, useCallback, useEffect } from "react";
import { useISL } from "@/store/islStore";

const CONFIDENCE_THRESHOLD = 0.70; 
const SEQUENCE_LENGTH = 30;
const HOLD_DURATION_MS = 2000;
const API_URL = "http://localhost:8001/predict_sequence";

export function useISLModel() {
  const { state, dispatch } = useISL();
  const holdStartRef = useRef<number | null>(null);
  const lastHeldRef  = useRef<string | null>(null);
  const lastAddedRef = useRef<number>(0);
  const sequenceRef = useRef<number[][]>([]);


  // Model is "ready" if the API is assumed to be up
  useEffect(() => {
    dispatch({ type: "SET_MODEL_READY" });
  }, [dispatch]);

  const processHands = useCallback(async (
    leftLandmarks:  number[][] | null,
    rightLandmarks: number[][] | null
  ) => {
    if (!state.isRunning || state.isPaused) return;

    const handsDetected = (leftLandmarks ? 1 : 0) + (rightLandmarks ? 1 : 0);
    dispatch({ type: "SET_HANDS_VISIBLE", payload: handsDetected });

    // ── No hands detected ─────────────────────────────────────────────────────
    if (handsDetected === 0) {
      dispatch({ type: "SET_PREDICTION", payload: { label: "—", confidence: 0, topK: [], handsDetected: 0 } });
      dispatch({ type: "SET_ACTIVE_LETTER", payload: null });
      dispatch({ type: "SET_HOLD_PROGRESS", payload: 0 });
      holdStartRef.current = null;
      lastHeldRef.current  = null;
      return;
    }

    // ── Call API for prediction ──────────────────────────────────────────────
    let frameData = new Array(126).fill(0);
    
    if (leftLandmarks && leftLandmarks.length > 0) {
      let wrist = leftLandmarks[0];
      let j = 0;
      for (let lm of leftLandmarks) {
        frameData[j++] = lm[0] - wrist[0];
        frameData[j++] = lm[1] - wrist[1];
        frameData[j++] = (lm[2] || 0) - (wrist[2] || 0);
      }
    }
    
    if (rightLandmarks && rightLandmarks.length > 0) {
      let wrist = rightLandmarks[0];
      let j = 63;
      for (let lm of rightLandmarks) {
        frameData[j++] = lm[0] - wrist[0];
        frameData[j++] = lm[1] - wrist[1];
        frameData[j++] = (lm[2] || 0) - (wrist[2] || 0);
      }
    }

    sequenceRef.current.push(frameData);
    if (sequenceRef.current.length > SEQUENCE_LENGTH) {
      sequenceRef.current.shift();
    }

    if (sequenceRef.current.length < SEQUENCE_LENGTH) {
      dispatch({ type: "SET_PREDICTION", payload: { label: "—", confidence: 0, topK: [], handsDetected } });
      return;
    }

    try {
      const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              sequence: sequenceRef.current
          })
      });

      if (!response.ok) throw new Error("API prediction failed");
      
      const data = await response.json();
      const majorLabel = data.prediction || "?";
      const adjustedConf = data.confidence || 0; 

      dispatch({ type: "PUSH_BUFFER", payload: { label: majorLabel, conf: adjustedConf } });

      dispatch({ type: "SET_PREDICTION", payload: { 
          label: majorLabel, 
          confidence: adjustedConf, 
          topK: [{ label: majorLabel, prob: adjustedConf }], 
          handsDetected 
      } });
      dispatch({ type: "SET_ACTIVE_LETTER", payload: majorLabel });
      dispatch({ type: "SET_DETECTION_COUNT", payload: state.detectionCount + 1 });

      // ── Hold-to-confirm logic ────────────────────────────────────────────────
      const now = Date.now();
      if (majorLabel !== "—" && majorLabel !== "?") {
          if (majorLabel !== lastHeldRef.current) {
              lastHeldRef.current = majorLabel;
              holdStartRef.current = now;
              dispatch({ type: "SET_HOLD_PROGRESS", payload: 0 });
          } else if (holdStartRef.current) {
              const elapsed = now - holdStartRef.current;
              dispatch({ type: "SET_HOLD_PROGRESS", payload: Math.min((elapsed / HOLD_DURATION_MS) * 100, 100) });
              
              if (elapsed >= HOLD_DURATION_MS && now - lastAddedRef.current > HOLD_DURATION_MS * 1.2) {
                  dispatch({ type: "ADD_LETTER", payload: majorLabel });
                  lastAddedRef.current = now;
                  holdStartRef.current = now + HOLD_DURATION_MS;
                  lastHeldRef.current = null;
                  dispatch({ type: "SET_HOLD_PROGRESS", payload: 0 });
              }
          }
      } else {
          dispatch({ type: "SET_HOLD_PROGRESS", payload: 0 });
          holdStartRef.current = null;
          lastHeldRef.current = null;
      }
    } catch (error) {
      console.error("Prediction error:", error);
    }
  }, [state, dispatch]);

  return { processHands };
}