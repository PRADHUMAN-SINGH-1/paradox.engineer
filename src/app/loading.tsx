export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-pulse">
      <div className="h-8 w-2/3 max-w-md rounded-lg bg-slate-200 dark:bg-zinc-800" />
      <div className="h-4 w-full max-w-2xl rounded bg-slate-200 dark:bg-zinc-800" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
          />
        ))}
      </div>
    </div>
  );
}
