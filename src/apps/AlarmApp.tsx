import { useState, useEffect } from 'react'

interface Alarm { id: string; time: string; label: string; enabled: boolean }

export default function AlarmApp() {
  const [now, setNow] = useState(new Date())
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [timeInput, setTimeInput] = useState('07:00')
  const [labelInput, setLabelInput] = useState('Alarm')

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const addAlarm = () => {
    setAlarms(a => [...a, { id: `alm-${Date.now()}`, time: timeInput, label: labelInput || 'Alarm', enabled: true }])
  }

  const toggle = (id: string) => setAlarms(a => a.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x))
  const remove = (id: string) => setAlarms(a => a.filter(x => x.id !== id))

  return (
    <div className="h-full flex flex-col text-sm gap-2">
      <div className="border border-[#808080] bg-[#000080] text-[#75D5DC] p-2 text-center" style={{ fontFamily: 'VT323, monospace', fontSize: 28 }}>
        {now.toLocaleTimeString()}
      </div>
      <div className="border border-[#808080] bg-white p-2">
        <div className="text-[11px] font-bold mb-1">Add Alarm</div>
        <div className="flex flex-wrap gap-1 items-center">
          <input className="retro-input" type="time" value={timeInput} onChange={e => setTimeInput(e.target.value)} />
          <input className="retro-input flex-1 min-w-[80px]" placeholder="Label" value={labelInput} onChange={e => setLabelInput(e.target.value)} />
          <button className="retro-btn" onClick={addAlarm}>Add</button>
        </div>
      </div>
      <div className="flex-1 overflow-auto space-y-1">
        {alarms.length === 0 && <div className="text-[12px] text-gray-600">No alarms set.</div>}
        {alarms.map(a => (
          <div key={a.id} className="border border-[#808080] bg-white p-2 flex justify-between items-center">
            <div>
              <div className="font-bold" style={{ fontFamily: 'VT323, monospace', fontSize: 20 }}>{a.time}</div>
              <div className="text-[11px] text-gray-600">{a.label}</div>
            </div>
            <div className="flex gap-1 items-center">
              <label className="text-[11px]"><input type="checkbox" checked={a.enabled} onChange={() => toggle(a.id)} /> On</label>
              <button className="retro-btn text-[11px]" onClick={() => remove(a.id)}>X</button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-gray-500">Alarms are visual only (no system notifications).</div>
    </div>
  )
}
