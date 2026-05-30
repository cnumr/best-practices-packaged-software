---
'gen-referentiel-core': minor
---

Améliore la recherche Pagefind et la gestion des langues manquantes

- Highlight des termes recherchés dans le titre et le refid des résultats de recherche
- Boost du refid dans le ranking Pagefind via `data-pagefind-weight` pour remonter les fiches correspondantes lors d'une recherche par numéro
- Le build ne plante plus si le contenu home ou mentions-légales est absent pour une langue (retourne une 404 propre)
- Ajout d'une page not-found traduite (fr/en/es) avec lien de retour vers la langue par défaut
- Tentative de correction de la vulnérabilité `@apidevtools/json-schema-ref-parser` (GHSA-5f97-h2c2-826q) annulée : l'override global est incompatible avec `swagger-jsdoc` qui requiert l'ancienne API v9.x (voir issue #50 pour suivi dans la migration TinaCMS/Next.js)
- Migration de `pnpm.overrides` de `package.json` vers `pnpm-workspace.yaml` (compatibilité pnpm v10)
