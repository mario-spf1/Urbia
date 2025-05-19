import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Escena y cámara
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(60, 60, 60);

// Renderizador y controles
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Luces
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Materiales
const streetMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
const parkBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 1 });

// Suelo
const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Calles
const streetHeight = 0.02;
const street1 = new THREE.Mesh(new THREE.PlaneGeometry(100, 8), streetMaterial);
street1.rotation.x = -Math.PI / 2;
street1.position.y = streetHeight;
street1.receiveShadow = true;
scene.add(street1);

const street2 = new THREE.Mesh(new THREE.PlaneGeometry(8, 100), streetMaterial);
street2.rotation.x = -Math.PI / 2;
street2.position.y = streetHeight;
street2.receiveShadow = true;
scene.add(street2);

// Parques elevados
const parkPositions = [[-20, -20], [20, 20], [-20, 20]];
const parks = parkPositions.map(([x, z]) => {
  const base = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 4), parkBaseMaterial);
  base.position.set(x, 0.25, z);
  base.receiveShadow = true;
  base.castShadow = true;
  scene.add(base);
  return base;
});

// Geometrías según tipo con altura fija 8
function getGeometryByType(type) {
  switch (type) {
    case "Parque":
      return new THREE.BoxGeometry(4, 0.5, 4);
    case "Edificio":
      return new THREE.BoxGeometry(4, 8, 4);
    case "Fábrica":
      return new THREE.CylinderGeometry(2, 2, 8, 8);
    case "Centro Comercial":
      return new THREE.BoxGeometry(4, 8, 4);
    default:
      return new THREE.BoxGeometry(4, 8, 4);
  }
}

// Crear edificios
function createBuilding(x, z, color = 0x999999, type = "Edificio") {
  const geometry = getGeometryByType(type);
  const building = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.3 }));
  const height = geometry.parameters.height || 8;
  building.position.set(x, height / 2, z);
  building.castShadow = true;
  building.receiveShadow = true;
  scene.add(building);
  return building;
}

// Crear edificios en la cuadrícula
const gridSpacing = 10;
for (let x = -40; x <= 40; x += gridSpacing) {
  for (let z = -40; z <= 40; z += gridSpacing) {
    if (Math.abs(x) < 10 || Math.abs(z) < 10) continue;
    if (parkPositions.some(([px, pz]) => px === x && pz === z)) continue;
    createBuilding(x, z);
  }
}

// Edificios destacados
const building1 = createBuilding(-15, -15, 0x0077ff, "Edificio");
const building2 = createBuilding(15, 15, 0xff7700, "Centro Comercial");

const interactives = [building1, building2, ...parks];

// Datos ambientales
const pollutionProfiles = {
  "Parque": { aire: 10, ruido: 20, visual: 10 },
  "Edificio": { aire: 40, ruido: 50, visual: 60 },
  "Fábrica": { aire: 90, ruido: 80, visual: 90 },
  "Centro Comercial": { aire: 70, ruido: 65, visual: 80 }
};

const objectData = {
  "building1": { type: "Edificio", ...pollutionProfiles["Edificio"] },
  "building2": { type: "Centro Comercial", ...pollutionProfiles["Centro Comercial"] },
  "park1": { type: "Parque", ...pollutionProfiles["Parque"] },
  "park2": { type: "Parque", ...pollutionProfiles["Parque"] },
  "park3": { type: "Parque", ...pollutionProfiles["Parque"] },
  "park4": { type: "Parque", ...pollutionProfiles["Parque"] }
};

// Paneles UI
const panel = document.getElementById('panel');
const panelTitle = document.getElementById('panel-title');
const panelType = document.getElementById('panel-type');
const panelPollution = document.getElementById('panel-pollution');
const modifyBtn = document.getElementById('modify-btn');
const modificationOptions = document.getElementById('modification-options');
const logList = document.getElementById('log-list');

let currentObjectKey = null;

function getObjectKey(obj) {
  if (obj === building1) return "building1";
  if (obj === building2) return "building2";
  if (parks.includes(obj)) return "park" + (parks.indexOf(obj) + 1);
  return null;
}

function calculateGlobalImpact() {
  const weights = { "Parque": 1, "Edificio": 2, "Fábrica": 3, "Centro Comercial": 2 };
  let sums = { aire: 0, ruido: 0, visual: 0 };
  let totalWeight = 0;

  Object.keys(objectData).forEach(key => {
    const obj = objectData[key];
    const weight = weights[obj.type] || 1;

    sums.aire += obj.aire * weight;
    sums.ruido += obj.ruido * weight;
    sums.visual += obj.visual * weight;
    totalWeight += weight;
  });

  return {
    aire: Math.round(sums.aire / totalWeight),
    ruido: Math.round(sums.ruido / totalWeight),
    visual: Math.round(sums.visual / totalWeight)
  };
}

function updatePanel() {
  const data = objectData[currentObjectKey];
  panelTitle.textContent = 'Información del Terreno';
  panelType.textContent = `Tipo: ${data.type}`;
  panelPollution.innerHTML = `🌬️ Aire: ${data.aire} µg/m³<br>🔊 Ruido: ${data.ruido} dB<br>👁️ Impacto Visual: ${data.visual} / 100`;
  modificationOptions.style.display = 'none';
}

function showImpactPreview() {
  const preview = document.getElementById('impact-preview');
  preview.innerHTML = ''; // Limpiar anterior

  if (!currentObjectKey) return;

  const current = objectData[currentObjectKey];

  ["Parque", "Edificio", "Fábrica", "Centro Comercial"].forEach(type => {
    const profile = pollutionProfiles[type];
    const lines = [];

    ["aire", "ruido", "visual"].forEach(metric => {
      const diff = profile[metric] - current[metric];
      const percent = current[metric] === 0 ? 0 : Math.round((diff / current[metric]) * 100);
      const color = percent > 0 ? 'green' : percent < 0 ? 'red' : 'black';
      const sign = percent > 0 ? '🔺' : percent < 0 ? '🔻' : '';
      lines.push(`<span style="color:${color}">${sign} ${metric.charAt(0).toUpperCase() + metric.slice(1)} ${percent}%</span>`);
    });

    preview.innerHTML += `
      <div style="margin-top:5px;">
        <strong>${type}:</strong><br>
        ${lines.join('<br>')}
      </div>
    `;
  });
}


function updateGlobalStats() {
  const globalImpact = calculateGlobalImpact();
  document.getElementById('global-air').textContent = `🌬️ Aire: ${globalImpact.aire} µg/m³`;
  document.getElementById('global-noise').textContent = `🔊 Ruido: ${globalImpact.ruido} dB`;
  document.getElementById('global-visual').textContent = `👁️ Impacto Visual: ${globalImpact.visual} / 100`;
}

function logChange(description) {
  const li = document.createElement('li');
  li.textContent = description;
  logList.appendChild(li);
}

// Animación de modificación
function animateModification(object, newColor) {
  const material = object.material;
  const startColor = new THREE.Color(material.color.getHex());
  const endColor = new THREE.Color(newColor);

  let progress = 0;
  const duration = 30;

  function animate() {
    if (progress <= duration) {
      const t = progress / duration;
      material.color.lerpColors(startColor, endColor, t);
      const scaleFactor = 1 + 0.2 * Math.sin(Math.PI * t);
      object.scale.set(scaleFactor, scaleFactor, scaleFactor);
      progress++;
      requestAnimationFrame(animate);
    } else {
      object.scale.set(1, 1, 1);
    }
  }

  animate();
}

// Actualiza la forma del objeto
function updateObjectGeometry(object, type) {
  const newGeometry = getGeometryByType(type);
  object.geometry.dispose();
  object.geometry = newGeometry;
  const height = newGeometry.parameters.height || 8;
  object.position.y = height / 2;
}

// Inicializar estado global
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
  showImpactPreview();
});

// Aplicar modificación con animación, cambio de forma y log
modificationOptions.addEventListener('click', (e) => {
  if (!e.target.dataset.type || !currentObjectKey) return;

  const newType = e.target.dataset.type;
  const newProfile = { type: newType, ...pollutionProfiles[newType] };
  objectData[currentObjectKey] = newProfile;

  const clickedObject = interactives.find(obj => getObjectKey(obj) === currentObjectKey);

  let newColor;
  switch (newType) {
    case "Parque": newColor = 0x228B22; break;
    case "Edificio": newColor = 0x999999; break;
    case "Fábrica": newColor = 0x444444; break;
    case "Centro Comercial": newColor = 0xff7700; break;
    default: newColor = 0x999999;
  }

  animateModification(clickedObject, newColor);
  updateObjectGeometry(clickedObject, newType);
  updatePanel();
  updateGlobalStats();
  modificationOptions.style.display = 'none';
  logChange(`✅ ${currentObjectKey} cambiado a ${e.target.textContent.trim()}`);
});

// Animación principal
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
