import { useRef, useEffect } from "react"

export function useSound(url: string, volume = 1) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    console.log("useSound: Creating new Audio", url, volume)
    audioRef.current = new Audio(url)
    audioRef.current.volume = volume
    return () => {
      console.log("useSound: Cleaning up Audio")
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [url, volume])

  function play() {
    console.log("useSound: play called", audioRef.current)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      const playPromise = audioRef.current.play()
      if (playPromise && playPromise.catch) {
        playPromise.catch((e) => console.error("useSound: play error", e))
      }
    } else {
      console.warn("useSound: No audioRef.current to play")
    }
  }

  return play
}
