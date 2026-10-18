// MOCK prediction logic. Replace `predictStudent` with your real ML call later;
// keep the returned shape and the UI won't need to change.

export const FIELDS = {
  hours:       { label: "Hours studied per week", unit: "hrs", min: 0, max: 60,  ideal: 20, weight: 0.25, icon: "fa-book-open",     hint: "Focused study time, not screen time" },
  attendance:  { label: "Attendance",             unit: "%",   min: 0, max: 100, ideal: 90, weight: 0.25, icon: "fa-user-check",    hint: "Classes attended out of all classes" },
  prevScore:   { label: "Previous test score",    unit: "%",   min: 0, max: 100, ideal: 75, weight: 0.35, icon: "fa-pen-to-square", hint: "Your most recent test, out of 100" },
  assignments: { label: "Assignments completed",  unit: "",    min: 0, max: 20,  ideal: 16, weight: 0.15, icon: "fa-list-check",    hint: "Out of 20 this term" },
};
export const KEYS = Object.keys(FIELDS);
export const PASS_AT = 60;

export const isFieldValid = (k, v) =>
  v !== "" && Number.isFinite(+v) && +v >= FIELDS[k].min && +v <= FIELDS[k].max;
export const isComplete = (vals) => KEYS.every((k) => isFieldValid(k, vals[k]));

// Instant estimate (also powers the live preview while typing)
export function estimate(vals) {
  const raw = KEYS.reduce((s, k) => s + FIELDS[k].weight * Math.min(+vals[k] / FIELDS[k].ideal, 1), 0);
  const probability = Math.round(100 / (1 + Math.exp(-(raw - 0.62) * 10)));
  return { probability, label: probability >= PASS_AT ? "LIKELY TO PASS" : "NEEDS ATTENTION" };
}

const NOTES = { strong: "On track", ok: "Close — a small push helps", weak: "Biggest room to improve" };

export function explain(vals) {
  return KEYS.map((k) => {
    const f = FIELDS[k];
    const strength = Math.min(+vals[k] / f.ideal, 1);
    const tone = strength >= 0.85 ? "strong" : strength >= 0.6 ? "ok" : "weak";
    return { key: k, label: f.label, value: +vals[k], unit: f.unit, target: f.ideal, strength, tone, note: NOTES[tone] };
  });
}

export async function predictStudent(vals) {
  await new Promise((r) => setTimeout(r, 1300)); // fake network latency
  // Dev helper: run `window.__STUDYAI_FAIL__ = true` in the console to preview the error state
  if (typeof window !== "undefined" && window.__STUDYAI_FAIL__) {
    throw new Error("The prediction service didn't respond. Check your connection and try again.");
  }
  const inputs = Object.fromEntries(KEYS.map((k) => [k, +vals[k]]));
  return { id: crypto.randomUUID(), createdAt: Date.now(), inputs, ...estimate(inputs), factors: explain(inputs) };
}
