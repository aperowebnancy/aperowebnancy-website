# Contribuer au site Apéro Web Nancy

### Sommaire

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Code de conduite](#code-de-conduite)
- [Qu'est ce que je peux faire ?](#quest-ce-que-je-peux-faire-)
  - [Contribuer au contenu](#contribuer-au-contenu)
  - [Contribuer au design](#contribuer-au-design)
  - [Contribuer au code](#contribuer-au-code)
  - [Corriger et signaler des bugs](#corriger-et-signaler-des-bugs)
  - [Suggérer des améliorations ou de nouvelles fonctionnalités](#sugg%C3%A9rer-des-am%C3%A9liorations-ou-de-nouvelles-fonctionnalit%C3%A9s)
- [Travailler sur le projet](#travailler-sur-le-projet)
  - [Prérequis](#pr%C3%A9requis)
  - [Installer le projet](#installer-le-projet)
  - [L'organisation du code](#lorganisation-du-code)
- [Faire une Pull request](#faire-une-pull-request)
  - [Les bonnes pratiques](#les-bonnes-pratiques)
- [Trouver de l'aide](#trouver-de-laide)
  - [Dans une issue](#dans-une-issue)
  - [Au cours d'une pull request](#au-cours-dune-pull-request)
  - [Sur Discord](#sur-discord)
  - [Aux meetups, dans les bars](#aux-meetups-dans-les-bars)
- [Notes additionnelles](#notes-additionnelles)
  - [La Roadmap](#la-roadmap)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Code de conduite

En participant, vous devez respecter le [code de conduite du projet](CODE_OF_CONDUCT.md).

## Qu'est ce que je peux faire ?

Beaucoup de choses, l’écriture de code étant loin d'être le facteur principal de réussite de ce projet.

### Contribuer au contenu

Cela peut être plus simple d'écrire une ligne de code bien interprétée par une machine qu'un texte qui transmet correctement un message à une communauté. Or c'est exactement l'objectif de ce projet. Vous êtes donc les bienvenues pour nous aider à rédiger les contenus des pages **des anciens talk**, de compléter **les fiches des speakers**, d'améliorer **la FAQ** ou encore d'améliorer tout contenu existant.

Vous trouverez plus de détails sur ces besoins dans les issues taguées [`content`](https://github.com/aperowebnancy/aperowebnancy-website/labels/content).

Plus globalement, tout le contenu qui n'est pas du code mérite certainement votre attention. Par exemple, vous aurez peut-être identifié des phrases à rallonge, des fautes d'orthographe ou de grammaire sur cette page "guide de contribution" ? Si c'est le cas, n'hésitez pas à faire une petite pull request avec vos corrections.

### Contribuer au design

Concernant le design, tout reste à faire. Nous nous sommes inspiré de plusieurs Meetups existant, mais si vous avez de meilleures idées, n'hésitez pas.

Bien que nous ayons déjà un logo, il ne demande qu'à évoluer.

![Apéro Web Logo](logo.png)

Cela peut-être une occasion de collaboration entre développeurs/intégrateur/designer/ergonome...

Les issues concernant le design sont associées au tag [`design`](https://github.com/aperowebnancy/aperowebnancy-website/labels/design).

### Contribuer au code

Le site repose sur [Next.js](https://nextjs.org/). Cela va donc impliquer pour participer au code de faire du [Javascript](https://developer.mozilla.org/fr/docs/Web/JavaScript), et plus particulièrement du [React](https://reactjs.org/). Nous utilisons également [MDX](https://mdxjs.com/) pour le contenu, et [Tailwindcss](https://tailwindcss.com/) pour le style.

Et si vraiment vous détestez le Javascript, il y aurait sûrement moyen de mettre en place quelques services en mode serverless avec du Rust, du Go ... ou ce que vous voulez en fait du moment que cela fait le job.

### Corriger et signaler des bugs

Les issues concernant les bugs sont associées au tag [`bug`](https://github.com/aperowebnancy/aperowebnancy-website/labels/bug).

Il parait que chaque bug signalé sauve un chaton. Donc, si à chaque bug rencontré quelqu'un [ouvre une issue](https://github.com/aperowebnancy/aperowebnancy-website/issues/new?assignees=&labels=&template=bug_report.md&title=) avec le label `bug`, ce seront des familles entières de chats qui seront sauvés.

### Suggérer des améliorations ou de nouvelles fonctionnalités

Les fonctionnalités imaginées pour atteindre les différents objectifs sont présentes dans les [issues](https://github.com/aperowebnancy/aperowebnancy-website/issues).

Elles vous semblent inabouties ou insuffisantes ? Dans ce cas, [ouvrez une nouvelle issue](https://github.com/aperowebnancy/aperowebnancy-website/issues/new?assignees=&labels=&template=feature_request.md&title=) de type `feature` en décrivant bien votre idée.

## Travailler sur le projet

Quel que soit votre type d'implication, c'est toujours une bonne chose que d'installer le projet sur votre machine pour pouvoir visualiser votre contribution avant de la proposer sur Github.

### Prérequis

Tout d'abord vous devez avoir un compte GitHub ainsi que [git installé](https://docs.github.com/en/github/getting-started-with-github/set-up-git) sur votre ordinateur.
Ensuite vous devez ["_forker_"](https://guides.github.com/activities/forking/) le dépôt du projet et le cloner localement.
En parallèle, pensez à installer [Node.js](https://nodejs.org/en/download/) en version 12.18.3 (LTS) sur votre ordinateur. Node est un environnement d'exécution JavaScript (comme l'est un navigateur).

### Installer le projet

La première chose à faire est d'installer les dépendances :

```bash
yarn
```

Ensuite, voici la principale commande à connaître :

```bash
yarn dev
```

Le projet est maintenant lancé en mode développement et vous pouvez voir le site à l'adresse [http://localhost:3000](http://localhost:3000). Chaque modification effectuée dans le code sera immédiatement impactée dans votre navigateur, sans besoin de recharger la page.

### L'organisation du code

Voici l'organisation des principaux répertoires du projet :

-   **.github** : On trouve ici les fichiers d'aide sur le projet et les templates pour Github.
-   **components** : On trouve ici tous les composants utilisés par les pages.
-   **lib** : On trouve ici tous les fichiers n'étant ni des composants ni des pages.
-   **pages** : On trouve ici toutes les pages du site.
-   **public** : Vous y trouverez les fichiers statiques finaux tels qu'ils seront mis en ligne.
-   **speakers** : On trouve ici les profils des speakers.
-   **styles** : On trouve ici les fichiers propres au styles.
-   **talks** : On trouve ici les différents talks.

## Faire une Pull request

Si vous n'avez encore jamais fait de Pull Request (PR), la lecture du tutorial Github [Understanding the GitHub Flow](https://guides.github.com/introduction/flow/) est un très bon point de départ.

Si vous n'aviez pas encore de compte Github, en voici une [bonne introduction](https://flaviocopes.com/github-guide/).

### Les bonnes pratiques

La seule bonne pratique, c'est de **faire des PR**.

Mais voici quelques conseils qui peuvent les rendre encore meilleures :

-   Faites des commits [courts et bien commentés](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
-   Faites des [PR courtes](https://dev.to/bosepchuk/optimal-pull-request-size-600), toute une tache (une issue) n'a pas forcement besoin d'être adressée dans une seule PR.
-   Faites référence à l'issue que la PR adresse.
-   N'hésitez pas à joindre des captures d'écran, fixes ou animées.
-   Ajoutez une description et une _todo list_ en ouvrant la PR.
-   N'attendez pas que la PR soit terminée pour l'ouvrir : la communauté viendra plus facilement en aide en découvrant tôt la PR.
-   Utilisez les labels `WIP` (Work In Progress) et `RFR` (Ready For Review) pour indiquer l'avancement de la PR.
-   Dernier point : généralement, tous les _textes_ (titres, descriptions, commentaires ...) sont écrits en anglais. Cependant, ce projet ne concernant que Nancy, tout y est en français.

## Trouver de l'aide

### Dans une issue

Le [système d'issues du Github](https://guides.github.com/features/issues/) est très bien pensé et permet de facilement réagir, commenter, noter... Donc si une issue vous intéresse mais qu'elle ne vous semble pas claire, n'hésitez pas à poser vos questions directement dans l'issue en question.

### Au cours d'une pull request

Si vous avez commencé une PR, mais que vous êtes bloqué, vous pouvez laisser un commentaire dessus décrivant votre problème et ajouter le label `help wanted`.

### Sur Discord

Il existe un channel **aperoweb-site-web** sur le [Discord](https://discord.com/invite/Q8X8Bxq). N'hésitez pas à y poser vos questions.

### Aux meetups, dans les bars

Les Apéro Web Nancy, c'est avant tout des rencontres. Venez donc chaque dernier mercredi du mois aux éditions des Apéro Web Nancy, ce sera l'occasion de poser toutes vos questions sur ce projet de refonte.

Et Nancy regorge d'autres rencontres susceptibles d'aider au projet : AFUP Lorraine, Google Atelier Nancy.

## Notes additionnelles

### La Roadmap

Ce projet est un projet uniquement lié aux bonnes volontés. Nous avons un travail à côté et il n'est donc pas question de mettre en place un Roadmap.
