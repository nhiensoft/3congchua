import { useEffect, useRef, useState } from 'react'
import { X, MessageCircle, Send, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `Bạn là trợ lý AI của dự án "Vọng Âm Quá Khứ – 3 Công Chúa", một dự án giáo dục số kết hợp di sản văn hóa Việt Nam với Đại Học Mở Hà Nội (HOU).

Bạn hiểu biết sâu về:
- **Thanh Hóa**: Thành Nhà Hồ, Lam Kinh, trống đồng Đông Sơn, Nàm Chua đặc sản.
- **Quảng Ninh**: Vịnh Hạ Long (Di sản UNESCO), Yên Tử, Chả Mực Hạ Long.
- **Hưng Yên**: Phố Hiến thương cảng xưa, vườn nhãn cổ thụ, Long nhãn tiến vua.
- **Đại Học Mở Hà Nội (HOU)**: Ngành Quản trị Kinh doanh, cơ hội nghề nghiệp, tuyển sinh tại tuyensinh.hou.edu.vn.
- **Giao lộ định mệnh**: Mối liên kết văn hóa – lịch sử giữa 3 tỉnh.

Trả lời thân thiện, ngắn gọn, bằng tiếng Việt. Nếu không liên quan đến dự án, hãy nhẹ nhàng hướng người dùng về các chủ đề trên.`

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Xin chào! Tôi là trợ lý của dự án 3 Công Chúa 👋 Bạn muốn khám phá di sản Thanh Hóa, Quảng Ninh, Hưng Yên hay tìm hiểu về Đại Học Mở?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [open, messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://api.kie.ai/gemini-3.1-pro/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_KIE_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gemini-3.1-pro',
          stream: false,
          messages: [
            { role: 'user', content: SYSTEM_PROMPT },
            { role: 'assistant', content: 'Tôi hiểu rồi. Tôi sẽ trả lời theo đúng vai trò trợ lý của dự án 3 Công Chúa.' },
            ...newMessages,
          ],
        }),
      })

      const data = await res.json()
      const reply: string = data?.choices?.[0]?.message?.content ?? 'Xin lỗi, tôi không nhận được phản hồi. Bạn thử lại nhé!'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Có lỗi kết nối. Bạn vui lòng thử lại sau nhé!' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
        aria-label="Mở chat AI"
      >
        {open ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-80 sm:w-96 flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{ height: '480px', background: 'rgba(15, 10, 30, 0.97)', border: '1px solid rgba(168, 85, 247, 0.3)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">✨</div>
            <div>
              <p className="text-sm font-bold text-white">Trợ lý 3 Công Chúa</p>
              <p className="text-xs text-purple-100">Gemini 3.1 Pro · Luôn sẵn sàng</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap"
                  style={
                    msg.role === 'user'
                      ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }
                      : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(168,85,247,0.2)' }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
                  <span className="text-white/60">Đang suy nghĩ...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-purple-800/30 px-3 py-2.5">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Nhập câu hỏi..."
              disabled={loading}
              className="flex-1 rounded-xl border border-purple-700/30 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500/60 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition hover:opacity-80 disabled:opacity-30"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
