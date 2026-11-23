export const palettes = [
  {
    id: "warm",
    name: "Тёплая",
    description: "Бежевый фон и зелёные акценты",
    swatches: ["#f8f3ec", "#526b4c", "#efe3d4"],
  },
  {
    id: "monochrome",
    name: "Чёрно-белая",
    description: "Контрастная палитра без цвета",
    swatches: ["#f7f7f7", "#171717", "#d4d4d4"],
  },
  {
    id: "neutral",
    name: "Нейтральная",
    description: "Светлый фон и спокойные синие акценты",
    swatches: ["#f6f7f9", "#435e73", "#dce4ea"],
  },
] as const

export type PaletteId = (typeof palettes)[number]["id"]

const storageKey = "use-and-share-palette-v1"

export function getPalette(): PaletteId {
  try {
    const saved = localStorage.getItem(storageKey)
    if (palettes.some((palette) => palette.id === saved)) {
      return saved as PaletteId
    }
  } catch {
    // The browser may block local storage; the default palette still works.
  }

  return "warm"
}

export function setPalette(palette: PaletteId) {
  document.documentElement.dataset.palette = palette

  try {
    localStorage.setItem(storageKey, palette)
  } catch {
    // Keep the selected palette for this page even if storage is unavailable.
  }
}

export function applySavedPalette() {
  document.documentElement.dataset.palette = getPalette()
}
