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

    
    public reset: Boolean;

    
    onAwake(): void {
        // Make collider intangible so it doesn’t block physics but can detect overlaps
        if (this.collider) {
            this.collider.intangible = true;
        }
        this.reset = true;
        if (this.InManip) {
            this.InManip.showTranslationProperties = true;
        }
        // Each time an overlap starts, print a message and reset the collider state
        // this.createEvent("OnStartEvent").bind(() => {
        //     if (this.pinchButton) {
        //         this.pinchButton.onButtonPinched.add(() => {
        //             if (this.widget) {
        //                 this.widget.destroy();
        //             }
        //             print(`I pusha da buttin me dood`);
        //         });
        //     }
        // });

        if (this.collider) {
            this.collider.onOverlapEnter.add((eventArgs: any) => {
                if (this.reset == true) {
                    const otherName: string = eventArgs.overlap.collider
                        .getSceneObject()
                        .name;
                    var result: Boolean
                    result = true;
                    print(`🔶 Overlapped with: ${otherName}`);

                    if (otherName == 'Terrain' && this.InManip) {
                        this.InManip.setCanTranslate(false);
                        this.collider.enabled = false;
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
}