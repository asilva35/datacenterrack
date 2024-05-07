import React, { useEffect, useRef, useState, useContext } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import gsap from 'gsap';
import styles from '@/styles/Configurator3d.module.css';
import fragmentShader from '@/shaders/fragment.glsl';
import vertexShader from '@/shaders/vertex.glsl';
import { AppContext } from '@/context/AppContext';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Debug } from '@/debug/Configurator3d';

class Model3dScene {
  constructor(options) {
    this.THREE = THREE;
    this.container = options.dom;
    this.overlay = options.overlay;
    this.debug = options.debug;
    this.config = options.config;
    this.onload = options.onload;
    this.onLoadingProgress = options.onLoadingProgress;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.clock = new this.THREE.Clock();
    this.scene = new this.THREE.Scene();
    this.showPointsInfo = false;

    if (this.config.scene.bgColor)
      this.scene.background = new THREE.Color(this.config.scene.bgColor);

    this.configRenderer();

    this.createCamera();

    this.addObjects();

    this.addPostProcessing();

    this.pointerMoveEvent();

    // Inicia la animación
    this.tick();
  }

  configRenderer() {
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
    this.renderer.toneMappingExposure = this.config.scene.toneMappingExposure;
    this.renderer.shadowMap.enabled = true;
    //this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.shadowMap.type = THREE.VSMShadowMap;
  }

  createCamera() {
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

    this.setCameraHistory({
      position: {
        ...this.config.camera.position,
      },
      target: {
        ...this.config.camera.target,
      },
    });
  }

  setCameraHistory(history) {
    if (!this.cameraHistory) {
      this.cameraHistory = [];
    }
    this.cameraHistory.push(history);
  }

  popCameraHistory() {
    let resp = null;
    if (!this.cameraHistory) {
      return resp;
    }
    if (this.cameraHistory.length === 1) {
      resp = this.cameraHistory[0];
      return resp;
    }
    if (this.cameraHistory.length >= 2) {
      this.cameraHistory.pop();
      resp = this.cameraHistory[this.cameraHistory.length - 1];
      return resp;
    }
  }

  pointerMoveEvent() {
    document.addEventListener('pointermove', this.onPointerMove.bind(this));
    document.addEventListener('click', this.getPointerValue.bind(this));
  }

  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
  }

  getPointerValue() {
    if (!this.server) return;
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    if (intersects.length > 0) {
      //console.log(this.pointer, intersects);
    }
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
    if (this.server) this.server.visible = true;
    if (this.ground) this.ground.visible = true;
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

  degToRadians(deg) {
    return (deg * Math.PI) / 180.0;
  }

  addObjects() {
    const that = this;
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('./assets/draco/');

    const manager = new THREE.LoadingManager();

    manager.onLoad = function () {
      if (that.onload) {
        that.onload();
      }
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      const progress = (itemsLoaded * 100) / itemsTotal;
      that.onLoadingProgress(progress, `Loading Progress: ${progress}%`);
    };

    manager.onError = function (url) {
      console.log('There was an error loading ' + url);
    };

    const gltfLoader = new GLTFLoader(manager);
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
    this.infoPoint01 = null;
    gltfLoader.load(
      './assets/models/datacenter-rack-configurator.glb',
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.name === 'info-point-01') {
            this.infoPoint01 = child;
          }
          if (child.name === 'glass') {
            child.material.color = new THREE.Color(
              this.config.server.glass.color.r,
              this.config.server.glass.color.g,
              this.config.server.glass.color.b
            );
            child.material.opacity = this.config.server.glass.opacity;
            child.material.roughness = this.config.server.glass.roughness;
          }
          if (child.name === 'server-rack') {
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
        this.server.position.set(0, 0, 0);
        this.scene.updateMatrixWorld(true);
        this.server.visible = false;

        // if (this.infoPoint01) {
        //   this.scene.add(this.infoPoint01);
        //   console.log(this.infoPoint01);
        //   var position = new THREE.Vector3();
        //   console.log(this.infoPoint01.position);
        //   //position.setFromMatrixPosition(this.infoPoint01);
        //   // console.log(position.x + ',' + position.y + ',' + position.z);
        // }

        // const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(axesHelper);

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

    if (this.debug) this.addInfoPointsHelpers();
  }

  addInfoPointsHelpers() {
    this.config.products.forEach((product) => {
      if (product.infoPoints) {
        product.infoPoints.forEach((point) => {
          const helper = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxGeometry(0.2, 0.2, 0.2)),
            new THREE.LineBasicMaterial({ color: 0xffff00 })
          );
          helper.position.set(
            point.position.x,
            point.position.y,
            point.position.z
          );
          helper.name = `${point.element}-helper`;
          this.scene.add(helper);
          helper.visible = point.helper;
        });
      }
    });
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
      cube: this.cube,
      environmentMap: this.environmentMap,
    });
  }

  enableControls(is360view) {
    if (is360view) {
      this.overlay.style.display = 'none';
      this.ground.visible = false;
    } else {
      this.overlay.style.display = 'block';
      this.ground.visible = true;
      const previusCameraPosition = this.popCameraHistory();
      if (previusCameraPosition) {
        gsap.to(this.camera.position, {
          ...previusCameraPosition.position,
          duration: 1,
        });
        gsap.to(this.controls.target, {
          ...previusCameraPosition.target,
          duration: 1,
        });
      }
    }
  }

  showProductInfo(showProductInfo) {
    this.showPointsInfo = showProductInfo;
    if (showProductInfo) {
      const newCameraPosition = {
        position: {
          x: 8.142370217469859,
          y: 2.926579226214953,
          z: 2.3138967812666484,
        },
        target: {
          x: -1.2629907825301445,
          y: 2.446571226214952,
          z: -5.000993218733351,
        },
      };
      gsap.to(this.camera.position, {
        ...newCameraPosition.position,
        duration: 1,
      });
      gsap.to(this.controls.target, {
        ...newCameraPosition.target,
        duration: 1,
      });
      this.setCameraHistory(newCameraPosition);
    } else {
      const previusCameraPosition = this.popCameraHistory();
      if (previusCameraPosition) {
        gsap.to(this.camera.position, {
          ...previusCameraPosition.position,
          duration: 1,
        });
        gsap.to(this.controls.target, {
          ...previusCameraPosition.target,
          duration: 1,
        });
      }
    }
  }

  showProductPartInfo(currentInfoPoint, showProductPartInfo) {
    if (!currentInfoPoint) return;
    if (currentInfoPoint.element === 'info-point-01-02') {
      this.showPointsInfo = false;
      if (showProductPartInfo) {
        if (currentInfoPoint.onClick && currentInfoPoint.onClick.camera) {
          const newCameraPosition = {
            position: {
              x: currentInfoPoint.onClick.camera.position.x,
              y: currentInfoPoint.onClick.camera.position.y,
              z: currentInfoPoint.onClick.camera.position.z,
            },
            target: {
              x: currentInfoPoint.onClick.camera.target.x,
              y: currentInfoPoint.onClick.camera.target.y,
              z: currentInfoPoint.onClick.camera.target.z,
            },
          };
          gsap.to(this.camera.position, {
            ...newCameraPosition.position,
          });
          gsap.to(this.controls.target, {
            ...newCameraPosition.target,
          });
          this.setCameraHistory(newCameraPosition);
        }
      } else {
        const previusCameraPosition = this.popCameraHistory();
        if (previusCameraPosition) {
          gsap.to(this.camera.position, {
            ...previusCameraPosition.position,
            duration: 1,
          });
          gsap.to(this.controls.target, {
            ...previusCameraPosition.target,
            duration: 1,
          });
        }
      }
      if (currentInfoPoint.onClick && currentInfoPoint.onClick.animations) {
        this.server.traverse((child) => {
          if (currentInfoPoint.onClick.animations[child.name]) {
            const animation = structuredClone(
              currentInfoPoint.onClick.animations[child.name]
            );
            if (animation.visible === false) {
              child.visible = showProductPartInfo ? false : true;
            } else if (animation.visible === true) {
              child.visible = showProductPartInfo ? true : false;
            }
            if (animation.position) {
              if (!showProductPartInfo) {
                if (animation.position.x) {
                  if (animation.position.x.search('-=') !== -1) {
                    animation.position.x = animation.position.x.replace(
                      '-=',
                      '+='
                    );
                  } else {
                    animation.position.x = animation.position.x.replace(
                      '+=',
                      '-='
                    );
                  }
                }

                if (animation.position.y) {
                  if (animation.position.y.search('-=') !== -1) {
                    animation.position.y = animation.position.y.replace(
                      '-=',
                      '+='
                    );
                  } else {
                    animation.position.y = animation.position.y.replace(
                      '+=',
                      '-='
                    );
                  }
                }

                if (animation.position.z) {
                  if (animation.position.z.search('-=') !== -1) {
                    animation.position.z = animation.position.z.replace(
                      '-=',
                      '+='
                    );
                  } else {
                    animation.position.z = animation.position.z.replace(
                      '+=',
                      '-='
                    );
                  }
                }
              }
              gsap.to(child.position, {
                ...animation.position,
              });
            }
            if (animation.rotation) {
              if (animation.rotation.x)
                animation.rotation.x = showProductPartInfo
                  ? this.degToRadians(animation.rotation.x)
                  : 0;
              if (animation.rotation.y)
                animation.rotation.y = showProductPartInfo
                  ? this.degToRadians(animation.rotation.y)
                  : 0;
              if (animation.rotation.z)
                animation.rotation.z = showProductPartInfo
                  ? this.degToRadians(animation.rotation.z)
                  : 0;
              gsap.to(child.rotation, {
                ...animation.rotation,
              });
            }
          }
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

  renderInfoPoints() {
    if (this.server && this.showPointsInfo) {
      this.config.products.forEach((product) => {
        if (product.infoPoints) {
          product.infoPoints.forEach((point) => {
            const pointPosition = new THREE.Vector3(
              point.position.x,
              point.position.y,
              point.position.z
            );
            const pointElement = document.querySelector(`.${point.element}`);
            const screenPosition = pointPosition.clone();
            screenPosition.project(this.camera);

            this.raycaster.setFromCamera(screenPosition, this.camera);
            const intersects = this.raycaster.intersectObjects(
              this.server.children,
              true
            );
            // No intersect found
            if (intersects.length === 0) {
              // Show
              pointElement.style.opacity = 1;
              pointElement.style.cursor = 'pointer';
              pointElement.style.pointerEvents = 'all';
            } else {
              // Get the distance of the intersection and the distance of the point

              const intersectionDistance = intersects[0].distance;
              const pointDistance = pointPosition.distanceTo(
                this.camera.position
              );

              // Intersection is close than the point
              if (intersectionDistance < pointDistance) {
                // Hide
                pointElement.style.opacity = 0;
                pointElement.style.cursor = 'none';
                pointElement.style.pointerEvents = 'none';
              }
              // Intersection is further than the point
              else {
                // Show
                pointElement.style.opacity = 1;
                pointElement.style.cursor = 'pointer';
                pointElement.style.pointerEvents = 'all';
              }
            }

            let translateX = Math.round(
              screenPosition.x * window.innerWidth * 0.5
            );
            let translateY = Math.round(
              -screenPosition.y * window.innerHeight * 0.5
            );
            translateX -= pointElement.getBoundingClientRect().width * 0.5;
            translateY -= pointElement.getBoundingClientRect().height * 0.5;
            pointElement.style.transform = `translate(${translateX}px, ${translateY}px)`;
          });
        }
      });
    }
  }

  // Función para actualizar la escena
  tick() {
    if (this.controls.enabled) this.controls.update();

    requestAnimationFrame(this.tick.bind(this));

    const elapsedTime = this.clock.getElapsedTime();

    if (this.config.scene.bgMesh.rotation && this.bgMaterial && this.bgMesh) {
      //this.bgMaterial.uniforms.uTime.value = elapsedTime;
      this.bgMesh.rotation.z += 0.001;
    }

    this.renderInfoPoints();

    // Renderiza la escena con la cámara
    this.renderer.render(this.scene, this.camera);

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

  const onLoadModels = () => {
    dispatch({
      type: 'SHOW_3D_MODEL',
      show3DModel: true,
    });
  };

  const onLoadingProgress = (progress, text) => {
    dispatch({
      type: 'SET_LOADING',
      loading: {
        progress,
        text,
      },
    });
  };

  useEffect(() => {
    if (flag.current) return;
    flag.current = true;
    const _model3d = new Model3dScene({
      dom: canvasRef.current,
      overlay: model3dOverlay.current,
      debug,
      config,
      onLoadingProgress: onLoadingProgress,
      onload: onLoadModels,
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
    if (state.show3DModel && model3d) {
      model3d.showProductInfo(state.showProductInfo);
    }
  }, [state.showProductInfo]);

  // useEffect(() => {
  //   if (state.show3DModel && model3d) {
  //     model3d.showProductPartInfo(state.currentInfoPoint);
  //   }
  // }, [state.countInfoPointsClicked]);

  useEffect(() => {
    if (state.show3DModel && model3d) {
      model3d.showProductPartInfo(
        state.currentInfoPoint,
        state.showProductPartInfo
      );
    }
  }, [state.showProductPartInfo]);

  return (
    <>
      <div className={styles.Model3dOverlay} ref={model3dOverlay}></div>
      <canvas className={styles.Model3d} ref={canvasRef} />
    </>
  );
}
