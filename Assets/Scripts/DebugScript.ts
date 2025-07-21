@component
export class NewScript extends BaseScriptComponent {
    onAwake() {

        print(`Terrain has a rotation of ${this.sceneObject.getTransform().getWorldRotation().toEulerAngles().y}`);
        print(`Terrain is at ${this.sceneObject.getTransform().getWorldPosition()}`);
        //print(`Terrain has a scale of ${this.sceneObject.getTransform().getWorldScale()}`);
        
        
    }

}
