import { useRef, useState, useEffect } from 'react'
import { useOSStore, WindowState } from '../store/useOSStore'

interface Props {
  win: WindowState
  children: React.ReactNode
}

export default function AppWindow({ win, children }: Props) {
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow, moveWindow, focusedWindowId } = useOSStore()
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const winRef = useRef<HTMLDivElement>(null)

  const onMouseDownTitle = (e: React.MouseEvent) => {
    if (win.maximized) return
    e.preventDefault()
    focusWindow(win.id)
    setDragging(true)
    dragOffset.current = { x: e.clientX - win.x, y: e.clientY - win.y }
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging) return
      const nx = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffset.current.x))
      const ny = Math.max(0, Math.min(window.innerHeight - 120, e.clientY - dragOffset.current.y))
      moveWindow(win.id, nx, ny)
    }
    const onUp = () => setDragging(false)
    if (dragging) {
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    }
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging, win.id, moveWindow])

  if (win.minimized) return null

  const style: React.CSSProperties = win.maximized
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 40px)', zIndex: win.zIndex }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex }

  const isFocused = focusedWindowId === win.id

  return (
    <div
      ref={winRef}
      className="retro-window absolute flex flex-col"
      style={style}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div
        className={`retro-titlebar ${isFocused ? '' : 'retro-titlebar-inactive'}`}
        onMouseDown={onMouseDownTitle}
        style={{ cursor: win.maximized ? 'default' : 'move' }}
      >
        <span className="truncate px-1">{win.title}</span>
        <div className="flex items-center gap-[2px] pr-1">
          <button className="titlebar-btn" onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id) }} aria-label="Minimize">_</button>
          <button className="titlebar-btn" onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id) }} aria-label="Maximize">□</button>
          <button className="titlebar-btn" onClick={(e) => { e.stopPropagation(); closeWindow(win.id) }} aria-label="Close">X</button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[#E7E1DA] p-2">
        {children}
      </div>
    </div>
  )
}
