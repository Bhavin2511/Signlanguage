"use client";
import { useISL, LABELS, ISL_DESCRIPTIONS, CONFUSION_PAIRS } from "@/store/islStore";

export default function ISLAlphabetGrid() {
  const { state } = useISL();
  const confSet = new Set(CONFUSION_PAIRS.flat());

  return (
    <div className="isl-alpha-section">
      <div className="isl-section-header">
        <h2 className="isl-section-title">🔡 ISL Alphabet Reference</h2>
        <div style={{ fontSize: "11px", color: "var(--isl-muted)" }}>
          <span style={{ color: "#ff6b35" }}>!</span> = confusion pair (extra training)
        </div>
      </div>
      <div className="isl-alpha-grid">
        {LABELS.map((letter) => (
          <div
            key={letter}
            className={`isl-alpha-card ${state.activeLetter === letter ? "isl-alpha-active" : ""} ${confSet.has(letter) ? "isl-alpha-confusion" : ""}`}
            title={ISL_DESCRIPTIONS[letter].desc}
          >
            <div className="isl-alpha-letter">{letter}</div>
            <div className="isl-alpha-hint">{ISL_DESCRIPTIONS[letter].desc.split(",")[0]}</div>
            {confSet.has(letter) && <div className="isl-alpha-warn">!</div>}
          </div>
        ))}
      </div>
      <div className="isl-confusion-note">
        ⚠ Orange border = confusion pairs (M/N, U/V, S/T, K/P, D/G) — trained with 3× extra samples
      </div>
    </div>
  );
}