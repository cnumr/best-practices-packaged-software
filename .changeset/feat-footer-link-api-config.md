---
"gen-referentiel-core": patch
---

feat(footer): conditionne le lien API via le flag linkToAPI dans referentiel-config

Le lien vers la documentation API dans le footer est désormais conditionné par le flag `featuresEnabled.linkToAPI` dans `referentiel-config.ts`, permettant de l'activer ou désactiver par référentiel.
