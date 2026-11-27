# AGENTS.md — Règles communes à tous les agents (Claude, ChatGPT, autres)

Ce fichier est **la source unique de vérité** pour tout agent qui travaille sur ce dépôt.
`CLAUDE.md` ne fait que l'importer. Toute règle nouvelle s'ajoute **ici**, jamais ailleurs.

## 1. Le projet

Viveplume contient l'univers **Vivelande** :
- `bible/` — la bible de l'univers : **référence canonique**.
- `romans/<slug>/` — un dossier par roman : `vivencre`, `vivepierre`, `vivebrume`, `vivebraise`.
- `app/` — la liseuse (site web installable, lisible sur tout support).
- `outils/` — scripts de vérification.
- `suivi/` — journal des sessions (`suivi/journal/`, un fichier par session) et questions ouvertes.

## 2. Hiérarchie du canon

En cas de contradiction, l'ordre de priorité est :
1. Les décisions de l'auteur notées dans `bible/canon.md` (section « Décisions »).
2. Les fiches de `bible/`.
3. Les chapitres au statut `final`.
4. Tout le reste (brouillons, notes, plans).

Un agent **ne tranche jamais seul** une contradiction : il l'inscrit dans
`suivi/questions-ouvertes.md` et le signale dans sa réponse.

## 3. Avant d'écrire

1. Lire `bible/canon.md`, `bible/style.md` et `suivi/questions-ouvertes.md`.
2. Lire `romans/<slug>/plan.md` et les chapitres qui précèdent celui à écrire.
3. Lire les fiches de la bible des personnages, lieux et factions concernés.

## 4. Pendant l'écriture

- Un fait nouveau (personnage, lieu, date, règle de magie…) inventé dans un chapitre
  **doit être ajouté à la bible dans le même commit / la même PR**.
- Respecter les modèles : `bible/*/_modele.md` et `romans/*/chapitres/00-modele.md`.
- Ne jamais modifier un chapitre au statut `final` sans demande explicite de l'auteur.
- Ne pas réécrire le travail de l'autre agent en dehors de la tâche demandée :
  proposer les changements dans la PR ou dans `suivi/questions-ouvertes.md`.

## 5. Conventions de fichiers

- Noms de fichiers : minuscules, sans accents, mots séparés par `-`
  (ex. `romans/vivencre/chapitres/03-la-forge-noire.md`, `bible/personnages/aldric-ferrand.md`).
- Chapitres : `NN-titre.md` (numéro sur 2 chiffres), avec l'en-tête YAML du modèle.
- Liens internes en chemins relatifs (`../../bible/lieux/xxx.md`).
- Texte en français, typographie française (espaces insécables avant `: ; ! ?`,
  guillemets « », tiret cadratin — pour les dialogues).

## 6. Illustrations

- Format **WebP** (ou JPEG/PNG si nécessaire), **1 Mo maximum**, 2000 px max sur le grand côté.
- Illustrations d'un roman : `romans/<slug>/illustrations/` ; communes (cartes, blasons,
  portraits) : `bible/illustrations/`.
- Nom : `chNN-sujet.webp` pour un chapitre, `couverture.webp` pour la couverture.
- Chaque image est déclarée dans `illustrations/CREDITS.md` du dossier (auteur, outil, licence).
- Insertion dans le texte : `![Légende](../illustrations/ch03-forge.webp)`.

## 7. Git et coordination entre agents

- **Jamais de commit direct sur `main`.** Une branche par tâche :
  - Claude : `claude/<sujet>` ; ChatGPT / Codex : `chatgpt/<sujet>` ou `codex/<sujet>`.
- Une tâche = une PR, petite et ciblée (un chapitre, une fiche, une fonctionnalité de l'app).
- Avant de commencer : récupérer `main` à jour et vérifier les PR ouvertes ;
  ne pas travailler sur un fichier modifié par une PR ouverte de l'autre agent.
- **Répartition par issues** : chaque tâche est une issue GitHub portant l'étiquette
  `agent:claude` ou `agent:chatgpt`. Un agent ne traite que les issues à son étiquette
  (ou la tâche que l'auteur lui donne directement) et cite l'issue dans sa PR (`Closes #N`).
- **Zones** : deux agents ne travaillent jamais en même temps sur le même chapitre ni sur
  la même fiche de bible. Écrire en parallèle sur deux romans différents est sans risque.
- **Fusion des PR** : une PR d'agent (branche `claude/`, `chatgpt/` ou `codex/`) est
  fusionnée **automatiquement** dès que la vérification passe ; l'agent n'a rien à faire
  de plus. Exceptions, marquées automatiquement de l'étiquette `relecture-auteur` et
  fusionnées par l'auteur seul : changements de `AGENTS.md`, `CLAUDE.md`, `bible/canon.md`,
  `.github/`, `outils/`, et tout chapitre au statut `final` (ou qui y passe).
  Un agent ne retire jamais cette étiquette et ne contourne jamais ce mécanisme.
  Pour que l'auteur relise une PR ordinaire, l'ouvrir en brouillon (draft) ou lui
  ajouter l'étiquette `relecture-auteur`.
- **Fichiers partagés** : la règle « Zones » ne s'applique pas à `suivi/questions-ouvertes.md`,
  `bible/glossaire.md` et `bible/chronologie.md`. On y **ajoute** des lignes sans modifier
  celles des autres ; en cas de conflit Git, garder les lignes des deux côtés.
- Messages de commit : `<zone>(<portée>): <action>`, en français. Zones et portées :
  | Zone | Portée | Exemple |
  |------|--------|---------|
  | `roman` | slug du roman | `roman(vivencre): chapitre 3, premier jet` |
  | `bible` | dossier ou fichier | `bible(lieux): ajoute Brumemont` |
  | `suivi` | `journal` ou `questions` | `suivi(journal): session du 28/11` |
  | `app` | partie de l'app | `app(lecteur): marque-page` |
  | `outils` / `ci` | script ou workflow | `ci(fusion-auto): corrige le commentaire` |
  | `agents` | `regles` | `agents(regles): précise les fichiers partagés` |
- À la fin de chaque session, **créer** un fichier dans `suivi/journal/`
  (`AAAA-MM-JJ-agent-sujet.md`, voir `suivi/journal/README.md`) ; ne jamais modifier
  l'entrée d'une autre session. Ce fichier fait partie de la PR de la tâche.
- Lancer `python3 outils/verifier.py` avant de pousser ; la CI le relance sur chaque PR.

## 8. Environnement

- Aucune dépendance pour le texte : seul Python 3 est nécessaire (`python3 outils/verifier.py`).
- Pas de secret ni de clé dans le dépôt.

## 9. L'application (`app/`)

- Elle lit le contenu **directement** depuis `romans/` et `bible/` : ne jamais copier
  le texte des romans dans `app/`.
- Voir `app/README.md` pour les choix techniques.
