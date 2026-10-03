import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { createInterview } from '../services/api.js'

const options = {
  field: ['AI/ML', 'Data Science', 'Web Development', 'Backend', 'Full Stack', 'General'],
  experience: ['Fresher', '1-3 years', '3+ years'],
  type: ['Technical', 'HR', 'Technical + HR'],
  difficulty: ['Easy', 'Medium', 'Hard', 'Adaptive'],
  duration: [10, 15, 20, 30],
}

const labels = {
  field: 'Field / role',
  experience: 'Experience level',
  type: 'Interview type',
  difficulty: 'Difficulty',
  duration: 'Duration',
}

export default function Setup() {
  const navigate = useNavigate()
  const [resume, setResume] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    field: 'AI/ML',
    experience: 'Fresher',
    type: 'Technical + HR',
    difficulty: 'Adaptive',
    duration: 15,
  })

  function pickResume(file) {
    if (!file) return
    if (file.type !== 'application/pdf') return setError('Only PDF files are supported.')
    if (file.size > 5 * 1024 * 1024) return setError('The file must be under 5 MB.')
    setError('')
    setResume(file)
  }

  async function start(e) {
    e.preventDefault()
    if (!resume) return setError('Please upload your resume as a PDF.')
    setError('')
    setLoading(true)
    try {
      const data = await createInterview(resume, form)
      navigate('/interview', { state: { sessionId: data.session_id, seconds: data.seconds, question: data.question } })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-6 pb-16 pt-28">
        <form onSubmit={start} className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <h1 className="text-2xl font-semibold">Set up your interview</h1>
          <p className="mt-1 text-sm text-slate-600">Upload your resume and tell us what you are preparing for.</p>

          <label className="mt-6 block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-brand-500 hover:bg-brand-500/5">
            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => pickResume(e.target.files[0])} />
            <p className="font-medium">{resume ? resume.name : 'Click to upload your resume'}</p>
            <p className="mt-1 text-sm text-slate-500">PDF only, up to 5 MB</p>
          </label>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {Object.entries(options).map(([key, values]) => (
              <label key={key} className="block text-sm font-medium text-slate-700">
                {labels[key]}
                <select
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: key === 'duration' ? Number(e.target.value) : e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                >
                  {values.map((value) => (
                    <option key={value} value={value}>{key === 'duration' ? `${value} minutes` : value}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            disabled={loading}
            className="mt-8 w-full rounded-full bg-linear-to-r from-brand-500 to-accent-500 py-3 font-medium text-white shadow-lg shadow-brand-500/30 transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Analyzing your resume…' : 'Start Interview'}
          </button>
        </form>
      </main>
    </>
  )
}