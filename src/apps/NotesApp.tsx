import { useState, useEffect } from 'react'
import { useDataStore } from '../store/useDataStore'

export default function NotesApp() {
  const { notes, addNote, updateNote, deleteNote } = useDataStore()
  const [selectedId, setSelectedId] = useState<string | null>(notes[0]?.id || null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [savedHint, setSavedHint] = useState('')

  useEffect(() => {
    const n = notes.find(x => x.id === selectedId)
    if (n) {
      setTitle(n.title)
      setContent(n.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [selectedId, notes])

  const handleNew = () => {
    const id = addNote({ title: '', content: '' })
    setSelectedId(id)
    setTitle('')
    setContent('')
    setSavedHint('Created')
    setTimeout(() => setSavedHint(''), 1200)
  }

  const handleSave = () => {
    if (!selectedId) return
    updateNote(selectedId, { title: title || 'Untitled', content })
    setSavedHint('Saved')
    setTimeout(() => setSavedHint(''), 1200)
  }

  // autosave
  useEffect(() => {
    if (!selectedId) return
    const t = setTimeout(() => {
      updateNote(selectedId, { title: title || 'Untitled', content })
    }, 500)
    return () => clearTimeout(t)
  }, [title, content, selectedId, updateNote])

  return (
    <div className="h-full flex flex-col text-sm">
      <div className="flex gap-1 mb-2 flex-wrap items-center">
        <button className="retro-btn" onClick={handleNew}>New</button>
        <button className="retro-btn" onClick={handleSave} disabled={!selectedId}>Save</button>
        <button
          className="retro-btn"
          onClick={() => { if (selectedId) { deleteNote(selectedId); setSelectedId(null) } }}
        >
          Delete
        </button>
        {savedHint && <span className="text-[11px] text-green-800">{savedHint}</span>}
      </div>
      <div className="flex flex-1 gap-2 min-h-0">
        <div className="w-40 border border-[#808080] bg-white overflow-auto">
          {notes.length === 0 && <div className="p-2 text-[11px] text-gray-500">No notes yet</div>}
          {notes.map(n => (
            <div
              key={n.id}
              className={`px-2 py-1 cursor-pointer text-[12px] border-b border-[#eee] ${selectedId === n.id ? 'bg-[#000080] text-white' : 'hover:bg-[#e0e0ff]'}`}
              onClick={() => setSelectedId(n.id)}
            >
              {n.title || 'Untitled'}
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <input
            className="retro-input mb-1"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onFocus={() => { if (title === 'Untitled') setTitle('') }}
            placeholder="Title (Untitled)"
          />
          <textarea
            className="retro-input flex-1 resize-none"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Type your notes here..."
            style={{ fontFamily: 'Consolas, monospace' }}
          />
        </div>
      </div>
      <div className="text-[10px] text-gray-600 mt-1">Autosaves locally • {notes.length} note(s)</div>
    </div>
  )
}
