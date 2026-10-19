import { useState } from "react";
import PredictionForm from "./PredictionForm";
import ResultPanel from "./ResultPanel";
import FactorBreakdown from "./FactorBreakdown";
import './App.css'
import HistoryList from "./HistoryList";
import usePredictionHistory from "./usePredictionHistory";
import {
  KEYS,
  isComplete,
  isFieldValid,
  predictStudent,
} from "./mockPredict";

const EMPTY = {
  studytime: "",
  absences: "",
  G1: "",
  G2: "",
};


export default function App() {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const history = usePredictionHistory();

const {
  items,
  loading: historyLoading,
  error: historyError,
  add,
  clear,
} = history;

  const complete = isComplete(values);
  const filled = KEYS.filter((k) => isFieldValid(k, values[k])).length;
  const preview = null;

  const handleChange = (k, v) => {
    setValues((p) => ({ ...p, [k]: v }));
    if (status === "success" || status === "error") setStatus("idle"); // edited: back to live preview
  };

  const submit = async () => {
  setStatus("loading");
  setError("");

  try {
    const r = await predictStudent(values);

    setResult(r);

    await history.add(r);

    setStatus("success");
  } catch (e) {
    setError(e.message);
    setStatus("error");
  }
};

  const reset = () => { setValues(EMPTY); setStatus("idle"); setResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="text-2xl font-bold tracking-tight text-[var(--leaf)]">StudyAI</span>
        <a href="#history" className="rounded-full border border-[var(--leaf)] px-4 py-1.5 text-sm font-medium text-[var(--forest)] transition hover:bg-[var(--lime)]">History</a>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-32 sm:px-6 lg:pb-16">
        <section className="py-6 sm:py-10">
          <h1 className="max-w-3xl text-[clamp(2rem,6.5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight">
            Know where you stand <span className="text-[var(--leaf)]">before exam day.</span>
          </h1>
          <p className="mt-4 max-w-xl text-black/65">Enter four numbers from your week and StudyAI estimates whether you're on track to pass.</p>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_22.5rem] lg:gap-8">
          <div className="min-w-0 space-y-6">
            <PredictionForm values={values} onChange={handleChange} onSubmit={submit} loading={status === "loading"} complete={complete} />
            <FactorBreakdown result={result} />
            <HistoryList {...history} onClear={history.clear} />
          </div>
          <ResultPanel status={status} result={result} preview={preview} filled={filled} error={error} onRetry={submit} onReset={reset} />
        </div>
      </main>
    </div>
  );
}
