import { useRef, useState, useEffect } from 'react'

export default function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
    ctx.strokeStyle = color
    ctx.lineWidth = size
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

  return (
    <div className="h-full flex flex-col text-sm">
      <div className="flex flex-wrap gap-2 items-center mb-2 p-1 border-b border-[#808080]">
        <label className="text-[11px]">Color:</label>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-6" />
        <label className="text-[11px]">Size:</label>
        <input type="range" min={1} max={20} value={size} onChange={e => setSize(Number(e.target.value))} />
        <span className="text-[11px]">{size}px</span>
        <button className="retro-btn text-[11px]" onClick={clearCanvas}>Clear</button>
      </div>
      <div className="flex-1 overflow-auto border border-[#808080] bg-white">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="block max-w-full"
          style={{ touchAction: 'none' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>
      <div className="text-[10px] text-gray-600 mt-1">untitled - Paint</div>
    </div>
  )
}
