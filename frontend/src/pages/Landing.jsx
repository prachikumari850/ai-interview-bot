import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import AIInterviewerAvatar from '../components/AIInterviewerAvatar.jsx'
import Icon from '../components/Icon.jsx'
import Navbar from '../components/Navbar.jsx'
import ReportPreview from '../components/ReportPreview.jsx'

const icon = {
  upload: 'M12 16V4m0 0L8 8m4-4 4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3',
  list: 'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2',
  mic: 'M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3zM19 11v1a7 7 0 01-14 0v-1M12 19v3',
  chart: 'M4 20h16M7 20v-7M12 20V6M17 20v-10',
  file: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  chat: 'M21 12a8 8 0 01-11.6 7.1L4 20l1-4.4A8 8 0 1121 12z',
  wave: 'M3 12h4l3-8 4 16 3-8h4',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  spark: 'M12 3l2.1 5.9L20 11l-5.9 2.1L12 19l-2.1-5.9L4 11l5.9-2.1z',
  sliders: 'M4 7h9M17 7h3M4 17h3M11 17h9M13 5v4M7 15v4',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  chevron: 'M9 6l6 6-6 6',
  check: 'M5 13l4 4L19 7',
}

const pills = ['Voice interview', 'Resume-aware', 'Adaptive difficulty', 'Video stays in your browser']

const steps = [
  ['Upload Resume', 'We turn your resume into a compact profile.', icon.upload],
  ['Choose Interview', 'Pick your field, level, difficulty and duration.', icon.list],
  ['Talk to AI Interviewer', 'Questions are spoken aloud and you answer with your voice.', icon.mic],
  ['Get Detailed Report', 'Scores, measured speech metrics and clear next steps.', icon.chart],
]

const features = [
  ['Resume-Aware Questions', 'AI understands your resume and asks relevant questions.', icon.file],
  ['Voice-Based Interview', 'The AI interviewer speaks questions and listens to your answers.', icon.mic, true],
  ['Adaptive Difficulty', 'Questions adjust based on your performance.', icon.trend],
  ['Dynamic Follow-Ups', 'The interviewer can ask follow-up questions based on your response.', icon.chat],
  ['Speech Analysis', 'Analyze response time, speaking rate, pauses and filler words.', icon.wave],
  ['Interview Report', 'Get a detailed performance report after the interview.', icon.chart],
  ['Camera Insights', 'Observable head and face metrics, without unsupported psychological claims.', icon.eye],
]

const voicePoints = [
  'The AI asks every question aloud',
  'You answer naturally, in your own words',
  'The AI listens and transcribes your response',
  'Questions adapt to how you are doing',
  'Follow-ups dig into your answers',
  'You get detailed feedback afterwards',
]

const flow = [
  ['Candidate Answer', 'You answer out loud.', icon.mic],
  ['AI Evaluation', 'Scored on correctness, depth and clarity.', icon.spark],
  ['Difficulty Adjustment', 'Easier or harder questions based on how you do.', icon.sliders],
  ['Next Question', 'Picked from the question bank or written from your resume.', icon.arrow],
  ['Follow-Up', 'Probes details in your answer, up to two per question.', icon.chat],
]

const primaryBtn = 'rounded-full bg-brand-500 px-6 py-3 font-medium text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600'
const secondaryBtn = 'rounded-full px-6 py-3 font-medium text-white ring-1 ring-white/25 transition hover:bg-white/10'

function Heading({ title, text, light }) {
  return (
    <div className="mx-auto max-w-2xl px-6 text-center">
      <h2 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${light ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      <p className={`mt-3 ${light ? 'text-slate-400' : 'text-slate-600'}`}>{text}</p>
    </div>
  )
}

function IconChip({ path, light }) {
  return (
    <span
      className={`grid size-11 place-items-center rounded-xl transition group-hover:scale-110 ${light ? 'bg-white/15 text-white' : 'bg-brand-500/10 text-brand-600'}`}
    >
      <Icon path={path} />
    </span>
  )
}

function Bubble({ who, text, tag }) {
  const ai = who === 'AI'
  return (
    <div className={`flex ${ai ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${ai ? 'bg-white/10 text-slate-200' : 'bg-brand-500 text-white'}`}>
        <p className="mb-1 text-xs opacity-70">{tag ? `${who} · ${tag}` : who}</p>
        {text}
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 pb-24 pt-32 text-white">
      <div className="absolute -top-40 left-1/4 size-[560px] rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute -bottom-40 right-0 size-[420px] rounded-full bg-accent-500/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        <div className="fade-up">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-brand-400 ring-1 ring-white/10">AI-powered voice interviews</span>
          <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Practice Smarter.{' '}
            <span className="bg-linear-to-r from-brand-400 to-accent-500 bg-clip-text text-transparent">Interview Better.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-slate-400">
            An AI-powered interview simulator that asks personalized questions, listens to your answers, adapts to your performance, and gives you actionable feedback.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/setup" className={primaryBtn}>Start Interview</Link>
            <a href="#how" className={secondaryBtn}>How It Works</a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2 text-xs text-slate-300">
            {pills.map((pill) => <li key={pill} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">{pill}</li>)}
          </ul>
        </div>

        <div className="fade-up rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">AI Interviewer</p>
              <p className="text-xs text-slate-400">Technical Interview</p>
            </div>
            <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs text-brand-400">Live preview</span>
          </div>
          <AIInterviewerAvatar state="speaking" className="my-2" />
          <p className="rounded-2xl bg-white/10 p-4 text-sm text-slate-200 ring-1 ring-white/10">
            “I see you used YOLOv8 in your helmet detection project. Why did you choose it over other object detection models?”
          </p>
        </div>
      </div>
    </section>
  )
}

export default function Landing() {
  return (
    <>
      <Navbar dark />
      <Hero />

      <section id="how" className="scroll-mt-4 py-24">
        <Heading title="How it works" text="From resume to report in four simple steps." />
        <ol className="mx-auto mt-14 grid max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text, path], i) => (
            <li key={title} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <IconChip path={path} />
                <span className="text-3xl font-bold text-slate-200">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-slate-50 py-24">
        <Heading title="Built for real preparation" text="Everything you need to practise like it's the real thing." />
        <div className="mx-auto mt-14 grid max-w-6xl grid-flow-dense gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, text, path, featured]) => (
            <div
              key={title}
              className={`group rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-lg ${
                featured ? 'bg-linear-to-br from-brand-600 to-accent-500 text-white shadow-lg sm:col-span-2' : 'bg-white shadow-sm ring-1 ring-slate-200'
              }`}
            >
              <IconChip path={path} light={featured} />
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className={`mt-2 text-sm ${featured ? 'text-white/80' : 'text-slate-600'}`}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy-900 py-24 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">It feels like a real interview.</h2>
            <p className="mt-3 text-slate-400">
              Skip the typing. Your interviewer talks to you, hears your answers and reacts to them, just like the real thing.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {voicePoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/20 text-brand-400">
                    <Icon path={icon.check} className="size-3" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <AIInterviewerAvatar state="listening" />
            <div className="mt-4 space-y-3">
              <Bubble who="AI" text="Tell me about your helmet detection project." />
              <Bubble who="You" text="I trained YOLOv8 on a custom dataset of construction-site images." />
              <Bubble who="AI" tag="Follow-up" text="How did you measure its accuracy?" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <Heading title="An interview that adapts" text="Not a fixed list of questions. Every answer shapes what comes next." />
        <ol className="mx-auto mt-14 flex max-w-6xl flex-col gap-3 px-6 lg:flex-row lg:items-stretch">
          {flow.map(([title, text, path], i) => (
            <Fragment key={title}>
              {i > 0 && (
                <li aria-hidden="true" className="grid place-items-center text-brand-500">
                  <Icon path={icon.chevron} className="size-6 rotate-90 lg:rotate-0" />
                </li>
              )}
              <li className="group flex-1 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
                <IconChip path={path} />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </li>
            </Fragment>
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
          <ReportPreview />
        </div>
      </section>

      <section className="bg-linear-to-br from-brand-600 to-accent-500 px-6 py-20 text-center text-white">
        <h2 className="text-3xl font-semibold sm:text-4xl">Ready to practice your next interview?</h2>
        <p className="mt-3 text-white/80">Turn your resume into a personalized AI interview experience.</p>
        <Link to="/setup" className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-medium text-brand-600 transition hover:bg-slate-100">
          Start Your Interview
        </Link>
      </section>

      <footer className="bg-navy-900 py-8 text-center text-sm text-slate-500">AI Interview Bot · AI/ML project</footer>
    </>
  )
}