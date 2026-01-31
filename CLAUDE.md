# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Méthodologie APEX

Appliquer systématiquement la méthode **APEX** pour chaque tâche :

| Phase | Action |
|-------|--------|
| **A**nalyze | Lire/explorer le code concerné, comprendre le contexte et les contraintes |
| **P**lan | Présenter le plan d'action et attendre validation avant d'implémenter |
| **E**xecute | Implémenter la solution uniquement après accord |
| e**X**amine | Tester/valider le résultat, vérifier qu'il n'y a pas de régression |

**Règles :**
- Ne jamais coder sans avoir d'abord analysé et planifié
- Toujours attendre la validation du plan avant d'exécuter
- Toujours vérifier le résultat après implémentation

## Project Overview

This is the **WordPress Eco-design Best Practices Reference** (RWP - Référentiel WordPress) maintained by the Collectif Green IT (CNUMR). It's a Next.js web application that uses TinaCMS as a headless CMS to manage eco-design best practices content in MDX format.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **CMS**: TinaCMS (self-hosted with GitHub as content backend)
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas (for TinaCMS indexing)
- **Hosting**: Vercel
- **Package Manager**: pnpm

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server (local mode - no MongoDB needed)
pnpm dev

# Run development server in production mode (requires MongoDB)
pnpm dev:prod

# Production build (requires MongoDB)
pnpm build

# Lint
pnpm lint           # Run both Next.js and MDX linting
pnpm lint:next      # Next.js linting only
pnpm lint:md        # MDX linting only

# Format code
pnpm prettier

# Clean build artifacts
pnpm clean
```

## Architecture

### Content Structure (`src/content/`)

- **fiches/**: Best practice sheets organized by language (fr/, en/, es/)
  - Files follow naming: `RWP_<category>.<number>-<slug>.mdx`
  - Categories: 1 (Installation), 2 (Fonctionnalités), 3 (Design), 4 (Code), 5 (Médias), 6 (Mesure), 7 (Serveur), 8 (Maintenance)
- **lexique/**: Glossary entries by language
- **personas/**: User personas by language
- **home/**: Homepage content by language
- **mentionsLegales/**: Legal notices by language

### App Structure (`app/`)

Uses Next.js App Router with dynamic `[lang]` segment for i18n:
- `app/[lang]/page.tsx` - Homepage
- `app/[lang]/fiches/` - Best practices listing and detail pages
- `app/[lang]/lexique/` - Glossary
- `app/[lang]/personas/` - Personas

### TinaCMS Configuration (`tina/`)

- `config.tsx` - Main TinaCMS configuration
- `collections/` - Content type definitions (fiches, lexique, personas, home, mentionsLegales)
- `utils/` - Shared field definitions and templates

### Multi-Referential Configuration

The codebase supports multiple referentials via `referentiel-config.ts`:
- **RWP** (WordPress) - Current repository focus
- **RWEB** (Web eco-design)
- **REIPRO** (Software integration)
- **RIA** (AI usage)
- **REF_HOME** (Home portal)

The active referential is set via `NEXT_PUBLIC_REF_NAME` environment variable.

## Key Configuration Files

- `referentiel-config.ts` - Feature flags and i18n configuration per referential
- `i18n/ui.ts` - UI translations
- `src/content/constants/index.ts` - Field options for lifecycle, scope, saved_resources, etc.

## Content Editing

Content can be edited:
1. **Locally**: Direct MDX file editing in `src/content/`
2. **Via TinaCMS Admin**: Access at `/admin` when running dev server

## Commit Message Convention (Conventional Commits - French)

Format: `<type>(<scope>): <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`

Rules:
- Write in French
- Use imperative present tense (ajoute, corrige, améliore)
- Max 200 characters
- No final period

Examples:
- `feat: ajoute authentification OAuth2`
- `fix(auth): corrige la validation du token JWT`
- `docs: met à jour la documentation API`

## Important Notes

- **Local build** : `pnpm build-local` fonctionne (lance TinaCMS en arrière-plan pendant le build Next.js)
- **Production build** : `pnpm build` nécessite MongoDB et les variables d'environnement GitHub
- When running locally with `pnpm dev`, MongoDB is not required (`TINA_PUBLIC_IS_LOCAL=true`)
- Content changes trigger automatic Vercel deployments when pushed to GitHub
