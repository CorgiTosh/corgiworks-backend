import * as BABYLON from 'babylonjs';
import { Master } from './master'

class InventoryWheelSlot {
    root = new BABYLON.Mesh("_invw_slot_root", Master.getScene())
    index : number;

    constructor(public name: string, public mesh:BABYLON.Mesh) {
        if(mesh.parent) {
            console.warn("Mesh assigned to inventory wheel already had a parent.")
        }
        mesh.parent = this.root;
    }

    get rootAngle() : number {
        return Math.atan2(this.root.position.z, this.root.position.x);
    }
    
    // When the item is placed in the inventory for the first time
    insert(): void {

    }
    // Select the item, playing an animation
    select() : void {

    }
    // Deselect the item
    deselect(): void {

    }
}

class InventoryWheel {

    // root
    // └── target
    // └── pivot
    //     ├── slot_root
    //     │   └── item_mesh
    //     ├── slot_root
    //     │   └── item_mesh
    //     └── slot_root
    //         └── item_mesh

    public root : BABYLON.TransformNode = new BABYLON.TransformNode("_invw_root", Master.getScene());
    private pivot : BABYLON.TransformNode = new BABYLON.TransformNode("_invw_pivot", Master.getScene());
    private target : BABYLON.TransformNode = new BABYLON.TransformNode("_invw_target", Master.getScene());
    
    private items : InventoryWheelSlot[] = [];
    private selectedIndex: number = 0;
    private radius: number = 4;

    private angleStep: number;
    private startAngle: number; // Angle at the start of the tilt animation
    private targetAngle: number;

    private easingFunction = new BABYLON.CubicEase();
    private timeToTargetInMs = 500; 
    private currentEasingTimer = 0;

    constructor() {
        var self = this;

        // Set up parenting
        this.pivot.parent = this.root;

        // Set up animations
        this.easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

        // TODO move this to global logic
        Master.getScene().onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch(kbInfo.event.key) {
                    case 'a':
                        this.selectPrevious();
                        break;
                    case 'd':
                        this.selectNext();
                        break;
                    break;
                }
                case BABYLON.KeyboardEventTypes.KEYUP:
                    break;
            }
        });

        // Set up hooks
        // Master.getScene().onBeforeStepObservable.add(this.fixedUpdate);
        
        Master.getScene().onBeforeRenderObservable.add(()=>self.update());
    }

    private moveTarget(newAngle:number) : void {
        this.startAngle = this.pivot.rotation.y;
        this.targetAngle = newAngle;
        this.currentEasingTimer = 0;
    }
    
    private update() : void {
        let step = Master.getCompensatedDeltaTime();
        this.currentEasingTimer += step;
        let ratio = Math.min(this.currentEasingTimer / this.timeToTargetInMs, 1);
        let easingFactor = this.easingFunction.ease(ratio);
        this.pivot.rotation.y = this.startAngle + (this.targetAngle - this.startAngle) * easingFactor;
    }


    private updateLayout() {
        // Find angle interval
        this.angleStep = (Math.PI * 2.0) / this.items.length;

        // Loop around item slots and place them at a [radius] distance
        for (let i in this.items) {
            let index = parseInt(i);
            let currentItem = this.items[index];
            let angle = index * this.angleStep;

            currentItem.index = index;
            currentItem.root.position.x = this.radius * Math.cos(angle);
            currentItem.root.position.z = this.radius * Math.sin(angle);
        }
    }

    // Add a new inventory item
    push(name: string, mesh: BABYLON.Mesh, skipInsertAnimation? : boolean) : void {
        let itemSlot = new InventoryWheelSlot(name, mesh);
        itemSlot.root.parent = this.pivot;
        this.items.push(itemSlot);
        this.updateLayout();

        if(!skipInsertAnimation) {
            itemSlot.insert();
        }
    }

    // Opens up the inventory
    open() : void {
        // TODO: Play an animation on opening
    }
    // Closes the inventory
    close(): void {
        // TODO: Play an animation on closing
    }
    // Suspends the inventory when an option is selected for instance
    suspend(): void {
        
    }
    
    // Select with its slot index
    selectByIndex(targetIndex: number) : void {

        let newIndex = targetIndex % this.items.length;
        while(newIndex < 0) {
            newIndex = newIndex + this.items.length;
        }
        let newTargetAngle = this.items[newIndex].rootAngle;
        
        let direction = newTargetAngle - this.targetAngle;
        let effectiveDistance = Math.abs(direction);
        let remainingDistance = (Math.PI * 2.0) - effectiveDistance;
        if (effectiveDistance > remainingDistance) {
            let directionSign = direction > 0 ? -1 : 1;
            let newdist : number;
            do {
                newTargetAngle += Math.PI * 2 * directionSign;
                newdist = Math.abs(newTargetAngle - this.targetAngle)
            } while(newdist > Math.PI)
            
            console.log(`Compensating distances: ${effectiveDistance} vs ${newdist}`);
        }
        var dir = direction > 0 ? "Right" : "Left";
        // console.log(`Distances: ${effectiveDistance}, ${remainingDistance}`)
        console.log(`Rotating right @ ${newIndex} / P. Target ${this.items[newIndex].rootAngle} / C. Target ${newTargetAngle} / Dir ${dir}`)
        // this.selectedIndex = targetIndex % this.items.length;
        // let newTargetAngle = this.getTargetAngle(targetIndex);
        this.selectedIndex = newIndex;
        this.moveTarget(newTargetAngle);
        // let anim = new BABYLON.Animation("rotate", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        // let keys = [
        //     {frame:0, value: 0},
        //     {frame:30, value: targetAngle}
        // ];
        // anim.setKeys(keys);
        // this.target.animations = [ anim ];
        // Master.getScene().beginAnimation(this.target, 0, 30, false);
    }
    // Move the inventory to the selected item, by name
    selectByName(name: string) : void {
        // TODO lookup index by name and use selectByIndex
    }
    // Move the inventory to the previous item
    selectPrevious() : void {
        this.selectByIndex(this.selectedIndex - 1);
    }
    // Move the inventory to the next item
    selectNext() : void {
        this.selectByIndex(this.selectedIndex + 1);
    }
}

export { InventoryWheel }