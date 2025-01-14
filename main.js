import * as THREE from './node_modules/three/build/three.module.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, bubbleLetters, mouseX = 0, mouseY = 0;

init();
animate();

function init() {
    // Create Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Load Bubble Letters Model
    const loader = new GLTFLoader();
    loader.load('./assets/models/bubble_letters.glb', (gltf) => {
        bubbleLetters = gltf.scene;
        bubbleLetters.scale.set(1, 1, 1); // Adjust the scale if needed
        bubbleLetters.position.set(0, 0, 0);
        scene.add(bubbleLetters);
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Event Listeners
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate);

    if (bubbleLetters) {
        // Make the object follow the mouse
        bubbleLetters.position.x = mouseX * 2;
        bubbleLetters.position.y = mouseY * 2;

        // Add rotation effect
        bubbleLetters.rotation.y += 0.01;
        bubbleLetters.rotation.x += 0.005;

        // Pulsating scale effect
        bubbleLetters.scale.setScalar(1 + Math.sin(Date.now() / 500) * 0.1);
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
