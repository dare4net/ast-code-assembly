import { useRef } from "react"

export function useSound(url: string, volume = 1) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function play() {
    if (!audioRef.current) {
      audioRef.current = new Audio(url)
      audioRef.current.volume = volume
    }
    // Restart sound if already playing
    audioRef.current.currentTime = 0
    audioRef.current.play()
  }

  return play
}
