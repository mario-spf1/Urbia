const calles = [
    { nombre: "calle santiago", lat: 41.650278, lng: -4.728836, aire: 32, ruido: 52, temperatura: 21, humedad: 45 },
    { nombre: "calle del peru", lat: 41.6470072, lng: -4.7278329, aire: 35, ruido: 54, temperatura: 20, humedad: 55 },
    { nombre: "calle teresa gil", lat: 41.650480, lng: -4.725571, aire: 28, ruido: 48, temperatura: 18, humedad: 60 },
    { nombre: "plaza mayor", lat: 41.651983, lng: -4.728469, aire: 25, ruido: 45, temperatura: 22, humedad: 40 },
    { nombre: "paseo de zorrilla", lat: 41.645556, lng: -4.732500, aire: 40, ruido: 60, temperatura: 19, humedad: 50 }
];

let map = L.map('map').setView([41.6526, -4.7244], 14);
let marker = L.marker([41.6526, -4.7244]).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> | © OpenStreetMap contributors',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function buscarCalle() {
    const input = document.getElementById("inputCalle").value.trim();
    const resultado = document.getElementById("resultado");

    if (!input) {
        resultado.innerHTML = "<p>Introduce una calle.</p>";
        return;
    }

    const textoNormalizado = normalizarTexto(input);
    const coincidencias = calles.filter(c => normalizarTexto(c.nombre).includes(textoNormalizado));

    if (coincidencias.length > 0) {
        mostrarResultados(coincidencias);
        centrarMapa(coincidencias[0]);
    } else {
        resultado.innerHTML = "<p>Calle no encontrada. Intenta con un nombre parcial o completo.</p>";
    }
}

function mostrarResultados(lista) {
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = lista.map(calle => `
        <p><strong>${calle.nombre}</strong><br>
        🌬️ Contaminación del Aire: ${calle.aire} µg/m³<br>
        🔊 Contaminación Acústica: ${calle.ruido} dB<br>
        🌡️ Temperatura: ${calle.temperatura}°C<br>
        💧 Humedad: ${calle.humedad}%</p>
    `).join('<hr>');
}

function centrarMapa(calle) {
    marker.setLatLng([calle.lat, calle.lng]);
    map.flyTo([calle.lat, calle.lng], 18);
}
