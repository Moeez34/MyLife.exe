import { useRef, useState, useEffect } from 'react'

const PALETTE = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#808040', '#004040', '#0080ff', '#004080', '#4000ff', '#804000', '#ffffff', '#c0c0c0',
  '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80',
  '#80ffff', '#8080ff', '#ff0080', '#ff8040',
]

export default function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<'pencil' | 'brush' | 'eraser'>('brush')
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(4)
  const [drawing, setDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true)
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.lineWidth = tool === 'pencil' ? 1 : size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  const endDraw = () => setDrawing(false)

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const toolBtn = (id: typeof tool, label: string, icon: React.ReactNode) => (
    <button
      className={`w-8 h-8 border flex items-center justify-center ${tool === id ? 'border-2 border-black bg-[#c0c0c0]' : 'border border-[#808080] bg-[#e0e0e0]'}`}
      onClick={() => setTool(id)}
      title={label}
    >
      {icon}
    </button>
  )

  return (
    <div className="h-full flex flex-col text-xs" style={{ fontFamily: 'Tahoma, sans-serif' }}>
      {/* Menu bar */}
      <div className="flex gap-3 px-1 py-0.5 border-b border-[#808080] bg-[#d4d0c8] text-[11px]">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">File</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Edit</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">View</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Image</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Colors</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Help</span>
      </div>
      <div className="flex flex-1 min-h-0">
        {/* Toolbox */}
        <div className="w-12 border-r border-[#808080] bg-[#d4d0c8] p-1 flex flex-col gap-1">
          {toolBtn('pencil', 'Pencil', (
            <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="10" width="8" height="3" fill="#F5CF72" stroke="#000" strokeWidth="0.5"/><rect x="9" y="3" width="4" height="8" fill="#C9B3F2" stroke="#000" strokeWidth="0.5" transform="rotate(45 11 7)"/></svg>
          ))}
          {toolBtn('brush', 'Brush', (
            <svg width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="2" width="10" height="4" fill="#E9B6D8" stroke="#000" strokeWidth="0.5"/><rect x="6" y="6" width="4" height="7" fill="#8B4513" stroke="#000" strokeWidth="0.5"/></svg>
          ))}
          {toolBtn('eraser', 'Eraser', (
            <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="6" width="10" height="6" fill="#E7E1DA" stroke="#000" strokeWidth="0.5"/><rect x="8" y="4" width="6" height="4" fill="#ffb6c1" stroke="#000" strokeWidth="0.5"/></svg>
          ))}
          <button className="w-8 h-8 border border-[#808080] bg-[#e0e0e0] text-[8px] leading-none" onClick={clearCanvas} title="Clear">CLR</button>
        </div>
        {/* Canvas area */}
        <div className="flex-1 overflow-auto bg-[#808080] p-2">
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="bg-white border border-[#404040]"
            style={{ touchAction: 'none', maxWidth: '100%' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>
      </div>
      {/* Color palette */}
      <div className="border-t border-[#808080] bg-[#d4d0c8] p-1 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 border-2 border-white shadow-[1px_1px_0_#000]" style={{ background: color }} title="Foreground" />
        </div>
        <div className="flex flex-wrap gap-px max-w-[280px]">
          {PALETTE.map(c => (
            <button
              key={c}
              className="w-4 h-4 border border-[#808080]"
              style={{ background: c }}
              onClick={() => setColor(c)}
              title={c}
            />
          ))}
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          <label>Size</label>
          <input type="range" min={1} max={20} value={size} onChange={e => setSize(Number(e.target.value))} className="w-20" />
        </div>
      </div>
    </div>
  )
}
