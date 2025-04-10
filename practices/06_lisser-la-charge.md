# Reporter les tâches qui peuvent l'être pour lisser la charge

## Catégories

| Cycle de vie                | Tiers   | Responsable         |
|-----------------------------|---------|---------------------|
| Réalisation (Développement) | Backend | Développeur         |
| Customer care               |         | Architecte Solution |

## Indications

* Priorité : 1 *(le plus haut)* - 5 *(le plus bas)*
* Mise en œuvre : 1 *(le plus difficile)* - 5 *(le moins difficile)*
* Impact écologique : 1 *(le plus haut)* - 5 *(le plus bas)*

| Degré de priorité | Mise en œuvre | Impact écologique |
|-------------------|---------------|-------------------|
| 3                 | 3             | 3                 |


| Ressources économisées                                   |
|----------------------------------------------------------|
| Processeur / Mémoire vive |

## Description

Dans certains cas, il est possible de décaler des traitements applicatifs dans le temps de telle sorte que la charge 
serveur soit lissée. C’est particulièrement intéressant si des pics de charge ponctuels nécessitent de dimensionner 
le composant (conteneur) à une taille plus grande que ce qui est requis la majeure partie du temps.

Utiliser une stratégie asynchrone et une mise en attente (par exemple avec une file d’attente) des traitements permet 
de limiter la consommation de ressources.


### Principe de validation

| Le nombre...                                                                                                 | est égal à |
|--------------------------------------------------------------------------------------------------------------|------------|
| de conteneurs dont les dimensions sont calibrées pour une charge importante limitée à moins de 10% de sa vie | 0          |


## Liens avec le RGESN

RGESN : 3.2