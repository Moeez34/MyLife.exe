export default function YouTubeApp() {
  const videos = [
    { title: 'My Cat Does Funny Things (2006)', views: '1,234,567 views', date: 'Aug 12, 2006' },
    { title: 'Epic Fail Compilation Vol.1', views: '987,654 views', date: 'Jul 3, 2006' },
    { title: 'How to Make a Paper Airplane', views: '456,789 views', date: 'Jun 21, 2006' },
    { title: 'Bedroom Guitar Cover - My Immortal', views: '321,000 views', date: 'May 15, 2006' },
  ]

  return (
    <div className="h-full flex flex-col text-sm bg-[#f1f1f1]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-white border-b border-[#ccc] px-3 py-2 flex items-center gap-3 flex-wrap">
        <div className="flex items-center">
          <span className="bg-[#cc181e] text-white font-bold px-2 py-0.5 text-lg" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>You</span>
          <span className="bg-white text-black font-bold px-1 py-0.5 text-lg border border-[#ccc] border-l-0" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>Tube</span>
        </div>
        <div className="flex flex-1 min-w-[200px] gap-1">
          <input className="flex-1 border border-[#999] px-2 py-1 text-sm" placeholder="Search" style={{ background: '#fff' }} />
          <button className="px-3 py-1 border border-[#999] bg-[#f8f8f8] text-sm">Search</button>
        </div>
      </div>
      <div className="p-3 flex-1 overflow-auto">
        <div className="text-[#cc181e] font-bold text-base mb-2">Videos</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {videos.map((v, i) => (
            <div key={i} className="bg-white border border-[#ccc] p-2 flex gap-2 cursor-pointer hover:border-[#999]">
              <div className="w-[120px] h-[90px] bg-[#333] flex items-center justify-center text-white text-xs shrink-0">▶ {i + 1}</div>
              <div className="min-w-0">
                <div className="text-[#0033cc] font-bold text-sm leading-tight">{v.title}</div>
                <div className="text-[11px] text-[#666] mt-1">{v.views}</div>
                <div className="text-[11px] text-[#666]">{v.date}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-[11px] text-[#666] border-t border-[#ccc] pt-2">
          © 2006 YouTube, Inc. (retro mock in MyLife.exe)
        </div>
      </div>
    </div>
  )
}
