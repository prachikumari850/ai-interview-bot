import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import useCamera from '../hooks/useCamera.js'
import useFaceMetrics from '../hooks/useFaceMetrics.js'
import useRecorder from '../hooks/useRecorder.js'
import { finishInterview, nextQuestion, sendAnswer } from '../services/api.js'

const statusText = {
  idle: 'Press "Start answer" when you are ready.',
  listening: 'Listening…',
  analyzing: 'Analyzing your response…',
  preparing: 'Preparing your next question…',
  finishing: 'Generating your report…',
}

const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

function Session({ sessionId, seconds: total, question: firstQuestion }) {
  const navigate = useNavigate()
  const { videoRef, stream, error: cameraError } = useCamera()
  const getMetrics = useFaceMetrics(videoRef, stream)
  const recorder = useRecorder(stream)
  const [question, setQuestion] = useState(firstQuestion)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const shownAt = useRef(Date.now())
  const responseTime = useRef(0)

  const listening = status === 'listening'
  const busy = ['analyzing', 'preparing', 'finishing'].includes(status)
  const remaining = Math.max(total - elapsed, 0)
  const progress = Math.min((elapsed / total) * 100, 100)

  useEffect(() => {
    const id = setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => clearInterval(id)
  }, [])

  async function finish() {
    setError('')
    setStatus('finishing')
    try {
      await finishInterview(sessionId, getMetrics())
      navigate(`/report/${sessionId}`, { replace: true })
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  async function loadNext() {
    setRetry(null)
    setError('')
    setStatus('preparing')
    try {
      const { finished, question: next } = await nextQuestion(sessionId)
      if (finished) return await finish()
      setQuestion(next)
      shownAt.current = Date.now()
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setRetry(() => loadNext)
      setStatus('idle')
    }
  }

  function startAnswer() {
    setError('')
    responseTime.current = (Date.now() - shownAt.current) / 1000
    recorder.start()
    setStatus('listening')
  }

  async function stopAnswer() {
    const { blob, duration } = await recorder.stop()
    setStatus('analyzing')
    try {
      await sendAnswer(sessionId, blob, duration, responseTime.current)
    } catch (err) {
      setError(err.message)
      setStatus('idle')
      return
    }
    await loadNext()
  }

  return (
    <main className="min-h-screen bg-navy-900 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <span className="font-semibold">AI Interview Bot</span>
        <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-sm">{formatTime(remaining)}</span>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy-800 ring-1 ring-white/10">
            <video ref={videoRef} autoPlay muted playsInline className="size-full -scale-x-100 object-cover" />
            {cameraError && <p className="absolute inset-0 grid place-items-center p-6 text-center text-slate-300">{cameraError}</p>}
            <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs">
              <span className={`size-2 rounded-full ${listening ? 'animate-pulse bg-red-500' : 'bg-slate-500'}`} />
              {listening ? 'Recording' : 'Microphone ready'}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {retry ? (
              <button onClick={retry} className="rounded-full bg-brand-500 px-6 py-3 font-medium transition hover:bg-brand-600">
                Try again
              </button>
            ) : (
              <button
                onClick={listening ? stopAnswer : startAnswer}
                disabled={busy || !stream}
                className="rounded-full bg-brand-500 px-6 py-3 font-medium transition hover:bg-brand-600 disabled:opacity-50"
              >
                {listening ? 'Stop answer' : 'Start answer'}
              </button>
            )}
            <button
              onClick={finish}
              disabled={busy || listening}
              className="rounded-full px-6 py-3 font-medium ring-1 ring-white/25 transition hover:bg-white/10 disabled:opacity-50"
            >
              End interview
            </button>
          </div>
          {error && <p className="mt-4 text-center text-sm text-red-300">{error}</p>}
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
            <p className="mt-6 text-sm capitalize text-slate-400">
              Question {question.number} · {question.round}{question.kind === 'followup' ? ' · follow-up' : ''}
            </p>
            <p className="mt-1 text-xl font-medium leading-snug">{question.text}</p>
            {remaining === 0 && (
              <p className="mt-4 text-sm text-amber-300">Time is up. Answer this last question or end the interview.</p>
            )}
          </div>

          <div className="rounded-2xl bg-navy-800 p-6 ring-1 ring-white/10">
            <div className="mb-2 flex justify-between text-sm text-slate-400">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-linear-to-r from-brand-500 to-accent-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default function Interview() {
  const { state } = useLocation()
  return state ? <Session {...state} /> : <Navigate to="/setup" replace />
}