import { ToggleButton } from "SpectaclesInteractionKit/Components/UI/ToggleButton/ToggleButton";
import { Interactable } from "SpectaclesInteractionKit/Components/Interaction/Interactable/Interactable";
import { PinchButton } from "SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton";
import { InteractableOutlineFeedback } from "SpectaclesInteractionKit/Components/Helpers/InteractableOutlineFeedback";

@component
export class NewScript extends BaseScriptComponent {
    
    @input private deleteButton: PinchButton;
    @input private noteInteractable: Interactable;
    @input private noteMesh: RenderMeshVisual;
    @input private menuObject : SceneObject;

    private lastHoveredTime: number = -1;
    private timeToShowButtonsAfterHover = 4;
    private outlineFeedback: InteractableOutlineFeedback;
    private editOutlineMaterial: Material;
    private distanceOffset = 60;
    private storage = global.persistentStorageSystem.store;

    onAwake() {
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));

        
    }

    private onStart() {
        this.deleteButton.onButtonPinched.add(() => {
      this.storage.remove(this.sceneObject.name);
      this.sceneObject.enabled = false;
      this.sceneObject.destroy();
      
    });

    this.noteInteractable.onHoverUpdate.add(() => {
         this.lastHoveredTime = getTime();
         });

    }

    private onUpdate() {
    if (getTime() - this.timeToShowButtonsAfterHover < this.lastHoveredTime && this.menuObject.getTransform().getWorldPosition().distance(this.sceneObject.getTransform().getWorldPosition()) > this.distanceOffset) {
      this.deleteButton.getSceneObject().enabled = true;
    } 
    else {
        this.deleteButton.getSceneObject().enabled = false;
    }

    }




}
