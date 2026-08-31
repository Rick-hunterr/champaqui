#!/usr/bin/env python3
"""
Banner del README para "Córdoba Capital → Cerro Champaquí, a pie".

Reusa la paleta exacta de css/style.css (cuaderno de ruta / parchment) para
que el banner se sienta parte del mismo objeto que el sitio, no un agregado.

Salida:
    docs/banner/banner.png

Requisito:
    Pillow (pip install pillow / apt install python3-pil)
"""

from __future__ import annotations

import math
import os
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ============================================================
# CONFIGURACIÓN
# ============================================================

WIDTH = 1536
HEIGHT = 480

HERE = Path(__file__).resolve().parent
OUTPUT_FILE = HERE / "banner.png"

# Paleta — copiada 1:1 de css/style.css (:root)
PAPER = (231, 224, 203)
PAPER_DARK = (219, 210, 182)
INK = (38, 35, 25)
INK_SOFT = (87, 80, 63)
PINE = (60, 110, 71)
PINE_DARK = (42, 78, 51)
CLAY = (173, 59, 44)
OCHRE = (185, 133, 42)
LINE = (199, 188, 152)
WHITE = (251, 248, 240)

FONT_CANDIDATES = {
    "serif_bold": [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSerif-Bold.ttf",
    ],
    "serif": [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSerif-Regular.ttf",
    ],
    "sans": [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ],
}


def find_font(candidates, size):
    for path in candidates:
        if os.path.isfile(path):
            return ImageFont.truetype(path, size=size)
    raise FileNotFoundError(f"Ninguna fuente disponible entre: {candidates}")


def text_w(draw, text, font):
    box = draw.textbbox((0, 0), text, font=font)
    return box[2] - box[0]


# ============================================================
# CAPAS DE FONDO
# ============================================================

def paper_texture(img: Image.Image) -> None:
    """Grano sutil de papel — ruido leve sobre el fondo parchment."""
    draw = ImageDraw.Draw(img)
    rng = random.Random(7)
    for _ in range(9000):
        x = rng.randint(0, WIDTH - 1)
        y = rng.randint(0, HEIGHT - 1)
        shade = rng.randint(-10, 10)
        base = PAPER_DARK if rng.random() < 0.5 else PAPER
        c = tuple(max(0, min(255, v + shade)) for v in base)
        draw.point((x, y), fill=c)


def contour_lines(img: Image.Image) -> None:
    """Líneas de nivel tipo mapa topográfico, muy sutiles, de fondo."""
    draw = ImageDraw.Draw(img)
    for i in range(7):
        base_y = 60 + i * 55
        amp = 14 + i * 3
        freq = 0.006 + i * 0.0007
        pts = []
        for x in range(0, WIDTH + 20, 8):
            y = base_y + amp * math.sin(x * freq + i * 1.3)
            pts.append((x, y))
        draw.line(pts, fill=LINE, width=1)


def mountain_range(img: Image.Image) -> None:
    """Silueta de sierras en dos planos (más clara atrás, oscura adelante)."""
    draw = ImageDraw.Draw(img)

    def ridge(seed, base_h, amp, jag, color):
        rng = random.Random(seed)
        pts = [(0, HEIGHT)]
        x = 0
        y = HEIGHT - base_h
        pts.append((x, y))
        while x < WIDTH + 40:
            step = rng.randint(70, 140)
            x += step
            y = HEIGHT - base_h + rng.randint(-amp, amp) - jag
            jag = max(0, jag - rng.randint(0, 30))
            pts.append((x, max(HEIGHT - base_h - amp - 40, y)))
        pts.append((WIDTH, HEIGHT))
        draw.polygon(pts, fill=color)

    ridge(1, 70, 10, 8, PAPER_DARK)   # fondo lejano, casi invisible
    ridge(2, 90, 16, 18, PINE)         # sierra media
    ridge(3, 110, 20, 30, PINE_DARK)   # sierra frontal — la más oscura


def route_and_peak(img: Image.Image) -> None:
    """Línea de ruta punteada subiendo hacia la cumbre, con pin de cumbre."""
    draw = ImageDraw.Draw(img)

    start = (90, HEIGHT - 70)
    mid1 = (430, HEIGHT - 150)
    mid2 = (760, HEIGHT - 130)
    mid3 = (1080, HEIGHT - 200)
    peak = (1410, HEIGHT - 255)

    path = [start, mid1, mid2, mid3, peak]

    # línea punteada (clay) siguiendo el camino
    for a, b in zip(path, path[1:]):
        dist = math.hypot(b[0] - a[0], b[1] - a[1])
        steps = max(2, int(dist // 14))
        for i in range(steps):
            t0 = i / steps
            t1 = (i + 0.55) / steps
            p0 = (a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0)
            p1 = (a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1)
            draw.line([p0, p1], fill=CLAY, width=4)

    # puntos de paso (círculos ocre)
    for p in path[1:-1]:
        r = 5
        draw.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=OCHRE, outline=WHITE, width=2)

    # marcador de inicio
    r = 6
    draw.ellipse([start[0] - r, start[1] - r, start[0] + r, start[1] + r], fill=CLAY, outline=WHITE, width=2)

    # pin de cumbre (triángulo + circulo, estilo Leaflet)
    px, py = peak
    pin_h = 34
    draw.polygon(
        [(px, py + 6), (px - 11, py - pin_h + 8), (px, py - pin_h - 4), (px + 11, py - pin_h + 8)],
        fill=CLAY, outline=WHITE,
    )
    draw.ellipse([px - 6, py - pin_h - 2, px + 6, py - pin_h + 10], fill=WHITE)


# ============================================================
# TEXTO
# ============================================================

def add_text(img: Image.Image) -> None:
    draw = ImageDraw.Draw(img)

    eyebrow_font = find_font(FONT_CANDIDATES["sans"], 22)
    title_font = find_font(FONT_CANDIDATES["serif_bold"], 64)
    subtitle_font = find_font(FONT_CANDIDATES["serif"], 26)
    stat_font = find_font(FONT_CANDIDATES["sans"], 20)

    left = 70
    top = 60

    draw.text((left, top), "CUADERNO DE RUTA — EXPEDICIÓN DE 7", font=eyebrow_font, fill=INK_SOFT)

    title = "Córdoba Capital → Cerro Champaquí"
    draw.text((left, top + 34), title, font=title_font, fill=INK)

    subtitle = "A pie, en enero · 165 km documentados · rutas, refugios y cumbre verificados"
    draw.text((left, top + 120), subtitle, font=subtitle_font, fill=INK_SOFT)

    # chips de datos clave, estilo "stat-ribbon" del sitio
    stats = [("165 km", "distancia total"), ("2790 m", "cumbre"), ("7–9", "días")]
    cx = left
    cy = top + 175
    for value, label in stats:
        vw = text_w(draw, value, title_font.font_variant(size=30))
        pad_x, pad_y = 18, 10
        box_w = max(vw, text_w(draw, label, stat_font)) + pad_x * 2
        box_h = 78
        draw.rounded_rectangle(
            [cx, cy, cx + box_w, cy + box_h], radius=10,
            fill=WHITE, outline=LINE, width=2,
        )
        vfont = find_font(FONT_CANDIDATES["serif_bold"], 30)
        draw.text((cx + pad_x, cy + 10), value, font=vfont, fill=CLAY)
        draw.text((cx + pad_x, cy + 46), label, font=stat_font, fill=INK_SOFT)
        cx += box_w + 18


# ============================================================
# MAIN
# ============================================================

def main() -> None:
    img = Image.new("RGB", (WIDTH, HEIGHT), PAPER)
    paper_texture(img)
    contour_lines(img)
    mountain_range(img)
    route_and_peak(img)
    add_text(img)

    # viñeta sutil en los bordes para dar profundidad de "cuaderno"
    img = img.filter(ImageFilter.SMOOTH_MORE)

    border = ImageDraw.Draw(img)
    border.rectangle([0, 0, WIDTH - 1, HEIGHT - 1], outline=INK_SOFT, width=3)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUTPUT_FILE, "PNG")
    print(f"Banner guardado en {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
