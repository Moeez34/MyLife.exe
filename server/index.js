import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001

// YouTube API helpers
const YT_KEY = () => process.env.YOUTUBE_API_KEY

app.get('/api/youtube/search', async (req, res) => {
  const q = (req.query.q || '').toString().trim()
  const pageToken = (req.query.pageToken || '').toString()
  if (!q) return res.status(400).json({ error: 'Missing query' })
  const key = YT_KEY()
  if (!key) return res.status(503).json({ error: 'Missing YOUTUBE_API_KEY' })
  try {
    const params = new URLSearchParams({ part: 'snippet', q, type: 'video', maxResults: '12', key })
    if (pageToken) params.set('pageToken', pageToken)
    const r = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`)
    if (!r.ok) {
      const t = await r.text()
      console.error('YT search error:', r.status, t)
      return res.status(502).json({ error: 'YouTube API error' })
    }
    const data = await r.json()
    res.json(data)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/youtube/video', async (req, res) => {
  const id = (req.query.id || '').toString().trim()
  if (!id) return res.status(400).json({ error: 'Missing id' })
  const key = YT_KEY()
  if (!key) return res.status(503).json({ error: 'Missing YOUTUBE_API_KEY' })
  try {
    const params = new URLSearchParams({ part: 'snippet,contentDetails,statistics', id, key })
    const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`)
    if (!r.ok) {
      const t = await r.text()
      console.error('YT video error:', r.status, t)
      return res.status(502).json({ error: 'YouTube API error' })
    }
    const data = await r.json()
    res.json(data)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/youtube/related', async (req, res) => {
  const videoId = (req.query.videoId || '').toString().trim()
  if (!videoId) return res.status(400).json({ error: 'Missing videoId' })
  const key = YT_KEY()
  if (!key) return res.status(503).json({ error: 'Missing YOUTUBE_API_KEY' })
  try {
    const params = new URLSearchParams({ part: 'snippet', relatedToVideoId: videoId, type: 'video', maxResults: '10', key })
    const r = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`)
    if (!r.ok) {
      const t = await r.text()
      console.error('YT related error:', r.status, t)
      return res.status(502).json({ error: 'YouTube API error' })
    }
    const data = await r.json()
    res.json(data)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/buddy', async (req, res) => {
  const message = (req.body && req.body.message) || ''
  if (!message.trim()) {
    return res.status(400).json({ reply: 'Say something first! ~' })
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.AI_API_KEY
  if (!apiKey) {
    return res.status(503).json({ reply: null, error: 'No GROQ_API_KEY (or AI_API_KEY) set on server.' })
  }

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are Buddy.exe, a friendly, slightly nerdy, nostalgic Y2K desktop companion. Keep replies short (1-3 sentences), playful, and helpful (planning, ideas, journaling, breaking tasks). Use casual tone with tiny emoji sparingly.' },
          { role: 'user', content: message },
        ],
        max_tokens: 150,
      }),
    })
    if (!r.ok) {
      const t = await r.text()
      console.error('Groq error:', r.status, t)
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
