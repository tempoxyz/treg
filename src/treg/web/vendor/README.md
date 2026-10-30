# Package-generated browser runtime

Vue and posthog-js are installed from `frontend/package-lock.json`. `frontend/scripts/copy-runtime.mjs`
copies Vue's global production build and license for Enrich Arena, and posthog-js's
`array.full.no-external.js` build and license for `/sitetrack.js`, which initialises it with
`disable_external_dependency_loading` so PostHog loads no script from its own CDN.
The maintained Dashboard imports Vue from npm through Vite.

Generated JavaScript and licenses are ignored by Git and included in Python distributions by
`hatch_build.py`. Run `bash scripts/build-dashboard.sh`; local `npm run dev` also prepares them.
Do not download or commit library builds here.

Standalone pages retain their versioned, same-origin URLs: a blocked CDN previously caused blank
signed-in dashboards ([#137](https://github.com/superdesigndev/treg/issues/137)). The copy step checks
that page URLs match the installed Vue and posthog-js versions, so a dependency upgrade cannot silently leave
missing runtime URLs.
