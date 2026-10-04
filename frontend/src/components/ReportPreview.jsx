import ScoreBar from './ScoreBar.jsx'

const scores = [['Technical', 82], ['Communication', 74], ['Resume knowledge', 88]]
const metrics = [['Speaking rate', '132 words/min'], ['Filler words', '3.1 per min'], ['Average pause', '1.2 s'], ['Response time', '3.4 s']]
const strengths = ['Clear explanation of project architecture', 'Relevant, on-topic answers']
const improvements = ['Go deeper on evaluation metrics', 'Reduce filler words']

const badge = (text, measured) => (
  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${measured ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-500/10 text-brand-600'}`}>{text}</span>
)

function List({ title, items }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  )
}

export default function ReportPreview() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-xs text-slate-500">Sample report</p>
          <p className="font-semibold">AI/ML · Fresher · Technical + HR</p>
        </div>
        <div className="grid size-20 shrink-0 place-items-center rounded-full" style={{ background: 'conic-gradient(#6d5ef0 281deg, #e2e8f0 0)' }}>
          <div className="grid size-16 place-items-center rounded-full bg-white text-xl font-bold">78</div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex justify-end">{badge('AI feedback')}</div>
        {scores.map(([label, value]) => <ScoreBar key={label} label={label} value={value} />)}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-semibold">Speech metrics</p>
        {badge('Measured', true)}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-3">
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <List title="Strengths" items={strengths} />
        <List title="Areas for improvement" items={improvements} />
      </div>

      <div className="mt-6 flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-4">
        <div>
          <p className="text-xs capitalize text-slate-500">Project · follow-up</p>
          <p className="text-sm font-medium">How did you measure the accuracy of your model?</p>
          <p className="mt-1 text-sm text-slate-600">Correct use of mAP. Add how you handled class imbalance.</p>
        </div>
        <span className="rounded-full bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-600">76</span>
      </div>
    </div>
  )
}