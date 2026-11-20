import { useEffect, useState } from 'react'
import { useOSStore } from '../store/useOSStore'
import { Volume2 } from 'lucide-react'

export default function Taskbar() {
  const { windows, focusWindow, restoreWindow, startMenuOpen, setStartMenuOpen, focusedWindowId } = useOSStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleTaskClick = (id: string, minimized: boolean) => {
    if (minimized) {
      restoreWindow(id)
      focusWindow(id)
    } else {
      focusWindow(id)
    }
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-10 flex items-center px-1 gap-1 z-[9999]"
      style={{
        background: '#d4d0c8',
        borderTop: '2px solid #fff',
        boxShadow: 'inset 0 1px 0 #dfdfdf',
      }}
    >
      <button
        className="retro-btn flex items-center gap-1 font-bold h-7"
        onClick={() => setStartMenuOpen(!startMenuOpen)}
        style={{ minWidth: 70 }}
      >
        <span className="text-[11px]">▶ Start</span>
      </button>
      <div className="flex-1 flex items-center gap-1 overflow-x-auto">
        {windows.map(w => (
          <button
            key={w.id}
            className="retro-btn h-7 text-[11px] truncate max-w-[160px] text-left"
            onClick={() => handleTaskClick(w.id, w.minimized)}
            style={{ fontWeight: focusedWindowId === w.id && !w.minimized ? 700 : 400 }}
          >
            {w.title}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 pr-2">
        <Volume2 size={14} />
        <div className="text-[11px] border border-[#808080] px-2 py-1 bg-[#e0e0e0]" style={{ borderTopColor: '#808080', borderLeftColor: '#808080' }}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}
