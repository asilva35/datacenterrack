import React, { useEffect, useRef, useState, useContext } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

class Model3dScene {
  constructor(options) {
    const that = this;
    this.THREE = THREE;
    this.container = options.dom;
    this.overlay = options.overlay;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.scene = new this.THREE.Scene();

    // Crea una cámara
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 0, 5);

    this.camera.lookAt(new this.THREE.Vector3(0, 0, 0));

    // Crea un renderizador
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1;
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
    this.controls.target.set(0, 0, 0);
    this.controls.enabled = true;

    this.clock = new this.THREE.Clock();

    this.addObjects();

    this.pointerMoveEvent();

    // Inicia la animación
    this.tick();
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
      console.log(this.pointer, intersects);
    }
  }

  color(r, g, b) {
    return new THREE.Color(r / 255, g / 255, b / 255);
  }

  addObjects() {
    const that = this;
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('./assets/draco/');

    this.infoPoint = {
      x: 0,
      y: 0.8,
      z: 0.6,
    };

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.scene.add(this.cube);
    this.cube.position.set(0, 0, 0);

    this.cube02 = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    this.scene.add(this.cube02);
    this.cube02.position.set(
      this.infoPoint.x,
      this.infoPoint.y,
      this.infoPoint.z
    );
  }

  // Función para actualizar la escena
  tick() {
    if (this.controls.enabled) this.controls.update();

    requestAnimationFrame(this.tick.bind(this));

    const elapsedTime = this.clock.getElapsedTime();

    //var position = new THREE.Vector3();
    //position.setFromMatrixPosition(this.server.matrixWorld);
    //console.log(position.x + ',' + position.y + ',' + position.z);

    const pointElement = document.querySelector('#infoPoint');
    const screenPosition = new THREE.Vector3(
      this.infoPoint.x,
      this.infoPoint.y,
      this.infoPoint.z
    );
    screenPosition.project(this.camera);
    console.log(screenPosition);

    // this.raycaster.setFromCamera(screenPosition,this.camera);
    // const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    // console.log(intersects);

    const translateX = screenPosition.x * window.innerWidth * 0.5;
    const translateY = -screenPosition.y * window.innerHeight * 0.5;
    //translate(670px,235px)
    //console.log(translateX);

    //transform: translateX(364.6791px) translateY(-305.636px);
    //console.log(window.innerWidth, window.innerHeight);
    //pointElement.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;

    // Renderiza la escena con la cámara
    this.renderer.render(this.scene, this.camera);
  }
}

export default function Configurator3d(props) {
  const canvasRef = useRef();
  const flag = useRef();
  const [model3d, setModel3D] = useState(null);
  useEffect(() => {
    if (flag.current) return;
    flag.current = true;
    const _model3d = new Model3dScene({
      dom: canvasRef.current,
    });
    document.model3d = _model3d;
    setModel3D(_model3d);
    return () => {
      _model3d.renderer.dispose();
    };
  }, []);
  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </>
  );
}
