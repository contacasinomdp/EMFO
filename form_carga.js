/* -------------------------------------------------------------------
   emfo.js - Lógica del Formulario EMFO
   -------------------------------------------------------------------
   Este archivo contiene toda la lógica interactiva del formulario EMFO:
   - leer inputs
   - calcular PODER / RESCATE según la fórmula indicada
   - mostrar resultado en caja + texto
   - guardar todo en localStorage (clave "emfo_form")
   - mostrar panel con los valores guardados
   - editar valores (recargar al formulario)
   - limpiar inputs después de guardar
   - botones de navegación: volver a saldos y ver panel
   ------------------------------------------------------------------- */

/* ---------------------------
   Mensaje de comprobación al cargar
   ---------------------------
   Esto aparece en la consola del navegador si el script se ejecutó.
   Si no ves este mensaje, revisá que el archivo emfo.js esté correctamente enlazado.
*/
console.log("emfo.js cargado correctamente");

/* ---------------------------
   1) Obtener referencias del DOM
   ---------------------------
   Aquí guardamos en variables todos los elementos HTML que necesitaremos.
   Usamos document.getElementById("id") para encontrarlos por su id.
*/
const ventaPesosInput = document.getElementById("venta_pesos");
const ventaDolaresInput = document.getElementById("venta_dolares");
const pagoFichasInput = document.getElementById("pago_fichas");
const cajaEmpleadosInput = document.getElementById("caja_empleados");
const beneficioInput = document.getElementById("beneficio");
const quebrantoInput = document.getElementById("quebranto");

const ventaReceptoraInput = document.getElementById("venta_receptora");
const pagoTicketsInput = document.getElementById("pago_tickets");
const pagoFueraInput = document.getElementById("pago_fuera");
const redondeosPagoInput = document.getElementById("redondeos_pago");
const ventaTicketsCajaInput = document.getElementById("venta_tickets_caja");
const bcoPciaInput = document.getElementById("bco_pcia_ctacte");
const fondosTransfExcedInput = document.getElementById("fondos_transf_exced");
const diffCotizacionInput = document.getElementById("diff_cotizacion");

const cajaDeEmpleadosInput = document.getElementById("caja_de_empleados");
const cajaEmpleadosTicketsInput = document.getElementById("caja_empleados_tickets");
const recaudacionesVariasInput = document.getElementById("recaudaciones_varias");

const falloCajaEgresoInput = document.getElementById("fallo_caja_egreso");
const falloCajaIngresoInput = document.getElementById("fallo_caja_ingreso");
const sobranteCajaIngresoInput = document.getElementById("sobrante_caja_ingreso");

const resultadoSpan = document.getElementById("resultado_emfo");       // caja tipo TOTAL
const textoPoderRescate = document.getElementById("texto_poder_rescate"); // texto destacado
const btnGuardar = document.getElementById("guardar_emfo");
const panelEmfo = document.getElementById("panel_emfo");

const btnVolverSaldos = document.getElementById("btn_volver_saldos");
const btnVerEmfo = document.getElementById("btn_ver_emfo");

/* ---------------------------
   2) Funciones utilitarias: leerNumero y formatearARS
   ---------------------------
   - leerNumero(input): devuelve un número float seguro desde un input.
   - formatearARS(n): devuelve un string formateado en estilo "es-AR" (1.234,56)
*/

/* leerNumero:
   - Recibe una referencia a un elemento input (por ejemplo ventaPesosInput)
   - Lee input.value (es texto)
   - Si está vacío o no es número devuelve 0
   - Si es número devuelve parseFloat(valor)
*/
function leerNumero(input) {
  // defensiva: si el elemento no existe devolvemos 0
  if (!input) return 0;

  // leemos como texto
  let txt = (input.value || "").toString().trim();

  if (txt === "") return 0;

  // quitamos puntos de miles
  txt = txt.replace(/\./g, "");

  // la coma la pasamos a punto para parseFloat
  txt = txt.replace(",", ".");

  const n = parseFloat(txt);

  // si no es número devolvemos 0
  return isNaN(n) ? 0 : n;
}
/* formatearARS:
   - Recibe un número y devuelve una cadena como "1.234,56"
*/
function formatearARS(n) {
  if (isNaN(n)) return "0,00";

  return n.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function formatearInputEnVivo(input) {

  input.addEventListener("input", function () {

    // posición original del cursor
    let cursor = this.selectionStart;

    // valor actual del input
    let original = this.value;

    // quitamos puntos (los agregaremos de nuevo)
    let sinPuntos = original.replace(/\./g, "");

    // permitir solo dígitos y UNA sola coma
    sinPuntos = sinPuntos.replace(/[^\d,]/g, "");
    const partes = sinPuntos.split(",");
    if (partes.length > 2) {
      sinPuntos = partes[0] + "," + partes[1];
    }

    // separar parte entera y decimal
    let [entero, decimal] = sinPuntos.split(",");

    // si quedó vacío el entero, lo tomamos como 0
    if (entero === "") entero = "0";

    // aplicar separador de miles (super rápido)
    const enteroFormateado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // reconstruir valor final
    this.value = decimal !== undefined
      ? `${enteroFormateado},${decimal}`
      : enteroFormateado;

    // corregir posición de cursor sin saltos
    const diferencia = this.value.length - original.length;
    this.setSelectionRange(cursor + diferencia, cursor + diferencia);
  });
}

/* ---------------------------
   3) calcularPoderRescate (LA FORMULA)
   ---------------------------
   Fórmula exacta:
     resultado = Venta Fichas Pesos
               - Pago Fichas
               - Caja Empleados
               - Beneficio
               + Quebranto
   Interpretación:
     - Si resultado > 0 => PODER DEL PÚBLICO
     - Si resultado < 0 => RESCATE DEL PÚBLICO
   Esta función:
    - calcula el número
    - actualiza la caja (resultadoSpan) con formato moneda
    - actualiza el texto destacado (textoPoderRescate) con la Leyenda colorida
    - devuelve el número para que otras funciones lo usen
*/
function calcularPoderRescate() {
  // leemos los 5 campos implicados en la fórmula
  const ventaPesos = leerNumero(ventaPesosInput);
  const pagoFichas = leerNumero(pagoFichasInput);
  const cajaEmpleados = leerNumero(cajaEmpleadosInput);
  const beneficio = leerNumero(beneficioInput);
  const quebranto = leerNumero(quebrantoInput);

  // aplicamos la fórmula
  const resultado = ventaPesos - pagoFichas - cajaEmpleados - beneficio + quebranto;

  // mostramos en la caja tipo TOTAL con formato
  resultadoSpan.textContent = `$ ${ formatearARS(resultado) }`;

  // ponemos la leyenda destacada (texto grande debajo) y color según signo
  if (resultado > 0) {
    textoPoderRescate.textContent = `PODER DEL PÚBLICO: $ ${ formatearARS(resultado) }`;
    textoPoderRescate.classList.remove("resultado-rescate");
    textoPoderRescate.classList.add("resultado-poder");
  } else if (resultado < 0) {
    textoPoderRescate.textContent = `RESCATE DEL PÚBLICO: $ ${ formatearARS(Math.abs(resultado)) }`;
    textoPoderRescate.classList.remove("resultado-poder");
    textoPoderRescate.classList.add("resultado-rescate");
  } else {
    textoPoderRescate.textContent = `$ 0,00`;
    textoPoderRescate.classList.remove("resultado-poder", "resultado-rescate");
  }

  // devolvemos el número (positivo o negativo)
  return resultado;
}

/* ---------------------------
   4) Conectar inputs de la fórmula para cálculo en vivo
   ---------------------------
   Cada vez que el usuario escriba (evento 'input') en cualquiera de los campos
   que participan en la fórmula, llamamos a calcularPoderRescate para actualizar
   la vista inmediatamente.
*/
[ventaPesosInput, pagoFichasInput, cajaEmpleadosInput, beneficioInput, quebrantoInput]
  .forEach(el => {
    if (!el) return;
    el.addEventListener("input", calcularPoderRescate);
    el.addEventListener("paste", () => setTimeout(calcularPoderRescate, 50));
});
// Formateo en vivo para TODOS los inputs numéricos del formulario
const inputsNumericos = [
  ventaPesosInput, ventaDolaresInput, pagoFichasInput, cajaEmpleadosInput, beneficioInput, quebrantoInput,
  ventaReceptoraInput, pagoTicketsInput, pagoFueraInput, redondeosPagoInput,
  ventaTicketsCajaInput, bcoPciaInput, fondosTransfExcedInput, diffCotizacionInput,
  cajaDeEmpleadosInput, cajaEmpleadosTicketsInput, recaudacionesVariasInput,
  falloCajaEgresoInput, falloCajaIngresoInput, sobranteCajaIngresoInput
];

inputsNumericos.forEach(el => {
  if (el) formatearInputEnVivo(el);
});
/* ---------------------------
   5) Recolectar TODOS los campos del formulario
   ---------------------------
   Creamos un objeto con todos los valores del formulario (no solo los 5).
   Esto se guarda en localStorage para tener todo el contexto.
*/
function recolectarDatosFormulario() {
  return {
    venta_pesos: leerNumero(ventaPesosInput),
    venta_dolares: leerNumero(ventaDolaresInput),
    pago_fichas: leerNumero(pagoFichasInput),
    caja_empleados: leerNumero(cajaEmpleadosInput),
    beneficio: leerNumero(beneficioInput),
    quebranto: leerNumero(quebrantoInput),

    venta_receptora: leerNumero(ventaReceptoraInput),
    pago_tickets: leerNumero(pagoTicketsInput),
    pago_fuera: leerNumero(pagoFueraInput),
    redondeos_pago: leerNumero(redondeosPagoInput),
    venta_tickets_caja: leerNumero(ventaTicketsCajaInput),
    bco_pcia_ctacte: leerNumero(bcoPciaInput),
    fondos_transf_exced: leerNumero(fondosTransfExcedInput),
    diff_cotizacion: leerNumero(diffCotizacionInput),

    caja_de_empleados: leerNumero(cajaDeEmpleadosInput),
    caja_empleados_tickets: leerNumero(cajaEmpleadosTicketsInput),
    recaudaciones_varias: leerNumero(recaudacionesVariasInput),

    fallo_caja_egreso: leerNumero(falloCajaEgresoInput),
    fallo_caja_ingreso: leerNumero(falloCajaIngresoInput),
    sobrante_caja_ingreso: leerNumero(sobranteCajaIngresoInput),

    resultado_poder_rescate: calcularPoderRescate(),
    fecha_guardado: new Date().toLocaleString("es-AR")
  };
}

/* ---------------------------
   6) Limpiar formulario (vaciar inputs)
   --------------------------- */
function limpiarFormulario() {
  const todos = [
    ventaPesosInput, ventaDolaresInput, pagoFichasInput, cajaEmpleadosInput, beneficioInput, quebrantoInput,
    ventaReceptoraInput, pagoTicketsInput, pagoFueraInput, redondeosPagoInput, ventaTicketsCajaInput, bcoPciaInput, fondosTransfExcedInput, diffCotizacionInput,
    cajaDeEmpleadosInput, cajaEmpleadosTicketsInput, recaudacionesVariasInput,
    falloCajaEgresoInput, falloCajaIngresoInput, sobranteCajaIngresoInput
  ];
  todos.forEach(i => { if (i) i.value = ""; });

  // reseteamos las visualizaciones
  resultadoSpan.textContent = `$ ${ formatearARS(0) }`;
  textoPoderRescate.textContent = "";
  textoPoderRescate.classList.remove("resultado-poder", "resultado-rescate");
}

/* ---------------------------
   7) Guardar EMFO en localStorage
   --------------------------- */
function guardarEMFO() {
  const datos = recolectarDatosFormulario();

  // guardamos como string JSON bajo la clave "emfo_form"
  localStorage.setItem("emfo_form", JSON.stringify(datos));

  // actualizamos el panel para que se vea inmediatamente
  pintarPanelEMFO();

  // limpiamos el formulario para evitar confusiones visuales
  limpiarFormulario();

  // llevamos la vista suavemente al panel
  setTimeout(() => { if (panelEmfo) panelEmfo.scrollIntoView({ behavior: "smooth", block: "start" }); }, 120);

  // confirmación breve
  alert("✔ EMFO guardado correctamente");
}

/* ---------------------------
   8) Pintar el panel con lo guardado
   --------------------------- */
function pintarPanelEMFO() {
  const raw = localStorage.getItem("emfo_form");
  if (!raw) {
    panelEmfo.innerHTML = "<p>No hay EMFO guardado todavía.</p>";
    return;
  }

  const d = JSON.parse(raw);

  // Armamos un HTML legible, separando bloques para no confundir con el formulario
  panelEmfo.innerHTML = `
    <p><strong>Fecha guardado:</strong> ${d.fecha_guardado}</p>
    
    <h4>Principales</h4>
    <p><strong>Venta Fichas Pesos:</strong> $ ${formatearARS(d.venta_pesos)}</p>
    <p><strong>Venta Fichas Dólares:</strong> $ ${formatearARS(d.venta_dolares)}</p>
    <p><strong>Pago Fichas:</strong> $ ${formatearARS(d.pago_fichas)}</p>
    <p><strong>Caja Empleados:</strong> $ ${formatearARS(d.caja_empleados)}</p>
    <p><strong>Beneficio:</strong> $ ${formatearARS(d.beneficio)}</p>
    <p><strong>Quebranto:</strong> $ ${formatearARS(d.quebranto)}</p>

    <hr>

    <h4>Otras Recaudaciones</h4>
    <p><strong>Venta Receptora:</strong> $ ${formatearARS(d.venta_receptora)}</p>
    <p><strong>Pago de Tickets:</strong> $ ${formatearARS(d.pago_tickets)}</p>
    <p><strong>Pago Fuera del Sistema:</strong> $ ${formatearARS(d.pago_fuera)}</p>
    <p><strong>Redondeos en Pago:</strong> $ ${formatearARS(d.redondeos_pago)}</p>
    <p><strong>Venta Tickets por Caja:</strong> $ ${formatearARS(d.venta_tickets_caja)}</p>
    <p><strong>Bco. Pcia. Cta. Cte.:</strong> $ ${formatearARS(d.bco_pcia_ctacte)}</p>
    <p><strong>Fondos Transf. Exced.:</strong> $ ${formatearARS(d.fondos_transf_exced)}</p>
    <p><strong>Diferencia de Cotización:</strong> $ ${formatearARS(d.diff_cotizacion)}</p>

    <hr>

    <h4>Caja Empleados / Recaudaciones</h4>
    <p><strong>Caja de Empleados:</strong> $ ${formatearARS(d.caja_de_empleados)}</p>
    <p><strong>Caja Empleados Tickets:</strong> $ ${formatearARS(d.caja_empleados_tickets)}</p>
    <p><strong>Recaudaciones Varias:</strong> $ ${formatearARS(d.recaudaciones_varias)}</p>

    <hr>

    <h4>Faltantes / Sobrantes / Fallos</h4>
    <p><strong>Fallo Caja Egreso:</strong> $ ${formatearARS(d.fallo_caja_egreso)}</p>
    <p><strong>Fallo Caja Ingreso:</strong> $ ${formatearARS(d.fallo_caja_ingreso)}</p>
    <p><strong>Sobrante Caja Ingreso:</strong> $ ${formatearARS(d.sobrante_caja_ingreso)}</p>

    <hr>

    <p class="${d.resultado_poder_rescate > 0 ? "resultado-poder" : d.resultado_poder_rescate < 0 ? "resultado-rescate" : ""}">
      <strong>Resultado (Poder/Rescate):</strong>
      ${ d.resultado_poder_rescate > 0 ? " PODER DEL PÚBLICO: $ " + formatearARS(d.resultado_poder_rescate) :
          d.resultado_poder_rescate < 0 ? " RESCATE DEL PÚBLICO: $ " + formatearARS(Math.abs(d.resultado_poder_rescate)) :
          " $ 0,00"
      }
    </p>

    <div style="margin-top:10px;">
      <button id="editar_emfo" class="btn-editar">✏️ Editar EMFO</button>
    </div>
  `;

  // Añadimos evento al botón editar del panel
  const be = document.getElementById("editar_emfo");
  if (be) be.addEventListener("click", cargarDatosAFormulario);
}

/* ---------------------------
   9) Cargar datos guardados al formulario para editar
   --------------------------- */
function cargarDatosAFormulario() {
  const raw = localStorage.getItem("emfo_form");
  if (!raw) {
    alert("No hay EMFO guardado para editar");
    return;
  }
  const d = JSON.parse(raw);

  // Asignamos cada valor al input correspondiente
  if (ventaPesosInput) ventaPesosInput.value = d.venta_pesos;
  if (ventaDolaresInput) ventaDolaresInput.value = d.venta_dolares;
  if (pagoFichasInput) pagoFichasInput.value = d.pago_fichas;
  if (cajaEmpleadosInput) cajaEmpleadosInput.value = d.caja_empleados;
  if (beneficioInput) beneficioInput.value = d.beneficio;
  if (quebrantoInput) quebrantoInput.value = d.quebranto;

  if (ventaReceptoraInput) ventaReceptoraInput.value = d.venta_receptora;
  if (pagoTicketsInput) pagoTicketsInput.value = d.pago_tickets;
  if (pagoFueraInput) pagoFueraInput.value = d.pago_fuera;
  if (redondeosPagoInput) redondeosPagoInput.value = d.redondeos_pago;
  if (ventaTicketsCajaInput) ventaTicketsCajaInput.value = d.venta_tickets_caja;
  if (bcoPciaInput) bcoPciaInput.value = d.bco_pcia_ctacte;
  if (fondosTransfExcedInput) fondosTransfExcedInput.value = d.fondos_transf_exced;
  if (diffCotizacionInput) diffCotizacionInput.value = d.diff_cotizacion;

  if (cajaDeEmpleadosInput) cajaDeEmpleadosInput.value = d.caja_de_empleados;
  if (cajaEmpleadosTicketsInput) cajaEmpleadosTicketsInput.value = d.caja_empleados_tickets;
  if (recaudacionesVariasInput) recaudacionesVariasInput.value = d.recaudaciones_varias;

  if (falloCajaEgresoInput) falloCajaEgresoInput.value = d.fallo_caja_egreso;
  if (falloCajaIngresoInput) falloCajaIngresoInput.value = d.fallo_caja_ingreso;
  if (sobranteCajaIngresoInput) sobranteCajaIngresoInput.value = d.sobrante_caja_ingreso;

  // Recalculamos el resultado para que se vea en el formulario
  calcularPoderRescate();

  // Colocamos el botón en modo "Actualizar"
  btnGuardar.textContent = "Actualizar Saldos EMFO";
  btnGuardar.classList.add("modo-actualizar");

  // Recalculamos el resultado para que se vea en el formulario
  calcularPoderRescate();

  // re-formatear todos los campos al estilo 1.234,56
  inputsNumericos.forEach(el => { if (el) el.dispatchEvent(new Event("input")); });

  // Colocamos el botón en modo "Actualizar"
  btnGuardar.textContent = "Actualizar Saldos EMFO";
  btnGuardar.classList.add("modo-actualizar");

  // Llevamos la vista al formulario para editar con comodidad
  window.scrollTo({ top: 0, behavior: "smooth" });

  // re-formatear todos los campos al estilo 1.234,56
inputsNumericos.forEach(el => { if (el) el.dispatchEvent(new Event("input")); });
}

/* ---------------------------
   10) Manejo del evento click en Guardar / Actualizar
   --------------------------- */
btnGuardar.addEventListener("click", function() {
  // Guardamos lo que haya en el formulario (sea nuevo o edición)
  guardarEMFO();

  // Volvemos a estado normal del botón por si estaba en modo actualizar
  btnGuardar.textContent = "Guardar EMFO";
  btnGuardar.classList.remove("modo-actualizar");
});

/* ---------------------------
   11) Botones de navegación (volver a saldos / ver panel)
   --------------------------- */

/* Volver a Saldos Anteriores:
   - Asume que tu formulario de saldos está en index.html
   - Si no existe index.html, el botón seguirá intentando abrir esa ruta.
*/
if (btnVolverSaldos) {
  btnVolverSaldos.addEventListener("click", () => {
    // Cambia la ubicación a index.html
    window.location.href = "index.html";
  });
}

/* Ver EMFO y Saldos Finales:
   - Hace scroll al panel y, si está oculto, lo muestra.
*/
if (btnVerEmfo) {
  btnVerEmfo.addEventListener("click", () => {
    // Asegurarnos que el panel esté pintado
    pintarPanelEMFO();
    // Scroll hacia el panel
    setTimeout(() => { if (panelEmfo) panelEmfo.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
  });
}

/* ---------------------------
   12) Inicialización al cargar la página
   --------------------------- */
(function inicializar() {
  // Mostrar lo que exista guardado previamente
  pintarPanelEMFO();

  // Recalcular resultado si el usuario recargó la página con valores en inputs
  calcularPoderRescate();
})();




document.addEventListener("DOMContentLoaded", () => {
    const botonIr = document.getElementById("btn_volver_saldos");
  if (botonIr) {
    botonIr.addEventListener("click", () => {
      window.location.href = "index.html";
    });

  } else {
    console.warn('No se encontró el botón con id="btn_volver_saldos".');
  }
});