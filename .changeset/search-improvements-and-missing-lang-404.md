---
'gen-referentiel-core': minor
---

Améliore la recherche Pagefind et la gestion des langues manquantes

- Highlight des termes recherchés dans le titre et le refid des résultats de recherche
- Boost du refid dans le ranking Pagefind via `data-pagefind-weight` pour remonter les fiches correspondantes lors d'une recherche par numéro
- Le build ne plante plus si le contenu home ou mentions-légales est absent pour une langue (retourne une 404 propre)
- Ajout d'une page not-found traduite (fr/en/es) avec lien de retour vers la langue par défaut
