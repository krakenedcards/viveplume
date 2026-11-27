#!/usr/bin/env python3
"""Vérifie la cohérence du dépôt : en-têtes des chapitres, liens d'images, taille des images.

Usage : python3 outils/verifier.py   (code de sortie 1 en cas d'erreur)
"""
import re
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
ROMANS = ["vivencre", "vivepierre", "vivebrume", "vivebraise"]
STATUTS = {"brouillon", "relu", "final", "modele"}
CHAMPS = ["roman", "numero", "titre", "statut"]
TAILLE_MAX = 1_000_000
NOM_CHAPITRE = re.compile(r"^\d{2}-[a-z0-9-]+\.md$")
IMAGE = re.compile(r"!\[[^\]]*\]\(([^)\s]+)")
CODE = re.compile(r"```.*?```|`[^`\n]*`", re.S)

erreurs = []


def en_tete(texte):
    if not texte.startswith("---\n"):
        return None
    fin = texte.find("\n---", 4)
    if fin == -1:
        return None
    champs = {}
    for ligne in texte[4:fin].splitlines():
        if ":" in ligne and not ligne.startswith(" "):
            cle, val = ligne.split(":", 1)
            champs[cle.strip()] = val.split("#", 1)[0].strip().strip('"')
    return champs


for slug in ROMANS:
    dossier = RACINE / "romans" / slug
    if not (dossier / "roman.yaml").exists():
        erreurs.append(f"{slug} : roman.yaml manquant")
    for chap in sorted((dossier / "chapitres").glob("*.md")):
        rel = chap.relative_to(RACINE)
        if not NOM_CHAPITRE.match(chap.name):
            erreurs.append(f"{rel} : nom attendu NN-titre.md (minuscules, sans accents)")
        meta = en_tete(chap.read_text(encoding="utf-8"))
        if meta is None:
            erreurs.append(f"{rel} : en-tête YAML absent")
            continue
        for c in CHAMPS:
            if not meta.get(c):
                erreurs.append(f"{rel} : champ « {c} » manquant")
        if meta.get("roman") and meta["roman"] != slug:
            erreurs.append(f"{rel} : roman « {meta['roman']} » au lieu de « {slug} »")
        if meta.get("statut") and meta["statut"] not in STATUTS:
            erreurs.append(f"{rel} : statut inconnu « {meta['statut']} »")

for md in RACINE.glob("**/*.md"):
    if ".git" in md.parts or "node_modules" in md.parts or md.name.startswith("00-modele"):
        continue
    for lien in IMAGE.findall(CODE.sub("", md.read_text(encoding="utf-8"))):
        if lien.startswith(("http://", "https://")):
            continue
        if not (md.parent / lien).resolve().exists():
            erreurs.append(f"{md.relative_to(RACINE)} : image introuvable {lien}")

for img in list(RACINE.glob("**/illustrations/*")):
    if img.suffix.lower() in {".webp", ".jpg", ".jpeg", ".png"} and img.stat().st_size > TAILLE_MAX:
        erreurs.append(f"{img.relative_to(RACINE)} : image > 1 Mo")

if erreurs:
    print("Erreurs :\n- " + "\n- ".join(erreurs))
    sys.exit(1)
print("OK : dépôt cohérent.")
