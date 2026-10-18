export default function ScoreRing({ value = 0, size = 160, stroke = 8, color = "var(--lime)", spin = false, children }) {
  const r = 45, c = 2 * Math.PI * r;
  const shown = spin ? 28 : value;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className={`h-full w-full -rotate-90 ${spin ? "animate-spin" : ""}`}
           style={spin ? { animationDuration: "1.1s" } : undefined} aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={stroke} />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={c * (1 - shown / 100)}
                style={{ transition: "stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1), stroke .4s" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}
