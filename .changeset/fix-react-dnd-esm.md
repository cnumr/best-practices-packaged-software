---
"gen-referentiel-core": patch
---

fix(deps): force react-dnd v14 pour compatibilité CommonJS sur Vercel

Corrige l'erreur ERR_REQUIRE_ESM causée par @udecode/plate-dnd qui utilise require() pour importer react-dnd v16 (ESM-only).
