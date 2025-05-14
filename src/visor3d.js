import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Configuración de la escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Luces
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Suelo y calles
const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Calles elevadas para evitar solapamiento visual
const streetHeight = 0.02;
const street1 = new THREE.Mesh(new THREE.PlaneGeometry(100, 8), new THREE.MeshStandardMaterial({ color: 0x333333 }));
street1.rotation.x = -Math.PI / 2;
street1.position.y = streetHeight;
scene.add(street1);

const street2 = new THREE.Mesh(new THREE.PlaneGeometry(8, 100), new THREE.MeshStandardMaterial({ color: 0x333333 }));
street2.rotation.x = -Math.PI / 2;
street2.position.y = streetHeight;
scene.add(street2);

// Parques
const parkPositions = [[-20, -20], [20, 20], [0, -20], [-20, 20]];
const parks = parkPositions.map(([x, z]) => {
  const park = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshStandardMaterial({ color: 0x228B22 }));
  park.rotation.x = -Math.PI / 2;
  park.position.set(x, 0.01, z);
  scene.add(park);
  return park;
});

// Función para crear edificios
function createBuilding(x, z, color = 0x999999, height = Math.random() * 5 + 3) {
  const building = new THREE.Mesh(new THREE.BoxGeometry(4, height, 4), new THREE.MeshStandardMaterial({ color }));
  building.position.set(x, height / 2, z);
  scene.add(building);
  return building;
}

const gridSpacing = 10;
for (let x = -40; x <= 40; x += gridSpacing) {
  for (let z = -40; z <= 40; z += gridSpacing) {
    if (Math.abs(x) < 10 || Math.abs(z) < 10) continue;
    if (parkPositions.some(([px, pz]) => px === x && pz === z)) continue;
    createBuilding(x, z);
  }
}

// Edificios destacados
const building1 = createBuilding(-15, -15, 0x0077ff, 8);
const building2 = createBuilding(15, 15, 0xff7700, 10);

const interactives = [building1, building2, ...parks];

// Datos ambientales por tipo
const pollutionProfiles = {
  "Parque": { aire: 10, ruido: 20, visual: 10 },
  "Edificio": { aire: 40, ruido: 50, visual: 60 },
  "Fábrica": { aire: 90, ruido: 80, visual: 90 },
  "Centro Comercial": { aire: 70, ruido: 65, visual: 80 }
};

// Estado de cada objeto
const objectData = {
  "building1": { type: "Edificio", ...pollutionProfiles["Edificio"] },
  "building2": { type: "Centro Residencial", ...pollutionProfiles["Edificio"] },
  "park1": { type: "Parque", ...pollutionProfiles["Parque"] },
  "park2": { type: "Parque", ...pollutionProfiles["Parque"] },
  "park3": { type: "Parque", ...pollutionProfiles["Parque"] },
  "park4": { type: "Parque", ...pollutionProfiles["Parque"] }
};

// Panel UI
const panel = document.getElementById('panel');
const panelTitle = document.getElementById('panel-title');
const panelType = document.getElementById('panel-type');
const panelPollution = document.getElementById('panel-pollution');
const modifyBtn = document.getElementById('modify-btn');
const modificationOptions = document.getElementById('modification-options');

let currentObjectKey = null;

// Obtener clave del objeto
function getObjectKey(obj) {
  if (obj === building1) return "building1";
  if (obj === building2) return "building2";
  if (parks.includes(obj)) return "park" + (parks.indexOf(obj) + 1);
  return null;
}

// Calcular el promedio ambiental
function calculateGlobalImpact() {
  const keys = Object.keys(objectData);
  const sums = { aire: 0, ruido: 0, visual: 0 };

  keys.forEach(key => {
    sums.aire += objectData[key].aire;
    sums.ruido += objectData[key].ruido;
    sums.visual += objectData[key].visual;
  });

  const count = keys.length;
  return {
    aire: Math.round(sums.aire / count),
    ruido: Math.round(sums.ruido / count),
    visual: Math.round(sums.visual / count)
  };
}

// Actualizar el panel del objeto seleccionado
function updatePanel() {
  const data = objectData[currentObjectKey];
  panelTitle.textContent = 'Información del Terreno';
  panelType.textContent = `Tipo: ${data.type}`;
  panelPollution.innerHTML = `
    🌬️ Aire: ${data.aire} µg/m³<br>
    🔊 Ruido: ${data.ruido} dB<br>
    👁️ Impacto Visual: ${data.visual} / 100
  `;
  modificationOptions.style.display = 'none';
}

// Actualizar el panel global siempre visible
function updateGlobalStats() {
  const globalImpact = calculateGlobalImpact();
  document.getElementById('global-air').textContent = `🌬️ Aire: ${globalImpact.aire} µg/m³`;
  document.getElementById('global-noise').textContent = `🔊 Ruido: ${globalImpact.ruido} dB`;
  document.getElementById('global-visual').textContent = `👁️ Impacto Visual: ${globalImpact.visual} / 100`;
}

// Cámara inicial
camera.position.set(60, 60, 60);
controls.update();

// Inicializar panel global al cargar
updateGlobalStats();

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  if (event.target.closest('#panel')) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactives);

  if (intersects.length > 0) {
    const clicked = intersects[0].object;
    currentObjectKey = getObjectKey(clicked);
    if (!currentObjectKey) return;

    panel.style.display = 'block';
    updatePanel();
  } else {
    panel.style.display = 'none';
  }
});

// Mostrar opciones de modificación
modifyBtn.addEventListener('click', () => {
  modificationOptions.style.display = 'block';
});

// Aplicar modificación
modificationOptions.addEventListener('click', (e) => {
  if (!e.target.dataset.type || !currentObjectKey) return;

  const newType = e.target.dataset.type;
  objectData[currentObjectKey] = { type: newType, ...pollutionProfiles[newType] };

  updatePanel();
  updateGlobalStats(); // Actualizar el global al modificar
  modificationOptions.style.display = 'none';
});

// Animación
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Responsividad
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
