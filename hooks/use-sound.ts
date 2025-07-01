import { useRef } from "react"

export function useSound(url: string, volume = 1) {
  function play() {
    const audio = new Audio(url)
    audio.volume = volume
    audio.currentTime = 0
    audio.play()
  }
  return play
}
