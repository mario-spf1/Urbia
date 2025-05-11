import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Escena y cámara
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles de cámara
const controls = new OrbitControls(camera, renderer.domElement);

// Luces
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Suelo
const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: 0x808080 }));
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Parque
const park = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshStandardMaterial({ color: 0x228B22 }));
park.rotation.x = -Math.PI / 2;
park.position.set(-8, 0.01, -8);
scene.add(park);

// Edificios
const building1 = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 2), new THREE.MeshStandardMaterial({ color: 0x0077ff }));
building1.position.set(4, 2, 4);
scene.add(building1);

const building2 = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), new THREE.MeshStandardMaterial({ color: 0xff7700 }));
building2.position.set(-4, 3, 4);
scene.add(building2);

// Cámara inicial
camera.position.set(10, 10, 10);
controls.update();

// Raycaster para detectar clics
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([building1, building2]);
  if (intersects.length > 0) {
    const clicked = intersects[0].object;
    const infoDiv = document.getElementById('info');
    if (clicked === building1) {
      infoDiv.innerText = '🏢 Edificio Azul\n- Oficinas\n- 4 Plantas';
    } else if (clicked === building2) {
      infoDiv.innerText = '🏢 Edificio Naranja\n- Residencial\n- 6 Plantas';
    }
  }
});

// Animación
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Ajustar tamaño al redimensionar
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
