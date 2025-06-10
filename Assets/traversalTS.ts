@component
export class traversal extends BaseScriptComponent {
  
  xPos: number = 0;
  yPos: number = 0;
  zPos: number = 0;

  @input
  public camera:Camera[]
  public cameraT:Transform[]

  @input
  public objectScene:SceneObject
  public objectSceneT:Transform[]

  private gestureModule: GestureModule = require('LensStudio:GestureModule');

  init() {
    this.cameraT = []
  }


  onAwake() {
    this.gestureModule
      .getPalmTapUpEvent(GestureModule.HandType.Right)
      .add((palmTapUpArgs: PalmTapUpArgs) => {
        print('Palm tap up event from GestureModule');

      });

    this.gestureModule
      .getPalmTapDownEvent(GestureModule.HandType.Right)
      .add((palmTapDownArgs: PalmTapDownArgs) => {
        print('Palm tap down event from GestureModule');

        this.objectSceneT[0] = this.getTransform()
        

      });
  }

   
}

