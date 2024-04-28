import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
//import { UnrealBloomPass } from '@/lib/UnrealBloomPass';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import styles from '@/styles/Configurator3d.module.css';

import fragmentShader from '@/shaders/fragment.glsl';
import vertexShader from '@/shaders/vertex.glsl';

import Stats from 'three/examples/jsm/libs/stats.module';

import { Debug } from '@/debug/Configurator3d';

class Model3dScene {
  constructor(options) {
    const that = this;
    this.THREE = THREE;
    this.container = options.dom;
    this.overlay = options.overlay;
    this.debug = options.debug;
    this.config = options.config;

    this.scene = new this.THREE.Scene();

    this.scene.background = new THREE.Color(this.config.scene.bgColor);

    // Crea una cámara
    this.camera = new THREE.PerspectiveCamera(
      this.config.camera.fov,
      window.innerWidth / window.innerHeight,
      this.config.camera.near,
      this.config.camera.far
    );

    this.camera.position.set(
      this.config.camera.position.x,
      this.config.camera.position.y,
      this.config.camera.position.z
    );

    this.camera.lookAt(
      new this.THREE.Vector3(
        this.config.camera.target.x,
        this.config.camera.target.y,
        this.config.camera.target.z
      )
    );

    // Crea un renderizador
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: this.config.scene.antialias,
      alpha: this.config.scene.alpha,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.shadowMap.type = THREE.VSMShadowMap;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new this.THREE.Vector3(0, 0, 0);
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 1000;
    this.controls.screenSpacePanning = true;
    this.controls.enableKeys = false;
    this.controls.zoomSpeed = 0.25;
    this.controls.enableDamping = true;
    this.controls.update();

    this.controls.enabled = false;
    this.controls.target.set(
      this.config.camera.target.x,
      this.config.camera.target.y,
      this.config.camera.target.z
    );
    this.controls.enabled = true;

    this.clock = new this.THREE.Clock();

    this.addObjects();

    //BLOOM EFFECT
    const renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = this.config.bloom.threshold;
    this.bloomPass.strength = this.config.bloom.strength;
    this.bloomPass.radius = this.config.bloom.radius;

    const outputPass = new OutputPass();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(outputPass);

    this.renderer.toneMappingExposure = Math.pow(
      this.config.bloom.exposure,
      4.0
    );

    if (this.debug) {
      this.debugModel();
    }

    // Inicia la animación
    this.tick();
  }

  show(styles) {
    const camera_position = { ...this.camera.position };
    const control_target = { ...this.controls.target };
    this.controls.enabled = false;
    //Object { x: 11.922266210737236, y: 2.3482254808524234, z: 3.489137788298752, _gsap: {…} }
    this.camera.position.set(
      11.922266210737236,
      2.3482254808524234,
      3.489137788298752
    );
    //Object { x: 2.61036913119999, y: 2.1805110557110416, z: 9.22913291643659, _gsap: {…} }
    this.controls.target.set(
      2.61036913119999,
      2.1805110557110416,
      9.22913291643659
    );
    this.controls.update();
    this.controls.enabled = true;
    this.overlay.classList.add(styles.hide);
    gsap.to(this.camera.position, {
      x: camera_position.x,
      y: camera_position.y,
      z: camera_position.z,
      duration: 1,
      onStart: () => {},
    });
    gsap.to(this.controls.target, {
      x: control_target.x,
      y: control_target.y,
      z: control_target.z,
      duration: 1,
    });
  }

  color(r, g, b) {
    return new THREE.Color(r / 255, g / 255, b / 255);
  }

  addObjects() {
    const that = this;
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('./assets/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(this.dracoLoader);

    const bgGeometry = new THREE.IcosahedronGeometry(2, 64);

    const total_vertices = bgGeometry.attributes.position.count;
    const index = new Float32Array(total_vertices);

    for (let i = 0; i < total_vertices; i++) {
      index[i] = i;
    }
    bgGeometry.setAttribute('aIndex', new THREE.BufferAttribute(index, 1));

    this.bgMaterial = new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      wireframe: false,
      //blending: THREE.AdditiveBlending,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        ratio: { value: this.width / this.height },
        uColor: { value: new THREE.Color('red') },
        uVertextCount: { value: total_vertices },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uFrequency: { value: 0 },
        uAmplitude: { value: 0.56 },
        uDensity: { value: 0.56 },
        uStrength: { value: 0.11 },
        uDeepPurple: { value: 0.08 },
        uOpacity: { value: 0.06 },
        uBrightness: { value: this.color(0, 0, 0) },
        uContrast: { value: this.color(227, 227, 227) },
        uOscilation: { value: this.color(34, 122, 59) },
        uPhase: { value: this.color(19, 120, 51) },
        uSpeed: { value: 1.0 },
      },
    });

    this.bgMesh = new THREE.Mesh(bgGeometry, this.bgMaterial);
    this.scene.add(this.bgMesh);

    this.bgMesh.scale.x = this.config.scene.bgMesh.scale.x;
    this.bgMesh.scale.z = this.config.scene.bgMesh.scale.z;
    this.bgMesh.scale.y = this.config.scene.bgMesh.scale.y;

    gltfLoader.load(
      './assets/models/datacenter-rack-configurator.glb',
      (gltf) => {
        let floor, server;
        gltf.scene.traverse((child) => {
          if (child.name === 'floor') {
            floor = child;
          }
          if (child.name === 'server-rack-01') {
            child.traverse((serverRackChild) => {
              if (serverRackChild.name === 'logo-rack') {
                new THREE.TextureLoader().load(
                  '/assets/images/logo.png?v=1',
                  function (texture) {
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    texture.flipY = false;
                    serverRackChild.material = new THREE.MeshBasicMaterial({
                      map: texture,
                      transparent: true,
                      opacity: 0.5,
                    });
                  }
                );
              }
            });
            this.server = child;
          }
        });
        //this.scene.add(floor);
        this.scene.add(this.server);
        this.updateAllMaterials();
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    const geometry = new THREE.PlaneGeometry(
      this.config.floor.width,
      this.config.floor.height
    );
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(this.config.floor.color),
      roughness: this.config.floor.roughness,
      clearcoat: this.config.floor.clearcoat,
      metalness: this.config.floor.metalness,
      clearcoatRoughness: this.config.floor.clearcoatRoughness,
    });
    this.floor = new THREE.Mesh(geometry, material);
    this.floor.rotation.x = -Math.PI / 2;
    this.scene.add(this.floor);
    this.floor.visible = true;

    this.addLights();

    if (this.config.scene.showEnvironmentMap) this.addCubeTexture(10);
  }

  addLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 2.8);
    this.scene.add(this.ambientLight);

    this.lights = [];

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.7);
    directionalLight.position.set(7.2, 9.5, 5);
    directionalLight.scale.set(1, 1, 1);
    directionalLight.rotation.set(0.2, 1, -1);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 300;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.normalBias = 0.05; //CURVE SURFACES
    //directionalLight.shadow.bias = 0.05; //FLAT SURFACES
    this.scene.add(directionalLight);

    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      2
    );
    this.scene.add(directionalLightHelper);
    directionalLightHelper.visible = false;

    this.lights.push({
      light: directionalLight,
      helper: directionalLightHelper,
    });

    const directionalLight02 = new THREE.DirectionalLight(0xffffff, 0);
    directionalLight02.position.set(8.4, 9.5, 45.4);
    directionalLight02.scale.set(1, 1, 1);
    directionalLight02.rotation.set(-0.2, -0.7, 0.2);
    directionalLight02.castShadow = true;
    directionalLight02.shadow.camera.far = 300;
    directionalLight02.shadow.mapSize.set(1024, 1024);
    directionalLight02.shadow.normalBias = 0.05; //CURVE SURFACES
    //directionalLight.shadow.bias = 0.05; //FLAT SURFACES
    this.scene.add(directionalLight02);

    const directionalLightHelper02 = new THREE.DirectionalLightHelper(
      directionalLight02,
      2
    );
    this.scene.add(directionalLightHelper02);
    directionalLightHelper02.visible = false;

    this.lights.push({
      light: directionalLight02,
      helper: directionalLightHelper02,
    });
  }

  updateAllMaterials() {
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh
        // &&
        // child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.material.envMap = this.environmentMap;
        child.material.envMapIntensity = 5;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  debugModel() {
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    new Debug({
      debugObject: this.config,
      camera: this.camera,
      ambientLight: this.ambientLight,
      lights: this.lights,
      bloomPass: this.bloomPass,
      renderer: this.renderer,
      scene: this.scene,
      controls: this.controls,
      bgMaterial: this.bgMaterial,
      bgMesh: this.bgMesh,
      floor: this.floor,
      environmentMap: this.environmentMap,
    });
  }

  addCubeTexture(n) {
    this.cubeTextLoader = new THREE.CubeTextureLoader();
    this.environmentMap = this.cubeTextLoader.load([
      '/assets/textures/' + n + '/px.png',
      '/assets/textures/' + n + '/nx.png',
      '/assets/textures/' + n + '/py.png',
      '/assets/textures/' + n + '/ny.png',
      '/assets/textures/' + n + '/pz.png',
      '/assets/textures/' + n + '/nz.png',
    ]);
    this.environmentMap.encoding = THREE.sRGBEncoding;
    if (this.config.scene.showEnvironmentMap) {
      this.scene.background = this.environmentMap;
    }
    this.scene.environment = this.environmentMap;
  }
  // Función para actualizar la escena
  tick() {
    requestAnimationFrame(this.tick.bind(this));

    const elapsedTime = this.clock.getElapsedTime();

    if (this.config.scene.bgMesh.rotation && this.bgMaterial && this.bgMesh) {
      //this.bgMaterial.uniforms.uTime.value = elapsedTime;
      this.bgMesh.rotation.z += 0.001;
    }

    // Renderiza la escena con la cámara
    this.renderer.render(this.scene, this.camera);

    if (this.controls.enabled) this.controls.update();

    this.composer.render();

    if (this.debug) {
      this.stats.update();
    }
  }
}

export default function Configurator3d(props) {
  const { debug, show, config } = props;
  const canvasRef = useRef();
  const model3dOverlay = useRef();
  const flag = useRef();
  const [model3d, setModel3D] = useState(null);

  useEffect(() => {
    if (flag.current) return;
    flag.current = true;
    const _model3d = new Model3dScene({
      dom: canvasRef.current,
      overlay: model3dOverlay.current,
      debug,
      config,
    });
    if (debug) document.model3d = _model3d;
    setModel3D(_model3d);
    // Limpia los recursos al desmontar el componente
    return () => {
      _model3d.renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (show && model3d) {
      model3d.show(styles);
    }
  }, [show, model3d]);

  return (
    <>
      <div className={styles.Model3dOverlay} ref={model3dOverlay}></div>
      <canvas className={styles.Model3d} ref={canvasRef} />
    </>
  );
}
