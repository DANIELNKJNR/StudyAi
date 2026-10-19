import { EmptyState, ErrorState, Skeleton } from "./StateViews";
import { PASS_AT } from "./mockPredict";

export default function HistoryList({ items, loading, error, onClear }) {
  return (
    <section
      id="history"
      className="rounded-3xl border border-black/10 bg-white/70 p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Prediction history</h2>
          <p className="mt-1 text-sm text-black/55">
            Your previous student grade predictions.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClear}
            className="rounded-full border border-black/15 px-4 py-2 text-sm transition hover:bg-black/5"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <Skeleton />
      ) : error ? (
        <ErrorState message={error} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No predictions yet"
          description="Your predictions will appear here after you submit the form."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((h) => {
            const grade = Number(h.predictedGrade);
            const pass = grade >= PASS_AT;
            const date = new Date(h.createdAt);

            return (
              <li
                key={h.id}
                className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-4"
              >
                <span
                  className={`shrink-0 rounded-xl px-3 py-2 text-sm font-bold ${
                    pass
                      ? "bg-[var(--lime)] text-[var(--forest)]"
                      : "bg-[var(--coral)]/15 text-[#8a2a08]"
                  }`}
                >
                  {grade.toFixed(2)}/20
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{h.label}</p>

                  <p className="mt-1 text-sm text-black/55">
                    Study level: {h.inputs.studytime} · Absences:{" "}
                    {h.inputs.absences}
                  </p>

                  <p className="text-sm text-black/55">
                    G1: {h.inputs.G1}/20 · G2: {h.inputs.G2}/20
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    {date.toLocaleString()}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}