import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import * as THREE from 'three'
import { GUI } from './gui/dat.gui.module.js';

import { AdaptiveToneMappingPass } from 'three/examples/jsm/postprocessing/AdaptiveToneMappingPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
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
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader.js';
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';

export function adaptiveToneMappingPass (composer: EffectComposer) {
    const adaptiveToneMapping = new AdaptiveToneMappingPass(true)
    composer.addPass(adaptiveToneMapping)
}

// GLITCH PASS
export function glitchPass(composer: EffectComposer) {
    const glitchPass = new GlitchPass();
    composer.addPass(glitchPass);
}

// DEPTH OF FIELD
export function depthOfField(composer: EffectComposer, scene: THREE.Scene, camera: THREE.Camera) {

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
    gui.add(effectController, "focus", 1.0, 500.0, 1).onChange(matChanger);
    gui.add(effectController, "aperture", 0, 10, 0.1).onChange(matChanger);
    gui.add(effectController, "maxblur", 0.0, 0.01, 0.001).onChange(matChanger);
    matChanger();
}

export function bloom(composer: EffectComposer) { // ?
    const bloomPass = new BloomPass(      1,    // strength
        25,   // kernel size
        4,    // sigma ?
        256,  // blur render target resolution
        );
    composer.addPass(bloomPass);

    var copyPass = new ShaderPass( CopyShader );
    composer.addPass( copyPass );
}

export function filmPass(composer: EffectComposer) {
    const filmPass = new FilmPass(
        0.35,   // noise intensity
        0.5,  // scanline intensity
        648,    // scanline count
        0,  // grayscale
    )
    composer.addPass(filmPass)

    const effectController = {
        nIntensity: 0.5,
        sIntensity: 0.5,
        sCount: 0,
        grayscale: 0
    };
    const matChanger = function () {
        filmPass.uniforms['nIntensity'].value = effectController.nIntensity
        filmPass.uniforms['sIntensity'].value = effectController.sIntensity
        filmPass.uniforms['sCount'].value = effectController.sCount
        filmPass.uniforms['grayscale'].value = effectController.grayscale <= 0 ? false : true
    };
    const gui = new GUI();
    gui.add(effectController, "nIntensity", 0.0, 1.0, 0.01).onChange(matChanger);
    gui.add(effectController, "sIntensity", 0.0, 1.0, 0.01).onChange(matChanger);
    gui.add(effectController, "sCount", 0.0, 512.0, 1).onChange(matChanger);
    gui.add(effectController, "grayscale", 0.0, 1.0, 1).onChange(matChanger);
    matChanger();
}

export function dotScreenPass(composer: EffectComposer) {
    const dotScreenPass = new DotScreenPass()
    composer.addPass(dotScreenPass)
}

export function halfTonePass(composer: EffectComposer) {
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

export function unrealBloom(composer: EffectComposer, renderer: THREE.WebGLRenderer) {
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

export function afterImagePass(composer: EffectComposer) {
    const afterImagePass = new AfterimagePass()
    composer.addPass(afterImagePass)
}

export function pixelShader(composer: EffectComposer) {
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

export function edgeDetection(composer: EffectComposer) {
    const effectGrayScale = new ShaderPass(LuminosityShader);
    composer.addPass(effectGrayScale);
    const effectSobel = new ShaderPass(SobelOperatorShader);
    effectSobel.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio;
    effectSobel.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio;
    composer.addPass(effectSobel);
}

export function bleachByPass(composer: EffectComposer) {
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

export function colorify(composer: EffectComposer) {
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

export function horizontalBlur(composer: EffectComposer) {
    var horizontalBlur = new ShaderPass(HorizontalBlurShader);
    horizontalBlur.uniforms['h'].value = 1 / window.innerHeight;
    composer.addPass(horizontalBlur);

    const effectController = {
        h: 1 / window.innerHeight,
    };
    const matChanger = function () {
        horizontalBlur.uniforms['h'].value = effectController.h;
    };
    const gui = new GUI();
    gui.add(effectController, "h", 0.0, 0.1, 0.001).onChange(matChanger);
    matChanger();
}

export function verticalBlur(composer: EffectComposer) {
    var verticalBlur = new ShaderPass(VerticalBlurShader);
    verticalBlur.uniforms['v'].value = 1 / window.innerWidth;
    composer.addPass(verticalBlur);

    const effectController = {
        v: 1 / window.innerHeight,
    };
    const matChanger = function () {
        verticalBlur.uniforms['v'].value = effectController.v;
    };
    const gui = new GUI();
    gui.add(effectController, "v", 0.0, 0.1, 0.001).onChange(matChanger);
    matChanger();
}

export function sepia(composer: EffectComposer) {
    var sepia = new ShaderPass(SepiaShader);
    sepia.uniforms['amount'].value = 1;
    composer.addPass(sepia);

    const effectController = {
        amount: 0,
    };
    const matChanger = function () {
        sepia.uniforms['amount'].value = effectController.amount;
    };
    const gui = new GUI();
    gui.add(effectController, "amount", 0.0, 10, 0.1).onChange(matChanger);
    matChanger();
}

export function vignette(composer: EffectComposer) {
    var vignette = new ShaderPass(VignetteShader);
    vignette.uniforms['offset'].value = 0.5
    vignette.uniforms['darkness'].value = 0.8
    composer.addPass(vignette);


    const effectController = {
        offset: 0,
        darkness: 0
    };
    const matChanger = function () {
        vignette.uniforms['offset'].value = effectController.offset;
        vignette.uniforms['darkness'].value = effectController.darkness;
    };
    const gui = new GUI();
    gui.add(effectController, "offset", 0.0, 10, 0.1).onChange(matChanger);
    gui.add(effectController, "darkness", 0.0, 10, 0.1).onChange(matChanger);
    matChanger();
}

export function gamma(composer: EffectComposer) {
    var gamma = new ShaderPass(GammaCorrectionShader);
    composer.addPass(gamma);
}

export function fxaa(composer: EffectComposer) {
    var fxaa = new ShaderPass(FXAAShader);
    fxaa.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * window.devicePixelRatio);
    fxaa.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * window.devicePixelRatio);
    composer.addPass(fxaa);
}