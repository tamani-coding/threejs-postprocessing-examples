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
camera.position.set(-35, 70, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const tweenCamera1 = new TWEEN.Tween( {x: -35, y: 85, z: 100, lookAtX: 0, lookAtY: 0, lookAtZ: 0} )
  .to( {x: 45, y: 66, z: -80, lookAtX: 0, lookAtY: 0, lookAtZ: 0}, 7000 )
const tweenCamera2 = new TWEEN.Tween( {x: -45, y: 10, z: -80, lookAtX: -35, lookAtY: 10, lookAtZ: 100} )
  .to( {x: 35, y: 10, z: -80, lookAtX: 35, lookAtY: 10, lookAtZ: 100}, 6000 )

tweenCamera1.chain(tweenCamera2)
tweenCamera2.chain(tweenCamera1)

const updateCamera = function (object : {x: number; y: number; z:number; lookAtX:number; lookAtY:number; lookAtZ:number}, elapsed: number) {
  camera.position.set(object.x, object.y, object.z);
  camera.lookAt(new THREE.Vector3(object.lookAtX, object.lookAtY, object.lookAtZ))
}
tweenCamera1.onUpdate(updateCamera)
tweenCamera2.onUpdate(updateCamera)

// tweenCamera1.start()

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

// POST PROCESSING COMPOSER
const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );
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
  TWEEN.update();
  composer.render()
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
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 70;
dirLight.shadow.camera.top = 70;
dirLight.shadow.camera.bottom = -70;

function createFloor() {
  let pos = { x: 0, y: -1, z: 3 };
  let scale = { x: 100, y: 2, z: 100 };

  let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(),
    new THREE.MeshPhongMaterial({ color: 0x139436 }));
  blockPlane.position.set(pos.x, pos.y, pos.z);
  blockPlane.scale.set(scale.x, scale.y, scale.z);
  blockPlane.castShadow = true;
  blockPlane.receiveShadow = true;
  scene.add(blockPlane);
}

// box
function createBox() {
  let box = new THREE.Mesh(new THREE.BoxBufferGeometry(),
    new THREE.MeshPhongMaterial({ color: 0xDC143C }));
  box.position.set(0, 6, 0)
  box.scale.set(6, 6, 6);
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box)

  var start = { x: 3, y: 3, z: 3 };
  var target1 = { x: 6, y: 6, z: 6 };
  var target2 = { x: 3, y: 3, z: 3 };
  var tween1 = new TWEEN.Tween(start).to(target1, 2000).easing(TWEEN.Easing.Elastic.InOut)
  var tween2 = new TWEEN.Tween(start).to(target2, 2000).easing(TWEEN.Easing.Elastic.InOut).chain(tween1)
  tween1.chain(tween2)
  tween1.start()

  const update = function () {
    box.scale.x = start.x;
    box.scale.y = start.y;
    box.scale.z = start.z;
  }

  tween1.onUpdate(update)
  tween2.onUpdate(update);
}

function createSphere() {
  let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(4, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0x43a1f4 }))
  sphere.position.set(0, 5, -15)
  sphere.castShadow = true
  sphere.receiveShadow = true
  scene.add(sphere)

  var start = { x: 0, y: 5, z: -15 };
  var target1 = { x: 10, y: 15, z: -15 };
  var target2 = { x: 0, y: 25, z: -15 };
  var target3 = { x: -10, y: 15, z: -15 };
  var target4 = { x: 0, y: 5, z: -15 };

  const updateFunc = function (object: {
    x: number;
    y: number;
    z: number;
  }, elapsed: number) {
    sphere.position.x = object.x;
    sphere.position.y = object.y;
    sphere.position.z = object.z;
  }

  var tween1 = new TWEEN.Tween(start).to(target1, 2000).easing(TWEEN.Easing.Elastic.InOut)
  var tween2 = new TWEEN.Tween(start).to(target2, 2000).easing(TWEEN.Easing.Exponential.InOut)
  var tween3 = new TWEEN.Tween(start).to(target3, 2000).easing(TWEEN.Easing.Bounce.InOut)
  var tween4 = new TWEEN.Tween(start).to(target4, 2000).easing(TWEEN.Easing.Quadratic.InOut)

  tween1.chain(tween2).start()
  tween2.chain(tween3)
  tween3.chain(tween4)
  tween4.chain(tween1)

  tween1.onUpdate(updateFunc)
  tween2.onUpdate(updateFunc)
  tween3.onUpdate(updateFunc)
  tween4.onUpdate(updateFunc)
}

function createSwordMan() {
  new MTLLoader().load('./chr_sword.mtl', function (materials) {
    materials.preload();
    new OBJLoader().setMaterials(materials).loadAsync('./chr_sword.obj').then((group) => {
      const swordMan = group.children[0];

      swordMan.position.x = -15
      swordMan.position.z = -15

      swordMan.scale.x = 7;
      swordMan.scale.y = 7;
      swordMan.scale.z = 7;

      swordMan.castShadow = true
      swordMan.receiveShadow = true

      const start = { x: -15, z: -15 }
      const moveto1 = { x: -15, z: 15 }
      const moveto2 = { x: -35, z: 15 }
      const moveto3 = { x: -35, z: -15 }
      const moveto4 = { x: -15, z: -15 }

      const rotStart = { rotY: 0 }
      const rotto1 = { rotY: - Math.PI / 2 }
      const rotto2 = { rotY: - Math.PI }
      const rotto3 = { rotY: - Math.PI * (3 / 2) }
      const rotto4 = { rotY: - Math.PI * 2 }

      var tweenRot1 = new TWEEN.Tween(rotStart).to(rotto1, 400)
      var tweenRot2 = new TWEEN.Tween(rotStart).to(rotto2, 400)
      var tweenRot3 = new TWEEN.Tween(rotStart).to(rotto3, 400)
      var tweenRot4 = new TWEEN.Tween(rotStart).to(rotto4, 400)

      var tweenMove1 = new TWEEN.Tween(start).to(moveto1, 2000)
      var tweenMove2 = new TWEEN.Tween(start).to(moveto2, 2000)
      var tweenMove3 = new TWEEN.Tween(start).to(moveto3, 2000)
      var tweenMove4 = new TWEEN.Tween(start).to(moveto4, 2000)

      tweenMove1.chain(tweenRot1)
      tweenRot1.chain(tweenMove2)
      tweenMove2.chain(tweenRot2)
      tweenRot2.chain(tweenMove3)
      tweenMove3.chain(tweenRot3)
      tweenRot3.chain(tweenMove4)
      tweenMove4.chain(tweenRot4)
      tweenRot4.chain(tweenMove1)

      const updatePos = function (object: {
        x: number;
        z: number;
      }, elapsed: number) {
        swordMan.position.x = object.x;
        swordMan.position.z = object.z;
      }
      tweenMove1.onUpdate(updatePos)
      tweenMove2.onUpdate(updatePos)
      tweenMove3.onUpdate(updatePos)
      tweenMove4.onUpdate(updatePos)

      const updateRot = function (object: {
        rotY: number;
      }, elapsed: number) {
        swordMan.rotation.y = object.rotY;
      }
      tweenRot1.onUpdate(updateRot)
      tweenRot2.onUpdate(updateRot)
      tweenRot3.onUpdate(updateRot)
      tweenRot4.onUpdate(updateRot)

      tweenMove1.start()

      scene.add(swordMan)
    })
  });
}

function createRobotArm() {
  const material = new THREE.MeshPhongMaterial({ color: 0xfc8403 })

  const foundation1 = new THREE.Mesh(new THREE.CylinderBufferGeometry(5,5,1,64), material);
  foundation1.position.set(-35, 0.5, 35)
  foundation1.castShadow = true;
  foundation1.receiveShadow = true;
  const foundation2 = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 4, 4), material)
  foundation2.position.y = 2
  foundation2.castShadow = true;
  foundation2.receiveShadow = true;
  foundation1.add(foundation2)

  const joint1 = new THREE.Object3D;
  joint1.position.y = 1
  joint1.position.x = 1
  joint1.rotation.x = - Math.PI / 4
  foundation2.add(joint1)
  const part1 = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 15, 4), material)
  part1.position.y = 7.5
  part1.castShadow = true;
  part1.receiveShadow = true;
  joint1.add(part1)

  const joint2 = new THREE.Object3D;
  joint2.position.y = 7.5
  joint2.position.x = -1
  joint2.rotation.x = Math.PI / 2
  part1.add(joint2)
  const part2 = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 15, 4), material)
  part2.position.y = 7.5
  part2.castShadow = true;
  part2.receiveShadow = true;
  joint2.add(part2)
  
  const joint3 = new THREE.Object3D;
  joint3.position.y = 7.5
  joint3.position.x = 1
  joint3.rotation.x = Math.PI / 6
  part2.add(joint3)
  const part3 = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 6, 4), material)
  part3.position.y = 3
  part3.castShadow = true;
  part3.receiveShadow = true;
  joint3.add(part3)

  scene.add(foundation1)

  // TWEEN FOUNDATION
  const foundation1Tween1 = new TWEEN.Tween( {rotY: 0} ).to( { rotY: 2 * Math.PI }, 4000 )
    .easing(TWEEN.Easing.Quadratic.InOut)
  const foundation1Tween2 = new TWEEN.Tween( {rotY: 2 *  Math.PI} ).to( { rotY: 0 }, 4000 )
    .easing(TWEEN.Easing.Quadratic.InOut)
  foundation1Tween1.chain(foundation1Tween2)
  foundation1Tween2.chain(foundation1Tween1)
  const updateFoundation1 = function (object: {
    rotY: number;
  }, elapsed: number) {
    foundation1.rotation.y = object.rotY;
  }
  foundation1Tween1.onUpdate(updateFoundation1)
  foundation1Tween2.onUpdate(updateFoundation1)
  foundation1Tween1.start()

  // TWEEN JOINTS
  const jointsTween1 = new TWEEN.Tween( {rotX1: - Math.PI / 2.5, 
                                         rotX2: Math.PI * ( 1.5 / 2 ),
                                         rotX3: - Math.PI / 2 } )
    .to( { rotX1: Math.PI / 2.5, rotX2: -Math.PI * ( 1.5/2 ), rotX3: Math.PI / 2  }, 5000 )
    .easing(TWEEN.Easing.Quadratic.InOut)
  const jointsTween2 = new TWEEN.Tween( {rotX1: Math.PI / 2.5, rotX2: -Math.PI * ( 1.5/2 ), rotX3: Math.PI / 2  } )
    .to( { rotX1: - Math.PI / 2.5, rotX2: Math.PI * ( 1.5/2 ), rotX3: - Math.PI / 2  }, 5000 )
    .easing(TWEEN.Easing.Quadratic.InOut)
    jointsTween1.chain(jointsTween2)
    jointsTween2.chain(jointsTween1)
  const updateJoint1 = function (object: {
    rotX1: number;
    rotX2: number;
    rotX3: number
  }, elapsed: number) {
    joint1.rotation.x = object.rotX1;
    joint2.rotation.x = object.rotX2;
    joint3.rotation.x = object.rotX3;
  }
  jointsTween1.onUpdate(updateJoint1)
  jointsTween2.onUpdate(updateJoint1)
  jointsTween1.start()
}

createFloor()
createBox()
createSphere()
createSwordMan()
createRobotArm()

animate()
