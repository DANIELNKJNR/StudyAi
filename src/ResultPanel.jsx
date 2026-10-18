import { useEffect, useRef, useState } from "react";
import ScoreRing from "./ScoreRing";
import { PASS_AT } from "./mockPredict";

/**
 * One component, three layouts:
 *  - phones: bottom sheet. Collapsed it's a live mini-gauge bar; drag up (or tap) to expand
 *  - tablets: full-width sheet, body goes side-by-side via a container query
 *  - desktop: sticky sidebar card, always open
 * It shows a LIVE estimate while the user types, then the confirmed prediction.
 */
export default function ResultPanel({ status, result, preview, filled, error, onRetry, onReset }) {
  const [open, setOpen] = useState(false);
  const startY = useRef(0);

  useEffect(() => {
    if (status === "loading" || status === "success" || status === "error") setOpen(true);
  }, [status]);

  const mode = status === "loading" ? "loading" : status === "error" ? "error"
    : status === "success" ? "result" : preview ? "preview" : "empty";
  const data = mode === "result" ? result : preview;
  const pass = data && data.probability >= PASS_AT;
  const tone = pass ? "var(--lime)" : "var(--coral)";

  const title = { empty: "Your prediction", preview: `${data?.probability}% chance to pass`, loading: "Analyzing…",
                  error: "Couldn't predict", result: data?.label }[mode];
  const sub = { empty: `${filled} of 4 fields filled`, preview: "Live preview, updates as you type",
                loading: "Checking your study pattern", error: "Tap to see details", result: "Prediction ready" }[mode];

  const toggle = (next) => { setOpen(next); navigator.vibrate?.(8); };
  const onUp = (e) => {
    const dy = e.clientY - startY.current;
    if (Math.abs(dy) < 8) toggle(!open);
    else toggle(dy < 0);
  };

  return (
    <aside aria-label="Prediction result" aria-live="polite"
      className="rp-panel fixed inset-x-0 bottom-0 z-30 overflow-hidden rounded-t-[28px] text-white shadow-[0_-12px_40px_rgba(0,0,0,.25)] transition-colors lg:sticky lg:inset-x-auto lg:bottom-auto lg:top-6 lg:rounded-[28px] lg:shadow-none"
      style={{ background: `radial-gradient(120% 90% at 0% 0%, color-mix(in srgb, ${tone} 24%, transparent), transparent 60%), var(--card)`,
               paddingBottom: "env(safe-area-inset-bottom)" }}>
      <button type="button" aria-expanded={open}
        onPointerDown={(e) => { startY.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerUp={onUp}
        className="flex w-full touch-none flex-col items-stretch px-5 pb-3 pt-2 text-left lg:cursor-default lg:touch-auto">
        <span className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/25 lg:hidden" />
        <span className="flex items-center gap-3">
          {mode !== "empty" && (
            <span className="lg:hidden">
              <ScoreRing size={44} stroke={11} value={data?.probability ?? 0} color={tone} spin={mode === "loading"} />
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold">{title}</span>
            <span className="block text-sm text-white/60">{sub}</span>
          </span>
          <i className={`fa-solid fa-chevron-up text-white/60 transition-transform lg:hidden ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </span>
      </button>

      <div className={`grid transition-[grid-template-rows] duration-300 lg:grid-rows-[1fr] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="rp max-h-[68dvh] overflow-y-auto px-5 pb-6 pt-2 lg:max-h-none">
            <div className="rp-body">
              {mode === "empty" ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="flex gap-1.5" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => <span key={i} className={`h-2 w-8 rounded-full ${i < filled ? "bg-[var(--lime)]" : "bg-white/15"}`} />)}
                  </div>
                  <p className="font-semibold">Start with any field</p>
                  <p className="max-w-[16rem] text-sm text-white/60">Once all four are filled, a live estimate appears here.</p>
                </div>
              ) : mode === "error" ? (
                <div role="alert" className="flex flex-col items-center gap-3 py-4 text-center">
                  <i className="fa-solid fa-triangle-exclamation text-2xl text-[var(--coral)]" aria-hidden="true" />
                  <p className="max-w-xs text-sm text-white/75">{error}</p>
                  <button onClick={onRetry} className="rounded-full bg-[var(--lime)] px-5 py-2 text-sm font-semibold text-[var(--forest)]">Try again</button>
                </div>
              ) : (
                <>
                  <ScoreRing size={160} value={data?.probability ?? 0} color={tone} spin={mode === "loading"}>
                    {mode === "loading" ? <i className="fa-solid fa-wand-magic-sparkles text-xl text-white/70" aria-hidden="true" />
                      : <span className="text-4xl font-semibold tabular-nums">{data.probability}<span className="text-lg text-white/60">%</span></span>}
                  </ScoreRing>
                  <div className="min-w-0">
                    {mode === "loading" ? (
                      <div className="space-y-2" aria-hidden="true">
                        <div className="h-5 w-40 animate-pulse rounded-full bg-white/15" />
                        <div className="h-3 w-52 animate-pulse rounded-full bg-white/10" />
                      </div>
                    ) : (
                      <>
                        <p key={mode + data.label} className={`pop text-2xl font-bold leading-tight ${pass ? "text-[var(--lime)]" : "text-[var(--coral)]"}`}>{data.label}</p>
                        <p className="mt-1 text-sm text-white/65">
                          {mode === "preview" ? "Press Predict my result to confirm."
                            : pass ? "Your numbers point to a pass. Keep this rhythm going." : "A few numbers are holding you back. See the breakdown below."}
                        </p>
                        {mode === "result" && (
                          <div className="rp-actions mt-4 flex justify-center">
                            <button onClick={onReset} className="rounded-full border border-white/25 px-5 py-2 text-sm font-medium transition hover:bg-white/10">Start over</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
