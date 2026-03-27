const css = document.createElement('link')
css.rel = 'stylesheet'
css.href = '/legacy/index.css'
document.head.appendChild(css)

const script = document.createElement('script')
script.src = '/legacy/index.js'
script.defer = true

function injectHeroLogo() {
  if (document.getElementById('hero-logo-badge')) return

  const hero = document.querySelector('section.relative.min-h-screen') as HTMLElement | null
  if (!hero) return

  const badge = document.createElement('div')
  badge.id = 'hero-logo-badge'
  badge.style.position = 'absolute'
  badge.style.top = '24px'
  badge.style.left = '24px'
  badge.style.zIndex = '30'
  badge.style.display = 'flex'
  badge.style.alignItems = 'center'
  badge.style.gap = '8px'
  badge.style.padding = '6px 10px'
  badge.style.borderRadius = '9999px'
  badge.style.background = 'rgba(255,255,255,0.12)'
  badge.style.backdropFilter = 'blur(4px)'
  badge.style.border = '1px solid rgba(255,255,255,0.25)'

  const img = document.createElement('img')
  img.src = '/logo-3-cong-chua.jpg'
  img.alt = 'Logo 3 công chúa'
  img.style.width = '36px'
  img.style.height = '36px'
  img.style.objectFit = 'cover'
  img.style.borderRadius = '9999px'

  const label = document.createElement('span')
  label.textContent = '3 công chúa'
  label.style.color = '#fff'
  label.style.fontSize = '12px'
  label.style.fontWeight = '600'
  label.style.textTransform = 'lowercase'

  badge.appendChild(img)
  badge.appendChild(label)
  hero.appendChild(badge)
}

const mount = () => {
  document.body.appendChild(script)
  const tryInject = () => injectHeroLogo()
  // Legacy bundle renders asynchronously; observe until hero appears.
  const observer = new MutationObserver(() => {
    tryInject()
    if (document.getElementById('hero-logo-badge')) observer.disconnect()
  })
  observer.observe(document.body, { childList: true, subtree: true })
  setTimeout(tryInject, 300)
  setTimeout(tryInject, 1200)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true })
} else {
  mount()
}
