# gen-referentiel-core

## 0.2.2

### Patch Changes

- 4233a4c: docs: mise à jour complète de la documentation

  - Ajoute guide de synchronisation upstream complet
  - Corrige retype.yml (URL et repo)
  - Met à jour les versions des dépendances (TinaCMS 2.10.1, Next.js 14.2.35)
  - Ajoute section Changesets dans developpement.md
  - Complète installation.md avec NEXT_PUBLIC_REF_NAME
  - Met à jour configuration.md avec tous les référentiels (REIPRO, RIA)

## 0.2.1

### Patch Changes

- fix(lint): charge automatiquement les variables d'environnement dans le linting MDX

  Ajoute l'import de `dotenv/config` dans `.remarkrc.mjs` pour que `pnpm lint:md`
  utilise automatiquement les variables du fichier `.env` (notamment `NEXT_PUBLIC_REF_NAME`
  pour sélectionner le bon schéma de validation).

## 0.2.0

### Minor Changes

- ### Validation MDX dynamique par référentiel

  - Les schémas de validation du frontmatter (`pnpm lint:md`) sont maintenant sélectionnés dynamiquement selon `NEXT_PUBLIC_REF_NAME`
  - `fiche.schema.yaml` : schéma par défaut (RWEB, REIPRO, RIA) avec types number
  - `fiche.schema.rwp.yaml` : schéma RWP avec types string et scope requis

  ### SEO amélioré

  - Ajout des meta OpenGraph et Twitter sur toutes les pages
  - Configuration de metadataBase pour les URLs des images sociales

  ### Outillage

  - Configuration de Changesets pour le suivi des versions entre instances
