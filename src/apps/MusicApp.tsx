import { useRef, useState, useEffect } from 'react'

const tracks = [
  { title: 'lofi sample 1', artist: 'demo', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'lofi sample 2', artist: 'demo', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'lofi sample 3', artist: 'demo', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
]

export default function MusicApp() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play().catch(() => {}); setPlaying(true) }
  }

  const next = () => { setIdx(i => (i + 1) % tracks.length); setPlaying(false); setProgress(0) }
  const prev = () => { setIdx(i => (i - 1 + tracks.length) % tracks.length); setPlaying(false); setProgress(0) }

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => setProgress(a.currentTime)
    const onMeta = () => setDuration(a.duration || 0)
    const onEnd = () => next()
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onMeta)
    a.addEventListener('ended', onEnd)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onMeta)
      a.removeEventListener('ended', onEnd)
    }
  }, [idx])

  useEffect(() => {
    if (playing && audioRef.current) audioRef.current.play().catch(() => setPlaying(false))
  }, [idx])

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = v
    setProgress(v)
  }

  const fmt = (s: number) => {
    if (!isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  return (
    <div className="h-full flex flex-col text-sm" style={{ background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)', color: '#75D5DC' }}>
      <div className="p-2 border-b border-[#555]">
        <div className="text-[10px] text-[#888]">WINAMP-ISH PLAYER</div>
        <div className="font-bold text-[#F5CF72]" style={{ fontFamily: 'VT323, monospace', fontSize: 18 }}>{tracks[idx].title}</div>
        <div className="text-[11px] text-[#aaa]">{tracks[idx].artist}</div>
      </div>
      <div className="p-2">
        <div className="flex justify-between text-[10px] text-[#aaa] mb-1">
          <span>{fmt(progress)}</span>
          <span>{fmt(duration)}</span>
        </div>
        <input type="range" min={0} max={duration || 0} value={progress} onChange={seek} className="w-full" />
      </div>
      <div className="flex items-center justify-center gap-2 py-2">
        <button className="retro-btn" onClick={prev}>|&lt;&lt;</button>
        <button className="retro-btn font-bold px-4" onClick={toggle}>{playing ? 'Pause' : 'Play'}</button>
        <button className="retro-btn" onClick={next}>&gt;&gt;|</button>
      </div>
      <div className="px-2 flex items-center gap-2 text-[11px]">
        <span>Vol</span>
        <input type="range" min={0} max={1} step={0.05} value={volume} onChange={e => setVolume(Number(e.target.value))} />
      </div>
      <div className="mt-2 border-t border-[#555] p-2 flex-1 overflow-auto">
        <div className="text-[10px] text-[#888] mb-1">PLAYLIST</div>
        {tracks.map((t, i) => (
          <div
            key={t.src}
            className={`text-[11px] cursor-pointer py-0.5 ${i === idx ? 'text-[#F5CF72]' : 'text-[#ccc]'}`}
            onClick={() => { setIdx(i); setPlaying(false) }}
          >
            {i + 1}. {t.title}
          </div>
        ))}
      </div>
      <audio ref={audioRef} src={tracks[idx].src} />
    </div>
  )
}
