import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useCamera from '../hooks/useCamera.js'

const statusText = {
  idle: 'Press "Start answer" when you are ready.',
  listening: 'Listening…',
  analyzing: 'Analyzing your response…',
  preparing: 'Preparing your next question…',
}

const question = 'Tell me about yourself and what drew you to this field.'

const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function Interview() {
  const { duration = 15 } = useLocation().state ?? {}
  const navigate = useNavigate()
  const { videoRef, error } = useCamera()
  const [status, setStatus] = useState('idle')
  const [questionNumber, setQuestionNumber] = useState(1)
  const [seconds, setSeconds] = useState(0)

  const total = duration * 60
  const listening = status === 'listening'
  const busy = status === 'analyzing' || status === 'preparing'

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (seconds >= total) navigate('/report')
  }, [seconds, total, navigate])

  function toggleAnswer() {
    if (status === 'idle') return setStatus('listening')
    setStatus('analyzing')
    setTimeout(() => setStatus('preparing'), 1500)
    setTimeout(() => {
      setQuestionNumber((n) => n + 1)
      setStatus('idle')
    }, 3000)
  }

  return (
    <main className="min-h-screen bg-navy-900 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <span className="font-semibold">AI Interview Bot</span>
        <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-sm">{formatTime(Math.max(total - seconds, 0))}</span>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy-800 ring-1 ring-white/10">
            <video ref={videoRef} autoPlay muted playsInline className="size-full -scale-x-100 object-cover" />
            {error && <p className="absolute inset-0 grid place-items-center p-6 text-center text-slate-300">{error}</p>}
            <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs">
              <span className={`size-2 rounded-full ${listening ? 'animate-pulse bg-red-500' : 'bg-slate-500'}`} />
              {listening ? 'Recording' : 'Microphone ready'}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={toggleAnswer}
              disabled={busy}
              className="rounded-full bg-brand-500 px-6 py-3 font-medium transition hover:bg-brand-600 disabled:opacity-50"
            >
              {listening ? 'Stop answer' : 'Start answer'}
            </button>
            <button onClick={() => navigate('/report')} className="rounded-full px-6 py-3 font-medium ring-1 ring-white/25 transition hover:bg-white/10">
              End interview
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-navy-800 p-6 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <div className={`grid size-12 place-items-center rounded-full bg-linear-to-br from-brand-400 to-accent-500 font-bold ${busy ? 'animate-pulse' : ''}`}>
                AI
              </div>
              <div>
                <p className="font-medium">AI Interviewer</p>
                <p className="text-sm text-slate-400">{statusText[status]}</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-400">Question {questionNumber}</p>
            <p className="mt-1 text-xl font-medium leading-snug">{question}</p>
          </div>

          <div className="rounded-2xl bg-navy-800 p-6 ring-1 ring-white/10">
            <div className="mb-2 flex justify-between text-sm text-slate-400">
              <span>Progress</span>
              <span>{Math.round(Math.min((seconds / total) * 100, 100))}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-linear-to-r from-brand-500 to-accent-500" style={{ width: `${Math.min((seconds / total) * 100, 100)}%` }} />
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}