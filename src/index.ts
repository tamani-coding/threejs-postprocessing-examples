import * as THREE from 'three'
import { GUI } from './gui/dat.gui.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

// COMPOSER
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
import { MaskPass, ClearMaskPass } from 'three/examples/jsm/postprocessing/MaskPass.js';
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { BleachBypassShader } from 'three/examples/jsm/shaders/BleachBypassShader.js';
import { ColorifyShader } from 'three/examples/jsm/shaders/ColorifyShader.js';
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader.js';
import { SepiaShader } from 'three/examples/jsm/shaders/SepiaShader.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { GodRaysFakeSunShader, GodRaysDepthMaskShader, GodRaysCombineShader, GodRaysGenerateShader } from 'three/examples/jsm/shaders/GodRaysShader.js';
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader.js';
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js';
import { FocusShader } from 'three/examples/jsm/shaders/FocusShader.js';

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

// WINDOW RESIZE HANDLING
export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// SCENE
const scene: THREE.Scene = new THREE.Scene()
scene.background = new THREE.Color(0xbfd1e5);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true
controls.target.y = 4

// POST PROCESSING COMPOSER
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// GLITCH PASS
function glitchPass() {
  const glitchPass = new GlitchPass();
  composer.addPass(glitchPass);
}
// glitchPass()

// DEPTH OF FIELD
function depthOfField() {

  const bokehPass = new BokehPass(scene, camera, {
    focus: 1.0,
    aperture: 0.025,
    maxblur: 0.01,

    width: window.innerWidth,
    height: window.innerHeight
  })
  composer.addPass(bokehPass)

  const effectController = {

    focus: 10.0,
    aperture: 5,
    maxblur: 0.01

  };
  const matChanger = function () {

    bokehPass.uniforms["focus"].value = effectController.focus;
    bokehPass.uniforms["aperture"].value = effectController.aperture * 0.00001;
    bokehPass.uniforms["maxblur"].value = effectController.maxblur;

  };
  const gui = new GUI();
  gui.add(effectController, "focus", 1.0, 500.0, 10).onChange(matChanger);
  gui.add(effectController, "aperture", 0, 10, 0.1).onChange(matChanger);
  gui.add(effectController, "maxblur", 0.0, 0.01, 0.001).onChange(matChanger);
  matChanger();
}
// depthOfField()

function bloom() { // ?
  const bloomPass = new BloomPass(0.5);
  composer.addPass(bloomPass);
}
// bloom()

function filmPass() {
  const filmPass = new FilmPass(0.5)
  composer.addPass(filmPass)
}
// filmPass()

function dotScreenPass() {
  const dotScreenPass = new DotScreenPass()
  composer.addPass(dotScreenPass)
}
// dotScreenPass()

function halfTonePass() {
  const halfTonePass = new HalftonePass(window.innerWidth, window.innerHeight, {
    shape: 1,
    radius: 4,
    rotateR: Math.PI / 5,
    rotateB: Math.PI / 5 * 2,
    rotateG: Math.PI / 5 * 3,
    scatter: 1,
    blending: 1,
    blendingMode: 1,
    greyscale: false,
    disable: false
  })
  composer.addPass(halfTonePass)


  const effectController = {
    shape: 1,
    radius: 4,
    rotateR: Math.PI / 5,
    rotateB: Math.PI / 5 * 2,
    rotateG: Math.PI / 5 * 3,
    scatter: 1,
  };
  const matChanger = function () {
    halfTonePass.uniforms["shape"].value = effectController.shape;
    halfTonePass.uniforms["radius"].value = effectController.radius;
    halfTonePass.uniforms["rotateR"].value = effectController.rotateR;
    halfTonePass.uniforms["rotateB"].value = effectController.rotateB;
    halfTonePass.uniforms["rotateG"].value = effectController.rotateG;
    halfTonePass.uniforms["scatter"].value = effectController.scatter;
  };
  const gui = new GUI();
  gui.add(effectController, "shape", 1.0, 10.0, 1).onChange(matChanger);
  gui.add(effectController, "radius", 1.0, 10.0, 1).onChange(matChanger);
  gui.add(effectController, "rotateR", 1.0, 10.0, 1).onChange(matChanger);
  gui.add(effectController, "rotateB", 1.0, 10.0, 1).onChange(matChanger);
  gui.add(effectController, "rotateG", 1.0, 10.0, 1).onChange(matChanger);
  gui.add(effectController, "scatter", 1.0, 10.0, 1).onChange(matChanger);
  matChanger();
}
// halfTonePass()

function unrealBloom() {
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
  const params = {
    exposure: 0.9,
    bloomStrength: 1.5,
    bloomThreshold: 0.5,
    bloomRadius: 0
  };
  renderer.toneMappingExposure = Math.pow(params.exposure, 4.0);
  composer.addPass(bloomPass)

  const matChanger = function () {
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
  };
  const gui = new GUI();
  gui.add(params, "bloomStrength", 0.0, 10.0, 0.1).onChange(matChanger);
  gui.add(params, "bloomThreshold", 0.0, 1.0, 0.1).onChange(matChanger);
  gui.add(params, "bloomRadius", 0.0, 10.0, 0.1).onChange(matChanger);
  matChanger();
}
// unrealBloom()

function afterImagePass () {
  const afterImagePass = new AfterimagePass()
  composer.addPass(afterImagePass)
}
// afterImagePass()

function pixelShader() {
  const pixelPass = new ShaderPass(PixelShader);
  pixelPass.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
  pixelPass.uniforms["resolution"].value.multiplyScalar(window.devicePixelRatio);
  pixelPass.uniforms["pixelSize"].value = 8;
  composer.addPass(pixelPass);

  const effectController = {
    pixelSize: 8,
  };
  const matChanger = function () {
    pixelPass.uniforms["pixelSize"].value = effectController.pixelSize;
  };
  const gui = new GUI();
  gui.add(effectController, "pixelSize", 1.0, 20.0, 1).onChange(matChanger);
  matChanger();
}
// pixelShader()

function edgeDetection() {
  const effectGrayScale = new ShaderPass(LuminosityShader);
  composer.addPass(effectGrayScale);
  const effectSobel = new ShaderPass(SobelOperatorShader);
  effectSobel.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio;
  effectSobel.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio;
  composer.addPass(effectSobel);
}
// edgeDetection()

function bleachByPass () {
  var bleachFilter = new ShaderPass(BleachBypassShader);
  composer.addPass(bleachFilter);

  const effectController = {
    opacity: 0.5,
  };
  const matChanger = function () {
    bleachFilter.uniforms["opacity"].value = effectController.opacity;
  };
  const gui = new GUI();
  gui.add(effectController, "opacity", 0.5, 10.0, 0.1).onChange(matChanger);
  matChanger();
}
// bleachByPass()

function colorify () {
  var effectColorify = new ShaderPass(ColorifyShader);
  effectColorify.uniforms['color'].value.setRGB(0.8, 0.8, 0.8);
  composer.addPass(effectColorify);

  const effectController = {
    red: 0.7,
    green: 0.5,
    blue: 0.3,
  };
  const matChanger = function () {
    effectColorify.uniforms['color'].value.setRGB(effectController.red, 
      effectController.green, 
      effectController.blue);
  };
  const gui = new GUI();
  gui.add(effectController, "red", 0.7, 1.0, 0.01).onChange(matChanger);
  gui.add(effectController, "green", 0.5, 1.0, 0.01).onChange(matChanger);
  gui.add(effectController, "blue", 0.3, 1.0, 0.01).onChange(matChanger);
  matChanger();
}
// colorify()

function horizontalBlur () {
  var horizontalBlur = new ShaderPass(HorizontalBlurShader);
  horizontalBlur.uniforms['h'].value =  1 / window.innerHeight;
  composer.addPass(horizontalBlur);

  const effectController = {
    h: 1 / window.innerHeight,
  };
  const matChanger = function () {
    horizontalBlur.uniforms['h'].value =  effectController.h;
  };
  const gui = new GUI();
  gui.add(effectController, "h", 0.0, 0.1, 0.001).onChange(matChanger);
  matChanger();
}
// horizontalBlur()

function verticalBlur () {
  var verticalBlur = new ShaderPass(VerticalBlurShader);
  verticalBlur.uniforms['v'].value =  1 / window.innerWidth;
  composer.addPass(verticalBlur);

  const effectController = {
    v: 1 / window.innerHeight,
  };
  const matChanger = function () {
    verticalBlur.uniforms['v'].value =  effectController.v;
  };
  const gui = new GUI();
  gui.add(effectController, "v", 0.0, 0.1, 0.001).onChange(matChanger);
  matChanger();
}
// verticalBlur()

function sepia () {
  var sepia = new ShaderPass(SepiaShader);
  sepia.uniforms['amount'].value =  1;
  composer.addPass(sepia);

  const effectController = {
    amount: 0,
  };
  const matChanger = function () {
    sepia.uniforms['amount'].value =  effectController.amount;
  };
  const gui = new GUI();
  gui.add(effectController, "amount", 0.0, 10, 0.1).onChange(matChanger);
  matChanger();
}
// sepia()

function vignette () {
  var vignette = new ShaderPass(VignetteShader);
  vignette.uniforms['offset'].value = 0.5
  vignette.uniforms['darkness'].value = 0.8
  composer.addPass(vignette);

  
  const effectController = {
    offset: 0,
    darkness: 0
  };
  const matChanger = function () {
    vignette.uniforms['offset'].value =  effectController.offset;
    vignette.uniforms['darkness'].value =  effectController.darkness;
  };
  const gui = new GUI();
  gui.add(effectController, "offset", 0.0, 10, 0.1).onChange(matChanger);
  gui.add(effectController, "darkness", 0.0, 10, 0.1).onChange(matChanger);
  matChanger();
}
// vignette()

function gamma () {
  var gamma = new ShaderPass(GammaCorrectionShader);
  composer.addPass(gamma);
}
// gamma()

// const renderMask = new MaskPass( scene, camera ); // ??
// composer.addPass(renderMask)
// const clearMaskPass = new ClearMaskPass() // ??
// composer.addPass(clearMaskPass)
// const texturePass = new TexturePass(composer.renderTarget2.texture) // ??
// composer.addPass(texturePass)

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
    new THREE.MeshPhongMaterial({ color: 0x139436 }));
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
