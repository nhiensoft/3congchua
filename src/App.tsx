import { useEffect, useRef, useState, type ReactNode, type ComponentType } from 'react'
import {
  Landmark, Waves, Wheat, GraduationCap,
  Leaf, ShieldCheck, Truck,
  Brain, Star, PartyPopper,
  Heart,
  Menu as MenuIcon, X as XIcon, Gift,
  ChevronLeft, ChevronRight,
  type LucideProps,
} from 'lucide-react'

/* ====================================================================
   TYPES
   ==================================================================== */
type Province = 'thanh-hoa' | 'quang-ninh' | 'hung-yen'

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

const SIDE_NAV_ITEMS: { id: string; label: string; Icon: ComponentType<LucideProps> }[] = [
  { id: 'thanh-hoa', label: 'Thanh Hóa', Icon: Landmark },
  { id: 'quang-ninh', label: 'Quảng Ninh', Icon: Waves },
  { id: 'hung-yen', label: 'Hưng Yên', Icon: Wheat },
  { id: 'dai-hoc-mo', label: 'Đại Học Mở', Icon: GraduationCap },
]

const PRINCESSES = [
  {
    id: 'thanh-hoa' as Province,
    name: 'Công chúa Đất Việt',
    province: 'Thanh Hóa',
    quote: '"Em là công chúa đất Việt - Thanh Hoá! Nơi khởi nguồn của những triều đại huy hoàng."',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'quang-ninh' as Province,
    name: 'Công chúa Biển Xanh',
    province: 'Quảng Ninh',
    quote: '"Quảng Ninh với Vịnh Hạ Long kỳ vĩ và những truyền thuyết hấp dẫn luôn khiến lòng người mê đắm."',
    image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'hung-yen' as Province,
    name: 'Công chúa Đất Lúa',
    province: 'Hưng Yên',
    quote: '"Hưng Yên, Phố Hiến xưa, nơi lưu giữ những nét đẹp văn hóa độc đáo và những đặc sản trứ danh."',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop',
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
      const dm = document.getElementById('dai-hoc-mo')
      if (!th || !dm) return
      const top = th.getBoundingClientRect().top
      const bot = dm.getBoundingClientRect().bottom
      setShow(top < window.innerHeight * 0.5 && bot > 100)
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [])
  return show
}

/* ====================================================================
   SHARED COMPONENTS
   ==================================================================== */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
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
   SIDE NAV (Vertical left)
   ==================================================================== */
function SideNav() {
  const show = useSideNavVisible()
  const active = useActiveSection(['thanh-hoa', 'quang-ninh', 'hung-yen', 'dai-hoc-mo'])

  return (
    <nav className={`side-nav glass-dark ${show ? '' : 'hidden'}`}>
      {SIDE_NAV_ITEMS.map(item => {
        const isActive = active === item.id
        return (
          <a key={item.id} href={`#${item.id}`} className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-center transition cursor-pointer ${isActive ? 'bg-amber-500/20 text-amber-300' : 'text-white/60 hover:text-white/90'}`}>
            <item.Icon className="h-5 w-5" />
            <span className="text-[9px] font-semibold leading-tight">{item.label}</span>
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
          {NAV_ITEMS.map(item => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-white/80 transition hover:text-amber-300">{item.label}</a>
          ))}
        </nav>

        <button onClick={() => setOpen(v => !v)} className="rounded-md border border-amber-400/50 p-2 text-amber-300 lg:hidden cursor-pointer" aria-label="Menu">
          {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-900/95 px-4 py-3 lg:hidden backdrop-blur">
          <div className="grid gap-2">
            {NAV_ITEMS.map(item => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-md px-2 py-1.5 text-sm text-white/80 hover:bg-white/10 hover:text-amber-300">{item.label}</a>
            ))}
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video autoPlay loop muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-black/40 z-[2]" />

      {/* Content */}
      <div className="relative z-[3] text-center px-4 max-w-4xl mx-auto mt-16">
        <Reveal>
          <h1 className="gradient-title text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight" style={{ lineHeight: '1.05' }}>
            Vọng Âm Quá Khứ
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-3 text-xl md:text-3xl lg:text-4xl font-bold text-white" style={{ textShadow: '0 0 8px rgba(245,197,66,0.55), 0 2px 8px rgba(0,0,0,0.35)' }}>
            Hành Trình Di Sản Của 3 Công Chúa
          </p>
        </Reveal>
        <Reveal delay={400}>
          <p className="mt-5 text-lg md:text-2xl font-medium text-white/95" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.45)' }}>
            Nơi Dấu Ấn Ba Miền Thăng Hoa, Tri Thức Kiến Tạo Tương Lai
          </p>
        </Reveal>
        <Reveal delay={600}>
          <p className="mt-4 text-sm md:text-base text-white/85 max-w-2xl mx-auto" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            Cùng 3 Công Chúa dấn thân vào một hành trình khám phá những câu chuyện từ ngàn xưa, những giá trị văn hóa bất diệt và ước mơ kiến tạo tương lai
          </p>
        </Reveal>
        <Reveal delay={800}>
          <a href="#gioi-thieu" className="btn-shine mt-8 inline-flex rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 font-bold text-white shadow-lg shadow-amber-500/25 transition hover:shadow-amber-500/40 hover:scale-105">
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
function PrincessesSection() {
  return (
    <section id="gioi-thieu" className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-amber-300 md:text-4xl">3 Công Chúa: Lời Tự Sự Từ Trái Tim</h2>
            <p className="mx-auto mt-3 max-w-3xl text-white/70">Mỗi công chúa là một người kể chuyện, dẫn bạn qua từng miền đất với góc nhìn riêng, giàu cảm xúc và đậm giá trị văn hóa.</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {PRINCESSES.map((p, i) => (
            <Reveal key={p.id} delay={i * 200}>
              <article className="group text-center">
                <div className="mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full border-4 border-amber-400/60 shadow-lg shadow-amber-500/20 transition group-hover:border-amber-300 group-hover:shadow-amber-500/40">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-110" />
                </div>
                <h3 className="text-lg font-bold text-amber-200">{p.name}</h3>
                <p className="text-sm text-amber-400/80">{p.province}</p>
                <div className="mt-3 glass-dark rounded-xl p-4 text-sm text-white/80 italic leading-relaxed">
                  {p.quote}
                </div>
                <a href={`#${p.id}`} className="mt-4 inline-flex rounded-lg border border-amber-400/40 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-400/10">
                  Xem quê hương tôi
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ====================================================================
   THANH HÓA SECTION
   ==================================================================== */
function ThanhHoaSection() {
  const [page, setPage] = useState(0)
  const [accActive, setAccActive] = useState(0)
  const [subSlide, setSubSlide] = useState(0) // sub-navigation within "Di tích lịch sử"
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState<Record<number, boolean>>({})
  const [orderOpen, setOrderOpen] = useState(false)

  // Sub-slides for "Di tích lịch sử" accordion item
  const diTichSlides = [
    { title: 'Thành Nhà Hồ', image: '/images/thanh-nha-ho.png', desc: 'Thành Nhà Hồ là di sản văn hóa thế giới UNESCO, được xây dựng năm 1397, là công trình thành đá độc đáo nhất Đông Nam Á.' },
    { title: 'Lam Kinh', image: '/images/lam-kinh.png', desc: 'Lam Kinh là vùng đất linh thiêng gắn với triều Hậu Lê, kinh đô thứ hai nơi dâng trào hào khí giữ nước.' },
    { title: 'Trống đồng Đông Sơn', image: '/images/trong-dong.png', desc: 'Biểu tượng của văn minh Việt cổ, phản ánh đời sống vật chất và tinh thần rực rỡ của cư dân Lạc Việt xưa.' },
  ]

  const accItems = [
    { title: 'Di tích lịch sử', image: diTichSlides[subSlide].image, desc: diTichSlides[subSlide].desc, hasSubNav: true },
    { title: 'Danh lam thắng cảnh', image: '/images/bien-sam-son.png', desc: 'Biển Sầm Sơn được bao bọc bởi núi Trường Lệ và đền Độc Cước, tạo nên cảnh quan hùng vĩ.' },
    { title: 'Người kiên cường', image: '/images/le-hoi-poon-poong.png', desc: 'Lễ hội Pôồn Pôông - nghi lễ dân gian đặc sắc của người Mường tại Thanh Hóa, thường tổ chức vào rằm tháng Giêng hoặc tháng Bảy, cầu mùa màng bội thu và nhân khang vật thịnh.' },
  ]

  const stepLabels = ['Di tích lịch sử', 'Khám phá báu vật', 'Thưởng thức vị quê']

  const handleQuizAnswer = (ans: string) => {
    if (quizAnswered[quizIdx]) return
    const correct = ans === QUIZ_QUESTIONS[quizIdx].answer
    setQuizAnswered(s => ({ ...s, [quizIdx]: true }))
    if (correct) setQuizScore(s => s + 10)
  }

  return (
    <section id="thanh-hoa" className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 40%, #7f1d1d 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-amber-200 md:text-4xl">Thanh Hóa: Nơi Khởi Nguyên Của Những Triều Đại</h2>
            <p className="mt-2 text-amber-100/70">Hào Khí Ngàn Năm</p>
          </div>
        </Reveal>

        {/* Page 1: Horizontal Accordion (Di tích with sub-nav, Thắng cảnh, Lễ hội) */}
        {page === 0 && (
          <Reveal>
            <div className="h-accordion">
              {accItems.map((item, i) => (
                <div key={item.title} className={`h-accordion-item ${i === accActive ? 'active' : ''}`} onClick={() => setAccActive(i)}>
                  <img src={item.image} alt={item.title} className="acc-bg" />
                  <div className="collapsed-title">{item.title}</div>
                  <div className="overlay-content">
                    <div className="glass-dark rounded-xl p-4">
                      <h3 className="text-lg font-bold text-amber-200">{i === 0 ? diTichSlides[subSlide].title : item.title}</h3>
                      <p className="mt-2 text-sm text-white/85 leading-relaxed">{item.desc}</p>
                      {/* Sub-navigation arrows within "Di tích lịch sử" */}
                      {i === 0 && item.hasSubNav && (
                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={e => { e.stopPropagation(); setSubSlide(s => Math.max(0, s - 1)) }} disabled={subSlide === 0} className="rounded-full border border-amber-400/40 p-1 text-amber-300 disabled:opacity-30 hover:bg-amber-500/20 cursor-pointer"><ChevronLeft className="h-4 w-4" /></button>
                          <span className="text-xs text-amber-300/70">{subSlide + 1} / {diTichSlides.length}</span>
                          <button onClick={e => { e.stopPropagation(); setSubSlide(s => Math.min(diTichSlides.length - 1, s + 1)) }} disabled={subSlide === diTichSlides.length - 1} className="rounded-full border border-amber-400/40 p-1 text-amber-300 disabled:opacity-30 hover:bg-amber-500/20 animate-pulse cursor-pointer"><ChevronRight className="h-4 w-4" /></button>
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
          <Reveal>
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

        {/* Page 3: Nem chua product */}
        {page === 2 && (
          <Reveal>
            <div className="glass-dark rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2">
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

                  <button onClick={() => setOrderOpen(true)} className="btn-shine mt-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 font-bold text-white shadow-lg">
                    TRẢI NGHIỆM VỊ QUÊ
                  </button>
                </div>
                <div className="relative min-h-[300px] bg-gradient-to-br from-red-900/50 to-red-800/30 flex items-center justify-center p-8">
                  <img src="https://images.unsplash.com/photo-1600891963935-c1a1f4dcf04b?q=80&w=800&auto=format&fit=crop" alt="Nem chua Thanh Hóa" className="max-h-80 rounded-2xl object-cover shadow-2xl" />
                  <div className="product-badge">Độc quyền<br/>3 Công Chúa</div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <ProgressBar steps={stepLabels} current={page} onNav={setPage} color="#fbbf24" />
      </div>
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} productName="Nem Chua Thanh Hóa" accentColor="#dc2626" />
    </section>
  )
}

/* ====================================================================
   QUẢNG NINH SECTION
   ==================================================================== */
function QuangNinhSection() {
  const [page, setPage] = useState(0)
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null)
  const [orderOpen, setOrderOpen] = useState(false)

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

  const stepLabels = ['Khám phá biển đảo', 'Di sản văn hóa', 'Carnaval Hạ Long', 'Đặc sản biển']

  return (
    <section id="quang-ninh" className="py-16 md:py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 40%, #0c4a6e 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-cyan-200 md:text-4xl">Quảng Ninh: Kỳ Quan Biển Đảo</h2>
            <p className="mt-2 text-cyan-100/70">Nơi hội tụ cảnh sắc thiên nhiên hùng vĩ, lịch sử chống ngoại xâm và những lễ hội biển sôi động.</p>
          </div>
        </Reveal>

        {/* Page 1: Sea map with islands */}
        {page === 0 && (
          <Reveal>
            <div className="glass-dark rounded-2xl overflow-hidden">
              <div className="relative h-[400px] md:h-[500px]">
                <img src="/images/ban-do-bien-qn.png" alt="Bản đồ biển Quảng Ninh" className="w-full h-full object-cover" />
                {islands.map(p => (
                  <button key={p.id} onClick={() => setSelectedIsland(p.id)} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all ${selectedIsland === p.id ? 'border-amber-300 bg-amber-400 scale-125' : 'border-white bg-amber-500 hover:scale-110'} px-3 py-1.5 text-xs font-bold text-white shadow-lg`} style={{ left: p.x, top: p.y }}>
                    {p.name}
                  </button>
                ))}
              </div>
              {selectedIsland && (() => {
                const island = islands.find(i => i.id === selectedIsland)!
                return (
                  <div className="p-5 flex flex-col md:flex-row gap-4 items-center">
                    <img src={island.image} alt={island.name} className="w-full md:w-64 h-40 rounded-xl object-cover" />
                    <div>
                      <h3 className="text-lg font-bold text-cyan-200">{island.name}</h3>
                      <p className="mt-2 text-sm text-white/80">{island.text}</p>
                    </div>
                  </div>
                )
              })()}
            </div>
          </Reveal>
        )}

        {/* Page 2: Di sản & Văn hóa */}
        {page === 1 && (
          <Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {heritage.map((h, i) => (
                <Reveal key={h.name} delay={i * 150}>
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
          <Reveal>
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

        {/* Page 4: Chả mực product */}
        {page === 3 && (
          <Reveal>
            <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)' }}>
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

                  <button onClick={() => setOrderOpen(true)} className="btn-shine mt-4 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-6 py-3 font-bold text-white shadow-lg w-fit">
                    ĐẶT HÀNG NGAY
                  </button>
                </div>
                <div className="relative min-h-[300px] flex items-center justify-center p-8 bg-teal-900/30">
                  <img src="/images/cha-muc.png" alt="Chả mực Hạ Long" className="max-h-72 rounded-2xl object-contain drop-shadow-2xl" />
                  <div className="product-badge" style={{ background: 'linear-gradient(135deg, #ffd700, #f59e0b)' }}>Đặc sản<br/>Tuyển chọn</div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <ProgressBar steps={stepLabels} current={page} onNav={setPage} color="#22d3ee" />
      </div>
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} productName="Chả Mực Hạ Long" accentColor="#0d9488" />
    </section>
  )
}

/* ====================================================================
   HƯNG YÊN SECTION
   ==================================================================== */
function HungYenSection() {
  const [page, setPage] = useState(0)
  const [orderOpen, setOrderOpen] = useState(false)

  const stepLabels = ['Phố Hiến nàng thơ', 'Vườn nhãn cổ thụ', 'Long nhãn tiến vua']

  return (
    <section id="hung-yen" className="py-16 md:py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a2e05 0%, #365314 40%, #1a2e05 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-emerald-200 md:text-4xl">Hưng Yên: Phố Hiến Xưa, Vị Ngọt Nhãn Lồng</h2>
            <p className="mt-2 text-emerald-100/70">Nơi lưu giữ những nét đẹp văn hóa truyền thống qua hệ thống di tích, lễ hội và đặc sản nổi tiếng.</p>
          </div>
        </Reveal>

        {/* Page 1: Phố Hiến */}
        {page === 0 && (
          <Reveal>
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
          <Reveal>
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
                <div className="mt-6">
                  <img src="/images/vuon-nhan.png" alt="Vườn nhãn 360" className="w-80 h-52 md:w-[500px] md:h-72 rounded-2xl object-cover shadow-2xl" />
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
          <Reveal>
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

                  <button onClick={() => setOrderOpen(true)} className="btn-shine mt-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 px-6 py-3 font-bold text-white shadow-lg w-fit" style={{ fontFamily: 'Georgia, serif' }}>
                    ĐẶT HÀNG NGAY
                  </button>

                  <div className="mt-4 glass-gold rounded-xl p-4">
                    <p className="text-sm font-bold text-amber-200 flex items-center gap-1"><Gift className="h-4 w-4" /> MUA COMBO 3 TỈNH - GIÁ ƯU ĐÃI</p>
                    <p className="text-2xl font-bold text-amber-300 mt-1">550.000đ</p>
                    <p className="text-xs text-white/60 mt-1">Nem chua + Chả mực + Long nhãn</p>
                  </div>
                </div>
                <div className="relative min-h-[350px] flex items-center justify-center p-8">
                  <img src="/images/long-nhan.png" alt="Long nhãn Hưng Yên" className="max-h-80 rounded-2xl object-cover shadow-2xl" />
                  <div className="product-badge">Sản vật<br/>Tiến Vua</div>
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
   NHÂN VẬT LỊCH SỬ & KẾ THỪA BIỂU TƯỢNG
   ==================================================================== */
const HISTORICAL_FIGURES = [
  { name: 'Trần Thái Tông', desc: 'Hoàng đế đầu tiên của nhà Trần. Năm 1253, đổi Quốc Tử Giám thành Quốc Học viện, mở rộng cho con cái thường dân có sức học xuất sắc.', initial: 'TT', color: 'from-amber-700 to-yellow-600' },
  { name: 'Trần Minh Tông', desc: 'Hoàng đế thứ năm của nhà Trần nước Đại Việt.', initial: 'TM', color: 'from-amber-800 to-orange-600' },
  { name: 'Chu Văn An', desc: 'Nhà giáo, thầy thuốc, quan viên Đại Việt cuối thời Trần — biểu tượng bất tử của đạo học Việt Nam.', initial: 'CA', color: 'from-red-800 to-rose-600' },
  { name: 'Trần Nghệ Tông', desc: 'Hoàng đế thứ 9 nhà Trần. Năm 1370, cho thờ Chu Văn An ở Văn Miếu bên cạnh Khổng Tử.', initial: 'TN', color: 'from-amber-700 to-yellow-600' },
  { name: 'Lê Thánh Tông', desc: 'Hoàng đế thứ năm của Lê Sơ. Năm 1484, cho dựng bia tiến sĩ từ khoa thi 1442 trở đi.', initial: 'LT', color: 'from-emerald-800 to-teal-600' },
  { name: 'Lê Hiển Tông', desc: 'Hoàng đế thứ 26 nhà Hậu Lê. Năm 1762, cho sửa lại Quốc Tử Giám, cơ sở đào tạo và giáo dục cao cấp.', initial: 'LH', color: 'from-blue-800 to-indigo-600' },
  { name: 'Vua Gia Long', desc: 'Vị vua sáng lập nhà Nguyễn. Năm 1802, ấn định Văn Miếu Hà Nội.', initial: 'GL', color: 'from-purple-800 to-violet-600' },
]

const TIMELINE_EVENTS = [
  { year: '1076', text: 'Quốc Tử Giám được thành lập' },
  { year: '1253', text: 'Đổi thành Quốc Học Viện, mở rộng cho thường dân' },
  { year: '1307', text: 'Mở rộng quy mô Văn Miếu' },
  { year: '1484', text: 'Dựng bia tiến sĩ đầu tiên' },
  { year: '1762', text: 'Trùng tu Quốc Tử Giám' },
  { year: '1802', text: 'Ấn định Văn Miếu Hà Nội' },
  { year: '2010', text: 'UNESCO công nhận là Di sản tư liệu thế giới' },
]

function VanMieuHeritageSection() {
  return (
    <section id="giao-lo-dinh-menh" className="relative py-20 md:py-28 overflow-hidden bg-slate-950">
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">

        {/* Nhân vật lịch sử */}
        <Reveal>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-amber-300 md:text-5xl" style={{ textShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
              GIAO LỘ ĐỊNH MỆNH
            </h2>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/70">Khi những dòng chảy hội tụ về đại dương tri thức</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="glass mt-6 rounded-2xl p-6 text-left mb-12">
            <p className="text-sm text-white/85 leading-relaxed">
              Mang theo sự kiên cường của đất học Thanh Hóa, sức sống khoáng đạt của biển bạc Quảng Ninh, hay nét tinh tế từ phù sa Hưng Yên; định mệnh đã đưa ba tâm hồn đồng điệu gặp gỡ. Chúng mình không chỉ mang theo niềm tự hào quê hương, mà còn mang cả khát khao chinh phục những tầm cao mới, đem tri thức về xây dựng quê hương.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <h3 className="text-center text-xl font-bold text-amber-200 md:text-2xl mb-8">Những Nhân Vật Kiến Tạo Nền Giáo Dục Việt</h3>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {HISTORICAL_FIGURES.map((fig, i) => (
              <Reveal key={fig.name} delay={i * 80}>
                <div className="text-center">
                  <div className={`mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${fig.color} text-2xl font-extrabold text-white shadow-lg md:h-24 md:w-24`}>
                    {fig.initial}
                  </div>
                  <h4 className="text-sm font-bold text-amber-200 md:text-base">{fig.name}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-white/70 md:text-sm">{fig.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Timeline */}
        <Reveal delay={300}>
          <div className="mt-16 mb-12">
            <h3 className="text-center text-lg font-bold text-amber-200 md:text-xl mb-6">Dòng Chảy Lịch Sử</h3>
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-amber-400/30" />
              {TIMELINE_EVENTS.map((ev, i) => (
                <div key={ev.year} className={`relative mb-6 flex items-start gap-4 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} md:px-8`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <span className="text-lg font-extrabold text-amber-300">{ev.year}</span>
                    <p className="text-xs text-white/75 mt-0.5 leading-relaxed md:text-sm">{ev.text}</p>
                  </div>
                  <div className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-amber-400 bg-slate-950 mt-1" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Thân Nhân Trung quote */}
        <Reveal delay={400}>
          <div className="mt-8 text-center">
            <blockquote className="mx-auto max-w-2xl">
              <p className="text-xl font-bold italic text-amber-200 md:text-2xl" style={{ fontFamily: 'Georgia, serif' }}>
                "Hiền tài là nguyên khí quốc gia, nguyên khí thịnh thì thế nước mạnh mà hưng, nguyên khí suy thì thế nước yếu mà thấp."
              </p>
              <footer className="mt-4 text-sm font-medium text-amber-400/80">
                — Thân Nhân Trung
              </footer>
            </blockquote>
          </div>
        </Reveal>

        {/* KẾ THỪA TỪ BIỂU TƯỢNG */}
        <Reveal delay={500}>
          <div className="mt-16">
            <h3 className="text-center text-xl font-bold text-amber-200 md:text-2xl" style={{ fontFamily: 'Georgia, serif' }}>
              KẾ THỪA TỪ BIỂU TƯỢNG, VƯƠN XA BẰNG KHÁT VỌNG
            </h3>
            <p className="mt-4 mx-auto max-w-3xl text-center text-sm text-white/80 leading-relaxed">
              Khép lại không gian cổ kính của Văn Miếu, chúng ta bắt đầu một hành trình mới — nơi biểu tượng Khuê Văn Các được nâng niu trên ngực áo của hàng vạn sinh viên. Hãy cùng khám phá xem, tinh thần đạo học nghìn năm đã được Trường Đại học Mở Hà Nội kế thừa và lan tỏa như thế nào.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="glass-gold rounded-2xl p-6">
                <h4 className="text-lg font-bold text-amber-200">Khuê Văn Các</h4>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">
                  Hình tượng Khuê Văn Các biểu tượng cho Quốc Tử Giám — Trường Đại học đầu tiên của Việt Nam. Khuê Văn Các chính là biểu tượng của sự đỗ đạt, thành công trong học hành và sự nghiệp, đồng thời thể hiện khát vọng vươn lên của con người Việt Nam qua mọi thời đại.
                </p>
              </div>
              <div className="glass-gold rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/images/logo-dh-mo.png" alt="Logo ĐH Mở" className="h-12 w-12 rounded-full object-contain bg-white p-1 border-2 border-amber-400/50" />
                  <h4 className="text-lg font-bold text-amber-200">Trường Đại học Mở Hà Nội</h4>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Hình tượng Khuê Văn Các được sử dụng trong logo, tượng trưng cho sứ mệnh tiên phong trong giáo dục mở và đào tạo từ xa ở Việt Nam. Hình tượng ô cửa tượng trưng cho cánh cửa tri thức. Các tia sáng tỏa đi các hướng mang ý nghĩa luôn hội nhập, nâng cao chất lượng đào tạo — tượng trưng cho ước mơ bay cao, bay xa của người học.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  )
}

/* ====================================================================
   ĐẠI HỌC MỞ HÀ NỘI — EXPANDED
   ==================================================================== */
const HOU_STATS = [
  { value: '32', label: 'Năm', sub: 'hình thành & phát triển' },
  { value: '5', label: 'Ngành', sub: 'đào tạo chuyên sâu' },
  { value: '35.000+', label: 'Sinh viên', sub: 'đang theo học' },
  { value: '~95%', label: 'Có việc làm', sub: 'sau tốt nghiệp' },
  { value: '79', label: 'Trạm', sub: 'đào tạo từ xa' },
]

const KHOA_KT_TABS = [
  {
    title: 'Quá trình hình thành',
    content: 'Được thành lập ngày 01/12/1993 theo quyết định của Bộ trưởng Bộ Giáo dục và Đào tạo, Khoa Kinh tế — Trường Đại học Mở Hà Nội là một đơn vị đào tạo có bề dày truyền thống với các hệ đào tạo đa dạng: ngành Kế toán, Quản trị kinh doanh và Thương mại điện tử.',
  },
  {
    title: 'Thành công vượt trội',
    content: 'Hành trình 32 năm mở, hội nhập và lan tỏa nổi bật với nhiều thành tích: Nhiều năm liên tục đạt danh hiệu Tập thể lao động xuất sắc của Chính phủ, Bằng khen của Thủ tướng vì nhiều thành tích trong đào tạo và NCKH, và nhiều bằng khen của Bộ trưởng Bộ GD&ĐT.',
  },
  {
    title: 'Chương trình đào tạo',
    content: 'Khoa đang quản lý 05 chương trình đào tạo: 03 bậc đại học (Kế toán, Quản trị kinh doanh, Thương mại điện tử) và 02 bậc thạc sĩ (Kế toán, Quản trị kinh doanh) với hơn 3.000 học viên, sinh viên đang theo học.',
  },
  {
    title: 'Hoạt động Văn – Thể – Mỹ',
    content: 'Khoa luôn coi trọng phát triển câu lạc bộ sinh viên: Econ Club, CLB TMĐT, CLB Kế toán, CLB Thể thao – Võ thuật. Thường xuyên tổ chức các cuộc thi Khởi nghiệp, Tài năng kinh doanh số, Tài năng kế toán, Olympic tiếng Anh, giải bóng đá nam-nữ.',
  },
]

function DaiHocMoSection() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section id="dai-hoc-mo" className="bg-slate-900 py-14 text-white md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">

        {/* Title */}
        <Reveal>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/images/logo-dh-mo.png" alt="Logo ĐH Mở" className="h-14 w-14 rounded-full object-contain bg-white p-1 border-2 border-amber-400/50" />
            </div>
            <h2 className="text-2xl font-extrabold md:text-4xl">
              TRƯỜNG ĐẠI HỌC MỞ HÀ NỘI
            </h2>
            <p className="mt-1 text-lg font-semibold text-amber-300">
              Viết Tiếp Chương Mới Của Trí Tuệ Việt
            </p>
            <p className="mt-3 mx-auto max-w-2xl text-sm text-slate-300 leading-relaxed">
              Đại học Mở Hà Nội là cơ sở giáo dục đại học công lập đa ngành, định hướng mở rộng cơ hội học tập, phát triển năng lực thực tiễn và hội nhập.
            </p>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal delay={100}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5 mb-12">
            {HOU_STATS.map(s => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-amber-300 md:text-3xl">{s.value}</p>
                <p className="text-sm font-semibold text-white mt-1">{s.label}</p>
                <p className="text-[10px] text-white/50 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Khoa Kinh tế */}
        <Reveal delay={200}>
          <div className="rounded-2xl border border-slate-700 bg-slate-800/80 overflow-hidden">
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-extrabold md:text-2xl">KHOA KINH TẾ, TRƯỜNG ĐẠI HỌC MỞ HÀ NỘI</h3>
              <p className="mt-1 text-sm text-amber-300/80">Kiến tạo tương lai</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap border-t border-slate-700">
              {KHOA_KT_TABS.map((tab, i) => (
                <button
                  key={tab.title}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 min-w-[140px] px-4 py-3 text-xs font-semibold transition cursor-pointer ${
                    activeTab === i
                      ? 'bg-amber-500/15 text-amber-300 border-b-2 border-amber-400'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              <p className="text-sm text-slate-200 leading-relaxed">{KHOA_KT_TABS[activeTab].content}</p>
            </div>

            {/* NGŨ MỞ */}
            <div className="border-t border-slate-700 p-6 md:p-8">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-amber-300 mb-3">5 chữ MỞ</h4>
              <div className="flex flex-wrap gap-2">
                {['Mở cơ hội', 'Mở trí tuệ', 'Mở trái tim', 'Mở tầm nhìn', 'Mở tương lai'].map(v => (
                  <span key={v} className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">{v}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* 2 ô clickable */}
        <Reveal delay={300}>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href="#lien-he"
              className="glass group flex items-center gap-4 rounded-xl p-5 transition hover:bg-white/15"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                <Heart className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-200 group-hover:text-amber-100">Gửi câu hỏi cho chúng tôi</p>
                <p className="text-xs text-white/60">Liên hệ trực tiếp với đội ngũ dự án</p>
              </div>
            </a>
            <a
              href="https://tuyensinh.hou.edu.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass group flex items-center gap-4 rounded-xl p-5 transition hover:bg-white/15"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                <GraduationCap className="h-6 w-6 text-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-200 group-hover:text-emerald-100">Tuyển sinh</p>
                <p className="text-xs text-white/60">Tìm hiểu thông tin tuyển sinh tại tuyensinh.hou.edu.vn</p>
              </div>
            </a>
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
export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <SideNav />
      <HeroSection />
      <PrincessesSection />
      <ThanhHoaSection />
      <QuangNinhSection />
      <HungYenSection />
      <VanMieuHeritageSection />
      <DaiHocMoSection />
      <Footer />
    </div>
  )
}
