import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  title: string
  content: string
  updatedAt: number
}

export interface Goal {
  id: string
  title: string
  deadline: string
  category: 'Learning' | 'Career' | 'Health' | 'Personal'
  completed: boolean
  progress: number // 0-100
}

export interface Memory {
  id: string
  title: string
  description: string
  date: string
  imageDataUrl?: string
}

export interface RecycleItem {
  id: string
  kind: 'note' | 'goal'
  data: Note | Goal
  deletedAt: number
}

interface DataState {
  notes: Note[]
  goals: Goal[]
  memories: Memory[]
  recycle: RecycleItem[]
  // notes
  addNote: (n: Omit<Note, 'id' | 'updatedAt'>) => string
  updateNote: (id: string, patch: Partial<Pick<Note, 'title' | 'content'>>) => void
  deleteNote: (id: string) => void
  // goals
  addGoal: (g: Omit<Goal, 'id'>) => void
  updateGoal: (id: string, patch: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  // memories
  addMemory: (m: Omit<Memory, 'id'>) => void
  deleteMemory: (id: string) => void
  // recycle
  restoreFromRecycle: (id: string) => void
  permanentlyDelete: (id: string) => void
  emptyRecycle: () => void
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      notes: [],
      goals: [],
      memories: [],
      recycle: [],
      addNote: (n) => {
        const id = `note-${Date.now()}`
        set(s => ({ notes: [{ ...n, id, updatedAt: Date.now() }, ...s.notes] }))
        return id
      },
      updateNote: (id, patch) => set(s => ({
        notes: s.notes.map(n => n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)
      })),
      deleteNote: (id) => set(s => {
        const note = s.notes.find(n => n.id === id)
        if (!note) return s
        return {
          notes: s.notes.filter(n => n.id !== id),
          recycle: [{ id: `rc-${Date.now()}`, kind: 'note', data: note, deletedAt: Date.now() }, ...s.recycle]
        }
      }),
      addGoal: (g) => set(s => ({ goals: [{ ...g, id: `goal-${Date.now()}` }, ...s.goals] })),
      updateGoal: (id, patch) => set(s => ({
        goals: s.goals.map(g => g.id === id ? { ...g, ...patch } : g)
      })),
      deleteGoal: (id) => set(s => {
        const goal = s.goals.find(g => g.id === id)
        if (!goal) return s
        return {
          goals: s.goals.filter(g => g.id !== id),
          recycle: [{ id: `rc-${Date.now()}`, kind: 'goal', data: goal, deletedAt: Date.now() }, ...s.recycle]
        }
      }),
      addMemory: (m) => set(s => ({ memories: [{ ...m, id: `mem-${Date.now()}` }, ...s.memories] })),
      deleteMemory: (id) => set(s => ({ memories: s.memories.filter(m => m.id !== id) })),
      restoreFromRecycle: (id) => set(s => {
        const item = s.recycle.find(r => r.id === id)
        if (!item) return s
        if (item.kind === 'note') {
          return { recycle: s.recycle.filter(r => r.id !== id), notes: [item.data as Note, ...s.notes] }
        }
        return { recycle: s.recycle.filter(r => r.id !== id), goals: [item.data as Goal, ...s.goals] }
      }),
      permanentlyDelete: (id) => set(s => ({ recycle: s.recycle.filter(r => r.id !== id) })),
      emptyRecycle: () => set({ recycle: [] }),
    }),
    { name: 'mylife-data-store' }
  )
)
