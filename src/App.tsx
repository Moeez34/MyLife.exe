import { useOSStore } from './store/useOSStore'
import BootScreen from './components/BootScreen'
import Desktop from './components/Desktop'

function App() {
  const { booted, shutdown, setShutdown, setBooted } = useOSStore()

  if (shutdown) {
    return (
      <div className="w-full h-full flex items-center justify-center flex-col gap-4" style={{ background: '#000', color: '#c0c0c0', fontFamily: 'VT323, monospace' }}>
        <div className="text-2xl">Your computer is now safe to close.</div>
        <div className="text-sm text-gray-400">MyLife.exe</div>
        <button className="retro-btn" onClick={() => { setShutdown(false); setBooted(false) }}>Restart Desktop</button>
      </div>
    )
  }

  if (!booted) {
    return <BootScreen />
  }

  return <Desktop />
}

export default App
