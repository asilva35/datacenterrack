import React, { useEffect, useRef, useState, useContext } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
//import { UnrealBloomPass } from '@/lib/UnrealBloomPass';
//import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
//import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import styles from '@/styles/Configurator3d.module.css';

import fragmentShader from '@/shaders/fragment.glsl';
import vertexShader from '@/shaders/vertex.glsl';

import { AppContext } from '@/context/AppContext';

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

    if (this.config.scene.bgColor)
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
    //this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = this.config.scene.toneMappingExposure;
    this.renderer.shadowMap.enabled = true;
    //this.renderer.shadowMap.type = THREE.PCFShadowMap;
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

    this.addPostProcessing();

    // Inicia la animación
    this.tick();
  }

  addPostProcessing() {
    //BLOOM EFFECT
    // const renderScene = new RenderPass(this.scene, this.camera);
    // if (this.config.bloom && this.config.bloom.active) {
    //   this.bloomPass = new UnrealBloomPass(
    //     new THREE.Vector2(window.innerWidth, window.innerHeight),
    //     1.5,
    //     0.4,
    //     0.85
    //   );
    //   this.bloomPass.threshold = this.config.bloom.threshold;
    //   this.bloomPass.strength = this.config.bloom.strength;
    //   this.bloomPass.radius = this.config.bloom.radius;
    // }
    // this.bokehPass = new BokehPass(this.scene, this.camera, {
    //   focus: this.config.bokeh.focus,
    //   aperture: this.config.bokeh.aperture,
    //   maxblur: this.config.bokeh.maxblur,
    // });
    // const outputPass = new OutputPass();
    // this.composer = new EffectComposer(this.renderer);
    // this.composer.addPass(renderScene);
    // if (this.config.bloom && this.config.bloom.active)
    //   this.composer.addPass(this.bloomPass);
    // //this.composer.addPass(this.bokehPass);
    // this.composer.addPass(outputPass);
    // this.renderer.toneMappingExposure = Math.pow(
    //   this.config.bloom.exposure,
    //   4.0
    // );
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
      onStart: () => {
        if (this.server) this.server.visible = true;
        if (this.ground) this.ground.visible = true;
      },
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
      //blending: THREE.AdditiveBlending,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: this.config.scene.bgMaterial.wireframe,
      uniforms: {
        uTime: { value: 0 },
        ratio: { value: this.width / this.height },
        uColor: {
          value: this.color(
            this.config.scene.bgMaterial.uColor.r,
            this.config.scene.bgMaterial.uColor.g,
            this.config.scene.bgMaterial.uColor.b
          ),
        },
        uVertextCount: { value: total_vertices },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uFrequency: { value: this.config.scene.bgMaterial.uFrequency },
        uAmplitude: { value: this.config.scene.bgMaterial.uAmplitude },
        uDensity: { value: this.config.scene.bgMaterial.uDensity },
        uStrength: { value: this.config.scene.bgMaterial.uStrength },
        uDeepPurple: { value: this.config.scene.bgMaterial.uDeepPurple },
        uOpacity: { value: this.config.scene.bgMaterial.uOpacity },
        uBrightness: {
          value: this.color(
            this.config.scene.bgMaterial.uBrightness.r,
            this.config.scene.bgMaterial.uBrightness.g,
            this.config.scene.bgMaterial.uBrightness.b
          ),
        },
        uContrast: {
          value: this.color(
            this.config.scene.bgMaterial.uContrast.r,
            this.config.scene.bgMaterial.uContrast.g,
            this.config.scene.bgMaterial.uContrast.b
          ),
        },
        uOscilation: {
          value: this.color(
            this.config.scene.bgMaterial.uOscilation.r,
            this.config.scene.bgMaterial.uOscilation.g,
            this.config.scene.bgMaterial.uOscilation.b
          ),
        },
        uPhase: {
          value: this.color(
            this.config.scene.bgMaterial.uPhase.r,
            this.config.scene.bgMaterial.uPhase.g,
            this.config.scene.bgMaterial.uPhase.b
          ),
        },
        uSpeed: { value: this.config.scene.bgMaterial.uSpeed },
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
        gltf.scene.traverse((child) => {
          if (child.name === 'white-bg') {
            this.whiteBg = child;
          }
          if (child.name === 'server-rack-glass-window01') {
            child.material.color = new THREE.Color(
              this.config.server.glass.color.r,
              this.config.server.glass.color.g,
              this.config.server.glass.color.b
            );
            child.material.opacity = this.config.server.glass.opacity;
            child.material.roughness = this.config.server.glass.roughness;
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
                    that.logoMaterial = new THREE.MeshStandardMaterial({
                      map: texture,
                      transparent: true,
                      opacity: 0.5,
                      roughness: that.config.server.logo.roughness,
                      metalness: that.config.server.logo.metalness,
                    });
                    serverRackChild.material = that.logoMaterial;
                  }
                );
              }
            });
            this.server = child;
          }
        });

        this.scene.add(this.server);
        this.scene.add(this.whiteBg);
        this.server.visible = false;
        this.updateAllMaterials();
        if (this.debug) {
          this.debugModel();
        }
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    if (this.config.floor && this.config.floor.active) {
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
    }

    const geometryGround = new THREE.PlaneGeometry(
      this.config.floor.width,
      this.config.floor.height
    );
    geometryGround.rotateX(-Math.PI / 2);

    const materialGround = new THREE.ShadowMaterial();
    materialGround.opacity = 0.05;

    this.ground = new THREE.Mesh(geometryGround, materialGround);
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
    this.ground.visible = false;

    this.addLights();

    if (this.config.scene.showEnvironmentMap) this.addCubeTexture(14);
  }

  addLights() {
    if (this.config.lights && this.config.lights.length > 0) {
      this.config.lights.forEach((l) => {
        if (l.type === 'AmbientLight' && l.active) {
          const light = new THREE.AmbientLight(
            this.color(l.color.r, l.color.g, l.color.b),
            l.intensity
          );
          light.visible = l.visible;
          light.name = l.name;
          light.label = l.label;
          this.scene.add(light);
        }
        if (l.type === 'DirectionalLight' && l.active) {
          const light = new THREE.DirectionalLight(
            this.color(l.color.r, l.color.g, l.color.b),
            l.intensity
          );
          light.visible = l.visible;
          light.name = l.name;
          light.label = l.label;
          light.position.set(l.position.x, l.position.y, l.position.z);
          light.scale.set(l.scale.x, l.scale.y, l.scale.z);
          light.rotation.set(l.rotation.x, l.rotation.y, l.rotation.z);
          light.castShadow = l.castShadow;
          light.shadow.camera.far = l.shadow.camera.far;
          light.shadow.mapSize.set(l.shadow.mapSize.x, l.shadow.mapSize.y);
          light.shadow.normalBias = l.shadow.normalBias;
          this.scene.add(light);

          if (this.debug) {
            const lightHelper = new THREE.DirectionalLightHelper(light, 2);
            lightHelper.name = l.name + 'Helper';
            this.scene.add(lightHelper);
            lightHelper.visible = l.helper;
          }
        }
      });
    }
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
      bloomPass: this.bloomPass,
      //bokehPass: this.bokehPass,
      renderer: this.renderer,
      scene: this.scene,
      controls: this.controls,
      bgMaterial: this.bgMaterial,
      bgMesh: this.bgMesh,
      floor: this.floor,
      environmentMap: this.environmentMap,
    });
  }

  enableControls(is360view) {
    if (is360view) {
      this.previusCameraPosition = {
        position: { ...this.camera.position },
        target: { ...this.controls.target },
      };
      this.overlay.style.display = 'none';
      this.ground.visible = false;
    } else {
      this.overlay.style.display = 'block';
      this.ground.visible = true;
      if (this.previusCameraPosition) {
        gsap.to(this.camera.position, {
          x: this.previusCameraPosition.position.x,
          y: this.previusCameraPosition.position.y,
          z: this.previusCameraPosition.position.z,
          duration: 1,
        });
        gsap.to(this.controls.target, {
          x: this.previusCameraPosition.target.x,
          y: this.previusCameraPosition.target.y,
          z: this.previusCameraPosition.target.z,
          duration: 1,
        });
      }
    }
  }

  showProductInfo(showProductInfo) {
    if (showProductInfo) {
      this.previusCameraPosition = {
        position: { ...this.camera.position },
        target: { ...this.controls.target },
      };
      gsap.to(this.camera.position, {
        x: 7.659364955875672,
        y: 2.7795928751740524,
        z: 2.9445816060847427,
        duration: 1,
      });
      gsap.to(this.controls.target, {
        x: -1.745996244919798,
        y: 2.299585416818556,
        z: -4.370307678673102,
        duration: 1,
      });
    } else {
      if (this.previusCameraPosition) {
        gsap.to(this.camera.position, {
          x: this.previusCameraPosition.position.x,
          y: this.previusCameraPosition.position.y,
          z: this.previusCameraPosition.position.z,
          duration: 1,
        });
        gsap.to(this.controls.target, {
          x: this.previusCameraPosition.target.x,
          y: this.previusCameraPosition.target.y,
          z: this.previusCameraPosition.target.z,
          duration: 1,
        });
      }
    }
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

    //this.composer.render();

    if (this.debug && this.stats) {
      this.stats.update();
    }
  }
}

export default function Configurator3d(props) {
  const { debug, config } = props;
  const canvasRef = useRef();
  const model3dOverlay = useRef();
  const flag = useRef();
  const [model3d, setModel3D] = useState(null);
  const { state, dispatch } = useContext(AppContext);

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
    return () => {
      _model3d.renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (state.show3DModel && model3d) {
      model3d.show(styles);
    }
  }, [state.show3DModel, model3d]);

  useEffect(() => {
    if (state.show3DModel && model3d) {
      model3d.enableControls(state.is360view);
    }
  }, [state.is360view]);

  useEffect(() => {
    if (state.showProductInfo && model3d) {
      model3d.showProductInfo(state.showProductInfo);
    }
  }, [state.showProductInfo]);

  return (
    <>
      <div className={styles.Model3dOverlay} ref={model3dOverlay}></div>
      <canvas className={styles.Model3d} ref={canvasRef} />
    </>
  );
}
