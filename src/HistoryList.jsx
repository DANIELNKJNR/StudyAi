import { EmptyState, ErrorState, Skeleton } from "./StateViews";
import { PASS_AT } from "./mockPredict";

export default function HistoryList({ items, loading, error, onClear }) {
  return (
    <section id="history" aria-labelledby="hist-h" className="scroll-mt-6 rounded-[28px] bg-white p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h2 id="hist-h" className="text-xl font-semibold">Prediction history</h2>
        {items.length > 0 && <button onClick={onClear} className="rounded-full px-3 py-1.5 text-sm text-black/60 hover:bg-black/5">Clear</button>}
      </div>
      {loading ? (
        <div className="mt-5 space-y-3"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
      ) : error ? (
        <ErrorState title="Couldn't load your history" body={error} />
      ) : items.length === 0 ? (
        <EmptyState icon="fa-clock-rotate-left" title="No predictions yet" body="Each prediction you make is saved here so you can track your progress." />
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((h) => {
            const pass = h.probability >= PASS_AT, d = new Date(h.createdAt);
            return (
              <li key={h.id} className="flex items-center gap-4 rounded-3xl bg-[var(--bg)] p-4">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums ${pass ? "bg-[var(--lime)] text-[var(--forest)]" : "bg-[var(--coral)]/30 text-[#8a2a08]"}`}>{h.probability}%</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{h.label}</p>
                  <p className="truncate text-xs text-black/55">
                    {h.inputs.hours} hrs/week, {h.inputs.attendance}% attendance, {h.inputs.prevScore}% last test, {h.inputs.assignments} assignments
                  </p>
                </div>
                <time dateTime={d.toISOString()} className="shrink-0 text-right text-xs text-black/50">
                  {d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}<br />
                  {d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
