import { Send, Mic, Paperclip, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function InputArea({ input, setInput, onSend, isLoading }) {
  const [isListening, setIsListening] = useState(false)

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Ваш браузер не поддерживает голосовой ввод. Попробуйте Chrome или Edge.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'ru-RU'
    recognition.interimResults = false
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript
      setInput(prev => prev + (prev ? ' ' : '') + text)
    }
    recognition.start()
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      onSend(input || `Проанализируй прикрепленный файл: ${file.name}`, file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSend(input)
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-2 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-bubble-primary/30">
      <button type="button" onClick={startVoice} className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-500 animate-pulse scale-110' : 'hover:bg-slate-100 text-bubble-muted'}`}>
        <Mic size={20} />
      </button>
      
      <label className="p-2 rounded-xl hover:bg-slate-100 text-bubble-muted cursor-pointer transition-colors">
        <Paperclip size={20} />
        <input type="file" className="hidden" onChange={handleFile} accept=".pdf,.txt,.docx,.png,.jpg,.jpeg" />
      </label>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Напишите сообщение или используйте голос..."
        className="flex-1 bg-transparent border-none outline-none text-bubble-text placeholder-bubble-muted/50 py-2 text-[15px]"
        disabled={isLoading}
      />

      <button 
        type="submit" 
        disabled={isLoading || !input.trim()}
        className="p-2.5 rounded-xl bg-bubble-primary text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
      >
        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
      </button>
    </form>
  )
}