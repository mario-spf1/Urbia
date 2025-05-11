import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Escena y cámara
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

// Suelo
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

// Posiciones reservadas para parques
const parkPositions = [
  [-20, -20],
  [20, 20],
  [0, -20],
  [-20, 20]
];

// Crear parques
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

// Generar edificios evitando calles y parques
const gridSpacing = 10;
for (let x = -40; x <= 40; x += gridSpacing) {
  for (let z = -40; z <= 40; z += gridSpacing) {
    if (Math.abs(x) < 10 || Math.abs(z) < 10) continue; // Dejar las calles libres
    const isParkHere = parkPositions.some(([px, pz]) => px === x && pz === z);
    if (isParkHere) continue; // Dejar los parques libres
    createBuilding(x, z);
  }
}

// Edificios interactivos destacados
const building1 = createBuilding(-15, -15, 0x0077ff, 8); // Edificio Azul
const building2 = createBuilding(15, 15, 0xff7700, 10);  // Edificio Naranja

// Elementos interactivos
const interactives = [building1, building2, ...parks];

// Cámara inicial
camera.position.set(60, 60, 60);
controls.update();

// Raycaster para clics
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactives);

  const infoDiv = document.getElementById('info');

  if (intersects.length > 0) {
    const clicked = intersects[0].object;
    if (clicked === building1) {
      infoDiv.innerText = '🏢 Edificio Azul\n- Oficinas\n- 8 Plantas';
    } else if (clicked === building2) {
      infoDiv.innerText = '🏢 Edificio Naranja\n- Centro Residencial\n- 10 Plantas';
    } else if (parks.includes(clicked)) {
      infoDiv.innerText = '🌳 Parque\n- Espacio Verde Público';
    }
  }
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
