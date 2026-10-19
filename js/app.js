(function () {
  'use strict';

  var PANADERIAS = {
    'santo-domingo': { nombre: 'Santo Domingo', archivo: 'santo_domingo' },
    'vilanova': { nombre: 'Vilanova', archivo: 'vilanova' }
  };

  // Tamaño máximo de letra del cuerpo según el número de opciones;
  // si el contenido no cabe, se reduce automáticamente.
  var LETRA_MAXIMA = { 2: 24, 3: 21, 4: 19 };
  var LETRA_MINIMA = 10;

  var form = document.getElementById('formulario');
  var pasoOpciones = document.getElementById('paso-opciones');
  var pasoMenu = document.getElementById('paso-menu');
  var listaMenus = document.getElementById('lista-menus');
  var tplMenu = document.getElementById('tpl-menu');
  var marco = document.getElementById('vista-marco');
  var hoja = document.getElementById('hoja');
  var notaVista = document.getElementById('nota-vista');
  var btnPdf = document.getElementById('btn-pdf');
  var btnLimpiar = document.getElementById('btn-limpiar');
  var btnCompartir = document.getElementById('btn-compartir');

  // Valores escritos por opción; se conservan al cambiar el número de opciones.
  var valoresMenus = [];

  function valor(nombre) {
    var el = form.elements[nombre];
    return el ? el.value.trim() : '';
  }

  function crearBloquesMenu(cantidad) {
    guardarValoresMenus();
    listaMenus.innerHTML = '';
    for (var i = 0; i < cantidad; i++) {
      var nodo = tplMenu.content.cloneNode(true);
      nodo.querySelector('h3').textContent = 'Menú ' + (i + 1);
      var guardado = valoresMenus[i] || {};
      nodo.querySelectorAll('input').forEach(function (input) {
        input.value = guardado[input.dataset.campo] || '';
      });
      listaMenus.appendChild(nodo);
    }
  }

  function guardarValoresMenus() {
    listaMenus.querySelectorAll('.bloque-menu').forEach(function (bloque, i) {
      var datos = {};
      bloque.querySelectorAll('input').forEach(function (input) {
        datos[input.dataset.campo] = input.value;
      });
      valoresMenus[i] = datos;
    });
  }

  function leerMenus() {
    var menus = [];
    listaMenus.querySelectorAll('.bloque-menu').forEach(function (bloque) {
      var items = [];
      ['proteina', 'acomp1', 'acomp2', 'ensalada'].forEach(function (campo) {
        var v = bloque.querySelector('[data-campo="' + campo + '"]').value.trim();
        if (v) items.push(v);
      });
      menus.push(items);
    });
    return menus;
  }

  function formatearPrecio(texto) {
    var digitos = texto.replace(/\D/g, '');
    if (!digitos) return texto;
    return '$ ' + Number(digitos).toLocaleString('es-CO');
  }

  function el(etiqueta, clase, texto) {
    var nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto != null) nodo.textContent = texto;
    return nodo;
  }

  function crearCopia(datos) {
    var copia = el('div', 'copia tema-' + datos.panaderia);

    var encabezado = el('div', 'encabezado');
    encabezado.appendChild(el('div', 'pre', 'Panadería'));
    encabezado.appendChild(el('div', 'nombre', PANADERIAS[datos.panaderia].nombre));
    encabezado.appendChild(el('div', 'sub', 'MENÚ DEL DÍA'));
    copia.appendChild(encabezado);

    var cuerpo = el('div', 'cuerpo');
    var entrada = el('div', 'entrada');
    entrada.appendChild(el('span', 'etq', 'ENTRADA:'));
    entrada.appendChild(el('span', 'sopa', datos.sopa));
    entrada.appendChild(el('span', 'icono'));
    cuerpo.appendChild(entrada);

    datos.menus.forEach(function (items, i) {
      var menu = el('div', 'menu');
      menu.appendChild(el('div', 'titulo', 'MENÚ ' + (i + 1)));
      var ul = el('ul');
      items.forEach(function (item) {
        ul.appendChild(el('li', null, item));
      });
      menu.appendChild(ul);
      cuerpo.appendChild(menu);
    });
    copia.appendChild(cuerpo);

    var pie = el('div', 'pie');
    var precio = el('div', 'caja precio', datos.precio ? formatearPrecio(datos.precio) : '');
    if (!datos.precio) precio.classList.add('oculta');

    var bebida = el('div', 'caja bebida');
    bebida.appendChild(el('span', 'etq', 'Bebida:'));
    bebida.appendChild(el('div', 'texto', datos.jugo));
    bebida.appendChild(el('span', 'icono'));
    if (!datos.jugo) bebida.classList.add('oculta');

    if (datos.panaderia === 'vilanova') {
      pie.appendChild(precio);
      pie.appendChild(bebida);
    } else {
      pie.appendChild(bebida);
      pie.appendChild(precio);
    }
    copia.appendChild(pie);
    copia.appendChild(el('div', 'gracias', 'GRACIAS POR PREFERIRNOS!!'));
    return copia;
  }

  function cabe(cuerpo) {
    return cuerpo.scrollHeight <= cuerpo.clientHeight + 1 &&
      cuerpo.scrollWidth <= cuerpo.clientWidth + 1;
  }

  // Ajusta la letra del cuerpo para que todo el contenido quepa en la hoja.
  function ajustarLetra(destino, cantidad) {
    var cuerpo = destino.querySelector('.cuerpo');
    var fs = LETRA_MAXIMA[cantidad] || 18;
    destino.style.setProperty('--fs', fs + 'px');
    while (fs > LETRA_MINIMA && !cabe(cuerpo)) {
      fs -= 0.5;
      destino.style.setProperty('--fs', fs + 'px');
    }
  }

  function datosActuales() {
    return {
      panaderia: valor('panaderia'),
      opciones: Number(valor('opciones')),
      sopa: valor('sopa'),
      jugo: valor('jugo'),
      precio: valor('precio'),
      menus: leerMenus()
    };
  }

  function renderizar(destino, datos) {
    destino.innerHTML = '';
    destino.appendChild(crearCopia(datos));
    destino.appendChild(crearCopia(datos));
    ajustarLetra(destino, datos.opciones);
  }

  function escalarVista() {
    var escala = marco.clientWidth / 960;
    hoja.style.transform = 'scale(' + escala + ')';
    marco.style.height = (720 * escala) + 'px';
  }

  function actualizarVista() {
    var datos = datosActuales();
    var lista = datos.panaderia && datos.opciones;
    marco.classList.toggle('vacia', !lista);
    notaVista.hidden = !!lista;
    if (!lista) return;
    renderizar(hoja, datos);
    escalarVista();
  }

  function nombreArchivo(datos) {
    var hoy = new Date();
    var fecha = hoy.getFullYear() + '-' +
      String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
      String(hoy.getDate()).padStart(2, '0');
    return 'menu_' + PANADERIAS[datos.panaderia].archivo + '_' + fecha + '.pdf';
  }

  // Último PDF generado; se reutiliza mientras el menú no cambie.
  var pdfListo = null;

  function generarPdf(datos) {
    var clave = JSON.stringify(datos);
    if (pdfListo && pdfListo.clave === clave) return Promise.resolve(pdfListo.archivo);

    var zona = document.createElement('div');
    zona.id = 'zona-captura';
    var copiaHoja = el('div', 'hoja');
    zona.appendChild(copiaHoja);
    document.body.appendChild(zona);
    renderizar(copiaHoja, datos);

    return document.fonts.ready
      .then(function () {
        return html2canvas(copiaHoja, { scale: 3, backgroundColor: '#ffffff', logging: false });
      })
      .then(function (canvas) {
        var pdf = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: [720, 540] });
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 720, 540);
        var archivo = new File([pdf.output('blob')], nombreArchivo(datos), { type: 'application/pdf' });
        pdfListo = { clave: clave, archivo: archivo };
        return archivo;
      })
      .finally(function () {
        zona.remove();
      });
  }

  function puedeCompartir(archivo) {
    return !!(navigator.canShare && navigator.canShare({ files: [archivo] }));
  }

  // Comparte el archivo PDF en sí (sin enlaces ni texto adicional).
  function compartirArchivo(archivo) {
    return navigator.share({ files: [archivo] });
  }

  function descargarArchivo(archivo) {
    var url = URL.createObjectURL(archivo);
    var enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = archivo.name;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  }

  function conBoton(boton, texto, tarea) {
    var datos = datosActuales();
    if (!datos.panaderia || !datos.opciones) return;
    var original = boton.textContent;
    boton.disabled = true;
    boton.textContent = texto;
    generarPdf(datos)
      .then(tarea)
      .catch(function (err) {
        if (err && err.name === 'AbortError') return;
        console.error(err);
        alert('No se pudo generar el PDF: ' + err.message);
      })
      .finally(function () {
        boton.disabled = false;
        boton.textContent = original;
      });
  }

  function descargarPdf() {
    conBoton(btnPdf, 'Generando…', descargarArchivo);
  }

  function compartirPdf() {
    var datos = datosActuales();
    if (!datos.panaderia || !datos.opciones) return;

    // Si el PDF ya está listo se comparte de inmediato, dentro del mismo toque.
    if (pdfListo && pdfListo.clave === JSON.stringify(datos)) {
      compartirArchivo(pdfListo.archivo).catch(function (err) {
        if (err.name !== 'AbortError') descargarArchivo(pdfListo.archivo);
      });
      btnCompartir.textContent = 'Compartir';
      return;
    }

    conBoton(btnCompartir, 'Generando…', function (archivo) {
      if (!puedeCompartir(archivo)) {
        descargarArchivo(archivo);
        return;
      }
      return compartirArchivo(archivo).catch(function (err) {
        // Algunos navegadores (Safari) no dejan compartir si generar el PDF
        // tardó mucho; queda listo y basta con tocar otra vez.
        if (err.name === 'NotAllowedError') {
          setTimeout(function () { btnCompartir.textContent = 'Toca para compartir'; });
          return;
        }
        throw err;
      });
    });
  }

  form.addEventListener('change', function (e) {
    if (e.target.name === 'panaderia') {
      pasoOpciones.disabled = false;
    }
    if (e.target.name === 'opciones') {
      pasoMenu.disabled = false;
      crearBloquesMenu(Number(e.target.value));
    }
    actualizarVista();
  });

  form.addEventListener('input', actualizarVista);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    descargarPdf();
  });

  btnCompartir.addEventListener('click', compartirPdf);
  // Solo se muestra en navegadores que pueden compartir archivos (celulares, sobre todo).
  btnCompartir.hidden = !puedeCompartir(new File([''], 'menu.pdf', { type: 'application/pdf' }));

  btnLimpiar.addEventListener('click', function () {
    ['sopa', 'jugo', 'precio'].forEach(function (n) { form.elements[n].value = ''; });
    listaMenus.querySelectorAll('input').forEach(function (input) { input.value = ''; });
    valoresMenus = [];
    actualizarVista();
  });

  window.addEventListener('resize', function () {
    if (!marco.classList.contains('vacia')) escalarVista();
  });

  marco.classList.add('vacia');
  // Las fuentes deben estar cargadas antes de medir el texto.
  Promise.all([
    document.fonts.load("40px 'Pinyon Script'"),
    document.fonts.load("20px 'Carlito'"),
    document.fonts.load("bold 20px 'Carlito'"),
    document.fonts.load("italic 20px 'Carlito'")
  ]).then(actualizarVista);
})();
