import { useState } from 'react'

type PageKey = 'home' | 'dreamwave.local' | 'pixelclub.local' | 'midnight.fm' | 'diary2002.local' | 'retro-web'

const PAGES: Record<PageKey, { title: string; content: React.ReactNode }> = {
  home: {
    title: 'MyLife Portal - Home',
    content: (
      <div className="space-y-3">
        <h1 className="text-xl font-bold" style={{ color: '#000080' }}>Welcome to MyLife Portal</h1>
        <p className="text-sm">Your nostalgic start page for the early web.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="border border-black bg-[#E9DDF5] p-2">
            <div className="font-bold">dreamwave.local</div>
            <div className="text-[12px]">A dreamy Y2K portal</div>
          </div>
          <div className="border border-black bg-[#E9B6D8] p-2">
            <div className="font-bold">pixelclub.local</div>
            <div className="text-[12px]">Pixel art community</div>
          </div>
          <div className="border border-black bg-[#75D5DC] p-2">
            <div className="font-bold">midnight.fm</div>
            <div className="text-[12px]">Music website</div>
          </div>
          <div className="border border-black bg-[#F5CF72] p-2">
            <div className="font-bold">diary2002.local</div>
            <div className="text-[12px]">Nostalgic blog</div>
          </div>
        </div>
        <div className="text-[11px] text-gray-600">Tip: type a site name in the address bar and press Go.</div>
      </div>
    )
  },
  'dreamwave.local': {
    title: 'dreamwave.local',
    content: (
      <div style={{ background: 'linear-gradient(180deg, #E9B6D8, #C9B3F2)', minHeight: '100%' }} className="p-3">
        <h1 className="text-2xl font-bold text-white" style={{ textShadow: '2px 2px 0 #000080' }}>DREAMWAVE</h1>
        <p className="text-sm mt-2">welcome to the vapor dreams portal ✧</p>
        <div className="mt-4 border border-white bg-white/60 p-2 text-sm">
          <div className="font-bold">Today's vibe</div>
          <div>soft clouds, midi beats, and loading screens forever.</div>
        </div>
      </div>
    )
  },
  'pixelclub.local': {
    title: 'pixelclub.local',
    content: (
      <div className="p-3 bg-[#111] text-[#75D5DC] min-h-full" style={{ fontFamily: 'VT323, monospace' }}>
        <h1 className="text-3xl">PIXEL CLUB</h1>
        <p className="text-lg">8-bit hearts, 24-bit dreams.</p>
        <div className="mt-3 border border-[#75D5DC] p-2">
          <div>[featured] a new sprite pack dropped!!</div>
          <div className="mt-2 text-[#F5CF72]">join the forum (lol dial-up)</div>
        </div>
      </div>
    )
  },
  'midnight.fm': {
    title: 'midnight.fm',
    content: (
      <div className="p-3" style={{ background: '#1a1030', color: '#E9DDF5', minHeight: '100%' }}>
        <h1 className="text-2xl font-bold">midnight.fm</h1>
        <p className="text-sm">now playing: nothing (press play in Music.exe)</p>
        <div className="mt-3 border border-[#C9B3F2] p-2">
          <div className="font-bold text-[#F5CF72]">Show tonight</div>
          <div className="text-sm">DJ Nullbyte — 12:00 AM</div>
        </div>
      </div>
    )
  },
  'diary2002.local': {
    title: 'diary2002.local',
    content: (
      <div className="p-3 bg-[#fffdf5] min-h-full">
        <h1 className="text-xl font-bold" style={{ color: '#8b4513' }}>diary2002</h1>
        <p className="text-[11px] text-gray-500 mb-2">last updated: never lol</p>
        <div className="border-l-4 border-[#C9B3F2] pl-2 text-sm">
          <div className="font-bold">dear log,</div>
          <p>today i installed a new screensaver and felt powerful. the internet is so big. brb, going to download more RAM.</p>
        </div>
      </div>
    )
  },
  'retro-web': {
    title: 'Bored.com — Retro Web Category',
    content: (
      <div className="p-3 space-y-2">
        <h1 className="text-xl font-bold text-[#000080]">Retro Web Picks (from Bored.com)</h1>
        <p className="text-sm">A curated corner of nostalgic websites. Visit the original page: <span className="underline text-blue-800">https://www.bored.com/category/retro-web/</span></p>
        <div className="border border-[#808080] bg-[#E7E1DA] p-2 text-sm">
          <div className="font-bold mb-1">Suggested stops:</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Classic Flash game archives</li>
            <li>Old web art &amp; pixel galleries</li>
            <li>GeoCities-style throwbacks</li>
            <li>Retro internet quizzes and toys</li>
          </ul>
        </div>
        <div className="text-[11px] text-gray-600">Note: This is a mock page inside MyLife.exe’s retro browser.</div>
      </div>
    )
  },
}

export default function BrowserApp() {
  const [history, setHistory] = useState<PageKey[]>(['home'])
  const [idx, setIdx] = useState(0)
  const [address, setAddress] = useState('home')

  const current = history[idx]

  const navigate = (key: string) => {
    const k = (key.trim().toLowerCase()) as PageKey
    const target: PageKey = (k in PAGES) ? k : 'home'
    const newHist = history.slice(0, idx + 1)
    newHist.push(target)
    setHistory(newHist)
    setIdx(newHist.length - 1)
    setAddress(target)
  }

  const back = () => {
    if (idx > 0) { setIdx(idx - 1); setAddress(history[idx - 1]) }
  }
  const fwd = () => {
    if (idx < history.length - 1) { setIdx(idx + 1); setAddress(history[idx + 1]) }
  }

  return (
    <div className="h-full flex flex-col text-sm">
      <div className="flex items-center gap-1 mb-2 flex-wrap">
        <button className="retro-btn" onClick={back}>Back</button>
        <button className="retro-btn" onClick={fwd}>Fwd</button>
        <button className="retro-btn" onClick={() => navigate('home')}>Home</button>
        <input
          className="retro-input flex-1 min-w-[120px]"
          value={address}
          onChange={e => setAddress(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && navigate(address)}
        />
        <button className="retro-btn" onClick={() => navigate(address)}>Go</button>
      </div>
      <div className="text-[11px] mb-1 flex gap-2 flex-wrap">
        <span className="text-gray-600">Bookmarks:</span>
        {(['dreamwave.local','pixelclub.local','midnight.fm','diary2002.local','retro-web'] as PageKey[]).map(b => (
          <button key={b} className="underline text-blue-800" onClick={() => navigate(b)}>{b}</button>
        ))}
      </div>
      <div className="flex-1 border border-[#808080] bg-white overflow-auto">
        <div className="border-b border-[#808080] bg-[#d4d0c8] px-2 py-1 text-[11px]">{PAGES[current].title}</div>
        <div className="p-2">{PAGES[current].content}</div>
      </div>
    </div>
  )
}
