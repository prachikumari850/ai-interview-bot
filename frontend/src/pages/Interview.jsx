import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AIInterviewerAvatar from '../components/AIInterviewerAvatar.jsx'
import useCamera from '../hooks/useCamera.js'
import useFaceMetrics from '../hooks/useFaceMetrics.js'
import useRecorder from '../hooks/useRecorder.js'
import useSpeechSynthesis from '../hooks/useSpeechSynthesis.js'
import { finishInterview, nextQuestion, sendAnswer } from '../services/api.js'

const GREETING = "Hello, I'm your AI interviewer. Let's begin."
const CLOSING = "Thank you. That concludes the interview. I'm preparing your report now."

const statusText = {
  idle: 'Your turn. Press "Start answer" when you are ready.',
  listening: 'Listening to your answer…',
  analyzing: 'Analyzing your response…',
  preparing: 'Preparing your next question…',
  finishing: 'Generating your report…',
}

const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

const buttonBase = 'rounded-full px-6 py-3 font-medium transition disabled:opacity-50'

function Session({ sessionId, seconds: total, question: firstQuestion, type }) {
  const navigate = useNavigate()
  const { videoRef, stream, error: cameraError } = useCamera()
  const getMetrics = useFaceMetrics(videoRef, stream)
  const recorder = useRecorder(stream)
  const { speak, stop, pause, resume, speaking, paused } = useSpeechSynthesis()
  const [question, setQuestion] = useState(firstQuestion)
  const [started, setStarted] = useState(false)
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

  let avatarState = 'listening'
  if (!started) avatarState = 'idle'
  else if (speaking) avatarState = 'speaking'
  else if (status === 'finishing') avatarState = 'completed'
  else if (busy) avatarState = 'processing'

  let label = statusText[status]
  if (!started) label = 'Ready when you are'
  else if (speaking) label = 'Speaking…'
  else if (paused) label = 'Voice paused'

  useEffect(() => {
    const id = setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!started) return
    shownAt.current = Date.now()
    const text = question.number === 1 ? `${GREETING} ${question.text}` : question.text
    speak(text, () => {
      shownAt.current = Date.now()
    })
  }, [started, question, speak])

  async function finish() {
    setError('')
    setStatus('finishing')
    speak(CLOSING)
    try {
      await finishInterview(sessionId, getMetrics())
      navigate(`/report/${sessionId}`, { replace: true })
    } catch (err) {
      stop()
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
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setRetry(() => loadNext)
      setStatus('idle')
    }
  }

  function startAnswer() {
    setError('')
    stop()
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
    <main className="flex min-h-screen flex-col bg-navy-900 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <span className="font-semibold">AI Interview Bot</span>
        {started && <span className="text-sm text-slate-400">Question {question.number}</span>}
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 p-4 sm:p-6 lg:grid-cols-5">
        <section className="flex flex-col items-center rounded-3xl bg-linear-to-b from-navy-800 to-navy-900 p-6 ring-1 ring-white/10 lg:col-span-3">
          <div className="text-center">
            <p className="font-semibold">AI Interviewer</p>
            <p className="text-sm text-slate-400">{type} Interview</p>
          </div>

          <AIInterviewerAvatar state={avatarState} label={label} className="my-4" />

          <div className="w-full max-w-2xl rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            {started ? (
              <>
                <p className="text-xs capitalize text-slate-400">
                  {question.round}
                  {question.kind === 'followup' ? ' · follow-up' : ''}
                </p>
                <p className="mt-1 text-lg font-medium leading-snug sm:text-xl">{question.text}</p>
                <div className="mt-3 flex gap-4 text-sm text-slate-400">
                  {(speaking || paused) && (
                    <button onClick={paused ? resume : pause} className="hover:text-white">
                      {paused ? 'Resume voice' : 'Pause voice'}
                    </button>
                  )}
                  <button onClick={() => speak(question.text)} disabled={busy || listening} className="hover:text-white disabled:opacity-40">
                    Replay question
                  </button>
                </div>
              </>
            ) : (
              <p className="text-slate-400">
                Check that your camera and microphone work, then press "Begin interview". The interviewer will ask every question aloud.
              </p>
            )}
            {remaining === 0 && (
              <p className="mt-4 text-sm text-amber-300">Time is up. Answer this last question or end the interview.</p>
            )}
          </div>
        </section>

        <aside className="space-y-4 lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy-800 ring-1 ring-white/10">
            <video ref={videoRef} autoPlay muted playsInline className="size-full -scale-x-100 object-cover" />
            {cameraError && <p className="absolute inset-0 grid place-items-center p-6 text-center text-slate-300">{cameraError}</p>}
            <span className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs">
              <span className={`size-2 rounded-full ${listening ? 'animate-pulse bg-red-500' : 'bg-slate-500'}`} />
              {listening ? 'Recording' : 'Not recording'}
            </span>
            <span className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs">
              <span className={`size-2 rounded-full ${stream ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              {stream ? 'Microphone on' : 'Microphone off'}
            </span>
          </div>

          <div className="rounded-2xl bg-navy-800 p-5 ring-1 ring-white/10">
            <div className="flex items-end justify-between">
              <span className="text-sm text-slate-400">Time remaining</span>
              <span className="font-mono text-2xl">{formatTime(remaining)}</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-linear-to-r from-brand-500 to-accent-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </aside>
      </div>

      <footer className="sticky bottom-0 border-t border-white/10 bg-navy-900/90 px-6 py-4 backdrop-blur">
        {error && <p className="mb-3 text-center text-sm text-red-300">{error}</p>}
        <div className="flex flex-wrap justify-center gap-4">
          {!started ? (
            <button onClick={() => setStarted(true)} disabled={!stream} className={`${buttonBase} bg-brand-500 hover:bg-brand-600`}>
              Begin interview
            </button>
          ) : (
            <>
              {retry ? (
                <button onClick={retry} className={`${buttonBase} bg-brand-500 hover:bg-brand-600`}>
                  Try again
                </button>
              ) : (
                <button
                  onClick={listening ? stopAnswer : startAnswer}
                  disabled={busy || !stream}
                  className={`${buttonBase} bg-brand-500 hover:bg-brand-600`}
                >
                  {listening ? 'Stop & submit answer' : 'Start answer'}
                </button>
              )}
              <button onClick={finish} disabled={busy || listening} className={`${buttonBase} ring-1 ring-white/25 hover:bg-white/10`}>
                End interview
              </button>
            </>
          )}
        </div>
      </footer>
    </main>
  )
}

export default function Interview() {
  const { state } = useLocation()
  return state ? <Session {...state} /> : <Navigate to="/setup" replace />
}