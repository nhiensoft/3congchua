import { useMemo, useState } from 'react'

type Product = {
  id: string
  name: string
  image: string
  desc: string
  province: 'thanh-hoa' | 'quang-ninh' | 'hung-yen'
}

type GameItem = {
  id: string
  name: string
  province: 'hung-yen' | 'thai-binh'
}

const NAV_ITEMS = [
  { label: 'Giới thiệu', href: '#gioi-thieu' },
  { label: 'Bản đồ', href: '#ban-do' },
  { label: 'Thanh Hóa', href: '#thanh-hoa' },
  { label: 'Quảng Ninh', href: '#quang-ninh' },
  { label: 'Hưng Yên', href: '#hung-yen' },
  { label: 'Đại Học Mở', href: '#dai-hoc-mo' },
  { label: 'Liên Hệ', href: '#lien-he' },
]

const PRINCESSES = [
  {
    id: 'thanh-hoa',
    name: 'Công chúa Đất Việt',
    province: 'Thanh Hóa',
    quote:
      '“Thanh Hóa là mảnh đất địa linh nhân kiệt, nơi các triều đại phong kiến hưng thịnh với vô vàn di tích lịch sử và danh lam thắng cảnh tuyệt đẹp.”',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'quang-ninh',
    name: 'Công chúa Biển Xanh',
    province: 'Quảng Ninh',
    quote:
      '“Quảng Ninh với Vịnh Hạ Long kỳ vĩ và những truyền thuyết hấp dẫn luôn khiến lòng người mê đắm.”',
    image:
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'hung-yen',
    name: 'Công chúa Đất Lúa',
    province: 'Hưng Yên',
    quote:
      '“Hưng Yên, Phố Hiến xưa, nơi lưu giữ những nét đẹp văn hóa độc đáo và những đặc sản trứ danh.”',
    image:
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop',
  },
]

const FESTIVAL_CARDS = [
  {
    name: 'Lễ hội Yên Tử',
    icon: '🏔️',
    desc: 'Diễn ra từ mùng 10 tháng Giêng âm lịch, là hành trình về miền thiêng của Phật giáo Trúc Lâm.',
  },
  {
    name: 'Carnaval Hạ Long',
    icon: '🎪',
    desc: 'Thường tổ chức cuối tháng 4 – đầu tháng 5, thời điểm đẹp để du lịch Hạ Long và hòa vào không khí lễ hội biển.',
  },
  {
    name: 'Lễ hội Bạch Đằng',
    icon: '⚔️',
    desc: 'Diễn ra vào tháng 3 âm lịch, tưởng niệm chiến thắng Bạch Đằng và giáo dục truyền thống yêu nước.',
  },
]

const SAN_PHAM: Product[] = [
  {
    id: 'sp-th-1',
    name: 'Nem chua Thanh Hóa',
    image:
      'https://images.unsplash.com/photo-1600891963935-c1a1f4dcf04b?q=80&w=800&auto=format&fit=crop',
    desc: 'Món quà nổi tiếng của xứ Thanh với vị chua thanh, dai giòn và thơm mùi lá đinh lăng.',
    province: 'thanh-hoa',
  },
  {
    id: 'sp-qn-1',
    name: 'Chả mực Hạ Long',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop',
    desc: 'Đặc sản trứ danh của Quảng Ninh, thơm ngọt vị mực tươi, giã tay đậm chất biển.',
    province: 'quang-ninh',
  },
  {
    id: 'sp-hy-1',
    name: 'Nhãn lồng Hưng Yên',
    image:
      'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=800&auto=format&fit=crop',
    desc: 'Trái nhãn thơm ngọt nức tiếng, gắn với vùng đất văn hiến Phố Hiến.',
    province: 'hung-yen',
  },
]

const GAME_ITEMS: GameItem[] = [
  { id: 'gy-1', name: 'Nhãn lồng', province: 'hung-yen' },
  { id: 'gy-2', name: 'Tương Bần', province: 'hung-yen' },
  { id: 'gy-3', name: 'Long nhãn', province: 'hung-yen' },
  { id: 'gy-4', name: 'Bánh cáy', province: 'thai-binh' },
  { id: 'gy-5', name: 'Canh cá Quỳnh Côi', province: 'thai-binh' },
  { id: 'gy-6', name: 'Bánh gai Đại Đồng', province: 'thai-binh' },
]

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <a href="#" className="text-lg font-bold text-amber-900 md:text-xl">
          🏛️ Vọng Âm Quá Khứ
        </a>

        <nav className="hidden items-center gap-5 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-amber-800 transition hover:text-amber-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-amber-300 px-3 py-1.5 text-sm text-amber-800 md:hidden"
          aria-label="Mở menu"
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="border-t border-amber-200 bg-white px-4 py-3 md:hidden">
          <div className="grid gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1.5 text-sm text-amber-900 hover:bg-amber-50"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-white py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-6">
        <div>
          <p className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            Dự án văn hóa số
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-amber-950 md:text-5xl">
            Vọng Âm Quá Khứ
            <br />
            Hành Trình Di Sản của 3 Công Chúa
          </h1>
          <p className="mt-4 max-w-xl text-amber-800/90 md:text-lg">
            Cùng ba công chúa đi qua Thanh Hóa, Quảng Ninh, Hưng Yên để khám phá di tích,
            lễ hội, đặc sản và những câu chuyện văn hóa đậm hồn Việt.
          </p>
          <a
            href="#gioi-thieu"
            className="mt-6 inline-flex rounded-lg bg-amber-600 px-5 py-3 font-semibold text-white shadow transition hover:bg-amber-700"
          >
            Bắt đầu hành trình khám phá
          </a>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1200&auto=format&fit=crop"
            alt="Phong cảnh di sản Việt Nam"
            className="h-72 w-full rounded-2xl object-cover shadow-xl md:h-[440px]"
          />
          <div className="absolute -bottom-5 -left-3 rounded-xl bg-white/90 p-3 text-sm text-amber-800 shadow-lg">
            ✨ 3 tỉnh – 1 hành trình di sản
          </div>
        </div>
      </div>
    </section>
  )
}

function PrincessesSection() {
  return (
    <section id="gioi-thieu" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-950 md:text-4xl">Ba Công Chúa – Ba Miền Di Sản</h2>
        <p className="mx-auto mt-3 max-w-3xl text-amber-800/90">
          Mỗi công chúa là một người kể chuyện, dẫn bạn qua từng miền đất với góc nhìn riêng, giàu cảm xúc và đậm giá trị văn hóa.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {PRINCESSES.map((p) => (
          <article
            key={p.id}
            className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <img src={p.image} alt={p.name} className="h-52 w-full object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-bold text-amber-900">{p.name}</h3>
              <p className="text-sm text-amber-600">{p.province}</p>
              <p className="mt-3 text-sm leading-relaxed text-amber-800">{p.quote}</p>
              <a
                href={`#${p.id}`}
                className="mt-4 inline-flex rounded-md border border-amber-300 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50"
              >
                Khám phá {p.province}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function BanDoSection() {
  return (
    <section id="ban-do" className="bg-amber-50/60 py-14 md:py-18">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-amber-950 md:text-3xl">Bản Đồ Hành Trình</h2>
          <p className="mt-2 text-amber-800/90">Thanh Hóa → Quảng Ninh → Hưng Yên → Kết nối tri thức tại Đại học Mở Hà Nội.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { name: 'Thanh Hóa', icon: '🏰', desc: 'Cội nguồn lịch sử – văn hóa' },
            { name: 'Quảng Ninh', icon: '⛰️', desc: 'Kỳ quan thiên nhiên và lễ hội biển' },
            { name: 'Hưng Yên', icon: '🏮', desc: 'Phố Hiến xưa, lễ hội và đặc sản' },
            { name: 'Đại học Mở', icon: '🎓', desc: 'Kết nối di sản với tương lai' },
          ].map((item, idx) => (
            <div key={item.name} className="rounded-xl border border-amber-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl">{item.icon}</div>
              <h3 className="mt-2 font-bold text-amber-900">{item.name}</h3>
              <p className="mt-1 text-sm text-amber-700">{item.desc}</p>
              {idx < 3 && <p className="mt-2 text-amber-500">→</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ThanhHoaSection() {
  const [page, setPage] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180)
  const [score, setScore] = useState(0)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)

  useMemo(() => {
    if (!started || done) return
    const id = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(id)
          setDone(true)
          setStarted(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [started, done])

  const pages = [
    {
      title: 'Thành Nhà Hồ & Lam Kinh',
      text: 'Thành Nhà Hồ là di sản văn hóa thế giới; Lam Kinh là vùng đất linh thiêng gắn với triều Hậu Lê, mang đậm dấu ấn lịch sử dân tộc.',
      image:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Trống đồng Đông Sơn',
      text: 'Biểu tượng của văn minh Việt cổ, phản ánh đời sống vật chất và tinh thần rực rỡ của cư dân Lạc Việt xưa.',
      image:
        'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Đất thiêng xứ Thanh',
      text: 'Ngoài hệ thống di tích dày đặc, Thanh Hóa còn hấp dẫn bởi cảnh quan và đặc sản mang hồn đất Việt.',
      image:
        'https://images.unsplash.com/photo-1526779259212-756e4ffadf46?q=80&w=1200&auto=format&fit=crop',
    },
  ]

  return (
    <section id="thanh-hoa" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-amber-950 md:text-4xl">Thanh Hóa – Vùng Đất Cội Nguồn</h2>
        <p className="mt-3 text-amber-800/90">
          Hành trình mở đầu với các dấu mốc lịch sử lớn, nơi tinh thần dựng nước và giữ nước được lưu giữ qua từng di tích.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
        <img src={pages[page].image} alt={pages[page].title} className="h-64 w-full object-cover md:h-80" />
        <div className="p-6">
          <h3 className="text-xl font-bold text-amber-900">{pages[page].title}</h3>
          <p className="mt-2 text-amber-800">{pages[page].text}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {pages.map((item, idx) => (
              <button
                key={item.title}
                onClick={() => setPage(idx)}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  idx === page
                    ? 'bg-amber-600 text-white'
                    : 'border border-amber-300 text-amber-700 hover:bg-amber-50'
                }`}
              >
                Trang {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
          <h3 className="text-lg font-bold text-amber-900">🏗️ Minigame: Xây Thành trong 3 phút</h3>
          <p className="mt-2 text-sm text-amber-800">
            Thu thập vật liệu để hoàn thiện thành. Mỗi lần bấm “Thu thập vật liệu” +10 điểm.
          </p>

          <div className="mt-4 space-y-2 text-sm text-amber-900">
            <p>⏱️ Thời gian còn lại: {timeLeft}s</p>
            <p>⭐ Điểm: {score}</p>
            <p>
              {done
                ? score >= 100
                  ? '🎉 Xuất sắc! Bạn đã xây thành công Thành Nhà Hồ!'
                  : '⌛ Hết giờ! Thử lại để đạt từ 100 điểm nhé.'
                : 'Hãy tích lũy điểm trước khi hết giờ!'}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {!started && !done && (
              <button
                onClick={() => {
                  setStarted(true)
                  setScore(0)
                  setTimeLeft(180)
                }}
                className="rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700"
              >
                Bắt đầu
              </button>
            )}

            {started && (
              <button
                onClick={() => setScore((s) => s + 10)}
                className="rounded-md border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
              >
                Thu thập vật liệu (+10)
              </button>
            )}

            {done && (
              <button
                onClick={() => {
                  setDone(false)
                  setStarted(false)
                  setTimeLeft(180)
                  setScore(0)
                }}
                className="rounded-md border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
              >
                Chơi lại
              </button>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-amber-100 bg-white p-5">
          <h3 className="text-lg font-bold text-amber-900">🧠 Quiz nhanh</h3>
          <p className="mt-2 text-sm text-amber-800">Câu hỏi: Thành Nhà Hồ được xây dựng vào năm nào?</p>

          <div className="mt-4 grid gap-2">
            {['1397', '1400', '1428'].map((ans) => (
              <button
                key={ans}
                onClick={() => alert(ans === '1397' ? '✅ Chính xác!' : '❌ Chưa đúng, thử lại nhé!')}
                className="rounded-md border border-amber-300 px-3 py-2 text-left text-sm text-amber-900 hover:bg-amber-50"
              >
                {ans}
              </button>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-8 rounded-xl border border-amber-200 bg-white p-5">
        <h3 className="text-lg font-bold text-amber-900">🎁 Đặc sản tiêu biểu xứ Thanh</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {SAN_PHAM.filter((p) => p.province === 'thanh-hoa').map((sp) => (
            <div key={sp.id} className="overflow-hidden rounded-xl border border-amber-100">
              <img src={sp.image} alt={sp.name} className="h-36 w-full object-cover" />
              <div className="p-3">
                <h4 className="font-semibold text-amber-900">{sp.name}</h4>
                <p className="mt-1 text-sm text-amber-800">{sp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuangNinhSection() {
  const [selected, setSelected] = useState<string | null>(null)
  const points = [
    {
      id: 'tuan-chau',
      name: 'Đảo Tuần Châu',
      x: '40%',
      y: '58%',
      text: 'Tuần Châu là điểm du lịch biển nổi bật, thuận tiện để bắt đầu hành trình khám phá Vịnh Hạ Long.',
    },
    {
      id: 'ngoc-vung',
      name: 'Đảo Ngọc Vừng',
      x: '67%',
      y: '36%',
      text: 'Ngọc Vừng sở hữu bãi biển hoang sơ, nước trong xanh và không gian yên bình.',
    },
    {
      id: 'titop',
      name: 'Đảo Ti Tốp',
      x: '52%',
      y: '42%',
      text: 'Đảo Ti Tốp nổi tiếng với bãi tắm đẹp và điểm ngắm toàn cảnh Vịnh Hạ Long từ trên cao.',
    },
  ]

  return (
    <section id="quang-ninh" className="bg-sky-50/70 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-sky-950 md:text-4xl">Quảng Ninh – Miền Kỳ Quan Biển Đảo</h2>
          <p className="mt-3 text-sky-900/80">
            Nơi hội tụ cảnh sắc thiên nhiên hùng vĩ, lịch sử chống ngoại xâm và những lễ hội biển sôi động.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
            <div className="relative h-[360px]">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400&auto=format&fit=crop"
                alt="Bản đồ minh họa Quảng Ninh"
                className="h-full w-full object-cover"
              />

              {points.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sky-600 px-2 py-1 text-xs font-semibold text-white shadow hover:bg-sky-700"
                  style={{ left: p.x, top: p.y }}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="p-5">
              <h3 className="text-lg font-bold text-sky-900">🗺️ Khám phá điểm đến</h3>
              <p className="mt-2 text-sm text-sky-800">
                Hãy bấm vào từng địa điểm để đọc nhanh thông tin nổi bật.
              </p>
              {selected && (
                <div className="mt-3 rounded-lg bg-sky-50 p-3 text-sm text-sky-900">
                  {points.find((p) => p.id === selected)?.text}
                </div>
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-sky-900">Di tích & Giá trị văn hóa</h3>
            <ul className="mt-3 space-y-2 text-sm text-sky-900/90">
              <li>• Vịnh Hạ Long – di sản thiên nhiên thế giới với hệ sinh thái biển phong phú.</li>
              <li>• Sông Bạch Đằng – địa danh lịch sử gắn với các chiến thắng lẫy lừng.</li>
              <li>• Yên Tử – trung tâm văn hóa Phật giáo Trúc Lâm, điểm hành hương nổi tiếng.</li>
            </ul>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {FESTIVAL_CARDS.map((f) => (
                <div key={f.name} className="rounded-lg border border-sky-100 bg-sky-50 p-3">
                  <p className="text-lg">{f.icon}</p>
                  <h4 className="mt-1 text-sm font-semibold text-sky-900">{f.name}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-sky-800">{f.desc}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-8 rounded-xl border border-sky-200 bg-white p-5">
          <h3 className="text-lg font-bold text-sky-900">🎁 Đặc sản tiêu biểu Quảng Ninh</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {SAN_PHAM.filter((p) => p.province === 'quang-ninh').map((sp) => (
              <div key={sp.id} className="overflow-hidden rounded-xl border border-sky-100">
                <img src={sp.image} alt={sp.name} className="h-36 w-full object-cover" />
                <div className="p-3">
                  <h4 className="font-semibold text-sky-900">{sp.name}</h4>
                  <p className="mt-1 text-sm text-sky-800">{sp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function HungYenSection() {
  const [shuffled, setShuffled] = useState<GameItem[]>(() => [...GAME_ITEMS].sort(() => Math.random() - 0.5))
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<Record<string, boolean>>({})

  const handlePick = (item: GameItem, pick: 'hung-yen' | 'thai-binh') => {
    if (answered[item.id]) return
    const correct = item.province === pick
    setAnswered((s) => ({ ...s, [item.id]: true }))
    setScore((s) => s + (correct ? 10 : 0))
  }

  const done = Object.keys(answered).length === shuffled.length

  const reset = () => {
    setShuffled([...GAME_ITEMS].sort(() => Math.random() - 0.5))
    setScore(0)
    setAnswered({})
  }

  return (
    <section id="hung-yen" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-emerald-950 md:text-4xl">Hưng Yên – Phố Hiến Xưa</h2>
        <p className="mx-auto mt-3 max-w-4xl text-emerald-900/85">
          Hưng Yên lưu giữ nét đẹp văn hóa truyền thống qua hệ thống di tích, lễ hội và đặc sản nổi tiếng. 
          <strong>
            {' '}Lễ hội chùa Chuông diễn ra vào 15/1, 8/4, 15/4, 15/7 âm lịch (trong đó 8-15/4 âm lịch là dịp Phật Đản chính hội);
            Lễ hội chùa Keo diễn ra hai kỳ: Hội Xuân mùng 4 tháng Giêng và Hội Thu trung tuần tháng 9 âm lịch;
            Lễ hội đền Mẫu Phố Hiến diễn ra hằng năm từ 10-12/3 âm lịch (có nơi ghi 10-15/3).
          </strong>
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1200&auto=format&fit=crop"
            alt="Phố Hiến Hưng Yên"
            className="h-64 w-full object-cover"
          />
          <div className="p-5">
            <h3 className="text-lg font-bold text-emerald-900">Di tích tiêu biểu</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-emerald-900/90">
              <li>• Quần thể di tích Phố Hiến</li>
              <li>• Chùa Chuông</li>
              <li>• Đền Mẫu</li>
              <li>• Văn Miếu Xích Đằng</li>
            </ul>
          </div>
        </article>

        <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-900">🎮 Minigame phân loại đặc sản</h3>
          <p className="mt-2 text-sm text-emerald-800">
            Hưng Yên có nhiều đặc sản nổi tiếng. Bạn có thể phân loại đúng đặc sản thuộc về Hưng Yên hay Thái Bình không?
          </p>

          <p className="mt-3 text-sm font-semibold text-emerald-900">Điểm: {score}</p>

          <div className="mt-4 space-y-3">
            {shuffled.map((item) => (
              <div key={item.id} className="rounded-lg border border-emerald-100 p-3">
                <p className="font-medium text-emerald-900">{item.name}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePick(item, 'hung-yen')}
                    disabled={!!answered[item.id]}
                    className="rounded-md border border-emerald-300 px-3 py-1.5 text-sm text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
                  >
                    Hưng Yên
                  </button>
                  <button
                    onClick={() => handlePick(item, 'thai-binh')}
                    disabled={!!answered[item.id]}
                    className="rounded-md border border-emerald-300 px-3 py-1.5 text-sm text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
                  >
                    Thái Bình
                  </button>
                </div>
              </div>
            ))}
          </div>

          {done && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
              ✅ Hoàn thành! Tổng điểm của bạn: <strong>{score}</strong>
            </div>
          )}

          <button
            onClick={reset}
            className="mt-4 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Chơi lại
          </button>
        </article>
      </div>

      <div className="mt-8 rounded-xl border border-emerald-200 bg-white p-5">
        <h3 className="text-lg font-bold text-emerald-900">🎁 Đặc sản tiêu biểu Hưng Yên</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {SAN_PHAM.filter((p) => p.province === 'hung-yen').map((sp) => (
            <div key={sp.id} className="overflow-hidden rounded-xl border border-emerald-100">
              <img src={sp.image} alt={sp.name} className="h-36 w-full object-cover" />
              <div className="p-3">
                <h4 className="font-semibold text-emerald-900">{sp.name}</h4>
                <p className="mt-1 text-sm text-emerald-800">{sp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DaiHocMoSection() {
  const coreValues = ['Mở tri thức', 'Mở tư duy', 'Mở kỹ năng', 'Mở cơ hội', 'Mở kết nối']

  return (
    <section id="dai-hoc-mo" className="bg-slate-900 py-14 text-white md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold md:text-4xl">🎓 Đại học Mở Hà Nội</h2>
            <p className="mt-3 text-slate-200">
              Đại học Mở Hà Nội là cơ sở giáo dục đại học công lập đa ngành, định hướng mở rộng cơ hội học tập, phát triển năng lực thực tiễn và hội nhập.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                'Hơn 37.000 sinh viên đang theo học',
                'Môi trường học tập năng động và linh hoạt',
                'Đào tạo gắn với nhu cầu xã hội',
                'Khuyến khích đổi mới sáng tạo',
              ].map((item) => (
                <div key={item} className="rounded-lg border border-slate-700 bg-slate-800/70 p-3 text-sm text-slate-100">
                  ✅ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6">
            <h3 className="text-xl font-bold">Khoa Kinh tế</h3>
            <p className="mt-2 text-sm text-slate-200">
              Đào tạo nguồn nhân lực kinh tế chất lượng cao với ba ngành trọng tâm, phát triển tư duy quản trị và năng lực nghề nghiệp.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-100">
              <li>• Quản trị kinh doanh</li>
              <li>• Kế toán</li>
              <li>• Thương mại điện tử</li>
            </ul>

            <h4 className="mt-5 text-sm font-semibold uppercase tracking-wide text-amber-300">5 chữ MỞ</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {coreValues.map((v) => (
                <span key={v} className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="lien-he" className="bg-amber-950 py-12 text-amber-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3 md:px-6">
        <div>
          <h3 className="text-lg font-bold">🏛️ Vọng Âm Quá Khứ</h3>
          <p className="mt-2 text-sm text-amber-200/90">
            Hành trình di sản của 3 Công Chúa – kết nối lịch sử, văn hóa và giáo dục bằng trải nghiệm số.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Điều hướng</h4>
          <ul className="mt-2 space-y-1 text-sm">
            {[
              ['Giới thiệu', '#gioi-thieu'],
              ['Bản đồ', '#ban-do'],
              ['Thanh Hóa', '#thanh-hoa'],
              ['Quảng Ninh', '#quang-ninh'],
              ['Hưng Yên', '#hung-yen'],
              ['Đại học Mở', '#dai-hoc-mo'],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-amber-200/90 hover:text-white">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Liên hệ</h4>
          <form className="mt-3 space-y-2">
            <input
              className="w-full rounded-md border border-amber-700 bg-amber-900/30 px-3 py-2 text-sm text-white placeholder:text-amber-300/70"
              placeholder="Họ và tên"
            />
            <input
              className="w-full rounded-md border border-amber-700 bg-amber-900/30 px-3 py-2 text-sm text-white placeholder:text-amber-300/70"
              placeholder="Email"
            />
            <textarea
              className="w-full rounded-md border border-amber-700 bg-amber-900/30 px-3 py-2 text-sm text-white placeholder:text-amber-300/70"
              placeholder="Nội dung"
              rows={3}
            />
            <button
              type="button"
              onClick={() => alert('Cảm ơn bạn! Chúng tôi đã nhận thông tin.')}
              className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-400"
            >
              Gửi liên hệ
            </button>
          </form>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-amber-200/70">
        © {new Date().getFullYear()} Đội thi 3 công. All rights reserved.
      </p>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <HeroSection />
      <PrincessesSection />
      <BanDoSection />
      <ThanhHoaSection />
      <QuangNinhSection />
      <HungYenSection />
      <DaiHocMoSection />
      <Footer />
    </div>
  )
}
