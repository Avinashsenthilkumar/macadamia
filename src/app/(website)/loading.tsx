export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="bg-deep pb-24 pt-44">
        <div className="container-x space-y-5">
          <div className="h-4 w-40 rounded-full bg-white/10" />
          <div className="h-14 w-3/4 max-w-2xl rounded-2xl bg-white/10" />
          <div className="h-5 w-1/2 max-w-lg rounded-full bg-white/10" />
        </div>
      </div>
      <div className="container-x grid gap-8 py-20 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-80 rounded-[1.75rem]" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
