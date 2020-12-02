import * as BABYLON from 'babylonjs';
import { InventoryWheel } from './wheel';
import { Master } from './master';

let canvas = Master.getCanvas();
let engine = Master.getEngine();
let scene = Master.getScene();


var createScene = function(){
    
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    
    let items = new InventoryWheel(); 

    for (let i = 0; i < 10; i++) {
        let mesh = BABYLON.MeshBuilder.CreateIcoSphere("sup", {}, Master.getScene()); 
        items.push("item"+i, mesh, false);

        var select = 0;
        if(i == select) {
            items.selectByIndex(select);
            mesh.material = new BABYLON.StandardMaterial("mat", Master.getScene());
            (mesh.material as BABYLON.StandardMaterial).diffuseColor = BABYLON.Color3.Green();
        }
    }
    items.root.rotation.y = Math.PI * 0.5;

        // // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

        // // Move the sphere upward 1/2 its height
        // sphere.position.y = 2;
    
        // // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        // var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

        // sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
	    // ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

    // var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
    return scene;
}

createScene();
engine.runRenderLoop(function(){
    scene.render();
});
window.addEventListener('resize', function(){
    engine.resize();
});