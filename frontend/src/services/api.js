const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

async function request(path, options) {
  let response
  try {
    response = await fetch(`${BASE}${path}`, options)
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(typeof data?.detail === 'string' ? data.detail : 'Something went wrong. Please try again.')
  }
  return data
}

export function createInterview(resume, config) {
  const form = new FormData()
  form.append('resume', resume)
  Object.entries(config).forEach(([key, value]) => form.append(key, value))
  return request('/sessions', { method: 'POST', body: form })
}

export function sendAnswer(id, audio, duration, responseTime) {
  const extension = audio.type.split('/')[1].split(';')[0]
  const form = new FormData()
  form.append('audio', audio, `answer.${extension}`)
  form.append('duration', duration)
  form.append('response_time', responseTime)
  return request(`/sessions/${id}/answer`, { method: 'POST', body: form })
}

export const nextQuestion = (id) => request(`/sessions/${id}/next`, { method: 'POST' })

export const finishInterview = (id, visual) =>
  request(`/sessions/${id}/finish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visual }),
  })

export const getReport = (id) => request(`/sessions/${id}/report`)