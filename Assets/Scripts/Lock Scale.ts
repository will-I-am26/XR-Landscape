import { InteractableManipulation } from "SpectaclesInteractionKit/Components/Interaction/InteractableManipulation/InteractableManipulation"
import { PinchButton } from "SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton";

@component
export class LockScale extends BaseScriptComponent {

    @input public stuff: SceneObject[];
    @input public interactables: InteractableManipulation[];
    @input private lockButton: PinchButton;

    public reset: Boolean;
    public holder: Boolean;

    onAwake() {

        this.reset = true;

        this.lockButton.createEvent("TapEvent").bind(() => {

            if (this.reset) {
                this.interactables.forEach(obj => {
                    obj.setCanScale(false);
                    print(`File name: ${obj.name}`);
                });
                print('Locked Scale');
                this.reset = false;
            }
            else if (!this.reset) {
                this.interactables.forEach(obj => {
                    obj.setCanScale(true);
                    print(`File name: ${obj.name}`);
                });
                print('Unlocked Scale');
                this.reset = true;
            }


        });

    }
}
