import { useDataStore } from '../store/useDataStore'

export default function RecycleBinApp() {
  const { recycle, restoreFromRecycle, permanentlyDelete, emptyRecycle } = useDataStore()

  return (
    <div className="h-full flex flex-col text-sm gap-2">
      <div className="flex gap-2">
        <button className="retro-btn" onClick={emptyRecycle} disabled={recycle.length === 0}>Empty Recycle Bin</button>
      </div>
      <div className="text-[11px]">{recycle.length} item(s)</div>
      <div className="flex-1 overflow-auto space-y-2">
        {recycle.length === 0 && <div className="text-gray-600 text-[12px]">Recycle Bin is empty.</div>}
        {recycle.map(item => (
          <div key={item.id} className="border border-[#808080] bg-white p-2 flex justify-between items-start gap-2">
            <div>
              <div className="font-bold text-[12px]">{item.kind === 'note' ? '📝 Note' : '🎯 Goal'}</div>
              <div className="text-[12px]">{(item.data as any).title || 'Untitled'}</div>
              <div className="text-[10px] text-gray-600">Deleted: {new Date(item.deletedAt).toLocaleString()}</div>
            </div>
            <div className="flex flex-col gap-1">
              <button className="retro-btn text-[11px]" onClick={() => restoreFromRecycle(item.id)}>Restore</button>
              <button className="retro-btn text-[11px]" onClick={() => permanentlyDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
