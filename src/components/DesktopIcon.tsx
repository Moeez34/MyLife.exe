import { useRef, useState, useEffect } from 'react'
import { useOSStore, AppId } from '../store/useOSStore'

interface Props {
  id: AppId | 'mycomputer' | 'recycle'
  label: string
  icon: React.ReactNode
  appId?: AppId
  title?: string
}

export default function DesktopIcon({ id, label, icon, appId, title }: Props) {
  const { iconPositions, setIconPos, openApp } = useOSStore()
  const pos = iconPositions.find(p => p.id === id) || { x: 20, y: 20 }
  const [dragging, setDragging] = useState(false)
  const [selected, setSelected] = useState(false)
  const offset = useRef({ x: 0, y: 0 })

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setSelected(true)
    setDragging(true)
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging) return
      setIconPos(id, Math.max(0, e.clientX - offset.current.x), Math.max(0, e.clientY - offset.current.y))
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
  }, [dragging, id, setIconPos])

  const handleDoubleClick = () => {
    if (appId && title) openApp(appId, title)
    if (id === 'mycomputer') openApp('explorer', 'My Computer')
    if (id === 'recycle') openApp('recycle', 'Recycle Bin')
  }

  return (
    <div
      className="absolute w-[90px] flex flex-col items-center cursor-pointer select-none"
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={onMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={() => setSelected(true)}
      onBlur={() => setSelected(false)}
      tabIndex={0}
    >
      <div
        className={`w-12 h-12 flex items-center justify-center border ${selected ? 'border-dotted border-black bg-[#000080]/20' : 'border-transparent'}`}
      >
        {icon}
      </div>
      <div
        className={`text-[11px] text-center leading-tight mt-1 px-1 ${selected ? 'bg-[#000080] text-white' : 'text-black'}`}
        style={{ textShadow: selected ? 'none' : '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff' }}
      >
        {label}
      </div>
    </div>
  )
}
