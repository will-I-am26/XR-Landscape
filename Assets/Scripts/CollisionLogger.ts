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
    private storage = global.persistentStorageSystem.store


    onAwake(): void {
        // Make collider intangible so it doesn’t block physics but can detect overlaps
        if (this.collider) {
            this.collider.intangible = true;
        }
        this.reset = true;
        if (this.InManip) {
            this.InManip.showTranslationProperties = true;
        }


        if (this.collider) {
            this.collider.onOverlapEnter.add((eventArgs: any) => {
                if (this.reset == true) {
                    const otherName: string = eventArgs.overlap.collider
                        .getSceneObject()
                        .name;
                    var result: Boolean
                    result = true;

                    //debug printing
                    print(`🔶 Overlapped with: ${otherName}`);
                    print(`${this.sceneObject.name} is at: ${this.getTransform().getWorldPosition()}`);
                    print(`${this.sceneObject.name} has a rotation of ${this.getTransform().getWorldRotation().toEulerAngles().y}`);
                    print(`Anchor is at ${this.anchorObj.getTransform().getWorldPosition()}`);
                    print(`Anchor has a rotation of ${this.anchorObj.getTransform().getWorldRotation().toEulerAngles().y}`);
                    //logic for collision detection, ineteractability disabling and offset storage
                    if (otherName == 'Terrain' && this.InManip) {
                        this.InManip.setCanTranslate(false);
                        this.collider.enabled = false;

                        let originalParent = this.sceneObject.getParent()
                        this.sceneObject.setParent(this.anchorObj)

                        // Get the local position (this is the correct offset)
                        let relativePos = this.getTransform().getLocalPosition()

                        // Restore the original parent
                        this.sceneObject.setParent(originalParent)

                        // Store the offset
                        let positionKey = this.sceneObject.name
                        this.storage.remove(positionKey)
                        this.storage.putVec3(positionKey, relativePos)
                    }

                    //debug printing for interactability
                    if (this.InManip) {
                        result = this.InManip.canTranslate();
                        print(result);
                    }

                    // Reset the collider to allow the same object to trigger again, this is for debugging, mostly
                    this.reset = false;
                }
            });
            //debug section for overlap exit
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

}