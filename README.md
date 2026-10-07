# Ritmo Diario

PWA de una sola página para entrenar el ritmo 5 minutos antes de tocar el piano.

- **Paso 1** (min 1-2): calentamiento de subdivisión (negras → corcheas → negras).
- **Paso 2** (min 3-4): reto de lectura con partitura de ritmo (Bravura) y base musical; las blancas se mantienen con el dedo.
- **Paso 3** (min 5): evaluador por micrófono con % de precisión y tendencias ("te retrasas en las corcheas").
- **Manos separadas**: izquierda (azul), derecha (roja) y las dos a la vez con dos dedos (teclas F / J en ordenador).
- **Micro-retrasos**: gráfica en vivo de adelanto/retraso de cada golpe respecto al pulso.

## Publicar en GitHub Pages
1. Sube todo el contenido de esta carpeta a la raíz de un repositorio.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Abre `https://USUARIO.github.io/REPO/` en Chrome (Android): menú ⋮ → *Instalar aplicación* (o el botón "Instalar" de la app).

Cada vez que cambies archivos, sube `VERSION` en `sw.js` para que la app instalada se actualice.

## Banco de sonidos
Por defecto usa `sounds/click.wav` y `sounds/accent.wav` y sintetiza el resto. Para usar tus sonidos:
**Ajustes → URL del banco** (p. ej. `https://raw.githubusercontent.com/USUARIO/REPO/main/sounds/`) y el JSON con los nombres de archivo.
Nombres reconocidos: `accent, click, tap, left, right, bass, chord, kick, hat`.
(También puedes copiar los .wav a `sounds/` y editar `DEFAULT_MAP` en `index.html`.)

## Calibración
- **Toques en pantalla**: Ajustes → corrección en ms si siempre sales "tarde" o "pronto".
- **Micrófono**: Ajustes → *Calibrar latencia* (altavoz del móvil, sin auriculares).

## Licencias
Bravura (fonts/Bravura.otf) © Steinberg Media Technologies, SIL Open Font License 1.1 (ver fonts/OFL.txt).
