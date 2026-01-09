/**************************************************************
 * SCRIPT COMPLETO DEL SISTEMA EMFO - SALDOS ANTERIORES
 **************************************************************/

/* ============================================================
   1) CAPTURAMOS TODOS LOS INPUTS Y ELEMENTOS
============================================================ */
function formatoPesos(numero) {
  return "$ " + numero.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}





const inputEfectivo   = document.getElementById("efectivo");
const inputDepositos  = document.getElementById("depositos");
const inputExtranjera = document.getElementById("extranjera");
const inputSobrante   = document.getElementById("sobrante");
const inputFallo      = document.getElementById("fallo");
const inputPoker      = document.getElementById("poker");

const textoTotal   = document.getElementById("total");
const botonGuardar = document.getElementById("guardar");
const panelSaldos  = document.getElementById("vista-saldos");
const mensajeOK    = document.getElementById("mensaje-guardado");

/* ============================================================
   2) FUNCIÓN PARA LEER UN INPUT COMO NÚMERO
============================================================ */
function leerNumero(input) {
  if (input.value.trim() === "") return 0;
  return parseFloat(input.value);
}

/* ============================================================
   3) CALCULAR TOTAL
============================================================ */
function calcularTotal() {
  const total =
    leerNumero(inputEfectivo) +
    leerNumero(inputDepositos) +
    leerNumero(inputExtranjera) +
    leerNumero(inputSobrante) +
    leerNumero(inputFallo) +
    leerNumero(inputPoker);

  //textoTotal.textContent = "$ " + total.toFixed(2);
  textoTotal.textContent = "$ " + total.toFixed(2);
}

/* ============================================================
   4) ESCUCHAR CAMBIOS EN LOS INPUTS
   - recalcula
   - resalta campo editado
============================================================ */
[
  inputEfectivo,
  inputDepositos,
  inputExtranjera,
  inputSobrante,
  inputFallo,
  inputPoker
].forEach(input => {
  input.addEventListener("input", () => {
    calcularTotal();
    input.classList.add("campo-editado");
  });
});

/* ============================================================
   5) GUARDAR SALDOS
============================================================ */
function guardarSaldos() {

    const suma =
  leerNumero(inputEfectivo) +
  leerNumero(inputDepositos) +
  leerNumero(inputExtranjera) +
  leerNumero(inputSobrante) +
  leerNumero(inputFallo) +
  leerNumero(inputPoker);

if (suma === 0) {
  alert("⚠️ No podés guardar saldos en cero.");
  return;
}
  const datos = {
    
    efectivo: leerNumero(inputEfectivo),
    depositos: leerNumero(inputDepositos),
    extranjera: leerNumero(inputExtranjera),
    sobrante: leerNumero(inputSobrante),
    fallo: leerNumero(inputFallo),
    poker: leerNumero(inputPoker)
  };

  datos.total =
    datos.efectivo +
    datos.depositos +
    datos.extranjera +
    datos.sobrante +
    datos.fallo +
    datos.poker;

  localStorage.setItem("saldos", JSON.stringify(datos));

  mostrarSaldosGuardados();

  /* ---- LIMPIAMOS INPUTS ---- */
  [
    inputEfectivo,
    inputDepositos,
    inputExtranjera,
    inputSobrante,
    inputFallo,
    inputPoker
  ].forEach(input => {
    input.value = "";
    input.classList.remove("campo-editado");
  });

  textoTotal.textContent = "$ 0.00";
    
  botonGuardar.classList.add("btn-guardado-ok");
  /* ---- MENSAJE DE CONFIRMACIÓN ---- */
  mensajeOK.classList.remove("oculto");

  setTimeout(() => {
    botonGuardar.classList.remove("btn-guardado-ok");
    mensajeOK.classList.add("oculto");
  }, 2000);
}

/* ============================================================
   6) MOSTRAR SALDOS GUARDADOS
============================================================ */
function mostrarSaldosGuardados() {

  const guardado = localStorage.getItem("saldos");

  if (!guardado) {
    panelSaldos.innerHTML = "<p>No hay saldos guardados todavía.</p>";
    return;
  }

  const d = JSON.parse(guardado);

  panelSaldos.innerHTML = `
    <button id="editar" class="btn-editar">Editar Saldos</button>

    <p><strong>Efectivo:</strong> ${formatoPesos(d.efectivo)}</p>
    <p><strong>Depósitos Caja Empleados:</strong> $ ${d.depositos.toFixed(2)}</p>
    <p><strong>Moneda Extranjera:</strong> $ ${d.extranjera.toFixed(2)}</p>
    <p><strong>Sobrante de Caja:</strong> $ ${d.sobrante.toFixed(2)}</p>
    <p><strong>Responsable / Fallo:</strong> $ ${d.fallo.toFixed(2)}</p>
    <p><strong>Anticipo Poker Torneo:</strong> $ ${d.poker.toFixed(2)}</p>

    <hr>
    <p><strong>TOTAL:</strong> $ ${d.total.toFixed(2)}</p>
  `;

  document.getElementById("editar")
    .addEventListener("click", cargarParaEditar);
}

/* ============================================================
   7) EDITAR SALDOS
============================================================ */
function cargarParaEditar() {

  const d = JSON.parse(localStorage.getItem("saldos"));

  inputEfectivo.value   = d.efectivo   || "";
  inputDepositos.value  = d.depositos  || "";
  inputExtranjera.value = d.extranjera || "";
  inputSobrante.value   = d.sobrante   || "";
  inputFallo.value      = d.fallo      || "";
  inputPoker.value      = d.poker      || "";

  calcularTotal();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============================================================
   8) BOTÓN GUARDAR
============================================================ */
botonGuardar.addEventListener("click", guardarSaldos);

/* ============================================================
   9) MOSTRAR AL CARGAR
============================================================ */
mostrarSaldosGuardados();

/* ============================================================
   10) BOTÓN IR A FORM_CARGA
============================================================ */
const botonIr = document.getElementById("ir-form_carga");

if (botonIr) {
  botonIr.addEventListener("click", () => {
    window.location.href = "form_carga.html";
  });
}