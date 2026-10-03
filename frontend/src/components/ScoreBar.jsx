export default function ScoreBar({ label, value }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">{value}/100</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-linear-to-r from-brand-500 to-accent-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}