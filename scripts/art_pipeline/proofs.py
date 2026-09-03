"""Deterministic actual-size, alpha-edge, registration, and repeat proofs."""

from __future__ import annotations

import copy
import hashlib
import html
import os
import tempfile
from urllib.parse import quote
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont, ImageOps

from builder import (
    _preflight_record,
    _prepare,
    _validate_build_source,
    _validate_output_policy,
    alpha_bounds,
    resolve_record,
)
from cutout import normalize_to_srgb_rgba, premultiplied_resize
from encode import encoder_environment, save_image
from manifest import PIPELINE_INPUT_PATHS, REQUIREMENTS_PATH
from model import (
    PROOF_ROOT,
    ROOT,
    image_facts,
    inside_root,
    json_bytes,
    posix_relative,
    sha256_file,
)


CANARIES: tuple[dict[str, Any], ...] = (
    {"path": "public/assets/ame.png", "role": "historical field actor", "sizes": [64, 84]},
    {"path": "public/assets/animal-fox.png", "role": "dark friend anchor", "sizes": [64, 84]},
    {"path": "public/assets/animal-alpaca-v1.webp", "role": "pale friend canary", "sizes": [64, 84]},
    {"path": "public/assets/enemy-jelly-sorcerer-v1.webp", "role": "glossy/pale enemy", "sizes": [64, 84]},
    {"path": "public/assets/goblin.png", "role": "historical enemy", "sizes": [64, 84]},
    {"path": "public/assets/weapon-moon-wand-v1.png", "role": "weapon canary", "sizes": [32, 48, 64]},
    {"path": "public/assets/key-rose-heart-v1.png", "role": "lock key canary", "sizes": [16, 24, 32]},
    {"path": "public/assets/door-rose-heart-v1.png", "role": "lock door canary", "sizes": [64, 84]},
    {"path": "public/assets/portal-rose-heart-v1.png", "role": "portal canary", "sizes": [64, 84]},
    {"path": "public/assets/reward-trail-sticker.png", "role": "First Star reward", "sizes": [32, 48, 64]},
    {"path": "public/assets/nav-home-v1.webp", "role": "navigation canary", "sizes": [16, 24, 32]},
    {"path": "public/assets/nav-help-v1.webp", "role": "navigation canary", "sizes": [16, 24, 32]},
)

LOCK_CANARIES: tuple[tuple[str, str, str], ...] = (
    ("Rose Heart", "public/assets/key-rose-heart-v1.png", "public/assets/door-rose-heart-v1.png"),
    ("Blue Star", "public/assets/star-key.png", "public/assets/star-door.png"),
    ("Sunny Sun", "public/assets/key-sunny-sun-v1.png", "public/assets/door-sunny-sun-v1.png"),
)

CAGE_CANARIES: tuple[tuple[str, str], ...] = (
    ("Golden Heart", "public/assets/cage-golden-heart-front-v5.webp"),
    ("Storybook Wood", "public/assets/cage-storybook-wood-front-v5.webp"),
    ("Moon Silver", "public/assets/cage-moon-silver-front-v5.webp"),
    ("Garden Vine", "public/assets/cage-garden-vine-front-v5.webp"),
)

CAGE_FRIENDS: tuple[tuple[str, str], ...] = (
    ("Fox", "public/assets/animal-fox.png"),
    ("Alpaca", "public/assets/animal-alpaca-v1.webp"),
)

MOON_WAND_PATH = "public/assets/weapon-moon-wand-v1.png"

TERRAIN_CANARIES: tuple[str, ...] = (
    "public/assets/floor-v3.png",
    "public/assets/wall-v3.png",
    "public/assets/floor-woodland-dirt-v1.png",
    "public/assets/wall-hedge-v1.png",
    "public/assets/water-v2.png",
    "public/assets/lava-v2.png",
)

AME_TERRAINS: tuple[tuple[str, str], ...] = (
    ("meadow grass", "public/assets/floor-meadow-grass-v1.png"),
    ("moon slate", "public/assets/floor-moon-slate-v1.png"),
    ("rose brick", "public/assets/floor-rose-brick-v1.png"),
    ("woodland dirt", "public/assets/floor-woodland-dirt-v1.png"),
)

AME_SOLIDS: tuple[tuple[str, tuple[int, int, int, int]], ...] = (
    ("paper", (255, 251, 240, 255)),
    ("ink", (45, 32, 56, 255)),
    ("50% gray", (128, 128, 128, 255)),
    ("magenta", (255, 0, 255, 255)),
    ("cyan", (0, 255, 255, 255)),
)

AME_SIZES: tuple[int, ...] = (56, 64, 77, 84, 103)

CONTOUR_ASSAY_BACKGROUNDS: tuple[tuple[str, tuple[int, int, int, int]], ...] = (
    ("black", (0, 0, 0, 255)),
    ("magenta", (255, 0, 255, 255)),
    ("cyan", (0, 255, 255, 255)),
)
CONTOUR_ASSAY_REGIONS: tuple[tuple[str, tuple[int, int, int, int]], ...] = (
    ("crown + hair", (190, 35, 322, 167)),
    ("cape + sleeve", (105, 185, 237, 317)),
    ("hem + boots", (180, 330, 312, 462)),
)
CONTOUR_ASSAY_SCALE = 4
CONTOUR_ASSAY_CANVAS = (1664, 2380)
CONTOUR_ASSAY_COLUMN_X = (16, 560, 1104)
CONTOUR_ASSAY_FULL_Y = 60
CONTOUR_ASSAY_CROP_FIRST_Y = 640
CONTOUR_ASSAY_CROP_ROW_STRIDE = 585

AME_V02 = {
    "A": "docs/source-assets/characters/ame/v02/ame-v02-candidate-a-generator-original.png",
    "B": "docs/source-assets/characters/ame/v02/ame-v02-candidate-b-generator-original.png",
    "C": "docs/source-assets/characters/ame/v02/ame-v02-candidate-c-generator-original.png",
    "turnaround": "docs/source-assets/characters/ame/v02/ame-v02-candidate-c-turnaround-study.png",
    "expressions": "docs/source-assets/characters/ame/v02/ame-v02-candidate-c-expression-study.png",
}


def _atomic_png(image: Image.Image, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        prefix=f".{destination.stem}-", suffix=".png", dir=destination.parent, delete=False
    ) as stream:
        temporary = Path(stream.name)
    try:
        save_image(image, temporary, "png", {"compress_level": 9, "optimize": False})
        os.replace(temporary, destination)
    finally:
        temporary.unlink(missing_ok=True)


def _atomic_bytes(value: bytes, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        mode="wb",
        prefix=f".{destination.stem}-",
        suffix=destination.suffix,
        dir=destination.parent,
        delete=False,
    ) as stream:
        temporary = Path(stream.name)
        stream.write(value)
        stream.flush()
        os.fsync(stream.fileno())
    try:
        os.replace(temporary, destination)
    finally:
        temporary.unlink(missing_ok=True)


def _checker(size: tuple[int, int], cell: int = 8) -> Image.Image:
    image = Image.new("RGBA", size, (246, 241, 251, 255))
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if ((x // cell) + (y // cell)) % 2:
                draw.rectangle(
                    (x, y, min(x + cell - 1, size[0] - 1), min(y + cell - 1, size[1] - 1)),
                    fill=(214, 207, 226, 255),
                )
    return image


def _label(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    value: str,
    fill: tuple[int, int, int, int] = (66, 48, 84, 255),
) -> None:
    draw.text(xy, value, font=ImageFont.load_default(), fill=fill)


def _fit(source: Image.Image, size: tuple[int, int], padding: int = 0) -> Image.Image:
    rgba = normalize_to_srgb_rgba(source)
    available = (max(1, size[0] - 2 * padding), max(1, size[1] - 2 * padding))
    scale = min(available[0] / rgba.width, available[1] / rgba.height)
    resized = premultiplied_resize(
        rgba,
        (max(1, round(rgba.width * scale)), max(1, round(rgba.height * scale))),
    )
    result = Image.new("RGBA", size, (0, 0, 0, 0))
    result.alpha_composite(
        resized, ((size[0] - resized.width) // 2, (size[1] - resized.height) // 2)
    )
    return result


def _contained(source: Image.Image, box: int) -> Image.Image:
    return _fit(source, (box, box))


def _tile_background(path: Path, size: tuple[int, int], tile_size: int = 64) -> Image.Image:
    with Image.open(path) as source:
        source.load()
        tile = source.convert("RGBA").resize((tile_size, tile_size), Image.Resampling.LANCZOS)
    result = Image.new("RGBA", size)
    for y in range(0, size[1], tile_size):
        for x in range(0, size[0], tile_size):
            result.paste(tile, (x, y))
    return result


def _candidate_images() -> tuple[dict[str, Any], dict[str, Image.Image], Image.Image]:
    record_path, record = resolve_record("ame-v02-source")
    _preflight_record(record_path, record)
    build = record["build"]
    source_path = _validate_build_source(record, build)
    profiles = {profile["id"]: profile for profile in build["profiles"]}
    candidate: dict[str, Image.Image] = {}
    for profile_id in ("field-256", "presentation-512"):
        with Image.open(source_path) as source:
            source.load()
            candidate[profile_id] = _prepare(
                source, "cutout-resize", profiles[profile_id], build
            )
    rejected_build = copy.deepcopy(build)
    extraction = rejected_build["backgroundExtraction"]
    rejected_build["backgroundExtraction"] = {
        "mode": "seeded-checkerboard",
        "recipeId": "ame-c-checker-core-c35-close2-rejected-proof",
        "maximumChroma": 35,
        "foregroundSeedPoints": extraction["foregroundSeedPoints"],
        "enclosedSeedPoints": extraction["enclosedSeedPoints"],
        "openingRadius": 6,
        "closingRadius": 2,
        "subjectGrowRadius": 0,
        "holeGrowRadius": extraction["holeGrowRadius"],
        "maxEnclosedComponentPixels": extraction["maxEnclosedComponentPixels"],
    }
    with Image.open(source_path) as source:
        source.load()
        c35 = _prepare(source, "cutout-resize", profiles["presentation-512"], rejected_build)
    return record, candidate, c35


def _candidate_derivative_inventory(
    record: dict[str, Any], prepared: dict[str, Image.Image]
) -> list[dict[str, Any]]:
    """Require proof derivatives to decode to the current source/recipe pixels."""

    source_path = ROOT / record["build"]["sourcePath"]
    build_sha256 = hashlib.sha256(json_bytes(record["build"])).hexdigest()
    record_path, _resolved = resolve_record(str(record["recordId"]))
    prompt_file = record.get("promptEvidence", {}).get("promptFile", {})
    rows: list[dict[str, Any]] = []
    for profile in record["build"]["profiles"]:
        profile_id = str(profile["id"])
        raw_output_path = str(profile["outputPath"])
        if Path(raw_output_path).is_absolute() or "\\" in raw_output_path:
            raise ValueError(
                f"Candidate proof output must be a repository-relative POSIX path: {raw_output_path}"
            )
        path = (ROOT / raw_output_path).resolve()
        if not inside_root(path):
            raise ValueError(f"Candidate proof output escapes the repository: {raw_output_path}")
        _validate_output_policy(record, path)
        if not path.is_file():
            raise FileNotFoundError(
                f"Candidate proof derivative is missing; run art:build -- --id {record['recordId']}: "
                f"{raw_output_path}"
            )
        with Image.open(path) as decoded:
            decoded.load()
            actual = decoded.convert("RGBA")
        expected = prepared[profile_id].convert("RGBA")
        if actual.size != expected.size or actual.tobytes() != expected.tobytes():
            raise ValueError(
                f"Candidate proof derivative is stale against the current source/recipe: {raw_output_path}"
            )
        rows.append(
            {
                "profile": profile_id,
                "path": raw_output_path,
                "sha256": sha256_file(path),
                "bytes": path.stat().st_size,
                **image_facts(path),
                "recordId": record["recordId"],
                "recordSha256": sha256_file(record_path),
                "artRecipeVersion": record["recipeVersion"],
                "derivativeRecipeVersion": record["derivativeRecipeVersion"],
                "buildSha256": build_sha256,
                "sourcePath": record["build"]["sourcePath"],
                "sourceSha256": sha256_file(source_path),
                "promptFilePath": prompt_file.get("path"),
                "promptFileSha256": prompt_file.get("sha256"),
                "verifiedPixelExactToCurrentRecipe": True,
            }
        )
    return rows


def _generic_actual_size() -> Image.Image:
    row_height = 116
    sheet = Image.new("RGBA", (720, 42 + row_height * len(CANARIES)), (255, 251, 240, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (14, 10), "ART CANARY / 1 CSS PX = 1 IMAGE PX / 64-84 ACTORS, 16-64 OPTICAL")
    _label(draw, (14, 25), "No directional shadow; checker reveals transparent bounds.")
    for row, canary in enumerate(CANARIES):
        y = 42 + row * row_height
        if row % 2:
            draw.rectangle((0, y, 719, y + row_height - 1), fill=(247, 242, 251, 255))
        _label(draw, (14, y + 9), Path(canary["path"]).name)
        _label(draw, (14, y + 25), str(canary["role"]), (105, 88, 120, 255))
        with Image.open(ROOT / canary["path"]) as source:
            source.load()
            x = 280
            for size in canary["sizes"]:
                backing = _checker((size, size), max(3, size // 6))
                backing.alpha_composite(_contained(source, size))
                sheet.alpha_composite(backing, (x, y + 8))
                _label(draw, (x, y + size + 12), f"{size}px")
                x += size + 54
    return sheet


def _generic_alpha_fringe() -> Image.Image:
    size, row_height = 64, 92
    colors = ((255, 255, 255, 255), (50, 42, 68, 255), (30, 193, 170, 255), (255, 84, 167, 255))
    sheet = Image.new("RGBA", (680, 42 + row_height * len(CANARIES)), (250, 246, 236, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (14, 10), "ALPHA EDGE CANARY / 64PX / LIGHT + DARK + TEAL + MAGENTA")
    _label(draw, (14, 25), "Inspect halos, matte contamination, clipped silhouettes, and border contact.")
    for row, canary in enumerate(CANARIES):
        y = 42 + row * row_height
        _label(draw, (14, y + 12), Path(canary["path"]).name)
        with Image.open(ROOT / canary["path"]) as source:
            source.load()
            sprite = _contained(source, size)
        for index, color in enumerate(colors):
            tile = Image.new("RGBA", (size, size), color)
            tile.alpha_composite(sprite)
            sheet.alpha_composite(tile, (280 + index * 86, y + 8))
    return sheet


def _terrain_repeat() -> Image.Image:
    tile_size, sample_3, sample_5, row_height = 64, 192, 320, 352
    sheet = Image.new("RGBA", (960, 48 + row_height * len(TERRAIN_CANARIES)), (250, 246, 236, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (14, 10), "TERRAIN CANARY / 1x + 3x3 + 5x5 REPEAT AT 64PX")
    _label(draw, (14, 25), "Inspect wrap seams, feature repetition, family scale, and hazard differentiation.")
    _label(draw, (280, 38), "1x")
    _label(draw, (375, 38), "3x3")
    _label(draw, (610, 38), "5x5")
    for row, relative in enumerate(TERRAIN_CANARIES):
        y = 48 + row * row_height
        _label(draw, (14, y + 12), Path(relative).name)
        single = _tile_background(ROOT / relative, (tile_size, tile_size), tile_size)
        repeated_3 = _tile_background(ROOT / relative, (sample_3, sample_3), tile_size)
        repeated_5 = _tile_background(ROOT / relative, (sample_5, sample_5), tile_size)
        sheet.alpha_composite(single, (280, y + 8))
        sheet.alpha_composite(repeated_3, (375, y + 8))
        sheet.alpha_composite(repeated_5, (610, y + 8))
        for origin_x, repeats in ((375, 3), (610, 5)):
            for boundary in range(1, repeats):
                x = origin_x + boundary * tile_size
                line_y = y + 8 + boundary * tile_size
                draw.line((x, y + 8, x, y + 8 + repeats * tile_size), fill=(255, 255, 255, 82))
                draw.line((origin_x, line_y, origin_x + repeats * tile_size, line_y), fill=(255, 255, 255, 82))
    return sheet


def _grayscale_rgba(source: Image.Image) -> Image.Image:
    rgba = normalize_to_srgb_rgba(source)
    gray = ImageOps.grayscale(rgba)
    return Image.merge("RGBA", (gray, gray, gray, rgba.getchannel("A")))


def _lock_grayscale() -> Image.Image:
    row_height = 205
    sheet = Image.new("RGBA", (1060, 52 + row_height * len(LOCK_CANARIES)), (255, 251, 240, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (14, 10), "LOCK PAIRS / ACTUAL-SIZE COLOUR + GRAYSCALE / HEART, STAR, SUN")
    _label(draw, (14, 26), "Motif must identify the pair without hue. Keys: 16/24/32px; doors: 64/84px.")
    _label(draw, (245, 42), "key colour")
    _label(draw, (405, 42), "key grayscale")
    _label(draw, (575, 42), "door colour")
    _label(draw, (810, 42), "door grayscale")
    for row, (label, key_path, door_path) in enumerate(LOCK_CANARIES):
        y = 52 + row * row_height
        if row % 2:
            draw.rectangle((0, y, sheet.width - 1, y + row_height - 1), fill=(247, 242, 251, 255))
        _label(draw, (14, y + 78), label)
        with Image.open(ROOT / key_path) as source:
            source.load()
            key = source.copy()
        with Image.open(ROOT / door_path) as source:
            source.load()
            door = source.copy()
        gray_key = _grayscale_rgba(key)
        gray_door = _grayscale_rgba(door)
        for base_x, artwork, sizes in (
            (235, key, (16, 24, 32)),
            (395, gray_key, (16, 24, 32)),
            (565, door, (64, 84)),
            (800, gray_door, (64, 84)),
        ):
            cursor = base_x
            for size in sizes:
                tile = Image.new("RGBA", (size, size), (45, 32, 56, 255))
                tile.alpha_composite(_contained(artwork, size))
                sheet.alpha_composite(tile, (cursor, y + 48))
                _label(draw, (cursor, y + 48 + size + 5), f"{size}px")
                cursor += size + 18
    return sheet


def _cage_face_safe() -> Image.Image:
    sizes = (40, 56, 84)
    row_height = 112
    rows = len(CAGE_CANARIES) * len(CAGE_FRIENDS)
    sheet = Image.new("RGBA", (820, 60 + row_height * rows), (255, 251, 240, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (14, 10), "CURRENT FRIEND + CAGE FACE-SAFE CANARY / 1 CSS PX = 1 IMAGE PX")
    _label(draw, (14, 27), "Visual gate: species and expression remain legible; reject any bar/lock crossing both eyes.")
    for column, size in enumerate(sizes):
        _label(draw, (355 + column * 145, 46), f"{size}px tile")
    row = 0
    for cage_label, cage_path in CAGE_CANARIES:
        with Image.open(ROOT / cage_path) as source:
            source.load()
            cage = source.copy()
        for friend_label, friend_path in CAGE_FRIENDS:
            y = 60 + row * row_height
            if row % 2:
                draw.rectangle((0, y, sheet.width - 1, y + row_height - 1), fill=(247, 242, 251, 255))
            _label(draw, (14, y + 40), f"{cage_label} / {friend_label}")
            with Image.open(ROOT / friend_path) as source:
                source.load()
                friend = source.copy()
            for column, size in enumerate(sizes):
                x = 345 + column * 145
                tile = _checker((size, size), max(3, size // 7))
                friend_size = max(1, round(size * 0.94))
                friend_sprite = _contained(friend, friend_size)
                tile.alpha_composite(
                    friend_sprite,
                    ((size - friend_size) // 2, size - friend_size - max(0, round(size * 0.01))),
                )
                tile.alpha_composite(_contained(cage, size))
                sheet.alpha_composite(tile, (x + (90 - size) // 2, y + 8))
            row += 1
    return sheet


def _held_weapon_socket(record: dict[str, Any], candidate: Image.Image) -> Image.Image:
    """Exercise the proposed hand socket with the current CSS held-weapon transform.

    This is review evidence, not approved per-weapon grip metadata. The outer
    layer is derived from the requested character CSS canvas because current
    `.player-sprite` occupies 95% of its player layer.
    """

    with Image.open(ROOT / MOON_WAND_PATH) as source:
        source.load()
        wand = source.copy()
    display_sizes = (56, 77, 103)
    sheet = Image.new("RGBA", (1080, 520), (255, 251, 240, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (14, 10), "CANDIDATE C + MOON WAND / DESIGN APPROVED / RUNTIME PENDING", (132, 24, 65, 255))
    _label(draw, (14, 27), "Current CSS proportions: character 95%; weapon 58%, right -1%, bottom 5%, rotate -7deg. Coral cross = proposed hand socket.")
    _label(draw, (14, 43), "Top is exact 1px output; lower panel is nearest-neighbour 3x inspection. Per-weapon grip calibration remains a runtime-family gate.")
    grip_x, grip_y = (float(value) for value in record["geometry"]["gripPoint"])
    for column, display_size in enumerate(display_sizes):
        origin_x = 18 + column * 352
        layer_size = max(1, round(display_size / 0.95))
        character_size = max(1, round(layer_size * 0.95))
        character_x = (layer_size - character_size) // 2
        character_y = layer_size - character_size
        weapon_size = max(1, round(layer_size * 0.58))
        weapon = _contained(wand, weapon_size).rotate(
            7,
            resample=Image.Resampling.BICUBIC,
            center=(weapon_size * 0.5, weapon_size * 0.8),
            expand=False,
        )
        weapon_x = round(layer_size * 1.01 - weapon_size)
        weapon_y = round(layer_size * 0.95 - weapon_size)
        panel = _tile_background(ROOT / AME_TERRAINS[0][1], (layer_size, layer_size), tile_size=64)
        panel.alpha_composite(premultiplied_resize(candidate, (character_size, character_size)), (character_x, character_y))
        panel.alpha_composite(weapon, (weapon_x, weapon_y))
        socket_x = character_x + round(grip_x * character_size)
        socket_y = character_y + round(grip_y * character_size)
        panel_draw = ImageDraw.Draw(panel, "RGBA")
        arm = max(2, round(layer_size * 0.025))
        panel_draw.line((socket_x - arm, socket_y, socket_x + arm, socket_y), fill=(255, 70, 52, 255), width=1)
        panel_draw.line((socket_x, socket_y - arm, socket_x, socket_y + arm), fill=(255, 70, 52, 255), width=1)
        _label(draw, (origin_x, 68), f"Ame canvas {display_size}px / player layer {layer_size}px")
        sheet.alpha_composite(panel, (origin_x + (324 - layer_size) // 2, 90))
        zoom = panel.resize((layer_size * 3, layer_size * 3), Image.Resampling.NEAREST)
        sheet.alpha_composite(zoom, (origin_x + (324 - zoom.width) // 2, 190))
    return sheet


def _comparison(c20: Image.Image) -> Image.Image:
    sheet = Image.new("RGBA", (1200, 390), (255, 251, 240, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (18, 12), "AME V02 / C DESIGN APPROVED / SOURCE-ONLY / RUNTIME PENDING", (132, 24, 65, 255))
    _label(draw, (18, 29), "Approved identity evidence; runtime derivative, rights, catalogue, and live-context gates remain open.")
    entries: list[tuple[str, str, Image.Image, bool]] = []
    with Image.open(ROOT / "public/assets/ame.png") as source:
        source.load()
        entries.append(("v01", "CURRENT RUNTIME / rollback", source.copy(), True))
    for name in ("A", "B"):
        with Image.open(ROOT / AME_V02[name]) as source:
            source.load()
            entries.append((name, "comparison / unapproved", source.copy(), False))
    entries.append(("C", "DESIGN APPROVED / RUNTIME PENDING", c20.copy(), True))
    for index, (name, status, image, transparent) in enumerate(entries):
        x = index * 300 + 25
        tile = _checker((250, 250), 16) if transparent else Image.new("RGBA", (250, 250), (245, 240, 232, 255))
        tile.alpha_composite(_fit(image, (250, 250), 5))
        sheet.alpha_composite(tile, (x, 62))
        draw.rectangle((x, 62, x + 249, 311), outline=(105, 88, 120, 255))
        _label(draw, (x, 322), f"{name}: {status}")
        detail = "transparent derivative proof" if transparent else "immutable RGB generator original"
        _label(draw, (x, 340), detail, (111, 94, 121, 255))
    return sheet


def _studies() -> Image.Image:
    sheet = Image.new("RGBA", (1400, 760), (255, 251, 240, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (18, 12), "CANDIDATE C STUDIES / APPROVED CONSTRUCTION REFERENCE / SOURCE-ONLY", (132, 24, 65, 255))
    _label(draw, (18, 29), "Identity/model-sheet evidence only; not separate runtime poses, portraits, or animation frames.")
    cells = (
        ("turnaround: front / true left / back", AME_V02["turnaround"]),
        ("expressions: eight identity-locked reads", AME_V02["expressions"]),
    )
    for index, (label, relative) in enumerate(cells):
        x = 20 + index * 690
        with Image.open(ROOT / relative) as source:
            source.load()
            fitted = _fit(source, (660, 650), 6)
        panel = Image.new("RGBA", (660, 650), (248, 243, 232, 255))
        panel.alpha_composite(fitted)
        sheet.alpha_composite(panel, (x, 62))
        draw.rectangle((x, 62, x + 659, 711), outline=(105, 88, 120, 255))
        _label(draw, (x, 722), label)
    return sheet


def _actual_sizes(c20: Image.Image) -> Image.Image:
    cell_width, row_height = 145, 132
    width = 215 + cell_width * len(AME_SIZES)
    backgrounds: list[tuple[str, Image.Image]] = [
        (name, Image.new("RGBA", (cell_width, 112), color)) for name, color in AME_SOLIDS
    ]
    backgrounds.extend(
        (name, _tile_background(ROOT / relative, (cell_width, 112)))
        for name, relative in AME_TERRAINS
    )
    sheet = Image.new("RGBA", (width, 58 + row_height * len(backgrounds)), (255, 251, 240, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (16, 10), "CANDIDATE C ACTUAL SIZE / DESIGN APPROVED / SOURCE-ONLY / RUNTIME PENDING", (132, 24, 65, 255))
    _label(draw, (16, 27), "Canvas sizes 56 / 64 / 77 / 84 / 103. No directional runtime light or cast shadow.")
    for column, size in enumerate(AME_SIZES):
        _label(draw, (215 + column * cell_width + 52, 44), f"{size}px")
    for row, (name, background) in enumerate(backgrounds):
        y = 58 + row * row_height
        _label(draw, (16, y + 48), name)
        for column, size in enumerate(AME_SIZES):
            x = 215 + column * cell_width
            tile = background.copy()
            sprite = premultiplied_resize(c20, (size, size))
            tile.alpha_composite(sprite, ((tile.width - size) // 2, (tile.height - size) // 2))
            sheet.alpha_composite(tile, (x, y))
            draw.rectangle((x, y, x + tile.width - 1, y + tile.height - 1), outline=(78, 60, 91, 255))
    return sheet


def _candidate_fringe(candidate: Image.Image) -> Image.Image:
    tile_size = 190
    backgrounds: list[tuple[str, Image.Image]] = [
        (name, Image.new("RGBA", (tile_size, tile_size), color)) for name, color in AME_SOLIDS
    ]
    backgrounds.append(("meadow terrain", _tile_background(ROOT / AME_TERRAINS[0][1], (tile_size, tile_size))))
    sheet = Image.new("RGBA", (720, 790), (255, 251, 240, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (16, 10), "CANDIDATE C ALPHA / FRINGE / DESIGN APPROVED / RUNTIME PENDING", (132, 24, 65, 255))
    _label(draw, (16, 27), "Named outer-contour matte; inspect curls, cream costume, eyes, boots, and cape edges.")
    sprite = premultiplied_resize(candidate, (190, 190))
    for index, (name, background) in enumerate(backgrounds):
        x, y = 16 + (index % 3) * 230, 58 + (index // 3) * 235
        panel = background.copy()
        panel.alpha_composite(sprite)
        sheet.alpha_composite(panel, (x, y))
        draw.rectangle((x, y, x + 189, y + 189), outline=(78, 60, 91, 255))
        _label(draw, (x, y + 198), name)
    closeups = (
        ("hair/curl edge pixels", candidate.crop((140, 35, 375, 230)), (45, 32, 56, 255)),
        ("cream/skirt edge pixels", candidate.crop((140, 245, 375, 440)), (255, 0, 255, 255)),
    )
    for index, (name, crop, color) in enumerate(closeups):
        x = 16 + index * 345
        enlarged = crop.resize((300, 195), Image.Resampling.NEAREST)
        panel = Image.new("RGBA", enlarged.size, color)
        panel.alpha_composite(enlarged)
        sheet.alpha_composite(panel, (x, 550))
        _label(draw, (x, 754), name)
    return sheet


def _contour_edge_proof(
    candidate: Image.Image,
    *,
    extraction_recipe_id: str,
    derivative_recipe_version: str,
) -> Image.Image:
    """Show the accepted contour matte at 1:1 and edge crops at exactly 400%."""

    sheet = Image.new("RGBA", CONTOUR_ASSAY_CANVAS, (255, 251, 240, 255))
    draw = ImageDraw.Draw(sheet)
    _label(
        draw,
        (16, 10),
        "CANDIDATE C CONTOUR MATTE / 1:1 + 400% / DESIGN APPROVED / RUNTIME PENDING",
        (132, 24, 65, 255),
    )
    _label(
        draw,
        (16, 27),
        f"Extraction recipe: {extraction_recipe_id}",
    )
    _label(draw, (16, 42), f"Derivative recipe: {derivative_recipe_version}")
    for column, (name, color) in enumerate(CONTOUR_ASSAY_BACKGROUNDS):
        x = CONTOUR_ASSAY_COLUMN_X[column]
        panel = Image.new("RGBA", (512, 512), color)
        panel.alpha_composite(candidate)
        sheet.alpha_composite(panel, (x, CONTOUR_ASSAY_FULL_Y))
        _label(draw, (x, 580), f"1:1 presentation-512 on {name} #{color[0]:02X}{color[1]:02X}{color[2]:02X}")
    y = CONTOUR_ASSAY_CROP_FIRST_Y - 20
    for region_name, crop_box in CONTOUR_ASSAY_REGIONS:
        _label(draw, (16, y), f"{region_name} / exact nearest-neighbour 400% pixels")
        crop_width = (crop_box[2] - crop_box[0]) * CONTOUR_ASSAY_SCALE
        crop_height = (crop_box[3] - crop_box[1]) * CONTOUR_ASSAY_SCALE
        crop = candidate.crop(crop_box).resize(
            (crop_width, crop_height), Image.Resampling.NEAREST
        )
        for column, (background_name, color) in enumerate(CONTOUR_ASSAY_BACKGROUNDS):
            x = CONTOUR_ASSAY_COLUMN_X[column]
            panel = Image.new("RGBA", (528, 528), color)
            panel.alpha_composite(crop)
            sheet.alpha_composite(panel, (x, y + 20))
            _label(draw, (x, y + 555), f"{background_name} #{color[0]:02X}{color[1]:02X}{color[2]:02X}")
        y += CONTOUR_ASSAY_CROP_ROW_STRIDE
    _label(
        draw,
        (16, 2360),
        "Acceptance: no visible checker/shadow islands or matte spikes; intentional plum contour retained. Hidden RGB edge dilation is alpha-zero.",
        (132, 24, 65, 255),
    )
    return sheet


def _registration(record: dict[str, Any], c20: Image.Image) -> Image.Image:
    sheet = Image.new("RGBA", (1120, 650), (255, 251, 240, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (16, 10), "CANDIDATE C REGISTRATION / DESIGN APPROVED / SOURCE-ONLY / RUNTIME PENDING", (132, 24, 65, 255))
    _label(draw, (16, 27), "Review coordinates only. Baseline/pivot=(.50,.90), hand socket=(.66,.58).")
    origin = (28, 70)
    panel = _checker((512, 512), 16)
    panel.alpha_composite(c20)
    sheet.alpha_composite(panel, origin)
    overlay = ImageDraw.Draw(sheet, "RGBA")
    ox, oy = origin
    geometry = record["geometry"]

    def rectangle(rect: list[float]) -> tuple[int, int, int, int]:
        x, y, width, height = rect
        return (ox + round(x * 512), oy + round(y * 512), ox + round((x + width) * 512), oy + round((y + height) * 512))

    overlay.rectangle(rectangle(geometry["visibleBounds"]), outline=(22, 116, 214, 255), width=2)
    overlay.rectangle(rectangle(geometry["faceBox"]), outline=(235, 64, 122, 255), width=2)
    overlay.rectangle(rectangle([0.30, 0.08, 0.40, 0.33]), outline=(236, 169, 37, 255), width=2)
    overlay.rectangle(rectangle([0.25, 0.35, 0.52, 0.34]), outline=(124, 86, 194, 255), width=2)
    pivot_x = ox + round(geometry["pivot"][0] * 512)
    baseline_y = oy + round(geometry["pivot"][1] * 512)
    overlay.line((ox, baseline_y, ox + 512, baseline_y), fill=(14, 137, 104, 230), width=2)
    overlay.ellipse((pivot_x - 6, baseline_y - 6, pivot_x + 6, baseline_y + 6), fill=(14, 137, 104, 255))
    grip_x = ox + round(geometry["gripPoint"][0] * 512)
    grip_y = oy + round(geometry["gripPoint"][1] * 512)
    overlay.line((grip_x - 10, grip_y, grip_x + 10, grip_y), fill=(255, 78, 52, 255), width=3)
    overlay.line((grip_x, grip_y - 10, grip_x, grip_y + 10), fill=(255, 78, 52, 255), width=3)
    legend = (
        ("blue: visible bounds", (22, 116, 214, 255)),
        ("pink: face-safe box", (235, 64, 122, 255)),
        ("gold: hair envelope", (236, 169, 37, 255)),
        ("lavender: cape/backpack envelope", (124, 86, 194, 255)),
        ("green: baseline and pivot", (14, 137, 104, 255)),
        ("coral: proposed hand socket; Moon Wand proof separate", (255, 78, 52, 255)),
    )
    _label(draw, (565, 84), "Overlay legend")
    for index, (label, color) in enumerate(legend):
        y = 110 + index * 30
        draw.rectangle((565, y, 579, y + 14), fill=color)
        _label(draw, (588, y + 2), label)
    silhouette = Image.new("RGBA", c20.size, (45, 32, 56, 255))
    silhouette.putalpha(c20.getchannel("A"))
    small = premultiplied_resize(silhouette, (64, 64))
    for index, color in enumerate(((255, 251, 240, 255), (128, 128, 128, 255), (255, 0, 255, 255))):
        tile = Image.new("RGBA", (96, 96), color)
        tile.alpha_composite(small, (16, 16))
        sheet.alpha_composite(tile, (565 + index * 115, 330))
    _label(draw, (565, 435), "64px silhouette on paper / gray / magenta")
    bounds = alpha_bounds(c20, 3)
    _label(draw, (565, 470), f"alpha>=3 px LTRB: {bounds['pixelsLTRB']}")
    _label(draw, (565, 487), "normalized: " + ", ".join(f"{value:.4f}" for value in bounds["normalizedLTRB"]))
    _label(draw, (565, 530), "SOURCE-ONLY BROWSER HARNESS PROVIDED SEPARATELY", (132, 24, 65, 255))
    _label(draw, (565, 548), "INCLUDED: Moon Wand/current-CSS provisional socket proof")
    _label(draw, (565, 565), "DEFERRED: full per-weapon calibration and active pointer")
    _label(draw, (565, 582), "DEFERRED: true in-game directional-light pass")
    return sheet


def _extraction(candidate: Image.Image, c35: Image.Image) -> Image.Image:
    sheet = Image.new("RGBA", (1280, 650), (255, 251, 240, 255))
    draw = ImageDraw.Draw(sheet)
    _label(draw, (16, 10), "CANDIDATE C EXTRACTION / DESIGN APPROVED / SOURCE-ONLY / RUNTIME PENDING", (132, 24, 65, 255))
    _label(draw, (16, 27), "Chroma-core C35 is deliberately rejected: it disconnects low-chroma cream skirt/short regions.")
    with Image.open(ROOT / AME_V02["C"]) as source:
        source.load()
        raw = _fit(source, (340, 340), 4)
    panels = (
        ("immutable RGB source (painted checker)", raw, (248, 243, 232, 255)),
        ("outer-contour matte on ink", _fit(candidate, (340, 340), 4), (45, 32, 56, 255)),
        ("chroma-core C35 REJECTED", _fit(c35, (340, 340), 4), (255, 0, 255, 255)),
    )
    for index, (label, sprite, color) in enumerate(panels):
        x = 20 + index * 410
        tile = Image.new("RGBA", (340, 340), color)
        tile.alpha_composite(sprite)
        sheet.alpha_composite(tile, (x, 62))
        draw.rectangle((x, 62, x + 339, 401), outline=(78, 60, 91, 255))
        _label(draw, (x, 412), label)
    alpha = candidate.getchannel("A")
    mask = Image.merge("RGBA", (alpha, alpha, alpha, Image.new("L", alpha.size, 255)))
    sheet.alpha_composite(_fit(mask, (220, 180), 2), (20, 455))
    _label(draw, (20, 632), "outer-contour alpha: named holes + protected whites")
    closeups = (
        ("outer-contour cream/skirt", candidate.crop((135, 230, 380, 465)), (45, 32, 56, 255)),
        ("C35 rejected gap close-up", c35.crop((135, 230, 380, 465)), (255, 0, 255, 255)),
    )
    for index, (label, crop, color) in enumerate(closeups):
        x = 300 + index * 410
        enlarged = crop.resize((300, 180), Image.Resampling.NEAREST)
        tile = Image.new("RGBA", enlarged.size, color)
        tile.alpha_composite(enlarged)
        sheet.alpha_composite(tile, (x, 455))
        _label(draw, (x, 638), label)
    return sheet


def _browser_harness() -> bytes:
    return """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ame Candidate C design-approved source-only context harness</title><style>
:root { font-family:system-ui,sans-serif;color:#fff;background:#21182a } * { box-sizing:border-box } body { margin:0;min-width:320px }
header { min-height:86px;padding:10px 16px;background:#3a2548;border-bottom:3px solid #ff6f9f }
h1 { margin:0 0 4px;font-size:18px } p { margin:3px 0;font-size:12px } .gate { color:#ffd6e5;font-weight:800 }
main { display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:8px;height:calc(100vh - 86px);min-height:270px }
.scene { position:relative;overflow:hidden;border:2px solid #f8e8ff;background-repeat:repeat;background-size:64px 64px }
.scene::after { content:"";position:absolute;left:8%;right:8%;top:calc(50% + var(--baseline-offset));border-top:1px dashed rgba(45,32,56,.75) }
.meadow { background-image:url('../../../public/assets/floor-meadow-grass-v1.png') }
.moon { background-image:url('../../../public/assets/floor-moon-slate-v1.png') }
.rose { background-image:url('../../../public/assets/floor-rose-brick-v1.png') }
.sprite { position:absolute;left:50%;top:50%;width:var(--size);height:var(--size);transform:translate(-50%,-50%);object-fit:contain }
.tag { position:absolute;left:7px;top:7px;padding:4px 6px;background:rgba(45,32,56,.9);font:700 12px ui-monospace,monospace;z-index:2 }
.note { position:absolute;left:7px;right:7px;bottom:7px;padding:4px 6px;background:rgba(45,32,56,.84);font-size:11px;z-index:2 }
@media (max-width:620px) { main { gap:4px;padding:4px }.tag,.note { font-size:9px } header { padding:8px } }
</style></head><body><header><h1>Candidate C - design-approved source-only context harness</h1>
<p class="gate">IDENTITY/CONSTRUCTION APPROVED; RUNTIME PENDING. This page does not use the active catalogue or alter public runtime art.</p>
<p>Exact CSS canvases: 56 / 77 / 103 px. Dashed line marks the recorded 0.90 pivot/baseline. No cast shadow or directional runtime light.</p></header>
<main>
<section class="scene meadow" style="--size:56px;--baseline-offset:22.4px"><span class="tag">56px / meadow</span><img class="sprite" src="../ame/v02/ame-v02-candidate-c-field-256.webp" alt="Candidate C at 56 pixels"><span class="note">small field read</span></section>
<section class="scene moon" style="--size:77px;--baseline-offset:30.8px"><span class="tag">77px / moon slate</span><img class="sprite" src="../ame/v02/ame-v02-candidate-c-presentation-512.webp" alt="Candidate C at 77 pixels"><span class="note">standard field read</span></section>
<section class="scene rose" style="--size:103px;--baseline-offset:41.2px"><span class="tag">103px / rose brick</span><img class="sprite" src="../ame/v02/ame-v02-candidate-c-presentation-512.webp" alt="Candidate C at 103 pixels"><span class="note">large field read</span></section>
</main></body></html>
""".encode("utf-8")


def _html(names: list[str], derivative_paths: list[str]) -> bytes:
    def proof_card(name: str) -> str:
        label = html.escape(name, quote=True)
        url = quote(name, safe="/._-")
        pixel_proof = "contour-edge-400pct" in name
        class_name = "pixel-proof" if pixel_proof else ""
        note = (
            " - native 1:1 / nearest-neighbour 400%; scroll or open directly, do not browser-scale"
            if pixel_proof
            else ""
        )
        return (
            f'<figure class="{class_name}"><a href="{url}"><img src="{url}" '
            f'alt="{label}"></a><figcaption>{label}{note}</figcaption></figure>'
        )

    def derivative_card(path: str) -> str:
        relative = path.removeprefix("artifacts/art-proofs/")
        url = "../" + quote(relative, safe="/._-")
        label = html.escape(path, quote=True)
        alt = html.escape(Path(path).name, quote=True)
        return (
            f'<figure><a href="{url}"><img src="{url}" alt="{alt}"></a>'
            f'<figcaption>{label} - current-recipe pixel verification passed</figcaption></figure>'
        )

    cards = "\n".join(proof_card(name) for name in names)
    derivative_cards = "\n".join(derivative_card(path) for path in derivative_paths)
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ame v02 design-approved source-only art proofs</title><style>
:root {{ font-family: system-ui,sans-serif; background:#fffaf0; color:#2d2038 }} body {{ margin:0 auto;max-width:1500px;padding:24px }}
h1 {{ margin:0 0 8px }} .gate {{ border:3px solid #841841;background:#ffe7ef;padding:14px;font-weight:800 }}
.notes {{ background:#f1ebf6;border-left:5px solid #7655b7;padding:12px 16px }} figure {{ margin:28px 0 }}
img {{ max-width:100%;height:auto;border:1px solid #695879;background:white }} .pixel-proof {{ overflow:auto }} .pixel-proof img {{ max-width:none;image-rendering:pixelated }} figcaption {{ margin-top:6px;font:600 14px ui-monospace,monospace }}
</style></head><body><h1>Ame v02 design and runtime-gate proofs</h1>
<p class="gate">CANDIDATE C IDENTITY/CONSTRUCTION IS APPROVED; RUNTIME PUBLISHING IS PENDING. No runtime pointer or public asset changed.</p>
<div class="notes"><p>Review face warmth and age, golden-blonde layered hair, clearly blue irises, mint/lavender/backpack identity, silhouette, registration, outer-contour alpha extraction, and actual-size readability.</p>
<p>The named luma180/chroma10/close2 outer-contour barrier is the accepted proof recipe. Chroma-core C35 appears only as a rejected regression because it removes cream skirt/short connectivity.</p>
<p><a href="ame-v02-browser-context.html">Open the source-only responsive browser harness</a> for 56/77/103 CSS px evidence at 844x390, 960x540, and 1280x720.</p>
<p>The Moon Wand board exercises the proposed socket with the current CSS transform; exact per-weapon grip calibration remains a Plan 03 runtime-family gate. The active-catalogue pointer and true in-game lighting pass are also deferred. Static composites and the harness are optical evidence, not runtime-publish approval.</p></div>
<h2>Canonical static candidate derivatives (proof-only)</h2>{derivative_cards}
<h2>Comparison and validation sheets</h2>{cards}</body></html>
""".encode("utf-8")


def generate_canary_proofs() -> dict[str, Any]:
    required = [entry["path"] for entry in CANARIES]
    required.extend(TERRAIN_CANARIES)
    required.extend(relative for _, relative in AME_TERRAINS)
    required.extend(path for _label_value, key, door in LOCK_CANARIES for path in (key, door))
    required.extend(path for _label_value, path in CAGE_CANARIES)
    required.extend(path for _label_value, path in CAGE_FRIENDS)
    required.append(MOON_WAND_PATH)
    required.extend(AME_V02.values())
    required.append("public/assets/ame.png")
    for relative in sorted(set(required)):
        if not (ROOT / relative).is_file():
            raise FileNotFoundError(f"Canary input is missing: {relative}")

    record, prepared, c35 = _candidate_images()
    candidate = prepared["presentation-512"]
    derivative_inventory = _candidate_derivative_inventory(record, prepared)
    destination = PROOF_ROOT / "canary"
    outputs = {
        "actualSize": destination / "canary-actual-size.png",
        "alphaFringe": destination / "canary-alpha-fringe.png",
        "terrainRepeats": destination / "canary-terrain-repeats.png",
        "lockGrayscale": destination / "canary-lock-grayscale.png",
        "cageFaceSafe": destination / "canary-cage-face-safe.png",
        "ameComparison": destination / "ame-v02-comparison.png",
        "ameStudies": destination / "ame-v02-model-studies.png",
        "ameActualSizes": destination / "ame-v02-actual-sizes.png",
        "ameAlphaFringe": destination / "ame-v02-alpha-fringe.png",
        "ameContourEdge400Percent": destination / "ame-v02-contour-edge-400pct.png",
        "ameRegistration": destination / "ame-v02-registration.png",
        "ameHeldWeapon": destination / "ame-v02-held-moon-wand.png",
        "ameExtraction": destination / "ame-v02-extraction.png",
    }
    images = {
        "actualSize": _generic_actual_size(),
        "alphaFringe": _generic_alpha_fringe(),
        "terrainRepeats": _terrain_repeat(),
        "lockGrayscale": _lock_grayscale(),
        "cageFaceSafe": _cage_face_safe(),
        "ameComparison": _comparison(candidate),
        "ameStudies": _studies(),
        "ameActualSizes": _actual_sizes(candidate),
        "ameAlphaFringe": _candidate_fringe(candidate),
        "ameContourEdge400Percent": _contour_edge_proof(
            candidate,
            extraction_recipe_id=record["build"]["backgroundExtraction"]["recipeId"],
            derivative_recipe_version=record["derivativeRecipeVersion"],
        ),
        "ameRegistration": _registration(record, candidate),
        "ameHeldWeapon": _held_weapon_socket(record, candidate),
        "ameExtraction": _extraction(candidate, c35),
    }
    for proof_id, image in images.items():
        _atomic_png(image, outputs[proof_id])

    def evidence(relative: str) -> dict[str, Any]:
        path = ROOT / relative
        return {"path": relative, "sha256": sha256_file(path), "bytes": path.stat().st_size, **image_facts(path)}

    inventory = {
        "schema": "maze-art-canary-inventory/v1",
        "note": "Timestamps are omitted so identical inputs and pinned encoders remain byte-reproducible.",
        "approvalGate": "Candidate C identity/construction is design-approved; runtime publishing and rights review remain pending.",
        "runtimeImpact": {"publicAssetWrites": 0, "runtimePointerChanges": 0, "encodedByteDelta": 0, "decodedByteDelta": 0},
        "encoderEnvironment": encoder_environment(),
        "candidateRecipe": {
            "recordId": record["recordId"],
            "artRecipeVersion": record["recipeVersion"],
            "derivativeRecipeVersion": record["derivativeRecipeVersion"],
            "buildSha256": hashlib.sha256(json_bytes(record["build"])).hexdigest(),
            "extractionRecipeId": record["build"]["backgroundExtraction"]["recipeId"],
            "backgroundExtraction": record["build"]["backgroundExtraction"],
            "recordSha256": sha256_file(resolve_record(str(record["recordId"]))[0]),
            "sourceSha256": sha256_file(ROOT / record["build"]["sourcePath"]),
            "promptFileSha256": record.get("promptEvidence", {}).get("promptFile", {}).get("sha256"),
            "alphaBounds": alpha_bounds(candidate, 3),
        },
        "canaries": [{**entry, **evidence(entry["path"])} for entry in CANARIES],
        "terrainCanaries": [evidence(relative) for relative in TERRAIN_CANARIES],
        "lockCanaries": [
            {
                "label": label,
                "key": evidence(key),
                "door": evidence(door),
                "proofModes": ["colour", "grayscale"],
            }
            for label, key, door in LOCK_CANARIES
        ],
        "cageCanaries": [
            {"label": label, **evidence(path)} for label, path in CAGE_CANARIES
        ],
        "cageFriendCanaries": [
            {"label": label, **evidence(path)} for label, path in CAGE_FRIENDS
        ],
        "ameEvidence": [evidence(relative) for relative in sorted(set(AME_V02.values()) | {"public/assets/ame.png"})],
        "candidateDerivatives": derivative_inventory,
    }
    inventory_path = destination / "canary-inventory.json"
    _atomic_bytes(json_bytes(inventory), inventory_path)
    html_path = destination / "index.html"
    _atomic_bytes(
        _html(
            [outputs[key].name for key in sorted(outputs)],
            [row["path"] for row in derivative_inventory],
        ),
        html_path,
    )
    harness_path = destination / "ame-v02-browser-context.html"
    _atomic_bytes(_browser_harness(), harness_path)
    index = {
        "schema": "maze-art-proof-index/v1",
        "proofRoot": posix_relative(destination),
        "approvalGate": "Candidate C identity/construction is design-approved; runtime publishing and rights review remain pending.",
        "pipelineInputs": [
            {
                "path": posix_relative(path),
                "sha256": sha256_file(path),
                "bytes": path.stat().st_size,
            }
            for path in (*PIPELINE_INPUT_PATHS, REQUIREMENTS_PATH)
        ],
        "deferredRuntimeGates": [
            "full eight-weapon calibration against approved per-weapon grip metadata; the Moon Wand/current-CSS socket canary is included now",
            "active-catalogue pointer integration and true in-game directional-light review",
        ],
        "candidateDerivatives": derivative_inventory,
        "proofContracts": {
            "ameContourEdge400Percent": {
                "sourceProfile": "presentation-512",
                "sourceDerivativeSha256": next(
                    row["sha256"]
                    for row in derivative_inventory
                    if row["profile"] == "presentation-512"
                ),
                "canvasPixels": list(CONTOUR_ASSAY_CANVAS),
                "fullSpriteScale": "1:1",
                "edgeCropScale": f"{CONTOUR_ASSAY_SCALE}:1",
                "edgeCropResample": "nearest-neighbour",
                "compositing": "straight RGBA source over opaque sRGB proof background",
                "backgrounds": [
                    f"#{color[0]:02X}{color[1]:02X}{color[2]:02X}"
                    for _name, color in CONTOUR_ASSAY_BACKGROUNDS
                ],
                "sourceCropBoxesLTRBExclusive": [
                    {"label": label, "pixels": list(pixels)}
                    for label, pixels in CONTOUR_ASSAY_REGIONS
                ],
                "fullSpritePanelsLTRBExclusive": [
                    {
                        "background": f"#{color[0]:02X}{color[1]:02X}{color[2]:02X}",
                        "pixels": [
                            CONTOUR_ASSAY_COLUMN_X[index],
                            CONTOUR_ASSAY_FULL_Y,
                            CONTOUR_ASSAY_COLUMN_X[index] + 512,
                            CONTOUR_ASSAY_FULL_Y + 512,
                        ],
                    }
                    for index, (_name, color) in enumerate(CONTOUR_ASSAY_BACKGROUNDS)
                ],
                "edgeCropPanelsLTRBExclusive": [
                    {
                        "region": region_label,
                        "background": f"#{color[0]:02X}{color[1]:02X}{color[2]:02X}",
                        "pixels": [
                            CONTOUR_ASSAY_COLUMN_X[column],
                            CONTOUR_ASSAY_CROP_FIRST_Y
                            + row * CONTOUR_ASSAY_CROP_ROW_STRIDE,
                            CONTOUR_ASSAY_COLUMN_X[column]
                            + (crop_box[2] - crop_box[0]) * CONTOUR_ASSAY_SCALE,
                            CONTOUR_ASSAY_CROP_FIRST_Y
                            + row * CONTOUR_ASSAY_CROP_ROW_STRIDE
                            + (crop_box[3] - crop_box[1]) * CONTOUR_ASSAY_SCALE,
                        ],
                    }
                    for row, (region_label, crop_box) in enumerate(CONTOUR_ASSAY_REGIONS)
                    for column, (_background_name, color) in enumerate(CONTOUR_ASSAY_BACKGROUNDS)
                ],
                "runtimeStatus": record["runtimeStatus"],
                "approvalStatus": record["approvalStatus"],
                "gateLabel": "DESIGN APPROVED / RUNTIME PENDING",
            }
        },
        "outputs": [
            {
                "id": proof_id,
                "path": posix_relative(path),
                "sha256": sha256_file(path),
                "bytes": path.stat().st_size,
                **image_facts(path),
            }
            for proof_id, path in sorted(outputs.items())
        ],
        "html": {"path": posix_relative(html_path), "sha256": sha256_file(html_path), "bytes": html_path.stat().st_size},
        "browserHarness": {"path": posix_relative(harness_path), "sha256": sha256_file(harness_path), "bytes": harness_path.stat().st_size},
        "inventory": {"path": posix_relative(inventory_path), "sha256": sha256_file(inventory_path), "bytes": inventory_path.stat().st_size},
    }
    _atomic_bytes(json_bytes(index), destination / "proof-index.json")
    return index
