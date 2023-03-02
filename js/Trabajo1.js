
// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import { GLTFLoader } from "../lib/GLTFLoader.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";
import { TWEEN } from "../lib/tween.module.min.js";
import { GUI } from "../lib/lil-gui.module.min.js";

// Variables estandar
let renderer, scene, camera;

// Otras globales
let cameraControls, effectController;

// Acciones
init();
loadScene();
setupGUI();
render();

function init() {
    // Instanciar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.getElementById('container').appendChild( renderer.domElement );
    renderer.antialias = true;
    renderer.shadowMap.enabled = true;

    // Instanciar el nodo raiz de la escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5,0.5,0.5);

    // Instanciar la camara
    camera= new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,100);
    camera.position.set(0.5,2,7);
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.target.set(0,1,0);
    camera.lookAt(0,1,0);

    // Luces
    const ambiental = new THREE.AmbientLight(0x222222);
    scene.add(ambiental);
    const direccional = new THREE.DirectionalLight(0xFFFFFF,0.3);
    direccional.position.set(-1,1,-1);
    direccional.castShadow = true;
    scene.add(direccional);
    const puntual = new THREE.PointLight(0xFFFFFF,0.5);
    puntual.position.set(2,7,-4);
    scene.add(puntual);
    const focal = new THREE.SpotLight(0xFFFFFF,0.3);
    focal.position.set(-2,7,4);
    focal.target.position.set(0,0,0);
    focal.angle= Math.PI/7;
    focal.penumbra = 0.3;
    focal.castShadow= true;
    focal.shadow.camera.far = 20;
    focal.shadow.camera.fov = 80;
    scene.add(focal);
    scene.add(new THREE.CameraHelper(focal.shadow.camera));

    // Eventos
    
}

function loadScene() {
    // Material sencillo
    const material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });

    // Suelo
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), material);
    suelo.rotation.x = -Math.PI / 2;
    suelo.position.y = -0.2;
    scene.add(suelo);

    // Importar un modelo en gltf
    const glloader = new GLTFLoader();

    glloader.load('models/city/scene.gltf', function (gltf) {
        gltf.scene.position.y = 1;
        gltf.scene.rotation.y = -Math.PI / 2;
        gltf.scene.name = 'city';
        scene.add(gltf.scene);
        gltf.scene.traverse(ob=>{
            if(ob.isObject3D) ob.castShadow = true;
        })

    }, undefined, function (error) {

        scene.error(error);

    });

    

    /*glloader.load('models/nave/nave.glb', function (gltf) {
        gltf.scene.position.y = 1;
        gltf.scene.rotation.y = -Math.PI / 2;
        gltf.scene.name = 'nave';
        scene.add(gltf.scene);

    }, undefined, function (error) {

        console.error(error);

    });*/

    glloader.load('models/coin/scene.gltf', function (gltf) {
        const city = scene.getObjectByName('city');
        gltf.scene.position.y = 1;
        gltf.scene.rotation.y = -Math.PI / 2;
        gltf.scene.name = 'coin';
        city.add(gltf.scene);
        gltf.scene.traverse(ob=>{
            if(ob.isObject3D) ob.castShadow = true;
        })

    }, undefined, function (error) {

        console.error(error);

    });

}

function setupGUI() {


}

function animate(event) {

}

function update() {

}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}