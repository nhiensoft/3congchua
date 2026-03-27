const css = document.createElement('link')
css.rel = 'stylesheet'
css.href = '/legacy/index.css'
document.head.appendChild(css)

const script = document.createElement('script')
script.src = '/legacy/index.js'
script.defer = true

function patchHeaderBrand() {
  const heading = Array.from(document.querySelectorAll('h1')).find((el) =>
    (el.textContent || '').includes('Vọng Âm Quá Khứ')
  ) as HTMLElement | undefined

  if (!heading) return false

  const textBlock = heading.parentElement as HTMLElement | null
  const brandWrap = textBlock?.parentElement as HTMLElement | null
  if (!textBlock || !brandWrap) return false

  const maybeOldBadge = brandWrap.firstElementChild as HTMLElement | null
  if (maybeOldBadge && (maybeOldBadge.textContent || '').includes('VÂ')) {
    maybeOldBadge.remove()
  }

  heading.textContent = '3 công chúa'
  heading.style.fontSize = '14px'
  heading.style.lineHeight = '1.1'
  heading.style.letterSpacing = '0.01em'

  const subtitle = textBlock.querySelector('p') as HTMLElement | null
  if (subtitle) subtitle.remove()

  let logo = brandWrap.querySelector('#menu-logo-3-cong-chua') as HTMLImageElement | null
  if (!logo) {
    logo = document.createElement('img')
    logo.id = 'menu-logo-3-cong-chua'
    logo.src = '/logo-3-cong-chua.jpg'
    logo.alt = 'Logo 3 công chúa'
    logo.style.width = '40px'
    logo.style.height = '40px'
    logo.style.objectFit = 'cover'
    logo.style.borderRadius = '9999px'
    logo.style.border = '2px solid rgba(245,158,11,0.7)'
    logo.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)'
    brandWrap.insertBefore(logo, brandWrap.firstChild)
  }

  return true
}

function patchHeroContent() {
  const heroSection = document.querySelector('section.relative.min-h-screen') as HTMLElement | null
  if (!heroSection) return false

  const heroTitle = heroSection.querySelector('h1') as HTMLElement | null
  if (!heroTitle) return false

  // Remove any old injected floating badge in hero.
  const oldHeroBadge = document.getElementById('hero-logo-badge')
  if (oldHeroBadge) oldHeroBadge.remove()

  // Push hero content down so it does not overlap with the fixed top menu area.
  const textContainer = heroTitle.parentElement as HTMLElement | null
  if (textContainer) {
    textContainer.style.marginTop = '56px'
  }

  heroTitle.innerHTML = ''
  const mainLine = document.createElement('span')
  mainLine.textContent = 'Vọng Âm Quá Khứ'
  mainLine.style.display = 'block'

  const subLine = document.createElement('span')
  subLine.textContent = 'Hành Trình Di Sản Của 3 Công Chúa'
  subLine.style.display = 'block'
  subLine.style.fontSize = '0.65em'
  subLine.style.marginTop = '8px'

  heroTitle.appendChild(mainLine)
  heroTitle.appendChild(subLine)

  const introP = heroTitle.parentElement?.querySelector('p') as HTMLElement | null
  if (introP) {
    introP.textContent = 'Nơi Dấu Ấn 3 Miền Thăng Hoa, Tri Thức 3 Miền Thăng Hoa'
  }

  return true
}

const mount = () => {
  document.body.appendChild(script)

  const runPatches = () => {
    const ok1 = patchHeaderBrand()
    const ok2 = patchHeroContent()
    return ok1 && ok2
  }

  const observer = new MutationObserver(() => {
    if (runPatches()) observer.disconnect()
  })

  observer.observe(document.body, { childList: true, subtree: true })
  setTimeout(runPatches, 300)
  setTimeout(runPatches, 1200)
  setTimeout(runPatches, 2200)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true })
} else {
  mount()
}
