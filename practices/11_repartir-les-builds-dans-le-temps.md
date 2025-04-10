# Répartir les builds dans le temps


## Catégories

| Cycle de vie                | Tiers | Responsable |
|-----------------------------|-------|-------------|
| Réalisation (Développement) | CI/CD | Développeur |
| Customer care               |       |             |

## Indications

* Priorité : 1 *(le plus haut)* - 5 *(le plus bas)*
* Mise en œuvre : 1 *(le plus difficile)* - 5 *(le moins difficile)*
* Impact écologique : 1 *(le plus haut)* - 5 *(le plus bas)*

| Degré de priorité | Mise en œuvre | Impact écologique |
|-------------------|---------------|-------------------|
| 3                 | 3             | 3                 |


| Ressources économisées    |
|---------------------------|
| Processeur / Mémoire vive |

## Description

Il est possible de lancer de façon automatique un certain nombre de pipelines de build. Il est important de réfléchir à 
la fréquence de lancement de ceux-ci par rapport à tous les autres projets. En effet, si tous les lancements 
automatiques de tous les projets se lancent en même temps, cela provoque un pic serveur, provoquant ralentissement et 
potentiellement des erreurs, comme des timeouts.

Pour éviter ces ralentissements lors des pics, il faut augmenter la puissance informatique mise à disposition, ce qui 
augmente inutilement les impacts environnementaux associés. Mieux répartir les builds dans le temps permet au contraire 
de réduire la quantité de ressources informatiques (nombre et taille des serveurs) nécessaire pour construire tous les 
builds.

Il est donc important de répartir les différents lancements automatiques des différents projets dans des plages horaires 
bien séparées et dans des heures creuses. Un petit effort de planification entre les différents projets peut donc être 
payant tant en termes de réductions des coûts (moins de serveurs moins puissants = moins de coûts) et d'impacts 
environnementaux.

## Exemple

Si 50 projets lancent chacun un build Next Major en même temps, un pic de consommation serveur est créé alors que s’ils
avaient été répartis, la consommation serait linéaire.


### Principe de validation

| Le nombre...                                                           | est inférieur ou égal à       |
|------------------------------------------------------------------------|-------------------------------|
| de projet qui n’ont pas été pris en compte dans le planning des builds | 5% du nombre total de projets |


## Liens avec le RGESN

RGESN : NA