# Plan : Schémas de validation dynamiques selon le référentiel

**Objectif :** Adapter les schémas de validation MDX (`content/*.schema.yaml`) selon la variable d'environnement `NEXT_PUBLIC_REF_NAME`.

---

## Contexte

Les fichiers de schéma dans `content/` sont actuellement configurés "en dur" pour un référentiel spécifique (RWP), ce qui pose problème pour le repo core et les autres référentiels.

### Problème actuel (`content/fiche.schema.yaml`)

```yaml
environmental_impact:
  # RWEB
  # type: number
  # RWP
  type: string

priority_implementation:
  # RWEB
  # type: number
  # RWP
  type: string

- required:
    # RWP
    - scope
    - saved_resources
```

Ces règles devraient varier selon le référentiel :
- **RWEB/REIPRO/RIA** : `environmental_impact` et `priority_implementation` sont des `number` (1-5)
- **RWP** : ce sont des `string` (high_priority, medium_priority, etc.)
- Certains champs sont requis pour RWP mais pas pour les autres

---

## Solutions possibles

### Option 1 : Schémas multiples par référentiel

Créer un schéma par référentiel :
```
content/
├── fiche.schema.yaml          # Schéma de base (common)
├── fiche.schema.rwp.yaml      # Overrides pour RWP
├── fiche.schema.rweb.yaml     # Overrides pour RWEB
└── fiche.schema.reipro.yaml   # Overrides pour REIPRO
```

**Avantages :** Simple, explicite
**Inconvénients :** Duplication, plusieurs fichiers à maintenir

### Option 2 : Script de génération dynamique

Créer un script qui génère le bon schéma avant le lint :
```bash
# scripts/generate-schema.js
# Lit NEXT_PUBLIC_REF_NAME et génère le schéma approprié
```

Modifier `package.json` :
```json
"lint:md": "node scripts/generate-schema.js && eslint . -c .md.eslintrc --ext .md,.mdx"
```

**Avantages :** Un seul point de configuration (referentiel-config.ts)
**Inconvénients :** Ajoute une étape de build

### Option 3 : Schémas conditionnels avec $ref dynamique (JSON Schema)

Utiliser les fonctionnalités avancées de JSON Schema (`oneOf`, `if/then/else`) :
```yaml
environmental_impact:
  oneOf:
    - type: number
      minimum: 1
      maximum: 5
    - type: string
      enum: [high_environmental_impact, medium_environmental_impact, low_environmental_impact]
```

**Avantages :** Un seul schéma, flexible
**Inconvénients :** Moins strict (accepte les deux formats), complexe

### Option 4 : Ignorer le lint dans le repo core

Pour le repo core uniquement, utiliser du contenu fake minimal qui passe les deux formats.

**Avantages :** Simple, pas de modification
**Inconvénients :** Ne résout pas le problème de fond

---

## Recommandation

**Option 2 (Script de génération)** semble la plus adaptée car :
1. Réutilise la configuration existante (`referentiel-config.ts`)
2. Un seul point de vérité
3. S'intègre bien dans le workflow existant

---

## Implémentation proposée (Option 2)

### 1. Créer les templates de schémas

```
content/
├── fiche.schema.base.yaml     # Parties communes
├── fiche.schema.rwp.yaml      # Spécifique RWP
├── fiche.schema.rweb.yaml     # Spécifique RWEB
└── fiche.schema.yaml          # Généré (gitignore)
```

### 2. Script de génération

`scripts/generate-schemas.mjs` :
- Lit `process.env.NEXT_PUBLIC_REF_NAME`
- Fusionne le schéma de base avec le schéma spécifique
- Génère `content/fiche.schema.yaml`

### 3. Modifier package.json

```json
"lint:md": "node scripts/generate-schemas.mjs && eslint . -c .md.eslintrc --ext .md,.mdx"
```

### 4. Ajouter au .gitignore

```
content/fiche.schema.yaml
content/lexique.schema.yaml
# etc. (fichiers générés)
```

---

## Priorité

**Basse** - À faire après la migration upstream sync complète.

---

**Dernière mise à jour :** 1 février 2026
