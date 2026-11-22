// The standalone Arena page needs Vue's global build; the maintained app uses Vite's npm import.
// /sitetrack.js loads posthog-js's no-external array build from the same origin.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const web = fileURLToPath(new URL('../../src/treg/web/', import.meta.url))
const vue = fileURLToPath(new URL('../node_modules/vue/', import.meta.url))
const { version } = JSON.parse(readFileSync(resolve(vue, 'package.json'), 'utf8'))
const html = readFileSync(resolve(web, 'enrich-arena.html'), 'utf8')
const url = html.match(/src="([^"]*\/vendor\/vue-([^/"]+)\.global\.prod\.js)"/)
if (!url || url[2] !== version) throw new Error(`enrich-arena.html must use the installed Vue ${version}`)
const target = resolve(web, url[1].replace(/^\//, ''))
mkdirSync(dirname(target), { recursive: true })
copyFileSync(resolve(vue, 'dist/vue.global.prod.js'), target)
copyFileSync(resolve(vue, 'LICENSE'), resolve(dirname(target), 'LICENSE'))

const posthog = fileURLToPath(new URL('../node_modules/posthog-js/', import.meta.url))
const posthogVersion = JSON.parse(readFileSync(resolve(posthog, 'package.json'), 'utf8')).version
const sitetrack = readFileSync(resolve(web, 'sitetrack.js'), 'utf8')
const posthogUrl = sitetrack.match(/"(\/vendor\/posthog-js-([^/"]+)\.array\.full\.no-external\.js)"/)
if (!posthogUrl || posthogUrl[2] !== posthogVersion) throw new Error(`sitetrack.js must use the installed posthog-js ${posthogVersion}`)
copyFileSync(resolve(posthog, 'dist/array.full.no-external.js'), resolve(web, posthogUrl[1].replace(/^\//, '')))
copyFileSync(resolve(posthog, 'LICENSE'), resolve(web, 'vendor/LICENSE-posthog-js'))
