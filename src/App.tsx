import { Viewer as PSViewer } from '@photo-sphere-viewer/core'
import '@photo-sphere-viewer/core/index.css'
import { useEffect, useRef, useState, useContext, createContext, type ReactNode, type ComponentType } from 'react'
import ChatWidget from './components/ChatWidget'
import {
  Landmark, Waves, Wheat, GraduationCap,
  Leaf, ShieldCheck, Truck,
  Brain, Star, PartyPopper,
  Heart, Phone, MapPin,
  Menu as MenuIcon, X as XIcon, Gift,
  ChevronLeft, ChevronRight,
  TrendingUp,
  Award, Users, Trophy,
  ShoppingCart, Plus, Minus, Trash2,
  type LucideProps,
} from 'lucide-react'

/* ====================================================================
   TYPES
   ==================================================================== */
type Province = 'thanh-hoa' | 'quang-ninh' | 'hung-yen'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  accentColor: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  totalCount: number
  totalPrice: number
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...item, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id: string) => setItems(prev => prev.filter(i => i.id !== id))
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }
  const clearCart = () => setItems([])
  const totalCount = items.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalCount, totalPrice, cartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  )
}

/* ====================================================================
   CONSTANTS
   ==================================================================== */
const NAV_ITEMS = [
  { label: 'Giới thiệu', href: '#gioi-thieu' },
  { label: 'Thanh Hóa', href: '#thanh-hoa' },
  { label: 'Quảng Ninh', href: '#quang-ninh' },
  { label: 'Hưng Yên', href: '#hung-yen' },
  { label: 'Giao Lộ', href: '#giao-lo-dinh-menh' },
  { label: 'Đại Học Mở', href: '#dai-hoc-mo' },
  { label: 'Liên Hệ', href: '#lien-he' },
]

const SIDE_NAV_ITEMS: { id: string; label: string; Icon: ComponentType<LucideProps>; color: string }[] = [
  { id: 'thanh-hoa', label: 'Thanh Hóa', Icon: Landmark, color: '#dc2626' },
  { id: 'quang-ninh', label: 'Quảng Ninh', Icon: Waves, color: '#0891b2' },
  { id: 'hung-yen', label: 'Hưng Yên', Icon: Wheat, color: '#d97706' },
  { id: 'dai-hoc-mo', label: 'Đại Học Mở', Icon: GraduationCap, color: '#059669' },
  { id: 'lien-he', label: 'Liên Hệ', Icon: Phone, color: '#8b5cf6' },
]

const PRINCESSES = [
  {
    id: 'thanh-hoa' as Province,
    name: 'Công chúa Đất Việt',
    province: 'Thanh Hóa',
    quote: '"Em là công chúa đất Việt - Thanh Hoá! Nơi khởi nguồn của những triều đại huy hoàng."',
    image: '/thanh-hoa.jpg',
  },
  {
    id: 'quang-ninh' as Province,
    name: 'Công chúa Biển Xanh',
    province: 'Quảng Ninh',
    quote: '"Quảng Ninh với Vịnh Hạ Long kỳ vĩ và những truyền thuyết hấp dẫn luôn khiến lòng người mê đắm."',
    image: '/quang-ninh.png',
  },
  {
    id: 'hung-yen' as Province,
    name: 'Công chúa Đất Lúa',
    province: 'Hưng Yên',
    quote: '"Hưng Yên, Phố Hiến xưa, nơi lưu giữ những nét đẹp văn hóa độc đáo và những đặc sản trứ danh."',
    image: '/hung-yen.jpg',
  },
]

const QUIZ_QUESTIONS = [
  { q: 'Thành Nhà Hồ được xây dựng vào năm nào?', options: ['1397', '1400', '1428'], answer: '1397' },
  { q: 'Triều đại nào gắn liền với Lam Kinh?', options: ['Nhà Trần', 'Hậu Lê', 'Nhà Lý'], answer: 'Hậu Lê' },
  { q: 'Trống đồng Đông Sơn thuộc nền văn minh nào?', options: ['Văn minh Đông Sơn', 'Văn minh Óc Eo', 'Văn minh Chăm Pa'], answer: 'Văn minh Đông Sơn' },
]

/* ====================================================================
   HOOKS
   ==================================================================== */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(id) }, { threshold: 0.2, rootMargin: '-100px 0px -40% 0px' })
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [ids])
  return active
}

function useSideNavVisible() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const check = () => {
      const th = document.getElementById('thanh-hoa')
      const footer = document.getElementById('lien-he')
      if (!th || !footer) return
      const top = th.getBoundingClientRect().top
      const bot = footer.getBoundingClientRect().bottom
      setShow(top < window.innerHeight * 0.5 && bot > 100)
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [])
  return show
}

function useScrollTabs(count: number) {
  const [page, setPage] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const pageRef = useRef(0)
  const lockedRef = useRef(false)

  useEffect(() => { pageRef.current = page }, [page])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current
      if (!section || lockedRef.current) return
      const rect = section.getBoundingClientRect()
      // Section is "active" when its top is near/above viewport top and bottom is still visible
      const active = rect.top <= 80 && rect.bottom >= window.innerHeight * 0.5
      if (!active) return

      if (e.deltaY > 0 && pageRef.current < count - 1) {
        e.preventDefault()
        lockedRef.current = true
        setPage(p => Math.min(count - 1, p + 1))
        setTimeout(() => { lockedRef.current = false }, 750)
      } else if (e.deltaY < 0 && pageRef.current > 0) {
        e.preventDefault()
        lockedRef.current = true
        setPage(p => Math.max(0, p - 1))
        setTimeout(() => { lockedRef.current = false }, 750)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [count])

  return { page, setPage, sectionRef }
}

/* ====================================================================
   SHARED COMPONENTS
   ==================================================================== */
function Reveal({ children, className = '', delay = 0, direction = 'up' }: { children: ReactNode; className?: string; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' }) {
  const { ref, visible } = useScrollReveal()
  const transforms: Record<string, string> = {
    up: 'translateY(60px)',
    down: 'translateY(-40px)',
    left: 'translateX(-40px)',
    right: 'translateX(40px)',
    zoom: 'scale(0.85)',
  }
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : transforms[direction],
      }}
    >
      {children}
    </div>
  )
}

function ProgressBar({ steps, current, onNav, color }: { steps: string[]; current: number; onNav: (i: number) => void; color: string }) {
  const pct = ((current + 1) / steps.length) * 100
  return (
    <div className="mt-6">
      <div className="progress-bar-track mb-3">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex items-center justify-between text-xs">
        {steps.map((s, i) => (
          <button key={s} onClick={() => onNav(i)} className={`transition font-medium ${i <= current ? 'opacity-100' : 'opacity-50'}`} style={{ color: i <= current ? color : 'rgba(255,255,255,0.5)' }}>
            {s}
          </button>
        ))}
        <Gift className="h-5 w-5 text-amber-300" />
      </div>
    </div>
  )
}

function OrderModal({ open, onClose, productName, accentColor }: { open: boolean; onClose: () => void; productName: string; accentColor: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '' })

  if (!open) return null

  const handleSubmit = () => { setSubmitted(true) }
  const handleClose = () => { setSubmitted(false); setForm({ name: '', phone: '', address: '' }); onClose() }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="glass-dark rounded-2xl p-6 w-full max-w-md mx-4 text-white" onClick={e => e.stopPropagation()}>
        {submitted ? (
          <div className="text-center py-8">
            <PartyPopper className="h-12 w-12 mx-auto mb-4 text-amber-300" />
            <h3 className="text-xl font-bold mb-2">Cảm ơn bạn!</h3>
            <p className="text-sm text-white/80">Cảm ơn bạn đã đồng hành cùng 3 Công Chúa giữ gìn tinh hoa Việt. Đơn hàng đang được chuẩn bị!</p>
            <button onClick={handleClose} className="mt-6 rounded-lg px-6 py-2 text-sm font-semibold text-white" style={{ background: accentColor }}>Đóng</button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold mb-1">Đặt hàng: {productName}</h3>
            <p className="text-xs text-white/60 mb-4">Vui lòng điền thông tin để chúng tôi liên hệ giao hàng</p>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40" placeholder="Họ và tên" />
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40" placeholder="Số điện thoại" />
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40" placeholder="Địa chỉ giao hàng" />
            </div>
            <button onClick={handleSubmit} disabled={!form.name || !form.phone || !form.address} className="btn-shine mt-4 w-full rounded-lg py-3 text-sm font-bold text-white disabled:opacity-40" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}>
              ĐẶT HÀNG NGAY
            </button>
            <button onClick={handleClose} className="mt-2 w-full text-center text-xs text-white/50 hover:text-white/80">Huỷ</button>
          </>
        )}
      </div>
    </div>
  )
}

/* ====================================================================
   CART DRAWER
   ==================================================================== */
function CartDrawer() {
  const { items, removeFromCart, updateQty, clearCart, totalPrice, cartOpen, setCartOpen } = useCart()
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'done'>('cart')
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' })

  if (!cartOpen) return null

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.address) return
    setCheckoutStep('done')
    clearCart()
  }

  const handleClose = () => {
    setCartOpen(false)
    setCheckoutStep('cart')
    setForm({ name: '', phone: '', address: '', note: '' })
  }

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Drawer */}
      <div className="relative z-10 flex flex-col w-full max-w-md bg-slate-900 shadow-2xl h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              {checkoutStep === 'cart' ? 'Giỏ Hàng' : checkoutStep === 'form' ? 'Thanh Toán' : 'Đặt Hàng Thành Công'}
            </h2>
          </div>
          <button onClick={handleClose} className="text-white/50 hover:text-white transition p-1">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {checkoutStep === 'done' ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
              <PartyPopper className="h-16 w-16 text-amber-300 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Cảm ơn bạn!</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Đơn hàng của bạn đã được tiếp nhận. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
              </p>
              <button onClick={handleClose} className="btn-shine mt-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 font-bold text-white">
                Tiếp tục mua sắm
              </button>
            </div>
          ) : checkoutStep === 'form' ? (
            <div className="p-5 space-y-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm text-white/80 py-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="text-amber-300">{fmt(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 mt-2 pt-2 flex justify-between font-bold text-white">
                  <span>Tổng cộng</span>
                  <span className="text-amber-300">{fmt(totalPrice)}</span>
                </div>
              </div>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400/60"
                placeholder="Họ và tên *" />
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400/60"
                placeholder="Số điện thoại *" />
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400/60"
                placeholder="Địa chỉ giao hàng *" />
              <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400/60 resize-none"
                placeholder="Ghi chú (tùy chọn)" rows={3} />
            </div>
          ) : (
            <div className="p-5">
              {items.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>Giỏ hàng đang trống</p>
                  <button onClick={handleClose} className="mt-4 text-amber-400 text-sm hover:text-amber-300">Tiếp tục mua sắm</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3">
                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                        <p className="text-amber-300 font-bold text-sm">{fmt(item.price)}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="h-6 w-6 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-white text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="h-6 w-6 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-red-400 transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <p className="text-xs text-white/50">{fmt(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {checkoutStep !== 'done' && items.length > 0 && (
          <div className="border-t border-white/10 p-5">
            {checkoutStep === 'cart' ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/70 text-sm">Tổng cộng ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
                  <span className="text-xl font-bold text-amber-300">{fmt(totalPrice)}</span>
                </div>
                <button onClick={() => setCheckoutStep('form')}
                  className="btn-shine w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 font-bold text-white shadow-lg transition hover:scale-[1.02]">
                  Tiến hành thanh toán
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setCheckoutStep('cart')}
                  className="flex-1 rounded-xl border border-white/20 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 transition">
                  Quay lại
                </button>
                <button onClick={handleSubmit} disabled={!form.name || !form.phone || !form.address}
                  className="btn-shine flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 font-bold text-white disabled:opacity-40 transition">
                  Xác nhận đặt hàng
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ====================================================================
   SIDE NAV (Vertical left)
   ==================================================================== */
function SideNav() {
  const show = useSideNavVisible()
  const active = useActiveSection(['thanh-hoa', 'quang-ninh', 'hung-yen', 'dai-hoc-mo', 'lien-he'])

  return (
    <nav className={`side-nav glass-dark ${show ? '' : 'hidden'}`}>
      {SIDE_NAV_ITEMS.map(item => {
        const isActive = active === item.id
        return (
          <a key={item.id} href={`#${item.id}`} className="flex flex-col items-center gap-1.5 rounded-lg px-2 py-2 text-center cursor-pointer group">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300"
              style={{
                background: isActive ? item.color : `${item.color}33`,
                boxShadow: isActive ? `0 0 16px ${item.color}88` : 'none',
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
              }}
            >
              <item.Icon className="h-4 w-4 text-white" />
            </div>
            <span className={`text-[9px] font-semibold leading-tight transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}

/* ====================================================================
   HEADER
   ==================================================================== */
function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(['gioi-thieu', 'thanh-hoa', 'quang-ninh', 'hung-yen', 'giao-lo-dinh-menh', 'dai-hoc-mo', 'lien-he'])
  const { totalCount, setCartOpen } = useCart()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur shadow-lg' : 'bg-transparent'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <a href="#" className="flex items-center gap-2">
          <img src="/logo-3-cong-chua.jpg" alt="Logo" className="h-9 w-9 rounded-full object-cover border-2 border-amber-400/70" />
          <span className="text-sm font-bold text-amber-300">3 Công Chúa</span>
        </a>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_ITEMS.map(item => {
            const isActive = active === item.href.slice(1)
            return (
              <a key={item.href} href={item.href} className={`relative text-sm font-medium transition-colors duration-300 ${isActive ? 'text-amber-300' : 'text-white/70 hover:text-amber-300'}`}>
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-400 rounded-full transition-all duration-300 ${isActive ? 'w-full' : 'w-0'}`} />
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Cart button */}
          <button onClick={() => setCartOpen(true)} className="relative rounded-md border border-amber-400/50 p-2 text-amber-300 hover:bg-amber-400/10 transition cursor-pointer" aria-label="Giỏ hàng">
            <ShoppingCart className="h-5 w-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {totalCount > 9 ? '9+' : totalCount}
              </span>
            )}
          </button>
          <button onClick={() => setOpen(v => !v)} className="rounded-md border border-amber-400/50 p-2 text-amber-300 lg:hidden cursor-pointer" aria-label="Menu">
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-900/95 px-4 py-3 lg:hidden backdrop-blur">
          <div className="grid gap-2">
            {NAV_ITEMS.map(item => {
              const isActive = active === item.href.slice(1)
              return (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)} className={`rounded-md px-2 py-1.5 text-sm transition ${isActive ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-amber-300'}`}>{item.label}</a>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}

/* ====================================================================
   HERO SECTION
   ==================================================================== */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Video background */}
      <video autoPlay loop muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="/3-di-san.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-black/40 z-[2]" />

      {/* Content */}
      <div className="relative z-[3] text-center w-full max-w-5xl mx-auto mt-16 px-6" style={{ boxSizing: 'border-box' }}>
        <Reveal direction="down">
          <h1
            className="gradient-title font-black leading-tight"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(1.6rem, 10vw, 6rem)',
              lineHeight: 1.15,
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
            }}
          >
            Vọng Âm Quá Khứ
          </h1>
        </Reveal>
        <Reveal delay={200} direction="up">
          <p
            className="mt-3 font-bold text-white leading-snug"
            style={{ fontSize: 'clamp(0.95rem, 4vw, 2.25rem)', textShadow: '0 0 10px rgba(245,197,66,0.6), 0 2px 8px rgba(0,0,0,0.35)' }}
          >
            Hành Trình Di Sản Của 3 Công Chúa
          </p>
        </Reveal>
        <Reveal delay={400} direction="up">
          <p
            className="mt-3 font-medium text-white/95 leading-relaxed"
            style={{ fontSize: 'clamp(0.8rem, 3vw, 1.5rem)', textShadow: '0 1px 6px rgba(0,0,0,0.45)' }}
          >
            Nơi Dấu Ấn Ba Miền Thăng Hoa, Tri Thức Kiến Tạo Tương Lai
          </p>
        </Reveal>
        <Reveal delay={600} direction="zoom">
          <p
            className="mt-3 text-white/85 max-w-2xl mx-auto leading-relaxed"
            style={{ fontSize: 'clamp(0.75rem, 2.5vw, 1rem)', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
          >
            Cùng 3 Công Chúa dấn thân vào một hành trình khám phá những câu chuyện từ ngàn xưa, những giá trị văn hóa bất diệt và ước mơ kiến tạo tương lai
          </p>
        </Reveal>
        <Reveal delay={800}>
          <a
            href="#gioi-thieu"
            className="btn-shine mt-8 inline-flex rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 sm:px-8 sm:py-4 font-bold text-white text-sm sm:text-base shadow-lg shadow-amber-500/25 transition hover:shadow-amber-500/40 hover:scale-105"
            style={{ maxWidth: '100%' }}
          >
            Bắt Đầu Hành Trình Khám Phá Ngay
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ====================================================================
   3 CÔNG CHÚA - LỜI TỰ SỰ TỪ TRÁI TIM
   ==================================================================== */
const PRINCESS_TIMELINE_COLORS: Record<Province, { circle: string; quote: string; dot: string; location: string }> = {
  'thanh-hoa': { circle: 'bg-rose-200', quote: 'bg-rose-50 border-rose-200', dot: 'bg-rose-400', location: 'text-rose-500' },
  'quang-ninh': { circle: 'bg-slate-300', quote: 'bg-slate-100 border-slate-200', dot: 'bg-slate-400', location: 'text-slate-500' },
  'hung-yen': { circle: 'bg-amber-100', quote: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500', location: 'text-amber-600' },
}

function PrincessesSection() {
  return (
    <section id="gioi-thieu" className="bg-stone-100 py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <Reveal direction="zoom">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-amber-600 md:text-4xl">3 Công Chúa: Lời Tự Sự Từ Trái Tim</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 text-center">
              Ba người con gái đại diện cho ba miền đất Việt, mỗi người mang trong mình một câu chuyện riêng về quê hương và di sản.
            </p>
          </div>
        </Reveal>

        {/* Timeline */}
        <div className="mt-16 relative">
          {/* Vertical center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-amber-800/30 -translate-x-1/2" />

          {PRINCESSES.map((p, i) => {
            const colors = PRINCESS_TIMELINE_COLORS[p.id]
            const isLeft = i % 2 === 0

            return (
              <Reveal key={p.id} delay={i * 200} direction={isLeft ? 'left' : 'right'}>
                <div className={`relative flex items-center mb-20 ${!isLeft ? 'flex-row-reverse' : ''}`}>
                  {/* Circle with photo */}
                  <div className="w-1/2 flex justify-center relative">
                    <div className={`h-44 w-44 rounded-full ${colors.circle} overflow-hidden shadow-md`}>
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    {/* Dot connector */}
                    <div className={`absolute top-1/2 ${isLeft ? '-right-1.5' : '-left-1.5'} -translate-y-1/2 w-3 h-3 rounded-full ${colors.dot} z-10`} />
                  </div>

                  {/* Content */}
                  <div className={`w-1/2 ${isLeft ? 'pl-10' : 'pr-10'}`}>
                    <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
                    <p className={`text-xs mt-0.5 flex items-center gap-1 ${colors.location}`}>
                      <MapPin size={11} /> {p.province}
                    </p>
                    <div className={`mt-3 rounded-xl border p-4 text-sm text-gray-600 italic leading-relaxed ${colors.quote}`}>
                      <Heart size={12} className="inline mr-1 opacity-60" />{p.quote}
                    </div>
                    <a href={`#${p.id}`} className="mt-3 inline-flex px-5 py-2 text-sm font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                      Xem quê hương tôi
                    </a>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ====================================================================
   THANH HÓA SECTION
   ==================================================================== */
function ThanhHoaSection() {
  const { page, setPage, sectionRef: thanhHoaRef } = useScrollTabs(2)
  const [accActive, setAccActive] = useState(0)
  const [subSlide, setSubSlide] = useState(0) // sub-navigation within "Di tích lịch sử"
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState<Record<number, boolean>>({})
  // Sub-slides for "Historical Relics" accordion item
  const diTichSlides = [
    { title: 'Thành Nhà Hồ', image: '/thanh-hoa/anh1.png', desc: 'Thành Nhà Hồ là di sản văn hóa thế giới UNESCO, được xây dựng năm 1397, là công trình thành đá độc đáo nhất Đông Nam Á.' },
    { title: 'Lam Kinh', image: '/thanh-hoa/anh2.png', desc: 'Lam Kinh là vùng đất linh thiêng gắn với triều Hậu Lê, kinh đô thứ hai nơi dâng trào hào khí giữ nước.' },
    { title: 'Trống Đồng Đông Sơn', image: '/thanh-hoa/anh3.png', desc: 'Biểu tượng của văn minh Việt cổ, phản ánh đời sống vật chất và tinh thần rực rỡ của cư dân Lạc Việt xưa.' },
  ]

  const accItems = [
    { title: 'Di Tích Lịch Sử: Ngàn Năm Hào Khí', image: diTichSlides[subSlide].image, desc: diTichSlides[subSlide].desc, hasSubNav: true },
    { title: 'Phong Cảnh Thiên Nhiên', subtitle: 'Sầm Sơn', image: '/images/bien-sam-son.png', desc: 'Biển Sầm Sơn được bao bọc bởi núi Trường Lệ và đền Độc Cước, tạo nên cảnh quan hùng vĩ.', hasVideo: true },
    { title: 'Lễ Hội & Văn Hóa', image: '/images/le-hoi-poon-poong.png', desc: 'Lễ hội Pôồn Pôông - nghi lễ dân gian đặc sắc của người Mường tại Thanh Hóa, thường tổ chức vào rằm tháng Giêng hoặc tháng Bảy, cầu mùa màng bội thu và nhân khang vật thịnh.' },
  ]

  const stepLabels = ['Di sản văn hóa', 'Minigame']

  const handleQuizAnswer = (ans: string) => {
    if (quizAnswered[quizIdx]) return
    const correct = ans === QUIZ_QUESTIONS[quizIdx].answer
    setQuizAnswered(s => ({ ...s, [quizIdx]: true }))
    if (correct) setQuizScore(s => s + 10)
  }

  return (
    <section ref={thanhHoaRef} id="thanh-hoa" className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 30%, #b91c1c 50%, #c2410c 70%, #9a3412 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal direction="left">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-amber-200 md:text-4xl">Thanh Hóa: Nơi Khởi Nguyên Của Những Triều Đại</h2>
            <p className="mt-2 text-amber-100/70">Hào Khí Ngàn Năm</p>
          </div>
        </Reveal>

        {/* Page 1: Horizontal Accordion (Dòng Chảy Di Sản) */}
        {page === 0 && (
          <Reveal direction="zoom">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-400/80 mb-3 font-semibold">Dòng Chảy Di Sản</p>
            <div className="h-accordion">
              {accItems.map((item, i) => (
                <div key={item.title} className={`h-accordion-item ${i === accActive ? 'active' : ''}`} onClick={() => setAccActive(i)}>
                  {i === 1 && accActive === 1 && item.hasVideo ? (
                    <video autoPlay loop muted playsInline className="acc-bg" style={{ objectFit: 'cover' }}>
                      <source src="/vid-bie-sam-son.mp4" type="video/mp4" />
                    </video>
                  ) : (
                    <img src={item.image} alt={item.title} className="acc-bg" />
                  )}
                  <div className="collapsed-title">
                    <span>{item.title}</span>
                    {'subtitle' in item && item.subtitle && <span className="block text-xs mt-1 opacity-70">{item.subtitle}</span>}
                  </div>
                  <div className="overlay-content">
                    <div className="glass-dark rounded-xl p-5">
                      <p className="text-[10px] uppercase tracking-widest text-amber-400/60 mb-1">{item.title}</p>
                      <h3 className="text-xl font-bold text-amber-200">{i === 0 ? diTichSlides[subSlide].title : item.title}</h3>
                      <p className="mt-2 text-sm text-white/85 leading-relaxed">{item.desc}</p>
                      {/* Sub-navigation arrows within Historical Relics */}
                      {i === 0 && item.hasSubNav && (
                        <div className="mt-3 flex items-center gap-3">
                          <button onClick={e => { e.stopPropagation(); setSubSlide(s => Math.max(0, s - 1)) }} disabled={subSlide === 0} className="rounded-full border border-amber-400/40 p-1.5 text-amber-300 disabled:opacity-30 hover:bg-amber-500/20 cursor-pointer"><ChevronLeft className="h-4 w-4" /></button>
                          <span className="text-xs text-amber-300/70">{subSlide + 1} / {diTichSlides.length}</span>
                          <button onClick={e => { e.stopPropagation(); setSubSlide(s => Math.min(diTichSlides.length - 1, s + 1)) }} disabled={subSlide === diTichSlides.length - 1} className="nav-arrow-glow rounded-full border border-amber-400/60 p-1.5 text-amber-300 disabled:opacity-30 cursor-pointer"><ChevronRight className="h-5 w-5" /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Page 2: Quiz "Thử tài sử học nhí" */}
        {page === 1 && (
          <Reveal direction="right">
            <div className="glass-dark rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-amber-200 flex items-center gap-2"><Brain className="h-6 w-6" /> Thử tài sử học nhí</h3>
              <p className="mt-2 text-sm text-white/60">Trả lời các câu hỏi để khám phá thêm về lịch sử xứ Thanh!</p>
              <p className="mt-4 text-sm text-white/80 font-medium">Câu {quizIdx + 1}/{QUIZ_QUESTIONS.length}: {QUIZ_QUESTIONS[quizIdx].q}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {QUIZ_QUESTIONS[quizIdx].options.map(opt => {
                  const answered = quizAnswered[quizIdx]
                  const isCorrect = opt === QUIZ_QUESTIONS[quizIdx].answer
                  return (
                    <button key={opt} onClick={() => handleQuizAnswer(opt)} disabled={!!answered}
                      className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${answered ? (isCorrect ? 'border-green-400 bg-green-500/20 text-green-300' : 'border-white/10 text-white/40') : 'border-amber-400/30 text-amber-100 hover:bg-amber-500/20'}`}>
                      {opt}
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-amber-300 flex items-center gap-1"><Star className="h-4 w-4" /> Điểm: {quizScore}</span>
                <div className="flex gap-2">
                  {quizIdx > 0 && <button onClick={() => setQuizIdx(i => i - 1)} className="flex items-center gap-1 rounded-md border border-white/20 px-3 py-1 text-white/70 hover:text-white cursor-pointer"><ChevronLeft className="h-4 w-4" /> Trước</button>}
                  {quizIdx < QUIZ_QUESTIONS.length - 1 && <button onClick={() => setQuizIdx(i => i + 1)} className="flex items-center gap-1 rounded-md border border-amber-400/40 px-3 py-1 text-amber-300 hover:bg-amber-500/10 cursor-pointer">Tiếp <ChevronRight className="h-4 w-4" /></button>}
                </div>
              </div>
              {Object.keys(quizAnswered).length === QUIZ_QUESTIONS.length && (
                <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-400/30 p-3 text-center text-sm text-amber-200">
                  <span className="inline-flex items-center gap-1"><PartyPopper className="h-4 w-4 inline" /> Hoàn thành! Tổng điểm: <strong>{quizScore}/{QUIZ_QUESTIONS.length * 10}</strong></span>
                </div>
              )}
            </div>
          </Reveal>
        )}

        <ProgressBar steps={stepLabels} current={page} onNav={setPage} color="#fbbf24" />

        <div className="mt-8 text-center">
          <a href="#nem-chua-thanh-hoa" className="cta-shine-red inline-flex rounded-xl px-8 py-4 font-bold text-white shadow-lg hover:scale-105 transition">
            Thưởng thức vị quê
          </a>
        </div>
      </div>
    </section>
  )
}

/* ====================================================================
   NEM CHUA SECTION (standalone)
   ==================================================================== */
function NemChuaSection() {
  const [orderOpen, setOrderOpen] = useState(false)
  const { addToCart } = useCart()
  return (
    <section id="nem-chua-thanh-hoa" className="py-16 md:py-24" style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #7f1d1d 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal direction="right">
          {/* Same product content as the old page 2, but as a full section */}
          <div className="glass-dark rounded-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* LEFT: product info */}
              <div className="relative p-8 flex flex-col justify-center">
                <p className="text-xs uppercase tracking-widest text-amber-400/80">Đặc sản xứ Thanh</p>
                <h3 className="mt-2 text-3xl font-bold text-amber-100" style={{ fontFamily: 'Georgia, serif' }}>Nem Chua Thanh Hóa</h3>
                <p className="mt-2 text-amber-100/70 italic" style={{ fontFamily: 'Georgia, serif' }}>Vị chua thanh, cay nồng - Gói trọn nghĩa tình xứ Thanh</p>
                <div className="mt-4 flex gap-4">
                  {[{ Icon: Leaf, text: '100% Tự nhiên' }, { Icon: ShieldCheck, text: 'Không chất bảo quản' }, { Icon: Truck, text: 'Giao hàng siêu tốc' }].map(f => (
                    <div key={f.text} className="text-center">
                      <f.Icon className="h-5 w-5 mx-auto text-amber-300" />
                      <p className="text-[10px] text-white/60 mt-1">{f.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-1 text-sm text-white/70">
                  <p>• Lên men tự nhiên</p>
                  <p>• Giòn dai sần sật</p>
                  <p>• Khối lượng: 10 cái</p>
                </div>
                <p className="mt-4 text-3xl font-bold text-amber-300">50.000đ</p>
                <p className="text-xs text-white/50">Đã có 156 người đặt mua trong tuần này</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={() => addToCart({ id: 'nem-chua', name: 'Nem Chua Thanh Hóa', price: 50000, image: '/images/nem-chua.png', accentColor: '#dc2626' })}
                    className="flex items-center gap-2 rounded-xl border-2 border-amber-400 px-5 py-3 font-bold text-amber-300 hover:bg-amber-400/10 transition">
                    <ShoppingCart className="h-4 w-4" /> Thêm vào giỏ
                  </button>
                  <button onClick={() => setOrderOpen(true)} className="btn-shine rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 font-bold text-white shadow-lg">
                    TRẢI NGHIỆM VỊ QUÊ
                  </button>
                </div>
              </div>
              {/* RIGHT: product image */}
              <div className="relative min-h-[300px] bg-gradient-to-br from-red-900/50 to-red-800/30 flex items-center justify-center p-8">
                <img src="/images/nem-chua.png" alt="Nem chua Thanh Hóa" className="max-h-80 rounded-2xl object-cover shadow-2xl" />
                <div className="product-badge">Độc quyền<br />3 Công Chúa</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} productName="Nem Chua Thanh Hóa" accentColor="#dc2626" />
    </section>
  )
}

/* ====================================================================
   QUẢNG NINH SECTION
   ==================================================================== */
function QuangNinhSection() {
  const { page, setPage, sectionRef: quangNinhRef } = useScrollTabs(3)
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null)

  const islands = [
    { id: 'tuan-chau', name: 'Đảo Tuần Châu', x: '35%', y: '55%', text: 'Tuần Châu là điểm du lịch biển nổi bật, thuận tiện để bắt đầu hành trình khám phá Vịnh Hạ Long.', image: '/images/dao-tuan-chau.png' },
    { id: 'ngoc-vung', name: 'Đảo Ngọc Vừng', x: '62%', y: '30%', text: 'Ngọc Vừng sở hữu bãi biển hoang sơ, nước trong xanh và không gian yên bình.', image: '/images/dao-ngoc-vung.png' },
    { id: 'ti-top', name: 'Đảo Ti Tốp', x: '50%', y: '42%', text: 'Đảo Ti Tốp nổi tiếng với bãi tắm đẹp và điểm ngắm toàn cảnh Vịnh Hạ Long từ trên cao.', image: '/images/dao-ti-top.png' },
  ]

  const heritage = [
    { name: 'Vịnh Hạ Long', image: '/images/vinh-ha-long.png', desc: 'Di sản thiên nhiên thế giới với hệ sinh thái biển phong phú và hàng nghìn đảo đá vôi kỳ vĩ.' },
    { name: 'Sông Bạch Đằng', image: '/images/song-bach-dang.png', desc: 'Địa danh lịch sử gắn với các chiến thắng lẫy lừng chống quân xâm lược phương Bắc.' },
    { name: 'Núi Yên Tử', image: '/images/nui-yen-tu.png', desc: 'Trung tâm văn hóa Phật giáo Trúc Lâm, điểm hành hương nổi tiếng của Việt Nam.' },
  ]

  const stepLabels = ['Khám phá biển đảo', 'Di sản văn hóa', 'Carnaval Hạ Long']

  return (
    <section ref={quangNinhRef} id="quang-ninh" className="py-16 md:py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #0c4a6e 20%, #075985 40%, #0e7490 60%, #065f46 80%, #064e3b 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal direction="right">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-cyan-200 md:text-4xl">Quảng Ninh: Kỳ Quan Biển Đảo</h2>
            <p className="mt-2 text-cyan-100/70">Nơi hội tụ cảnh sắc thiên nhiên hùng vĩ, lịch sử chống ngoại xâm và những lễ hội biển sôi động.</p>
          </div>
        </Reveal>

        {/* Page 1: Sea map with islands */}
        {page === 0 && (
          <Reveal direction="zoom">
            <div className="glass-dark rounded-2xl" style={{ position: 'relative' }}>
              <div className="relative h-[400px] md:h-[500px]">
                <img src="/images/ban-do-bien-qn.png" alt="Bản đồ biển Quảng Ninh" className="w-full h-full object-cover rounded-2xl" />
                {selectedIsland && (
                  <div className="absolute inset-0 z-10 rounded-2xl" onClick={() => setSelectedIsland(null)} />
                )}
                {islands.map(p => {
                  const yNum = parseFloat(p.y)
                  const showBelow = yNum < 45
                  return (
                    <div key={p.id} className="absolute z-20" style={{ left: p.x, top: p.y, transform: 'translate(-50%, -50%)' }}>
                      <button
                        onClick={() => setSelectedIsland(selectedIsland === p.id ? null : p.id)}
                        className={`rounded-full border-2 transition-all px-3 py-1.5 text-xs font-bold text-white shadow-lg ${selectedIsland === p.id ? 'border-amber-300 bg-amber-400 scale-125' : 'border-white bg-amber-500 hover:scale-110'}`}
                      >
                        {p.name}
                      </button>
                      {selectedIsland === p.id && (() => {
                        const island = islands.find(i => i.id === selectedIsland)!
                        return (
                          <div
                            className="absolute z-30 left-1/2 w-60 rounded-xl shadow-2xl overflow-hidden"
                            style={{
                              transform: 'translateX(-50%)',
                              ...(showBelow ? { top: 'calc(100% + 12px)' } : { bottom: 'calc(100% + 12px)' }),
                              background: 'rgba(7,89,133,0.97)',
                              border: '1.5px solid rgba(125,211,252,0.4)',
                            }}
                            onClick={e => e.stopPropagation()}
                          >
                            <button
                              onClick={() => setSelectedIsland(null)}
                              className="absolute top-2 right-2 text-white/60 hover:text-white text-base leading-none z-10"
                            >✕</button>
                            <img src={island.image} alt={island.name} className="w-full h-28 object-cover" />
                            <div className="p-3">
                              <h3 className="text-sm font-bold text-cyan-200">{island.name}</h3>
                              <p className="mt-1 text-xs text-white/80 leading-relaxed">{island.text}</p>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )
                })}
              </div>
            </div>
          </Reveal>
        )}

        {/* Page 2: Di sản & Văn hóa */}
        {page === 1 && (
          <Reveal direction="left">
            <div className="grid gap-6 md:grid-cols-3">
              {heritage.map((h, i) => (
                <Reveal key={h.name} delay={i * 150} direction="up">
                  <article className="glass-dark rounded-2xl overflow-hidden group">
                    <div className="h-52 overflow-hidden">
                      <img src={h.image} alt={h.name} className="w-full h-full object-cover transition group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-cyan-200">{h.name}</h3>
                      <p className="mt-2 text-sm text-white/75 leading-relaxed">{h.desc}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </Reveal>
        )}

        {/* Page 3: Carnaval Hạ Long */}
        {page === 2 && (
          <Reveal direction="zoom">
            <div className="relative rounded-2xl overflow-hidden min-h-[500px]">
              <img src="/images/vinh-ha-long.png" alt="Vịnh Hạ Long hoàng hôn" className="absolute inset-0 w-full h-full object-cover blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-950/50 to-purple-900/30" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 min-h-[500px]">
                <h3 className="text-3xl md:text-5xl font-extrabold text-amber-300" style={{ textShadow: '0 0 30px rgba(245,158,11,0.4)' }}>
                  CARNAVAL HẠ LONG
                </h3>
                <p className="text-xl md:text-2xl font-bold text-white/90 mt-1">Vũ Điệu Của Biển</p>
                <div className="glass mt-6 rounded-xl p-5 max-w-2xl">
                  <p className="text-sm text-white/90 leading-relaxed">
                    Thường tổ chức cuối tháng 4 – đầu tháng 5, là thời điểm đẹp để du lịch Hạ Long và hòa vào không khí lễ hội biển. Carnaval Hạ Long là sự kiện văn hóa – du lịch lớn nhất trong năm, thu hút hàng nghìn du khách trong và ngoài nước.
                  </p>
                </div>
                <div className="mt-6 flex gap-4">
                  <img src="/images/carnaval-1.png" alt="Carnaval 1" className="w-40 h-28 md:w-56 md:h-36 rounded-xl object-cover shadow-xl" />
                  <img src="/images/carnaval-2.png" alt="Carnaval 2" className="w-40 h-28 md:w-56 md:h-36 rounded-xl object-cover shadow-xl" />
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <ProgressBar steps={stepLabels} current={page} onNav={setPage} color="#22d3ee" />

        <div className="mt-8 text-center">
          <a href="#dac-san-bien" className="cta-shine-blue inline-flex rounded-xl px-8 py-4 font-bold text-white shadow-lg hover:scale-105 transition">
            Đặc sản biển
          </a>
        </div>
      </div>
    </section>
  )
}

/* ====================================================================
   ĐẶC SẢN BIỂN SECTION (standalone)
   ==================================================================== */
function DacSanBienSection() {
  const [orderOpen, setOrderOpen] = useState(false)
  const { addToCart } = useCart()
  return (
    <section id="dac-san-bien" className="py-16 md:py-24" style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal direction="left">
          {/* Same chả mực product content as old page 3 */}
          <div className="rounded-2xl overflow-hidden glass-dark">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 flex flex-col justify-center">
                <p className="text-xs uppercase tracking-widest text-teal-200/80">Đặc sản tuyển chọn - 3 Công Chúa</p>
                <h3 className="mt-2 text-3xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Chả Mực – "Vàng Ròng" Từ Biển Cả</h3>
                <p className="mt-2 text-teal-100/80 italic" style={{ fontFamily: 'Georgia, serif' }}>Giã tay thủ công - Giữ trọn vị ngọt biển khơi Quảng Ninh</p>
                <div className="mt-4 flex gap-4">
                  {[{ t: 'Sạch' }, { t: 'Chất' }, { t: 'Giòn Dai' }].map(f => (
                    <span key={f.t} className="rounded-full border border-teal-300/40 bg-teal-400/10 px-3 py-1 text-xs text-teal-100">{f.t}</span>
                  ))}
                </div>
                <div className="mt-4 space-y-1 text-sm text-white/70">
                  <p>• 95% Mực tươi nguyên chất</p>
                  <p>• Giã tay thủ công</p>
                  <p>• Khối lượng: 500g</p>
                </div>
                <p className="mt-4 text-3xl font-bold text-amber-300">245.000đ</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={() => addToCart({ id: 'cha-muc', name: 'Chả Mực Hạ Long', price: 245000, image: '/images/cha-muc.png', accentColor: '#0d9488' })}
                    className="flex items-center gap-2 rounded-xl border-2 border-teal-300 px-5 py-3 font-bold text-teal-200 hover:bg-teal-400/10 transition">
                    <ShoppingCart className="h-4 w-4" /> Thêm vào giỏ
                  </button>
                  <button onClick={() => setOrderOpen(true)} className="btn-shine rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-6 py-3 font-bold text-white shadow-lg">
                    ĐẶT HÀNG NGAY
                  </button>
                </div>
              </div>
              <div className="relative min-h-[300px] flex items-center justify-center p-8 bg-teal-900/30">
                <img src="/images/cha-muc.png" alt="Chả mực Hạ Long" className="max-h-72 rounded-2xl object-contain drop-shadow-2xl" />
                <div className="product-badge" style={{ background: 'linear-gradient(135deg, #ffd700, #f59e0b)' }}>Đặc sản<br />Tuyển chọn</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} productName="Chả Mực Hạ Long" accentColor="#0d9488" />
    </section>
  )
}

/* ====================================================================
   HƯNG YÊN SECTION
   ==================================================================== */
function HungYenSection() {
  const { page, setPage, sectionRef: hungYenRef } = useScrollTabs(3)
  const [orderOpen, setOrderOpen] = useState(false)
  const { addToCart } = useCart()

  const stepLabels = ['Phố Hiến nàng thơ', 'Vườn nhãn cổ thụ', 'Long nhãn tiến vua']

  return (
    <section ref={hungYenRef} id="hung-yen" className="py-16 md:py-24 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #065f46 0%, #047857 30%, #065f46 55%, #9a8530 80%, #e8cf78 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal direction="left">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-emerald-200 md:text-4xl">Hưng Yên: Phố Hiến Xưa, Vị Ngọt Nhãn Lồng</h2>
            <p className="mt-2 text-emerald-100/70">Nơi lưu giữ những nét đẹp văn hóa truyền thống qua hệ thống di tích, lễ hội và đặc sản nổi tiếng.</p>
          </div>
        </Reveal>

        {/* Page 1: Phố Hiến */}
        {page === 0 && (
          <Reveal direction="right">
            <div className="relative rounded-2xl overflow-hidden min-h-[500px]">
              <img src="/images/cong-pho-hien.png" alt="Phố Hiến" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'blur(2px) brightness(0.4)' }} />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/60 to-transparent" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 min-h-[500px] items-center">
                <div>
                  <div className="glass-gold rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-teal-300" style={{ fontFamily: 'Georgia, serif' }}>PHỐ HIẾN – NÀNG THƠ CỦA TÔI</h3>
                    <div className="mt-4">
                      <h4 className="font-bold text-amber-200">Thương Cảng Xưa Huy Hoàng</h4>
                      <p className="mt-2 text-sm text-white/80 leading-relaxed">Phố Hiến từng là thương cảng sầm uất bậc nhất Đàng Ngoài, nơi giao thoa văn hóa Việt – Hoa – Nhật – phương Tây, để lại hệ thống di tích phong phú và đa dạng.</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-bold text-amber-200">Lễ Hội Phố Hiến</h4>
                      <ul className="mt-2 space-y-1 text-sm text-white/75">
                        <li>• Chùa Chuông: 15/1, 8/4, 15/4, 15/7 âm lịch</li>
                        <li>• Chùa Keo: Hội Xuân mùng 4 tháng Giêng, Hội Thu tháng 9</li>
                        <li>• Đền Mẫu Phố Hiến: 10-12/3 âm lịch</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img src="/images/cong-pho-hien.png" alt="Cổng Phố Hiến" className="max-h-80 rounded-2xl object-cover shadow-2xl border-2 border-amber-400/30" />
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Page 2: Vườn Nhãn Cổ Thụ */}
        {page === 1 && (
          <Reveal direction="zoom">
            <div className="relative rounded-2xl overflow-hidden min-h-[500px]">
              <img src="/images/vuon-nhan.png" alt="Vườn nhãn" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'blur(2px) brightness(0.35)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-950/80 to-amber-900/30" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 min-h-[500px]">
                <h3 className="gradient-title text-3xl md:text-5xl font-extrabold">VƯỜN NHÃN CỔ THỤ 360°</h3>
                <div className="glass-gold mt-6 rounded-2xl p-6 max-w-2xl">
                  <h4 className="text-lg font-bold text-amber-200">Mảnh Đất Vàng Cho Những Hương Vị Đậm Đà</h4>
                  <p className="mt-3 text-sm text-white/80 leading-relaxed">
                    Khám phá vườn nhãn lồng Hưng Yên trải rộng, nơi những cây nhãn cổ thụ hàng trăm năm tuổi vẫn trĩu quả mỗi mùa. Đất phù sa sông Hồng tạo nên hương vị ngọt thanh đặc trưng không nơi nào có được.
                  </p>
                </div>
                <div className="mt-6 w-full max-w-2xl">
                  <Garden360Viewer />
                </div>
                <button onClick={() => setPage(2)} className="btn-shine mt-6 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 px-6 py-3 font-bold text-white shadow-lg">
                  Khám phá báu vật <Gift className="inline h-5 w-5 ml-1" />
                </button>
              </div>
            </div>
          </Reveal>
        )}

        {/* Page 3: Long Nhãn product */}
        {page === 2 && (
          <Reveal direction="left">
            <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #78350f, #92400e, #78350f)' }}>
              <div className="grid lg:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <p className="text-xs uppercase tracking-widest text-amber-300/80">Sản vật tiến vua</p>
                  <h3 className="mt-2 text-3xl font-bold gradient-title" style={{ fontFamily: 'Georgia, serif' }}>LONG NHÃN HƯNG YÊN</h3>
                  <p className="mt-2 text-amber-200/80 italic" style={{ fontFamily: 'Georgia, serif' }}>Ngọt thanh như mật</p>

                  <div className="mt-4 space-y-1 text-sm text-white/70">
                    <p>• Long Nhãn Loại 1 - Ngọt Thanh Như Mật</p>
                    <p>• Sấy khô tự nhiên</p>
                    <p>• Không đường hóa học</p>
                    <p>• Khối lượng: 300g</p>
                  </div>

                  <p className="mt-4 text-3xl font-bold text-amber-300" style={{ fontFamily: 'Georgia, serif' }}>195.000đ</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button onClick={() => addToCart({ id: 'long-nhan', name: 'Long Nhãn Hưng Yên', price: 195000, image: '/images/long-nhan.png', accentColor: '#b45309' })}
                      className="flex items-center gap-2 rounded-xl border-2 border-amber-400 px-5 py-3 font-bold text-amber-300 hover:bg-amber-400/10 transition">
                      <ShoppingCart className="h-4 w-4" /> Thêm vào giỏ
                    </button>
                    <button onClick={() => setOrderOpen(true)} className="btn-shine rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 px-6 py-3 font-bold text-white shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
                      ĐẶT HÀNG NGAY
                    </button>
                  </div>

                  <div className="mt-4 glass-gold rounded-xl p-4">
                    <p className="text-sm font-bold text-amber-200 flex items-center gap-1"><Gift className="h-4 w-4" /> MUA COMBO 3 TỈNH - GIÁ ƯU ĐÃI</p>
                    <p className="text-2xl font-bold text-amber-300 mt-1">550.000đ</p>
                    <p className="text-xs text-white/60 mt-1">Nem chua + Chả mực + Long nhãn</p>
                  </div>
                </div>
                <div className="relative min-h-[350px] flex items-center justify-center p-8">
                  <img src="/images/long-nhan.png" alt="Long nhãn Hưng Yên" className="max-h-80 rounded-2xl object-cover shadow-2xl" />
                  <div className="product-badge">Sản vật<br />Tiến Vua</div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <ProgressBar steps={stepLabels} current={page} onNav={setPage} color="#34d399" />
      </div>
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} productName="Long Nhãn Hưng Yên" accentColor="#b45309" />
    </section>
  )
}

/* ====================================================================
   GIAO LỘ ĐỊNH MỆNH — Glassmorphism + Ngũ Mở
   ==================================================================== */
const NGU_MO = [
  { title: 'Mở Cơ Hội', icon: '📖', desc: 'Mở ra cánh cửa tri thức cho mọi người, không giới hạn địa lý hay hoàn cảnh.' },
  { title: 'Mở Trí Tuệ', icon: '💡', desc: 'Khơi nguồn sáng tạo, nuôi dưỡng tư duy phản biện và năng lực nghiên cứu.' },
  { title: 'Mở Trái Tim', icon: '❤️', desc: 'Giáo dục nhân văn, xây dựng tình yêu thương và trách nhiệm cộng đồng.' },
  { title: 'Mở Tầm Nhìn', icon: '🔭', desc: 'Hội nhập quốc tế, mở rộng tầm nhìn ra thế giới và xu hướng toàn cầu.' },
  { title: 'Mở Tương Lai', icon: '🚀', desc: 'Kiến tạo tương lai bằng tri thức, đổi mới sáng tạo và khát vọng cống hiến.' },
]

function VanMieuHeritageSection() {
  return (
    <section
      id="giao-lo-dinh-menh"
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE3CF 50%, #F0EBE0 100%)' }}
    >
      {/* Top gold accent */}
      <div className="absolute top-0 inset-x-0 h-1 z-10" style={{ background: 'linear-gradient(90deg, transparent, #d4af37 30%, #d4af37 70%, transparent)' }} />

      {/* HERO COMPOSITE — AI artwork */}
      <Reveal direction="zoom">
        <div className="relative w-full">
          {/* Main hero image */}
          <img
            src="/images/giao-lo/hero-ai.png"
            alt="Giao Lo Dinh Menh — Hung Yen Pho Hien, Quang Ninh Ha Long, Thanh Hoa Thanh Nha Ho"
            className="w-full h-auto block"
          />

          {/* HOU logo overlay — center badge */}
          <div
            className="absolute"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -42%)' }}
          >
            <div
              className="rounded-full overflow-hidden shadow-2xl"
              style={{
                border: '3px solid #d4af37',
                background: 'white',
                width: 'clamp(64px,9vw,160px)',
                height: 'clamp(64px,9vw,160px)',
              }}
            >
              <img src="/hou.png" alt="Logo ĐH Mở Hà Nội" className="w-full h-full object-contain p-1.5" />
            </div>
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ border: '2px solid rgba(212,175,55,0.45)', animationDuration: '2.5s' }}
            />
          </div>

          {/* Bottom gradient fade */}
          <div
            className="absolute bottom-0 inset-x-0 h-20 md:h-28"
            style={{ background: 'linear-gradient(0deg, #EDE3CF 0%, transparent 100%)' }}
          />
        </div>
      </Reveal>

      {/* Description */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-8 -mt-6 mb-10">
        <Reveal delay={100} direction="up">
          <div
            className="rounded-2xl p-5 md:p-6 text-center border shadow-lg"
            style={{ background: 'rgba(255,252,245,0.92)', backdropFilter: 'blur(14px)', borderColor: 'rgba(212,175,55,0.40)' }}
          >
            <p className="text-sm md:text-base leading-relaxed" style={{ color: '#44403c' }}>
              Mang theo sự kiên cường của đất học Thanh Hóa, sức sống khoáng đạt của biển bạc Quảng Ninh,
              hay nét tinh tế từ phù sa Hưng Yên — định mệnh đã đưa ba tâm hồn đồng điệu gặp gỡ.
              Chúng mình không chỉ mang theo niềm tự hào quê hương, mà còn mang cả khát khao chinh phục
              những tầm cao mới, đem tri thức về xây dựng quê hương.
            </p>
          </div>
        </Reveal>
      </div>

      {/* NGU MO */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8 pb-16 md:pb-24">
        <Reveal delay={150} direction="right">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-px w-10 md:w-20" style={{ background: 'linear-gradient(90deg, transparent, #d4af37)' }} />
              <p className="text-[10px] md:text-xs uppercase tracking-[0.3em]" style={{ color: '#92400e' }}>Đại Học Mở Hà Nội — Khoa Kinh Tế</p>
              <div className="h-px w-10 md:w-20" style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
            </div>
            <h3
              className="text-3xl font-extrabold md:text-5xl"
              style={{ color: '#92400e', textShadow: '0 2px 12px rgba(180,130,40,0.15)' }}
            >
              NGŨ MỞ
            </h3>
          </div>
        </Reveal>

        <Reveal delay={250} direction="up">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-5">
            {NGU_MO.map((item, i) => (
              <div
                key={item.title}
                className="float-card rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  background: 'rgba(255,252,245,0.88)',
                  backdropFilter: 'blur(12px)',
                  border: '1.5px solid rgba(212,175,55,0.40)',
                }}
              >
                <div className="text-3xl mb-3 md:text-4xl">{item.icon}</div>
                <h4 className="text-sm font-bold md:text-base" style={{ color: '#92400e' }}>{item.title}</h4>
                <p className="mt-2 text-[11px] leading-relaxed md:text-xs" style={{ color: '#57534e' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Bottom gold accent */}
      <div className="absolute bottom-0 inset-x-0 h-1 z-10" style={{ background: 'linear-gradient(90deg, transparent, #d4af37 30%, #d4af37 70%, transparent)' }} />
    </section>
  )
}




/* ====================================================================
   GARDEN 360 VIEWER — Vuon Nhan Co Thu
   ==================================================================== */
function Garden360Viewer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<PSViewer | null>(null)
  const [, setLoaded] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !viewerRef.current) {
          setTimeout(() => {
            if (!containerRef.current || viewerRef.current) return
            viewerRef.current = new PSViewer({
              container: containerRef.current,
              panorama: '/images/vuon-nhan-360-eq.jpg',
              defaultYaw: 0,
              defaultPitch: 0,
              defaultZoomLvl: 50,
              touchmoveTwoFingers: false,
              mousewheelCtrlKey: true,
              navbar: ['zoom', 'fullscreen'],
            })
            setLoaded(true)
          }, 900)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      viewerRef.current?.destroy()
      viewerRef.current = null
    }
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ border: '2px solid rgba(196,131,0,0.4)' }}>
      <div ref={containerRef} style={{ width: '100%', height: '380px' }} />
      <div
        className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-white/80 flex items-center gap-1.5"
        style={{ background: 'rgba(120,53,15,0.70)', backdropFilter: 'blur(8px)', fontSize: '10px', whiteSpace: 'nowrap' }}
      >
        <span>🖱️</span>
        <span>Keo de xoay 360 do</span>
      </div>
    </div>
  )
}

function DaiHocMoSection() {
  return (
    <section
      id="dai-hoc-mo"
      className="relative py-16 md:py-24 text-white overflow-hidden"
      style={{ background: '#1e4a8a' }}
    >
      {/* Background photo — sáng hơn */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'url(/images/hou-campus.png)', backgroundSize: 'cover', backgroundPosition: 'center top', opacity: 0.55 }}
      />
      {/* Overlay mỏng giữ readability */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(15,35,80,0.55) 0%, rgba(20,50,110,0.45) 100%)' }} />
      {/* Gold accent top line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #c8a84b, #f0d060, #c8a84b, transparent)' }} />

      <div className="relative mx-auto max-w-5xl px-4 md:px-6">

        {/* Header */}
        <Reveal direction="zoom">
          <div className="text-center mb-12">
            <img
              src="/hou.png"
              alt="Logo Đại học Mở Hà Nội"
              className="h-16 w-16 mx-auto mb-4 rounded-full object-contain"
              style={{ background: 'white', padding: '6px', boxShadow: '0 0 0 3px rgba(200,168,75,0.5), 0 8px 32px rgba(0,0,0,0.35)' }}
            />
            <p className="text-xs tracking-[0.3em] uppercase mb-2 font-semibold drop-shadow" style={{ color: '#f0d060' }}>Trường Đại Học Mở Hà Nội</p>
            <h2 className="text-3xl font-extrabold md:text-5xl text-white tracking-tight drop-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
              Hanoi Open University
            </h2>
            <div className="mx-auto mt-4 h-px w-24 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #c8a84b, #f0d060, #c8a84b, transparent)' }} />
            <p className="mt-4 text-sm text-white/80 font-medium tracking-wide drop-shadow">
              Nơi Tri Thức Bay Cao — Kiến Tạo Tương Lai
            </p>
          </div>
        </Reveal>

        {/* Intro card */}
        <Reveal delay={100} direction="up">
          <div className="rounded-2xl p-6 md:p-8 mb-6" style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.28)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 drop-shadow">
              <GraduationCap className="h-5 w-5 shrink-0" style={{ color: '#f0d060' }} />
              Khám Phá Đại Học Mở Hà Nội
            </h3>
            <p className="text-sm text-white/85 leading-relaxed mb-6">
              Với hơn 30 năm kinh nghiệm trong lĩnh vực giáo dục, Đại học Mở Hà Nội đã khẳng định vị thế là một trong những trường đại học uy tín hàng đầu Việt Nam — tiên phong trong đào tạo từ xa, mở rộng cơ hội học tập cho mọi người.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { Icon: GraduationCap, text: 'Hơn 50.000 sinh viên đang theo học' },
                { Icon: Trophy, text: 'Top 15 trường đại học hàng đầu Việt Nam' },
                { Icon: TrendingUp, text: '95% sinh viên có việc làm sau tốt nghiệp' },
              ].map(item => (
                <div key={item.text} className="flex items-start gap-3 rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)' }}>
                  <item.Icon className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#f0d060' }} />
                  <span className="text-xs text-white/90 leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* 4 Stats */}
        <Reveal delay={150} direction="up">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
            {[
              { Icon: Award, value: '30+', label: 'Năm kinh nghiệm' },
              { Icon: TrendingUp, value: '95%', label: 'Tỉ lệ việc làm' },
              { Icon: Users, value: '100+', label: 'Giảng viên' },
              { Icon: Trophy, value: 'Top 5', label: 'Khoa Kinh Tế' },
            ].map(s => (
              <div
                key={s.label}
                className="rounded-2xl p-4 text-center cursor-default transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(16px)' }}
              >
                <s.Icon className="h-6 w-6 mx-auto mb-2" style={{ color: '#f0d060' }} />
                <p className="text-2xl font-extrabold text-white drop-shadow">{s.value}</p>
                <p className="text-xs text-white/70 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Khoa Kinh Tế */}
        <Reveal delay={200} direction="up">
          <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <h3 className="text-center text-xl font-bold text-white mb-1 md:text-2xl drop-shadow">Khoa Kinh Tế</h3>
            <p className="text-center text-xs tracking-widest uppercase mb-1 font-semibold" style={{ color: '#f0d060' }}>Ươm Mầm Tài Năng Tương Lai</p>
            <div className="mx-auto mb-6 h-px w-16 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #c8a84b, transparent)' }} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.20)' }}>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#f0d060' }}>
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: '#f0d060' }} />
                  Chuyên Ngành Nổi Bật
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {['Kế Toán', 'Quản trị Kinh doanh', 'Thương mại điện tử'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-white/90">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-white/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.20)' }}>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#f0d060' }}>
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: '#f0d060' }} />
                  Cơ Hội Nghề Nghiệp
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {['Quản lý cấp cao tại các tập đoàn', 'Chuyên gia tư vấn kinh doanh', 'Khởi nghiệp startup thành công', 'Chuyên gia phân tích tài chính'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-white/90">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-white/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={250} direction="up">
          <div className="mt-10 text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-white/60 mb-5">Cùng Khám Phá Cơ Hội Vàng Tại Khoa Kinh Tế</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://tuyensinh.hou.edu.vn/"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-full px-7 py-3 text-sm font-bold transition-all duration-200 hover:scale-105"
                style={{ background: 'linear-gradient(90deg, #c8a84b, #f0d060, #c8a84b)', color: '#0a1628', boxShadow: '0 4px 20px rgba(200,168,75,0.45)' }}
              >
                Đăng Ký Tư Vấn Tuyển Sinh
              </a>
              <a
                href="#lien-he"
                className="cursor-pointer rounded-full px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/15"
                style={{ border: '1px solid rgba(255,255,255,0.45)', backdropFilter: 'blur(8px)' }}
              >
                Tiếp Tục Hành Trình
              </a>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  )
}

/* ====================================================================
   FOOTER
   ==================================================================== */
function Footer() {
  return (
    <footer id="lien-he" className="bg-amber-950 py-12 text-amber-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo-3-cong-chua.jpg" alt="Logo" className="h-10 w-10 rounded-full object-cover border-2 border-amber-400/50" />
            <h3 className="text-lg font-bold">Vọng Âm Quá Khứ</h3>
          </div>
          <p className="mt-2 text-sm text-amber-200/90">
            Hành trình di sản của 3 Công Chúa – kết nối lịch sử, văn hóa và giáo dục bằng trải nghiệm số.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Điều hướng</h4>
          <ul className="mt-2 space-y-1 text-sm">
            {[['Giới thiệu', '#gioi-thieu'], ['Thanh Hóa', '#thanh-hoa'], ['Quảng Ninh', '#quang-ninh'], ['Hưng Yên', '#hung-yen'], ['Giao lộ định mệnh', '#giao-lo-dinh-menh'], ['Đại học Mở', '#dai-hoc-mo']].map(([label, href]) => (
              <li key={href}><a href={href} className="text-amber-200/90 hover:text-white">{label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Liên hệ</h4>
          <form className="mt-3 space-y-2" onSubmit={e => e.preventDefault()}>
            <input className="w-full rounded-md border border-amber-700 bg-amber-900/30 px-3 py-2 text-sm text-white placeholder:text-amber-300/70 outline-none focus:border-amber-500" placeholder="Họ và tên" />
            <input className="w-full rounded-md border border-amber-700 bg-amber-900/30 px-3 py-2 text-sm text-white placeholder:text-amber-300/70 outline-none focus:border-amber-500" placeholder="Email" />
            <textarea className="w-full rounded-md border border-amber-700 bg-amber-900/30 px-3 py-2 text-sm text-white placeholder:text-amber-300/70 outline-none focus:border-amber-500" placeholder="Nội dung" rows={3} />
            <button type="button" onClick={() => alert('Cảm ơn bạn! Chúng tôi đã nhận thông tin.')} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-400">
              Gửi liên hệ
            </button>
          </form>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-amber-200/70">
        © {new Date().getFullYear()} Đội thi 3 Công Chúa. All rights reserved.
      </p>
    </footer>
  )
}

/* ====================================================================
   APP
   ==================================================================== */
function AppContent() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <SideNav />
      <HeroSection />
      <PrincessesSection />
      <ThanhHoaSection />
      <NemChuaSection />
      <QuangNinhSection />
      <DacSanBienSection />
      <HungYenSection />
      <VanMieuHeritageSection />
      <DaiHocMoSection />
      <Footer />
      <ChatWidget />
      <CartDrawer />
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}
