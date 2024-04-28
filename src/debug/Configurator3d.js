import * as THREE from 'three';
import * as dat from 'dat.gui';

export class Debug {
  constructor(options) {
    this.debugObject = options.debugObject;
    this.camera = options.camera;
    this.ambientLight = options.ambientLight;
    this.lights = options.lights;
    this.bloomPass = options.bloomPass;
    this.renderer = options.renderer;
    this.scene = options.scene;
    this.controls = options.controls;
    this.bgMaterial = options.bgMaterial;
    this.bgMesh = options.bgMesh;
    this.floor = options.floor;
    this.environmentMap = options.environmentMap;

    this.gui = new dat.GUI();

    this.addModalExport();

    this.debugBg();
    this.debugFloor();
    this.debugCamera();
    this.debugLights();
    this.debugBloom();

    this.getCurrentConfig();
  }

  addModalExport() {
    const modal = document.createElement('div');
    const modal_body = document.createElement('div');
    const button_close = document.createElement('button');
    const textarea = document.createElement('textarea');
    modal.id = 'debug_modal_config_export';
    modal_body.id = 'debug_modal_config_export_body';
    button_close.id = 'debug_modal_config_export_button_close';
    button_close.innerHTML = 'Close';
    textarea.id = 'debug_modal_config_export_txt';
    textarea.readOnly = true;
    textarea.resizable = false;
    modal_body.appendChild(textarea);
    modal_body.appendChild(button_close);
    modal.appendChild(modal_body);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      const id = e.target.id;
      if (
        id === 'debug_modal_config_export' ||
        id === 'debug_modal_config_export_button_close'
      ) {
        modal.classList.remove('show');
      }
    });
  }

  debugBg() {
    this.guiBgFolder = this.gui.addFolder('BG');
    this.guiBgFolder
      .addColor(this.debugObject.scene, 'bgColor')
      .onChange((value) => {
        this.scene.background = new THREE.Color(value);
        this.debugObject.scene.bgColor = value;
      });

    this.guiBgFolder
      .add(this.debugObject.scene, 'showEnvironmentMap')
      .onChange((value) => {
        if (value) {
          this.scene.background = this.environmentMap;
          this.scene.environment = this.environmentMap;
        } else {
          this.scene.environment = null;
          this.scene.background = new THREE.Color(
            this.debugObject.scene.bgColor
          );
        }
      });

    const colors = {
      brightness: [
        this.bgMaterial.uniforms.uBrightness.value.r * 255,
        this.bgMaterial.uniforms.uBrightness.value.g * 255,
        this.bgMaterial.uniforms.uBrightness.value.b * 255,
      ],
      contrast: [
        this.bgMaterial.uniforms.uContrast.value.r * 255,
        this.bgMaterial.uniforms.uContrast.value.g * 255,
        this.bgMaterial.uniforms.uContrast.value.b * 255,
      ],
      oscilation: [
        this.bgMaterial.uniforms.uOscilation.value.r * 255,
        this.bgMaterial.uniforms.uOscilation.value.g * 255,
        this.bgMaterial.uniforms.uOscilation.value.b * 255,
      ],
      phase: [
        this.bgMaterial.uniforms.uPhase.value.r * 255,
        this.bgMaterial.uniforms.uPhase.value.g * 255,
        this.bgMaterial.uniforms.uPhase.value.b * 255,
      ],
    };

    this.guiMaterialFolder = this.guiBgFolder.addFolder('Material');

    this.guiMaterialFolder
      .add(this.bgMaterial.uniforms.uFrequency, 'value', 0, 50, 0.01)
      .name('Frequency');

    this.guiMaterialFolder
      .add(this.bgMaterial.uniforms.uAmplitude, 'value', 0, 50, 0.01)
      .name('Amplitude');

    this.guiMaterialFolder
      .add(this.bgMaterial.uniforms.uDensity, 'value', 0, 50, 0.01)
      .name('Density');

    this.guiMaterialFolder
      .add(this.bgMaterial.uniforms.uStrength, 'value', 0, 5, 0.01)
      .name('Strength');

    this.guiMaterialFolder
      .add(this.bgMaterial.uniforms.uDeepPurple, 'value', 0, 1, 0.01)
      .name('Deep Accent');

    this.guiMaterialFolder
      .add(this.bgMaterial.uniforms.uOpacity, 'value', 0, 1, 0.01)
      .name('Opacity');

    this.guiMaterialFolder
      .addColor(colors, 'brightness')
      .onChange((value) => {
        this.bgMaterial.uniforms.uBrightness.value = new THREE.Color(
          value[0] / 255,
          value[1] / 255,
          value[2] / 255
        );
      })
      .name('Brightness');

    this.guiMaterialFolder
      .addColor(colors, 'contrast')
      .onChange((value) => {
        this.bgMaterial.uniforms.uContrast.value = new THREE.Color(
          value[0] / 255,
          value[1] / 255,
          value[2] / 255
        );
      })
      .name('Contrast');

    this.guiMaterialFolder
      .addColor(colors, 'oscilation')
      .onChange((value) => {
        this.bgMaterial.uniforms.uOscilation.value = new THREE.Color(
          value[0] / 255,
          value[1] / 255,
          value[2] / 255
        );
      })
      .name('Oscilation');

    this.guiMaterialFolder
      .addColor(colors, 'phase')
      .onChange((value) => {
        this.bgMaterial.uniforms.uPhase.value = new THREE.Color(
          value[0] / 255,
          value[1] / 255,
          value[2] / 255
        );
      })
      .name('Phase');

    this.guiMaterialFolder
      .add(this.bgMaterial.uniforms.uSpeed, 'value', 0, 20, 1)
      .name('Speed');

    this.guiMaterialFolder.add(this.bgMaterial, 'wireframe').name('Wireframe');

    this.guiMaterialFolder
      .add(this.debugObject.scene.bgMesh, 'rotation')
      .name('Rotation');

    this.guiMaterialFolder
      .add(this.debugObject.scene.bgMesh.scale, 'x', 0, 100, 0.5)
      .onChange((value) => {
        this.bgMesh.scale.x = value;
        this.bgMesh.scale.y = value;
        this.bgMesh.scale.z = value;
      })
      .name('Scale');
  }

  debugFloor() {
    this.guiBgFolder = this.gui.addFolder('Floor');
    this.guiBgFolder
      .addColor(this.debugObject.floor, 'color')
      .onChange((value) => {
        this.floor.material.color = new THREE.Color(value);
      });

    this.guiBgFolder
      .add(this.debugObject.floor, 'roughness', 0, 1, 0.01)
      .onChange((value) => {
        this.floor.material.roughness = value;
      })
      .name('Roughness');

    this.guiBgFolder
      .add(this.debugObject.floor, 'metalness', 0, 1, 0.01)
      .onChange((value) => {
        this.floor.material.metalness = value;
      })
      .name('Metalness');

    this.guiBgFolder
      .add(this.debugObject.floor, 'clearcoat', 0, 1, 0.01)
      .onChange((value) => {
        this.floor.material.clearcoat = value;
      })
      .name('Clearcoat');

    this.guiBgFolder
      .add(this.debugObject.floor, 'clearcoatRoughness', 0, 1, 0.01)
      .onChange((value) => {
        this.floor.material.clearcoatRoughness = value;
      })
      .name('ClearcoatRoughness');
  }

  debugCamera() {
    const that = this;
    /**Debug Camera */
    this.guiFolderCamera = this.gui.addFolder('Camera');
    this.guiFolderCamera
      .add(this.camera.position, 'x', -10, 10, 0.1)
      .name('Position X');
    this.guiFolderCamera
      .add(this.camera.position, 'y', -10, 10, 0.1)
      .name('Position Y');
    this.guiFolderCamera
      .add(this.camera.position, 'z', -10, 30, 0.1)
      .name('Position z');

    this.guiFolderCamera
      .add(this.debugObject.camera.target, 'x', -5, 5, 0.001)
      .name('LookAt X')
      .onChange(() => {
        this.controls.enabled = false;
        this.camera.lookAt(this.debugObject.camera.target);
        this.controls.target.set(
          this.debugObject.camera.target.x,
          this.debugObject.camera.target.y,
          this.debugObject.camera.target.z
        );
        this.controls.enabled = true;
      });
    this.guiFolderCamera
      .add(this.debugObject.camera.target, 'y', -5, 5, 0.001)
      .name('LookAt Y')
      .onChange(() => {
        this.controls.enabled = false;
        this.camera.lookAt(this.debugObject.camera.target);
        this.controls.target.set(
          this.debugObject.camera.target.x,
          this.debugObject.camera.target.y,
          this.debugObject.camera.target.z
        );
        this.controls.enabled = true;
      });
    this.guiFolderCamera
      .add(this.debugObject.camera.target, 'z', -5, 5, 0.001)
      .name('LookAt Z')
      .onChange(() => {
        this.controls.enabled = false;
        this.camera.lookAt(this.debugObject.camera.target);
        this.controls.target.set(
          this.debugObject.camera.target.x,
          this.debugObject.camera.target.y,
          this.debugObject.camera.target.z
        );
        this.controls.enabled = true;
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
  }

  debugLights() {
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
  }

  debugBloom() {
    const that = this;
    //DEBUG BLOOM
    const bloomFolder = this.gui.addFolder('Bloom');

    bloomFolder
      .add(this.debugObject.bloom, 'threshold', 0.0, 1.0, 0.1)
      .onChange(function (value) {
        that.bloomPass.threshold = Number(value);
      });

    bloomFolder
      .add(this.debugObject.bloom, 'strength', 0.0, 3.0, 0.1)
      .onChange(function (value) {
        that.bloomPass.strength = Number(value);
      });

    bloomFolder
      .add(this.debugObject.bloom, 'radius', 0.0, 1.0, 0.1)
      .step(0.01)
      .onChange(function (value) {
        that.bloomPass.radius = Number(value);
      });

    const toneMappingFolder = bloomFolder.addFolder('tone mapping');

    toneMappingFolder
      .add(this.debugObject.bloom, 'exposure', 0.1, 2, 0.1)
      .onChange(function (value) {
        that.renderer.toneMappingExposure = Math.pow(value, 4.0);
      });
  }

  getCurrentConfig() {
    const that = this;

    this.gui.add(
      {
        getCurrentConfig: function () {
          const modal = document.querySelector('#debug_modal_config_export');
          modal.classList.add('show');
          const textarea = modal.querySelector(
            '#debug_modal_config_export_txt'
          );
          textarea.value = JSON.stringify(that.debugObject, null, ' ');
          console.log(that.debugObject);
        },
      },
      'getCurrentConfig'
    );
  }
}
