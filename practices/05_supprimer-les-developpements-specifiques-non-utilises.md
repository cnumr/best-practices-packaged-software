# Supprimer les développements spécifiques non utilisés


## Catégories

| Cycle de vie | Tiers            | Responsable         |
|--------------|------------------|---------------------|
| Design       | Tous             | Architecte Solution |
| Run          |                  |                     |

## Indications

* Priorité : 1 *(le plus haut)* - 5 *(le plus bas)*
* Mise en œuvre : 1 *(le plus difficile)* - 5 *(le moins difficile)*
* Impact écologique : 1 *(le plus haut)* - 5 *(le plus bas)*

| Degré de priorité | Mise en œuvre | Impact écologique |
|-------------------|---------------|-------------------|
| 3                 | 3             | 2                 |


| Ressources économisées                                   |
|----------------------------------------------------------|
| Processeur / Mémoire vive / Stockage / Réseau / Requêtes |

## Description

Il arrive que des fonctionnalités ne soient plus utilisées parce que le besoin des utilisateurs a changé. Dans le but 
de simplifier l’application et de l’alléger, ces développements spécifiques doivent être supprimés. Cela permet de 
réduire l’empreinte technique (RAM, CPU, etc.) côté client comme côté serveur. On contribue ainsi à réduire les 
impacts environnementaux inutiles.

L'identification de ces développements peut se faire par télémétrie, mais aussi et surtout par la connaissance de 
l’équipe sur le produit déployé et le client.

## Exemples avec Business Central

* Identifier dans quelle mesure les traitements de report avec mise à jour des coûts sont lancés
* Identifier la fréquence d’utilisation des pages statistiques (avec les prix de ventes marges etc.)
* Vérifier l'utilisation des Factbox sur les pages
* Idem pour Pack & ship qui donne des statistiques de performance

### Principe de validation

| Le nombre...                                                                      | est égal à |
|-----------------------------------------------------------------------------------|------------|
| Fonctionnalités réclamant un développement spécifique qui ne sont plus utilisées… | 0          |


## Liens avec le RGESN

RGESN : 2.7