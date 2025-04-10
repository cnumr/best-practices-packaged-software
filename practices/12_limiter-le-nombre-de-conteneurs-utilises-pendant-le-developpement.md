# Limiter le nombre de conteneurs utilisés pendant le développement


## Catégories

| Cycle de vie                | Tiers | Responsable            |
|-----------------------------|-------|------------------------|
| Réalisation (Développement) | CI/CD | Consultant fonctionnel |
| Analyse                     |       | Développeur            |

## Indications

* Priorité : 1 *(le plus haut)* - 5 *(le plus bas)*
* Mise en œuvre : 1 *(le plus difficile)* - 5 *(le moins difficile)*
* Impact écologique : 1 *(le plus haut)* - 5 *(le plus bas)*

| Degré de priorité | Mise en œuvre | Impact écologique |
|-------------------|---------------|-------------------|
| 3                 | 5             | 3                 |


| Ressources économisées                                   |
|----------------------------------------------------------|
| Stockage |

## Description

Le dimensionnement de la BDD de Docker est directement corrélé au nombre de conteneurs activables. Pour chaque conteneur
(actif ou non), Docker garde une copie de la BDD et du paramétrage serveur Business Central.

Il est donc important de limiter le nombre de conteneurs utilisés pendant le développement, afin de limiter le stockage 
disque utilisé par le projet.

### Principe de validation

| Le nombre...                              | est inférieur ou égal à |
|-------------------------------------------|-------------------------|
| de conteneurs par développeur             | 0                       |
| de conteneurs par consultant fonctionnel  | 0                       |


## Liens avec le RGESN

RGESN : NA