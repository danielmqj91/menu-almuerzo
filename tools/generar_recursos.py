"""Genera assets/recursos.css con fuentes e imágenes incrustadas (data URI).

Así la página funciona abriendo index.html directamente (file://) y
html2canvas puede capturar todo sin problemas de CORS.
Uso: python3 tools/generar_recursos.py
"""
import base64
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ASSETS = RAIZ / "assets"

FUENTES = [
    ("Pinyon Script", "normal", 400, "fonts/PinyonScript-400.woff2"),
    ("Carlito", "normal", 400, "fonts/Carlito-400.woff2"),
    ("Carlito", "normal", 700, "fonts/Carlito-700.woff2"),
    ("Carlito", "italic", 400, "fonts/Carlito-400-italic.woff2"),
]

IMAGENES = {
    "--img-vilanova-fondo": "vilanova-fondo.jpg",
    "--img-sopa": "sopa.jpg",
    "--img-bebida": "bebida.jpg",
}


def data_uri(ruta, mime):
    return f"data:{mime};base64," + base64.b64encode((ASSETS / ruta).read_bytes()).decode()


partes = ["/* Archivo generado por tools/generar_recursos.py. No editar a mano. */"]
for familia, estilo, peso, ruta in FUENTES:
    partes.append(
        "@font-face{"
        f"font-family:'{familia}';font-style:{estilo};font-weight:{peso};font-display:block;"
        f"src:url({data_uri(ruta, 'font/woff2')}) format('woff2');"
        "}"
    )
partes.append(":root{")
for var, ruta in IMAGENES.items():
    partes.append(f"  {var}:url({data_uri(ruta, 'image/jpeg')});")
partes.append("}")

(ASSETS / "recursos.css").write_text("\n".join(partes) + "\n")
print("assets/recursos.css generado")
