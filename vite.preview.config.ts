/* Build d'aperçu autonome (un seul fichier HTML). N'affecte pas le build de production. */
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

const PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B9C9D5"/><stop offset="1" stop-color="#8FA6B8"/></linearGradient></defs><rect width="1200" height="1200" fill="url(#g)"/><g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="10"><rect x="530" y="555" width="140" height="100" rx="14"/><circle cx="600" cy="605" r="28"/></g></svg>');
const LOGO = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="46" fill="#E8B04B"/><text x="50" y="62" font-family="Georgia,serif" font-size="34" text-anchor="middle" fill="#06193A">GC</text></svg>');
const EMPTY = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"/>');

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    {
      name: 'agc-preview-html',
      transformIndexHtml(html) {
        html = html.replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/, '');
        html = html.replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/, '');
        html = html.replace(/<meta name="viewport"[^>]*>/, '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />');
        const head = `
<style>
  :root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
  html{scroll-padding-top:env(safe-area-inset-top,0px)} body{background:#F4F5F2}
  header.fixed{padding-top:env(safe-area-inset-top,0px)}
</style>
<script>
  (function(){
    var P=${JSON.stringify(PLACEHOLDER)}, L=${JSON.stringify(LOGO)}, E=${JSON.stringify(EMPTY)};
    window.addEventListener('error',function(e){
      var t=e.target; if(!t||t.tagName!=='IMG'||t.dataset.ph) return;
      t.dataset.ph='1'; var s=t.getAttribute('src')||'';
      t.src = /logo/i.test(s) ? L : /signature/i.test(s) ? E : P;
    },true);
  })();
</script>`;
        return html.replace('</head>', head + '\n</head>');
      },
    },
  ],
  define: {
    'import.meta.env.VITE_HASH_ROUTER': JSON.stringify('1'),
    'import.meta.env.VITE_PREVIEW': JSON.stringify('1'),
  },
  resolve: {
    alias: [
      { find: /^firebase\/firestore$/, replacement: path.resolve(__dirname, 'preview/firestore-mock.ts') },
      { find: /^(\.{1,2}\/)+firebase$/, replacement: path.resolve(__dirname, 'preview/db-mock.ts') },
      { find: /^@vercel\/analytics\/react$/, replacement: path.resolve(__dirname, 'preview/vercel-stub.tsx') },
      { find: /^\.\/pages\/admin\/Admin(Login|Dashboard)$/, replacement: path.resolve(__dirname, 'preview/AdminStub.tsx') },
    ],
  },
  build: { outDir: '/home/claude/preview-dist', emptyOutDir: true, assetsInlineLimit: 100000000, chunkSizeWarningLimit: 5000 },
});
