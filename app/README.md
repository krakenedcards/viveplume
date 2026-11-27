# Liseuse Vivelande

Objectif : lire les romans illustrés et consulter la bible sur téléphone, tablette et ordinateur,
y compris hors-ligne.

## Choix proposé
- **Site statique installable (PWA)** généré à partir des Markdown de `romans/` et `bible/`,
  par exemple avec **Astro** (collections de contenu, images optimisées automatiquement).
- **Hébergement GitHub Pages**, déployé automatiquement à chaque fusion sur `main`.
- Fonctions : sommaire par roman, lecture chapitre par chapitre, marque-page et progression
  (stockés sur l'appareil), taille de police, mode sombre, consultation de la bible.
- Plus tard : export **EPUB/PDF** par roman (Pandoc dans la CI) pour les liseuses.

Le texte n'est jamais copié ici : l'application lit `../romans` et `../bible`.
Seuls les chapitres au statut `relu` ou `final` sont publiés.

## Décisions techniques

La construction utilise Astro 5 et Node 24. Depuis app/, lancer `npm ci`, `npm test` puis `npm run build`. Le site est généré dans dist/ pour /viveplume/. Utiliser `VIVELANDE_FIXTURES=1 npm run build` pour les données fictives.

Les chargeurs des collections parcourent les sources au moyen du glob natif de Node. Le filtrage précède le rendu Markdown pour que les modèles et leurs images d’exemple ne soient jamais publiés. Les couvertures sont converties en WebP pendant la construction. Un cartonnage typographique remplace une couverture absente. Les romans sans ordre explicite suivent les romans numérotés, par titre français.

Les routes de chapitre conservent le chemin source, sans extension. Le numéro YAML ordonne le sommaire et les liens précédent/suivant. Markdown-it rend les illustrations et leur légende et désactive le HTML brut.

La progression par roman combine le rang du chapitre et la fraction parcourue. Le sommaire propose la dernière position et un marque-page explicite indépendant. Les données restent dans le navigateur et la lecture fonctionne aussi lorsque le stockage est refusé.
