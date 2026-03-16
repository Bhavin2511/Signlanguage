"use client";
import { useISL, ISL_DESCRIPTIONS } from "@/store/islStore";

export default function ISLResults() {
  const { state } = useISL();
  const pred = state.currentPrediction;
  const confColor = !pred || pred.confidence < 0.65 ? "#ff4060"
    : pred.confidence < 0.80 ? "#ffb830" : "#00f5c4";

  return (
    <div className="isl-result-panel">
      <div className="isl-panel-header">
        <div className="isl-panel-title">🔮 Live Prediction</div>
        <span className="isl-panel-meta">7-frame · 2-hand CNN</span>
      </div>

      <div className="isl-pred-display">
        <div className="isl-pred-label">Detected ISL Sign</div>
        <div className={`isl-pred-letter ${pred && pred.label !== "?" && pred.label !== "—" ? "isl-pred-active" : ""}`}
          style={{ color: pred?.label === "?" ? "#ff4060" : undefined }}>
          {pred?.label || "—"}
        </div>
        <div className="isl-pred-word">
          {pred
            ? pred.label === "?" ? "⚠ Low confidence — try adjusting your gesture"
            : pred.label === "—" ? "No hands detected"
            : ISL_DESCRIPTIONS[pred.label]?.desc
            : "Waiting for camera..."}
        </div>
        {pred && pred.label !== "—" && pred.label !== "?" && (
          <div className="isl-hands-badge">
            <span>✋🤚</span> {ISL_DESCRIPTIONS[pred.label]?.hands === "both" ? "2-Hand Sign" : "1-Hand Sign"}
          </div>
        )}
      </div>

      <div className="isl-conf-section">
        <div className="isl-conf-label">Confidence — {pred?.handsDetected || 0} hand(s) detected</div>
        <div className="isl-conf-track">
          <div className="isl-conf-fill" style={{
            width: `${Math.round((pred?.confidence || 0) * 100)}%`,
            background: `linear-gradient(90deg, ${confColor}, ${confColor}99)`
          }} />
        </div>
        <div className="isl-conf-value" style={{ color: confColor }}>
          {pred ? `${Math.round(pred.confidence * 100)}%` : "0%"}
        </div>
      </div>

      {state.holdProgress > 0 && (
        <div className="isl-conf-section">
          <div className="isl-conf-label">Hold to confirm: {state.activeLetter}</div>
          <div className="isl-conf-track">
            <div className="isl-hold-fill" style={{ width: `${state.holdProgress}%` }} />
          </div>
          <div className="isl-conf-value" style={{ color: "#ff6b35" }}>{Math.round(state.holdProgress)}%</div>
        </div>
      )}

      <div className="isl-topk-section">
        <div className="isl-topk-title">Top-5 Predictions</div>
        <div className="isl-topk-list">
          {pred?.topK?.length ? pred.topK.map((item, i) => (
            <div key={item.label} className={`isl-topk-item ${i === 0 ? "isl-topk-top" : ""}`}>
              <span className="isl-topk-char">{item.label}</span>
              <div className="isl-topk-bar-wrap">
                <div className="isl-topk-bar">
                  <div className="isl-topk-fill" style={{ width: `${Math.round(item.prob * 100)}%` }} />
                </div>
                <div className="isl-topk-pct">
                  {Math.round(item.prob * 100)}% — {ISL_DESCRIPTIONS[item.label]?.desc.split(",")[0]}
                </div>
              </div>
            </div>
          )) : (
            <div className="isl-topk-item">
              <span className="isl-topk-char" style={{ color: "var(--isl-muted)" }}>—</span>
              <div className="isl-topk-bar-wrap">
                <div className="isl-topk-bar"><div className="isl-topk-fill" style={{ width: "0%" }} /></div>
                <div className="isl-topk-pct">No detection yet</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="isl-buffer-section">
        <div className="isl-topk-title">Smoothing Buffer (7-frame)</div>
        <div className="isl-buffer-slots">
          {Array.from({ length: 7 }, (_, i) => state.predBuffer[i] || null).map((slot, i) => (
            <div key={i} className={`isl-buf-slot ${slot ? "isl-buf-filled" : ""}`}>{slot?.label || "·"}</div>
          ))}
        </div>
        <div className="isl-buffer-note">≥5/7 frames must agree before confirming</div>
      </div>
    </div>
  );
}