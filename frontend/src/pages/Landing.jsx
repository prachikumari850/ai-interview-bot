import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ScoreBar from '../components/ScoreBar.jsx'

const steps = [
  ['Upload your resume', 'We extract your skills, projects and experience into a compact profile.'],
  ['Pick your role', 'Choose a field, experience level, difficulty and duration.'],
  ['Take the interview', 'Answer by voice while the AI adapts its questions to you.'],
  ['Review your report', 'Get transparent scores, measured metrics and clear next steps.'],
]

const features = [
  ['Resume-aware questions', 'Questions about your own projects, skills and experience.'],
  ['Adaptive difficulty', 'Questions get harder or easier based on how you perform.'],
  ['Smart follow-ups', 'Counter-questions that dig into your previous answers.'],
  ['Voice analysis', 'Speaking rate, pauses, filler words and response time.'],
  ['Camera observations', 'Face visibility, camera-facing ratio and head movement, processed in your browser.'],
  ['Transparent scoring', 'Category-based scores. No mystery numbers.'],
]

const capabilities = [
  ['Hybrid interview engine', 'A question bank and strict rules control the flow. The LLM personalises and evaluates.'],
  ['Structured evaluation', 'Every answer is scored on correctness, relevance, depth and clarity.'],
  ['Privacy-minded', 'Video stays in your browser. Only lightweight metrics are used.'],
]

const rounds = ['Introduction', 'Resume', 'Fundamentals', 'Projects', 'Problem solving', 'Behavioral', 'Final question']

const previewScores = [['Technical', 82], ['Communication', 74], ['Resume knowledge', 88]]

const primaryBtn = 'rounded-full bg-brand-500 px-6 py-3 font-medium text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600'
const secondaryBtn = 'rounded-full px-6 py-3 font-medium text-white ring-1 ring-white/25 transition hover:bg-white/10'
const bar = <span className="block h-1 w-8 rounded-full bg-linear-to-r from-brand-500 to-accent-500" />

function Heading({ title, text, light }) {
  return (
    <div className="mx-auto max-w-2xl px-6 text-center">
      <h2 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${light ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      <p className={`mt-3 ${light ? 'text-slate-400' : 'text-slate-600'}`}>{text}</p>
    </div>
  )
}

function InfoCard({ title, text, mark, dark }) {
  return (
    <div className={`rounded-2xl p-6 ${dark ? 'bg-white/5 ring-1 ring-white/10' : 'bg-white shadow-sm ring-1 ring-slate-200'}`}>
      {mark}
      <h3 className={`mt-4 font-semibold ${dark ? 'text-white' : ''}`}>{title}</h3>
      <p className={`mt-2 text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{text}</p>
    </div>
  )
}

function Interviewer() {
  return (
    <div className="relative mx-auto grid size-72 place-items-center">
      <div className="absolute inset-0 animate-pulse rounded-full bg-brand-500/20 blur-2xl" />
      <div className="relative grid size-44 place-items-center rounded-full bg-linear-to-br from-brand-400 to-accent-500 text-5xl font-bold shadow-2xl shadow-brand-500/40">
        AI
      </div>
      <p className="absolute inset-x-0 -bottom-10 rounded-xl bg-white/10 p-4 text-sm text-slate-200 ring-1 ring-white/15 backdrop-blur">
        “Why did you choose YOLO over other object detection models?”
      </p>
    </div>
  )
}

export default function Landing() {
  return (
    <>
      <Navbar dark />

      <section className="relative overflow-hidden bg-navy-900 pb-28 pt-32 text-white">
        <div className="absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-brand-400 ring-1 ring-white/10">AI-powered mock interviews</span>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Practice Smarter.{' '}
              <span className="bg-linear-to-r from-brand-400 to-accent-500 bg-clip-text text-transparent">Interview Better.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-400">
              Upload your resume and face an AI interviewer that asks about your own projects, challenges your answers and gives you a detailed, transparent report.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/setup" className={primaryBtn}>Start Interview</Link>
              <a href="#how" className={secondaryBtn}>How It Works</a>
            </div>
          </div>
          <Interviewer />
        </div>
      </section>

      <section id="how" className="scroll-mt-4 py-24">
        <Heading title="How it works" text="From resume to report in four simple steps." />
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text], i) => (
            <InfoCard
              key={title}
              title={title}
              text={text}
              mark={<span className="grid size-9 place-items-center rounded-full bg-brand-500/10 font-semibold text-brand-600">{i + 1}</span>}
            />
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <Heading title="Built for real preparation" text="Everything you need to practise like it's the real thing." />
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, text]) => <InfoCard key={title} title={title} text={text} mark={bar} />)}
        </div>
      </section>

      <section className="bg-navy-900 py-24">
        <Heading light title="AI capabilities" text="A structured engine with an LLM for reasoning, not a free-form chatbot." />
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          {capabilities.map(([title, text]) => <InfoCard dark key={title} title={title} text={text} mark={bar} />)}
        </div>
      </section>

      <section className="py-24">
        <Heading title="Interview process" text="Seven rounds, controlled by the interview engine." />
        <ol className="mx-auto mt-14 flex max-w-4xl flex-wrap justify-center gap-3 px-6">
          {rounds.map((round, i) => (
            <li key={round} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-slate-200">
              <span className="font-semibold text-brand-600">{i + 1}</span>
              {round}
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">A report you can trust</h2>
            <p className="mt-3 text-slate-600">
              Measured observations such as speaking rate and camera-facing ratio are kept separate from AI feedback. No guesses about emotions or personality.
            </p>
          </div>
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            {previewScores.map(([label, value]) => <ScoreBar key={label} label={label} value={value} />)}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-br from-brand-600 to-accent-500 py-20 text-center text-white">
        <h2 className="text-3xl font-semibold sm:text-4xl">Ready for your next interview?</h2>
        <p className="mt-3 text-white/80">Free, private and takes less than a minute to set up.</p>
        <Link to="/setup" className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-medium text-brand-600 transition hover:bg-slate-100">
          Start Interview
        </Link>
      </section>

      <footer className="bg-navy-900 py-8 text-center text-sm text-slate-500">AI Interview Bot · AI/ML project</footer>
    </>
  )
}