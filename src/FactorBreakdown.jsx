import { EmptyState } from "./StateViews";

export default function FactorBreakdown({ result }) {
  const factors = result?.factors ?? [];

  return (
    <section className="rounded-3xl border border-black/10 bg-white/70 p-5 sm:p-6">
      <h2 className="text-xl font-semibold">Your submitted data</h2>

      <p className="mt-1 text-sm text-black/55">
        These are the inputs the ML model used to predict your grade.
      </p>

      {!result ? (
        <EmptyState
          title="No prediction to analyze"
          description="Submit the form to see the data used by the model."
        />
      ) : (
        <ul className="mt-5 space-y-5">
          {factors.map((factor) => {
            const isAbsences = factor.key === "absences";

            // For absences, fewer days is generally better.
            const strength = isAbsences
              ? Math.max(0, 1 - factor.value / 100)
              : factor.strength;

            return (
              <li key={factor.key}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-medium">{factor.label}</span>

                  <span className="text-sm font-semibold">
                    {factor.value}{" "}
                    <span className="text-black/50">{factor.unit}</span>
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-[var(--leaf)] transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(0, strength * 100))}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-black/50">
                  {factor.key === "studytime" &&
                    "Study time level, from 1 to 4."}

                  {factor.key === "absences" &&
                    "Number of school days missed."}

                  {factor.key === "G1" &&
                    "Your first-period grade out of 20."}

                  {factor.key === "G2" &&
                    "Your second-period grade out of 20."}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}