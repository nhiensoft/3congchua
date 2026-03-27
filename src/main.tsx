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

  // Remove old yellow circle "VÂ" icon.
  const maybeOldBadge = brandWrap.firstElementChild as HTMLElement | null
  if (maybeOldBadge && (maybeOldBadge.textContent || '').includes('VÂ')) {
    maybeOldBadge.remove()
  }

  // Update title to the exact small label requested.
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

  // Ensure old hero-floating badge is removed if present from prior versions.
  const oldHeroBadge = document.getElementById('hero-logo-badge')
  if (oldHeroBadge) oldHeroBadge.remove()

  return true
}

const mount = () => {
  document.body.appendChild(script)

  const tryPatch = () => patchHeaderBrand()
  const observer = new MutationObserver(() => {
    if (tryPatch()) observer.disconnect()
  })

  observer.observe(document.body, { childList: true, subtree: true })
  setTimeout(tryPatch, 300)
  setTimeout(tryPatch, 1200)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true })
} else {
  mount()
}
