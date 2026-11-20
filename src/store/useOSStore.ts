import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AppId =
  | 'buddy'
  | 'notes'
  | 'goals'
  | 'memories'
  | 'music'
  | 'browser'
  | 'explorer'
  | 'recycle'
  | 'mycomputer'
  | 'calculator'
  | 'calendar'
  | 'alarm'
  | 'youtube'

export interface WindowState {
  id: string
  appId: AppId
  title: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  zIndex: number
}

interface IconPos {
  id: AppId | 'mycomputer' | 'recycle'
  x: number
  y: number
}

interface OSState {
  windows: WindowState[]
  focusedWindowId: string | null
  nextZ: number
  startMenuOpen: boolean
  booted: boolean
  bootSkipped: boolean
  shutdown: boolean
  iconPositions: IconPos[]
  // actions
  openApp: (appId: AppId, title: string) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  toggleMaximize: (id: string) => void
  focusWindow: (id: string) => void
  moveWindow: (id: string, x: number, y: number) => void
  resizeWindow: (id: string, w: number, h: number) => void
  setStartMenuOpen: (v: boolean) => void
  setBooted: (v: boolean) => void
  setBootSkipped: (v: boolean) => void
  setShutdown: (v: boolean) => void
  setIconPos: (id: IconPos['id'], x: number, y: number) => void
  restoreWindow: (id: string) => void
}

const defaultIconPositions: IconPos[] = [
  { id: 'mycomputer', x: 20, y: 20 },
  { id: 'buddy', x: 20, y: 110 },
  { id: 'notes', x: 20, y: 200 },
  { id: 'goals', x: 20, y: 290 },
  { id: 'memories', x: 20, y: 380 },
  { id: 'music', x: 20, y: 470 },
  { id: 'browser', x: 20, y: 560 },
  { id: 'calculator', x: 20, y: 650 },
  { id: 'youtube', x: 120, y: 290 },
  { id: 'calendar', x: 120, y: 20 },
  { id: 'alarm', x: 120, y: 110 },
  { id: 'recycle', x: 120, y: 200 },
]

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      windows: [],
      focusedWindowId: null,
      nextZ: 10,
      startMenuOpen: false,
      booted: false,
      bootSkipped: false,
      shutdown: false,
      iconPositions: defaultIconPositions,
      openApp: (appId, title) => {
        const existing = get().windows.find(w => w.appId === appId && !w.minimized)
        if (existing) {
          get().focusWindow(existing.id)
          return
        }
        const minimized = get().windows.find(w => w.appId === appId && w.minimized)
        if (minimized) {
          get().restoreWindow(minimized.id)
          get().focusWindow(minimized.id)
          return
        }
        const id = `${appId}-${Date.now()}`
        const z = get().nextZ + 1
        const offset = (get().windows.length % 6) * 24
        const win: WindowState = {
          id,
          appId,
          title,
          x: 120 + offset,
          y: 60 + offset,
          width: appId === 'music' ? 380 : appId === 'buddy' ? 420 : 560,
          height: appId === 'music' ? 320 : appId === 'buddy' ? 480 : 420,
          minimized: false,
          maximized: false,
          zIndex: z,
        }
        set(s => ({ windows: [...s.windows, win], focusedWindowId: id, nextZ: z, startMenuOpen: false }))
      },
      closeWindow: (id) => set(s => ({
        windows: s.windows.filter(w => w.id !== id),
        focusedWindowId: s.focusedWindowId === id ? null : s.focusedWindowId,
      })),
      minimizeWindow: (id) => set(s => ({
        windows: s.windows.map(w => w.id === id ? { ...w, minimized: true } : w),
        focusedWindowId: s.focusedWindowId === id ? null : s.focusedWindowId,
      })),
      toggleMaximize: (id) => set(s => ({
        windows: s.windows.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w),
      })),
      focusWindow: (id) => {
        const z = get().nextZ + 1
        set(s => ({
          windows: s.windows.map(w => w.id === id ? { ...w, zIndex: z, minimized: false } : w),
          focusedWindowId: id,
          nextZ: z,
        }))
      },
      moveWindow: (id, x, y) => set(s => ({
        windows: s.windows.map(w => w.id === id ? { ...w, x, y } : w),
      })),
      resizeWindow: (id, w, h) => set(s => ({
        windows: s.windows.map(win => win.id === id ? { ...win, width: Math.max(280, w), height: Math.max(200, h) } : win),
      })),
      setStartMenuOpen: (v) => set({ startMenuOpen: v }),
      setBooted: (v) => set({ booted: v }),
      setBootSkipped: (v) => set({ bootSkipped: v }),
      setShutdown: (v) => set({ shutdown: v }),
      setIconPos: (id, x, y) => set(s => ({
        iconPositions: s.iconPositions.map(p => p.id === id ? { ...p, x, y } : p),
      })),
      restoreWindow: (id) => set(s => ({
        windows: s.windows.map(w => w.id === id ? { ...w, minimized: false } : w),
      })),
    }),
    {
      name: 'mylife-os-store',
      partialize: (state) => ({
        iconPositions: state.iconPositions,
        booted: state.booted,
        bootSkipped: state.bootSkipped,
      }),
    }
  )
)
