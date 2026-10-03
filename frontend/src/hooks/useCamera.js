import { useEffect, useRef, useState } from 'react'

export default function useCamera() {
  const videoRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let stream
    let active = true
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((media) => {
        if (!active) return media.getTracks().forEach((track) => track.stop())
        stream = media
        videoRef.current.srcObject = media
      })
      .catch(() => setError('Camera and microphone access is required for the interview.'))
    return () => {
      active = false
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  return { videoRef, error }
}