# Désactiver l'auto-start et activer l'auto-stop


## Catégories

| Cycle de vie                | Tiers | Responsable |
|-----------------------------|-------|-------------|
| Réalisation (Développement) | CI/CD | Développeur |
| Analyse                     |       |             |

## Indications

* Priorité : 1 *(le plus haut)* - 5 *(le plus bas)*
* Mise en œuvre : 1 *(le plus difficile)* - 5 *(le moins difficile)*
* Impact écologique : 1 *(le plus haut)* - 5 *(le plus bas)*

| Degré de priorité | Mise en œuvre | Impact écologique |
|-------------------|---------------|-------------------|
| 4                 | 5             | 3                 |


| Ressources économisées                                   |
|----------------------------------------------------------|
| Processeur / Mémoire vive |

## Description

Il est primordial de faire en sorte de limiter le nombre de conteneurs actifs en même temps. En effet, ceux-ci utilisent 
des ressources numériques (CPU, RAM, disque, etc.) dont on souhaite réduire l’utilisation pour réduire les impacts 
environnementaux du projet.

Pour cela il faut mettre en place une solution permettant de gérer l’arrêt automatique des conteneurs.
Il est aussi important de limiter le plus possible le démarrage automatique des conteneurs.

## Exemple

J’ai un container Docker actif qui ne m’est pas utile dans l’immédiat. Il utilise des ressources inutilement. S’il 
s’éteignait automatiquement, il ne consommerait pas de ressources autres que de l’espace disque. Cette stratégie 
appliquée à l’ensemble des containers Docker permet de downsizer l’infrastructure matérielle dédiée.


### Principe de validation

| Le nombre...                            | est égal à |
|-----------------------------------------|------------|
| de conteneurs avec l'AutoStop désactivé | 0          |
| de conteneurs sans paramétrage horaire  | 0          |


## Liens avec le RGESN

RGESN : NA