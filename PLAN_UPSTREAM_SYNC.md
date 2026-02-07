# Plan : Architecture Upstream Sync

**Objectif :** Partager le code entre plusieurs sites existants sans duplication, en utilisant un repo source comme référence.

---

## Contexte

- Plusieurs repositories existent déjà (rwp, rweb, reipro, etc.)
- Ils partagent la même base de code
- Seul le contenu (`src/content/`) diffère entre les sites
- Besoin : mettre à jour le code facilement sans merges manuels complexes

> **Note :** Cette approche n'utilise PAS la fonctionnalité "Fork" de GitHub. On ajoute simplement un remote `upstream` aux repos existants. Le résultat est techniquement identique, mais sans le lien "forked from" dans l'interface GitHub.

---

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                    gen-referentiel-core                              │
│                    (nouveau repo source)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ app/        │  │ components/ │  │ tina/       │   CODE       │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────────────────────────────────────────┐            │
│  │ src/content/  (contenu FAKE pour tests)         │   CONTENU  │
│  └─────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │ upstream        │ upstream        │ upstream
            │ remote          │ remote          │ remote
            ▼                 ▼                 ▼
     ┌──────────┐      ┌──────────┐      ┌──────────┐
     │   rwp    │      │   rweb   │      │  reipro  │
     │(existant)│      │(existant)│      │(existant)│
     │          │      │          │      │          │
     │ CODE:    │      │ CODE:    │      │ CODE:    │
     │ sync     │      │ sync     │      │ sync     │
     │ upstream │      │ upstream │      │ upstream │
     │          │      │          │      │          │
     │ CONTENU: │      │ CONTENU: │      │ CONTENU: │
     │ WordPress│      │ Web      │      │ REIPRO   │
     └──────────┘      └──────────┘      └──────────┘
          │                 │                 │
          ▼                 ▼                 ▼
       Vercel            Vercel            Vercel
```

---

## Phase 1 : Créer le repo source (gen-referentiel-core)

### 1.1 Créer le nouveau repo

```bash
# Créer un nouveau repo sur GitHub : cnumr/gen-referentiel-core

# Cloner un des repos existants comme base
git clone git@github.com:cnumr/best-practices-wordpress.git gen-referentiel-core
cd gen-referentiel-core

# Changer le remote origin
git remote set-url origin git@github.com:cnumr/gen-referentiel-core.git
git push -u origin main
```

### 1.2 Remplacer le contenu réel par du contenu fake

Créer un jeu de données minimal mais représentatif pour tester :

```
src/content/
├── fiches/
│   └── fr/
│       ├── FAKE_1.01-exemple-fiche.mdx
│       ├── FAKE_1.02-autre-exemple.mdx
│       └── FAKE_2.01-categorie-deux.mdx
├── lexique/
│   └── fr/
│       ├── terme-exemple.mdx
│       └── autre-terme.mdx
├── personas/
│   └── fr/
│       └── persona-exemple.mdx
└── home/
    └── fr.mdx
```

### 1.3 Configurer `.gitattributes` pour protéger les fichiers spécifiques

```bash
# Créer .gitattributes à la racine du repo core
cat > .gitattributes << 'EOF'
# Protéger le contenu spécifique au site lors des merges upstream
src/content/** merge=ours

# Protéger les fichiers TinaCMS générés (dépendent de TINA_PUBLIC_REF_NAME)
tina/tina-lock.json merge=ours
tina/__generated__/** merge=ours

# Merge intelligent pour package.json (garde name/description local, prend dependencies upstream)
package.json merge=package-json-merge

# Protéger la documentation spécifique au site
README.md merge=ours
README.*.md merge=ours
EOF
```

### 1.4 Script de merge intelligent pour package.json

Le script `scripts/merge-package-json.sh` fusionne automatiquement :
- **Garde local** : `name`, `description`, `repository`, `homepage`, `bugs`
- **Prend upstream** : `dependencies`, `devDependencies`, `scripts`, etc.

**Prérequis** : `jq` doit être installé (`brew install jq`)

### 1.5 Documenter dans le README

Ajouter une section dans le README du repo core :

```markdown
## Architecture Multi-Sites

Ce repo sert de source pour plusieurs sites :
- **gen-referentiel-core** : Code source + contenu fake (ce repo)
- **rwp** : Site WordPress (repo existant)
- **rweb** : Site Web (repo existant)
- **reipro** : Site REIPRO (repo existant)

### Pour les mainteneurs

Voir `CONTRIBUTING.md` pour le workflow de mise à jour.
```

---

## Phase 2 : Configurer les repos existants

### 2.1 Ajouter le remote upstream

Dans chaque repo existant (rwp, rweb, reipro) :

```bash
# Se placer dans le repo existant
cd best-practices-wordpress  # ou rweb, reipro, etc.

# Ajouter le remote upstream
git remote add upstream git@github.com:cnumr/gen-referentiel-core.git

# Vérifier les remotes
git remote -v
# origin    git@github.com:cnumr/best-practices-wordpress.git (fetch/push)
# upstream  git@github.com:cnumr/gen-referentiel-core.git (fetch/push)
```

### 2.2 Configurer les drivers de merge

```bash
# Driver "ours" pour les fichiers à protéger entièrement
git config merge.ours.driver true

# Driver custom pour package.json (merge intelligent)
git config merge.package-json-merge.name "Merge intelligent package.json"
git config merge.package-json-merge.driver "scripts/merge-package-json.sh %O %A %B"
```

Ou l'ajouter au `.gitconfig` global :

```ini
[merge "ours"]
    driver = true

[merge "package-json-merge"]
    name = Merge intelligent package.json
    driver = scripts/merge-package-json.sh %O %A %B
```

### 2.3 Copier le `.gitattributes` depuis le core

```bash
git fetch upstream
git checkout upstream/main -- .gitattributes
git add .gitattributes
git commit -m "chore: ajoute .gitattributes pour la sync upstream"
```

### 2.4 Copier le script de merge package.json

```bash
mkdir -p scripts
git checkout upstream/main -- scripts/merge-package-json.sh
chmod +x scripts/merge-package-json.sh
git add scripts/merge-package-json.sh
git commit -m "chore: ajoute le script de merge package.json"
```

---

## Phase 3 : Workflow de mise à jour

### 3.1 Évolution dans le core

Quand une évolution est faite dans `gen-referentiel-core` :

```bash
# Dans gen-referentiel-core
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
```

### 3.2 Synchroniser un site existant

```bash
# Dans le repo du site (ex: rwp)
git fetch upstream
git merge upstream/main

# Si les branches ont des historiques non liés (première sync)
# Utiliser --allow-unrelated-histories
git merge upstream/main --allow-unrelated-histories

# Si tout va bien, le contenu local est préservé grâce à .gitattributes
# Vérifier que src/content/ n'a pas été modifié
git diff --stat HEAD~1 -- src/content/

git push origin main
# → Vercel redéploie automatiquement

# ⚠️ Si votre branche et origin/main ont divergé (après merge upstream)
# Vous devrez forcer le push avec --force-with-lease
git push --force-with-lease origin main
```

### 3.3 En cas de conflit

Si un conflit survient (rare si .gitattributes est bien configuré) :

#### Voir les fichiers en conflit

```bash
git status
# ou pour plus de détails
git diff --name-only --diff-filter=U
```

#### Stratégie 1 : Résoudre fichier par fichier

```bash
# Pour garder votre version locale d'un fichier (ours)
git checkout --ours src/content/chemin/fichier.mdx

# Pour prendre la version upstream (theirs)
git checkout --theirs app/chemin/fichier.ts

# Marquer comme résolu
git add src/content/chemin/fichier.mdx app/chemin/fichier.ts
```

#### Stratégie 2 : Tout accepter d'upstream (première sync)

Si vous faites la première synchronisation et voulez tout prendre d'upstream :

```bash
# Accepter TOUS les fichiers en conflit depuis upstream
git checkout --theirs .

# Marquer tous les fichiers comme résolus
git add .

# Finaliser le merge
git commit -m "merge: intègre les mises à jour du core"
```

#### Stratégie 3 : Résolution manuelle avec un éditeur

Les fichiers en conflit contiennent des marqueurs :

```
<<<<<<< HEAD (votre version)
votre code
=======
code upstream
>>>>>>> upstream/main
```

Vous pouvez :
1. Ouvrir le fichier dans VS Code (il détecte automatiquement les conflits)
2. Choisir "Accept Current Change", "Accept Incoming Change", ou éditer manuellement
3. Sauvegarder et `git add` le fichier

#### Annuler un merge en cours

```bash
# Si vous voulez recommencer
git merge --abort
```

### 3.4 Script d'aide (optionnel)

Créer `scripts/sync-upstream.sh` dans chaque repo :

```bash
#!/bin/bash
set -e

echo "Synchronisation avec upstream..."
git fetch upstream

echo "Changements à intégrer :"
git log --oneline HEAD..upstream/main

read -p "Continuer ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git merge upstream/main
    echo "Merge effectué"
    echo "Vérifiez que src/content/ n'a pas été modifié"
    git diff --stat HEAD~1 -- src/content/
else
    echo "Annulé"
fi
```

---

## Phase 4 : Configuration Vercel

Les repos existants sont déjà connectés à Vercel. Aucune modification nécessaire.

Les variables d'environnement restent inchangées :
- `NEXT_PUBLIC_REF_NAME=RWP` (ou RWEB, REIPRO, etc.)
- `TINA_PUBLIC_REF_NAME=RWP`
- Variables TinaCMS (GitHub token, MongoDB, etc.)

---

## Phase 5 : Tests et validation

### 5.1 Tester le core avec contenu fake

```bash
cd gen-referentiel-core
pnpm install
pnpm dev
# Vérifier que le site fonctionne avec le contenu fake
```

### 5.2 Tester la synchronisation

```bash
# Dans gen-referentiel-core : faire un petit changement
echo "// test sync" >> utils/test-sync.ts
git add . && git commit -m "test: changement pour tester la sync"
git push

# Dans rwp : synchroniser
git fetch upstream
git merge upstream/main

# Vérifier que :
# 1. Le changement est présent
# 2. src/content/ n'a pas été modifié
git diff --stat HEAD~1 -- src/content/
```

---

## Checklist de migration

### Repo Core (à créer)
- [ ] Créer le repo `gen-referentiel-core` sur GitHub
- [ ] Cloner un repo existant comme base
- [ ] Remplacer le contenu réel par du contenu fake
- [ ] Ajouter `.gitattributes`
- [ ] Ajouter `scripts/merge-package-json.sh`
- [ ] Mettre à jour le README
- [ ] Tester le build avec contenu fake
- [ ] Push sur GitHub

### Pour chaque site existant (rwp, rweb, reipro)
- [ ] Ajouter remote upstream : `git remote add upstream <url>`
- [ ] Configurer le driver de merge : `git config merge.ours.driver true`
- [ ] Copier `.gitattributes` depuis upstream
- [ ] Copier `scripts/merge-package-json.sh` depuis upstream
- [ ] Tester la première synchronisation
- [ ] Vérifier que `src/content/` n'est pas modifié
- [ ] Tester le build local
- [ ] Push et vérifier le déploiement Vercel

---

## Commandes de référence

```bash
# Voir l'état des remotes
git remote -v

# Voir les commits upstream non intégrés
git log --oneline HEAD..upstream/main

# Synchroniser avec upstream
git fetch upstream && git merge upstream/main

# Voir ce qui a changé dans le dernier merge
git diff HEAD~1 --stat

# Annuler un merge en cours
git merge --abort

# Forcer à garder la version locale d'un fichier
git checkout --ours <fichier>
```

---

## Points d'attention

1. **Ne jamais modifier le code dans les repos sites** - Toutes les évolutions de code doivent être faites dans `gen-referentiel-core`

2. **Contenu uniquement dans les repos sites** - Les modifications de contenu (`src/content/`) ne doivent être faites que dans les repos des sites

3. **Configurer le merge driver** - Chaque développeur doit exécuter `git config merge.ours.driver true`

4. **Tester avant de push** - Après un merge upstream, toujours vérifier que le build fonctionne

5. **referentiel-config.ts** - Ce fichier est partagé. Les différences entre sites sont gérées par `NEXT_PUBLIC_REF_NAME`

6. **tina-lock.json et tina/__generated__/** - Ces fichiers sont générés selon `TINA_PUBLIC_REF_NAME`. Ils sont protégés avec `merge=ours`.

---

## Fichiers : partagés vs protégés

| Fichier/Dossier | Partagé (upstream) | Protégé (local) | Raison |
|-----------------|:------------------:|:---------------:|--------|
| `app/` | ✅ | | Code |
| `components/` | ✅ | | Code |
| `tina/config.tsx` | ✅ | | Config TinaCMS |
| `tina/collections/` | ✅ | | Schéma (dynamique via env) |
| `tina/tina-lock.json` | | ✅ | Généré selon `TINA_PUBLIC_REF_NAME` |
| `tina/__generated__/` | | ✅ | Généré selon `TINA_PUBLIC_REF_NAME` |
| `utils/` | ✅ | | Code |
| `package.json` | ⚡ | ⚡ | Merge intelligent |
| `README.md` | | ✅ | Doc spécifique au site |
| `src/content/` | | ✅ | Contenu spécifique |
| `.env` | | (gitignore) | Pas dans git |
| `.env.example` | ✅ | | Template partagé |

---

## Différence avec un "vrai" fork GitHub

| Aspect | Fork GitHub | Upstream Sync (cette approche) |
|--------|-------------|-------------------------------|
| Lien dans l'interface GitHub | "forked from cnumr/core" | Aucun lien visible |
| Fonctionnement git | Identique | Identique |
| Commandes de sync | `git fetch upstream && git merge` | `git fetch upstream && git merge` |
| Pull Requests vers upstream | Via GitHub UI | Via GitHub UI (mais moins intuitif) |
| Repos existants | Doivent être recréés | Peuvent être utilisés tels quels ✅ |

---

**Dernière mise à jour :** 1 février 2026
