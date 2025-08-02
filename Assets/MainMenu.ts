import { PinchButton } from "SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton";


@component
export class NewScript extends BaseScriptComponent {

    @input
    private startPinch: PinchButton

    @input
    private startButton: SceneObject

    @input
    private deletePinch: PinchButton

    @input
    private deleteButton: SceneObject

    @input
    private confirmPinch: PinchButton

    @input
    private confirmButton: SceneObject

    @input
    private cancelPinch: PinchButton

    @input
    private cancelButton: SceneObject

    @input
    private confirmText: SceneObject


    @input
    private menuObject: SceneObject

    @input
    private surfacePlacementObject: SceneObject



    onAwake() {
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        //this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    private onStart() {
        this.startPinch.onButtonPinched.add(() => {
            this.menuObject.enabled = false;
            this.surfacePlacementObject.enabled = true;
        });

        this.deletePinch.onButtonPinched.add(() => {
            this.startButton.enabled = false;
            this.deleteButton.enabled = false;
            this.confirmButton.enabled = true;
            this.cancelButton.enabled = true;
            this.confirmText.enabled = true
        });

        this.confirmPinch.onButtonPinched.add(() => {
            this.startButton.enabled = true;
            this.deleteButton.enabled = true;
            this.confirmButton.enabled = false;
            this.cancelButton.enabled = false;
            this.confirmText.enabled = false;
        });

        this.cancelPinch.onButtonPinched.add(() => {
            this.startButton.enabled = true;
            this.deleteButton.enabled = true;
            this.confirmButton.enabled = false;
            this.cancelButton.enabled = false;
            this.confirmText.enabled = false;
        });
        
        
    }
}
