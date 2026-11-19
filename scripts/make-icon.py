#!/usr/bin/env python3
"""Rasterize the storefront tile for the plugin market from the same geometry as icon.svg.

The curated list (awesome-dsh-plugin) accepts only a GitHub-hosted raster image,
so this renders assets/icon-180.png at 4x and downsamples for clean edges.
Run: python3 scripts/make-icon.py
"""

from pathlib import Path

from PIL import Image, ImageDraw

SIZE = 180          # storefront tile is drawn at ~96px; square reads best
SUPERSAMPLE = 4     # render large, then downscale, for anti-aliased edges
SVG_UNITS = 64      # icon.svg viewBox is 64x64

TEAL = (15, 118, 110, 255)      # #0f766e
WHITE = (255, 255, 255, 255)
AMBER = (251, 191, 36, 255)     # #fbbf24

canvas = SIZE * SUPERSAMPLE
k = canvas / SVG_UNITS


def box(x1, y1, x2, y2):
    """SVG user units to supersampled pixel box."""
    return (x1 * k, y1 * k, x2 * k, y2 * k)


image = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)

# Rounded background square (rx=16 of 64).
draw.rounded_rectangle(box(0, 0, SVG_UNITS, SVG_UNITS), radius=16 * k, fill=TEAL)

# Three reply bars.
draw.rectangle(box(17, 18, 47, 26), fill=WHITE)
draw.rectangle(box(17, 33, 37, 41), fill=WHITE)
draw.rectangle(box(17, 48, 47, 56), fill=WHITE)

# Amber badge with a teal plus (stroke width 3, butt caps).
draw.ellipse(box(45 - 9, 37 - 9, 45 + 9, 37 + 9), fill=AMBER)
draw.rectangle(box(45 - 1.5, 31, 45 + 1.5, 43), fill=TEAL)
draw.rectangle(box(39, 37 - 1.5, 51, 37 + 1.5), fill=TEAL)

out = Path(__file__).resolve().parent.parent / "assets" / "icon-180.png"
out.parent.mkdir(parents=True, exist_ok=True)
image.resize((SIZE, SIZE), Image.LANCZOS).save(out, "PNG", optimize=True)
print(f"wrote {out} ({out.stat().st_size} bytes, {SIZE}x{SIZE})")
