import { useEffect, useRef } from 'react'

const CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21'
const MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
const SAMPLE_MS = 200
const TURN_LIMIT = 0.15
const MOVE_LIMIT = 0.05

export default function useFaceMetrics(videoRef, stream) {
  const stats = useRef(null)

  useEffect(() => {
    if (!stream) return
    const s = { frames: 0, faces: 0, facing: 0, awayEvents: 0, moveEvents: 0, wasFacing: true, moving: false, last: null }
    stats.current = s
    let landmarker
    let timer
    let cancelled = false

    function sample() {
      const video = videoRef.current
      if (!video || video.readyState < 2) return
      const [face] = landmarker.detectForVideo(video, performance.now()).faceLandmarks
      s.frames += 1
      if (!face) {
        s.last = null
        s.moving = false
        return
      }
      s.faces += 1
      const nose = face[1]
      const width = face[454].x - face[234].x
      const facing = Math.abs((nose.x - face[234].x) / width - 0.5) < TURN_LIMIT
      if (facing) s.facing += 1
      if (s.wasFacing && !facing) s.awayEvents += 1
      s.wasFacing = facing
      if (s.last) {
        const moved = Math.hypot(nose.x - s.last.x, nose.y - s.last.y) / Math.abs(width) > MOVE_LIMIT
        if (moved && !s.moving) s.moveEvents += 1
        s.moving = moved
      }
      s.last = { x: nose.x, y: nose.y }
    }

    import(/* @vite-ignore */ `${CDN}/vision_bundle.mjs`)
      .then(async ({ FilesetResolver, FaceLandmarker }) => {
        const fileset = await FilesetResolver.forVisionTasks(`${CDN}/wasm`)
        return FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL },
          runningMode: 'VIDEO',
          numFaces: 1,
        })
      })
      .then((instance) => {
        if (cancelled) return instance.close()
        landmarker = instance
        timer = setInterval(sample, SAMPLE_MS)
      })
      .catch((err) => console.warn('Face tracking unavailable:', err))

    return () => {
      cancelled = true
      clearInterval(timer)
      landmarker?.close()
    }
  }, [stream, videoRef])

  return () => {
    const s = stats.current
    if (!s?.frames) return null
    const minutes = (s.frames * SAMPLE_MS) / 60000
    return {
      face_visibility: (s.faces / s.frames) * 100,
      camera_facing: s.faces ? (s.facing / s.faces) * 100 : 0,
      look_aways_per_min: s.awayEvents / minutes,
      head_moves_per_min: s.moveEvents / minutes,
    }
  }
}