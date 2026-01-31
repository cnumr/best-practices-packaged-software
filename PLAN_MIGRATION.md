# Plan de Migration et Mise à Jour

**Date de création :** 24 janvier 2026  
**Objectif :** Corriger les problèmes de sécurité, optimiser les performances et améliorer la qualité du code

---

## 📋 Vue d'ensemble

Ce plan couvre :

1. **Sécurité** : Mise à jour Next.js pour corriger les failles critiques
2. **Performance** : Remplacement du système de recherche (suppression du préchargement)
3. **Qualité** : Amélioration TypeScript et gestion d'erreurs
4. **Maintenance** : Nettoyage du code et documentation

**Durée estimée :** 2-3 semaines (selon les tests)

---

## 🎯 Phase 1 : Sécurité - Mise à jour Next.js (PRIORITAIRE)

### Objectif

Corriger les failles de sécurité critiques (CVE-2025-29927, CVE-2025-55184, CVE-2025-55183)

### Versions cibles

- **Next.js** : `14.2.14` → `14.2.35`
- **eslint-config-next** : `^14.2.7` → `^14.2.35`
- **React** : `18.3.1` (déjà à jour)
- **TinaCMS** : `2.5.2` → `^2.10.1`
- **@tinacms/cli** : `1.7.0` → `^1.12.6`
- **@tinacms/datalayer** : `1.3.9` → `^1.4.3`
- **tinacms-authjs** : `8.0.2` → `^5.0.9` (downgrade - nouvelle API)
- **tinacms-gitprovider-github** : `2.0.9` → `^2.0.19`
- **next-auth** : `4.24.11` → `^4.24.13`
- **mongodb** : `^4.12.1` → `^7.0.0` (saut majeur)
- **typescript** : `5.7.2` → `^5.9.3`

### Étapes

#### 1.1 Préparation

```bash
# Créer une branche de migration
git checkout -b migration/security-update

# Sauvegarder l'état actuel
git commit -am "chore: état avant migration sécurité"
```

#### 1.2 Mise à jour des dépendances

```bash
# Mettre à jour Next.js et eslint-config-next
pnpm add next@14.2.35 eslint-config-next@14.2.35

# Mettre à jour TinaCMS et ses dépendances
pnpm add tinacms@^2.10.1 @tinacms/cli@^1.12.6 @tinacms/datalayer@^1.4.3
pnpm add tinacms-authjs@^5.0.9 tinacms-gitprovider-github@^2.0.19

# Mettre à jour next-auth et mongodb
pnpm add next-auth@^4.24.13
pnpm add -D mongodb@^7.0.0

# Mettre à jour TypeScript
pnpm add typescript@^5.9.3

# Vérifier les dépendances
pnpm install
```

**Note importante :** `tinacms-authjs` passe de 8.0.2 à 5.0.9 (nouvelle API, versioning différent). Vérifier la compatibilité avec le code existant dans `pages/api/tina/[...routes].ts`.

#### 1.3 Vérification de compatibilité

```bash
# Vérifier les breaking changes
pnpm build

# Tester en développement
pnpm dev
```

#### 1.4 Tests fonctionnels

- [ ] Build de production fonctionne
- [ ] Pages principales s'affichent correctement
- [ ] TinaCMS fonctionne (édition de contenu)
- [ ] Navigation entre pages
- [ ] Génération statique des pages
- [ ] Authentification TinaCMS fonctionne (tinacms-authjs)
- [ ] Connexion MongoDB fonctionne (pnpm dev:prod)

#### 1.5 Validation

```bash
# Lancer les tests de lint
pnpm lint

# Vérifier les types TypeScript
pnpm tsc --noEmit
```

**Point d'attention :** Si des erreurs apparaissent, les documenter avant de passer à la phase 2.

---

## 🚀 Phase 2 : Performance - Suppression de `next-plugin-preval` et migration Pagefind

### Objectif

Éliminer le préchargement de toutes les données (problème critique de performance) et simplifier le build local.

### Problème actuel

- `next-plugin-preval` précharge toutes les fiches/lexique/personas
- ~2-5 MB de données incluses dans chaque page
- Violation des bonnes pratiques d'écoconception
- **Script `build-local.sh` complexe (46 lignes)** nécessaire car preval requiert un serveur TinaCMS actif

### Solution : Suppression de `next-plugin-preval` + Migration vers Pagefind

### Étape 2.0 : Suppression de `next-plugin-preval`

#### 2.0.1 Modifier `next.config.js`

```javascript
// AVANT
const createNextPluginPreval = require('next-plugin-preval/config');
const withNextPluginPreval = createNextPluginPreval();
module.exports = withNextPluginPreval({
  // ...
});

// APRÈS
module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  async rewrites() {
    return [
      { source: '/', destination: '/home' },
      { source: '/admin', destination: '/admin/index.html' },
    ];
  },
};
```

#### 2.0.2 Modifier `generateStaticParams()` dans les pages

**Fichier `app/[lang]/fiches/[slug]/page.tsx`** :

```typescript
// AVANT
import fichesData from '../fiches.preval';

export async function generateStaticParams() {
  const { data }: { data: FichesConnectionQuery } = fichesData;
  return data.fichesConnection.edges?.map((e) => ({
    lang: e?.node?.language,
    slug: e?.node?._sys.filename,
  }));
}

// APRÈS
import { client } from '../../../../tina/__generated__/databaseClient';

export async function generateStaticParams() {
  const { data } = await client.queries.fichesConnection({ first: 1000 });
  return data.fichesConnection.edges?.map((e) => ({
    lang: e?.node?.language,
    slug: e?.node?._sys.filename,
  })) || [];
}
```

#### 2.0.3 Supprimer les fichiers `.preval.ts`

```bash
rm app/[lang]/fiches/fiches.preval.ts
rm app/[lang]/lexique/lexique.preval.ts
rm app/[lang]/personas/personas.preval.ts
```

#### 2.0.4 Supprimer le script de build local

```bash
rm scripts/build-local.sh
```

#### 2.0.5 Simplifier `package.json`

```json
{
  "scripts": {
    "build": "tinacms build --partial-reindex && next build",
    "build-local": "TINA_PUBLIC_IS_LOCAL=true TINA_PUBLIC_REF_NAME=RWP NEXT_PUBLIC_REF_NAME=RWP tinacms build --local --skip-indexing && next build"
  }
}
```

#### 2.0.6 Supprimer la dépendance

```bash
pnpm remove next-plugin-preval
```

#### 2.0.7 Tests de validation

- [ ] `pnpm build-local` fonctionne sans script bash
- [ ] `pnpm dev` fonctionne normalement
- [ ] Les pages de fiches se génèrent correctement
- [ ] `generateStaticParams()` retourne tous les slugs

### Versions à ajouter

- **pagefind** : `^1.x.x` (devDependency)

### Versions à supprimer

- **fuse.js** : `7.0.0` (remplacé par Pagefind)
- **itemsjs** : `2.1.25` (remplacé par filtres JS vanilla)
- **next-plugin-preval** : `1.2.6` (supprimé complètement - cause du build local complexe)

### Étapes

#### 2.1 Installation de Pagefind

```bash
# Installer Pagefind
pnpm add -D pagefind

# Créer une branche
git checkout -b migration/pagefind-search
```

#### 2.2 Configuration du build

Modifier `package.json` :

```json
{
  "scripts": {
    "build": "TINA_PUBLIC_IS_LOCAL=false TINA_PUBLIC_REF_NAME=RWP NEXT_PUBLIC_REF_NAME=RWP tinacms build --partial-reindex && next build && pagefind --site .next/static --output-path public/pagefind",
    "postbuild": "pagefind --site .next/static --output-path public/pagefind"
  }
}
```

#### 2.3 Ajout des métadonnées dans le HTML

**2.3.1 Modifier `app/[lang]/fiches/[slug]/page.tsx`**

```typescript
// Ajouter generateMetadata pour les métadonnées Pagefind
export async function generateMetadata({ params }) {
  const res = await client.queries.fiches({
    relativePath: `${params.lang}/${params.slug}.mdx`,
  });

  const responsibles =
    res.data.fiches.responsible
      ?.map((r) => r.responsible?.title)
      .filter(Boolean)
      .join(',') || '';

  return {
    title: res.data.fiches.title,
    other: {
      'pagefind-type': 'fiche',
      'pagefind-responsibles': responsibles,
      'pagefind-refid': res.data.fiches.refID,
    },
  };
}
```

**2.3.2 Modifier `components/pages/fiches-page.tsx`**

```typescript
// Ajouter les attributs data-* dans l'article
<article
  className="lg:grid lg:grid-cols-[1fr_5fr] lg:gap-4"
  data-pagefind-type="fiche"
  data-pagefind-responsibles={data.fiches.responsible?.map(r => r.responsible?.title).join(',')}
>
```

**2.3.3 Modifier `components/pages/lexique-page.tsx`**

```typescript
// Ajouter les métadonnées pour le lexique
<article data-pagefind-type="lexique">
```

**2.3.4 Modifier `components/pages/personas-page.tsx`**

```typescript
// Ajouter les métadonnées pour les personas
<article data-pagefind-type="persona">
```

#### 2.4 Créer le nouveau composant de recherche

**Créer `components/search/pagefind-search.tsx`**

```typescript
'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ui } from '../../i18n/ui';

interface PagefindSearchProps {
  lang?: keyof typeof ui;
}

export function PagefindSearch({ lang = 'fr' }: PagefindSearchProps) {
  const [pagefind, setPagefind] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterResponsibles, setFilterResponsibles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Charger Pagefind dynamiquement
    const loadPagefind = async () => {
      try {
        const pagefindModule = await import('pagefind');
        const pf = await pagefindModule.init();
        setPagefind(pf);
      } catch (error) {
        console.error('Erreur lors du chargement de Pagefind:', error);
      }
    };
    loadPagefind();
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!pagefind || !searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const search = await pagefind.search(searchQuery);
      const allResults = await Promise.all(
        search.results.map(async (r: any) => await r.data())
      );

      // Filtrer côté client avec les métadonnées
      let filtered = allResults;

      if (filterType.length > 0) {
        filtered = filtered.filter((r: any) => {
          const type = r.meta?.type ||
            (r.url?.includes('/fiches/') ? 'fiche' :
             r.url?.includes('/lexique/') ? 'lexique' : 'persona');
          return filterType.includes(type);
        });
      }

      if (filterResponsibles.length > 0) {
        filtered = filtered.filter((r: any) => {
          const responsibles = r.meta?.responsibles?.split(',') || [];
          return filterResponsibles.some(fr =>
            responsibles.some((resp: string) => resp.trim() === fr)
          );
        });
      }

      setResults(filtered);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Extraire les options de filtres depuis les résultats
  const filterOptions = useMemo(() => {
    const types = new Set<string>();
    const responsibles = new Set<string>();

    results.forEach((r: any) => {
      const type = r.meta?.type ||
        (r.url?.includes('/fiches/') ? 'fiche' :
         r.url?.includes('/lexique/') ? 'lexique' : 'persona');
      types.add(type);

      if (r.meta?.responsibles) {
        r.meta.responsibles.split(',').forEach((resp: string) => {
          if (resp.trim()) responsibles.add(resp.trim());
        });
      }
    });

    return {
      types: Array.from(types),
      responsibles: Array.from(responsibles)
    };
  }, [results]);

  return (
    <div className="mx-auto px-4 pt-4 lg:max-w-5xl lg:px-0">
      <input
        className="w-full"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Rechercher..."
        disabled={!pagefind}
      />

      {loading && <div>Recherche en cours...</div>}

      {query && results.length > 0 && (
        <div className="absolute z-50 max-h-[70vh] w-full overflow-auto bg-white p-4 shadow lg:max-w-5xl lg:p-8">
          <div className="text-s pb-4 font-bold">
            {results.length} résultats pour {query}
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Filtres */}
            <div className="w-full flex-shrink-0 border-b border-black pb-4 lg:w-[200px] lg:border-b-0 lg:pb-0">
              {/* Filtre Type */}
              <h3 className="m-0 text-sm font-bold">Type</h3>
              {filterOptions.types.map(type => (
                <label key={type} className="text-sm block">
                  <input
                    type="checkbox"
                    value={type}
                    checked={filterType.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterType([...filterType, type]);
                      } else {
                        setFilterType(filterType.filter(t => t !== type));
                      }
                    }}
                    className="mr-2"
                  />
                  {type}
                </label>
              ))}

              {/* Filtre Responsables */}
              {filterOptions.responsibles.length > 0 && (
                <>
                  <h3 className="m-0 text-sm font-bold mt-4">Responsables</h3>
                  {filterOptions.responsibles.map(resp => (
                    <label key={resp} className="text-sm block">
                      <input
                        type="checkbox"
                        value={resp}
                        checked={filterResponsibles.includes(resp)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterResponsibles([...filterResponsibles, resp]);
                          } else {
                            setFilterResponsibles(filterResponsibles.filter(r => r !== resp));
                          }
                        }}
                        className="mr-2"
                      />
                      {resp}
                    </label>
                  ))}
                </>
              )}
            </div>

            {/* Résultats */}
            <ul>
              {results.map((result: any, idx: number) => (
                <li key={idx} className="mb-4">
                  <Link href={result.url} onClick={() => setQuery('')}>
                    {result.meta?.refid && `${result.meta.refid} `}
                    {result.meta?.title || result.title}
                  </Link>
                  <p className="line-clamp-5 text-sm">{result.excerpt}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### 2.5 Remplacer GlobalSearch

**Modifier `components/search/global-search.tsx`**

```typescript
import { FunctionComponent } from 'react';
import { ui } from '../../i18n/ui';
import { PagefindSearch } from './pagefind-search';

interface GlobalSearchProps {
  lang?: keyof typeof ui;
}

const GlobalSearch: FunctionComponent<GlobalSearchProps> = ({ lang = 'fr' }) => {
  return <PagefindSearch lang={lang} />;
};

export default GlobalSearch;
```

#### 2.6 Supprimer les fichiers preval inutiles

**Option 1 : Supprimer complètement** (si `generateStaticParams` peut fonctionner autrement)

- `app/[lang]/fiches/fiches.preval.ts`
- `app/[lang]/lexique/lexique.preval.ts`
- `app/[lang]/personas/personas.preval.ts`

**Option 2 : Garder uniquement pour `generateStaticParams`** (recommandé)

- Modifier les fichiers preval pour ne charger que les métadonnées minimales (slug, lang)
- Ne pas charger le contenu complet

**Modifier `app/[lang]/fiches/fiches.preval.ts`**

```typescript
import preval from 'next-plugin-preval';
import { client } from '../../../tina/__generated__/databaseClient';

async function getData() {
  // Charger uniquement les métadonnées nécessaires pour generateStaticParams
  return await client.queries.fichesConnection({
    first: 1000,
    // Ne pas charger le body, seulement les infos de base
  });
}

export default preval(getData());
```

#### 2.7 Supprimer les dépendances inutiles

```bash
# Supprimer fuse.js et itemsjs
pnpm remove fuse.js itemsjs

# Vérifier que tout fonctionne
pnpm build
```

#### 2.8 Tests

- [ ] La recherche fonctionne avec Pagefind
- [ ] Les filtres Type et Responsables fonctionnent
- [ ] Le build génère l'index Pagefind
- [ ] Le poids des pages a diminué (vérifier avec DevTools)
- [ ] Aucune régression fonctionnelle

#### 2.9 Vérification de performance

```bash
# Mesurer le poids des pages avant/après
# Avant : ~2-5 MB par page
# Après : ~100-300 KB par page (index Pagefind séparé)
```

---

## 🔧 Phase 3 : Qualité du code - TypeScript et gestion d'erreurs

### Objectif

Améliorer la sécurité des types et la gestion d'erreurs

### Étapes

#### 3.1 Validation des variables d'environnement

**Créer `utils/env-validation.ts`**

```typescript
import { z } from 'zod';

const envSchema = z.object({
  TINA_PUBLIC_IS_LOCAL: z.string().default('true'),
  TINA_PUBLIC_REF_NAME: z.string().optional(),
  NEXT_PUBLIC_REF_NAME: z.string().default('RWEB'),
  GITHUB_PERSONAL_ACCESS_TOKEN: z.string().optional(),
  GITHUB_OWNER: z.string().optional(),
  GITHUB_REPO: z.string().optional(),
  GITHUB_BRANCH: z.string().optional(),
  MONGODB_URI: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
});

export const env = envSchema.parse({
  TINA_PUBLIC_IS_LOCAL: process.env.TINA_PUBLIC_IS_LOCAL,
  TINA_PUBLIC_REF_NAME: process.env.TINA_PUBLIC_REF_NAME,
  NEXT_PUBLIC_REF_NAME: process.env.NEXT_PUBLIC_REF_NAME,
  GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  GITHUB_OWNER: process.env.GITHUB_OWNER,
  GITHUB_REPO: process.env.GITHUB_REPO,
  GITHUB_BRANCH: process.env.GITHUB_BRANCH,
  MONGODB_URI: process.env.MONGODB_URI,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
});
```

**Installer zod**

```bash
pnpm add zod
```

**Modifier `tina/database.ts`**

```typescript
import { env } from '../utils/env-validation';

// Utiliser env au lieu de process.env directement
const token = env.GITHUB_PERSONAL_ACCESS_TOKEN;
const owner = env.GITHUB_OWNER || process.env.VERCEL_GIT_REPO_OWNER;
// etc.
```

#### 3.2 Amélioration des types

**Modifier `app/[lang]/fiches/[slug]/page.tsx`**

```typescript
// Ajouter le typage des params
export default async function Page({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  // ...
}
```

**Modifier `pages/api/tina/[...routes].ts`**

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  return handler(req, res);
};
```

#### 3.3 Suppression des @ts-ignore

Pour chaque fichier avec `@ts-ignore` :

1. Identifier le problème de type
2. Corriger le type ou ajouter une assertion appropriée
3. Supprimer le `@ts-ignore`

**Fichiers prioritaires :**

- `components/mdx/mdx-components.tsx` (lignes 83, 190)
- `components/pages/fiches-page.tsx` (ligne 64)
- `referentiel-config.ts` (ligne 218)

#### 3.4 Gestion d'erreurs

**Créer `components/ErrorBoundary.tsx`**

```typescript
'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h1>Une erreur s'est produite</h1>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Ajouter dans `app/[lang]/layout.tsx`**

```typescript
import { ErrorBoundary } from '../../components/ErrorBoundary';

export default function RootLayout({ children, params }) {
  return (
    <html lang={params.lang}>
      <body>
        <ErrorBoundary>
          <Header lang={params.lang} />
          <GlobalSearch lang={params.lang} />
          {children}
          <Footer lang={params.lang} />
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

#### 3.5 Suppression des console.log

**Créer un script de nettoyage**

```bash
# Trouver tous les console.log
grep -r "console\." --include="*.ts" --include="*.tsx" .
```

**Remplacer par un logger structuré** (optionnel)

```typescript
// utils/logger.ts
export const logger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    console.error(...args);
    // Ici, on pourrait envoyer à un service de logging
  },
};
```

---

## 🧹 Phase 4 : Nettoyage et optimisation

### Objectif

Nettoyer le code et optimiser les performances

### Étapes

#### 4.1 Suppression des sérialisations inutiles

**Modifier `app/[lang]/fiches/[slug]/page.tsx`**

```typescript
// AVANT
<FichesPage
  data={JSON.parse(JSON.stringify(res.data))}
  // ...
/>

// APRÈS
<FichesPage
  data={res.data}
  // ...
/>
```

**Modifier `components/mdx/mdx-components.tsx`**

```typescript
// Supprimer la sérialisation ligne 44
lexiqueData[key] = edge.node; // Au lieu de JSON.parse(JSON.stringify(...))
```

#### 4.2 Optimisation du chargement du lexique

**Modifier `app/[lang]/fiches/[slug]/page.tsx`**

```typescript
// Charger uniquement si nécessaire et limiter
if (getRefConfig().featuresEnabled.lexique_tooltips) {
  lexiqueRes = await client.queries.lexiqueConnection({
    filter: { language: { eq: lang } },
    first: 500, // Réduire de 1000 à 500
  });
}
```

#### 4.3 Correction du typo dans le nom du dossier

```bash
# Renommer .local_mogodb en .local_mongodb
mv .local_mogodb .local_mongodb

# Mettre à jour les références
# - package.json (scripts docker:up et docker:down)
# - .gitignore si nécessaire
# - Documentation
```

#### 4.4 Mise à jour de la documentation

- [ ] Compléter les README manquants
- [ ] Mettre à jour `docs/developpement.md` avec les nouvelles versions
- [ ] Documenter le nouveau système de recherche Pagefind
- [ ] Ajouter des exemples d'utilisation

---

## ✅ Checklist de validation finale

### Sécurité et dépendances

- [ ] Next.js mis à jour vers 14.2.35
- [ ] TinaCMS mis à jour vers 2.10.1
- [ ] @tinacms/cli mis à jour vers 1.12.6
- [ ] tinacms-authjs mis à jour vers 5.0.9 (vérifier API)
- [ ] MongoDB mis à jour vers 7.0.0
- [ ] Variables d'environnement validées
- [ ] Gestion d'erreurs implémentée
- [ ] Error Boundary ajouté

### Performance

- [ ] `next-plugin-preval` supprimé
- [ ] Fichiers `.preval.ts` supprimés
- [ ] `scripts/build-local.sh` supprimé
- [ ] Build local simplifié (`pnpm build-local` fonctionne)
- [ ] Pagefind installé et configuré
- [ ] Préchargement supprimé
- [ ] Poids des pages réduit (vérifier avec DevTools)
- [ ] Index Pagefind généré correctement

### Qualité

- [ ] Types TypeScript améliorés
- [ ] @ts-ignore supprimés (ou documentés)
- [ ] console.log supprimés
- [ ] Code dupliqué factorisé

### Tests

- [ ] Build de production fonctionne
- [ ] Recherche fonctionne avec Pagefind
- [ ] Filtres fonctionnent
- [ ] TinaCMS fonctionne
- [ ] Navigation fonctionne
- [ ] Pas de régressions

### Documentation

- [ ] README mis à jour
- [ ] Changelog créé
- [ ] Guide de migration documenté

---

## 🚨 Points d'attention

### Risques identifiés

1. **Breaking changes Next.js 14.2.35**

   - Probabilité : Faible
   - Impact : Moyen
   - Mitigation : Tests approfondis avant déploiement

2. **Pagefind en développement**

   - Probabilité : Moyenne
   - Impact : Faible
   - Mitigation : Fallback ou désactivation en dev

3. **TinaCMS après migration (2.5.2 → 2.10.1)**
   - Probabilité : Moyenne
   - Impact : Élevé
   - Mitigation : Tests complets de l'édition de contenu

4. **tinacms-authjs downgrade (8.0.2 → 5.0.9)**
   - Probabilité : Moyenne
   - Impact : Moyen
   - Mitigation : Vérifier `pages/api/tina/[...routes].ts`, comparer avec projet de référence

5. **MongoDB saut majeur (v4 → v7)**
   - Probabilité : Faible
   - Impact : Moyen
   - Mitigation : Tester la connexion MongoDB en dev:prod

### Rollback

En cas de problème majeur :

```bash
# Revenir à la version précédente
git checkout main
git revert <commit-hash>
```

---

## 📅 Planning suggéré

| Phase                 | Durée          | Priorité    |
| --------------------- | -------------- | ----------- |
| Phase 1 : Sécurité    | 1-2 jours      | 🔴 Critique |
| Phase 2 : Performance | 3-5 jours      | 🟠 Haute    |
| Phase 3 : Qualité     | 2-3 jours      | 🟡 Moyenne  |
| Phase 4 : Nettoyage   | 1-2 jours      | 🟢 Faible   |
| **Total**             | **7-12 jours** |             |

---

## 📝 Notes de migration

### Commandes utiles

```bash
# Vérifier les vulnérabilités
pnpm audit

# Vérifier les dépendances obsolètes
pnpm outdated

# Nettoyer le cache
pnpm clean
rm -rf .next
rm -rf node_modules/.cache

# Rebuild complet
pnpm install
pnpm build
```

### Ressources

- [Next.js 14.2.35 Release Notes](https://nextjs.org/blog/next-14-2)
- [Pagefind Documentation](https://pagefind.app/docs)
- [TinaCMS Upgrade Guide](https://tina.io/docs/guides/upgrade-to-latest-version)

---

**Dernière mise à jour :** 24 janvier 2026
