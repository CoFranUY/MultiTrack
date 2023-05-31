// CÓDIGO JAVASCRIPT DE LA PÁGINA DE VENTAS

// OBJETO VUE:
var salesApp = new Vue({
  el: "#sales",
  data: {
    cars: [], // Lista de autos. Inicialmente vacía.
    currency: "USD", // Atributo que indica la moneda seleccionada.
    exchangeRateUYU: 0,
    brands: [], // Lista de marcas. Inicialmente vacía.
    brandSelected: "",
    models: [], // Lista de modelos. Inicialmente vacía.
    modelSelected: "",
    years: [], // Lista de años. Inicialmente vacía.
    yearSelected: "",
    statusSelected: "",
    filtering: false, // Atributo booleano que indica si se están filtando los autos.
  },
  filters: {
    // Documentación de Vue.js sobre Filtros:
    // https://vuejs.org/v2/guide/syntax.html#Filters
    thousands: function (value) {
      // Documentación de JavaScript sobre toLocaleString:
      // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
      return parseInt(value).toLocaleString("es-UY");
    },
  },
});

// CARGA DE AÑOS:
for (var i = 2021; i >= 1900; i--) {
  salesApp.years.push(i);
}

/**
 * CARGA DE TIPO DE CAMBIO.
 *
 * La llamada AJAX sólo se realiza una vez al cargar la página.
 */
$.ajax({
  url: "https://ha.edu.uy/api/rates",
  success: function (data) {
    salesApp.exchangeRateUYU = data.uyu;
  },
}); // End - Ajax de Tipo de Cambio

/**
 * CARGA DE MARCAS.
 *
 * La llamada AJAX sólo se realiza una vez al cargar la página.
 */
$.ajax({
  url: "https://ha.edu.uy/api/brands",
  success: function (data) {
    salesApp.brands = data;
  },
});

/**
 * CARGA DE MODELOS.
 *
 * Detección del evento "change" en el <select> de marcas.
 * Cada vez que se cambia una marca, se actualiza la lista de modelos.
 *
 * Nota: para detectar eventos también se podría haber usado Vue.js
 * (en lugar de jQuery), y de hecho sería aconsejable hacerlo así.
 * Documentación: https://vuejs.org/v2/guide/events.html
 */
$("#select-brand").on("change", function () {
  var url = "https://ha.edu.uy/api/models?brand=" + salesApp.brandSelected;

  $.ajax({
    url: url,
    success: function (data) {
      salesApp.models = data;
      salesApp.modelSelected = "";
    },
  });
});

/**
 * FILTRO DE AUTOS.
 *
 * Detección del evento "click" en el botón "filtrar".
 * Cada vez que se hace click, se cargan los autos vía AJAX.
 *
 * Nota: para detectar eventos también se podría haber usado Vue.js
 * (en lugar de jQuery), y de hecho sería aconsejable hacerlo así.
 * Documentación: https://vuejs.org/v2/guide/events.html
 */
$("#btn-filter").on("click", function () {
  loadCars();
});

/**
 * CAMBIAR MONEDA.
 *
 * Detección del evento "click" en el botón "cambiar moneda".
 *
 * Nota: para detectar eventos también se podría haber usado Vue.js
 * (en lugar de jQuery), y de hecho sería aconsejable hacerlo así.
 * Documentación: https://vuejs.org/v2/guide/events.html
 */
$("#btn-currency").on("click", function () {
  if (salesApp.currency === "USD") {
    salesApp.currency = "UYU";
  } else {
    salesApp.currency = "USD";
  }
});

/**
 * CARGA DE AUTOS.
 *
 * Esta función se llamará tanto al cargar la página por primera vez,
 * como también cada vez que el usuario haga click en el botón "filtrar".
 */
function loadCars() {
  salesApp.filtering = true;

  var year = salesApp.yearSelected; // Shortcut.
  var brand = salesApp.brandSelected; // Shortcut.
  var model = salesApp.modelSelected; // Shortcut.
  var status = salesApp.statusSelected; // Shortcut.

  $.ajax({
    url:
      "https://ha.edu.uy/api/cars?year=" +
      year +
      "&brand=" +
      brand +
      "&model=" +
      model +
      "&status=" +
      status,
    success: function (data) {
      salesApp.filtering = false;
      salesApp.cars = data;
      $(".alert-warning").removeClass("hidden");
    },
  }); // End - Ajax de Autos
}

// Carga inicial de autos:
loadCars();
