/* =========================================================
   ESPERAMOS A QUE EL HTML SE CARGUE COMPLETO
   ---------------------------------------------------------
   Esto evita errores del tipo:
   "no se puede leer textContent de null"
   porque nos aseguramos que todos los IDs
   ya existen en pantalla.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     FUNCIÓN PARA FORMATEAR NÚMEROS COMO PESOS ARGENTINOS
     ---------------------------------------------------------
     - Recibe un número (por ejemplo: 1234.5)
     - Devuelve un texto con formato:
       1.234,50
  ========================================================= */
  function formatearPesos(valor) {
    return Number(valor || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
/* =========================================================
     LEEMOS LOS DATOS GUARDADOS DESDE saldos del INDEX
     ---------------------------------------------------------
  ========================================================= */
  const datos_saldos = JSON.parse(localStorage.getItem("saldos")) || {};


 


  /* =========================================================
     LEEMOS LOS DATOS GUARDADOS DESDE form_carga
     ---------------------------------------------------------
     En form_carga.js vos guardás todo así:
     localStorage.setItem("emfo_form", JSON.stringify(datos))
  ========================================================= */
  const datos = JSON.parse(localStorage.getItem("emfo_form")) || {};

  /* =========================================================
     1️⃣ EFECTIVO
     ---------------------------------------------------------
     El efectivo nuevo se calcula sumando INGRESOS
     que afectan caja y restando EGRESOS que salen de caja.
  ========================================================= */

  /* INGRESOS QUE SUMAN A EFECTIVO */
  const efectivoIngresos =
    Number(datos.venta_receptora || 0) +
    Number(datos.venta_tickets_caja || 0) +
    Number(datos.venta_pesos || 0) +
    Number(datos.fondos_transf_exced || 0) +
    Number(datos.recaudaciones_varias || 0) +
    Number(datos.fallo_caja_ingreso || 0) +
    Number(datos.redondeos_pago > 0 ? datos.redondeos_pago : 0) +
    Number(datos.sobrante_caja_ingreso || 0) +
    Number(datos.diff_cotizacion || 0)
    ;

  /* EGRESOS QUE RESTAN A EFECTIVO */
  const efectivoEgresos =
    Number(datos.bco_pcia_ctacte || 0) +
    Number(datos.fondos_transf_exced || 0) +
    Number(datos.fallo_caja_egreso || 0) +
    Number(datos.redondeos_pago < 0 ? Math.abs(datos.redondeos_pago) : 0) +
    Number(datos.caja_empleados || 0) +
    Number(datos.pago_fichas || 0) +
    Number(datos.pago_tickets || 0);

  /* EFECTIVO FINAL */
  const efectivoFinal = efectivoIngresos - efectivoEgresos+Number(datos_saldos.efectivo ||0);

  document.getElementById("saldoEfectivo").textContent =
    formatearPesos(efectivoFinal);

  /* =========================================================
     2️⃣ DEPÓSITO CAJA EMPLEADOS (PESOS)
     ---------------------------------------------------------
     Al saldo anterior se le suma:
     - Caja empleados fichas
     - Caja empleados monedas
  ========================================================= */
  const cajaEmpleados =
    Number(datos.caja_empleados || 0) +
    Number(datos.caja_empleados_tickets || 0)+
    Number(datos_saldos.depositos ||0);/*error de nombre en la variable , caja de empleados saldos viejos ose index es depositos*/

  document.getElementById("saldoCajaEmpleados").textContent =
    formatearPesos(cajaEmpleados);

  /* =========================================================
     3️⃣ MONEDA EXTRANJERA
     ---------------------------------------------------------
     Se incrementa solo con:
     - Venta de fichas en dólares
  ========================================================= */
  const monedaExtranjera =
    Number(datos.venta_dolares || 0)+
    Number(datos_saldos.extranjera ||0);

  document.getElementById("saldoMonedaExtranjera").textContent =
    formatearPesos(monedaExtranjera);

  /* =========================================================
     4️⃣ SOBRANTE DE CAJA PESOS
     ---------------------------------------------------------
     - Si entra por ingresos, suma
     - Si entra por egresos, resta
  ========================================================= */
  const sobranteCaja =
    Number(datos.sobrante_caja_ingreso || 0) -
    Number(datos.redondeos_pago < 0 ? Math.abs(datos.redondeos_pago) : 0);

  document.getElementById("saldoSobranteCaja").textContent =
    formatearPesos(sobranteCaja);

  /* =========================================================
     5️⃣ RESPONSABLE FALLO DE CAJA
     ---------------------------------------------------------
     - Fallo de caja ingreso suma
     - Fallo de caja egreso resta
  ========================================================= */
  const responsableFalla =
    Number(datos.fallo_caja_ingreso || 0) -
    Number(datos.fallo_caja_egreso || 0);

  document.getElementById("saldoResponsableFalla").textContent =
    formatearPesos(responsableFalla);

  /* =========================================================
     6️⃣ ANTICIPO POKER TORNEO
     ---------------------------------------------------------
     Por ahora queda fijo en cero
  ========================================================= */
  const anticipoPoker = 0;

  document.getElementById("saldoAnticipoPoker").textContent =
    formatearPesos(anticipoPoker);

  /* =========================================================
     7️⃣ TOTAL GENERAL
     ---------------------------------------------------------
     Suma de TODOS los saldos nuevos
  ========================================================= */
  const totalFinal =
    efectivoFinal +
    cajaEmpleados +
    monedaExtranjera +
    sobranteCaja +
    responsableFalla +
    anticipoPoker;

  document.getElementById("saldoTotal").textContent =
    formatearPesos(totalFinal);

    /* =====================================================
     BOTÓN GUARDAR NUEVOS SALDOS
     ===================================================== */
  document.getElementById("btn_guardar_saldos").addEventListener("click", () => {

    const nuevosSaldos = {
      efectivo,
      caja_empleados: cajaEmpleados,
      moneda_extranjera: monedaExtranjera,
      sobrante_caja: sobranteCaja,
      responsables_falla: responsablesFalla,
      anticipo_poker: anticipoPoker
    };

    localStorage.setItem("saldos_finales", JSON.stringify(nuevosSaldos));

    alert("Nuevos saldos guardados correctamente");
  });

const hoy = new Date();

document.getElementById("fecha_cierre").textContent =
  hoy.toLocaleDateString("es-AR");

const nroCierre = Number(localStorage.getItem("numero_cierre") || 0) + 1;
localStorage.setItem("numero_cierre", nroCierre);

document.getElementById("numero_cierre").textContent =
  "Cierre Nº " + nroCierre;

});
