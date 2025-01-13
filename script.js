// Set up the Three.js environment
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the SVG and convert it to a shape
const loader = new THREE.SVGLoader();
loader.load(
  './assets/shape.svg',
  (data) => {
    const paths = data.paths;

    paths.forEach((path) => {
      const material = new THREE.MeshBasicMaterial({
        color: path.color ? path.color : 0xffffff,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const shapes = THREE.SVGLoader.createShapes(path);
      shapes.forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 1,
          bevelEnabled: false,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = 0;
        scene.add(mesh);
      });
    });
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  (error) => {
    console.error('An error happened', error);
  }
);

// Handle mouse movement
document.addEventListener('mousemove', (event) => {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;

  scene.rotation.y = x * 0.2;
  scene.rotation.x = y * 0.2;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
