import { useState } from 'react'

export default function CalendarApp() {
  const [viewDate, setViewDate] = useState(() => new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const today = new Date()

  return (
    <div className="h-full flex flex-col text-sm p-1">
      <div className="flex items-center justify-between mb-2">
        <button className="retro-btn" onClick={prevMonth}>◀</button>
        <div className="font-bold">{monthNames[month]} {year}</div>
        <button className="retro-btn" onClick={nextMonth}>▶</button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-black border border-black text-center">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="bg-[#d4d0c8] text-[11px] py-1 font-bold">{d}</div>
        ))}
        {cells.map((c, i) => {
          const isToday = c && year === today.getFullYear() && month === today.getMonth() && c === today.getDate()
          return (
            <div key={i} className={`bg-white min-h-[36px] py-1 ${isToday ? 'bg-[#F5CF72] font-bold' : ''}`}>
              {c || ''}
            </div>
          )
        })}
      </div>
      <div className="mt-2 text-[11px] text-gray-600">Today: {today.toLocaleDateString()}</div>
    </div>
  )
}
