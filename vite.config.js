import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build`        → normal static site in /dist (deploy to Vercel / Netlify / GitHub Pages)
// `npm run build:single` → one self-contained HTML file in /dist-single (fonts + code inlined)
// (`--mode artifact` is the same single file, minus features a sandboxed preview can't use)
export default defineConfig(({ mode }) => {
  const single = mode === 'single' || mode === 'artifact'
  return {
    // Relative base so the site works from any sub-folder (e.g. GitHub Pages)
    base: './',
    plugins: [react(), tailwindcss(), ...(single ? [viteSingleFile()] : [])],
    build: single ? { outDir: `dist-${mode}`, copyPublicDir: false } : {},
  }
})
