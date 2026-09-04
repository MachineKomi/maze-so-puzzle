"""Publish the Human-approved mgjrpg-02 static-art catalogue deterministically.

This module is intentionally data driven.  ``SPECS`` is the semantic authority:
run IDs are mapped explicitly to stable catalogue identities, never inferred from
filenames.  Batch ledgers remain immutable generation history.  The forward-only
v06 decision, strict-v2 source records, runtime derivatives, catalogue projection,
and publication report are generated from that explicit map.

Commands:

``--plan``
    Write the v06 Human publication decision and exact source-to-runtime plan.
``--publish``
    Build no-overwrite runtime files and strict-v2 records, then write reports.
``--check``
    Rebuild every derivative in a temporary directory and byte-compare it with
    the checked-in runtime output; validate hashes, geometry, alpha and seams.

No command deletes, moves, or overwrites an existing runtime asset.
"""

from __future__ import annotations

import argparse
import json
import re
import tempfile
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from PIL import Image

from builder import _publish_without_overwrite, _validate_mgjrpg02_staged_pixels, alpha_bounds
from cutout import (
    alpha_component_sizes,
    dilate_hidden_rgb,
    normalize_to_srgb_rgba,
    register_cutout,
    remove_small_alpha_components,
)
from encode import save_image
from mgjrpg02_batch01 import (
    clear_low_alpha,
    estimate_uniform_matte,
    extract_uniform_matte,
    normalize_visible_black,
)
from model import (
    MGJRPG_02_RECIPE_ID,
    ROOT,
    image_facts,
    posix_relative,
    read_json,
    sha256_file,
    validate_record_shape,
)
from periodic import make_periodic, seam_metrics


PUBLICATION_ID = "mgjrpg-02-plan03-publication-v01"
DERIVATIVE_RECIPE = "mgjrpg-02-runtime-derivative-r01"
DECISION_PATH = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v06/human-decision.json"
RIGHTS_PATH = ROOT / "docs/source-assets/reviews/mgjrpg-02-rights-provenance-v01.json"
MAP_PATH = ROOT / "docs/source-assets/publication/mgjrpg-02-plan03-runtime-map.json"
REPORT_PATH = ROOT / "docs/source-assets/publication/mgjrpg-02-plan03-publication-report.json"
TS_PATH = ROOT / "src/generated/mgjrpg02Art.ts"
RECORD_ROOT = ROOT / "docs/source-assets/records"
PRODUCTION_ROOT = ROOT / "docs/source-assets/production/mgjrpg-02"
RECIPE_PATH = ROOT / "docs/source-assets/recipes/mgjrpg-02.json"
CANARY_PATH = ROOT / "docs/source-assets/reviews/mgjrpg-02-canary-v01.json"
V05_DECISION_PATH = ROOT / "docs/source-assets/calibrations/mgjrpg-02/v05/human-decision.json"
INK_RGB = (0x34, 0x20, 0x3F)

# Measured on the registered 256 px approved derivatives at alpha >= 16. The
# grip is the centre of the intended hand-wrap region (not the pommel) and the
# axis points from grip toward the active end. Held scale is relative to Ame's
# registered square canvas. It normalizes the median active-end reach of the
# former 0.63-canvas presentation, then caps the rotated extent to a 2% tile
# border in the widest 0.94-canvas presentation. Rotation brings each approved
# construction to the -55 degree held-family axis. The ring blade is deliberately
# behind Ame so its closed loop cannot cross both eyes. These are registration
# metadata only; approved pixels are not edited.
WEAPON_GEOMETRY: dict[str, dict[str, Any]] = {
    "star-sword": {"gripPoint": [0.344, 0.730], "forwardAxisDegrees": -50.0, "heldScale": 0.637, "heldRotationDegrees": -5.0, "zOrder": 3},
    "flower-sabre": {"gripPoint": [0.262, 0.809], "forwardAxisDegrees": -48.0, "heldScale": 0.546, "heldRotationDegrees": -7.0, "zOrder": 3},
    "moon-wand": {"gripPoint": [0.336, 0.773], "forwardAxisDegrees": -64.0, "heldScale": 0.678, "heldRotationDegrees": 9.0, "zOrder": 3},
    "leaf-blade": {"gripPoint": [0.340, 0.758], "forwardAxisDegrees": -46.0, "heldScale": 0.624, "heldRotationDegrees": -9.0, "zOrder": 3},
    "sun-mallet": {"gripPoint": [0.336, 0.789], "forwardAxisDegrees": -62.0, "heldScale": 0.570, "heldRotationDegrees": 7.0, "zOrder": 3},
    "comet-spear": {"gripPoint": [0.320, 0.809], "forwardAxisDegrees": -54.0, "heldScale": 0.583, "heldRotationDegrees": -1.0, "zOrder": 3},
    "bubble-ring-blade": {"gripPoint": [0.500, 0.836], "forwardAxisDegrees": -90.0, "heldScale": 0.576, "heldRotationDegrees": 35.0, "zOrder": 1},
    "cupcake-mace": {"gripPoint": [0.324, 0.809], "forwardAxisDegrees": -52.0, "heldScale": 0.610, "heldRotationDegrees": -3.0, "zOrder": 3},
}

# Pixel-snapped anchors measured on registered derivatives at alpha > 3. Boxes
# use normalized [x, y, width, height]. Hand-traced motif/aperture boxes enclose
# the complete semantic mark including its contour/glow, not adjacent hardware.
CAGE_GEOMETRY: dict[str, dict[str, Any]] = {
    "golden-heart": {"baseline": 0.94140625, "openBay": [0.15234375, 0.18359375, 0.6953125, 0.6171875], "motifBox": [0.39453125, 0.74609375, 0.21484375, 0.1953125]},
    "storybook-wood": {"baseline": 0.94140625, "openBay": [0.1953125, 0.19140625, 0.61328125, 0.57421875], "motifBox": [0.38671875, 0.7578125, 0.23046875, 0.18359375]},
    "moon-silver": {"baseline": 0.94140625, "openBay": [0.15625, 0.171875, 0.6875, 0.578125], "motifBox": [0.39453125, 0.69921875, 0.2109375, 0.23828125]},
    "garden-vine": {"baseline": 0.94140625, "openBay": [0.19140625, 0.16796875, 0.62109375, 0.578125], "motifBox": [0.3984375, 0.7421875, 0.20703125, 0.171875]},
}

DOOR_GEOMETRY: dict[str, dict[str, Any]] = {
    "door-rose-heart": {"baseline": 0.94140625, "motifBox": [0.3515625, 0.3671875, 0.296875, 0.3046875]},
    "door-blue-star": {"baseline": 0.94140625, "motifBox": [0.33203125, 0.3671875, 0.34375, 0.33203125]},
    "door-sunny-sun": {"baseline": 0.94140625, "motifBox": [0.328125, 0.3671875, 0.34765625, 0.33984375]},
}

PORTAL_GEOMETRY: dict[str, dict[str, Any]] = {
    "rose-heart": {"apertureBox": [0.296875, 0.3671875, 0.41015625, 0.3515625], "motifBox": [0.34765625, 0.42578125, 0.30859375, 0.2421875], "tileFootprint": [0.0, 0.0, 1.0, 1.0]},
    "mint-clover": {"apertureBox": [0.29296875, 0.36328125, 0.4140625, 0.34375], "motifBox": [0.35546875, 0.36328125, 0.3046875, 0.328125], "tileFootprint": [0.0, 0.0, 1.0, 1.0]},
    "sunny-diamond": {"apertureBox": [0.2890625, 0.3359375, 0.42578125, 0.38671875], "motifBox": [0.38671875, 0.3828125, 0.23046875, 0.2734375], "tileFootprint": [0.0, 0.0, 1.0, 1.0]},
    "violet-spade-bloom": {"apertureBox": [0.2890625, 0.359375, 0.42578125, 0.359375], "motifBox": [0.3203125, 0.36328125, 0.359375, 0.3515625], "tileFootprint": [0.0, 0.0, 1.0, 1.0]},
    "goal": {"apertureBox": [0.1875, 0.171875, 0.625, 0.61328125], "motifBox": [0.4375, 0.45703125, 0.1328125, 0.1328125]},
}

HAZARD_GEOMETRY: dict[str, dict[str, Any]] = {
    "ground-hole": {"rimBox": [0.06640625, 0.078125, 0.8671875, 0.84375], "voidBox": [0.296875, 0.3359375, 0.4296875, 0.4140625], "tileFootprint": [0.0, 0.0, 1.0, 1.0]},
    "floor-spikes-overlay": {"tileFootprint": [0.0, 0.0, 1.0, 1.0]},
}

MIMIC_GEOMETRY: dict[str, dict[str, Any]] = {
    "classic-mimic-revealed": {"class": "item", "pivot": [0.5, 0.921875], "baseline": 0.921875, "stateFamilyId": "classic-mimic", "stateAnchorBox": [0.078125, 0.078125, 0.84375, 0.84375]},
    "classic-mimic-closed": {"class": "item", "pivot": [0.5, 0.921875], "baseline": 0.921875, "stateFamilyId": "classic-mimic", "stateAnchorBox": [0.078125, 0.078125, 0.84375, 0.84375]},
    "classic-mimic-good-open": {"class": "item", "pivot": [0.5, 0.921875], "baseline": 0.921875, "stateFamilyId": "classic-mimic", "stateAnchorBox": [0.078125, 0.078125, 0.84375, 0.84375]},
    "candy-mimic": {"class": "item", "pivot": [0.5, 0.94140625], "baseline": 0.94140625, "stateFamilyId": "candy-mimic", "stateAnchorBox": [0.0703125, 0.05859375, 0.859375, 0.8828125]},
    "candy-mimic-closed": {"class": "item", "pivot": [0.5, 0.94140625], "baseline": 0.94140625, "stateFamilyId": "candy-mimic", "stateAnchorBox": [0.0703125, 0.05859375, 0.859375, 0.8828125]},
    "candy-mimic-good-open": {"class": "item", "pivot": [0.5, 0.94140625], "baseline": 0.94140625, "stateFamilyId": "candy-mimic", "stateAnchorBox": [0.0703125, 0.05859375, 0.859375, 0.8828125]},
}

# These approved silhouettes visibly hover rather than meet a semantic foot
# contact. Reclassification changes metadata only; their locked registration
# and pixels remain untouched. The float centre is measured from final alpha.
FLOATING_ACTOR_IDS = {
    "moon-bat", "cloud-gremlin", "pitter-patter-parasol", "lanternling",
    "tessera-dolphin", "mallowmusk-aroma-wisp", "breezeling-sylph",
    "tidecurl-hippocamp",
}

EARLY_APPROVED_RUNS = {
    "batch-01-ame-matte-02", "batch-01-classic-slime-matte-02",
    "batch-01-wholesome-succubus-matte-02", "batch-01-kappa-matte-02",
    "batch-01-cyclops-matte-01", "batch-01-treasure-mimic-matte-02",
    "batch-01-r02-lamia-matte-01", "batch-01-r02-soda-slime-matte-01",
    "batch-01-r02-minotaur-matte-01",
}
POST_V05_APPROVED_RUNS = {
    "batch-19-clover-v04", "batch-19-spade-bloom-v02",
    "batch-20-jelly-sorcerer-v02", "batch-20-power-potion-v02",
    "batch-20-goal-v02", "batch-20-ame-portrait-v02",
    "batch-22-reward-trail-sticker-v03",
    "batch-22-reward-animal-friend-sticker-v03-b",
    "batch-22-reward-surprise-sparkle-sticker-v03",
    "batch-22-reward-helping-paw-medal-v03",
    "batch-22-reward-rainbow-rescue-medal-v03",
    "batch-22-reward-golden-guardian-medal-v03-b",
    "batch-22-badge-pathfinder-v02", "batch-22-badge-maze-mapper-v02",
    "batch-22-badge-grand-explorer-v02", "batch-22-badge-surprise-scout-v02",
    "batch-22-badge-mighty-adventurer-v02", "batch-22-badge-twinkle-toes-v02",
    "batch-22-badge-bunny-buddy-v02", "batch-22-badge-fox-friend-v02",
    "batch-22-badge-kitten-pal-v02",
}
EXPLICITLY_DEFERRED_RUNS = {"batch-13-app-icon-ame-v03"}


@dataclass(frozen=True)
class Spec:
    run_id: str
    stable_id: str
    label: str
    family: str
    runtime_status: str
    catalogue_target: str
    profile: str
    previous_path: str | None = None
    note: str = ""
    art_version: int | None = None


SPECS: list[Spec] = []


def add(
    run_id: str,
    stable_id: str,
    label: str,
    family: str,
    runtime_status: str,
    catalogue_target: str,
    profile: str,
    previous_path: str | None = None,
    note: str = "",
    art_version: int | None = None,
) -> None:
    SPECS.append(Spec(
        run_id, stable_id, label, family, runtime_status, catalogue_target,
        profile, previous_path, note, art_version,
    ))


# Character and portrait.
add("batch-01-ame-matte-02", "ame", "Ame", "character", "active", "AME_ART", "character-field-512", "/assets/ame.png", art_version=2)
add("batch-20-ame-portrait-v02", "ame-portrait", "Ame portrait", "story", "active", "ASSETS.portrait", "story-portrait-512", "/assets/ame-portrait.png")

# Current animal-friend catalogue.  The five edge-refined selections deliberately
# replace their earlier approved studies; those studies remain immutable history.
for run_id, stable_id, label, previous in (
    ("batch-03-bunny-a", "bunny", "Bunny", "/assets/animal-bunny.png"),
    ("batch-03-fox-a", "fox", "Fox", "/assets/animal-fox.png"),
    ("batch-03-kitten-a", "kitten", "Kitten", "/assets/animal-kitten.png"),
    ("batch-03-puppy-b", "puppy", "Puppy", "/assets/animal-puppy-v1.png"),
    ("batch-03-duckling-a", "duckling", "Duckling", "/assets/animal-duckling-v1.png"),
    ("batch-03-hedgehog-b", "hedgehog", "Hedgehog", "/assets/animal-hedgehog-v1.png"),
    ("batch-03-otter-a", "otter", "Otter", "/assets/animal-otter-v1.png"),
    ("batch-03-lamb-a", "lamb", "Lamb", "/assets/animal-lamb-v1.png"),
    ("batch-03-alpaca-a", "alpaca", "Alpaca", "/assets/animal-alpaca-v1.webp"),
    ("batch-03-penguin-a", "penguin", "Penguin", "/assets/animal-penguin-v1.webp"),
    ("batch-14-fawn-edge-v03", "fawn", "Fawn", "/assets/animal-fawn-v1.png"),
    ("batch-14-red-panda-edge-v03", "red-panda", "Red Panda", "/assets/animal-red-panda-v1.png"),
    ("batch-14-capybara-edge-v03", "capybara", "Capybara", "/assets/animal-capybara-v1.png"),
    ("batch-14-chinchilla-edge-v03", "chinchilla", "Chinchilla", "/assets/animal-chinchilla-v1.webp"),
    ("batch-14-koala-edge-v03", "koala", "Koala", "/assets/animal-koala-v1.webp"),
):
    add(run_id, stable_id, label, "friend", "active", f"ANIMAL_ART.{stable_id}", "friend-field-256", previous)

# Formally catalogued future rescue friends.  No placement or mechanics are added.
for run_id, stable_id, label in (
    ("batch-04-pitter-patter-parasol-a", "pitter-patter-parasol", "Pitter-Patter Parasol"),
    ("batch-04-lanternling-a", "lanternling", "Lanternling"),
    ("batch-04-emberdown-phoenix-a", "emberdown-phoenix", "Emberdown Phoenix"),
    ("batch-04-meadowstep-faunling-a", "meadowstep-faunling", "Meadowstep Faunling"),
    ("batch-04-minerva-moon-owl-a", "minerva-moon-owl", "Minerva Moon Owl"),
    ("batch-04-tessera-dolphin-a", "tessera-dolphin", "Tessera Dolphin"),
    ("batch-14-mallowmusk-edge-v02", "mallowmusk-aroma-wisp", "Mallowmusk Aroma Wisp"),
    ("batch-14-breezeling-edge-v02", "breezeling-sylph", "Breezeling Sylph"),
    ("batch-14-griffin-edge-v02", "griffin-cub", "Griffin Cub"),
    ("batch-14-dragonling-edge-v02", "emberbelly-dragonling", "Emberbelly Dragonling"),
    ("batch-14-pegasus-edge-v02", "cloudstep-pegasus", "Cloudstep Pegasus"),
    ("batch-14-cerberus-edge-v02", "three-tumble-cerberus", "Three-Tumble Cerberus"),
    ("batch-14-sphinx-edge-v02", "riddlekit-sphinx", "Riddlekit Sphinx"),
    ("batch-14-hippocamp-edge-v02", "tidecurl-hippocamp", "Tidecurl Hippocamp"),
    ("batch-14-kappa-v02", "ripplecap-kappa", "Ripplecap Kappa"),
    ("batch-14-unicorn-v01", "rainbow-horn-unicorn", "Rainbow-Horn Unicorn"),
    ("batch-12-tea-skeleton-v03", "green-tea-skeleton", "Tea-Time Skeleton",),
):
    add(run_id, stable_id, label, "friend", "dormant", f"FUTURE_FRIEND_ART.{stable_id}", "friend-field-256", note="Catalogue-only rescue friend; never an enemy.")

# Current enemies. Goblin is deliberately retained and therefore has no new run.
for run_id, stable_id, label, previous in (
    ("batch-12-blueberry-slime-v03", "blueberry-slime", "Blueberry Slime", "/assets/enemy-blueberry-slime-v1.png"),
    ("batch-17-mushroom-imp", "mushroom-imp", "Mushroom Imp", "/assets/enemy-mushroom-imp-v1.png"),
    ("batch-17-moon-bat", "moon-bat", "Moon Bat", "/assets/enemy-moon-bat-v1.png"),
    ("batch-08-pebble-golem-a", "pebble-golem", "Pebble Golem", "/assets/enemy-pebble-golem-v1.png"),
    ("batch-17-acorn-knight", "acorn-knight", "Acorn Knight", "/assets/enemy-acorn-knight-v1.png"),
    ("batch-17-bubble-dragon", "bubble-dragon", "Bubble Dragon", "/assets/enemy-bubble-dragon-v1.png"),
    ("batch-08-candy-mimic-a", "candy-mimic", "Candy Mimic", "/assets/enemy-candy-mimic-v1.png"),
    ("batch-08-cloud-gremlin-a", "cloud-gremlin", "Cloud Gremlin", "/assets/enemy-cloud-gremlin-v1.webp"),
    ("batch-17-pumpkin-sprite", "pumpkin-sprite", "Pumpkin Sprite", "/assets/enemy-pumpkin-sprite-v1.webp"),
    ("batch-17-clockwork-crab", "clockwork-crab", "Clockwork Crab", "/assets/enemy-clockwork-crab-v1.webp"),
    ("batch-20-jelly-sorcerer-v02", "jelly-sorcerer", "Jelly Sorcerer", "/assets/enemy-jelly-sorcerer-v1.webp"),
):
    add(run_id, stable_id, label, "enemy", "active", f"ENEMY_ART.{stable_id}", "enemy-field-256", previous)

for run_id, stable_id, label, note in (
    ("batch-01-classic-slime-matte-02", "classic-slime", "Classic Slime", ""),
    ("batch-01-wholesome-succubus-matte-02", "succubus", "Wholesome Succubus", "Public-facing name requires Plan 09/Human rating review; modest child-safe construction is locked."),
    ("batch-01-kappa-matte-02", "kappa", "Kappa", "Enemy identity is distinct from the Ripplecap Kappa rescue friend."),
    ("batch-01-cyclops-matte-01", "cyclops", "Cyclops", ""),
    ("batch-01-r02-lamia-matte-01", "lamia", "Lamia", ""),
    ("batch-01-r02-soda-slime-matte-01", "soda-slime", "Soda Slime", ""),
    ("batch-01-r02-minotaur-matte-01", "minotaur", "Minotaur", ""),
    ("batch-12-lizard-sword-v03", "lizard-swordsman", "Lizard Sword Guard", ""),
    ("batch-12-lizard-spear-v03", "lizard-spearman", "Lizard Spear Guard", ""),
    ("batch-12-pocket-trex-v03", "t-rex", "Pocket T-Rex", ""),
    ("batch-12-orc-v03", "orc-chieftain", "Orc Chieftain", ""),
    ("batch-12-warrior-skeleton-v03", "warrior-skeleton", "Warrior Skeleton", ""),
    ("batch-12-cultist-v03", "cultist", "Public label pending", "Internal fantasy identity only; public label requires Plan 09/Human rating review."),
):
    add(run_id, stable_id, label, "enemy", "dormant", f"FUTURE_ENEMY_ART.{stable_id}", "enemy-field-256", note=note)

# Weapon family.  The ring blade replaces the semantic Bubble Bow identity.
for run_id, stable_id, label, previous in (
    ("batch-05-star-sword-a", "star-sword", "Star Sword", "/assets/sword.png"),
    ("batch-05-flower-sabre-a", "flower-sabre", "Flower Sabre", "/assets/weapon-flower-sabre-v1.png"),
    ("batch-05-moon-wand-b", "moon-wand", "Moon Wand", "/assets/weapon-moon-wand-v1.png"),
    ("batch-13-leaf-blade-v03", "leaf-blade", "Leaf Blade", "/assets/weapon-leaf-blade-v1.png"),
    ("batch-05-sun-mallet-a", "sun-mallet", "Sun Mallet", "/assets/weapon-sun-mallet-v1.png"),
    ("batch-05-comet-spear-a", "comet-spear", "Comet Spear", "/assets/weapon-comet-spear-v1.png"),
    ("batch-13-ring-blade-v01", "bubble-ring-blade", "Bubble Ring Blade", "/assets/weapon-bubble-bow-v1.png"),
    ("batch-05-cupcake-mace-a", "cupcake-mace", "Cupcake Mace", "/assets/weapon-cupcake-mace-v1.png"),
):
    add(run_id, stable_id, label, "weapon", "active", f"WEAPON_ART.{stable_id}", "prop-field-256", previous)

# Cages and lock pairs.
for run_id, stable_id, label, previous in (
    ("batch-13-golden-cage-v03", "golden-heart", "Golden Heart Cage", "/assets/cage-golden-heart-front-v5.webp"),
    ("batch-13-wood-cage-v03", "storybook-wood", "Storybook Wooden Cage", "/assets/cage-storybook-wood-front-v5.webp"),
    ("batch-06-moon-silver-b", "moon-silver", "Moon Silver Cage", "/assets/cage-moon-silver-front-v5.webp"),
    ("batch-06-garden-vine-a", "garden-vine", "Garden Vine Cage", "/assets/cage-garden-vine-front-v5.webp"),
):
    add(run_id, stable_id, label, "cage", "active", f"CAGE_ART.{stable_id}", "structure-field-256", previous)

for run_id, stable_id, label, target, previous in (
    ("batch-07-key-rose-heart-a", "key-rose-heart", "Rose Heart Key", "LOCK_PAIR_ART.red.key", "/assets/key-rose-heart-v1.png"),
    ("batch-07-key-blue-star-a", "key-blue-star", "Blue Star Key", "LOCK_PAIR_ART.blue.key", "/assets/star-key.png"),
    ("batch-07-key-sunny-sun-a", "key-sunny-sun", "Sunny Sun Key", "LOCK_PAIR_ART.yellow.key", "/assets/key-sunny-sun-v1.png"),
    ("batch-07-door-rose-heart-b", "door-rose-heart", "Rose Heart Door", "LOCK_PAIR_ART.red.door", "/assets/door-rose-heart-v1.png"),
    ("batch-07-door-blue-star-a", "door-blue-star", "Blue Star Door", "LOCK_PAIR_ART.blue.door", "/assets/star-door.png"),
    ("batch-07-door-sunny-sun-b", "door-sunny-sun", "Sunny Sun Door", "LOCK_PAIR_ART.yellow.door", "/assets/door-sunny-sun-v1.png"),
):
    add(run_id, stable_id, label, "lock", "active", target, "structure-field-256" if stable_id.startswith("door-") else "prop-field-256", previous)

# Flower-pad teleporters. Violet Moon remains the active third gameplay pair;
# Diamond and Spade Bloom are catalogued without inventing level placement.
add("batch-13-portal-heart-v03", "rose-heart", "Rose Heart Portal", "portal", "active", "PORTAL_ART.rose-heart", "structure-field-256", "/assets/portal-rose-heart-v1.png")
add("batch-19-clover-v04", "mint-clover", "Mint Four-Leaf Clover Portal", "portal", "active", "PORTAL_ART.mint-clover", "structure-field-256", "/assets/portal-mint-clover-v1.png")
add("batch-13-portal-diamond-v01", "sunny-diamond", "Sunny Diamond Portal", "portal", "dormant", "FUTURE_PORTAL_ART.sunny-diamond", "structure-field-256")
add("batch-19-spade-bloom-v02", "violet-spade-bloom", "Violet Spade Bloom Portal", "portal", "dormant", "FUTURE_PORTAL_ART.violet-spade-bloom", "structure-field-256", note="Violet Moon remains active until a content-level pair migration is separately authorized.")

# Navigation sticker icons. Muted is a new stateful consumer, not a replacement
# file; app/platform icon art remains source-only for Plan 11.
for run_id, stable_id, label, previous in (
    ("batch-13-nav-home-v03", "nav-home", "Home", "/assets/nav-home-v1.webp"),
    ("batch-02-nav-mazes-v04", "nav-mazes", "Mazes", "/assets/nav-mazes-v1.webp"),
    ("batch-02-nav-book-v02", "nav-book", "Adventure Book", "/assets/nav-book-v1.webp"),
    ("batch-02-nav-help-v02", "nav-help", "Help", "/assets/nav-help-v1.webp"),
    ("batch-02-nav-sound-v03", "nav-sound", "Sound on", "/assets/nav-sound-v1.webp"),
    ("batch-13-nav-muted-v02", "nav-muted", "Sound muted", None),
    ("batch-02-nav-restart-v02", "nav-restart", "Restart", "/assets/nav-restart-v1.webp"),
):
    add(run_id, stable_id, label, "navigation", "active", f"NAVIGATION_ART.{stable_id}", "navigation-optical-128", previous)

# Active pickups, treasures and goal.
for run_id, stable_id, label, target, previous in (
    ("batch-20-power-potion-v02", "power-potion", "Power Potion", "ASSETS.potion", "/assets/potion.png"),
    ("batch-09-spring-boots-a", "spring-boots", "Spring Boots", "ASSETS.springBoots", "/assets/spring-boots-v1.png"),
    ("batch-09-antidote-leaf-a", "antidote-leaf", "Antidote Leaf", "ASSETS.antidoteLeaf", "/assets/antidote-leaf-v1.png"),
    ("batch-09-science-gears-a", "science-gears", "Science Gears", "TREASURE_ART.science-gears", "/assets/treasure-science-gears-v1.webp"),
    ("batch-15-star-chest", "gold-chest", "Open Star Chest", "TREASURE_ART.gold-chest", "/assets/treasure-gold-chest-v1.webp"),
    ("batch-15-star-bag", "gold-bag", "Bag of Gold Stars", "TREASURE_ART.gold-bag", "/assets/coin-pouch.png"),
    ("batch-15-science-beaker", "science-beaker", "Science Beaker", "TREASURE_ART.science-beaker", "/assets/treasure-science-beaker-v1.webp"),
):
    add(run_id, stable_id, label, "item", "active", target, "prop-field-256", previous)
add("batch-20-goal-v02", "goal", "First Star Goal", "portal", "active", "ASSETS.goal", "structure-field-256", "/assets/goal.png")

# Dormant chest states and future pickups. Catalogue presence does not add rules.
for run_id, stable_id, label, target, family in (
    ("batch-01-treasure-mimic-matte-02", "classic-mimic-revealed", "Treasure Mimic — revealed", "MIMIC_ART.classic-mimic.revealed", "enemy"),
    ("batch-15-treasure-mimic-closed", "classic-mimic-closed", "Treasure Mimic — closed", "MIMIC_ART.classic-mimic.closed", "item"),
    ("batch-15-treasure-mimic-stars", "classic-mimic-good-open", "Treasure Mimic — good open", "MIMIC_ART.classic-mimic.good-open", "item"),
    ("batch-15-candy-mimic-closed", "candy-mimic-closed", "Candy Mimic — closed", "MIMIC_ART.candy-mimic.closed", "item"),
    ("batch-15-candy-mimic-stars", "candy-mimic-good-open", "Candy Mimic — good open", "MIMIC_ART.candy-mimic.good-open", "item"),
    ("batch-15-science-magnifier", "science-magnifying-glass", "Science Magnifying Glass", "FUTURE_ITEM_ART.science-magnifying-glass", "item"),
    ("batch-15-science-telescope", "science-telescope", "Science Telescope", "FUTURE_ITEM_ART.science-telescope", "item"),
    ("batch-15-science-book", "science-book", "Science Book", "FUTURE_ITEM_ART.science-book", "item"),
    ("batch-15-ice-skates", "ice-skates", "Ice Skates", "FUTURE_ITEM_ART.ice-skates", "item"),
    ("batch-18-hard-leather-work-boots", "hard-leather-work-boots", "Hard Leather Work Boots", "FUTURE_ITEM_ART.hard-leather-work-boots", "item"),
    ("batch-15-floor-spikes", "floor-spikes-overlay", "Shiny Floor Spikes", "FUTURE_HAZARD_ART.floor-spikes-overlay", "hazard"),
):
    profile = (
        "ground-overlay-256" if family == "hazard"
        else ("enemy-field-256" if stable_id.startswith("candy-mimic-") else "prop-field-256")
    )
    add(run_id, stable_id, label, family, "dormant", target, profile, note="Catalogue-only; gameplay mechanics and placement are not authorized by Plan 03.")

# The approved normal-boots construction is the active Splash Boots pickup.
# The semantic ID follows the existing gameplay meaning rather than the source
# filename; the old delivery remains the recorded Plan 12 rollback authority.
add("batch-15-normal-boots", "splash-boots", "Splash Boots", "item", "active", "PICKUP_ART.boots", "prop-field-256", "/assets/boots.png")

# Periodic floors/walls and transparent dressings.
for run_id, stable_id, label, target, previous, status in (
    ("batch-10-sunny-floor-b", "floor-sunny-stone", "Sunny stone path", "FLOORS.sunnyStone", "/assets/floor-v3.png", "active"),
    ("batch-16-rose-brick-floor", "floor-rose-brick", "Rose courtyard bricks", "FLOORS.roseBrick", "/assets/floor-rose-brick-v1.png", "active"),
    ("batch-16-moon-slate-floor", "floor-moon-slate", "Moonlit slate", "FLOORS.moonSlate", "/assets/floor-moon-slate-v1.png", "active"),
    ("batch-11-meadow-b", "floor-meadow-grass", "Flower meadow grass", "FLOORS.meadowGrass", "/assets/floor-meadow-grass-v1.png", "active"),
    ("batch-10-woodland-floor-a", "floor-woodland-dirt", "Woodland pebble trail", "FLOORS.woodlandDirt", "/assets/floor-woodland-dirt-v1.png", "active"),
    ("batch-16-pearl-shell-floor", "floor-pearl-shell", "Pearl shell mosaic", "FLOORS.pearlShell", "/assets/floor-pearl-shell-v1.png", "active"),
    ("batch-16-peach-leafstone-floor", "floor-peach-leafstone", "Peach leaf-stone path", "FLOORS.peachLeafstone", "/assets/floor-peach-leafstone-v1.png", "active"),
    ("batch-10-lavender-wall-b", "wall-lavender-stone", "Lavender stone wall", "WALLS.lavenderStone", "/assets/wall-v3.png", "active"),
    ("batch-16-golden-sandstone-wall", "wall-golden-sandstone", "Golden sandstone wall", "WALLS.sandstone", "/assets/wall-sandstone-v1.png", "dormant"),
    ("batch-16-mossy-ruin-wall", "wall-mossy-ruin", "Mossy storybook ruins", "WALLS.mossyRuin", "/assets/wall-mossy-ruin-v1.png", "active"),
    ("batch-16-dark-dungeon-wall", "wall-dark-dungeon", "Moon-dark dungeon wall", "WALLS.darkDungeon", "/assets/wall-dark-dungeon-v1.png", "active"),
    ("batch-10-hedge-b", "wall-hedge", "Flowering garden hedge", "WALLS.hedge", "/assets/wall-hedge-v1.png", "active"),
    ("batch-11-amethyst-b", "wall-amethyst-crystal", "Amethyst crystal wall", "WALLS.amethystCrystal", "/assets/wall-amethyst-crystal-v1.png", "active"),
    ("batch-11-bramble-b", "wall-berry-bramble", "Enchanted berry bramble", "WALLS.berryBramble", "/assets/wall-berry-bramble-v1.png", "active"),
):
    add(run_id, stable_id, label, "terrain", status, target, "terrain-periodic-1024", previous)

for run_id, stable_id, label, target, previous in (
    ("batch-16-garden-dressing", "terrain-dressing-garden", "Tiny garden flowers and moss", "TERRAIN_DRESSING_ART.garden", "/assets/terrain-dressing-garden-v1.png"),
    ("batch-16-vines-dressing", "terrain-dressing-vines", "Soft ivy and moss", "TERRAIN_DRESSING_ART.vines", "/assets/terrain-dressing-vines-v1.png"),
    ("batch-16-crystal-dressing", "terrain-dressing-crystal", "Pearls and crystal glints", "TERRAIN_DRESSING_ART.crystal", "/assets/terrain-dressing-crystal-v1.png"),
    ("batch-16-autumn-dressing", "terrain-dressing-autumn", "Tiny leaves and acorn confetti", "TERRAIN_DRESSING_ART.autumn", "/assets/terrain-dressing-autumn-v1.png"),
):
    add(run_id, stable_id, label, "dressing", "active", target, "dressing-periodic-512", previous)

for run_id, stable_id, label, target, previous, profile in (
    ("batch-02-hazard-water-v03", "terrain-water", "Sparkling water", "HAZARD_ART.water", "/assets/water-v2.png", "terrain-periodic-1024"),
    ("batch-02-hazard-lava-v03", "terrain-lava", "Warm lava", "HAZARD_ART.lava", "/assets/lava-v2.png", "terrain-periodic-1024"),
    ("batch-02-hazard-poison-v02", "terrain-poison", "Purple poison", "HAZARD_ART.poison", "/assets/terrain-poison-v1.png", "terrain-periodic-1024"),
    ("batch-02-hazard-hole-v04", "ground-hole", "Ground hole", "HAZARD_ART.hole", "/assets/ground-hole-v1.png", "ground-overlay-256"),
):
    add(run_id, stable_id, label, "hazard", "active", target, profile, previous)

# Premium Adventure Book and completion rewards: one 256 px source services all
# current 27–150 CSS-pixel uses; no redundant runtime optical copies are shipped.
for run_id, stable_id, label, target, previous in (
    ("batch-22-reward-trail-sticker-v03", "reward-trail-sticker", "First Star", "ACHIEVEMENT_ART.first-star", "/assets/reward-trail-sticker.png"),
    ("batch-22-reward-animal-friend-sticker-v03-b", "reward-animal-friend-sticker", "Animal Friend", "ACHIEVEMENT_ART.animal-friend", "/assets/reward-animal-friend-sticker-v2.webp"),
    ("batch-22-reward-surprise-sparkle-sticker-v03", "reward-surprise-sparkle-sticker", "Surprise Sparkle", "ACHIEVEMENT_ART.surprise-sparkle", "/assets/reward-surprise-sparkle-sticker-v2.webp"),
    ("batch-22-reward-helping-paw-medal-v03", "reward-helping-paw-medal", "Helping Paw", "ACHIEVEMENT_ART.perfect-rescue-5", "/assets/reward-helping-paw-medal-v2.webp"),
    ("batch-22-reward-rainbow-rescue-medal-v03", "reward-rainbow-rescue-medal", "Rainbow Rescue", "ACHIEVEMENT_ART.perfect-rescue-10", "/assets/reward-rainbow-rescue-medal-v2.webp"),
    ("batch-22-reward-golden-guardian-medal-v03-b", "reward-golden-guardian-medal", "Golden Guardian", "ACHIEVEMENT_ART.perfect-rescue-15", "/assets/reward-golden-guardian-medal-v2.webp"),
    ("batch-22-badge-pathfinder-v02", "badge-pathfinder", "Pathfinder", "ACHIEVEMENT_ART.maze-explorer-5", "/assets/badge-pathfinder-v1.webp"),
    ("batch-22-badge-maze-mapper-v02", "badge-maze-mapper", "Maze Mapper", "ACHIEVEMENT_ART.maze-explorer-10", "/assets/badge-maze-mapper-v1.webp"),
    ("batch-22-badge-grand-explorer-v02", "badge-grand-explorer", "Grand Explorer", "ACHIEVEMENT_ART.maze-explorer-20", "/assets/badge-grand-explorer-v1.webp"),
    ("batch-22-badge-surprise-scout-v02", "badge-surprise-scout", "Surprise Scout", "ACHIEVEMENT_ART.surprise-explorer-3", "/assets/badge-surprise-scout-v1.webp"),
    ("batch-22-badge-mighty-adventurer-v02", "badge-mighty-adventurer", "Mighty Adventurer", "ACHIEVEMENT_ART.mighty-adventurer", "/assets/badge-mighty-adventurer-v1.webp"),
    ("batch-22-badge-twinkle-toes-v02", "badge-twinkle-toes", "Twinkle Toes", "ACHIEVEMENT_ART.twinkle-toes", "/assets/badge-twinkle-toes-v1.webp"),
    ("batch-22-badge-bunny-buddy-v02", "badge-bunny-buddy", "Bunny Buddy", "ACHIEVEMENT_ART.bunny-buddy-10", "/assets/badge-bunny-buddy-v1.webp"),
    ("batch-22-badge-fox-friend-v02", "badge-fox-friend", "Fox Friend", "ACHIEVEMENT_ART.fox-friend-10", "/assets/badge-fox-friend-v1.webp"),
    ("batch-22-badge-kitten-pal-v02", "badge-kitten-pal", "Kitten Pal", "ACHIEVEMENT_ART.kitten-pal-10", "/assets/badge-kitten-pal-v1.webp"),
):
    add(run_id, stable_id, label, "reward", "active", target, "reward-presentation-256", previous)


PROFILE: dict[str, dict[str, Any]] = {
    "character-field-512": {"width": 512, "height": 512, "kind": "cutout", "box": [0.12, 0.06, 0.88, 0.94], "align": [0.5, 1.0], "ceiling": 220 * 1024},
    "story-portrait-512": {"width": 512, "height": 512, "kind": "opaque", "ceiling": 120 * 1024, "lossless": False, "quality": 88},
    "friend-field-256": {"width": 256, "height": 256, "kind": "cutout", "box": [0.10, 0.08, 0.90, 0.94], "align": [0.5, 1.0], "ceiling": 100 * 1024},
    "enemy-field-256": {"width": 256, "height": 256, "kind": "cutout", "box": [0.07, 0.06, 0.93, 0.94], "align": [0.5, 1.0], "ceiling": 100 * 1024},
    "prop-field-256": {"width": 256, "height": 256, "kind": "cutout", "box": [0.08, 0.08, 0.92, 0.92], "align": [0.5, 0.5], "ceiling": 100 * 1024},
    "structure-field-256": {"width": 256, "height": 256, "kind": "cutout", "box": [0.04, 0.04, 0.96, 0.94], "align": [0.5, 1.0], "ceiling": 100 * 1024},
    "ground-overlay-256": {"width": 256, "height": 256, "kind": "cutout", "box": [0.06, 0.08, 0.94, 0.92], "align": [0.5, 0.5], "ceiling": 100 * 1024},
    "navigation-optical-128": {"width": 128, "height": 128, "kind": "cutout", "box": [0.05, 0.05, 0.95, 0.95], "align": [0.5, 0.5], "ceiling": 45 * 1024},
    "reward-presentation-256": {"width": 256, "height": 256, "kind": "cutout", "box": [0.05, 0.05, 0.95, 0.95], "align": [0.5, 0.5], "ceiling": 100 * 1024},
    # Opaque periodic paintings are visually reviewed lossy WebP at quality 94.
    # This keeps a 1024 source-period derivative well below its 650 KiB ceiling
    # while preserving the measured edge seam and materially reducing package
    # and decode-transfer pressure. Immutable masters remain lossless PNG.
    "terrain-periodic-1024": {"width": 1024, "height": 1024, "kind": "periodic", "ceiling": 650 * 1024, "lossless": False, "quality": 94},
    "dressing-periodic-512": {"width": 512, "height": 512, "kind": "dressing", "ceiling": 220 * 1024},
}


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def batches() -> dict[str, tuple[Path, dict[str, Any], dict[str, Any]]]:
    found: dict[str, tuple[Path, dict[str, Any], dict[str, Any]]] = {}
    for path in sorted(PRODUCTION_ROOT.glob("batch-*/run-record.json")):
        batch = read_json(path)
        for run in batch["runs"]:
            run_id = str(run["runId"])
            if run_id in found:
                raise ValueError(f"duplicate generation run ID: {run_id}")
            found[run_id] = (path, batch, run)
    return found


def art_version(run_id: str, output_path: str) -> int:
    matches = re.findall(r"-v(\d+)(?:-|\.)", run_id)
    if not matches:
        matches = re.findall(r"-v(\d+)(?:-|\.)", Path(output_path).name)
    return int(matches[-1]) if matches else 1


def runtime_path(spec: Spec, version: int) -> str:
    family_dirs = {
        "character": "characters", "story": "story", "friend": "friends",
        "enemy": "enemies", "weapon": "weapons", "cage": "cages",
        "lock": "locks", "portal": "portals", "navigation": "navigation",
        "item": "items", "terrain": "terrain", "dressing": "terrain",
        "hazard": "hazards", "reward": "rewards",
    }
    size = PROFILE[spec.profile]["width"]
    short_profile = spec.profile.rsplit("-", 1)[0]
    return f"public/assets/mgjrpg-02/{family_dirs[spec.family]}/{spec.stable_id}-v{version:02d}-{short_profile}-{size}-r01.webp"


def record_id(spec: Spec, version: int) -> str:
    return f"{spec.stable_id}-mgjrpg02-v{version:02d}-source"


def loading_phase(spec: Spec) -> str:
    if spec.runtime_status != "active":
        return "not-loaded-by-active-catalogue"
    if spec.family == "navigation":
        return "title-or-navigation"
    if spec.family == "reward":
        return "deferred-reward-or-adventure-book"
    if spec.family == "story":
        return "story-or-level-entry"
    return "level-entry-warmup-or-first-use"


def build_plan() -> dict[str, Any]:
    run_index = batches()
    v05 = read_json(V05_DECISION_PATH)
    v05_runs = {
        str(run_id)
        for selected in v05["approvedByBatch"].values()
        for run_id in selected
    }
    expected_runs = (v05_runs | EARLY_APPROVED_RUNS | POST_V05_APPROVED_RUNS) - EXPLICITLY_DEFERRED_RUNS
    actual_runs = {spec.run_id for spec in SPECS}
    if actual_runs != expected_runs:
        raise ValueError(
            "publication selection drift: "
            f"missing={sorted(expected_runs - actual_runs)}, extra={sorted(actual_runs - expected_runs)}"
        )
    seen_ids: set[str] = set()
    rows: list[dict[str, Any]] = []
    for spec in SPECS:
        if spec.run_id not in run_index:
            raise KeyError(f"unrecorded selected run: {spec.run_id}")
        if spec.stable_id in seen_ids:
            raise ValueError(f"duplicate stable publication ID: {spec.stable_id}")
        seen_ids.add(spec.stable_id)
        batch_path, batch, run = run_index[spec.run_id]
        output = run["output"]
        source = ROOT / output["path"]
        if sha256_file(source) != output["sha256"] or source.stat().st_size != output["bytes"]:
            raise ValueError(f"immutable source evidence differs: {output['path']}")
        version = spec.art_version or art_version(spec.run_id, output["path"])
        previous_sha = None
        previous_bytes = None
        if spec.previous_path:
            previous = ROOT / "public" / spec.previous_path.lstrip("/")
            if not previous.is_file():
                raise FileNotFoundError(f"rollback asset missing: {spec.previous_path}")
            previous_sha = sha256_file(previous)
            previous_bytes = previous.stat().st_size
        rows.append({
            "stableId": spec.stable_id,
            "label": spec.label,
            "family": spec.family,
            "runtimeStatus": spec.runtime_status,
            "catalogueTarget": spec.catalogue_target,
            "profile": spec.profile,
            "batchId": batch["batchId"],
            "batchRecordPath": posix_relative(batch_path),
            "runId": spec.run_id,
            "sourcePath": output["path"],
            "sourceSha256": output["sha256"],
            "sourceBytes": output["bytes"],
            "sourceWidth": output["width"],
            "sourceHeight": output["height"],
            "sourceFormat": output["format"],
            "sourceMode": output["mode"],
            "sourceAlphaMode": output["alphaMode"],
            "generatorOutputId": output["outputId"],
            "artVersion": version,
            "recordId": record_id(spec, version),
            "runtimePath": runtime_path(spec, version),
            "publicUrl": "/" + runtime_path(spec, version).removeprefix("public/"),
            "loadingPhase": loading_phase(spec),
            "previousPath": spec.previous_path,
            "previousSha256": previous_sha,
            "previousBytes": previous_bytes,
            "note": spec.note,
        })
    active = sum(row["runtimeStatus"] == "active" for row in rows)
    dormant = len(rows) - active
    # The final forward-only set is v05 (minus provisional application branding),
    # the nine earlier approved Batch 01 sources, both approved Batch 19
    # teleporters, the four non-superseded Batch 20 sources, and all fifteen
    # Batch 22 reward stickers. The older Batch 20 First Star optical experiment
    # is superseded by Batch 22 and remains source-only history.
    if (len(rows), active, dormant) != (144, 100, 44):
        raise ValueError(f"publication-map count drift: {(len(rows), active, dormant)}")
    return {
        "schema": "maze-art-runtime-publication-map/v1",
        "publicationId": PUBLICATION_ID,
        "recipeId": MGJRPG_02_RECIPE_ID,
        "derivativeRecipeVersion": DERIVATIVE_RECIPE,
        "recordedOn": "2026-09-04",
        "authority": {
            "semanticIdentity": "Every row below is explicit; no identity or ordering is inferred from a filename.",
            "sourceEvidence": "Each path/hash/byte tuple is joined by exact runId to its immutable generation batch ledger.",
            "runtime": "One versioned delivery derivative per current consumer contract; no duplicate optical set is shipped.",
        },
        "counts": {"total": len(rows), "active": active, "dormant": dormant},
        "entries": rows,
    }


def decision(plan: dict[str, Any]) -> dict[str, Any]:
    return {
        "schema": "maze-art-human-source-decision/v1",
        "decisionId": "mgjrpg-02-human-runtime-publication-v06",
        "reviewedBy": "Human project owner",
        "reviewedAt": "2026-09-04T00:26:48.234Z",
        "scope": "runtime-publish",
        "verbatimAuthority": [
            "The Human art-review and completeness gates are now satisfied. All required sprites have been generated, reviewed, and approved in the final Maze so Puzzle art style. Treat the recorded Human approvals and the latest approved production masters as authoritative.",
            "You are now completing the publication and integration phase of Plan 03. Do not generate alternative designs, reopen approved art-direction decisions, or ask me to reapprove unchanged artwork.",
            "Publish the approved runtime derivatives through the established art catalogue and asset-resolution system.",
        ],
        "interpretation": "This forward-only record grants runtime-publication scope to the exact latest approved sources in the attached map. It does not rewrite older generation dispositions or approval boundaries.",
        "selectionMap": {
            "path": posix_relative(MAP_PATH),
            "entryCount": plan["counts"]["total"],
        },
        "selected": [
            {
                "runId": row["runId"], "stableId": row["stableId"],
                "sourcePath": row["sourcePath"], "sourceSha256": row["sourceSha256"],
                "runtimeStatus": row["runtimeStatus"],
            }
            for row in plan["entries"]
        ],
        "supersededApprovedStudies": [
            "batch-01-rose-heart-matte-02", "batch-01-tea-time-skeleton-matte-02",
            "batch-01-lizard-sword-matte-02", "batch-01-lizard-spear-matte-02",
            "batch-01-pocket-trex-matte-02", "batch-01-kindly-cultist-matte-01",
            "batch-01-orc-chieftain-matte-01", "batch-01-warrior-skeleton-matte-01",
            "batch-02-nav-home-v02", "batch-02-nav-muted-v01",
            "batch-02-app-icon-star-v02", "batch-03-fawn-a", "batch-03-red-panda-a",
            "batch-20-first-star-optical-v02",
        ],
        "deferred": [
            {
                "runId": "batch-13-app-icon-ame-v03",
                "reason": "Ame-face app-icon source remains provisional for Plan 11 platform-branding approval; current platform icons are retained.",
            },
            {
                "batchId": "mgjrpg-02-batch-21-front-door-art",
                "reason": "Title/home/logo concepts have no final approved exact wordmark and remain source-only for Plan 11; current title/home runtime art is retained.",
            },
        ],
        "taxonomy": {
            "greenTeaSkeleton": "rescue-and-collect friend; never enemy or defeat flow",
            "bubbleRingBlade": "replaces the Bubble Bow semantic weapon identity; no arrow mechanic is implied",
        },
        "rightsReview": {
            "path": posix_relative(RIGHTS_PATH),
            "reviewedBy": "Codex Plan 03 provenance audit under Human project-owner publication direction",
            "scope": "technical source provenance and project-publication eligibility; not external legal advice",
        },
        "rollback": "All prior runtime URLs and every generated original remain in place. Revert catalogue pointers and semantic ring-blade migration; Plan 12 alone may retire files after later consumers settle.",
    }


def rights_review(plan: dict[str, Any]) -> dict[str, Any]:
    return {
        "schema": "maze-art-rights-provenance-review/v1",
        "reviewId": "mgjrpg-02-rights-provenance-v01",
        "reviewedAt": "2026-09-04T00:26:48.234Z",
        "reviewedBy": "Codex Plan 03 provenance audit under Human project-owner publication direction",
        "licenceStatus": "reviewed",
        "scope": f"The {plan['counts']['total']} exact immutable generator outputs selected by the Plan 03 runtime publication map.",
        "evidence": {
            "generationProvider": "OpenAI built-in image generation capability as recorded in each immutable batch ledger",
            "promptOwnership": "Project-authored prompts preserved exactly in each batch PROMPTS.md",
            "referenceBoundary": "Only Maze project sources, model sheets, rendering contracts, and comparison-only legacy runtime art are recorded; no external pixels are incorporated into derivatives.",
            "forbiddenRequests": "Batch origin claims record no named franchise character, logo, living artist, proprietary palette, UI layout, or composition request.",
            "humanAuthority": "The Human project owner explicitly directed publication and integration in the 2026-09-04 Plan 03 continuation.",
        },
        "conclusion": "Reviewed for project runtime publication. The deterministic derivative pipeline alters crop, alpha, size, colour-space normalization, and encoding only; it does not synthesize or redesign content.",
        "limitations": "This is a technical provenance review, not a legal opinion, trademark clearance, or platform-rating determination. Public labels for succubus and cultist remain separately gated.",
        "selectedSourceCount": plan["counts"]["total"],
    }


def write_plan() -> dict[str, Any]:
    plan = build_plan()
    write_json(MAP_PATH, plan)
    write_json(RIGHTS_PATH, rights_review(plan))
    write_json(DECISION_PATH, decision(plan))
    # Bind the decision to the exact map after both exist without creating a
    # circular hash dependency: the map names the decision ID, while the decision
    # records the map's final hash.
    decided = read_json(DECISION_PATH)
    decided["selectionMap"]["sha256"] = sha256_file(MAP_PATH)
    write_json(DECISION_PATH, decided)
    return plan


def treatment_class(spec: Spec) -> str:
    if spec.family in {"terrain", "dressing"}:
        return "terrain-boundary"
    if spec.family == "hazard":
        # Water/lava/poison are periodic terrain fields. Hole and spikes are
        # transparent ground overlays with a local subject contour.
        return "terrain-boundary" if PROFILE[spec.profile]["kind"] == "periodic" else "character-contour"
    if spec.family in {"navigation", "reward"}:
        return "semantic-ui-cutout"
    if spec.family == "story":
        return "story-illustration"
    return "character-contour"


def geometry_defaults(spec: Spec) -> tuple[str, list[float]]:
    if spec.stable_id in FLOATING_ACTOR_IDS:
        return ("floating-actor", [0.5, 0.84])
    if spec.family in {"friend", "enemy", "character"}:
        return ("grounded-actor", [0.5, 0.90])
    if spec.family == "weapon":
        return ("weapon", [0.5, 0.55])
    if spec.family == "cage" or spec.stable_id.startswith("door-"):
        return ("door-cage", [0.5, 0.94])
    if spec.family == "portal" and spec.stable_id != "goal":
        return ("floor-portal", [0.5, 0.5])
    if spec.stable_id == "goal":
        return ("standing-portal-goal", [0.5, 0.82])
    if spec.family in {"navigation", "reward"}:
        return ("icon", [0.5, 0.5])
    if spec.family in {"terrain", "dressing"}:
        return ("periodic-tile", [0.5, 0.5])
    if spec.family == "hazard":
        return ("ground-overlay", [0.5, 0.5])
    if spec.family == "story":
        return ("portrait", [0.5, 0.5])
    return ("item", [0.5, 0.55])


def record_reference(batch: dict[str, Any], ordered: dict[str, Any], order: int) -> dict[str, Any]:
    evidence = batch["referenceRegistry"][ordered["referenceId"]]
    path = str(evidence["path"])
    prose = str(ordered["role"]).lower()
    if not path.startswith("docs/source-assets/"):
        role = "comparison-only"
        authority = "runtime-comparison" if path.startswith("public/") else "comparison-only"
    else:
        if "negative" in prose or "do not" in prose:
            role = "negative-reference"
            authority = "comparison-only"
        elif "identity" in prose:
            role = "identity-authority"
            authority = "approved-source-master"
        elif "construction" in prose or "landmark" in prose:
            role = "construction-authority"
            authority = "approved-source-master"
        elif "optical" in prose or "small" in prose:
            role = "optical-authority"
            authority = "approved-rendering-anchor"
        elif "palette" in prose:
            role = "palette-authority"
            authority = "approved-rendering-anchor"
        elif "material" in prose:
            role = "material-authority"
            authority = "approved-rendering-anchor"
        elif "family" in prose:
            role = "family-authority"
            authority = "approved-source-master"
        elif "render" in prose or "contour" in prose or "craft" in prose:
            role = "rendering-authority"
            authority = "approved-rendering-anchor"
        else:
            role = "comparison-only"
            authority = "comparison-only"
    return {
        "order": order,
        "role": role,
        "authorityKind": authority,
        "path": path,
        "sha256": evidence["sha256"],
    }


def extraction_for(source: Image.Image, profile: dict[str, Any]) -> tuple[Image.Image, dict[str, Any]]:
    rgba = normalize_to_srgb_rgba(source)
    alpha = rgba.getchannel("A")
    if alpha.getextrema()[0] < 255:
        return rgba, {"mode": "native-alpha"}
    matte = estimate_uniform_matte(source)
    extracted, measurement = extract_uniform_matte(source, matte["rgb"], minimum_component_pixels=3)
    return extracted, {
        "mode": "flat-impossible-matte",
        "recipeId": "flat-impossible-matte-alpha-unblend-v1",
        "rgb": matte["rgb"],
        "clearDistance": 48,
        "opaqueDistance": 144,
        "minimumComponentPixels": 3,
        "measurement": measurement,
    }


def effective_registration(spec: Spec, profile: dict[str, Any]) -> dict[str, Any] | None:
    """Resolve the exact cutout registration consumed and recorded by the build."""
    if "box" not in profile:
        return None
    align = (
        [0.5, 1.0]
        if spec.stable_id in {
            "classic-mimic-revealed", "classic-mimic-closed",
            "classic-mimic-good-open",
        }
        else profile["align"]
    )
    return {"targetBox": profile["box"], "align": align, "alphaThreshold": 3}


def prepare_derivative(spec: Spec, row: dict[str, Any]) -> tuple[Image.Image, dict[str, Any], dict[str, Any]]:
    profile = PROFILE[spec.profile]
    size = (profile["width"], profile["height"])
    source_path = ROOT / row["sourcePath"]
    extraction_record: dict[str, Any] = {}
    with Image.open(source_path) as opened:
        opened.load()
        if profile["kind"] == "periodic":
            prepared = make_periodic(opened, size)
        elif profile["kind"] == "opaque":
            prepared = normalize_to_srgb_rgba(opened).convert("RGB").resize(size, Image.Resampling.LANCZOS)
        elif profile["kind"] == "dressing":
            # Sparse dressings are transparent overlays, not opaque terrain.
            # Their selected masters already have a transparent seam gutter;
            # preserve that alpha while resizing instead of applying the RGB
            # Poisson terrain solver, which necessarily discards transparency.
            prepared = normalize_to_srgb_rgba(opened).resize(
                size, Image.Resampling.LANCZOS
            )
        else:
            working, extraction_record = extraction_for(opened, profile)
            registration = effective_registration(spec, profile)
            if registration is None:
                raise ValueError(f"{spec.stable_id}: cutout profile lacks registration")
            prepared = register_cutout(
                working,
                size,
                target_box=registration["targetBox"],
                align=registration["align"],
                alpha_threshold=registration["alphaThreshold"],
            )
    if profile["kind"] == "dressing":
        prepared = clear_low_alpha(prepared, 2)
        prepared = remove_small_alpha_components(
            prepared, minimum_pixels=2, alpha_threshold=3
        )
        prepared = dilate_hidden_rgb(prepared, 4)
    elif profile["kind"] not in {"periodic", "opaque"}:
        prepared = clear_low_alpha(prepared, 2)
        prepared = remove_small_alpha_components(prepared, minimum_pixels=2, alpha_threshold=3)
        prepared = dilate_hidden_rgb(prepared, 4)
    prepared, normalized_black = normalize_visible_black(prepared)
    encoder_options = {
        "lossless": bool(profile.get("lossless", True)),
        "quality": int(profile.get("quality", 100)),
        "method": 6,
        "exact": True,
    }
    return prepared, extraction_record, {"normalizedExactBlackPixels": normalized_black, "encoderOptions": encoder_options}


def alpha_weighted_visual_center(image: Image.Image, alpha_threshold: int = 3) -> list[float]:
    """Return the measured centre of visible alpha mass in normalized coordinates."""
    alpha = image.convert("RGBA").getchannel("A")
    pixels = alpha.load()
    total = 0
    weighted_x = 0.0
    weighted_y = 0.0
    for y in range(alpha.height):
        for x in range(alpha.width):
            weight = int(pixels[x, y])
            if weight <= alpha_threshold:
                continue
            total += weight
            weighted_x += (x + 0.5) * weight
            weighted_y += (y + 0.5) * weight
    if total == 0:
        raise ValueError("cannot measure visualCenter from an empty alpha mask")
    return [
        round(weighted_x / total / alpha.width, 8),
        round(weighted_y / total / alpha.height, 8),
    ]


def validate_output(spec: Spec, row: dict[str, Any], path: Path) -> dict[str, Any]:
    profile = PROFILE[spec.profile]
    visual_center: list[float] | None = None
    needs_visual_center = geometry_defaults(spec)[0] == "item" or spec.stable_id in MIMIC_GEOMETRY
    needs_float_center = spec.stable_id in FLOATING_ACTOR_IDS
    with Image.open(path) as image:
        image.load()
        if image.size != (profile["width"], profile["height"]):
            raise ValueError(f"{spec.stable_id}: wrong derivative size {image.size}")
        pseudo_record = {
            "recipeVersion": MGJRPG_02_RECIPE_ID,
            "family": spec.family,
            "renderingContract": {"treatmentClass": treatment_class(spec)},
        }
        pseudo_build = {
            "operation": "periodic"
            if profile["kind"] in {"periodic", "dressing"}
            else ("opaque-resize" if profile["kind"] == "opaque" else "cutout-resize")
        }
        _validate_mgjrpg02_staged_pixels(pseudo_record, pseudo_build, image)
        rgba = image.convert("RGBA")
        if needs_visual_center or needs_float_center:
            visual_center = alpha_weighted_visual_center(rgba)
        if profile["kind"] in {"periodic", "opaque"}:
            bounds = {"pixelsLTRB": [0, 0, image.width, image.height], "normalizedLTRB": [0.0, 0.0, 1.0, 1.0]}
            components: list[int] = []
        else:
            alpha = rgba.getchannel("A")
            if profile["kind"] != "dressing":
                border = (
                    alpha.crop((0, 0, image.width, 2)), alpha.crop((0, image.height - 2, image.width, image.height)),
                    alpha.crop((0, 0, 2, image.height)), alpha.crop((image.width - 2, 0, image.width, image.height)),
                )
                if not all(part.getextrema() == (0, 0) for part in border):
                    raise ValueError(f"{spec.stable_id}: derivative lacks a two-pixel clear border")
            bounds = alpha_bounds(rgba, 3)
            components = alpha_component_sizes(rgba, alpha_threshold=3)
        seams = seam_metrics(image) if profile["kind"] in {"periodic", "dressing"} else None
        if seams is not None and not seams["passed"]:
            raise ValueError(f"{spec.stable_id}: periodic seam failure: {seams}")
        facts = image_facts(path)
    if path.stat().st_size > profile["ceiling"]:
        raise ValueError(f"{spec.stable_id}: {path.stat().st_size} bytes exceeds {profile['ceiling']} byte ceiling")
    x0, y0, x1, y1 = (int(value) for value in bounds["pixelsLTRB"])
    geometry_class, pivot = geometry_defaults(spec)
    geometry: dict[str, Any] = {
        "class": geometry_class,
        "pivot": pivot,
        "visibleBounds": [x0 / profile["width"], y0 / profile["height"], (x1 - x0) / profile["width"], (y1 - y0) / profile["height"]],
        "safeInset": [y0 / profile["height"], (profile["width"] - x1) / profile["width"], (profile["height"] - y1) / profile["height"], x0 / profile["width"]],
    }
    if spec.stable_id == "ame":
        geometry.update({
            "faceBox": [0.39, 0.19, 0.25, 0.20],
            "eyeLine": 0.28,
            "groundLine": 0.90,
            "gripPoint": [0.66, 0.58],
            "forwardAxisDegrees": 0.0,
        })
    if spec.family == "weapon":
        geometry.update(WEAPON_GEOMETRY[spec.stable_id])
    if spec.stable_id in CAGE_GEOMETRY:
        geometry.update(CAGE_GEOMETRY[spec.stable_id])
    if spec.stable_id in DOOR_GEOMETRY:
        geometry.update(DOOR_GEOMETRY[spec.stable_id])
    if spec.stable_id in PORTAL_GEOMETRY:
        geometry.update(PORTAL_GEOMETRY[spec.stable_id])
    if spec.stable_id in HAZARD_GEOMETRY:
        geometry.update(HAZARD_GEOMETRY[spec.stable_id])
    if spec.stable_id in MIMIC_GEOMETRY:
        geometry.update(MIMIC_GEOMETRY[spec.stable_id])
    if spec.family in {"navigation", "reward"}:
        geometry["opticalBounds"] = list(geometry["visibleBounds"])
    if spec.stable_id == "nav-muted":
        geometry["modifierBox"] = [0.09375, 0.1484375, 0.7890625, 0.78125]
    if geometry["class"] == "item":
        if visual_center is None:
            raise ValueError(f"{spec.stable_id}: item geometry lacks measurable alpha")
        geometry["visualCenter"] = visual_center
    if geometry["class"] == "floating-actor":
        if visual_center is None:
            raise ValueError(f"{spec.stable_id}: floating actor lacks measurable alpha")
        geometry["floatCenter"] = visual_center
    return {
        "bytes": path.stat().st_size,
        "sha256": sha256_file(path),
        **facts,
        "alphaBounds": bounds,
        "alphaComponentCount": len(components),
        "smallestAlphaComponentPixels": min(components) if components else None,
        "seamMetrics": seams,
        "geometry": geometry,
    }


def build_record(spec: Spec, row: dict[str, Any], result: dict[str, Any], extraction: dict[str, Any], encoder: dict[str, Any]) -> dict[str, Any]:
    run_index = batches()
    _batch_path, batch, run = run_index[spec.run_id]
    prompt_path = batch["promptFile"]["path"]
    recipe_sha = sha256_file(RECIPE_PATH)
    canary_sha = sha256_file(CANARY_PATH)
    decision_sha = sha256_file(DECISION_PATH)
    references = [
        record_reference(batch, ordered, index + 1)
        for index, ordered in enumerate(run["orderedReferences"])
    ]
    profile = PROFILE[spec.profile]
    build: dict[str, Any] = {
        "sourcePath": row["sourcePath"],
        "operation": (
            "periodic-transparent-overlay"
            if profile["kind"] == "dressing"
            else (
                "periodic"
                if profile["kind"] == "periodic"
                else ("opaque-resize" if profile["kind"] == "opaque" else "cutout-resize")
            )
        ),
        "profiles": [{
            "id": spec.profile,
            "outputPath": row["runtimePath"],
            "width": profile["width"], "height": profile["height"], "format": "webp",
            "clearAlphaBelow": 3, "edgeDilationPixels": 4,
            "minimumAlphaComponentPixels": 2,
            "maxEncodedBytes": profile["ceiling"],
            "encoder": {"options": encoder["options"]},
        }],
    }
    if profile["kind"] not in {"periodic", "opaque", "dressing"}:
        clean_extraction = {key: value for key, value in extraction.items() if key != "measurement"}
        build["backgroundExtraction"] = clean_extraction
        if profile["kind"] != "dressing":
            registration = effective_registration(spec, profile)
            if registration is None:
                raise ValueError(f"{spec.stable_id}: cutout build lacks registration")
            build["registration"] = registration
    treatment = treatment_class(spec)
    rendering: dict[str, Any] = {
        "profileId": "storybook-local-contour-v1",
        "recipeId": MGJRPG_02_RECIPE_ID,
        "treatmentClass": treatment,
        "canaryReview": {"reviewId": "mgjrpg-02-canary-v01", "path": posix_relative(CANARY_PATH), "sha256": canary_sha},
    }
    if treatment in {"character-contour", "semantic-ui-cutout"}:
        rendering.update({
            "authoredContour": "material-local-color-aware",
            "extractionRole": "alpha-matte-only",
            "stickerCutline": "semantic-cream-only" if treatment == "semantic-ui-cutout" else "forbidden",
        })
    else:
        rendering.update({
            "authoredBoundary": "material-local-color-aware",
            "extractionRole": "not-applicable",
            "stickerCutline": "forbidden",
            "enclosingContour": "subject-local-only" if treatment == "story-illustration" else "forbidden",
        })
    previous = None
    if row["previousPath"]:
        previous = {"previousPath": row["previousPath"], "previousSha256": row["previousSha256"]}
    record: dict[str, Any] = {
        "$schema": "../schema/art-source.schema.json",
        "schemaVersion": 2,
        "recordId": row["recordId"],
        "id": row["stableId"],
        "artVersion": row["artVersion"],
        "family": row["family"],
        "runtimeStatus": row["runtimeStatus"],
        "sourceStatus": "source-backed",
        "approvalStatus": "approved",
        "validationProfile": "strict-v2",
        "recipeVersion": MGJRPG_02_RECIPE_ID,
        "derivativeRecipeVersion": DERIVATIVE_RECIPE,
        "recipeEvidence": {"recipeId": MGJRPG_02_RECIPE_ID, "path": posix_relative(RECIPE_PATH), "sha256": recipe_sha},
        "generationRuns": [{
            "runId": spec.run_id,
            "generator": f"{batch['generator']['provider']} — {batch['generator']['interface']}",
            "model": batch["generator"]["model"],
            "executedAt": "unknown",
            "prompt": {"path": prompt_path, "sha256": batch["promptFile"]["sha256"]},
            "references": references,
            "outputs": [{
                "outputId": run["output"]["outputId"], "path": row["sourcePath"],
                "sha256": row["sourceSha256"], "bytes": row["sourceBytes"],
                "disposition": "selected", "reason": "Selected by the forward-only v06 Human runtime-publication decision.",
            }],
            "lineage": {
                "editOfEdit": False,
                "identityAuthorityEligible": bool(run["lineage"].get("mayBecomeIdentityAuthority", False)),
                "renderingAuthorityEligible": bool(run["lineage"].get("mayBecomeRenderingAuthority", False)),
            },
            "notes": f"Batch ledger recorded on {batch['recordedOn']}; exact execution time was not exposed. Original ordered-role prose remains immutable in {row['batchRecordPath']}.",
        }],
        "renderingContract": rendering,
        "promptEvidence": {
            "fidelity": "exact", "historyPath": prompt_path, "assetNamedInHistory": True,
            "promptFile": {"path": prompt_path, "sha256": batch["promptFile"]["sha256"]},
            "outputIds": [run["output"]["outputId"]],
            "notes": "Exact submitted prompt block is preserved in the hashed batch prompt file.",
        },
        "sources": [{
            "path": row["sourcePath"], "sha256": row["sourceSha256"], "bytes": row["sourceBytes"],
            "relationship": "selected immutable generator original",
            "evidence": f"Exact run {spec.run_id} in {row['batchRecordPath']} plus v06 runtime publication decision.",
        }],
        "derivatives": [{
            "id": f"{row['stableId']}-{spec.profile}-r01", "path": row["runtimePath"],
            "sha256": result["sha256"], "bytes": result["bytes"], "width": result["width"], "height": result["height"],
            "format": result["format"], "mode": result["mode"], "alphaMode": result["alphaMode"],
            "decodedBytesUpperBound": result["decodedBytesUpperBound"], "profile": spec.profile,
            "derivativeRevision": 1, "runtimeStatus": row["runtimeStatus"], "loadingPhase": row["loadingPhase"],
            "encoder": {key: encoder[key] for key in ("name", "version", "options")},
        }],
        "geometry": result["geometry"],
        "build": build,
        "humanEdits": [{"kind": "deterministic-delivery-processing", "description": "Colour-space normalization, alpha extraction where required, transparent-edge decontamination, aspect-preserving registration, resize, exact-black normalization, and WebP encoding only.", "script": "scripts/art_pipeline/mgjrpg02_publish.py"}],
        "approvalEvidence": {
            "approvedBy": "Human project owner", "approvedAt": "2026-09-04T00:26:48.234Z", "scope": "runtime-publish",
            "evidencePath": posix_relative(DECISION_PATH), "evidenceSha256": decision_sha,
        },
        "knownUnknowns": [
            "Generator model build, seed, and exact execution timestamp were not exposed by the image-generation tool response.",
            *( [spec.note] if spec.note else [] ),
        ],
        "rights": {
            "originClaim": batch["rights"]["originClaim"], "licenceStatus": "reviewed",
            "reviewedBy": "Codex Plan 03 provenance audit under Human project-owner publication direction",
            "notes": f"Technical provenance review: {posix_relative(RIGHTS_PATH)}. Not external legal advice.",
        },
        "rollback": {
            "method": "Revert the catalogue pointer to the recorded prior URL; retain both versions until the Plan 12 retirement sweep.",
            **(previous or {}),
        },
    }
    errors = validate_record_shape(record, row["recordId"])
    if errors:
        raise ValueError("\n".join(errors))
    return record


def publish() -> dict[str, Any]:
    if not MAP_PATH.is_file() or not DECISION_PATH.is_file() or not RIGHTS_PATH.is_file():
        raise FileNotFoundError("run --plan before --publish")
    plan = read_json(MAP_PATH)
    specs = {spec.stable_id: spec for spec in SPECS}
    reports: list[dict[str, Any]] = []
    staged_rows: list[tuple[Path, Path, Path, Path]] = []
    with tempfile.TemporaryDirectory(prefix="mgjrpg02-publication-stage-") as temp:
        stage_root = Path(temp)

        def stage_one(row: dict[str, Any]) -> tuple[dict[str, Any], tuple[Path, Path, Path, Path]]:
            spec = specs[row["stableId"]]
            destination = ROOT / row["runtimePath"]
            record_path = RECORD_ROOT / f"{row['recordId']}.json"
            if destination.exists() or record_path.exists():
                existing = destination if destination.exists() else record_path
                raise FileExistsError(
                    "refusing to overwrite existing publication output: "
                    f"{posix_relative(existing)}"
                )
            prepared, extraction, processing = prepare_derivative(spec, row)
            staged = stage_root / "runtime" / destination.relative_to(ROOT)
            staged.parent.mkdir(parents=True, exist_ok=True)
            encoder = save_image(prepared, staged, "webp", processing["encoderOptions"])
            result = validate_output(spec, row, staged)
            record = build_record(spec, row, result, extraction, encoder)
            staged_record = stage_root / "records" / record_path.name
            write_json(staged_record, record)
            report = {
                **row,
                "runtimeSha256": result["sha256"], "runtimeBytes": result["bytes"],
                "runtimeWidth": result["width"], "runtimeHeight": result["height"],
                "runtimeFormat": result["format"], "runtimeMode": result["mode"],
                "runtimeAlphaMode": result["alphaMode"],
                "decodedBytesUpperBound": result["decodedBytesUpperBound"],
                "alphaBounds": result["alphaBounds"],
                "alphaComponentCount": result["alphaComponentCount"],
                "seamMetrics": result["seamMetrics"],
                "geometry": result["geometry"],
                "registration": effective_registration(
                    specs[row["stableId"]], PROFILE[specs[row["stableId"]].profile]
                ),
                "extraction": extraction,
                "encoder": {key: encoder[key] for key in ("name", "version", "options")},
            }
            return report, (staged, destination, staged_record, record_path)

        # Build and validate the complete set before making any repository file
        # visible. Two workers cap memory while cutting the all-catalogue encode
        # wall time; executor.map preserves semantic map order in the report.
        with ThreadPoolExecutor(max_workers=2, thread_name_prefix="mgjrpg02") as executor:
            for report, staged_row in executor.map(stage_one, plan["entries"]):
                reports.append(report)
                staged_rows.append(staged_row)
        # Publish each complete staged file with a no-replace filesystem
        # primitive. Existing or concurrently-created outputs are never changed.
        for staged, destination, staged_record, record_path in staged_rows:
            destination.parent.mkdir(parents=True, exist_ok=True)
            record_path.parent.mkdir(parents=True, exist_ok=True)
            _publish_without_overwrite(staged, destination)
            _publish_without_overwrite(staged_record, record_path)
    report = publication_report(reports)
    write_json(REPORT_PATH, report)
    write_typescript(report)
    return report


def repair_transparent_dressings() -> dict[str, Any]:
    """Regenerate only the four dressing outputs rejected for lost alpha.

    This is a forward repair for the uncommitted initial publication run. It
    requires the rejected output and record paths to be absent, stages the
    entire corrected set, and never replaces an existing repository file.
    """

    target_ids = {
        "terrain-dressing-garden",
        "terrain-dressing-vines",
        "terrain-dressing-crystal",
        "terrain-dressing-autumn",
    }
    plan = read_json(MAP_PATH)
    prior_report = read_json(REPORT_PATH)
    prior_by_id = {row["stableId"]: row for row in prior_report["entries"]}
    specs = {spec.stable_id: spec for spec in SPECS}
    staged_rows: list[tuple[Path, Path, Path, Path]] = []
    corrected: dict[str, dict[str, Any]] = {}

    with tempfile.TemporaryDirectory(prefix="mgjrpg02-dressing-repair-") as temp:
        stage_root = Path(temp)
        for row in plan["entries"]:
            if row["stableId"] not in target_ids:
                continue
            spec = specs[row["stableId"]]
            destination = ROOT / row["runtimePath"]
            record_path = RECORD_ROOT / f"{row['recordId']}.json"
            if destination.exists() or record_path.exists():
                existing = destination if destination.exists() else record_path
                raise FileExistsError(
                    "transparent-dressing repair refuses to overwrite: "
                    f"{posix_relative(existing)}"
                )
            prepared, extraction, processing = prepare_derivative(spec, row)
            staged = stage_root / "runtime" / destination.relative_to(ROOT)
            staged.parent.mkdir(parents=True, exist_ok=True)
            encoder = save_image(prepared, staged, "webp", processing["encoderOptions"])
            result = validate_output(spec, row, staged)
            if result["alphaMode"] != "straight":
                raise ValueError(f"{spec.stable_id}: corrected dressing must retain alpha")
            record = build_record(spec, row, result, extraction, encoder)
            staged_record = stage_root / "records" / record_path.name
            write_json(staged_record, record)
            corrected[row["stableId"]] = {
                **row,
                "runtimeSha256": result["sha256"], "runtimeBytes": result["bytes"],
                "runtimeWidth": result["width"], "runtimeHeight": result["height"],
                "runtimeFormat": result["format"], "runtimeMode": result["mode"],
                "runtimeAlphaMode": result["alphaMode"],
                "decodedBytesUpperBound": result["decodedBytesUpperBound"],
                "alphaBounds": result["alphaBounds"],
                "alphaComponentCount": result["alphaComponentCount"],
                "seamMetrics": result["seamMetrics"],
                "geometry": result["geometry"],
                "registration": effective_registration(spec, PROFILE[spec.profile]),
                "extraction": extraction,
                "encoder": {key: encoder[key] for key in ("name", "version", "options")},
            }
            staged_rows.append((staged, destination, staged_record, record_path))

        if set(corrected) != target_ids:
            raise ValueError(
                f"transparent-dressing repair expected {sorted(target_ids)}, "
                f"found {sorted(corrected)}"
            )
        for staged, destination, staged_record, record_path in staged_rows:
            destination.parent.mkdir(parents=True, exist_ok=True)
            record_path.parent.mkdir(parents=True, exist_ok=True)
            _publish_without_overwrite(staged, destination)
            _publish_without_overwrite(staged_record, record_path)

    entries = [corrected.get(row["stableId"], prior_by_id[row["stableId"]]) for row in plan["entries"]]
    report = publication_report(entries)
    write_json(REPORT_PATH, report)
    write_typescript(report)
    return {
        "corrected": len(corrected),
        "stableIds": sorted(corrected),
        "runtimeEncodedBytes": report["counts"]["runtimeEncodedBytes"],
        "runtimeDecodedBytesUpperBound": report["counts"]["runtimeDecodedBytesUpperBound"],
    }


def deferred_actor_geometry(entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
    deferred: list[dict[str, Any]] = []
    for row in entries:
        geometry = row["geometry"]
        geometry_class = geometry["class"]
        required = (
            ["faceBox", "eyeLine", "groundLine"] if geometry_class == "grounded-actor"
            else (["faceBox", "eyeLine"] if geometry_class == "floating-actor" else [])
        )
        missing = [field for field in required if field not in geometry]
        if missing:
            deferred.append({
                "stableId": row["stableId"],
                "catalogueTarget": row["catalogueTarget"],
                "geometryClass": geometry_class,
                "missing": missing,
                "reason": "Semantic facial/foot landmarks require manual per-asset registration; alpha bounds are not a truthful substitute.",
                "runtimeConsumerDependency": False,
                "entryGate": "Required before Plan 05 animation or automated cage masking; static Plan 03 relies on locked canvas/pivot/bounds and live visual review.",
            })
    # The retained Goblin has no generated Plan 03 report row, so keep its
    # legacy landmark gap explicit rather than silently dropping it.
    deferred.append({
        "stableId": "goblin",
        "catalogueTarget": "ENEMY_ART.goblin",
        "geometryClass": "grounded-actor",
        "missing": ["faceBox", "eyeLine", "groundLine"],
        "reason": "Retained legacy runtime art has no source-authoritative manual landmarks.",
        "runtimeConsumerDependency": False,
        "entryGate": "Required before Plan 05 animation; static Plan 03 retains current visual registration.",
    })
    return deferred


def publication_report(entries: list[dict[str, Any]]) -> dict[str, Any]:
    active = [row for row in entries if row["runtimeStatus"] == "active"]
    dormant = [row for row in entries if row["runtimeStatus"] == "dormant"]
    return {
        "schema": "maze-art-runtime-publication-report/v1",
        "publicationId": PUBLICATION_ID,
        "generatedOn": "2026-09-04",
        "sourceMapPath": posix_relative(MAP_PATH),
        "sourceMapSha256": sha256_file(MAP_PATH),
        "decisionPath": posix_relative(DECISION_PATH),
        "decisionSha256": sha256_file(DECISION_PATH),
        "deferredGeometry": deferred_actor_geometry(entries),
        "counts": {
            "published": len(entries), "active": len(active), "dormant": len(dormant),
            "sourceEncodedBytes": sum(row["sourceBytes"] for row in entries),
            "runtimeEncodedBytes": sum(row["runtimeBytes"] for row in entries),
            "runtimeDecodedBytesUpperBound": sum(row["decodedBytesUpperBound"] for row in entries),
            "activeEncodedBytes": sum(row["runtimeBytes"] for row in active),
            "activeDecodedBytesUpperBound": sum(row["decodedBytesUpperBound"] for row in active),
            "dormantEncodedBytes": sum(row["runtimeBytes"] for row in dormant),
            "dormantDecodedBytesUpperBound": sum(row["decodedBytesUpperBound"] for row in dormant),
            "supersededRollbackFilesRetained": sum(bool(row["previousPath"]) for row in entries),
        },
        "policy": {
            "deletions": 0, "moves": 0, "overwrites": 0,
            "appIcon": "deferred-plan11", "frontDoor": "deferred-plan11",
            "lighting": "neutral static geometry; Plan 04 owns directional light and wall depth",
            "animation": "single registered static frame; Plan 05 owns on-model frame production",
            "weaponRegistration": {
                "measurement": "Alpha >= 16 on registered 256 px derivatives; normalize active-end reach to the former 0.63-Ame-canvas median, then cap the widest 0.94-canvas presentation to a 2% tile border.",
                "axis": "Each approved source construction resolves to a -55 degree held axis; heldRotationDegrees is CSS-clockwise.",
                "socket": "Weapon gripPoint resolves exactly to Ame gripPoint [0.66,0.58] in field, battle, and portal contexts.",
                "layering": "Ame body is local layer 2; ordinary weapons use layer 3 and the closed-loop ring blade uses layer 1 to preserve the approved face.",
                "proof": "artifacts/art-proofs/mgjrpg-02/publication/held-weapon-calibration/held-weapons-actual-size.png",
            },
            "visualCenter": "Alpha-weighted centroid of derivative pixels with alpha > 3; measured on the final registered delivery canvas.",
        },
        "entries": entries,
    }


def write_typescript(report: dict[str, Any]) -> None:
    rows = []
    for row in report["entries"]:
        rows.append(
            f'  {json.dumps(row["stableId"])}: {{ id: {json.dumps(row["stableId"])}, label: {json.dumps(row["label"])}, family: {json.dumps(row["family"])}, artVersion: {row["artVersion"]}, recipeVersion: {json.dumps(MGJRPG_02_RECIPE_ID)}, profile: {json.dumps(row["profile"])}, src: {json.dumps(row["publicUrl"])}, sourceRecordId: {json.dumps(row["recordId"])}, runtimeStatus: {json.dumps(row["runtimeStatus"])}, width: {row["runtimeWidth"]}, height: {row["runtimeHeight"]}, alphaMode: {json.dumps(row["runtimeAlphaMode"])}, geometry: {json.dumps(row["geometry"], separators=(",", ":"))} }},'
        )
    content = (
        "// Generated by scripts/art_pipeline/mgjrpg02_publish.py from the explicit\n"
        "// Plan 03 publication map. Do not hand-edit or infer semantics from paths.\n"
        "export const MGJRPG02_ART = {\n" + "\n".join(rows) + "\n} as const;\n"
    )
    TS_PATH.parent.mkdir(parents=True, exist_ok=True)
    TS_PATH.write_text(content, encoding="utf-8")


def deterministic_check() -> dict[str, Any]:
    plan = read_json(MAP_PATH)
    report = read_json(REPORT_PATH)
    report_by_id = {row["stableId"]: row for row in report["entries"]}
    specs = {spec.stable_id: spec for spec in SPECS}
    failures: list[str] = []
    checked = 0
    with tempfile.TemporaryDirectory(prefix="mgjrpg02-rebuild-") as temp:
        temp_root = Path(temp)

        def check_one(row: dict[str, Any]) -> list[str]:
            row_failures: list[str] = []
            spec = specs[row["stableId"]]
            destination = ROOT / row["runtimePath"]
            record_path = RECORD_ROOT / f"{row['recordId']}.json"
            if not destination.is_file() or not record_path.is_file():
                return [f"missing published output or record: {row['stableId']}"]
            if sha256_file(destination) != report_by_id[row["stableId"]]["runtimeSha256"]:
                row_failures.append(f"published hash drift: {row['stableId']}")
            prepared, _extraction, processing = prepare_derivative(spec, row)
            rebuilt = temp_root / destination.relative_to(ROOT)
            rebuilt.parent.mkdir(parents=True, exist_ok=True)
            save_image(prepared, rebuilt, "webp", processing["encoderOptions"])
            if rebuilt.read_bytes() != destination.read_bytes():
                row_failures.append(f"non-deterministic derivative bytes: {row['stableId']}")
            try:
                validate_output(spec, row, destination)
                record_errors = validate_record_shape(read_json(record_path), posix_relative(record_path))
                row_failures.extend(record_errors)
            except Exception as error:  # noqa: BLE001 - aggregate every contract failure
                row_failures.append(f"{row['stableId']}: {error}")
            return row_failures

        with ThreadPoolExecutor(max_workers=2, thread_name_prefix="mgjrpg02-check") as executor:
            for row_failures in executor.map(check_one, plan["entries"]):
                failures.extend(row_failures)
                checked += 1
    if failures:
        raise ValueError("mgjrpg-02 publication check failed:\n" + "\n".join(failures))
    return {"checked": checked, "deterministic": True, "failures": 0}


def main() -> int:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--plan", action="store_true")
    group.add_argument("--publish", action="store_true")
    group.add_argument("--repair-transparent-dressings", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.plan:
        result = write_plan()
    elif args.publish:
        result = publish()
    elif args.repair_transparent_dressings:
        result = repair_transparent_dressings()
    else:
        result = deterministic_check()
    print(json.dumps(result.get("counts", result), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
