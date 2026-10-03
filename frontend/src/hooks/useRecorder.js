import { useRef } from 'react'

export default function useRecorder(stream) {
  const recorder = useRef(null)
  const chunks = useRef([])
  const startedAt = useRef(0)

  function start() {
    chunks.current = []
    recorder.current = new MediaRecorder(new MediaStream(stream.getAudioTracks()))
    recorder.current.ondataavailable = (event) => chunks.current.push(event.data)
    recorder.current.start()
    startedAt.current = Date.now()
  }

  function stop() {
    return new Promise((resolve) => {
      recorder.current.onstop = () =>
        resolve({
          blob: new Blob(chunks.current, { type: recorder.current.mimeType }),
          duration: (Date.now() - startedAt.current) / 1000,
        })
      recorder.current.stop()
    })
  }

  return { start, stop }
}