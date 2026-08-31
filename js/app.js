/**
 * app.js — Lógica del mapa. Depende de Leaflet (vendorizado en /vendor) y de
 * los datos de /data/data.js (POINTS, ROUTES), cargados antes que este script.
 *
 * Sin llamadas a APIs de ruteo en vivo: todo lo que ves (puntos, líneas,
 * popups) sale de data.js, que ya está en el repo. Lo único que necesita
 * internet en toda la página son las imágenes del mapa base (los tiles) —
 * eso es inevitable en cualquier mapa web interactivo sin un paquete de
 * tiles offline aparte.
 */

(function () {
  "use strict";

  var COLORS = {
    inicio: "#AD3B2C", localidad: "#B9852A", medico: "#3E5C74",
    alpina: "#2A4E33", refugio: "#3C6E47", cumbre: "#7A3B12", rutaVieja: "#6B7F3A"
  };

  var map = L.map("map", { zoomControl: true, attributionControl: true }).setView([-31.75, -64.55], 9);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // ---- Marcadores ----
  function pinIcon(color) {
    var svg = '<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M13 0C5.8 0 0 5.8 0 13c0 9.5 13 21 13 21s13-11.5 13-21C26 5.8 20.2 0 13 0z" fill="' + color + '" stroke="#FBF8F0" stroke-width="1.5"/>' +
      '<circle cx="13" cy="13" r="5" fill="#FBF8F0"/></svg>';
    return L.divIcon({ className: "", html: svg, iconSize: [26, 34], iconAnchor: [13, 34], popupAnchor: [0, -30] });
  }

  POINTS.forEach(function (p) {
    var marker = L.marker([p.lat, p.lng], { icon: pinIcon(COLORS[p.cat] || "#999") }).addTo(map);
    var popup = '<div class="pop">' +
      '<div class="pop-cat">' + p.type + '</div>' +
      '<h3>' + p.name + '</h3>' +
      (p.kmAcum !== null ? '<div class="pop-km">' + p.kmAcum + ' km acum. · +' + p.kmPrev + ' km desde el punto anterior</div>' : '') +
      '<hr>' +
      '<div class="pop-body">' + p.info + '</div>' +
      '<div class="pop-src">Fuente: ' + p.fuente + '</div>' +
      '</div>';
    marker.bindPopup(popup, { maxWidth: 250 });
  });

  // ---- Rutas (capas activables) ----
  var layerGroups = {};   // { key: L.layerGroup }
  var layerBoundsAll = []; // para el botón "Ver todo"

  Object.keys(ROUTES).forEach(function (key) {
    var route = ROUTES[key];
    var group = L.layerGroup();
    var style = {
      color: route.color,
      weight: key === "tramoB" ? 4.5 : 4,
      opacity: route.dashArray ? 0.88 : 0.95,
      lineCap: "round"
    };
    if (route.dashArray) style.dashArray = route.dashArray;

    route.segments.forEach(function (seg) {
      var line = L.polyline(seg, style);
      line.bindPopup('<div class="pop"><div class="pop-cat">' + route.label + '</div><div class="pop-body">' + route.popup + '</div></div>');
      group.addLayer(line);
      layerBoundsAll.push(L.latLngBounds(seg));
    });

    layerGroups[key] = group;
    if (route.defaultOn) group.addTo(map);
  });

  // ---- Panel de capas: conectar checkboxes del HTML a las capas ----
  document.querySelectorAll("#layerpanel input[type=checkbox]").forEach(function (cb) {
    var key = cb.getAttribute("data-layer");
    cb.checked = !!(ROUTES[key] && ROUTES[key].defaultOn);
    cb.addEventListener("change", function () {
      var group = layerGroups[key];
      if (!group) return;
      if (cb.checked) map.addLayer(group);
      else map.removeLayer(group);
    });
  });

  // ---- Botón "Ver todo" (encuadra todos los puntos y rutas) ----
  var fitAllBtn = document.getElementById("fit-all-btn");
  if (fitAllBtn) {
    fitAllBtn.addEventListener("click", function () {
      var group = L.featureGroup();
      POINTS.forEach(function (p) { L.marker([p.lat, p.lng]).addTo(group); });
      layerBoundsAll.forEach(function (b) { group.addLayer(L.rectangle(b, { opacity: 0 })); });
      map.fitBounds(group.getBounds(), { padding: [40, 40] });
    });
  }

  // ---- Paneles plegables ----
  window.togglePanel = function (id) {
    document.getElementById(id).classList.toggle("hidden");
  };

  // ---- Mi ubicación ----
  var meMarker = null;
  window.locateMe = function () {
    if (!navigator.geolocation) { alert("Geolocalización no disponible en este navegador."); return; }
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude, lng = pos.coords.longitude;
      if (meMarker) map.removeLayer(meMarker);
      meMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: "",
          html: '<div style="background:#3E5C74;width:16px;height:16px;border-radius:50%;border:3px solid #FBF8F0;box-shadow:0 0 0 4px rgba(62,92,116,0.35);"></div>',
          iconSize: [16, 16], iconAnchor: [8, 8]
        })
      }).addTo(map).bindPopup("Tu ubicación actual").openPopup();
      map.setView([lat, lng], 12);
    }, function (err) {
      alert("No se pudo obtener tu ubicación: " + err.message);
    });
  };
})();
