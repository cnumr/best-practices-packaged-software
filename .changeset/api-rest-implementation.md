---
"gen-referentiel-core": minor
---

Ajoute une API REST complète avec documentation Swagger

Cette mise à jour introduit une API REST publique permettant d'accéder aux fiches du référentiel de manière programmatique :

**Nouveaux endpoints :**
- `GET /api/fiches` - Liste toutes les fiches (avec filtres lang/version)
- `GET /api/fiches/{id}` - Récupère une fiche par son ID
- `GET /api/languages` - Liste des langues disponibles

**Documentation interactive :**
- Interface Swagger UI accessible à `/swagger-ui.html`
- Spécification OpenAPI 3.0 à `/api-docs/swagger`
- Documentation complète dans `docs/api.md` et `API.md`

**Architecture :**
- Génération des données JSON au build depuis les fichiers MDX
- API Routes Next.js avec rendu dynamique forcé
- Cache HTTP (1h) pour optimiser les performances
- Pas de dépendance MongoDB en runtime
- Filtrage automatique des fiches non publiées

Cette API permet aux développeurs d'intégrer les bonnes pratiques du référentiel dans leurs propres applications.
