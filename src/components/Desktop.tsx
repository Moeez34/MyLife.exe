import { useOSStore } from '../store/useOSStore'
import DesktopIcon from './DesktopIcon'
import AppWindow from './AppWindow'
import Taskbar from './Taskbar'
import StartMenu from './StartMenu'
import BuddyApp from '../apps/BuddyApp'
import NotesApp from '../apps/NotesApp'
import GoalsApp from '../apps/GoalsApp'
import MemoriesApp from '../apps/MemoriesApp'
import MusicApp from '../apps/MusicApp'
import BrowserApp from '../apps/BrowserApp'
import ExplorerApp from '../apps/ExplorerApp'
import RecycleBinApp from '../apps/RecycleBinApp'
import CalculatorApp from '../apps/CalculatorApp'
import CalendarApp from '../apps/CalendarApp'
import AlarmApp from '../apps/AlarmApp'

export default function Desktop() {
  const { windows, startMenuOpen } = useOSStore()

  const renderApp = (appId: string) => {
    switch (appId) {
      case 'buddy': return <BuddyApp />
      case 'notes': return <NotesApp />
      case 'goals': return <GoalsApp />
      case 'memories': return <MemoriesApp />
      case 'music': return <MusicApp />
      case 'browser': return <BrowserApp />
      case 'explorer': return <ExplorerApp />
      case 'recycle': return <RecycleBinApp />
      case 'calculator': return <CalculatorApp />
      case 'calendar': return <CalendarApp />
      case 'alarm': return <AlarmApp />
      default: return <div className="p-4 text-sm">Unknown app</div>
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="desktop-wallpaper" />
      <div className="scanlines absolute inset-0" />

      {/* Desktop Icons */}
      <DesktopIcon
        id="mycomputer"
        label="My Computer"
        icon={
          <svg width="40" height="40" viewBox="0 0 40 40" className="pixelated" aria-hidden>
            <rect x="4" y="6" width="32" height="22" fill="#C9B3F2" stroke="#000" strokeWidth="1.5" />
            <rect x="8" y="10" width="24" height="14" fill="#75D5DC" stroke="#000" strokeWidth="1" />
            <rect x="14" y="30" width="12" height="3" fill="#E7E1DA" stroke="#000" strokeWidth="1" />
            <rect x="10" y="33" width="20" height="3" fill="#E7E1DA" stroke="#000" strokeWidth="1" />
          </svg>
        }
        appId="explorer"
        title="My Computer"
      />
      <DesktopIcon
        id="buddy"
        label="Buddy.exe"
        icon={
          <svg width="40" height="40" viewBox="0 0 40 40" className="pixelated" aria-hidden>
            <rect x="6" y="8" width="28" height="24" rx="2" fill="#F5CF72" stroke="#000" strokeWidth="1.5" />
            <rect x="11" y="15" width="5" height="5" fill="#000" />
            <rect x="24" y="15" width="5" height="5" fill="#000" />
            <rect x="13" y="25" width="14" height="3" fill="#000" />
            <rect x="16" y="4" width="8" height="5" fill="#C9B3F2" stroke="#000" strokeWidth="1" />
            <circle cx="20" cy="3" r="2" fill="#75D5DC" stroke="#000" strokeWidth="1" />
          </svg>
        }
        appId="buddy"
        title="Buddy.exe"
      />
      <DesktopIcon
        id="notes"
        label="Notes.txt"
        icon={
          <svg width="40" height="40" viewBox="0 0 40 40" className="pixelated" aria-hidden>
            <rect x="8" y="4" width="24" height="32" fill="#fff" stroke="#000" strokeWidth="1.5" />
            <rect x="8" y="4" width="24" height="6" fill="#E9B6D8" stroke="#000" strokeWidth="1" />
            <line x1="12" y1="14" x2="28" y2="14" stroke="#000" strokeWidth="1" />
            <line x1="12" y1="19" x2="28" y2="19" stroke="#000" strokeWidth="1" />
            <line x1="12" y1="24" x2="24" y2="24" stroke="#000" strokeWidth="1" />
          </svg>
        }
        appId="notes"
        title="Notes.txt"
      />
      <DesktopIcon
        id="goals"
        label="Goals.exe"
        icon={
          <svg width="40" height="40" viewBox="0 0 40 40" className="pixelated" aria-hidden>
            <circle cx="20" cy="20" r="14" fill="#E7E1DA" stroke="#000" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="10" fill="#75D5DC" stroke="#000" strokeWidth="1" />
            <circle cx="20" cy="20" r="6" fill="#E9B6D8" stroke="#000" strokeWidth="1" />
            <circle cx="20" cy="20" r="2" fill="#000" />
          </svg>
        }
        appId="goals"
        title="Goals.exe"
      />
      <DesktopIcon
        id="memories"
        label="Memories.exe"
        icon={
          <svg width="40" height="40" viewBox="0 0 40 40" className="pixelated" aria-hidden>
            <rect x="6" y="8" width="28" height="24" fill="#E9DDF5" stroke="#000" strokeWidth="1.5" />
            <rect x="10" y="12" width="20" height="14" fill="#75D5DC" stroke="#000" strokeWidth="1" />
            <circle cx="14" cy="16" r="2" fill="#F5CF72" stroke="#000" strokeWidth="0.5" />
            <path d="M10 26 L18 20 L26 24 L30 22 L30 26 Z" fill="#C9B3F2" stroke="#000" strokeWidth="0.5" />
          </svg>
        }
        appId="memories"
        title="Memories.exe"
      />
      <DesktopIcon
        id="music"
        label="Music.exe"
        icon={
          <svg width="40" height="40" viewBox="0 0 40 40" className="pixelated" aria-hidden>
            <rect x="8" y="6" width="24" height="28" fill="#C9B3F2" stroke="#000" strokeWidth="1.5" />
            <rect x="12" y="10" width="16" height="10" fill="#000" />
            <rect x="14" y="12" width="3" height="6" fill="#75D5DC" />
            <rect x="19" y="12" width="3" height="6" fill="#F5CF72" />
            <rect x="24" y="12" width="3" height="6" fill="#75D5DC" />
            <circle cx="14" cy="28" r="3" fill="#E7E1DA" stroke="#000" strokeWidth="1" />
            <circle cx="26" cy="28" r="3" fill="#E7E1DA" stroke="#000" strokeWidth="1" />
          </svg>
        }
        appId="music"
        title="Music.exe"
      />
      <DesktopIcon
        id="browser"
        label="Internet.exe"
        icon={<img src="/internet-icon.png" alt="Internet" width={40} height={40} style={{ imageRendering: 'pixelated' }} />}
        appId="browser"
        title="Internet.exe"
      />
      <DesktopIcon
        id="calculator"
        label="Calculator"
        icon={
          <svg width="40" height="40" viewBox="0 0 40 40" className="pixelated" aria-hidden>
            <rect x="8" y="4" width="24" height="32" fill="#E7E1DA" stroke="#000" strokeWidth="1.5" />
            <rect x="11" y="7" width="18" height="6" fill="#fff" stroke="#000" strokeWidth="1" />
            <rect x="11" y="16" width="4" height="4" fill="#C9B3F2" stroke="#000" strokeWidth="1" />
            <rect x="18" y="16" width="4" height="4" fill="#C9B3F2" stroke="#000" strokeWidth="1" />
            <rect x="25" y="16" width="4" height="4" fill="#C9B3F2" stroke="#000" strokeWidth="1" />
            <rect x="11" y="23" width="4" height="4" fill="#C9B3F2" stroke="#000" strokeWidth="1" />
            <rect x="18" y="23" width="4" height="4" fill="#C9B3F2" stroke="#000" strokeWidth="1" />
            <rect x="25" y="23" width="4" height="4" fill="#F5CF72" stroke="#000" strokeWidth="1" />
          </svg>
        }
        appId="calculator"
        title="Calculator"
      />
      <DesktopIcon
        id="calendar"
        label="Calendar"
        icon={
          <svg width="40" height="40" viewBox="0 0 40 40" className="pixelated" aria-hidden>
            <rect x="6" y="8" width="28" height="26" fill="#fff" stroke="#000" strokeWidth="1.5" />
            <rect x="6" y="8" width="28" height="6" fill="#E9B6D8" stroke="#000" strokeWidth="1" />
            <rect x="12" y="4" width="3" height="6" fill="#000" />
            <rect x="25" y="4" width="3" height="6" fill="#000" />
            <rect x="10" y="18" width="4" height="4" fill="#75D5DC" />
            <rect x="18" y="18" width="4" height="4" fill="#75D5DC" />
            <rect x="26" y="18" width="4" height="4" fill="#75D5DC" />
          </svg>
        }
        appId="calendar"
        title="Calendar"
      />
      <DesktopIcon
        id="alarm"
        label="Alarm"
        icon={
          <svg width="40" height="40" viewBox="0 0 40 40" className="pixelated" aria-hidden>
            <circle cx="20" cy="22" r="12" fill="#E7E1DA" stroke="#000" strokeWidth="1.5" />
            <circle cx="20" cy="22" r="9" fill="#fff" stroke="#000" strokeWidth="1" />
            <line x1="20" y1="22" x2="20" y2="15" stroke="#000" strokeWidth="1.5" />
            <line x1="20" y1="22" x2="25" y2="22" stroke="#000" strokeWidth="1.5" />
            <rect x="8" y="8" width="6" height="4" fill="#C9B3F2" stroke="#000" strokeWidth="1" transform="rotate(-30 11 10)" />
            <rect x="26" y="8" width="6" height="4" fill="#C9B3F2" stroke="#000" strokeWidth="1" transform="rotate(30 29 10)" />
          </svg>
        }
        appId="alarm"
        title="Alarm"
      />
      <DesktopIcon
        id="recycle"
        label="Recycle Bin"
        icon={
          <svg width="40" height="40" viewBox="0 0 40 40" className="pixelated" aria-hidden>
            <rect x="12" y="14" width="16" height="20" fill="#E7E1DA" stroke="#000" strokeWidth="1.5" />
            <rect x="10" y="10" width="20" height="4" fill="#C9B3F2" stroke="#000" strokeWidth="1.5" />
            <rect x="16" y="6" width="8" height="4" fill="#C9B3F2" stroke="#000" strokeWidth="1.5" />
            <line x1="16" y1="18" x2="16" y2="30" stroke="#000" strokeWidth="1" />
            <line x1="20" y1="18" x2="20" y2="30" stroke="#000" strokeWidth="1" />
            <line x1="24" y1="18" x2="24" y2="30" stroke="#000" strokeWidth="1" />
          </svg>
        }
      />

      {/* Windows */}
      {windows.map(w => (
        <AppWindow key={w.id} win={w}>
          {renderApp(w.appId)}
        </AppWindow>
      ))}

      {startMenuOpen && <StartMenu />}
      <Taskbar />
    </div>
  )
}
