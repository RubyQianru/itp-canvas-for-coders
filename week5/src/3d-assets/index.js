import "./style.css";
import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// app
const app = document.querySelector("#app");

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// perspective camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(20, 20, 20);
scene.add(camera);

// axis helper -> X: red, Y: green, Z: blue
const axesHelper = new THREE.AxesHelper(5);
axesHelper.position.y = 0.001;
scene.add(axesHelper);

// grid
const gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// control
const controls = new MapControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.enableRotate = true;
controls.rotateSpeed = 0.5;
controls.enableZoom = true;
controls.minDistance = 10;
controls.maxDistance = 100;
controls.target = new THREE.Vector3(0, 4, 0);

// resize
const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", onResize);

/* 
//////////////////////////////////////////////////////////////////////////////
*/

// Instantiate a loader
const loader = new GLTFLoader();

// Load a glTF resource
loader.load(
  // resource URL
  "/banana.glb",
  // called when the resource is loaded
  function (gltf) {
    console.log(gltf);
    scene.add(gltf.scene);

    gltf.scene.position.y = 4.2;
    gltf.scene.scale.setScalar(0.75);

    gltf.scene.traverse(function (el) {
      if (el.isMesh) {
        console.log(el);
      }
    });
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

// box
const boxGeometry = new THREE.BoxGeometry(2, 4, 2);
const boxMaterial = new THREE.MeshStandardMaterial({ color: "white" });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.position.y = 2;
scene.add(boxMesh);

/* 
Positional Audio
*/

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create the PositionalAudio object (passing in the listener)
const sound = new THREE.PositionalAudio(listener);
const sound2 = new THREE.PositionalAudio(listener);

// load a sound and set it as the PositionalAudio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("/forest.wav", function (buffer) {
  sound.setBuffer(buffer);
  sound.setVolume(0.7);
  sound.setRefDistance(10);
  sound.setRolloffFactor(5);
  sound.setLoop(true);
  sound.play();
});

audioLoader.load("/rain.wav", function (buffer) {
  sound2.setBuffer(buffer);
  sound2.setVolume(0.7);
  sound2.setRefDistance(5);
  sound2.setRolloffFactor(3);
  sound2.setLoop(true);
  sound2.play();
});

// sphere
const sphereGeometry = new THREE.SphereGeometry(1, 128, 128);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "#5200ff",
  roughness: 0.2,
  metalness: 0.1,
});

const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.set(20, 5, 0);
sphereMesh.add(sound);
scene.add(sphereMesh);

const sphereMesh2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh2.position.set(-30, 5, -20);
sphereMesh2.add(sound2);
scene.add(sphereMesh2);

/* 
//////////////////////////////////////////////////////////////////////////////
*/

// animate
const animate = () => {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();
};

animate();
