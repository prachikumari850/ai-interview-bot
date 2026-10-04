import { useId } from 'react'
import Icon from './Icon.jsx'

const LABELS = {
  idle: 'Ready when you are',
  speaking: 'Speaking…',
  listening: 'Listening…',
  processing: 'Analyzing response…',
  completed: 'Interview complete',
}

const DOTS = {
  idle: 'bg-slate-500',
  speaking: 'animate-pulse bg-brand-400',
  listening: 'animate-pulse bg-emerald-400',
  processing: 'animate-pulse bg-amber-400',
  completed: 'bg-emerald-400',
}

const BADGES = {
  listening: 'M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3zM19 11v1a7 7 0 01-14 0v-1M12 19v3',
  completed: 'M5 13l4 4L19 7',
}

export default function AIInterviewerAvatar({ state = 'idle', label = LABELS[state], className = '' }) {
  const id = useId()
  return (
    <div className={`avatar flex flex-col items-center ${className}`} data-state={state}>
      <div className="relative grid size-56 place-items-center sm:size-64">
        <span className="avatar-glow absolute inset-0 rounded-full" />
        <span className="avatar-ring absolute inset-5 rounded-full" />
        <span className="avatar-spinner absolute inset-3 rounded-full" />
        <svg viewBox="0 0 200 200" className="avatar-body relative size-44 sm:size-52" role="img" aria-label="AI interviewer">
          <defs>
            <linearGradient id={`${id}-suit`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2a3566" />
              <stop offset="1" stopColor="#111833" />
            </linearGradient>
            <linearGradient id={`${id}-head`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f1f3ff" />
              <stop offset="1" stopColor="#aeb8f5" />
            </linearGradient>
            <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8b7cf6" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path d="M16 200c0-40 34-60 84-60s84 20 84 60z" fill={`url(#${id}-suit)`} />
          <path d="M80 142l20 38 20-38z" fill="#e8ecff" />
          <path d="M94 150h12l4 36-10 8-10-8z" fill={`url(#${id}-accent)`} />
          <path d="M80 142l-14 30 26 22M120 142l14 30-26 22" fill="none" stroke="#3d4a85" strokeWidth="2" />
          <rect x="88" y="118" width="24" height="28" rx="10" fill="#9aa6ec" />
          <g className="avatar-head">
            <rect x="54" y="36" width="92" height="94" rx="44" fill={`url(#${id}-head)`} />
            <path d="M50 92C50 24 150 24 150 92" fill="none" stroke={`url(#${id}-accent)`} strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="90" r="9" fill="#6d5ef0" />
            <circle cx="150" cy="90" r="9" fill="#6d5ef0" />
            <path d="M44 96c0 22 18 30 40 24" fill="none" stroke="#6d5ef0" strokeWidth="3" strokeLinecap="round" />
            <circle cx="84" cy="120" r="4" fill="#6d5ef0" />
            <rect x="64" y="62" width="72" height="36" rx="18" fill="#0f1735" />
            <ellipse className="avatar-eye" cx="84" cy="80" rx="6" ry="7" fill="#7dd3fc" />
            <ellipse className="avatar-eye" cx="116" cy="80" rx="6" ry="7" fill="#7dd3fc" />
            <rect className="avatar-mouth" x="88" y="108" width="24" height="6" rx="3" fill="#4f46e5" />
          </g>
        </svg>
        {BADGES[state] && (
          <span className="absolute bottom-4 right-6 grid size-9 place-items-center rounded-full bg-emerald-500 text-white ring-4 ring-navy-900">
            <Icon path={BADGES[state]} className="size-4" />
          </span>
        )}
      </div>

      <div className="avatar-bars mt-2 flex h-8 items-center gap-1" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className="h-full w-1 rounded-full bg-linear-to-t from-brand-500 to-accent-500" style={{ animationDelay: `${i * 0.09}s` }} />
        ))}
      </div>

      <p className="mt-2 flex items-center gap-2 text-sm text-slate-300" aria-live="polite">
        <span className={`size-2 rounded-full ${DOTS[state]}`} />
        {label}
      </p>
    </div>
  )
}