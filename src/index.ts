import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { filmPass } from './postprocessing'

// CAMERA
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
const camera_x = -20
const camera_y = 15
const camera_z = 20
camera.position.x = camera_x
camera.position.y = camera_y
camera.position.z = camera_z

// RENDERER
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// SCENE
const scene: THREE.Scene = new THREE.Scene()
scene.background = new THREE.Color(0xbfd1e5);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true
controls.target.y = 5

// POST PROCESSING COMPOSER
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
filmPass(composer)

export function animate() {
  composer.render()
  controls.update()
  requestAnimationFrame(animate);
}

// ambient light
let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
scene.add(hemiLight);

//Add directional light
let dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-30, 50, -30);
scene.add(dirLight);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.shadow.camera.top = 10
dirLight.shadow.camera.left = -10
dirLight.shadow.camera.right = 10
dirLight.shadow.camera.bottom = -10

function createGround() {
  let ground = new THREE.Mesh(new THREE.CylinderBufferGeometry(13, 13, 1, 64),
    new THREE.MeshPhongMaterial({ color: 0x0a690a }));
  ground.position.y = -0.5
  ground.castShadow = true;
  ground.receiveShadow = true;
  scene.add(ground);
}

function loadOBJ(name: string, pos_x: number, pos_z: number) {
  new MTLLoader().load('./assets/' + name + '.mtl', function (materials) {
    materials.preload();
    new OBJLoader().setMaterials(materials).loadAsync('./assets/' + name + '.obj').then((group) => {
      const swordMan = group.children[0];

      swordMan.castShadow = true
      swordMan.receiveShadow = true

      swordMan.position.x = pos_x
      swordMan.position.z = pos_z

      scene.add(swordMan)
    })
  });
}

createGround()
loadOBJ('monu1', -4, -4)
loadOBJ('monu10', 4, 4)
animate()

// WINDOW RESIZE HANDLING
export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);
