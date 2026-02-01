# gen-referentiel-core

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
