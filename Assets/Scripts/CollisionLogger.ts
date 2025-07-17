// CollisionLogger.ts
import { InteractableManipulation } from "SpectaclesInteractionKit/Components/Interaction/InteractableManipulation/InteractableManipulation"
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { PinchButton } from "SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton";



@component
export class CollisionLogger extends BaseScriptComponent {
    // Trigger collider for manual overlap detection
    @input
    public collider: ColliderComponent;
    
    @input
    public scriptObj: ScriptComponent;
    
    @input
    public InManip: InteractableManipulation;


    @input
    public anchorObj: SceneObject;

    public reset: Boolean;
    public store = global.persistentStorageSystem.store;
    public positionKey = this.sceneObject.name;

    
    onAwake(): void {
        // Make collider intangible so it doesn’t block physics but can detect overlaps
        if (this.collider) {
            this.collider.intangible = true;
        }
        this.reset = true;
        if (this.InManip) {
            this.InManip.showTranslationProperties = true;
        }
        if (this.store.has(this.positionKey)) {
            let savedRelative = this.store.getVec3(this.positionKey);
            let anchorPos = this.anchorObj.getTransform().getWorldPosition();
            let worldPos = new vec3(
                savedRelative.x + anchorPos.x,
                savedRelative.y + anchorPos.y,
                savedRelative.z + anchorPos.z
            );
            this.getTransform().setWorldPosition(worldPos);
        }

        if (this.collider) {
            this.collider.onOverlapEnter.add((eventArgs: any) => {
                if (this.reset == true) {
                    const otherName: string = eventArgs.overlap.collider
                        .getSceneObject()
                        .name;
                    var result: Boolean
                    result = true;
                    print(`🔶 Overlapped with: ${otherName}`);
                    print(`Anchor is at ${this.anchorObj.getTransform().getWorldPosition()}`);
                    print(`Anchor has a rotation of ${this.anchorObj.getTransform().getWorldRotation().toEulerAngles().y}`);

                    if (otherName == 'Terrain' && this.InManip) {
                        this.InManip.setCanTranslate(false);
                        this.collider.enabled = false;

                        let localPos = this.getTransform();
                        let anchorPos = this.anchorObj.getTransform();
                        let relativePos = new vec3(
                            localPos.getWorldPosition().x - anchorPos.getWorldPosition().x,
                            localPos.getWorldPosition().y - anchorPos.getWorldPosition().y,
                            localPos.getWorldPosition().z - anchorPos.getWorldPosition().z
                        );
                        this.store.remove(this.positionKey);
                        this.store.putVec3(this.positionKey, relativePos);
                    }

                    if (this.InManip) {
                        result = this.InManip.canTranslate();
                        print(result);
                    }

                    // Reset the collider to allow the same object to trigger again
                    this.reset = false;
                }
            });

            this.collider.onOverlapExit.add((eventArgs: any) => {
                if (this.reset == false) {
                    const otherName: string = eventArgs.overlap.collider
                        .getSceneObject()
                        .name;
                    print(`🔶 Stopped Overlap with: ${otherName}`);

                    // Reset the collider to allow the same object to trigger again
                    this.reset = true;
                }
            });
        }
    }

    startPlacement() {

        print(`Starting placement`);
    }
}