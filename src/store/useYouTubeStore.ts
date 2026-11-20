import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface YTVideoSummary {
  videoId: string
  title: string
  channelTitle: string
  thumbnail: string
  publishedAt?: string
}

export interface Mixtape {
  id: string
  name: string
  description: string
  videoIds: string[]
  createdAt: number
}

interface YouTubeState {
  favorites: YTVideoSummary[]
  mixtapes: Mixtape[]
  history: (YTVideoSummary & { watchedAt: number })[]
  searchHistory: string[]
  addFavorite: (v: YTVideoSummary) => void
  removeFavorite: (videoId: string) => void
  isFavorite: (videoId: string) => boolean
  createMixtape: (name: string, description?: string) => string
  deleteMixtape: (id: string) => void
  addToMixtape: (mixtapeId: string, v: YTVideoSummary) => void
  removeFromMixtape: (mixtapeId: string, videoId: string) => void
  addToHistory: (v: YTVideoSummary) => void
  clearHistory: () => void
  removeFromHistory: (videoId: string) => void
  addSearchHistory: (q: string) => void
}

export const useYouTubeStore = create<YouTubeState>()(
  persist(
    (set, get) => ({
      favorites: [],
      mixtapes: [],
      history: [],
      searchHistory: [],
      addFavorite: (v) => set(s => {
        if (s.favorites.some(f => f.videoId === v.videoId)) return s
        return { favorites: [v, ...s.favorites].slice(0, 200) }
      }),
      removeFavorite: (videoId) => set(s => ({ favorites: s.favorites.filter(f => f.videoId !== videoId) })),
      isFavorite: (videoId) => get().favorites.some(f => f.videoId === videoId),
      createMixtape: (name, description = '') => {
        const id = `mix-${Date.now()}`
        set(s => ({ mixtapes: [{ id, name, description, videoIds: [], createdAt: Date.now() }, ...s.mixtapes] }))
        return id
      },
      deleteMixtape: (id) => set(s => ({ mixtapes: s.mixtapes.filter(m => m.id !== id) })),
      addToMixtape: (mixtapeId, v) => set(s => ({
        mixtapes: s.mixtapes.map(m => {
          if (m.id !== mixtapeId) return m
          if (m.videoIds.includes(v.videoId)) return m
          return { ...m, videoIds: [v.videoId, ...m.videoIds] }
        })
      })),
      removeFromMixtape: (mixtapeId, videoId) => set(s => ({
        mixtapes: s.mixtapes.map(m => m.id !== mixtapeId ? m : { ...m, videoIds: m.videoIds.filter(id => id !== videoId) })
      })),
      addToHistory: (v) => set(s => {
        const filtered = s.history.filter(h => h.videoId !== v.videoId)
        return { history: [{ ...v, watchedAt: Date.now() }, ...filtered].slice(0, 100) }
      }),
      clearHistory: () => set({ history: [] }),
      removeFromHistory: (videoId) => set(s => ({ history: s.history.filter(h => h.videoId !== videoId) })),
      addSearchHistory: (q) => set(s => {
        const trimmed = q.trim()
        if (!trimmed) return s
        const filtered = s.searchHistory.filter(x => x.toLowerCase() !== trimmed.toLowerCase())
        return { searchHistory: [trimmed, ...filtered].slice(0, 20) }
      }),
    }),
    { name: 'mylife-youtube-store' }
  )
)
