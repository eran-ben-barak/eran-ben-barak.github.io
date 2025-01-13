import * as THREE from './assets/three.min.js';

// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Load the SVG file and create 3D shapes
const loader = new THREE.SVGLoader();
loader.load('./assets/shape.svg', (data) => {
  const paths = data.paths;
  const material = new THREE.MeshStandardMaterial({
    color: 0x222222,
    emissive: 0x000000,
    roughness: 0.4,
    metalness: 1,
  });

  paths.forEach((path) => {
    const shapes = path.toShapes(true);
    shapes.forEach((shape) => {
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 5,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 1,
        bevelSegments: 5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    });
  });
});

// 3. Add lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // Soft ambient light
scene.add(ambientLight);

// 4. Animate with cursor interaction
camera.position.z = 50;

document.addEventListener('mousemove', (event) => {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;

  camera.rotation.x = y * 0.5;
  camera.rotation.y = x * 0.5;
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// 5. Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
