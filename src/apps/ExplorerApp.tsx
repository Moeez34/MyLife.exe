import { useState } from 'react'

const folders = ['My Documents', 'My Pictures', 'My Music', 'My Memories', 'Applications']

export default function ExplorerApp() {
  const [selected, setSelected] = useState('My Documents')

  const contents: Record<string, string[]> = {
    'My Documents': ['notes_backup.txt', 'todo_2003.doc', 'resume_old.rtf'],
    'My Pictures': ['wallpaper1.bmp', 'icon_draft.gif', 'vacation_98.jpg'],
    'My Music': ['playlist.m3u', 'track01.mp3', 'track02.mp3'],
    'My Memories': ['Open Memories.exe to view'],
    'Applications': ['Buddy.exe', 'Notes.txt', 'Goals.exe', 'Memories.exe', 'Music.exe', 'Internet.exe'],
  }

  return (
    <div className="h-full flex flex-col text-sm">
      <div className="text-[11px] mb-1 border-b border-[#808080] pb-1">Exploring: C:\MyLife\{selected}</div>
      <div className="flex flex-1 gap-2 min-h-0">
        <div className="w-40 border border-[#808080] bg-white p-1">
          {folders.map(f => (
            <div
              key={f}
              className={`px-1 py-0.5 cursor-pointer text-[12px] ${selected === f ? 'bg-[#000080] text-white' : 'hover:bg-[#e0e0ff]'}`}
              onClick={() => setSelected(f)}
            >
              📁 {f}
            </div>
          ))}
        </div>
        <div className="flex-1 border border-[#808080] bg-white p-2 overflow-auto">
          <div className="text-[11px] font-bold mb-2">{selected}</div>
          <div className="grid grid-cols-2 gap-2">
            {(contents[selected] || []).map(item => (
              <div key={item} className="flex items-center gap-1 text-[12px]">
                <span>📄</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
