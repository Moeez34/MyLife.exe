import { useOSStore } from '../store/useOSStore'

export default function StartMenu() {
  const { setStartMenuOpen, openApp, setShutdown } = useOSStore()

  const itemCls = 'px-3 py-1 text-sm cursor-pointer hover:bg-[#000080] hover:text-white flex items-center gap-2'

  const open = (appId: any, title: string) => {
    openApp(appId, title)
    setStartMenuOpen(false)
  }

  return (
    <div
      className="absolute bottom-10 left-1 z-[10000] w-[260px] border border-black flex"
      style={{ background: '#d4d0c8', boxShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}
      onMouseLeave={() => setStartMenuOpen(false)}
    >
      <div className="w-8 flex items-end justify-center pb-2" style={{ background: 'linear-gradient(180deg, #000080, #1084d0)' }}>
        <span className="text-white text-xs font-bold rotate-[-90deg] whitespace-nowrap mb-6 tracking-widest">MYLIFE.EXE</span>
      </div>
      <div className="flex-1 py-1">
        <div className="px-2 py-1 text-[11px] text-gray-600 border-b border-[#808080] mb-1">Programs</div>
        <div className={itemCls} onClick={() => open('buddy', 'Buddy.exe')}>💬 Buddy.exe</div>
        <div className={itemCls} onClick={() => open('notes', 'Notes.txt')}>📝 Notes.txt</div>
        <div className={itemCls} onClick={() => open('goals', 'Goals.exe')}>🎯 Goals.exe</div>
        <div className={itemCls} onClick={() => open('memories', 'Memories.exe')}>🖼 Memories.exe</div>
        <div className={itemCls} onClick={() => open('music', 'Music.exe')}>🎵 Music.exe</div>
        <div className={itemCls} onClick={() => open('browser', 'Internet.exe')}>🌐 Internet.exe</div>
        <div className={itemCls} onClick={() => { openApp('explorer', 'My Computer'); setStartMenuOpen(false) }}>💾 My Computer</div>
        <div className="border-t border-[#808080] my-1" />
        <div className={itemCls} onClick={() => { openApp('explorer', 'My Documents'); setStartMenuOpen(false) }}>📁 My Documents</div>
        <div className={itemCls} onClick={() => alert('Settings: theme locked to Y2K (by design).')}>⚙ Settings</div>
        <div className={itemCls} onClick={() => alert('MyLife.exe\nA nostalgic desktop OS built with React.\n(c) 2003 vibes, 2025 code.')}>ℹ About MyLife.exe</div>
        <div className="border-t border-[#808080] my-1" />
        <div className={itemCls} onClick={() => { setShutdown(true); setStartMenuOpen(false) }}>⏻ Shut Down</div>
      </div>
    </div>
  )
}
