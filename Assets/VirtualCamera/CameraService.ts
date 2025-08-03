@component
export class CameraService extends BaseScriptComponent {
       @input editorCamera: Camera;
    @input screenCropTexture: Texture;
    @input
     private camModule: CameraModule;

    private isEditor = global.deviceInfoSystem.isEditor();

    onAwake() {
  this.createEvent("OnStartEvent").bind(this.start.bind(this));
    }

      start() {
        var camID = this.isEditor
            ? CameraModule.CameraId.Default_Color
            : CameraModule.CameraId.Right_Color;
        var camRequest = CameraModule.createCameraRequest();
        camRequest.cameraId = camID;
        //camRequest.imageSmallerDimension = this.isEditor ? 352 : 756;

        var camTexture = this.camModule.requestCamera(camRequest);
        print(camTexture);
        var camTexControl = camTexture.control as CameraTextureProvider;
        var cropTexControl = this.screenCropTexture.control as CropTextureProvider;
        cropTexControl.inputTexture = camTexture;
        camTexControl.onNewFrame.add(() => { });
    }
}

