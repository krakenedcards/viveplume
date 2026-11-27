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
