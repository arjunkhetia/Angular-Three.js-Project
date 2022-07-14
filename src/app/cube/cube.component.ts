import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss'],
})
export class CubeComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  // Cube Properties
  @Input() public rotationSpeedX: number = 0.03;
  @Input() public rotationSpeedY: number = 0.01;
  @Input() public size: number = 200;
  @Input() public texture: string = 'assets/texture.jpg';

  // Stage Properties
  @Input() public cameraZ: number = 3;
  @Input() public fieldOfView: number = 400;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1000;

  // Helper Properties
  private camera!: THREE.PerspectiveCamera;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private loader = new THREE.TextureLoader();
  // private geometry = new THREE.BoxGeometry(1, 1, 1);
  private geometry = new THREE.SphereGeometry();
  // private material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });
  // private material = new THREE.MeshBasicMaterial({ color: 0xFF8001, wireframe: true, });
  private material = new THREE.MeshNormalMaterial({ wireframe: true });
  // private material = new THREE.MeshBasicMaterial({
  //   color: 0x00ff00,
  //   wireframe: true,
  // });
  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  // Create the scene
  private createScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.add(this.cube);

    // Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  // Animate the cube
  private animateCube() {
    // this.stats.begin();
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
    // this.stats.end();
  }

  // Start the rendering loop
  private startRenderingLoop() {
    // Renderer - Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: CubeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
      component.stats.update();
    })();
  }

  // Orbit Controls
  private controls!: OrbitControls;

  // Stats
  private stats: Stats = Stats();

  // GUI
  private gui: GUI = new GUI();
  private cubeRotationFolder = this.gui.addFolder('Rotation');
  private cubePositionFolder = this.gui.addFolder('Position');
  private cubeScaleFolder = this.gui.addFolder('Scale');
  private cameraFolder = this.gui.addFolder('Camera');

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    document.body.appendChild(this.stats.dom);
    this.cubeRotationFolder.add(this.cube.rotation, 'x', 0, Math.PI * 2);
    this.cubeRotationFolder.add(this.cube.rotation, 'y', 0, Math.PI * 2);
    this.cubeRotationFolder.add(this.cube.rotation, 'z', 0, Math.PI * 2);
    this.cubeRotationFolder.open();
    this.cubePositionFolder.add(this.cube.position, 'x', -10, 10, 2);
    this.cubePositionFolder.add(this.cube.position, 'y', -10, 10, 2);
    this.cubePositionFolder.add(this.cube.position, 'z', -10, 10, 2);
    this.cubePositionFolder.open();
    this.cubeScaleFolder.add(this.cube.scale, 'x', -5, 5);
    this.cubeScaleFolder.add(this.cube.scale, 'y', -5, 5);
    this.cubeScaleFolder.add(this.cube.scale, 'z', -5, 5);
    this.cubeScaleFolder.open();
    this.cameraFolder.add(this.camera.position, 'z', -10, 10);
    this.cameraFolder.open();
    this.gui.add(this.cube, 'visible');
  }
}
