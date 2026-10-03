import { Link } from 'react-router-dom'

export default function Navbar({ dark = false }) {
  return (
    <header className={`absolute inset-x-0 top-0 z-10 ${dark ? 'text-white' : 'text-slate-900'}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
            AI
          </span>
          Interview Bot
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <a href="/#how" className="hidden opacity-80 hover:opacity-100 sm:block">
            How it works
          </a>
          <Link to="/setup" className="rounded-full bg-brand-500 px-4 py-2 font-medium text-white transition hover:bg-brand-600">
            Start Interview
          </Link>
        </div>
      </nav>
    </header>
  )
}