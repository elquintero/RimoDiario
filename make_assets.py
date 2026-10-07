"""Genera los iconos PNG y dos sonidos WAV de reserva (clic y acento).
Uso: python3 make_assets.py
Los sonidos de tu banco de GitHub pueden sustituir a sounds/click.wav y sounds/accent.wav."""
import math, struct, wave, os
from PIL import Image, ImageDraw

os.makedirs('icons', exist_ok=True)
os.makedirs('sounds', exist_ok=True)

BG = (20, 22, 26)
BLUE = (77, 163, 255)
RED = (255, 99, 99)
WHITE = (240, 240, 240)

def icon(size, safe):
    """safe=1.0 icono normal; safe<1 deja margen para el modo 'maskable'."""
    img = Image.new('RGB', (size, size), BG)
    d = ImageDraw.Draw(img)
    s = size * safe
    o = (size - s) / 2
    # metrónomo estilizado: trapecio + péndulo + pulso
    d.polygon([(o + s*0.30, o + s*0.88), (o + s*0.70, o + s*0.88),
               (o + s*0.60, o + s*0.14), (o + s*0.40, o + s*0.14)], fill=(38, 42, 50), outline=WHITE)
    d.line([(o + s*0.50, o + s*0.80), (o + s*0.64, o + s*0.22)], fill=RED, width=max(2, int(s*0.035)))
    r = s * 0.06
    cx, cy = o + s*0.60, o + s*0.38
    d.ellipse([cx - r*1.5, cy - r*1.5, cx + r*1.5, cy + r*1.5], fill=BLUE)
    img.save(f'icons/{"maskable" if safe < 1 else "icon"}-{size}.png')

icon(192, 1.0)
icon(512, 1.0)
icon(512, 0.72)

def tone(path, freq, ms, vol=0.6, decay=40.0):
    rate = 44100
    n = int(rate * ms / 1000)
    with wave.open(path, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
        frames = bytearray()
        for i in range(n):
            t = i / rate
            env = math.exp(-decay * t)
            v = vol * env * (math.sin(2*math.pi*freq*t) + 0.4*math.sin(2*math.pi*freq*2*t)) / 1.4
            frames += struct.pack('<h', int(max(-1, min(1, v)) * 32767))
        w.writeframes(bytes(frames))

tone('sounds/click.wav', 1000, 90)
tone('sounds/accent.wav', 1500, 110, vol=0.75)
print('assets ok')
