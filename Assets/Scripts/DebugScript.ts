@component
export class NewScript extends BaseScriptComponent {
    onAwake() {
            //simple debug script that can be attached to any object to print its position and rotation
        print(`${this.sceneObject.name} has a rotation of ${this.sceneObject.getTransform().getWorldRotation().toEulerAngles().y}`);
        print(`${this.sceneObject.name} is at ${this.sceneObject.getTransform().getWorldPosition()}`);
        //print(`Terrain has a scale of ${this.sceneObject.getTransform().getWorldScale()}`);
        
        
    }

}
