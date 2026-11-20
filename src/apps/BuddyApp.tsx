import { useState, useRef, useEffect } from 'react'

interface Msg {
  id: string
  from: 'user' | 'buddy'
  text: string
  time: string
}

const demoReplies = [
  "hey!! welcome back to MyLife.exe ~ what are we up to today?",
  "omg same. have you tried making a tiny goal list? feels nice to check things off :3",
  "okok stepping idea: write the smallest next step, do it for 5 mins, then decide again.",
  "mood. want to journal it quick in Notes.txt? i can cheer you on.",
  "beep boop~ i believe in you!! ✨",
]

export default function BuddyApp() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 'm0', from: 'buddy', text: "hi! i'm Buddy.exe ~ your nostalgic desktop pal. ask me anything (or just vibe).", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = async () => {
    const text = input.trim()
    if (!text) return
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(m => [...m, { id: `u-${Date.now()}`, from: 'user', text, time: now }])
    setInput('')
    setTyping(true)
    try {
      const res = await fetch('/api/buddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      if (res.ok) {
        const data = await res.json()
        const reply = data.reply || data.message || "hmm, I got an empty reply."
        setMessages(m => [...m, { id: `b-${Date.now()}`, from: 'buddy', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
      } else {
        throw new Error('no api')
      }
    } catch {
      const reply = demoReplies[Math.floor(Math.random() * demoReplies.length)]
      setTimeout(() => {
        setMessages(m => [...m, { id: `b-${Date.now()}`, from: 'buddy', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
      }, 600)
    } finally {
      setTimeout(() => setTyping(false), 700)
    }
  }

  return (
    <div className="h-full flex flex-col text-sm">
      <div className="flex items-center gap-2 border-b border-[#808080] pb-2 mb-2">
        <div className="w-12 h-12 bg-[#C9B3F2] border border-black flex items-center justify-center text-2xl">🤖</div>
        <div>
          <div className="font-bold">Buddy.exe</div>
          <div className="text-[11px] text-gray-600">online • nostalgic mode</div>
        </div>
      </div>
      <div className="flex-1 overflow-auto border border-[#808080] bg-white p-2 space-y-2" style={{ minHeight: 180 }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-2 py-1 border border-black ${msg.from === 'user' ? 'bg-[#75D5DC]' : 'bg-[#E9DDF5]'}`}>
              <div className="text-[10px] text-gray-600 mb-0.5">{msg.from === 'buddy' ? 'Buddy' : 'You'} • {msg.time}</div>
              <div>{msg.text}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="text-[11px] text-gray-600 italic">Buddy is typing...</div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-1 mt-2">
        <input
          className="retro-input flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message..."
        />
        <button className="retro-btn" onClick={send}>Send</button>
      </div>
    </div>
  )
}
