import { useState } from 'react'
import { useDataStore, Goal } from '../store/useDataStore'

export default function GoalsApp() {
  const { goals, addGoal, updateGoal, deleteGoal } = useDataStore()
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [category, setCategory] = useState<Goal['category']>('Personal')
  const [progress, setProgress] = useState(0)

  const handleAdd = () => {
    if (!title.trim()) return
    addGoal({ title: title.trim(), deadline, category, completed: false, progress })
    setTitle('')
    setDeadline('')
    setProgress(0)
  }

  const completedCount = goals.filter(g => g.completed).length
  const pct = goals.length ? Math.round((completedCount / goals.length) * 100) : 0

  return (
    <div className="h-full flex flex-col text-sm gap-2">
      <div className="border border-[#808080] bg-white p-2">
        <div className="text-[11px] font-bold mb-1">Add Goal</div>
        <div className="flex flex-wrap gap-1 items-center">
          <input className="retro-input flex-1 min-w-[120px]" placeholder="Goal title" value={title} onChange={e => setTitle(e.target.value)} />
          <input className="retro-input" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
          <select className="retro-input" value={category} onChange={e => setCategory(e.target.value as Goal['category'])}>
            <option>Learning</option>
            <option>Career</option>
            <option>Health</option>
            <option>Personal</option>
          </select>
          <label className="text-[11px]">Prog</label>
          <input className="w-16 retro-input" type="number" min={0} max={100} value={progress} onChange={e => setProgress(Number(e.target.value))} />
          <button className="retro-btn" onClick={handleAdd}>Add</button>
        </div>
      </div>

      <div className="border border-[#808080] bg-[#f5f5f5] p-2">
        <div className="flex justify-between text-[11px] mb-1">
          <span>Overall progress</span>
          <span>{completedCount}/{goals.length} done ({pct}%)</span>
        </div>
        <div className="w-full h-4 border border-[#808080] bg-white">
          <div className="h-full bg-[#75D5DC]" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-2">
        {goals.length === 0 && <div className="text-[12px] text-gray-600">No goals yet. Add one above!</div>}
        {goals.map(g => (
          <div key={g.id} className="border border-[#808080] bg-white p-2">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={g.completed}
                onChange={e => updateGoal(g.id, { completed: e.target.checked, progress: e.target.checked ? 100 : g.progress })}
              />
              <div className="flex-1 min-w-0">
                <div className={`font-bold ${g.completed ? 'line-through text-gray-500' : ''}`}>{g.title}</div>
                <div className="text-[11px] text-gray-600">{g.category} {g.deadline ? `• due ${g.deadline}` : ''}</div>
                <div className="mt-1">
                  <div className="w-full h-3 border border-[#808080] bg-[#E7E1DA]">
                    <div className="h-full bg-[#C9B3F2]" style={{ width: `${g.progress}%` }} />
                  </div>
                  <div className="text-[10px]">{g.progress}%</div>
                </div>
                <div className="flex gap-1 mt-1 items-center">
                  <input
                    className="w-16 retro-input text-[11px]"
                    type="number"
                    min={0}
                    max={100}
                    value={g.progress}
                    onChange={e => updateGoal(g.id, { progress: Math.min(100, Math.max(0, Number(e.target.value))), completed: Number(e.target.value) >= 100 })}
                  />
                  <button className="retro-btn text-[11px]" onClick={() => deleteGoal(g.id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
