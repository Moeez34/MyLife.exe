import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001

app.post('/api/buddy', async (req, res) => {
  const message = (req.body && req.body.message) || ''
  if (!message.trim()) {
    return res.status(400).json({ reply: 'Say something first! ~' })
  }

  const apiKey = process.env.AI_API_KEY
  if (!apiKey) {
    return res.status(503).json({ reply: null, error: 'No AI_API_KEY set on server.' })
  }

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are Buddy.exe, a friendly, slightly nerdy, nostalgic Y2K desktop companion. Keep replies short (1-3 sentences), playful, and helpful (planning, ideas, journaling, breaking tasks). Use casual tone with tiny emoji sparingly.' },
          { role: 'user', content: message },
        ],
        max_tokens: 150,
      }),
    })
    if (!r.ok) {
      const t = await r.text()
      console.error('OpenAI error:', r.status, t)
      return res.status(502).json({ reply: null, error: 'AI provider error.' })
    }
    const data = await r.json()
    const reply = data.choices?.[0]?.message?.content?.trim() || '...beep boop, no reply.'
    return res.json({ reply })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ reply: null, error: 'Server error.' })
  }
})

app.listen(PORT, () => {
  console.log(`Buddy backend running on http://localhost:${PORT}`)
})
