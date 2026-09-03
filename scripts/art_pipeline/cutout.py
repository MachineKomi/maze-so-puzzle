"""Alpha-safe cutout preparation used by versioned derivative builds."""

from __future__ import annotations

from collections import deque
from typing import Iterable

import numpy as np
from PIL import Image, ImageCms, ImageOps


def normalize_to_srgb_rgba(source: Image.Image) -> Image.Image:
    """Apply EXIF orientation and an embedded ICC profile when one is present."""

    oriented = ImageOps.exif_transpose(source)
    icc_profile = oriented.info.get("icc_profile")
    if not icc_profile:
        return oriented.convert("RGBA")

    alpha = oriented.getchannel("A") if "A" in oriented.getbands() else None
    rgb = oriented.convert("RGB")
    try:
        input_profile = ImageCms.ImageCmsProfile(bytes(icc_profile))
        output_profile = ImageCms.createProfile("sRGB")
        converted = ImageCms.profileToProfile(
            rgb,
            input_profile,
            output_profile,
            outputMode="RGB",
        ).convert("RGBA")
    except (ImageCms.PyCMSError, OSError, ValueError, TypeError):
        # Validation reports the malformed/unusable profile separately. Keeping
        # pixel values is safer than pretending an unknown conversion occurred.
        converted = rgb.convert("RGBA")
    if alpha is not None:
        converted.putalpha(alpha)
    return converted


def extract_edge_connected_background(
    source: Image.Image,
    target_rgb: tuple[int, int, int],
    tolerance: int,
) -> Image.Image:
    """Clear only target-like pixels connected to the outside canvas edge."""

    image = normalize_to_srgb_rgba(source)
    pixels = np.asarray(image, dtype=np.uint8).copy()
    height, width, _ = pixels.shape
    target = np.asarray(target_rgb, dtype=np.int16)
    difference = np.max(
        np.abs(pixels[:, :, :3].astype(np.int16) - target[None, None, :]),
        axis=2,
    )
    candidates = (difference <= tolerance) & (pixels[:, :, 3] > 0)
    visited = np.zeros((height, width), dtype=np.bool_)
    queue: deque[tuple[int, int]] = deque()
    for x in range(width):
        queue.append((0, x))
        queue.append((height - 1, x))
    for y in range(1, height - 1):
        queue.append((y, 0))
        queue.append((y, width - 1))

    while queue:
        y, x = queue.popleft()
        if visited[y, x] or not candidates[y, x]:
            continue
        visited[y, x] = True
        if x > 0:
            queue.append((y, x - 1))
        if x + 1 < width:
            queue.append((y, x + 1))
        if y > 0:
            queue.append((y - 1, x))
        if y + 1 < height:
            queue.append((y + 1, x))

    pixels[visited, 3] = 0
    return Image.fromarray(pixels, "RGBA")


def _connected_mask(
    candidates: np.ndarray,
    seed_points: Iterable[tuple[int, int]],
) -> np.ndarray:
    """Return candidate pixels connected to an explicit, deterministic seed set."""

    height, width = candidates.shape
    visited = np.zeros((height, width), dtype=np.bool_)
    queue: deque[tuple[int, int]] = deque()
    for y, x in seed_points:
        if not (0 <= y < height and 0 <= x < width):
            raise ValueError(f"background seed ({x}, {y}) is outside the source canvas")
        if not candidates[y, x]:
            raise ValueError(f"background seed ({x}, {y}) does not match the checker classifier")
        queue.append((y, x))
    while queue:
        y, x = queue.popleft()
        if visited[y, x] or not candidates[y, x]:
            continue
        visited[y, x] = True
        if x > 0:
            queue.append((y, x - 1))
        if x + 1 < width:
            queue.append((y, x + 1))
        if y > 0:
            queue.append((y - 1, x))
        if y + 1 < height:
            queue.append((y + 1, x))
    return visited


def _binary_dilate(mask: np.ndarray, radius: int) -> np.ndarray:
    height, width = mask.shape
    result = mask.copy()
    for _ in range(max(0, int(radius))):
        padded = np.pad(result, 1, mode="constant", constant_values=False)
        result = np.logical_or.reduce(
            [
                padded[y_offset : y_offset + height, x_offset : x_offset + width]
                for y_offset in range(3)
                for x_offset in range(3)
            ]
        )
    return result


def _binary_erode(mask: np.ndarray, radius: int) -> np.ndarray:
    height, width = mask.shape
    result = mask.copy()
    for _ in range(max(0, int(radius))):
        padded = np.pad(result, 1, mode="constant", constant_values=False)
        result = np.logical_and.reduce(
            [
                padded[y_offset : y_offset + height, x_offset : x_offset + width]
                for y_offset in range(3)
                for x_offset in range(3)
            ]
        )
    return result


def _normalized_seed(point: Iterable[float], width: int, height: int) -> tuple[int, int]:
    values = tuple(float(value) for value in point)
    if len(values) != 2 or not all(0.0 <= value <= 1.0 for value in values):
        raise ValueError("seed points must be normalized [x, y] pairs")
    x = min(width - 1, round(values[0] * (width - 1)))
    y = min(height - 1, round(values[1] * (height - 1)))
    return y, x


def _fill_binary_holes(subject: np.ndarray) -> np.ndarray:
    height, width = subject.shape
    background = ~subject
    edge_seeds: list[tuple[int, int]] = []
    for x in range(width):
        if background[0, x]:
            edge_seeds.append((0, x))
        if background[height - 1, x]:
            edge_seeds.append((height - 1, x))
    for y in range(1, height - 1):
        if background[y, 0]:
            edge_seeds.append((y, 0))
        if background[y, width - 1]:
            edge_seeds.append((y, width - 1))
    exterior = _connected_mask(background, edge_seeds)
    return ~exterior


def extract_seeded_checkerboard_background(
    source: Image.Image,
    *,
    maximum_chroma: int,
    foreground_seed_points: Iterable[Iterable[float]],
    enclosed_seed_points: Iterable[Iterable[float]] = (),
    opening_radius: int = 2,
    closing_radius: int = 10,
    subject_grow_radius: int = 4,
    hole_grow_radius: int = 3,
    max_enclosed_component_pixels: int = 2048,
) -> Image.Image:
    """Recover a checker-backed silhouette from chroma core plus named holes.

    Low-chroma whites are never globally erased. A morphologically closed
    high-chroma subject core is selected through one recorded foreground seed,
    and enclosed neutral areas are filled to protect costume and eye whites.
    Only separately recorded, size-limited neutral components are carved back
    out for checker islands trapped by hair curls or other closed silhouettes.
    """

    image = normalize_to_srgb_rgba(source)
    pixels = np.asarray(image, dtype=np.uint8).copy()
    height, width, _ = pixels.shape
    rgb = pixels[:, :, :3]
    chroma = np.max(rgb, axis=2).astype(np.int16) - np.min(rgb, axis=2).astype(np.int16)
    neutral = (chroma <= int(maximum_chroma)) & (pixels[:, :, 3] > 0)
    core = (~neutral) & (pixels[:, :, 3] > 0)
    core = _binary_dilate(_binary_erode(core, opening_radius), opening_radius)
    core = _binary_erode(_binary_dilate(core, closing_radius), closing_radius)
    foreground_seeds = [
        _normalized_seed(point, width, height)
        for point in foreground_seed_points
    ]
    if not foreground_seeds:
        raise ValueError("checker extraction requires at least one foreground seed")
    subject = _connected_mask(core, foreground_seeds)
    if not np.any(subject):
        raise ValueError("foreground seed did not select a checkerboard subject component")
    subject = _binary_dilate(_fill_binary_holes(subject), subject_grow_radius)

    named_holes = np.zeros_like(subject)
    for raw_point in enclosed_seed_points:
        seed = _normalized_seed(raw_point, width, height)
        component = _connected_mask(neutral, [seed])
        pixel_count = int(component.sum())
        if not pixel_count:
            raise ValueError(f"enclosed checker seed {tuple(raw_point)} selected no pixels")
        if (
            np.any(component[0, :])
            or np.any(component[height - 1, :])
            or np.any(component[:, 0])
            or np.any(component[:, width - 1])
        ):
            raise ValueError(f"enclosed checker seed {tuple(raw_point)} reaches the canvas edge")
        if pixel_count > int(max_enclosed_component_pixels):
            raise ValueError(
                f"enclosed checker seed {tuple(raw_point)} selects {pixel_count} pixels; "
                f"limit is {max_enclosed_component_pixels}"
            )
        named_holes |= component
    named_holes = _binary_dilate(named_holes, hole_grow_radius)
    subject &= ~named_holes
    pixels[:, :, 3] = np.where(subject, 255, 0).astype(np.uint8)
    return Image.fromarray(pixels, "RGBA")


def _edge_seeds(candidates: np.ndarray) -> list[tuple[int, int]]:
    height, width = candidates.shape
    seeds: list[tuple[int, int]] = []
    for x in range(width):
        if candidates[0, x]:
            seeds.append((0, x))
        if candidates[height - 1, x]:
            seeds.append((height - 1, x))
    for y in range(1, height - 1):
        if candidates[y, 0]:
            seeds.append((y, 0))
        if candidates[y, width - 1]:
            seeds.append((y, width - 1))
    return seeds


def extract_outer_contour_background(
    source: Image.Image,
    *,
    barrier_maximum_luminance: int,
    barrier_minimum_chroma: int,
    barrier_closing_radius: int,
    exterior_trim_minimum_luminance: int,
    exterior_trim_maximum_chroma: int,
    foreground_seed_points: Iterable[Iterable[float]],
    enclosed_seed_points: Iterable[Iterable[float]] = (),
    hole_maximum_chroma: int = 20,
    hole_grow_radius: int = 3,
    max_enclosed_component_pixels: int = 2048,
) -> Image.Image:
    """Extract a subject enclosed by its dark outer contour.

    Integer BT.709-like luminance keeps the classifier platform-stable. The
    morphologically closed dark barrier is used only to establish topology;
    edge-connected pale pixels are then trimmed from the selected subject so
    synthesized barrier closure cannot retain checker-coloured keylines.
    """

    image = normalize_to_srgb_rgba(source)
    pixels = np.asarray(image, dtype=np.uint8).copy()
    height, width, _ = pixels.shape
    rgb = pixels[:, :, :3].astype(np.int32)
    alpha_visible = pixels[:, :, 3] > 0
    luminance = (54 * rgb[:, :, 0] + 183 * rgb[:, :, 1] + 19 * rgb[:, :, 2]) // 256
    chroma = np.max(rgb, axis=2) - np.min(rgb, axis=2)

    barrier = (
        (luminance <= int(barrier_maximum_luminance))
        & (chroma >= int(barrier_minimum_chroma))
        & alpha_visible
    )
    barrier = _binary_erode(
        _binary_dilate(barrier, barrier_closing_radius),
        barrier_closing_radius,
    )
    exterior_candidates = (~barrier) & alpha_visible
    exterior_seeds = _edge_seeds(exterior_candidates)
    if not exterior_seeds:
        raise ValueError("outer-contour extraction found no exterior edge seeds")
    exterior = _connected_mask(exterior_candidates, exterior_seeds)
    enclosed = (~exterior) & alpha_visible
    foreground_seeds = [
        _normalized_seed(point, width, height) for point in foreground_seed_points
    ]
    if not foreground_seeds:
        raise ValueError("outer-contour extraction requires foreground seeds")
    subject = _connected_mask(enclosed, foreground_seeds)

    pale_exterior_candidates = (
        (luminance >= int(exterior_trim_minimum_luminance))
        & (chroma <= int(exterior_trim_maximum_chroma))
        & alpha_visible
    )
    pale_seeds = _edge_seeds(pale_exterior_candidates)
    if pale_seeds:
        subject &= ~_connected_mask(pale_exterior_candidates, pale_seeds)

    neutral_hole_candidates = (
        (chroma <= int(hole_maximum_chroma)) & alpha_visible
    )
    named_holes = np.zeros_like(subject)
    for raw_point in enclosed_seed_points:
        seed = _normalized_seed(raw_point, width, height)
        component = _connected_mask(neutral_hole_candidates, [seed])
        pixel_count = int(component.sum())
        if (
            np.any(component[0, :])
            or np.any(component[height - 1, :])
            or np.any(component[:, 0])
            or np.any(component[:, width - 1])
        ):
            raise ValueError(f"enclosed contour seed {tuple(raw_point)} reaches the canvas edge")
        if pixel_count > int(max_enclosed_component_pixels):
            raise ValueError(
                f"enclosed contour seed {tuple(raw_point)} selects {pixel_count} pixels; "
                f"limit is {max_enclosed_component_pixels}"
            )
        named_holes |= component
    subject &= ~_binary_dilate(named_holes, hole_grow_radius)
    pixels[:, :, 3] = np.where(subject, 255, 0).astype(np.uint8)
    return Image.fromarray(pixels, "RGBA")


def _resize_float(channel: np.ndarray, size: tuple[int, int]) -> np.ndarray:
    image = Image.fromarray(channel.astype(np.float32), mode="F")
    return np.asarray(image.resize(size, Image.Resampling.LANCZOS), dtype=np.float32)


def premultiplied_resize(source: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Resize in premultiplied alpha space and return straight RGBA."""

    rgba = np.asarray(normalize_to_srgb_rgba(source), dtype=np.float32)
    alpha = rgba[:, :, 3] / 255.0
    premultiplied = rgba[:, :, :3] * alpha[:, :, None]
    resized_alpha = np.clip(_resize_float(alpha, size), 0.0, 1.0)
    resized_rgb_premultiplied = np.stack(
        [_resize_float(premultiplied[:, :, channel], size) for channel in range(3)],
        axis=2,
    )
    resized_rgb = np.zeros_like(resized_rgb_premultiplied)
    visible = resized_alpha > (0.5 / 255.0)
    resized_rgb[visible] = (
        resized_rgb_premultiplied[visible] / resized_alpha[visible][:, None]
    )
    output = np.concatenate(
        [
            np.clip(np.rint(resized_rgb), 0, 255).astype(np.uint8),
            np.clip(np.rint(resized_alpha * 255.0), 0, 255).astype(np.uint8)[:, :, None],
        ],
        axis=2,
    )
    return Image.fromarray(output, "RGBA")


def register_cutout(
    source: Image.Image,
    size: tuple[int, int],
    *,
    target_box: Iterable[float],
    align: Iterable[float] = (0.5, 1.0),
    alpha_threshold: int = 2,
) -> Image.Image:
    """Fit visible alpha bounds into a normalized target box and alignment."""

    box_values = tuple(float(value) for value in target_box)
    align_values = tuple(float(value) for value in align)
    if (
        len(box_values) != 4
        or not all(0.0 <= value <= 1.0 for value in box_values)
        or box_values[0] >= box_values[2]
        or box_values[1] >= box_values[3]
    ):
        raise ValueError("target_box must be normalized [left, top, right, bottom]")
    if len(align_values) != 2 or not all(0.0 <= value <= 1.0 for value in align_values):
        raise ValueError("align must be a normalized [x, y] pair")
    rgba = normalize_to_srgb_rgba(source)
    alpha = np.asarray(rgba.getchannel("A"), dtype=np.uint8)
    visible_y, visible_x = np.nonzero(alpha >= int(alpha_threshold))
    if not len(visible_x):
        raise ValueError("cutout registration found no visible pixels")
    source_box = (
        int(visible_x.min()),
        int(visible_y.min()),
        int(visible_x.max()) + 1,
        int(visible_y.max()) + 1,
    )
    cropped = rgba.crop(source_box)
    target_left = round(box_values[0] * size[0])
    target_top = round(box_values[1] * size[1])
    target_right = round(box_values[2] * size[0])
    target_bottom = round(box_values[3] * size[1])
    available_width = max(1, target_right - target_left)
    available_height = max(1, target_bottom - target_top)
    scale = min(available_width / cropped.width, available_height / cropped.height)
    resized_size = (
        max(1, round(cropped.width * scale)),
        max(1, round(cropped.height * scale)),
    )
    resized = premultiplied_resize(cropped, resized_size)
    slack_x = available_width - resized.width
    slack_y = available_height - resized.height
    paste_x = target_left + round(slack_x * align_values[0])
    paste_y = target_top + round(slack_y * align_values[1])
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.alpha_composite(resized, (paste_x, paste_y))
    return canvas


def dilate_hidden_rgb(
    source: Image.Image,
    radius: int,
    *,
    transparent_alpha_max: int = 0,
) -> Image.Image:
    """Propagate edge colour beneath zero-alpha pixels without changing alpha."""

    if radius <= 0:
        return source.convert("RGBA")
    pixels = np.asarray(source.convert("RGBA"), dtype=np.uint8).copy()
    alpha = pixels[:, :, 3]
    donor = alpha > transparent_alpha_max
    target = ~donor
    rgb = pixels[:, :, :3]
    directions: tuple[tuple[int, int], ...] = (
        (-1, 0),
        (1, 0),
        (0, -1),
        (0, 1),
        (-1, -1),
        (-1, 1),
        (1, -1),
        (1, 1),
    )
    height, width = donor.shape
    for _ in range(radius):
        next_donor = donor.copy()
        next_rgb = rgb.copy()
        for dy, dx in directions:
            source_y_start = max(0, -dy)
            source_y_end = min(height, height - dy)
            source_x_start = max(0, -dx)
            source_x_end = min(width, width - dx)
            target_y_start = source_y_start + dy
            target_y_end = source_y_end + dy
            target_x_start = source_x_start + dx
            target_x_end = source_x_end + dx
            candidate = donor[source_y_start:source_y_end, source_x_start:source_x_end]
            destination_empty = ~next_donor[
                target_y_start:target_y_end,
                target_x_start:target_x_end,
            ]
            fill = candidate & destination_empty & target[
                target_y_start:target_y_end,
                target_x_start:target_x_end,
            ]
            if not np.any(fill):
                continue
            destination_rgb = next_rgb[
                target_y_start:target_y_end,
                target_x_start:target_x_end,
            ]
            source_rgb = rgb[source_y_start:source_y_end, source_x_start:source_x_end]
            destination_rgb[fill] = source_rgb[fill]
            destination_donor = next_donor[
                target_y_start:target_y_end,
                target_x_start:target_x_end,
            ]
            destination_donor[fill] = True
        donor = next_donor
        rgb = next_rgb
    pixels[:, :, :3] = rgb
    return Image.fromarray(pixels, "RGBA")


def alpha_component_sizes(
    source: Image.Image,
    *,
    alpha_threshold: int = 3,
) -> list[int]:
    """Measure 8-connected visible-alpha components, largest first."""

    alpha = np.asarray(source.convert("RGBA").getchannel("A"), dtype=np.uint8)
    visible = alpha >= int(alpha_threshold)
    height, width = visible.shape
    visited = np.zeros_like(visible)
    sizes: list[int] = []
    for y, x in zip(*np.nonzero(visible)):
        if visited[y, x]:
            continue
        queue: deque[tuple[int, int]] = deque([(int(y), int(x))])
        visited[y, x] = True
        size = 0
        while queue:
            current_y, current_x = queue.popleft()
            size += 1
            for y_offset in (-1, 0, 1):
                for x_offset in (-1, 0, 1):
                    if not x_offset and not y_offset:
                        continue
                    next_y = current_y + y_offset
                    next_x = current_x + x_offset
                    if (
                        0 <= next_y < height
                        and 0 <= next_x < width
                        and visible[next_y, next_x]
                        and not visited[next_y, next_x]
                    ):
                        visited[next_y, next_x] = True
                        queue.append((next_y, next_x))
        sizes.append(size)
    return sorted(sizes, reverse=True)


def remove_small_alpha_components(
    source: Image.Image,
    *,
    minimum_pixels: int,
    alpha_threshold: int = 3,
) -> Image.Image:
    """Clear sub-threshold isolated alpha flecks without changing kept edges."""

    if minimum_pixels <= 1:
        return source.convert("RGBA")
    pixels = np.asarray(source.convert("RGBA"), dtype=np.uint8).copy()
    visible = pixels[:, :, 3] >= int(alpha_threshold)
    height, width = visible.shape
    visited = np.zeros_like(visible)
    for y, x in zip(*np.nonzero(visible)):
        if visited[y, x]:
            continue
        queue: deque[tuple[int, int]] = deque([(int(y), int(x))])
        visited[y, x] = True
        component: list[tuple[int, int]] = []
        while queue:
            current_y, current_x = queue.popleft()
            component.append((current_y, current_x))
            for y_offset in (-1, 0, 1):
                for x_offset in (-1, 0, 1):
                    if not x_offset and not y_offset:
                        continue
                    next_y = current_y + y_offset
                    next_x = current_x + x_offset
                    if (
                        0 <= next_y < height
                        and 0 <= next_x < width
                        and visible[next_y, next_x]
                        and not visited[next_y, next_x]
                    ):
                        visited[next_y, next_x] = True
                        queue.append((next_y, next_x))
        if len(component) < int(minimum_pixels):
            ys, xs = zip(*component)
            pixels[np.asarray(ys), np.asarray(xs), 3] = 0
    return Image.fromarray(pixels, "RGBA")


def prepare_cutout(
    source: Image.Image,
    size: tuple[int, int],
    *,
    extraction_mode: str = "native-alpha",
    background_rgb: Iterable[int] | None = None,
    background_tolerance: int = 0,
    clear_alpha_below: int = 2,
    edge_dilation_pixels: int = 4,
    checker_maximum_chroma: int = 45,
    foreground_seed_points: Iterable[Iterable[float]] = ((0.5, 0.5),),
    enclosed_seed_points: Iterable[Iterable[float]] = (),
    checker_opening_radius: int = 2,
    checker_closing_radius: int = 10,
    checker_subject_grow_radius: int = 4,
    checker_hole_grow_radius: int = 3,
    checker_max_enclosed_component_pixels: int = 2048,
    contour_barrier_maximum_luminance: int = 180,
    contour_barrier_minimum_chroma: int = 10,
    contour_barrier_closing_radius: int = 2,
    contour_trim_minimum_luminance: int = 235,
    contour_trim_maximum_chroma: int = 20,
    contour_hole_maximum_chroma: int = 20,
    minimum_alpha_component_pixels: int = 1,
    registration: dict[str, object] | None = None,
) -> Image.Image:
    if extraction_mode == "edge-connected":
        rgb = tuple(int(value) for value in (background_rgb or (255, 255, 255)))
        if len(rgb) != 3:
            raise ValueError("background_rgb must contain exactly three channels")
        working = extract_edge_connected_background(source, rgb, background_tolerance)
    elif extraction_mode == "native-alpha":
        working = normalize_to_srgb_rgba(source)
        if working.getchannel("A").getextrema()[0] == 255:
            raise ValueError("native-alpha build requested for a fully opaque source")
    elif extraction_mode == "seeded-checkerboard":
        working = extract_seeded_checkerboard_background(
            source,
            maximum_chroma=checker_maximum_chroma,
            foreground_seed_points=foreground_seed_points,
            enclosed_seed_points=enclosed_seed_points,
            opening_radius=checker_opening_radius,
            closing_radius=checker_closing_radius,
            subject_grow_radius=checker_subject_grow_radius,
            hole_grow_radius=checker_hole_grow_radius,
            max_enclosed_component_pixels=checker_max_enclosed_component_pixels,
        )
    elif extraction_mode == "outer-contour-barrier":
        working = extract_outer_contour_background(
            source,
            barrier_maximum_luminance=contour_barrier_maximum_luminance,
            barrier_minimum_chroma=contour_barrier_minimum_chroma,
            barrier_closing_radius=contour_barrier_closing_radius,
            exterior_trim_minimum_luminance=contour_trim_minimum_luminance,
            exterior_trim_maximum_chroma=contour_trim_maximum_chroma,
            foreground_seed_points=foreground_seed_points,
            enclosed_seed_points=enclosed_seed_points,
            hole_maximum_chroma=contour_hole_maximum_chroma,
            hole_grow_radius=checker_hole_grow_radius,
            max_enclosed_component_pixels=checker_max_enclosed_component_pixels,
        )
    else:
        raise ValueError(f"unsupported extraction mode: {extraction_mode}")

    if registration:
        resized = register_cutout(
            working,
            size,
            target_box=registration.get("targetBox", (0.0, 0.0, 1.0, 1.0)),
            align=registration.get("align", (0.5, 1.0)),
            alpha_threshold=int(registration.get("alphaThreshold", clear_alpha_below)),
        )
    else:
        resized = premultiplied_resize(working, size)
    pixels = np.asarray(resized, dtype=np.uint8).copy()
    pixels[:, :, 3][pixels[:, :, 3] < clear_alpha_below] = 0
    cleaned = Image.fromarray(pixels, "RGBA")
    cleaned = remove_small_alpha_components(
        cleaned,
        minimum_pixels=minimum_alpha_component_pixels,
        alpha_threshold=clear_alpha_below,
    )
    return dilate_hidden_rgb(cleaned, edge_dilation_pixels)
