import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
//import { UnrealBloomPass } from '@/lib/UnrealBloomPass';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import * as dat from 'dat.gui';
import Stats from 'three/examples/jsm/libs/stats.module';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

class Model3dScene {
  constructor(options) {
    const that = this;
    this.THREE = THREE;
    this.debugObject = {};
    this.debugObject.scene = {
      antialias: true,
      alpha: false,
      showEnvironmentMap: true,
      bgColor: '#000000',
    };

    this.scene = new this.THREE.Scene();

    //this.scene.background = new THREE.Color(0x000000);
    //this.scene.background = new THREE.Color(this.debugObject.scene.bgColor);

    // Crea una cámara
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    //Object { x: 0.29982961096670824, y: 3.945888758635246, z: 46.62209059325908 }

    this.debugObject.camera_position = {
      x: 0.29982961096670824,
      y: 3.945888758635246,
      z: 46.62209059325908,
    };

    this.camera.position.set(
      this.debugObject.camera_position.x,
      this.debugObject.camera_position.y,
      this.debugObject.camera_position.z
    );

    this.debugObject.camera_lookat = {
      x: -6.123064386655354,
      y: 3.5332994279103533,
      z: 47.76636911290018,
    };

    this.container = options.dom;
    this.debug = options.debug;

    this.camera.lookAt(
      new this.THREE.Vector3(
        this.debugObject.camera_lookat.x,
        this.debugObject.camera_lookat.y,
        this.debugObject.camera_lookat.z
      )
    );

    // Crea un renderizador
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: this.debugObject.scene.antialias,
      alpha: this.debugObject.scene.alpha,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

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
      this.debugObject.camera_lookat.x,
      this.debugObject.camera_lookat.y,
      this.debugObject.camera_lookat.z
    );
    this.controls.enabled = true;

    this.clock = new this.THREE.Clock();

    this.addObjects();
    this.addAnimation();

    //BLOOM EFFECT
    this.debugObject.bloom = {
      threshold: 0.1,
      strength: 0.3,
      radius: 0.6,
      exposure: 1.4,
    };

    const renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = this.debugObject.bloom.threshold;
    this.bloomPass.strength = this.debugObject.bloom.strength;
    this.bloomPass.radius = this.debugObject.bloom.radius;

    const outputPass = new OutputPass();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(outputPass);

    this.renderer.toneMappingExposure = Math.pow(
      this.debugObject.bloom.exposure,
      4.0
    );

    if (this.debug) {
      this.debugModel();
      this.stats = new Stats();
      this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this.stats.dom);
    }

    // Inicia la animación
    this.tick();
  }

  timeline01() {
    const that = this;
    gsap
      .timeline({
        paused: false,
        defaults: { duration: 1, ease: 'linear' },
        onStart: function () {},
        onUpdate: function () {},
        onComplete: function () {},
        onReverseComplete: function () {},
        scrollTrigger: {
          trigger: '.section-01',
          start: 'bottom bottom',
          end: '+=100px bottom',
          scrub: 3,
          //markers: true,
        },
      })
      .to(
        this.camera.position,
        {
          x: -6.483649629026272,
          y: 3.720652319968307,
          z: 41.3368725419376,
          onStart: function () {},
        },
        '01'
      )
      .to(
        this.controls.target,
        {
          x: -5.823706178520901,
          y: 4.285027011218124,
          z: 47.81600210235389,
          onStart: function () {},
        },
        '01'
      );
  }

  timeline02() {
    const that = this;
    gsap
      .timeline({
        paused: false,
        defaults: { duration: 1, ease: 'linear' },
        onStart: function () {},
        onUpdate: function () {},
        onComplete: function () {},
        onReverseComplete: function () {},
        scrollTrigger: {
          trigger: '.section-02',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 3,
          //markers: true,
        },
      })
      .to(
        this.camera.position,
        {
          x: -1.0008361428306436,
          y: 5.799263039916481,
          z: 47.75440332250858,
          onStart: function () {},
        },
        '01'
      )
      .to(
        this.controls.target,
        {
          x: -0.12865801634989135,
          y: 3.8275847215889476,
          z: 41.14508564421529,
          onStart: function () {},
        },
        '01'
      );
  }

  timeline03() {
    const that = this;
    gsap
      .timeline({
        paused: false,
        defaults: { duration: 1, ease: 'linear' },
        onStart: function () {},
        onUpdate: function () {},
        onComplete: function () {},
        onReverseComplete: function () {},
        scrollTrigger: {
          trigger: '.section-03',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 3,
          //markers: true,
        },
      })
      .to(
        this.camera.position,
        {
          x: -0.5083713764016347,
          y: 5.185271038274296,
          z: 50.40015091322145,
          onStart: function () {},
        },
        '01'
      )
      .to(
        this.controls.target,
        {
          x: 2.922541906087581,
          y: 4.084965883649713,
          z: 44.653223053993,
          onStart: function () {},
        },
        '01'
      );
  }

  addAnimation() {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.normalizeScroll(true);

    this.timeline01();
    this.timeline02();
    this.timeline03();
  }

  addObjects() {
    const that = this;
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('./assets/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(this.dracoLoader);

    const lightMaterial = new THREE.MeshStandardMaterial({
      color: 0x03e4ed,
      emissive: 0x03d0d8,
      metalness: 0,
      roughness: 0.5,
      envMapIntensity: 5,
    });

    gltfLoader.load(
      './assets/models/datacenter-rack.glb',
      (gltf) => {
        //this.scene.add(gltf.scene);
        let floor;
        const firstRow = new THREE.Group();
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
                    const numberRacks = 9;
                    for (let i = 0; i < numberRacks; i++) {
                      const serverRack = child.clone();
                      serverRack.position.set(
                        child.position.x,
                        child.position.y,
                        child.position.z + i * -2.01
                      );
                      serverRack.traverse((serverRackChild) => {
                        if (serverRackChild.name === 'left-side-rack') {
                          if (i > 0) serverRackChild.material = lightMaterial;
                        }
                        if (serverRackChild.name === 'right-side-rack') {
                          if (i + 1 < numberRacks)
                            serverRackChild.material = lightMaterial;
                        }
                      });
                      firstRow.add(serverRack);
                    }
                    const secondRow = firstRow.clone();
                    firstRow.rotation.y = (7 / 6) * Math.PI;
                    firstRow.position.set(15, 0, 70);
                    secondRow.rotation.y = Math.PI / 6;
                    secondRow.position.set(-30, 0, 5);
                    that.scene.add(firstRow);
                    that.scene.add(secondRow);
                  }
                );
              }
            });
          }
        });
        this.scene.add(floor);
        this.updateAllMaterials();
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    this.addLights();

    this.addCubeTexture(11);
  }

  addLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 2.8);
    this.scene.add(this.ambientLight);

    this.lights = [];

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-50, 16.2, 49.9);
    directionalLight.scale.set(1, 1, 1);
    directionalLight.rotation.set(0, 0.7, 0);
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

    const directionalLight02 = new THREE.DirectionalLight(0xffffff, 1.45);
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

    // const directionalLight03 = new THREE.DirectionalLight(0xffffff, 0.05);
    // directionalLight03.position.set(21.8, 3.9, 3.9);
    // directionalLight03.scale.set(1, 1, 1);
    // directionalLight03.rotation.set(0.3, -0.3, -0.1);
    // directionalLight03.castShadow = true;
    // directionalLight03.shadow.camera.far = 300;
    // directionalLight03.shadow.mapSize.set(1024, 1024);
    // directionalLight03.shadow.normalBias = 0.05; //CURVE SURFACES
    // //directionalLight.shadow.bias = 0.05; //FLAT SURFACES
    // this.scene.add(directionalLight03);

    // const directionalLightHelper03 = new THREE.DirectionalLightHelper(
    //   directionalLight03,
    //   2
    // );
    // this.scene.add(directionalLightHelper03);
    // directionalLightHelper03.visible = false;

    // this.lights.push({
    //   light: directionalLight03,
    //   helper: directionalLightHelper03,
    // });
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
    this.gui = new dat.GUI();
    const that = this;

    this.guiBgFolder = this.gui.addFolder('BG');
    this.guiBgFolder
      .addColor(that.debugObject.scene, 'bgColor')
      .onChange((value) => {
        that.scene.background = new THREE.Color(value);
        this.debugObject.scene.bgColor = value;
      });

    this.guiBgFolder
      .add(that.debugObject.scene, 'showEnvironmentMap')
      .onChange((value) => {
        if (value) {
          this.scene.background = this.environmentMap;
        } else {
          this.scene.background = new THREE.Color(
            this.debugObject.scene.bgColor
          );
        }
      });

    /**Debug Camera */
    this.guiFolderCamera = this.gui.addFolder('Camera');
    this.guiFolderCamera
      .add(that.camera.position, 'x', -10, 10, 0.1)
      .name('Position X');
    this.guiFolderCamera
      .add(that.camera.position, 'y', -10, 10, 0.1)
      .name('Position Y');
    this.guiFolderCamera
      .add(that.camera.position, 'z', -10, 30, 0.1)
      .name('Position z');

    this.guiFolderCamera
      .add(that.debugObject.camera_lookat, 'x', -5, 5, 0.001)
      .name('LookAt X')
      .onChange(() => {
        that.controls.enabled = false;
        that.camera.lookAt(this.debugObject.camera_lookat);
        that.controls.target.set(
          this.debugObject.camera_lookat.x,
          this.debugObject.camera_lookat.y,
          this.debugObject.camera_lookat.z
        );
        that.controls.enabled = true;
      });
    this.guiFolderCamera
      .add(that.debugObject.camera_lookat, 'y', -5, 5, 0.001)
      .name('LookAt Y')
      .onChange(() => {
        that.controls.enabled = false;
        that.camera.lookAt(this.debugObject.camera_lookat);
        that.controls.target.set(
          this.debugObject.camera_lookat.x,
          this.debugObject.camera_lookat.y,
          this.debugObject.camera_lookat.z
        );
        that.controls.enabled = true;
      });
    this.guiFolderCamera
      .add(that.debugObject.camera_lookat, 'z', -5, 5, 0.001)
      .name('LookAt Z')
      .onChange(() => {
        that.controls.enabled = false;
        that.camera.lookAt(this.debugObject.camera_lookat);
        that.controls.target.set(
          this.debugObject.camera_lookat.x,
          this.debugObject.camera_lookat.y,
          this.debugObject.camera_lookat.z
        );
        that.controls.enabled = true;
      });
    this.guiFolderCamera.add(
      {
        getPositionCamera: function () {
          console.log(that.camera.position);
          console.log(that.controls.target);
        },
      },
      'getPositionCamera'
    );

    this.guiFolderCamera.close();

    /**Debug Lights */
    this.guiFolderLights = this.gui.addFolder('Lights');

    const folderAmbientLight = this.guiFolderLights.addFolder('Ambient Light');
    folderAmbientLight.add(this.ambientLight, 'visible').name('Visible');
    folderAmbientLight
      .add(this.ambientLight, 'intensity', 0, 50, 0.1)
      .name('Intensity');
    //folderAmbientLight.add(this.ambientLight, 'color').name('Color');

    this.lights.forEach((light, index) => {
      const folderLight = this.guiFolderLights.addFolder(`Light ${index + 1}`);
      folderLight.add(light.helper, 'visible').name('Helper');
      folderLight.add(light.light, 'intensity', 0, 5, 0.05).name('Intensity');
      folderLight
        .add(light.light.position, 'x', -50, 50, 0.1)
        .name('Position X');
      folderLight
        .add(light.light.position, 'y', -50, 50, 0.1)
        .name('Position Y');
      folderLight
        .add(light.light.position, 'z', -50, 50, 0.1)
        .name('Position Z');
      folderLight.add(light.light.scale, 'x', 0, 5, 0.1).name('Scale X');
      folderLight.add(light.light.scale, 'y', 0, 5, 0.1).name('Scale Y');
      folderLight.add(light.light.scale, 'z', 0, 5, 0.1).name('Scale Z');
      folderLight
        .add(light.light.rotation, 'x', -Math.PI, Math.PI, 0.1)
        .name('Rotate X');
      folderLight
        .add(light.light.rotation, 'y', -Math.PI, Math.PI, 0.1)
        .name('Rotate Y');
      folderLight
        .add(light.light.rotation, 'z', -Math.PI, Math.PI, 0.1)
        .name('Rotate Z');
    });

    this.guiFolderLights.close();

    //DEBUG BLOOM
    const bloomFolder = this.gui.addFolder('Bloom');

    bloomFolder
      .add(that.debugObject.bloom, 'threshold', 0.0, 1.0, 0.1)
      .onChange(function (value) {
        that.bloomPass.threshold = Number(value);
      });

    bloomFolder
      .add(that.debugObject.bloom, 'strength', 0.0, 3.0, 0.1)
      .onChange(function (value) {
        that.bloomPass.strength = Number(value);
      });

    bloomFolder
      .add(that.debugObject.bloom, 'radius', 0.0, 1.0, 0.1)
      .step(0.01)
      .onChange(function (value) {
        that.bloomPass.radius = Number(value);
      });

    const toneMappingFolder = bloomFolder.addFolder('tone mapping');

    toneMappingFolder
      .add(that.debugObject.bloom, 'exposure', 0.1, 2, 0.1)
      .onChange(function (value) {
        that.renderer.toneMappingExposure = Math.pow(value, 4.0);
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
    if (this.debugObject.scene.showEnvironmentMap) {
      this.scene.background = this.environmentMap;
    }
    this.scene.environment = this.environmentMap;
  }
  // Función para actualizar la escena
  tick() {
    requestAnimationFrame(this.tick.bind(this));

    // Renderiza la escena con la cámara
    this.renderer.render(this.scene, this.camera);

    if (this.controls.enabled) this.controls.update();

    this.composer.render();

    if (this.debug) {
      this.stats.update();
    }
  }
}

export default function Model3d(props) {
  const { debug } = props;
  const canvasRef = useRef();
  const flag = useRef();

  useEffect(() => {
    if (flag.current) return;
    flag.current = true;
    const model3d = new Model3dScene({
      dom: canvasRef.current,
      debug,
    });
    document.model3d = model3d;
    // Limpia los recursos al desmontar el componente
    return () => {
      model3d.renderer.dispose();
      model3d.scene.remove(model3d.cube);
    };
  }, []);

  return <canvas className="Model3d" ref={canvasRef} />;
}
