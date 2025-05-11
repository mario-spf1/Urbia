const calles = [
    {
        nombre: "calle santiago",
        lat: 41.650278,
        lng: -4.728836,
        temperatura: 21,
        humedad: 45,
        presion: 1012,
        viento: 15,
        condicion: "Soleado"
    },
    {
        nombre: "calle del peru",
        lat: 41.6470072,
        lng: -4.7278329,
        temperatura: 20,
        humedad: 55,
        presion: 1011,
        viento: 12,
        condicion: "Parcialmente nublado"
    },
    {
        nombre: "calle teresa gil",
        lat: 41.650480,
        lng: -4.725571,
        temperatura: 18,
        humedad: 60,
        presion: 1009,
        viento: 9,
        condicion: "Lluvia ligera"
    },
    {
        nombre: "plaza mayor",
        lat: 41.651983,
        lng: -4.728469,
        temperatura: 22,
        humedad: 40,
        presion: 1013,
        viento: 14,
        condicion: "Soleado"
    },
    {
        nombre: "paseo de zorrilla",
        lat: 41.645556,
        lng: -4.732500,
        temperatura: 19,
        humedad: 50,
        presion: 1010,
        viento: 10,
        condicion: "Nublado"
    }
];

let map = L.map('map').setView([41.6526, -4.7244], 14);
let marker = L.marker([41.6526, -4.7244]).addTo(map);

// CartoDB Positron tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> | © OpenStreetMap contributors',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Elimina acentos y convierte a minúsculas para comparación exacta
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

    const calle = calles.find(c => normalizarTexto(c.nombre) === textoNormalizado);

    if (calle) {
        marker.setLatLng([calle.lat, calle.lng]);
        map.setView([calle.lat, calle.lng], 18);

        resultado.innerHTML = `
            <p><strong>${calle.nombre}</strong><br>
            Temperatura: ${calle.temperatura}°C<br>
            Humedad: ${calle.humedad}%<br>
            Presión: ${calle.presion} hPa<br>
            Viento: ${calle.viento} km/h<br>
            Condición: ${calle.condicion}</p>
        `;
    } else {
        resultado.innerHTML = "<p>Calle no encontrada. Intenta con un nombre exacto como 'Calle Santiago'.</p>";
    }
}
