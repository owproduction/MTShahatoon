import { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import InputArea from './components/InputArea'
import HintBubbles from './components/HintBubbles'

function App() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: 'Привет! Я BubbleAI. Я сам подберу нужную модель под вашу задачу. Просто напишите, скажите голосом или прикрепите файл 🚀', type: 'text' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeHint, setActiveHint] = useState(0)
  const [showHint, setShowHint] = useState(true)

  const hints = [
    "💡 Нажмите 🎤, чтобы надиктовать сообщение",
    "📎 Прикрепите файл — я проанализирую его содержимое",
    "🌐 Напишите 'найди в интернете', и я включу поиск",
    "🔄 Я автоматически выбираю лучшую модель для вашей задачи",
    "💾 Вся история сохраняется, я помню контекст диалога"
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setShowHint(false)
      setTimeout(() => {
        setActiveHint(prev => (prev + 1) % hints.length)
        setShowHint(true)
      }, 300)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const sendMessage = async (text, file = null) => {
    if (!text.trim() && !file) return
    
    const userMsg = { id: Date.now(), role: 'user', content: text, type: file ? 'file' : 'text', fileName: file?.name }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpthub-smart',
          messages: [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: text }]
        })
      })

      const data = await response.json()
      const aiContent = data.choices?.[0]?.message?.content || "Извините, произошла ошибка при обработке запроса."
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: aiContent, type: 'text' }])
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: '⚠️ Не удалось связаться с сервером. Проверьте, запущен ли backend.', type: 'text' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 relative">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bubble-primary to-bubble-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg animate-float">B</div>
          <div>
            <h1 className="text-xl font-bold text-bubble-text tracking-tight">BubbleAI</h1>
            <p className="text-xs text-bubble-muted">Единое пространство для задач с ИИ</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-bubble-accent/10 text-bubble-accent text-xs font-medium border border-bubble-accent/20 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-bubble-accent animate-pulse"></span>
          Онлайн
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-hide mb-4 space-y-4 pr-2">
        <ChatInterface messages={messages} isLoading={isLoading} />
      </div>

      <HintBubbles hint={hints[activeHint]} visible={showHint} />

      <InputArea 
        input={input} 
        setInput={setInput} 
        onSend={sendMessage} 
        isLoading={isLoading} 
      />
    </div>
  )
}

export default App