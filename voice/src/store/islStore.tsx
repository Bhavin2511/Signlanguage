"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";

export const LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// TRUE 2-HAND ISL DESCRIPTIONS
export const ISL_DESCRIPTIONS: Record<string, { desc: string; hands: "both" | "right" | "left" }> = {
  A: { desc: "Both fists together, thumbs up", hands: "both" },
  B: { desc: "Both hands flat, palms facing out", hands: "both" },
  C: { desc: "Both hands form C shape facing each other", hands: "both" },
  D: { desc: "Right index up, left hand cups below", hands: "both" },
  E: { desc: "Both hands bent fingers facing each other", hands: "both" },
  F: { desc: "Right F-shape, left hand open support", hands: "both" },
  G: { desc: "Both hands point — right index, left flat", hands: "both" },
  H: { desc: "Both index+middle fingers horizontal", hands: "both" },
  I: { desc: "Right pinky raised, left fist base", hands: "both" },
  J: { desc: "Right pinky traces J, left fist steady", hands: "both" },
  K: { desc: "Right K-shape over left flat palm", hands: "both" },
  L: { desc: "Both hands L-shape mirrored", hands: "both" },
  M: { desc: "Right 3 fingers on left downward palm", hands: "both" },
  N: { desc: "Right 2 fingers on left downward palm", hands: "both" },
  O: { desc: "Both hands form O touching fingertips", hands: "both" },
  P: { desc: "Right P-shape, left hand horizontal", hands: "both" },
  Q: { desc: "Right Q pointing down, left cupped", hands: "both" },
  R: { desc: "Right crossed fingers over left palm", hands: "both" },
  S: { desc: "Both fists stacked, right on left", hands: "both" },
  T: { desc: "Right thumb between fingers on left fist", hands: "both" },
  U: { desc: "Right U-shape, left flat horizontal", hands: "both" },
  V: { desc: "Right V/peace sign over left palm", hands: "both" },
  W: { desc: "Right W spread, left fist support", hands: "both" },
  X: { desc: "Right hooked index taps left palm", hands: "both" },
  Y: { desc: "Both Y-shapes mirrored outward", hands: "both" },
  Z: { desc: "Right index traces Z, left steady", hands: "both" },
};

export const CONFUSION_PAIRS = [["M","N"],["U","V"],["S","T"],["K","P"],["D","G"]];

export interface HandLandmarks {
  landmarks: number[][];   // 21 points × [x, y, z]
  handedness: "Left" | "Right";
}

export interface Prediction {
  label: string;
  confidence: number;
  topK: Array<{ label: string; prob: number }>;
  handsDetected: number;
}

interface ISLState {
  isRunning: boolean;
  isPaused: boolean;
  modelReady: boolean;
  currentPrediction: Prediction | null;
  predBuffer: Array<{ label: string; conf: number }>;
  sentence: string;
  frameCount: number;
  detectionCount: number;
  fps: number;
  sessionStart: number | null;
  activeLetter: string | null;
  holdProgress: number;
  handsVisible: number;  // 0, 1, or 2
}

type Action =
  | { type: "SET_RUNNING"; payload: boolean }
  | { type: "SET_PAUSED"; payload: boolean }
  | { type: "SET_MODEL_READY" }
  | { type: "SET_PREDICTION"; payload: Prediction }
  | { type: "PUSH_BUFFER"; payload: { label: string; conf: number } }
  | { type: "ADD_LETTER"; payload: string }
  | { type: "DELETE_LAST" }
  | { type: "CLEAR_SENTENCE" }
  | { type: "ADD_SPACE" }
  | { type: "SET_FPS"; payload: number }
  | { type: "SET_FRAME_COUNT"; payload: number }
  | { type: "SET_DETECTION_COUNT"; payload: number }
  | { type: "SET_SESSION_START"; payload: number | null }
  | { type: "SET_ACTIVE_LETTER"; payload: string | null }
  | { type: "SET_HOLD_PROGRESS"; payload: number }
  | { type: "SET_HANDS_VISIBLE"; payload: number }
  | { type: "STOP_SESSION" };

const init: ISLState = {
  isRunning: false, isPaused: false, modelReady: false,
  currentPrediction: null, predBuffer: [], sentence: "",
  frameCount: 0, detectionCount: 0, fps: 0,
  sessionStart: null, activeLetter: null, holdProgress: 0, handsVisible: 0,
};

function reducer(state: ISLState, action: Action): ISLState {
  switch (action.type) {
    case "SET_RUNNING": return { ...state, isRunning: action.payload };
    case "SET_PAUSED": return { ...state, isPaused: action.payload };
    case "SET_MODEL_READY": return { ...state, modelReady: true };
    case "SET_PREDICTION": return { ...state, currentPrediction: action.payload };
    case "PUSH_BUFFER": return { ...state, predBuffer: [...state.predBuffer, action.payload].slice(-7) };
    case "ADD_LETTER": return { ...state, sentence: state.sentence + action.payload };
    case "DELETE_LAST": return { ...state, sentence: state.sentence.slice(0, -1) };
    case "CLEAR_SENTENCE": return { ...state, sentence: "" };
    case "ADD_SPACE": return { ...state, sentence: state.sentence + " " };
    case "SET_FPS": return { ...state, fps: action.payload };
    case "SET_FRAME_COUNT": return { ...state, frameCount: action.payload };
    case "SET_DETECTION_COUNT": return { ...state, detectionCount: action.payload };
    case "SET_SESSION_START": return { ...state, sessionStart: action.payload };
    case "SET_ACTIVE_LETTER": return { ...state, activeLetter: action.payload };
    case "SET_HOLD_PROGRESS": return { ...state, holdProgress: action.payload };
    case "SET_HANDS_VISIBLE": return { ...state, handsVisible: action.payload };
    case "STOP_SESSION": return { ...init, modelReady: state.modelReady, sentence: state.sentence };
    default: return state;
  }
}

const ISLCtx = createContext<{ state: ISLState; dispatch: React.Dispatch<Action> } | null>(null);

export function ISLProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, init);
  return <ISLCtx.Provider value={{ state, dispatch }}>{children}</ISLCtx.Provider>;
}

export function useISL() {
  const ctx = useContext(ISLCtx);
  if (!ctx) throw new Error("useISL must be inside ISLProvider");
  return ctx;
}