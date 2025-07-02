import type { TokenCategory } from "@/types/game"

// Utility to get a pastel background color for a given token category
export function getPastelBgForCategory(category: TokenCategory) {
  switch (category) {
    case "blue":
      return "#e3f0ff"; // pastel blue
    case "green":
      return "#e6faea"; // pastel green
    case "orange":
      return "#fff4e3"; // pastel orange
    case "purple":
      return "#f3e6fa"; // pastel purple
    case "red":
      return "#ffeaea"; // pastel red
    case "cyan":
      return "#e6fafd"; // pastel cyan
    case "gray":
      return "#f3f4f6"; // pastel gray
    default:
      return "#f3f4f6"; // fallback gray
  }
}
