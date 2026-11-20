import { useState } from 'react'

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState<number | null>(null)
  const [op, setOp] = useState<string | null>(null)
  const [resetNext, setResetNext] = useState(false)

  const inputNum = (n: string) => {
    if (resetNext) { setDisplay(n); setResetNext(false); return }
    setDisplay(d => (d === '0' ? n : d + n))
  }

  const inputDot = () => {
    if (resetNext) { setDisplay('0.'); setResetNext(false); return }
    if (!display.includes('.')) setDisplay(d => d + '.')
  }

  const doOp = (nextOp: string) => {
    const cur = parseFloat(display)
    if (prev !== null && op && !resetNext) {
      const result = compute(prev, cur, op)
      setDisplay(String(result))
      setPrev(result)
    } else {
      setPrev(cur)
    }
    setOp(nextOp)
    setResetNext(true)
  }

  const compute = (a: number, b: number, o: string) => {
    if (o === '+') return a + b
    if (o === '-') return a - b
    if (o === '*') return a * b
    if (o === '/') return b === 0 ? NaN : a / b
    return b
  }

  const equals = () => {
    if (op === null || prev === null) return
    const cur = parseFloat(display)
    const result = compute(prev, cur, op)
    setDisplay(String(result))
    setPrev(null)
    setOp(null)
    setResetNext(true)
  }

  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); setResetNext(false) }

  const btn = 'retro-btn h-10 text-sm font-bold'
  return (
    <div className="h-full flex flex-col gap-2 p-1" style={{ maxWidth: 280 }}>
      <div className="retro-input text-right text-xl px-2 py-2 bg-white" style={{ fontFamily: 'Consolas, monospace' }}>{display}</div>
      <div className="grid grid-cols-4 gap-1">
        <button className={btn} onClick={clear}>C</button>
        <button className={btn} onClick={() => setDisplay(d => (d.length > 1 ? d.slice(0, -1) : '0'))}>←</button>
        <button className={btn} onClick={() => doOp('/')}>÷</button>
        <button className={btn} onClick={() => doOp('*')}>×</button>
        {['7','8','9'].map(n => <button key={n} className={btn} onClick={() => inputNum(n)}>{n}</button>)}
        <button className={btn} onClick={() => doOp('-')}>−</button>
        {['4','5','6'].map(n => <button key={n} className={btn} onClick={() => inputNum(n)}>{n}</button>)}
        <button className={btn} onClick={() => doOp('+')}>+</button>
        {['1','2','3'].map(n => <button key={n} className={btn} onClick={() => inputNum(n)}>{n}</button>)}
        <button className={`${btn} row-span-2`} style={{ gridRow: 'span 2' }} onClick={equals}>=</button>
        <button className={`${btn} col-span-2`} style={{ gridColumn: 'span 2' }} onClick={() => inputNum('0')}>0</button>
        <button className={btn} onClick={inputDot}>.</button>
      </div>
    </div>
  )
}
