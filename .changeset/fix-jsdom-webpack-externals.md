---
'gen-referentiel-core': patch
---

Corrige l'erreur de build avec isomorphic-dompurify en ajoutant jsdom aux externals webpack côté serveur. jsdom lisait `default-stylesheet.css` via `__dirname` qui pointait vers `.next/server/` quand bundlé par webpack au lieu du répertoire du package.
