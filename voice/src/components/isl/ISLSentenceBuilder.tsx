"use client";
import { useISL } from "@/store/islStore";

export default function ISLSentenceBuilder() {
  const { state, dispatch } = useISL();

  const speak = () => {
    if (!state.sentence.trim()) return;
    const u = new SpeechSynthesisUtterance(state.sentence);
    u.lang = "en-IN"; u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="isl-sentence-section">
      <div className="isl-sentence-header">
        <div className="isl-panel-title">📝 Sentence Builder</div>
        <span className="isl-panel-meta">Hold gesture 1.5s to add letter</span>
      </div>
      <div className="isl-sentence-display">
        {state.sentence
          ? <span>{state.sentence}</span>
          : <span style={{ color: "var(--isl-muted)", fontStyle: "normal", fontSize: "16px" }}>Start signing to build a sentence...</span>
        }
        <span className="isl-cursor" />
      </div>
      <div className="isl-sentence-controls">
        <button className="isl-btn isl-btn-secondary" onClick={() => dispatch({ type: "ADD_SPACE" })}>SPACE</button>
        <button className="isl-btn isl-btn-secondary" onClick={() => dispatch({ type: "DELETE_LAST" })}>⌫ DELETE</button>
        <button className="isl-btn isl-btn-secondary" onClick={speak}>🔊 SPEAK</button>
        <button className="isl-btn isl-btn-secondary" onClick={() => navigator.clipboard.writeText(state.sentence)}>📋 COPY</button>
        <button className="isl-btn isl-btn-danger" onClick={() => dispatch({ type: "CLEAR_SENTENCE" })}>✕ CLEAR</button>
      </div>
      {state.sentence.length > 0 && (
        <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--isl-muted)" }}>
          {state.sentence.replace(/ /g, "").length} letters · {state.sentence.trim().split(/\s+/).filter(Boolean).length} words
        </div>
      )}
    </div>
  );
}