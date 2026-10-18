import { EmptyState } from "./StateViews";

const BAR = { strong: "var(--leaf)", ok: "#9ddc00", weak: "var(--coral)" };
const CHIP = { strong: "bg-[var(--lime)] text-[var(--forest)]", ok: "bg-[#e3f5a8] text-[var(--forest)]", weak: "bg-[var(--coral)]/25 text-[#8a2a08]" };

export default function FactorBreakdown({ result }) {
  return (
    <section aria-labelledby="factors-h" className="rounded-[28px] bg-white p-5 sm:p-7">
      <h2 id="factors-h" className="text-xl font-semibold">What shaped this result</h2>
      {!result ? (
        <EmptyState icon="fa-chart-simple" title="Your breakdown shows up here"
          body="After you predict, each number is compared with a typical passing target." />
      ) : (
        <ul className="mt-5 space-y-5">
          {result.factors.map((f) => (
            <li key={f.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{f.label}</span>
                <span className="font-semibold tabular-nums">{f.value}{f.unit && ` ${f.unit}`}</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full" style={{ background: "rgba(0,0,0,.07)" }}>
                <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${f.strength * 100}%`, background: BAR[f.tone] }} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-black/60">
                <span className={`rounded-full px-2.5 py-0.5 font-medium ${CHIP[f.tone]}`}>{f.note}</span>
                <span>Typical target: {f.target}{f.unit && ` ${f.unit}`}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
