import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
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
// const glitchPass = new GlitchPass();
// composer.addPass( glitchPass );
// const luminosityPass = new ShaderPass( LuminosityShader );
// composer.addPass( luminosityPass );
// const bloomPass = new BloomPass( 0.5, 6 ); // ??
// composer.addPass(bloomPass);
// const filmPass = new FilmPass(0.5)
// composer.addPass(filmPass)
// const dotScreenPass = new DotScreenPass()
// composer.addPass(dotScreenPass)
// const renderMask = new MaskPass( scene, camera ); // ??
// composer.addPass(renderMask)
// const clearMaskPass = new ClearMaskPass() // ??
// composer.addPass(clearMaskPass)
// const texturePass = new TexturePass(composer.renderTarget2.texture) // ??
// composer.addPass(texturePass)
// const afterImagePass = new AfterimagePass()
// composer.addPass(afterImagePass)
// const bokehPass = new BokehPass( scene, camera, {
//   focus: 1.0,
//   aperture: 0.025,
//   maxblur: 0.01,

//   width: window.innerWidth,
//   height: window.innerHeight
// } )
// composer.addPass(bokehPass)
// const halfTonePass = new HalftonePass(window.innerWidth, window.innerHeight, {
//   shape: 1,
//   radius: 4,
//   rotateR: Math.PI / 12,
//   rotateB: Math.PI / 12 * 2,
//   rotateG: Math.PI / 12 * 3,
//   scatter: 0,
//   blending: 1,
//   blendingMode: 1,
//   greyscale: false,
//   disable: false
// })
// composer.addPass(halfTonePass)
// const pixelPass = new ShaderPass( PixelShader );
// pixelPass.uniforms[ "resolution" ].value = new THREE.Vector2( window.innerWidth, window.innerHeight );
// pixelPass.uniforms[ "resolution" ].value.multiplyScalar( window.devicePixelRatio );
// pixelPass.uniforms[ "pixelSize" ].value = 8;
// console.log(window.devicePixelRatio)
// composer.addPass( pixelPass );
// SOBEL EDGE DETECTION
// const effectGrayScale = new ShaderPass( LuminosityShader );
// composer.addPass( effectGrayScale );
// const effectSobel = new ShaderPass( SobelOperatorShader );
// effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
// effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
// composer.addPass( effectSobel );
// BLOOM
// const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
// const params = {
//   exposure: 0.9,
//   bloomStrength: 1.5,
//   bloomThreshold: 0.5,
//   bloomRadius: 0
// };
// renderer.toneMappingExposure = Math.pow( params.exposure, 4.0 );
// bloomPass.threshold = params.bloomThreshold;
// bloomPass.strength = params.bloomStrength;
// bloomPass.radius = params.bloomRadius;
// composer.addPass(bloomPass)

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
