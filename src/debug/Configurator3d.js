import * as THREE from 'three';
import * as dat from 'dat.gui';

export class Debug {
  constructor(options) {
    this.debugObject = options.debugObject;
    this.camera = options.camera;
    this.bloomPass = options.bloomPass;
    this.bokehPass = options.bokehPass;
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
    this.debugServer();
    this.debugFloor();
    this.debugCamera();
    this.debugLights();
    this.debugBloom();
    this.debugBokeh();

    this.getCurrentConfig();
  }

  addModalExport() {
    const modal = document.createElement('div');
    const modal_body = document.createElement('div');
    const modal_actions = document.createElement('div');
    const button_close = document.createElement('button');
    const button_copy = document.createElement('button');
    const textarea = document.createElement('textarea');
    modal.id = 'debug_modal_config_export';
    modal_body.id = 'debug_modal_config_export_body';
    modal_actions.id = 'debug_modal_config_export_actions';
    button_close.id = 'debug_modal_config_export_button_close';
    button_close.innerHTML = 'Close';
    button_copy.id = 'debug_modal_config_export_button_copy';
    button_copy.innerHTML = 'Copy';
    textarea.id = 'debug_modal_config_export_txt';
    textarea.readOnly = true;
    textarea.resizable = false;
    modal_body.appendChild(textarea);
    modal_actions.appendChild(button_copy);
    modal_actions.appendChild(button_close);
    modal_body.appendChild(modal_actions);
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
      if (id === 'debug_modal_config_export_button_copy') {
        var copyText = document.getElementById('debug_modal_config_export_txt');

        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);

        // Alert the copied text
        alert('Copied to clipboard');
      }
    });
  }

  debugBg() {
    this.guiBgFolder = this.gui.addFolder('BG');
    if (this.debugObject.scene.bgColor) {
      this.guiBgFolder
        .addColor(this.debugObject.scene, 'bgColor')
        .onChange((value) => {
          this.scene.background = new THREE.Color(value);
          this.debugObject.scene.bgColor = value;
        });
    }

    this.guiBgFolder
      .add(this.debugObject.scene, 'toneMappingExposure', 0, 64, 0.1)
      .onChange((value) => {
        this.renderer.toneMappingExposure = value;
      })
      .name('Tone Mapping Exposure');

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
      color: [
        this.bgMaterial.uniforms.uColor.value.r * 255,
        this.bgMaterial.uniforms.uColor.value.g * 255,
        this.bgMaterial.uniforms.uColor.value.b * 255,
      ],
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
      .addColor(colors, 'color')
      .onChange((value) => {
        this.bgMaterial.uniforms.uColor.value = new THREE.Color(
          value[0] / 255,
          value[1] / 255,
          value[2] / 255
        );
      })
      .name('Color');

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

  debugServer() {
    const folder = this.gui.addFolder('Server');

    const folderPoints = folder.addFolder('Points');
    folderPoints
      .add(
        this.debugObject.products[0].infoPoints[0].position,
        'x',
        -10,
        10,
        0.001
      )
      .onChange((value) => {
        const point = this.debugObject.products[0].infoPoints[0];
        const pointElement = document.querySelector(`.${point.element}`);
        const screenPosition = new THREE.Vector3(
          value,
          point.position.y,
          point.position.z
        );
        screenPosition.project(this.camera);
        const translateX = screenPosition.x * window.innerWidth * 0.5;
        const translateY = -screenPosition.y * window.innerHeight * 0.5;
        pointElement.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      });

    folderPoints
      .add(
        this.debugObject.products[0].infoPoints[0].position,
        'y',
        -10,
        10,
        0.001
      )
      .onChange((value) => {
        const point = this.debugObject.products[0].infoPoints[0];
        const pointElement = document.querySelector(`.${point.element}`);
        const screenPosition = new THREE.Vector3(
          point.position.x,
          value,
          point.position.z
        );
        screenPosition.project(this.camera);
        const translateX = screenPosition.x * window.innerWidth * 0.5;
        const translateY = -screenPosition.y * window.innerHeight * 0.5;
        pointElement.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      });

    folderPoints
      .add(
        this.debugObject.products[0].infoPoints[0].position,
        'z',
        -10,
        10,
        0.001
      )
      .onChange((value) => {
        const point = this.debugObject.products[0].infoPoints[0];
        const pointElement = document.querySelector(`.${point.element}`);
        const screenPosition = new THREE.Vector3(
          point.position.x,
          point.position.y,
          value
        );
        screenPosition.project(this.camera);
        const translateX = screenPosition.x * window.innerWidth * 0.5;
        const translateY = -screenPosition.y * window.innerHeight * 0.5;
        pointElement.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      });

    this.scene.traverse((child) => {
      if (child.name === 'server-rack-glass-window01') {
        const folderGlass = folder.addFolder('Glass');
        folderGlass
          .addColor(this.debugObject.server.glass, 'color')
          .onChange((value) => {
            child.material.color = new THREE.Color(value.r, value.g, value.b);
          });

        folderGlass
          .add(this.debugObject.server.glass, 'opacity', 0, 1, 0.001)
          .onChange((value) => {
            child.material.opacity = value;
          })
          .name('Opacity');

        folderGlass
          .add(this.debugObject.server.glass, 'roughness', 0, 1, 0.001)
          .onChange((value) => {
            child.material.roughness = value;
          })
          .name('Roughness');
      }
      if (child.name === 'logo-rack') {
        const folderLogo = folder.addFolder('Logo');
        console.log(child.material);
        folderLogo
          .add(child.material, 'roughness', 0, 1, 0.001)
          .onChange((value) => {
            child.material.roughness = value;
          })
          .name('Roughness');
        folderLogo
          .add(child.material, 'metalness', 0, 1, 0.001)
          .onChange((value) => {
            child.material.metalness = value;
          })
          .name('Metalness');
      }
    });
  }

  debugFloor() {
    if (this.debugObject.floor && this.debugObject.floor.active) {
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
  }

  debugCamera() {
    const that = this;
    /**Debug Camera */
    this.guiFolderCamera = this.gui.addFolder('Camera');
    this.guiFolderCamera
      .add(this.debugObject.camera, 'fov', 0, 800, 1)
      .onChange((value) => {
        this.camera.fov = value;
        this.scene.updateMatrixWorld(true);
      })
      .name('FOV');

    this.guiFolderCamera
      .add(this.debugObject.camera, 'near', 0, 1000, 1)
      .onChange((value) => {
        this.camera.near = value;
        this.scene.updateMatrixWorld(true);
      })
      .name('Near');

    this.guiFolderCamera
      .add(this.debugObject.camera, 'far', 0, 1000, 1)
      .onChange((value) => {
        this.camera.far = value;
        this.scene.updateMatrixWorld(true);
      })
      .name('Far');

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
    if (this.debugObject.lights && this.debugObject.lights.length > 0) {
      this.guiFolderLights = this.gui.addFolder('Lights');
      this.debugObject.lights.forEach((l) => {
        if (l.type === 'AmbientLight') {
          this.scene.traverse((child) => {
            if (child.name === l.name) {
              const color = {
                value: [
                  child.color.r * 255,
                  child.color.g * 255,
                  child.color.b * 255,
                ],
              };
              const folderAmbientLight =
                this.guiFolderLights.addFolder('Ambient Light');
              folderAmbientLight.add(child, 'visible').name('Visible');
              folderAmbientLight
                .add(child, 'intensity', 0, 50, 0.1)
                .name('Intensity');
              folderAmbientLight
                .addColor(color, 'value')
                .onChange((value) => {
                  child.color = new THREE.Color(
                    value[0] / 255,
                    value[1] / 255,
                    value[2] / 255
                  );
                })
                .name('Color');
            }
          });
        }
        if (l.type === 'DirectionalLight') {
          this.scene.traverse((child) => {
            if (child.name === l.name) {
              const color = {
                value: [
                  child.color.r * 255,
                  child.color.g * 255,
                  child.color.b * 255,
                ],
              };
              const folderLight = this.guiFolderLights.addFolder(l.label);
              folderLight.add(child, 'visible').name('Visible');
              folderLight
                .add(l, 'helper')
                .onChange((value) => {
                  this.scene.traverse((_child) => {
                    if (_child.name === l.name + 'Helper') {
                      _child.visible = value;
                    }
                  });
                })
                .name('Helper');
              folderLight.add(child, 'intensity', 0, 50, 0.1).name('Intensity');
              folderLight
                .addColor(color, 'value')
                .onChange((value) => {
                  child.color = new THREE.Color(
                    value[0] / 255,
                    value[1] / 255,
                    value[2] / 255
                  );
                })
                .name('Color');

              folderLight.add(child, 'castShadow').name('Cast Shadow');
              folderLight
                .add(child.shadow.camera, 'far', 0, 1000, 0.1)
                .name('Camera Far');
              folderLight
                .add({ x: Math.log2(child.shadow.mapSize.x) }, 'x', 1, 12, 1)
                .onChange((value) => {
                  child.shadow.mapSize.x = Math.pow(2, value);
                })
                .name('Map Size X');
              folderLight
                .add({ y: Math.log2(child.shadow.mapSize.y) }, 'y', 1, 12, 1)
                .onChange((value) => {
                  child.shadow.mapSize.y = Math.pow(2, value);
                })
                .name('Map Size Y');
              folderLight
                .add(child.shadow, 'normalBias', 0, 1, 0.01)
                .name('Normal Bias');
              folderLight
                .add(child.position, 'x', -100, 100, 0.1)
                .name('Position X');
              folderLight
                .add(child.position, 'y', -100, 100, 0.1)
                .name('Position Y');
              folderLight
                .add(child.position, 'z', -100, 100, 0.1)
                .name('Position Z');

              folderLight.add(child.scale, 'x', 0, 5, 0.1).name('Scale X');
              folderLight.add(child.scale, 'y', 0, 5, 0.1).name('Scale Y');
              folderLight.add(child.scale, 'z', 0, 5, 0.1).name('Scale Z');

              folderLight
                .add(child.rotation, 'x', -Math.PI, Math.PI, 0.1)
                .name('Rotation X');
              folderLight
                .add(child.rotation, 'y', -Math.PI, Math.PI, 0.1)
                .name('Rotation Y');
              folderLight
                .add(child.rotation, 'z', -Math.PI, Math.PI, 0.1)
                .name('Rotation Z');
            }
          });
        }
      });
    }
    // this.guiFolderLights = this.gui.addFolder('Lights');
    // const folderAmbientLight = this.guiFolderLights.addFolder('Ambient Light');
    // folderAmbientLight.add(this.ambientLight, 'visible').name('Visible');
    // folderAmbientLight
    //   .add(this.ambientLight, 'intensity', 0, 50, 0.1)
    //   .name('Intensity');
    // //folderAmbientLight.add(this.ambientLight, 'color').name('Color');
    // this.lights.forEach((light, index) => {
    //   const folderLight = this.guiFolderLights.addFolder(`Light ${index + 1}`);
    //   folderLight.add(light.helper, 'visible').name('Helper');
    //   folderLight.add(light.light, 'intensity', 0, 5, 0.05).name('Intensity');
    //   folderLight
    //     .add(light.light.position, 'x', -50, 50, 0.1)
    //     .name('Position X');
    //   folderLight
    //     .add(light.light.position, 'y', -50, 50, 0.1)
    //     .name('Position Y');
    //   folderLight
    //     .add(light.light.position, 'z', -50, 50, 0.1)
    //     .name('Position Z');
    //   folderLight.add(light.light.scale, 'x', 0, 5, 0.1).name('Scale X');
    //   folderLight.add(light.light.scale, 'y', 0, 5, 0.1).name('Scale Y');
    //   folderLight.add(light.light.scale, 'z', 0, 5, 0.1).name('Scale Z');
    //   folderLight
    //     .add(light.light.rotation, 'x', -Math.PI, Math.PI, 0.1)
    //     .name('Rotate X');
    //   folderLight
    //     .add(light.light.rotation, 'y', -Math.PI, Math.PI, 0.1)
    //     .name('Rotate Y');
    //   folderLight
    //     .add(light.light.rotation, 'z', -Math.PI, Math.PI, 0.1)
    //     .name('Rotate Z');
    // });
    // this.guiFolderLights.close();
  }

  debugBloom() {
    if (!this.debugObject.bloom || !this.debugObject.bloom.active) return;
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

  debugBokeh() {
    const that = this;

    if (!this.debugObject.bokeh || !this.debugObject.bokeh.active) return;

    //DEBUG BLOOM
    const folder = this.gui.addFolder('Bokeh');

    folder
      .add(this.debugObject.bokeh, 'focus', 0.0, 300.0, 0.1)
      .onChange(function (value) {
        that.bokehPass.uniforms['focus'].value = Number(value);
      });

    folder
      .add(that.debugObject.bokeh, 'aperture', 0.0, 0.001, 0.00001)
      .onChange(function (value) {
        that.bokehPass.uniforms['aperture'].value = Number(value);
      });

    folder
      .add(that.debugObject.bokeh, 'maxblur', 0.0, 0.1, 0.001)
      .onChange(function (value) {
        that.bokehPass.uniforms['maxblur'].value = Number(value);
      });
  }

  getCurrentConfig() {
    const that = this;

    this.gui
      .add(
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
      )
      .name('Show Config');
  }
}
