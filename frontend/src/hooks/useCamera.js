import { useEffect, useRef, useState } from 'react'

export default function useCamera() {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    let media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((result) => {
        if (!active) return result.getTracks().forEach((track) => track.stop())
        media = result
        videoRef.current.srcObject = result
        setStream(result)
      })
      .catch(() => setError('Camera and microphone access is required for the interview.'))
    return () => {
      active = false
      media?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  return { videoRef, stream, error }
}