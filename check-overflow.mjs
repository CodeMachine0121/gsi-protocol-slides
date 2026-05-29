// Detect slides whose content overflows the 552px Slidev canvas (which is
// overflow:hidden, so excess content gets clipped at the bottom).
//
// Loads the /export/ route — it renders every slide statically with ALL
// v-click steps revealed, i.e. the worst case you hit clicking through live.
//
// Usage:
//   bun run check                 # spawns its own dev server, checks, tears down
//   BASE=http://localhost:3030 bun run check   # reuse an already-running server
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'

const PORT = process.env.PORT ?? 3037
const BASE = process.env.BASE ?? `http://localhost:${PORT}`
const ownServer = !process.env.BASE

async function waitForServer(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const r = await fetch(url)
      if (r.ok) return true
    } catch {}
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error(`dev server did not become ready at ${url}`)
}

let server
if (ownServer) {
  console.log(`Starting dev server on :${PORT} …`)
  server = spawn('npx', ['slidev', '--port', String(PORT)], { stdio: 'ignore' })
  await waitForServer(`${BASE}/`)
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1100, height: 800 } })
await page.goto(`${BASE}/export/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(2500) // settle mermaid + fonts

const results = await page.evaluate(() => {
  const pages = [...document.querySelectorAll('.slidev-page')]
  return pages.map((pg, idx) => {
    const c = pg.querySelector('.slidev-slide-content') || pg
    const cr = c.getBoundingClientRect()
    const scale = cr.height / 552 || 1 // real canvas height is 552px
    let maxBottom = cr.top
    for (const e of c.querySelectorAll('*')) {
      const r = e.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) maxBottom = Math.max(maxBottom, r.bottom)
    }
    const h = c.querySelector('h1,h2')
    return {
      slide: idx + 1,
      title: h ? h.textContent.trim().slice(0, 26) : '(section/cover)',
      overflow: Math.round((maxBottom - cr.bottom) / scale),
      used: Math.round((maxBottom - cr.top) / scale),
    }
  })
})

await browser.close()
if (server) server.kill()

console.log('slide | overflowPx | used/552 | title')
console.log('------+------------+----------+--------------------------')
for (const r of results) {
  const flag = r.overflow > 6 ? '  ⚠️ OVERFLOW' : (r.overflow > -20 ? '  ~tight' : '')
  console.log(`${String(r.slide).padStart(3)}   | ${String(r.overflow).padStart(7)}    | ${String(r.used).padStart(4)}/552 | ${r.title}${flag}`)
}
const over = results.filter(r => r.overflow > 6)
console.log(`\n${over.length} overflow: [${over.map(r => r.slide).join(', ')}]`)
process.exit(over.length > 0 ? 1 : 0)
