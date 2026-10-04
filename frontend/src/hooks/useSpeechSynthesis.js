import { useCallback, useEffect, useRef, useState } from 'react'

const synth = window.speechSynthesis

function pickVoice() {
  const english = synth.getVoices().filter((voice) => voice.lang.startsWith('en'))
  return english.find((voice) => /natural|google/i.test(voice.name)) ?? english[0] ?? null
}

export default function useSpeechSynthesis() {
  const current = useRef(null)
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)

  const stop = useCallback(() => {
    current.current = null
    synth?.cancel()
    setSpeaking(false)
    setPaused(false)
  }, [])

  const speak = useCallback((text, onEnd) => {
    if (!synth) return onEnd?.()
    if (synth.speaking || synth.pending) synth.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = pickVoice()
    utterance.lang = utterance.voice?.lang ?? 'en-US'
    utterance.rate = 0.95
    const finish = () => {
      if (current.current !== utterance) return
      current.current = null
      setSpeaking(false)
      onEnd?.()
    }
    utterance.onend = finish
    utterance.onerror = finish
    current.current = utterance
    setPaused(false)
    setSpeaking(true)
    synth.speak(utterance)
  }, [])

  const pause = useCallback(() => {
    if (!current.current) return
    synth.pause()
    setPaused(true)
    setSpeaking(false)
  }, [])

  const resume = useCallback(() => {
    if (!current.current) return
    synth.resume()
    setPaused(false)
    setSpeaking(true)
  }, [])

  useEffect(() => () => synth?.cancel(), [])

  return { speak, stop, pause, resume, speaking, paused }
}