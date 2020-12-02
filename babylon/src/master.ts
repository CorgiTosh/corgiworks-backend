
import * as BABYLON from 'babylonjs';
import * as CANNON from './lib/cannon.js';
import { PhysicsEngine } from 'babylonjs';

class Master {
    private static sceneInstance: BABYLON.Scene;
    private static engineInstance: BABYLON.Engine;
    private static canvasInstance: HTMLCanvasElement;
    private constructor(){}
    
    private static createScene() : BABYLON.Scene {
        console.log("Generating scene");
        var newScene = new BABYLON.Scene(Master.getEngine());
        var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
        var physicsPlugin = new BABYLON.CannonJSPlugin(false, 10, CANNON); // direct injection from /lib/cannon
        newScene.enablePhysics(gravityVector, physicsPlugin);
        physicsPlugin.setTimeStep(1/60);
        console.log("Plugin Timestep: " + physicsPlugin.getTimeStep());
        console.log("Engine Timestep: " + Master.engineInstance.getTimeStep());
        return newScene;
    }
    public static getScene() : BABYLON.Scene {
        if(!Master.sceneInstance) {
            Master.sceneInstance = Master.createScene();
        }
        return Master.sceneInstance;
    }

    private static createEngine() : BABYLON.Engine {
        console.log("Generating Engine");
        return new BABYLON.Engine(Master.getCanvas(), true, {
            preserveDrawingBuffer: true, 
            stencil: true,
            deterministicLockstep: true,
            lockstepMaxSteps: 4
        });
    }
    public static getEngine() : BABYLON.Engine {
        if(!Master.engineInstance) {
            Master.engineInstance = Master.createEngine();
        }
        return Master.engineInstance;
    }

    public static getCanvas() : HTMLCanvasElement {
        if(!Master.canvasInstance) {
            console.log("Generating Canvas");
            Master.canvasInstance = document.getElementById('renderCanvas') as HTMLCanvasElement;
        }
        return Master.canvasInstance;
    }

    // Returns a deltatime factor of the elapsed number of frames and the frames per second
    public static getCompensatedDeltaTime() : number {
        let scene = Master.getScene();
        let dt = scene.deltaTime ?? this.engineInstance.getTimeStep();
        let ar = scene.getAnimationRatio();
        return dt * ar;
    }
}

export { Master };