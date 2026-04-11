---
"gen-referentiel-core": patch
---

fix(config): désactive le lien API pour REF_HOME

Le portail REF_HOME n'a pas de documentation API propre, le flag `linkToAPI` est donc positionné à `false` pour ce référentiel.
