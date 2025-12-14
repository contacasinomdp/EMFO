/**************************************************************
 *  SCRIPT COMPLETO DEL SISTEMA EMFO - SALDOS ANTERIORES
 *  ----------------------------------------------------------
 *  Este archivo contiene TODA la lógica del sistema:
 *  - Leer los valores de cada campo del formulario
 *  - Calcular el total automáticamente mientras escribís
 *  - Guardar los saldos en memoria (localStorage)
 *  - Mostrar los saldos guardados en pantalla
 *  - Permitir EDITAR los saldos guardados
 *  
 *  CADA BLOQUE DE CÓDIGO ESTÁ EXPLICADO COMO SI NO SUPIERAS NADA.
 ***************************************************************/



/**************************************************************
 * 1) CAPTURAR LOS ELEMENTOS DEL HTML
 * ------------------------------------------------------------
 * Vamos a "enganchar" (obtener) cada elemento con document.getElementById(),
 * que sirve para acceder a cualquier etiqueta que tenga un id="...".
 ***************************************************************/

 const inputEfectivo   = document.getElementById("efectivo");   // Campo: Efectivo
 const inputDepositos  = document.getElementById("depositos");  // Campo: Depósitos Caja Empleados
 const inputExtranjera = document.getElementById("extranjera"); // Campo: Moneda Extranjera
 const inputSobrante   = document.getElementById("sobrante");   // Campo: Sobrante de Caja
 const inputFallo      = document.getElementById("fallo");      // Campo: Responsable / Fallo
 const inputPoker      = document.getElementById("poker");      // Campo: Anticipo Poker Torneo
 
 const textoTotal = document.getElementById("total");           // Aquí mostramos el total
 const botonGuardar = document.getElementById("guardar");       // Botón para guardar
 
 const panelSaldos = document.getElementById("vista-saldos");   // Donde se muestran los saldos guardados
 
 
 
 /**************************************************************
  * 2) FUNCIÓN PARA CONVERTIR EL VALOR DE UN INPUT A NÚMERO
  * ------------------------------------------------------------
  * Cuando leemos un input, el valor siempre viene como texto (string),
  * aunque sea un número. Por eso usamos parseFloat().
  * Pero si está vacío, parseFloat da NaN, entonces devolvemos 0.
  ***************************************************************/
 function leerNumero(input) {
     // Si el input está vacío, devolvemos 0 directamente
     if (input.value.trim() === "") {
         return 0;
     }
 
     // Convertimos el texto a número decimal
     return parseFloat(input.value);
 }
 
 
 
 /**************************************************************
  * 3) FUNCIÓN PARA CALCULAR EL TOTAL
  * ------------------------------------------------------------
  * Se suman TODOS los campos uno por uno.
  * Luego actualizamos el texto en pantalla.
  ***************************************************************/
 function calcularTotal() {
     // Sumamos cada valor obtenido con leerNumero()
     const total =
         leerNumero(inputEfectivo) +
         leerNumero(inputDepositos) +
         leerNumero(inputExtranjera) +
         leerNumero(inputSobrante) +
         leerNumero(inputFallo) +
         leerNumero(inputPoker);
 
     // Mostramos el resultado formateado con 2 decimales
     textoTotal.textContent = "$ " + total.toFixed(2);
 }
 
 
 
 /**************************************************************
  * 4) ACTIVAR EL CÁLCULO AUTOMÁTICO MIENTRAS SE ESCRIBE
  * ------------------------------------------------------------
  * El evento input se dispara cuando el usuario escribe, borra o cambia algo.
  * Lo agregamos a TODOS los campos.
  ***************************************************************/
 [inputEfectivo, inputDepositos, inputExtranjera, inputSobrante, inputFallo, inputPoker]
     .forEach(input => {
         input.addEventListener("input", calcularTotal);
     });
 
 
 
 /**************************************************************
  * 5) FUNCIÓN PARA GUARDAR LOS SALDOS EN localStorage
  * ------------------------------------------------------------
  * localStorage guarda información en el navegador y NO se borra
  * aunque cierres Chrome o apagues la computadora.
  * 
  * Guardaremos un OBJETO con todos los saldos.
  ***************************************************************/
 function guardarSaldos() {
     // Armamos el objeto con todos los valores actuales
     const datos = {
         efectivo: leerNumero(inputEfectivo),
         depositos: leerNumero(inputDepositos),
         extranjera: leerNumero(inputExtranjera),
         sobrante: leerNumero(inputSobrante),
         fallo: leerNumero(inputFallo),
         poker: leerNumero(inputPoker),
         total: leerNumero(inputEfectivo) +
                leerNumero(inputDepositos) +
                leerNumero(inputExtranjera) +
                leerNumero(inputSobrante) +
                leerNumero(inputFallo) +
                leerNumero(inputPoker)
     };
 
     // Guardamos el objeto convertido a texto JSON
     localStorage.setItem("saldos", JSON.stringify(datos));
 
     // Actualizamos la vista
     mostrarSaldosGuardados();
         /******************************************************
     * LUEGO DE GUARDAR: LIMPIAMOS TODOS LOS INPUTS
     * ----------------------------------------------------
     * Esto evita confusiones visuales. Así queda claro 
     * que los datos YA están guardados y el formulario 
     * queda preparado para una nueva carga.
     ******************************************************/
          inputEfectivo.value   = "";
          inputDepositos.value  = "";
          inputExtranjera.value = "";
          inputSobrante.value   = "";
          inputFallo.value      = "";
          inputPoker.value      = "";
          
          // Reseteamos el total mostrado
          textoTotal.textContent = "$ 0.00"; // ← Pongo punto, no coma
          /******************************************************
 * LUEGO DE GUARDAR: LIMPIAMOS TODOS LOS INPUTS
 ******************************************************/

 }
 
 
 
 /**************************************************************
  * 6) FUNCIÓN PARA MOSTRAR LOS SALDOS GUARDADOS
  * ------------------------------------------------------------
  * Obtiene lo que está guardado en localStorage y lo muestra
  * en el panel inferior del HTML.
  ***************************************************************/
 function mostrarSaldosGuardados() {
     // Buscamos si hay datos guardados
     const datosGuardados = localStorage.getItem("saldos");
 
     // Si no hay datos, mostramos mensaje
     if (!datosGuardados) {
         panelSaldos.innerHTML = "<p>No hay saldos guardados todavía.</p>";
         return;
     }
 
     // Convertimos el texto JSON a objeto
     const datos = JSON.parse(datosGuardados);
 
     // Creamos el contenido HTML con los valores guardados
     panelSaldos.innerHTML = `
         <p><strong>Efectivo:</strong> $ ${datos.efectivo.toFixed(2)}</p>
         <p><strong>Depósitos Caja Empleados:</strong> $ ${datos.depositos.toFixed(2)}</p>
         <p><strong>Moneda Extranjera:</strong> $ ${datos.extranjera.toFixed(2)}</p>
         <p><strong>Sobrante de Caja:</strong> $ ${datos.sobrante.toFixed(2)}</p>
         <p><strong>Responsable / Fallo:</strong> $ ${datos.fallo.toFixed(2)}</p>
         <p><strong>Anticipo Poker Torneo:</strong> $ ${datos.poker.toFixed(2)}</p>
 
         <hr>
 
         <p class="total-guardado"><strong>TOTAL:</strong> $ ${datos.total.toFixed(2)}</p>
 
         <button id="editar" class="btn-editar">Editar Saldos</button>
     `;
 
     // Activamos el botón de edición
     document.getElementById("editar").addEventListener("click", cargarParaEditar);
 }
 
 
 
 /**************************************************************
  * 7) FUNCIÓN PARA CARGAR LOS DATOS GUARDADOS EN LOS INPUTS 
  *    PARA PODER EDITARLOS
  * ------------------------------------------------------------
  ***************************************************************/
 function cargarParaEditar() {
     const datos = JSON.parse(localStorage.getItem("saldos"));
 
     // Cargamos los valores en los inputs
     inputEfectivo.value   = datos.efectivo;
     inputDepositos.value  = datos.depositos;
     inputExtranjera.value = datos.extranjera;
     inputSobrante.value   = datos.sobrante;
     inputFallo.value      = datos.fallo;
     inputPoker.value      = datos.poker;
 
     // Calculamos nuevamente el total
     calcularTotal();
 
     // Desplazamos la pantalla hacia el formulario
     window.scrollTo({ top: 0, behavior: "smooth" });
 }
 
 
 
 /**************************************************************
  * 8) EVENTO DEL BOTÓN GUARDAR
  * ------------------------------------------------------------
  * Cuando el usuario hace clic en el botón "Guardar Saldos",
  * ejecutamos la función guardarSaldos().
  ***************************************************************/
 botonGuardar.addEventListener("click", guardarSaldos);
 
 
 
 /**************************************************************
  * 9) MOSTRAR SALDOS APENAS CARGA LA PÁGINA
  * ------------------------------------------------------------
  * Si hay datos guardados, los mostramos automáticamente
  * al abrir el sistema.
  ***************************************************************/
 mostrarSaldosGuardados();


 /**************************************************************
  * Boton para ir al formulario de carga
  * ------------------------------------------------------------
  ***************************************************************/
 // Esperamos a que todo el contenido del documento esté cargado.
// Esto garantiza que el botón con id="ir-form" ya exista en el DOM
// antes de intentar obtenerlo con getElementById.
document.addEventListener("DOMContentLoaded", () => {

  // Obtenemos el botón por su ID. Debe coincidir EXACTAMENTE
  // con el id que tiene el botón en el HTML.
  const botonIr = document.getElementById("ir-form_carga");
  
  // Verificamos que el botón exista (esto es buena práctica para evitar errores
  // si el elemento no está en la página por algún motivo).
  if (botonIr) {
    
    // Agregamos un "listener" que ejecuta una función cuando el usuario hace clic.
    botonIr.addEventListener("click", () => {
      
      // Cambiamos la página actual redirigiendo al usuario a "page2.html".
      // Podés reemplazar esta ruta por la página que necesites.
      window.location.href = "form_carga.html";
    });

  } else {
    // Si no se encuentra el botón, mostramos un mensaje en la consola.
    // Esto ayuda a detectar errores en el HTML.
    console.warn('No se encontró el botón con id="ir-form_carga".');
  }
});
