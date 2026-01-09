/**************************************************************
 * EMFO - MOTOR BASE DE INPUTS CONTABLES
 * USAR EN TODAS LAS PÁGINAS
 **************************************************************/

/* ---------- FORMATO PESOS ---------- */
function formatoPesos(n) {
  return "$ " + n.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/* ---------- LEER INPUT ---------- */
function leerNumero(input) {
  if (!input || input.value.trim() === "") return 0;
  return parseFloat(input.value.replace(/\./g, ""));
}

/* ---------- CALCULAR TOTAL ---------- */
function calcularTotal(inputs, salida) {
  const total = inputs.reduce((acc, i) => acc + leerNumero(i), 0);
  if (salida) salida.textContent = formatoPesos(total);
  return total;
}

/* ---------- COMPORTAMIENTO INPUTS ---------- */
function activarInputsContables(inputs, salidaTotal) {

  inputs.forEach(input => {

    input.addEventListener("input", () => {
      input.classList.add("campo-editado");
      calcularTotal(inputs, salidaTotal);
    });

    input.addEventListener("blur", () => {
      if (input.value.trim() !== "") {
        input.value = leerNumero(input).toLocaleString("es-AR");
      }
    });

  });
}

/* ---------- MENSAJE VERDE ---------- */
function mostrarMensajeOK(mensaje) {
  mensaje.classList.remove("oculto");
  mensaje.classList.add("visible");

  setTimeout(() => {
    mensaje.classList.remove("visible");
    mensaje.classList.add("oculto");
  }, 2000);
}