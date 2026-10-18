export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-2xl bg-black/10 ${className}`} aria-hidden="true" />
);

export const EmptyState = ({ icon, title, body }) => (
  <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
    <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--lime)] text-[var(--forest)]">
      <i className={`fa-solid ${icon}`} aria-hidden="true" />
    </span>
    <p className="font-semibold">{title}</p>
    <p className="max-w-xs text-sm text-black/60">{body}</p>
  </div>
);

export const ErrorState = ({ title, body, onRetry }) => (
  <div role="alert" className="flex flex-col items-center gap-2 px-4 py-8 text-center">
    <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--coral)]/25 text-[#b3360f]">
      <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
    </span>
    <p className="font-semibold">{title}</p>
    <p className="max-w-xs text-sm text-black/60">{body}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-2 rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-medium text-white">
        Try again
      </button>
    )}
  </div>
);
