# Résumé Exécutif - Plan de Migration

## 🎯 Objectifs principaux

1. **Sécurité** : Corriger 3 failles critiques (CVE-2025-29927, CVE-2025-55184, CVE-2025-55183)
2. **Performance** : Réduire le poids des pages de ~2-5 MB à ~100-300 KB
3. **Qualité** : Améliorer TypeScript et gestion d'erreurs

## 📊 Impact attendu

| Métrique              | Avant       | Après      | Gain       |
| --------------------- | ----------- | ---------- | ---------- |
| Poids page initial    | 2-5 MB      | 100-300 KB | **95-99%** |
| Dépendances recherche | 3 libs      | 1 lib      | **-66%**   |
| Failles sécurité      | 3 critiques | 0          | **100%**   |
| @ts-ignore            | 30+         | <5         | **-83%**   |
| Script build local    | 46 lignes   | 1 ligne    | **-98%**   |

## 🚀 Actions prioritaires

### Phase 1 : Sécurité + Mise à jour dépendances (1-2 jours) - 🔴 CRITIQUE

```bash
# Next.js + ESLint
pnpm add next@14.2.35 eslint-config-next@14.2.35

# TinaCMS (alignement avec projet de référence)
pnpm add tinacms@^2.10.1 @tinacms/cli@^1.12.6 @tinacms/datalayer@^1.4.3
pnpm add tinacms-authjs@^5.0.9 tinacms-gitprovider-github@^2.0.19

# Autres dépendances
pnpm add next-auth@^4.24.13 typescript@^5.9.3
pnpm add -D mongodb@^7.0.0
```

**Pourquoi maintenant ?** 3 failles critiques actives + alignement versions

### Phase 2 : Performance (3-5 jours) - 🟠 HAUTE

- Supprimer `next-plugin-preval` (cause racine du préchargement)
- Supprimer `scripts/build-local.sh` (plus nécessaire)
- Simplifier les scripts de build
- Installer Pagefind
- Remplacer le système de recherche

**Impact :** Résout le problème de préchargement + simplifie le build local

### Phase 3 : Qualité (2-3 jours) - 🟡 MOYENNE

- Améliorer TypeScript
- Ajouter gestion d'erreurs
- Nettoyer le code

### Phase 4 : Nettoyage (1-2 jours) - 🟢 FAIBLE

- Optimisations diverses
- Documentation

## ⚠️ Risques et mitigations

| Risque                       | Probabilité | Impact | Mitigation                          |
| ---------------------------- | ----------- | ------ | ----------------------------------- |
| Breaking changes Next.js     | Faible      | Moyen  | Tests approfondis                   |
| Pagefind en dev              | Moyenne     | Faible | Fallback ou désactivation           |
| TinaCMS 2.5.2 → 2.10.1       | Moyenne     | Élevé  | Tests complets édition contenu      |
| tinacms-authjs 8.0.2 → 5.0.9 | Moyenne     | Moyen  | Comparer avec projet de référence   |
| MongoDB v4 → v7              | Faible      | Moyen  | Tester connexion en dev:prod        |

## 📋 Checklist rapide

- [x] Phase 1 : Mise à jour sécurité ✅ (31 janvier 2026)
- [x] Phase 2 : Suppression `next-plugin-preval` + Migration Pagefind ✅ (31 janvier 2026)
  - [x] Suppression `next-plugin-preval`
  - [x] Suppression fichiers `.preval.ts`
  - [x] Simplification `next.config.js`
  - [x] Création `utils/get-static-paths.ts`
  - [x] Installation et configuration Pagefind
  - [x] Création `pagefind-search.tsx`
  - [x] Attributs `data-pagefind-*` sur toutes les pages
  - [x] Suppression `fuse.js` et `itemsjs`
- [x] Phase 3 : Amélioration code ✅ (31 janvier 2026)
  - [x] Installation Zod pour validation env
  - [x] Création ErrorBoundary
  - [x] Ajout commande `check-types`
  - [x] Nettoyage console.log
  - [x] Documentation @ts-ignore
- [x] Phase 4 : Nettoyage final ✅ (31 janvier 2026)
  - [x] Correction typo `.local_mogodb` → `.local_mongodb`
  - [x] Mise à jour CLAUDE.md (APEX + commandes validation)
- [x] Tests complets (build-local OK, 117 pages)
- [x] Documentation mise à jour

## 📖 Documentation complète

Voir `PLAN_MIGRATION.md` pour les détails complets de chaque phase.
