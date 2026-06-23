# Portfolio - Alexandre Edmond

Site personnel publie avec GitHub Pages :

https://alexandreedmond.github.io/

Ce depot contient la premiere version du portfolio. L'objectif est de partir
d'une page tres simple, puis de l'ameliorer progressivement.

## Recommandations prioritaires

1. Clarifier le positionnement en haut de page

   Ajouter une phrase courte qui explique directement qui tu es et ce que tu
   construis. Exemple :

   > Developpeur oriente IA, reinforcement learning, robotique et outils web.

   Le visiteur doit comprendre en moins de 5 secondes ton domaine, ton niveau
   d'interet et le type de projets que tu veux montrer.

2. Mettre en avant 3 a 5 projets forts

   Le site ne doit pas lister tous les repos. Il vaut mieux selectionner les
   projets les plus representatifs :

   - `numpy-rl-racer` : projet principal RL / simulation.
   - `Circle-Seeker-RL` : environnement RL propre avec tests et visualisation.
   - `syswatch` : outil web/systeme utile et concret.
   - `TonySpark` : interface React avec controle gestuel.
   - `TTS-GAN` : projet IA plus academique / recherche.

   Pour chaque projet, ajouter :

   - une description en une phrase ;
   - les technologies utilisees ;
   - ce que le projet demontre techniquement ;
   - un lien GitHub ;
   - si possible une capture d'ecran ou une demo.

3. Ajouter une vraie section "A propos"

   La section actuelle est volontairement minimale. Elle peut devenir plus
   personnelle et plus precise :

   - formation ou parcours ;
   - sujets qui t'interessent ;
   - types de problemes que tu aimes resoudre ;
   - technologies principales ;
   - objectif actuel : stage, alternance, emploi, recherche, projets open source.

4. Ajouter des liens de contact

   A minima :

   - GitHub ;
   - LinkedIn ;
   - email professionnel ;
   - CV en PDF.

   Un portfolio doit permettre de te contacter rapidement, sans fouiller.

## Idees de sections a ajouter

### Hero

Premiere section visible du site :

- nom ;
- phrase de positionnement ;
- 2 boutons : "Voir mes projets" et "Me contacter" ;
- eventuellement une photo sobre ou un visuel lie a tes projets.

### Projets detailles

Chaque carte projet peut contenir :

- titre ;
- courte description ;
- stack technique ;
- probleme traite ;
- resultat obtenu ;
- lien vers le repo ;
- lien vers une demo si disponible.

Exemple :

```txt
Circle-Seeker-RL
Environnement de reinforcement learning en Python avec pygame, controle manuel,
baseline aleatoire, tests et CI.
Stack : Python, NumPy, pygame, Gymnasium, pytest, GitHub Actions.
```

### Competences

Une section simple suffit :

- Python ;
- JavaScript / React ;
- IA / reinforcement learning ;
- simulation ;
- outils systeme ;
- Git / GitHub ;
- tests et CI.

Eviter les barres de progression du type "Python 90%". Elles sont souvent peu
informatives. Preferer des competences reliees a des projets reels.

### Timeline

Une courte chronologie peut aider :

- projets personnels importants ;
- experiences ;
- formations ;
- collaborations ;
- concours, hackathons ou projets d'ecole.

### Blog ou notes techniques

Pas obligatoire au debut, mais tres utile plus tard. Quelques idees :

- "Comment j'ai construit un environnement RL simple" ;
- "Pourquoi j'utilise NumPy avant d'utiliser un framework plus lourd" ;
- "Ce que j'ai appris en construisant syswatch" ;
- "Experimentations avec agents IA et jeux".

Un petit blog technique donne beaucoup de credibilite si les articles sont
concrets et courts.

## Conseils design

- Garder une page claire, lisible et rapide.
- Utiliser beaucoup d'espace blanc.
- Limiter le nombre de couleurs.
- Choisir une typographie propre et moderne.
- Ajouter des captures d'ecran de projets des que possible.
- Ne pas surcharger avec des animations au debut.
- Faire une version mobile correcte des le depart.

Le style peut rester sobre. Le plus important est que les projets soient
comprehensibles et que les liens fonctionnent.

## Conseils contenu

- Ecrire en francais si la cible est locale, en anglais si la cible est
  internationale. Une version bilingue peut venir plus tard.
- Eviter les descriptions vagues comme "projet IA". Dire concretement ce que le
  projet fait.
- Pour chaque projet, expliquer le probleme, l'approche et le resultat.
- Mettre les projets les plus forts en premier.
- Ajouter une phrase sur ce que tu cherches actuellement.

## Conseils techniques

- Garder `index.html` simple tant que le site est petit.
- Extraire le CSS dans `style.css` quand le fichier devient trop long.
- Ajouter un dossier `assets/` pour les images et le CV.
- Optimiser les images avant de les publier.
- Ajouter les balises SEO de base :
  - `meta description` ;
  - titre de page clair ;
  - Open Graph pour le partage LinkedIn/GitHub.
- Verifier regulierement le rendu mobile.

## Prochaines etapes recommandees

1. Ajouter une phrase de positionnement plus forte dans le hero.
2. Ajouter LinkedIn, email et CV.
3. Ameliorer les cartes projets avec stack technique et liens.
4. Ajouter une capture pour au moins un projet.
5. Extraire le CSS dans `style.css`.
6. Ajouter une `meta description`.
7. Faire une deuxieme passe design une fois le contenu stabilise.

## Checklist de qualite

- Le site charge correctement sur mobile.
- Les liens GitHub fonctionnent.
- La page explique clairement qui tu es.
- Les projets selectionnes montrent tes meilleures competences.
- Le contact est visible sans scroller trop longtemps.
- Le site reste simple et rapide.
