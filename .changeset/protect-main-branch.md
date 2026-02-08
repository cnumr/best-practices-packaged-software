---
"gen-referentiel-core": minor
---

Protège les branches main/master contre l'édition directe via TinaCMS

- Nouveau `ProtectedGitHubProvider` qui bloque les écritures sur les branches protégées
- Warning visuel `warnOnMainMasterBranch` affiché dans l'interface d'édition
- Les contributeurs doivent utiliser une branche de travail et soumettre une PR
