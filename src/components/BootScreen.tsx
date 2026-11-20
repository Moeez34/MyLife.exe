import { useEffect, useState } from 'react'
import { useOSStore } from '../store/useOSStore'

export default function BootScreen() {
  const { setBooted, bootSkipped, setBootSkipped } = useOSStore()
  const [progress, setProgress] = useState(0)
  const [line, setLine] = useState('Initializing desktop...')

  const playStartupSound = () => {
    try {
      const audio = new Audio('/winxp.mp3')
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch { /* ignore */ }
  }

  useEffect(() => {
    if (bootSkipped) {
      playStartupSound()
      setBooted(true)
      return
    }
    const t1 = setTimeout(() => setLine('Loading applications...'), 600)
    const t2 = setTimeout(() => setLine('Restoring personal files...'), 1300)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + 4
      })
    }, 80)
    const t3 = setTimeout(() => {
      // autoplay may be blocked here; try anyway
      playStartupSound()
      setBooted(true)
    }, 3200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearInterval(interval)
    }
  }, [bootSkipped, setBooted])

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0a0a2a 0%, #1a1a4a 100%)', color: '#c0c0c0' }}>
      <div className="border border-[#808080] p-6 w-[90%] max-w-[520px]" style={{ background: '#0c0c1e', boxShadow: 'inset 1px 1px 0 #404040' }}>
        <div className="text-[#75D5DC] font-bold text-lg mb-1" style={{ fontFamily: 'VT323, monospace' }}>MYLIFE SYSTEMS</div>
        <div className="text-xs text-[#b0b0b0] mb-4">Retro OS v1.0</div>
        <div className="text-sm mb-2">{line}</div>
        <div className="w-full h-5 border border-[#808080] bg-[#1a1a2a] mb-2">
          <div className="h-full bg-[#000080]" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-right mb-4">{progress}%</div>
        {progress >= 100 && <div className="text-[#F5CF72] text-sm">Welcome back.</div>}
        <div className="mt-4 flex gap-2">
          <button
            className="retro-btn"
            onClick={() => { playStartupSound(); setBootSkipped(true); setBooted(true) }}
          >
            Skip Boot
          </button>
        </div>
      </div>
    </div>
  )
}
