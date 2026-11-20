import { useState } from 'react'
import { useYouTubeStore, YTVideoSummary } from '../store/useYouTubeStore'

type View = 'home' | 'search' | 'player' | 'favorites' | 'mixtapes' | 'history'

const classicVideos: YTVideoSummary[] = [
  { videoId: 'jNQXAC9IVRw', title: 'Me at the zoo (2005)', channelTitle: 'jawed', thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg' },
  { videoId: 'dMH0bHeiRNg', title: 'Evolution of Dance (2006)', channelTitle: 'Judson Laipply', thumbnail: 'https://i.ytimg.com/vi/dMH0bHeiRNg/mqdefault.jpg' },
  { videoId: 'FzRH3iTQPrk', title: 'Sneezing Baby Panda (2006)', channelTitle: 'screensongs', thumbnail: 'https://i.ytimg.com/vi/FzRH3iTQPrk/mqdefault.jpg' },
  { videoId: 'EwTZ2xpQwpA', title: 'Chocolate Rain (2007)', channelTitle: 'Tay Zonday', thumbnail: 'https://i.ytimg.com/vi/EwTZ2xpQwpA/mqdefault.jpg' },
  { videoId: 'g4Hbz2jLxvQ', title: 'Charlie bit my finger (2007)', channelTitle: 'HDCYT', thumbnail: 'https://i.ytimg.com/vi/g4Hbz2jLxvQ/mqdefault.jpg' },
  { videoId: 'kHmvkRoEowc', title: 'Leave Britney Alone! (2007)', channelTitle: 'Chris Crocker', thumbnail: 'https://i.ytimg.com/vi/kHmvkRoEowc/mqdefault.jpg' },
  { videoId: 'cP12ZTL1WWw', title: 'The Landlord (2007)', channelTitle: 'Funny Or Die', thumbnail: 'https://i.ytimg.com/vi/cP12ZTL1WWw/mqdefault.jpg' },
  { videoId: 'J---aiyznGQ', title: 'Keyboard Cat! (2007)', channelTitle: 'Charlie Schmidt', thumbnail: 'https://i.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg' },
]

export default function YouTubeApp() {
  const [view, setView] = useState<View>('home')
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentVideo, setCurrentVideo] = useState<YTVideoSummary | null>(null)
  const [currentVideoDetails, setCurrentVideoDetails] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])

  const { favorites, addFavorite, removeFavorite, history, addToHistory, mixtapes, createMixtape, addToMixtape, addSearchHistory } = useYouTubeStore()

  const doSearch = async (q?: string) => {
    const term = (q ?? query).trim()
    if (!term) return
    setLoading(true)
    setError(null)
    setView('search')
    addSearchHistory(term)
    try {
      const r = await fetch(`/api/youtube/search?q=${encodeURIComponent(term)}`)
      const data = await r.json()
      if (!r.ok) {
        setError(data.error || 'Search failed. Check YOUTUBE_API_KEY on server.')
        setSearchResults([])
      } else {
        const items = (data.items || []).map((it: any) => ({
          videoId: it.id?.videoId,
          title: it.snippet?.title || 'Untitled',
          channelTitle: it.snippet?.channelTitle || '',
          thumbnail: it.snippet?.thumbnails?.medium?.url || it.snippet?.thumbnails?.default?.url || '',
          publishedAt: it.snippet?.publishedAt,
        })).filter((v: any) => v.videoId)
        setSearchResults(items)
      }
    } catch (e) {
      setError('Network error. Is the backend running?')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const openVideo = async (v: YTVideoSummary) => {
    setCurrentVideo(v)
    setCurrentVideoDetails(null)
    setRelated([])
    setView('player')
    addToHistory(v)
    try {
      const r = await fetch(`/api/youtube/video?id=${encodeURIComponent(v.videoId)}`)
      const data = await r.json()
      if (r.ok && data.items?.[0]) setCurrentVideoDetails(data.items[0])
    } catch { /* ignore */ }
    try {
      const r2 = await fetch(`/api/youtube/related?videoId=${encodeURIComponent(v.videoId)}`)
      const d2 = await r2.json()
      if (r2.ok && d2.items) {
        const rel = d2.items.map((it: any) => ({
          videoId: it.id?.videoId,
          title: it.snippet?.title || 'Untitled',
          channelTitle: it.snippet?.channelTitle || '',
          thumbnail: it.snippet?.thumbnails?.default?.url || '',
        })).filter((x: any) => x.videoId)
        setRelated(rel)
      }
    } catch { /* ignore */ }
  }

  const isFav = currentVideo ? favorites.some(f => f.videoId === currentVideo.videoId) : false

  return (
    <div className="h-full flex flex-col text-sm bg-[#f1f1f1]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-[#ccc] px-2 py-2 flex items-center gap-2 flex-wrap">
        <button className="flex items-center shrink-0" onClick={() => setView('home')}>
          <span className="bg-[#cc181e] text-white font-bold px-2 py-0.5 text-base" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>You</span>
          <span className="bg-white text-black font-bold px-1 py-0.5 text-base border border-[#ccc] border-l-0" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>Tube</span>
        </button>
        <div className="flex flex-1 min-w-[180px] gap-1">
          <input
            className="flex-1 border border-[#999] px-2 py-1 text-sm"
            placeholder="Search videos"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
          />
          <button className="px-2 py-1 border border-[#999] bg-[#f8f8f8]" onClick={() => doSearch()}>Search</button>
        </div>
        <div className="flex gap-1 flex-wrap text-[11px]">
          <button className="underline text-[#0033cc]" onClick={() => setView('home')}>Home</button>
          <button className="underline text-[#0033cc]" onClick={() => setView('favorites')}>Favorites</button>
          <button className="underline text-[#0033cc]" onClick={() => setView('mixtapes')}>My Mixtapes</button>
          <button className="underline text-[#0033cc]" onClick={() => setView('history')}>History</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {view === 'home' && (
          <div>
            <div className="text-[#cc181e] font-bold mb-2">Featured Classics (2000s)</div>
            <p className="text-[12px] mb-3">A few legendary old YouTube videos. Click to play!</p>
            <div className="space-y-2">
              {classicVideos.map(v => (
                <div key={v.videoId} className="flex gap-2 bg-white border border-[#ccc] p-2 cursor-pointer hover:border-[#999]" onClick={() => openVideo(v)}>
                  <img src={v.thumbnail} alt="" className="w-[120px] h-[90px] object-cover" />
                  <div className="min-w-0">
                    <div className="text-[#0033cc] font-bold text-sm">{v.title}</div>
                    <div className="text-[11px] text-[#666]">{v.channelTitle}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-[#666] border border-[#ccc] bg-white p-2 mt-3">
              Tip: set <code>YOUTUBE_API_KEY</code> in server <code>.env</code> for live search.
            </div>
          </div>
        )}

        {view === 'search' && (
          <div>
            <div className="font-bold mb-2">Search results for: {query || '(empty)'}</div>
            {loading && <div className="text-[12px]">Searching the web...</div>}
            {error && <div className="text-[12px] text-red-700 border border-red-300 bg-red-50 p-2">{error}</div>}
            {!loading && !error && searchResults.length === 0 && <div className="text-[12px]">No results.</div>}
            <div className="space-y-2">
              {searchResults.map(v => (
                <div key={v.videoId} className="flex gap-2 bg-white border border-[#ccc] p-2 cursor-pointer hover:border-[#999]" onClick={() => openVideo(v)}>
                  {v.thumbnail && <img src={v.thumbnail} alt="" className="w-[120px] h-[90px] object-cover" />}
                  <div className="min-w-0">
                    <div className="text-[#0033cc] font-bold text-sm">{v.title}</div>
                    <div className="text-[11px] text-[#666]">{v.channelTitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'player' && currentVideo && (
          <div>
            <button className="underline text-[#0033cc] text-[11px] mb-2" onClick={() => setView('search')}>← Back to results</button>
            <div className="bg-black border border-[#333] mb-2" style={{ aspectRatio: '16/9' }}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none' }}
              />
            </div>
            <div className="font-bold text-base">{currentVideo.title}</div>
            <div className="text-[12px] text-[#666]">{currentVideo.channelTitle}</div>
            {currentVideoDetails?.snippet?.description && (
              <div className="text-[12px] mt-2 whitespace-pre-wrap border border-[#ccc] bg-white p-2 max-h-32 overflow-auto">{currentVideoDetails.snippet.description.slice(0, 500)}{currentVideoDetails.snippet.description.length > 500 ? '...' : ''}</div>
            )}
            <div className="flex gap-2 mt-2 flex-wrap">
              <button
                className="retro-btn text-[11px]"
                onClick={() => {
                  if (!currentVideo) return
                  if (isFav) removeFavorite(currentVideo.videoId)
                  else addFavorite(currentVideo)
                }}
              >
                {isFav ? '★ Unfavorite' : '☆ Favorite'}
              </button>
              <select
                className="retro-input text-[11px]"
                defaultValue=""
                onChange={e => {
                  if (!currentVideo || !e.target.value) return
                  addToMixtape(e.target.value, currentVideo)
                  e.target.value = ''
                }}
              >
                <option value="">Add to Mixtape...</option>
                {mixtapes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <button className="retro-btn text-[11px]" onClick={() => { const name = prompt('New mixtape name?'); if (name) createMixtape(name) }}>+ New Mixtape</button>
            </div>
            {related.length > 0 && (
              <div className="mt-3">
                <div className="font-bold text-[12px] mb-1">Related</div>
                <div className="space-y-1">
                  {related.slice(0, 6).map(r => (
                    <div key={r.videoId} className="text-[11px] text-[#0033cc] underline cursor-pointer" onClick={() => openVideo(r)}>{r.title}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'favorites' && (
          <div>
            <div className="font-bold mb-2">Favorites</div>
            {favorites.length === 0 && <div className="text-[12px]">No favorites yet.</div>}
            <div className="space-y-2">
              {favorites.map(v => (
                <div key={v.videoId} className="flex gap-2 bg-white border border-[#ccc] p-2">
                  {v.thumbnail && <img src={v.thumbnail} alt="" className="w-[100px] h-[75px] object-cover cursor-pointer" onClick={() => openVideo(v)} />}
                  <div className="flex-1 min-w-0">
                    <div className="text-[#0033cc] font-bold text-sm cursor-pointer" onClick={() => openVideo(v)}>{v.title}</div>
                    <div className="text-[11px] text-[#666]">{v.channelTitle}</div>
                    <button className="retro-btn text-[10px] mt-1" onClick={() => removeFavorite(v.videoId)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'mixtapes' && (
          <div>
            <div className="font-bold mb-2">My Mixtapes</div>
            <button className="retro-btn text-[11px] mb-2" onClick={() => { const name = prompt('Mixtape name?'); if (name) createMixtape(name) }}>+ Create Mixtape</button>
            {mixtapes.length === 0 && <div className="text-[12px]">No mixtapes yet.</div>}
            <div className="space-y-2">
              {mixtapes.map(m => (
                <div key={m.id} className="border border-[#ccc] bg-white p-2">
                  <div className="font-bold">{m.name}</div>
                  <div className="text-[11px] text-[#666]">{m.videoIds.length} video(s)</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'history' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold">Recently Viewed</div>
              <button className="retro-btn text-[11px]" onClick={() => useYouTubeStore.getState().clearHistory()}>Clear</button>
            </div>
            {history.length === 0 && <div className="text-[12px]">No history yet.</div>}
            <div className="space-y-2">
              {history.map(v => (
                <div key={v.videoId + v.watchedAt} className="flex gap-2 bg-white border border-[#ccc] p-2">
                  {v.thumbnail && <img src={v.thumbnail} alt="" className="w-[100px] h-[75px] object-cover cursor-pointer" onClick={() => openVideo(v)} />}
                  <div className="flex-1 min-w-0">
                    <div className="text-[#0033cc] font-bold text-sm cursor-pointer" onClick={() => openVideo(v)}>{v.title}</div>
                    <div className="text-[11px] text-[#666]">{v.channelTitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
