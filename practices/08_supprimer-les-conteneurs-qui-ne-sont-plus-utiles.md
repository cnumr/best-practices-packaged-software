# Supprimer les containers qui ne sont plus utiles


## Catégories

| Cycle de vie                | Tiers | Responsable              |
|-----------------------------|-------|--------------------------|
| Réalisation (Développement) | CI/CD | Consultant fonctionnel   |
| Analyse                     |       | Développeur              |

## Indications

* Priorité : 1 *(le plus haut)* - 5 *(le plus bas)*
* Mise en œuvre : 1 *(le plus difficile)* - 5 *(le moins difficile)*
* Impact écologique : 1 *(le plus haut)* - 5 *(le plus bas)*

| Degré de priorité | Mise en œuvre | Impact écologique |
|-------------------|---------------|-------------------|
| 3                 | 4             | 3                 |


| Ressources économisées |
|------------------------|
| Stockage               |

## Description

Le dimensionnement de la BDD de Docker est directement corrélé au nombre de conteneurs activables. Pour chaque 
conteneur (actif ou non), Docker garde une copie de la BDD et du paramétrage serveur Business Central.

Il n’est pas nécessaire de garder des données qui ne seront jamais réutilisées par la suite. De plus, il est 
préférable de recréer un conteneur lors d’une nouvelle session de DEV pour être sûr d’avoir le dernier contexte client.

## Exemple
J’ai fait un dev il y a un mois. Je dois refaire un dev aujourd’hui. Mon client étant en SaaS, la version de Business 
Central a sûrement changé. Il faut donc que je travaille sur un nouveau conteneur. Mon ancien conteneur n'est 
donc plus utile.


### Principe de validation

| Le nombre...                             | est égal à |
|------------------------------------------|------------|
| de conteneurs par développeur est        | 0          |
| de conteneurs par consultant fonctionnel | 0          |


## Liens avec le RGESN

RGESN : 2.7