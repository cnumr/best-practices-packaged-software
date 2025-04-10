# Limiter la fréquence de lancement des builds

## Catégories

| Cycle de vie                | Tiers | Responsable          |
|-----------------------------|-------|----------------------|
| Réalisation (Développement) | CI/CD | Architecte Solutions |
| Customer care               |       | Développeur          |

## Indications

* Priorité : 1 *(le plus haut)* - 5 *(le plus bas)*
* Mise en œuvre : 1 *(le plus difficile)* - 5 *(le moins difficile)*
* Impact écologique : 1 *(le plus haut)* - 5 *(le plus bas)*

| Degré de priorité | Mise en œuvre | Impact écologique |
|-------------------|---------------|-------------------|
| 2                 | 5             | 3                 |


| Ressources économisées                                   |
|----------------------------------------------------------|
| Processeur / Mémoire vive |

## Description

Il est possible de lancer, de façon automatique, un certain nombre de pipelines de build. Il est important de réfléchir
à la fréquence de lancement de ceux-ci. En effet, il est important de faire une balance entre sécurité/qualité des 
développements et consommation serveur.

De plus, il est important de se poser la question si tous les pipelines sont utiles dès le début du projet (surtout sur 
les projets OnPrem).

## Exemple

Il serait possible de lancer toutes les pipelines à la moindre modification de code mais cela aurait un impact conséquent 
sur la consommation de ressources.

Par exemple, est-il vraiment utile de lancer les pipelines de Next Major systématiquement à chaque pull request alors
que les Next Major n’ont lieu que 2 fois par an ?

## Exemple de stratégie

La stratégie suivante peut par exemple être utilisée :

* Pipeline « Current Build », à chaque pull request.
* Pipeline « Next minor », à chaque pull request dans projets SaaS et chaque semaine pour prendre en compte les mises à jour.
* Pipeline « Next Major », 1 fois par mois.
* Pipeline « All » (simulant toutes les extensions actuelles de l’env. de prod) 1 fois toutes les 2 semaines.
* Next Major, Next Minor et All ne sont pas à initialiser au début d’un projet OnPrem.
* 
Ces règles peuvent être flexibles en fonction du contexte projet (Next Major très proche, test de nouvelles versions, …).
Cependant, ces cas doivent rester exceptionnels.


### Principe de validation

| Le nombre...                                                   | est égal à |
|----------------------------------------------------------------|------------|
| De builds dont la fréquence de lancement n’a pas été minimisée | 0          |


## Liens avec le RGESN

RGESN : NA