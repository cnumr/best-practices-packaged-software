---
'gen-referentiel-core': patch
---

fix: corrige l'affichage des cards, le rendu HTML dans MDX et le chargement du .env dans build-local

- **Card (#53)** : supprime la fonction `cleanImpact` (regexp cassée sur des clés de traduction) et conditionne l'affichage de `priority_implementation` / `environmental_impact` aux feature flags du référentiel actif ; corrige le séparateur `: ` pour MESURE_ON_5
- **MDX HTML (#54)** : ajoute les handlers `html` et `html_inline` dans `getMdxComponents` pour rendre le HTML brut inséré dans les fiches ; sanitisation via `isomorphic-dompurify` avec liste blanche de balises courantes
- **build-local (#55)** : charge les variables du fichier `.env` (pattern `set -a / source / set +a`) avant le build, afin que `NEXT_PUBLIC_REF_NAME` et les autres variables soient correctement transmises
