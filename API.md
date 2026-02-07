# API Documentation

Cette API permet d'accéder aux fiches du référentiel GreenIT de manière programmatique.

## 🚀 Démarrage rapide

### Accès à l'interface Swagger

L'API est documentée avec Swagger UI. Accédez à l'interface interactive à :

```
http://localhost:3000/swagger-ui.html
```

Ou en production :

```
https://votre-domaine.com/swagger-ui.html
```

La spec OpenAPI JSON est disponible à :

```
http://localhost:3000/api-docs/swagger
```

## 📡 Endpoints disponibles

### 1. Liste des langues disponibles

```http
GET /api/languages
```

**Réponse** :
```json
{
  "data": ["fr", "en", "es"],
  "default": "fr"
}
```

---

### 2. Liste des versions disponibles

```http
GET /api/versions
```

Retourne la liste des versions distinctes présentes dans les fiches publiées.

**Réponse** :
```json
{
  "data": ["1.0.0", "2.0.0"],
  "meta": {
    "total": 2
  }
}
```

---

### 4. Liste de toutes les fiches

```http
GET /api/fiches
GET /api/fiches?lang=fr
GET /api/fiches?version=1.0.0
GET /api/fiches?lang=fr&version=1.0.0
```

**Paramètres de query** :
- `lang` (optionnel) : Code de langue (fr, en, es, etc.). Par défaut : langue du référentiel
- `version` (optionnel) : Version du référentiel (ex: "1.0.0") ou "latest". Par défaut : "latest"

**Réponse** :
```json
{
  "data": [
    {
      "id": "1.01",
      "title": "Exemple de bonne pratique",
      "lang": "fr",
      "versions": [
        {
          "version": "1.0.0",
          "idRef": "1.01"
        }
      ],
      "url": "/fr/fiches/FAKE_1.01-installation-exemple"
    }
  ],
  "meta": {
    "total": 42,
    "lang": "fr",
    "version": "latest"
  }
}
```

**Erreur 400** (langue non supportée) :
```json
{
  "error": "Unsupported language",
  "message": "Language \"de\" is not supported. Available languages: fr, en, es"
}
```

---

### 5. Récupérer une fiche par son ID

```http
GET /api/fiches/{id}
GET /api/fiches/{id}?lang=fr
GET /api/fiches/{id}?version=1.0.0
GET /api/fiches/{id}?lang=fr&version=1.0.0
```

**Paramètres** :
- `id` (requis) : Identifiant de la fiche (ex: "1.01")

**Paramètres de query** :
- `lang` (optionnel) : Code de langue. Par défaut : langue du référentiel
- `version` (optionnel) : Version du référentiel ou "latest". Par défaut : "latest"

**Réponse** :
```json
{
  "data": {
    "id": "1.01",
    "title": "Exemple de bonne pratique",
    "lang": "fr",
    "versions": [
      {
        "version": "1.0.0",
        "idRef": "1.01"
      }
    ],
    "url": "/fr/fiches/FAKE_1.01-installation-exemple",
    "currentVersion": "1.0.0"
  }
}
```

**Erreur 400** (langue non supportée) :
```json
{
  "error": "Unsupported language",
  "message": "Language \"de\" is not supported. Available languages: fr, en, es"
}
```

---

## 🔗 Utilisation de l'URL

Chaque fiche contient un champ `url` qui permet d'accéder directement à la fiche sur le site :

```javascript
const fiche = await fetch('/api/fiches/1.01').then(r => r.json());
const ficheUrl = `https://votre-domaine.com${fiche.data.url}`;
// => https://votre-domaine.com/fr/fiches/FAKE_1.01-installation-exemple
```

---

## 📦 Exemples d'utilisation

### JavaScript / TypeScript

```typescript
// Récupérer toutes les fiches en français
const fiches = await fetch('/api/fiches?lang=fr')
  .then(r => r.json());

console.log(fiches.data); // Array de fiches
console.log(fiches.meta.total); // Nombre total de fiches

// Récupérer une fiche spécifique
const fiche = await fetch('/api/fiches/1.01?lang=fr')
  .then(r => r.json());

console.log(fiche.data.title);
console.log(fiche.data.url);

// Ouvrir la fiche dans une nouvelle fenêtre
window.open(`https://votre-domaine.com${fiche.data.url}`, '_blank');
```

### cURL

```bash
# Liste toutes les fiches
curl https://votre-domaine.com/api/fiches

# Récupère une fiche spécifique
curl https://votre-domaine.com/api/fiches/1.01

# Avec des paramètres
curl "https://votre-domaine.com/api/fiches?lang=fr&version=1.0.0"
```

### Python

```python
import requests

# Récupérer toutes les fiches
response = requests.get('https://votre-domaine.com/api/fiches?lang=fr')
data = response.json()

for fiche in data['data']:
    print(f"{fiche['id']}: {fiche['title']}")
    print(f"  URL: {fiche['url']}")
```

---

## 🔄 Génération des données

Les données de l'API sont générées automatiquement lors du build à partir des fichiers MDX.

### Manuellement

Pour régénérer les données de l'API sans rebuild complet :

```bash
node scripts/generate-api-data.mjs
```

Le fichier généré est situé à : `public/api-data/fiches-full.json`

### Automatiquement

Les données sont automatiquement régénérées lors de :
- `pnpm build` (production)
- `pnpm build-local` (local)

---

## ⚠️ Notes importantes

1. **Fiches publiées uniquement** : L'API retourne uniquement les fiches avec `published: true`
2. **Cache** : Les réponses sont mises en cache pour 1 heure (`Cache-Control: public, s-maxage=3600`)
3. **Synchronisation** : Les données de l'API sont synchronisées au moment du build. Pour voir les changements après modification d'une fiche, il faut rebuild l'application
4. **Langues par défaut** : Si aucune langue n'est spécifiée, l'API utilise la langue par défaut du référentiel (configurée dans `referentiel-config.ts`)

---

## 🐛 Erreurs courantes

### 404 - API data not found

```json
{
  "error": "API data not found",
  "message": "Please run 'node scripts/generate-api-data.mjs' to generate the API data"
}
```

**Solution** : Exécutez `node scripts/generate-api-data.mjs` ou rebuilder l'application.

### 404 - Fiche not found

```json
{
  "error": "Fiche not found",
  "message": "No fiche found with id \"X.XX\" for language \"fr\" and version \"latest\""
}
```

**Solution** : Vérifiez l'ID de la fiche, la langue et la version demandée.

---

## 📚 Documentation interactive

Pour explorer l'API de manière interactive, accédez à Swagger UI :

```
http://localhost:3000/swagger-ui.html
```

L'interface permet de :
- Voir tous les endpoints disponibles
- Tester les endpoints directement dans le navigateur
- Voir les schémas de réponse détaillés
- Copier des exemples de code
- Télécharger la spec OpenAPI
