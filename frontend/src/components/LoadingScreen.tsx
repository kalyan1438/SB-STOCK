export default function LoadingScreen({ label = 'Loading SB Stocks...' }: { label?: string }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-soft">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
    </div>
  );
}

