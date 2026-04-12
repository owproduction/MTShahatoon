import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import { Loader2 } from 'lucide-react'

export default function ChatInterface({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <>
      {messages.map(msg => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
      {isLoading && (
        <div className="flex items-center gap-2 text-bubble-muted text-sm ml-2 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>BubbleAI думает...</span>
        </div>
      )}
      <div ref={bottomRef} />
    </>
  )
}