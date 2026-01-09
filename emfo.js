/* =========================================================
   ESPERAMOS A QUE EL HTML ESTÉ COMPLETAMENTE CARGADO
   Esto evita errores de "elemento no encontrado"
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     FUNCIÓN PARA FORMATEAR NÚMEROS COMO PESOS ARGENTINOS
     
     - Recibe un valor (número o texto)
     - Si viene vacío o undefined → usa 0
     - Devuelve un texto con formato $ argentino
  ========================================================= */
  function formatearPesos(valor) {
    return Number(valor || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  /* =========================================================
     LECTURA DE DATOS DESDE LOCALSTORAGE
     
     - "emfo_form" fue guardado desde el formulario de carga
     - JSON.parse convierte el texto en objeto
     - Si no existe → usamos objeto vacío {}
  ========================================================= */
  const datos = JSON.parse(localStorage.getItem("emfo_form")) || {};

  /* =========================================================
     ===================== INGRESOS ==========================
  ========================================================= */

  /* ---------- CAJA DE EMPLEADOS ---------- */

  // Fichas en caja de empleados
  const inCajaFichas = Number(datos.caja_empleados || 0);

  // Monedas / tickets en caja de empleados
  const inCajaMonedas = Number(datos.caja_empleados_tickets || 0);

  // Mostramos los valores en pantalla
  document.getElementById("in_caja_empleados_fichas").textContent =
    formatearPesos(inCajaFichas);

  document.getElementById("in_caja_empleados_monedas").textContent =
    formatearPesos(inCajaMonedas);

  // Subtotal caja empleados = fichas + monedas
  const subIngCajaEmpleados = inCajaFichas + inCajaMonedas;

  document.getElementById("sub_ing_caja_empleados").textContent =
    formatearPesos(subIngCajaEmpleados);

  /* ---------- BANCO ---------- */

  // Saldo banco cuenta corriente
  const inBanco = Number(datos.bco_pcia_ctacte || 0);

  document.getElementById("in_bco_pcia_ctacte").textContent =
    formatearPesos(inBanco);

  /* ---------- OTROS INGRESOS ---------- */

  const inDifCot        = Number(datos.diff_cotizacion || 0);
  const inFondosExced   = Number(datos.fondos_transf_exced || 0);
  const inRecaudaciones = Number(datos.recaudaciones_varias || 0);
  const inRespFalla    = Number(datos.fallo_caja_ingreso || 0);

  // Redondeos solo si son positivos (ingreso)
  const inSobrRed =
    Number(datos.redondeos_pago > 0 ? datos.redondeos_pago : 0);

  const inSobrCaja = Number(datos.sobrante_caja_ingreso || 0);

  // Mostrar en pantalla
  document.getElementById("in_dif_cotizacion").textContent = formatearPesos(inDifCot);
  document.getElementById("in_fondos_transf_exced").textContent = formatearPesos(inFondosExced);
  document.getElementById("in_recaudaciones_varias").textContent = formatearPesos(inRecaudaciones);
  document.getElementById("in_responsables_falla").textContent = formatearPesos(inRespFalla);
  document.getElementById("in_sobrantes_redondeos").textContent = formatearPesos(inSobrRed);
  document.getElementById("in_sobrante_caja").textContent = formatearPesos(inSobrCaja);

  // Subtotal otros ingresos
  const subIngOtros =
    inDifCot +
    inFondosExced +
    inRecaudaciones +
    inRespFalla +
    inSobrRed +
    inSobrCaja;

  document.getElementById("sub_ing_otros_ingresos").textContent =
    formatearPesos(subIngOtros);

  /* ---------- FICHAS A PAGAR (INGRESO) ---------- */

  // Sale de pago de fichas + poder rescate
  const inFichasAPagar =
    Number(datos.pago_fichas || 0) +
    Number(datos.resultado_poder_rescate || 0);

  document.getElementById("in_fichas_a_pagar").textContent =
    formatearPesos(inFichasAPagar);

  /* ---------- VENTA DE FICHAS ---------- */

  const inVentaPesos   = Number(datos.venta_pesos || 0);
  const inVentaDolares = Number(datos.venta_dolares || 0);

  document.getElementById("in_venta_fichas_pesos").textContent =
    formatearPesos(inVentaPesos);

  document.getElementById("in_venta_fichas_dolares").textContent =
    formatearPesos(inVentaDolares);

  const subIngVentaFichas = inVentaPesos + inVentaDolares;

  document.getElementById("sub_ing_venta_fichas").textContent =
    formatearPesos(subIngVentaFichas);

  /* ---------- VENTA DE MONEDAS ---------- */

  const inVentaReceptora = Number(datos.venta_receptora || 0);
  const inVentaTickets  = Number(datos.venta_tickets_caja || 0);

  document.getElementById("in_venta_receptora").textContent =
    formatearPesos(inVentaReceptora);

  document.getElementById("in_venta_tickets_caja").textContent =
    formatearPesos(inVentaTickets);

  const subIngVentaMonedas =
    inVentaReceptora + inVentaTickets;

  document.getElementById("sub_ing_venta_monedas").textContent =
    formatearPesos(subIngVentaMonedas);

  /* =========================================================
     ===================== EGRESOS ===========================
  ========================================================= */

  // Banco egresos (se muestra igual que ingresos)
  document.getElementById("eg_bco_pcia_ctacte").textContent =
    formatearPesos(inBanco);

  document.getElementById("eg_debito_cut_excedente").textContent =
    formatearPesos(inBanco);

  const egDebitoCUT       = Number(datos.fondos_transf_exced || 0);
  const egDifCot          = inDifCot;
  const egFichasPremiadas = inFichasAPagar;

  // Redondeos negativos → egreso
  const egSobrCaja =
    Number(datos.redondeos_pago < 0 ? Math.abs(datos.redondeos_pago) : 0);

  const egSobrRed   = Number(datos.sobrante_redondeos || 0);
  const egRespFalla = Number(datos.fallo_caja_egreso || 0);

  document.getElementById("eg_debito_cut").textContent = formatearPesos(egDebitoCUT);
  document.getElementById("eg_dif_cotizacion").textContent = formatearPesos(egDifCot);
  document.getElementById("eg_fichas_premiadas").textContent = formatearPesos(egFichasPremiadas);
  document.getElementById("eg_sobrante_caja").textContent = formatearPesos(egSobrCaja);
  document.getElementById("eg_sobrante_redondeos").textContent = formatearPesos(egSobrRed);
  document.getElementById("eg_responsables_falla").textContent = formatearPesos(egRespFalla);

  const subEgrOtros =
    egDebitoCUT +
    egDifCot +
    egFichasPremiadas +
    egSobrCaja +
    egSobrRed +
    egRespFalla;

  document.getElementById("sub_egr_otros").textContent =
    formatearPesos(subEgrOtros);

  document.getElementById("eg_pago_fichas_empleados").textContent =
    formatearPesos(inCajaFichas);

  /* ---------- PASIVOS CORRIENTES ---------- */

  const egFichasAPagar  = Number(datos.pago_fichas || 0);
  

  document.getElementById("eg_fichas_a_pagar").textContent =
    formatearPesos(egFichasAPagar);

  const egTicketsAPagar = Number(datos.pago_tickets || 0);
  const egPagoFuera= Number(datos.pago_fuera||0);
  const egtotalTikets= egTicketsAPagar+egPagoFuera;

  document.getElementById("eg_tickets_a_pagar").textContent =
    formatearPesos(egtotalTikets);

  /* =========================================================
     ===================== TOTALES ===========================
  ========================================================= */

  const totalIngresos =
    subIngCajaEmpleados +
    inBanco +
    subIngOtros +
    inFichasAPagar +
    subIngVentaFichas +
    subIngVentaMonedas;

  const totalEgresos =
    inBanco +
    inBanco +
    egDebitoCUT +
    egDifCot +
    egFichasPremiadas +
    egSobrCaja +
    egSobrRed +
    egRespFalla +
    inCajaFichas +
    egFichasAPagar +
    egTicketsAPagar;

  document.getElementById("total_ingresos").textContent =
    formatearPesos(totalIngresos);

  document.getElementById("total_egresos").textContent =
    formatearPesos(totalEgresos);

  document.getElementById("resultado_emfo").textContent =
    formatearPesos(totalIngresos - totalEgresos);

});

document.addEventListener("DOMContentLoaded", () => {
    const botonIr = document.getElementById("ir-form_carga");
  if (botonIr) {
    botonIr.addEventListener("click", () => {
      window.location.href = "form_carga.html";
    });

  } else {
    console.warn('No se encontró el botón con id="ir-form_carga".');
  }
});
document.addEventListener("DOMContentLoaded", () => {
    const botonIr = document.getElementById("ir-nuevos-saldos");
  if (botonIr) {
    botonIr.addEventListener("click", () => {
      window.location.href = "nuevos_saldos.html";
    });

  } else {
    console.warn('No se encontró el botón con id="ir-form_carga".');
  }
});