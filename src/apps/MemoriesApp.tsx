import { useState } from 'react'
import { useDataStore } from '../store/useDataStore'

export default function MemoriesApp() {
  const { memories, addMemory, deleteMemory } = useDataStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined)

  const onFile = (f: File | null) => {
    if (!f) { setImageDataUrl(undefined); return }
    const reader = new FileReader()
    reader.onload = () => setImageDataUrl(reader.result as string)
    reader.readAsDataURL(f)
  }

  const handleAdd = () => {
    if (!title.trim()) return
    addMemory({ title: title.trim(), description, date, imageDataUrl })
    setTitle(''); setDescription(''); setDate(''); setImageDataUrl(undefined)
  }

  return (
    <div className="h-full flex flex-col text-sm gap-2">
      <div className="border border-[#808080] bg-white p-2">
        <div className="text-[11px] font-bold mb-1">New Memory</div>
        <div className="grid gap-1">
          <input className="retro-input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input className="retro-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <textarea className="retro-input" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
          <input className="text-[11px]" type="file" accept="image/*" onChange={e => onFile(e.target.files?.[0] || null)} />
          <button className="retro-btn w-fit" onClick={handleAdd}>Save Memory</button>
        </div>
      </div>
      <div className="text-[11px] font-bold">Archive ({memories.length})</div>
      <div className="flex-1 overflow-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
        {memories.length === 0 && <div className="text-gray-600 text-[12px]">No memories saved yet.</div>}
        {memories.map(m => (
          <div key={m.id} className="border border-[#808080] bg-[#fdfbf7] p-2">
            {m.imageDataUrl && <img src={m.imageDataUrl} alt="" className="w-full h-28 object-cover border border-black mb-1" />}
            <div className="font-bold">{m.title}</div>
            <div className="text-[10px] text-gray-600">{m.date || 'No date'}</div>
            <div className="text-[12px] mt-1">{m.description}</div>
            <button className="retro-btn text-[11px] mt-2" onClick={() => deleteMemory(m.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
