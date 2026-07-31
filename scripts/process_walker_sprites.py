"""Chroma-key + fringe cleanup + spritesheet for anime walker."""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageFilter

ASSETS = Path(
    r"C:\Users\dev3\.cursor\projects\c-Users-dev3-Desktop-Balan-asdocumenta-o-sn800-sn400-new-balana-a-landpage\assets"
)
OUT = Path(
    r"C:\Users\dev3\Desktop\Balançasdocumentação sn800,sn400\new balanaça landpage\public\world"
)
FRAME_W, FRAME_H = 512, 768


def is_magenta(r: int, g: int, b: int) -> bool:
    return (
        (r > 160 and b > 150 and g < 145 and r > g + 35 and b > g + 30)
        or (r > 200 and b > 180 and g < 165)
        or ((r + b) / 2 - g > 55 and r > 170 and b > 140 and g < 140)
    )


def chroma_magenta(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_magenta(r, g, b):
                magenta = (r + b) / 2 - g
                if r > 210 and b > 190 and g < 120:
                    px[x, y] = (0, 0, 0, 0)
                elif magenta > 45:
                    px[x, y] = (0, 0, 0, 0)
                else:
                    strength = min(1.0, magenta / 70)
                    na = int(a * (1 - strength))
                    px[x, y] = (min(r, g + 25), g, min(b, g + 25), na)
            elif r > g + 40 and b > g + 25 and g < 170:
                spill = min(35, (r - g) // 2)
                px[x, y] = (max(0, r - spill), g, max(0, b - spill // 2), a)
    return img


def remove_halo(img: Image.Image) -> Image.Image:
    """Kill light/dark fringe pixels sitting next to transparency."""
    img = img.convert("RGBA")
    w, h = img.size
    src = img.load()
    out = img.copy()
    dst = out.load()

    def alpha_at(x: int, y: int) -> int:
        if x < 0 or y < 0 or x >= w or y >= h:
            return 0
        return src[x, y][3]

    for y in range(h):
        for x in range(w):
            r, g, b, a = src[x, y]
            if a < 8:
                dst[x, y] = (0, 0, 0, 0)
                continue

            # neighbors transparency
            transparent_n = 0
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    if dx == 0 and dy == 0:
                        continue
                    if alpha_at(x + dx, y + dy) < 40:
                        transparent_n += 1

            if transparent_n == 0:
                continue

            lum = (r + g + b) / 3
            # white / grey halo from bad cut
            if transparent_n >= 2 and lum > 185 and abs(r - g) < 35 and abs(g - b) < 35:
                dst[x, y] = (0, 0, 0, 0)
                continue
            # leftover magenta fringe
            if transparent_n >= 1 and is_magenta(r, g, b):
                dst[x, y] = (0, 0, 0, 0)
                continue
            # soften partial edge
            if transparent_n >= 3 and a < 220:
                dst[x, y] = (r, g, b, max(0, a - 90))

    # slight blur on alpha only for softer silhouette
    rgb = out.convert("RGB")
    alpha = out.getchannel("A").filter(ImageFilter.MinFilter(3))
    alpha = alpha.filter(ImageFilter.MaxFilter(3))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))
    cleaned = Image.merge("RGBA", (*rgb.split(), alpha))
    return cleaned


def trim_alpha(img: Image.Image, pad: int = 6) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(img.width, r + pad)
    b = min(img.height, b + pad)
    return img.crop((l, t, r, b))


def fit_canvas(img: Image.Image, size=(FRAME_W, FRAME_H)) -> Image.Image:
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    iw, ih = img.size
    tw, th = size
    scale = min(tw / iw, th / ih) * 0.92
    nw, nh = max(1, int(iw * scale)), max(1, int(ih * scale))
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (tw - nw) // 2
    y = th - nh
    canvas.paste(resized, (x, y), resized)
    return canvas


def process_frame(path: Path) -> Image.Image:
    raw = Image.open(path)
    cleaned = chroma_magenta(raw)
    cleaned = remove_halo(cleaned)
    cleaned = trim_alpha(cleaned)
    return fit_canvas(cleaned)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    frames: list[Image.Image] = []
    for i in range(1, 5):
        src = ASSETS / f"walk-0{i}.png"
        fitted = process_frame(src)
        fitted.save(OUT / f"walk-0{i}.png", optimize=True)
        frames.append(fitted)
        hist = fitted.getchannel("A").histogram()
        print(f"frame {i}: transparent={hist[0]} opaque={hist[255]}")

    sheet = Image.new("RGBA", (FRAME_W * 4, FRAME_H), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        sheet.paste(f, (i * FRAME_W, 0), f)
    sheet.save(OUT / "walker-sheet.png", optimize=True)
    frames[0].save(OUT / "anime-walker.png", optimize=True)
    print("done", OUT / "walker-sheet.png")


if __name__ == "__main__":
    main()
