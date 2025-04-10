# Monitorer les ressources


## Catégories

| Cycle de vie                | Tiers   | Responsable         |
|-----------------------------|---------|---------------------|
| Réalisation (Développement) | CI/CD   | Architecte Software |
| Customer Care               | Backend |                     |

## Indications

* Priorité : 1 *(le plus haut)* - 5 *(le plus bas)*
* Mise en œuvre : 1 *(le plus difficile)* - 5 *(le moins difficile)*
* Impact écologique : 1 *(le plus haut)* - 5 *(le plus bas)*

| Degré de priorité | Mise en œuvre | Impact écologique |
|-------------------|---------------|-------------------|
| 3                 | 4             | 5                 |


| Ressources économisées                                   |
|----------------------------------------------------------|
| Processeur / Mémoire Vive / Réseau / I/O / Storage |

## Description

La mise en place d'outils de télémétrie est une étape cruciale dans la gestion et l'optimisation des systèmes 
informatiques et des réseaux. La télémétrie permet de collecter, de surveiller et d'analyser des données en temps 
réel provenant de divers dispositifs et applications. L'implémentation de ces outils commence par l'identification 
des paramètres clés à surveiller, tels que la performance des serveurs (consommation de mémoire vive et de cycles CPU 
notamment), l'utilisation de la bande passante, les erreurs de réseau, et les comportements des applications. Ensuite, 
des solutions de télémétrie appropriées sont sélectionnées et configurées pour capturer ces métriques. Cela implique 
souvent l'intégration de logiciels spécialisés, comme des agents de monitoring, qui transmettent les données à une 
plateforme centrale pour une analyse approfondie. L'utilisation de tableaux de bord interactifs et d'alertes
automatisées permet aux équipes techniques de réagir rapidement aux anomalies et de prévenir les pannes potentielles. 

## Exemples

Métriques que l’on peut suivre :
* Utilisation du CPU : Permet de surveiller si les processeurs des serveurs sont surchargés, ce qui peut ralentir le traitement des requêtes ou surdimensionnés ce qui se traduit par des impacts environnementaux évitables.
* Utilisation de la mémoire (RAM) : Une consommation élevée de la mémoire peut indiquer des fuites de mémoire ou des applications gourmandes en ressources. Le taux d’utilisation permet aussi de “downsizer” une VM.
* Utilisation du disque : Surveiller l'espace de stockage disponible et les taux de lecture/écriture peut prévenir les pannes dues à un manque d'espace ou à des disques défectueux.
* Utilisation du réseau : La bande passante consommée par le trafic entrant et sortant est critique pour s'assurer que le réseau ne devienne pas un goulot d'étranglement.
* Temps de réponse des applications : Mesurer le temps nécessaire pour traiter les requêtes des utilisateurs.

Solutions que l’on peut mettre en place :
* Azure Application Insights : Azure Application Insights est un service de surveillance des performances des applications. Il permet de collecter des métriques détaillées et des logs des serveurs et des applications.
* Power BI : Power BI permet de visualiser les données collectées par Application Insights ou autres et de créer des rapports interactifs et des tableaux de bord.


### Principe de validation

| Le nombre...                                                                                              | est égal à |
|-----------------------------------------------------------------------------------------------------------|------------|
| De projet avec suivi des consommations systèmes des clients                                               | 90%        |
| De nos clients ayant des alertes sur la sur-sous consommations systèmes et/ou projections de consommation | 90%        |


## Liens avec le RGESN

RGESN : NA