import { User, Bot, FileText } from 'lucide-react'

export default function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-pop-in`}>
      <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm transition-all ${
        isUser 
          ? 'bg-bubble-primary text-white rounded-br-none' 
          : 'bg-white text-bubble-text rounded-bl-none border border-slate-100'
      }`}>
        <div className="flex items-center gap-2 mb-1 text-xs opacity-70 font-medium uppercase tracking-wide">
          {isUser ? <User size={12} /> : <Bot size={12} />}
          <span>{isUser ? 'Вы' : 'BubbleAI'}</span>
          {msg.type === 'file' && <FileText size={12} />}
          {msg.fileName && <span className="ml-1 opacity-80">({msg.fileName})</span>}
        </div>
        <p className="leading-relaxed whitespace-pre-wrap text-[15px]">{msg.content}</p>
      </div>
    </div>
  )
}