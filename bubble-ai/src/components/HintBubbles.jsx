export default function HintBubbles({ hint, visible }) {
  if (!visible) return null
  return (
    <div className="absolute top-24 right-4 z-50 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-3 shadow-lg max-w-[260px] animate-float">
        <p className="text-sm text-bubble-text font-medium leading-snug">{hint}</p>
      </div>
    </div>
  )
}