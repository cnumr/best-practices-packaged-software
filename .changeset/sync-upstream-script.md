---
"gen-referentiel-core": minor
---

Ajoute script et commande `pnpm sync-upstream` pour automatiser la synchronisation avec upstream

- Détecte automatiquement la première sync vs les suivantes
- Protège le contenu local (`src/content/`, `public/img_fiches/`)
- Régénère `tina-lock.json` après merge
- Commit et push automatiques
