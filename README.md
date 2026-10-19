# Menú del Día

Página web sencilla para generar en PDF el menú de almuerzo de las panaderías
**Santo Domingo** y **Vilanova**, con el mismo formato de las plantillas de
`ejemplos/` (hoja horizontal de 10 × 7.5 in con dos copias del menú).

## Uso

1. Abre `index.html` en el navegador (doble clic; no requiere servidor ni internet).
2. Elige la panadería.
3. Elige cuántas opciones de menú tendrá (2, 3 o 4).
4. Llena el formulario:
   - **Sopa**, **Jugo** y **Precio**: son los mismos para todas las opciones.
   - Por cada menú: **Proteína**, **Acompañamiento 1**, **Acompañamiento 2** y **Ensalada**
     (los campos vacíos no se imprimen).
5. Revisa la vista previa y pulsa **Descargar PDF**, o **Compartir** en el celular
   (envía el archivo PDF directamente, por ejemplo a WhatsApp, sin enlaces).

El tamaño de la letra se ajusta solo para que todo quepa en la hoja.

## Estructura

- `index.html`, `css/`, `js/app.js`: la página.
- `assets/`: imágenes y fuentes de las plantillas. `assets/recursos.css` se genera con
  `python3 tools/generar_recursos.py` (incrusta fuentes e imágenes para que la página
  funcione abriendo el archivo directamente).
- `vendor/`: html2canvas 1.4.1 y jsPDF 2.5.2.
- `ejemplos/`: plantillas originales.

Las fuentes originales (Edwardian Script ITC y Calibri) no son libres; se usan
Pinyon Script y Carlito (equivalente métrico de Calibri) como reemplazo.
