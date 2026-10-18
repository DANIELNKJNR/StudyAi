import { FIELDS, KEYS, isFieldValid } from "./mockPredict";

function Field({ k, value, onChange }) {
  const f = FIELDS[k], id = `f-${k}`;
  const bad = value !== "" && !isFieldValid(k, value);
  const fill = value === "" ? 0 : Math.min(100, Math.max(0, ((+value - f.min) / (f.max - f.min)) * 100));
  return (
    <div className="rounded-3xl bg-white/55 p-4">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
        <i className={`fa-solid ${f.icon} text-[var(--forest)]`} aria-hidden="true" /> {f.label}
      </label>
      <div className="mt-3 flex items-center gap-2">
        <input id={id} type="number" inputMode="numeric" min={f.min} max={f.max} placeholder="0"
               value={value} onChange={(e) => onChange(e.target.value)}
               aria-invalid={bad} aria-describedby={`${id}-h`}
               className={`w-24 rounded-full bg-white px-4 py-2.5 text-lg font-semibold tabular-nums ring-1 ${bad ? "ring-2 ring-[var(--coral)]" : "ring-black/5"}`} />
        <span className="text-sm text-black/50">{f.unit}</span>
      </div>
      <input type="range" aria-label={`${f.label} slider`} className="slider mt-4 w-full"
             min={f.min} max={f.max} value={value === "" ? f.min : value}
             onChange={(e) => onChange(e.target.value)} style={{ "--fill": `${fill}%` }} />
      <p id={`${id}-h`} className={`mt-2 text-xs ${bad ? "font-medium text-[#b3360f]" : "text-black/55"}`}>
        {bad ? `Enter a value from ${f.min} to ${f.max}.` : f.hint}
      </p>
    </div>
  );
}

export default function PredictionForm({ values, onChange, onSubmit, loading, complete }) {
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); if (complete && !loading) onSubmit(); }}
          className="rounded-[28px] bg-gradient-to-br from-[#d6f86e] to-[var(--lime)] p-5 sm:p-7">
      <h2 className="text-xl font-semibold sm:text-2xl">Your week in four numbers</h2>
      <p className="mt-1 text-sm text-[var(--forest)]/80">The estimate is only as good as what you enter, so keep it honest.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {KEYS.map((k) => <Field key={k} k={k} value={values[k]} onChange={(v) => onChange(k, v)} />)}
      </div>
      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={!complete || loading}
                className="w-full rounded-full bg-[var(--forest)] px-7 py-3.5 font-medium text-white transition active:scale-[.98] disabled:opacity-40 sm:w-auto">
          {loading ? "Predicting…" : "Predict my result"}
        </button>
        {!complete && <span className="text-sm text-[var(--forest)]/75">Fill in all four fields to continue.</span>}
      </div>
    </form>
  );
}
