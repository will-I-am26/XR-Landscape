import { InteractableManipulation } from "SpectaclesInteractionKit/Components/Interaction/InteractableManipulation/InteractableManipulation"
import { ContainerFrame } from "SpectaclesInteractionKit/Components/UI/ContainerFrame/ContainerFrame"

@component
export class ToolPickerBehavior extends BaseScriptComponent {

    @input
    public toolPrefabs: ObjectPrefab[]

    @input
    public toolSpawnPoints: SceneObject[]
    public toolSpawnPointsT: Transform[]

    private latestObj: SceneObject[]
    private latestObjT: Transform[]

    private yOffset = 5
    private distanceOffset = 15
    private counter: number[] = []
    private storage = global.persistentStorageSystem.store

    @input
    public containerObj: SceneObject

    @input
    private parentObj: SceneObject

    @input
    private anchorObj: SceneObject

    onAwake() {
        
        //this.storage.clear()
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))

        

        let keys: string[] = this.storage.getAllKeys()
        this.toolPrefabs.forEach((value, ind) => {
            this.counter.push(0)
        })

        keys.forEach((value, ind) => {
            let objType = value.split("_")[0]
            let objCount = value.split("_")[1]
            let objTypeNum = Number (objType)
            print("This ran")
            print(keys[ind])
            print(objTypeNum)
            this.counter[objTypeNum] = Number (objCount)
            this.firstSpawn(objTypeNum, value)
        })
        this.init()
    }

    init() {
        this.toolSpawnPointsT = []
        this.latestObj = []
        this.latestObjT = []
        this.spanwAllTools()
    }

    spanwAllTools() {
        this.toolSpawnPoints.forEach((value, ind) => {
            let spawnPoint = value
            this.toolSpawnPointsT[ind] = spawnPoint.getTransform()
            this.spawnAndReplace(ind)
        })
    }

    onUpdate() {
        this.toolSpawnPoints.forEach((value, ind) => {
            let spawnPointT = this.toolSpawnPointsT[ind]
            let objectT = this.latestObjT[ind]

            if (objectT.getWorldPosition().distance(spawnPointT.getWorldPosition())
                > this.distanceOffset) {
                objectT.getSceneObject().setParent(this.parentObj)
                this.spawnAndReplace(ind)
            }
        })
    }

    spawnAndReplace(ind) {
        let spawnPos = this.toolSpawnPointsT[ind].getWorldPosition()
        spawnPos.y += this.yOffset

        let nObject = this.toolPrefabs[ind].instantiate(this.containerObj)
        nObject.enabled = true
        nObject.getTransform().setWorldPosition(spawnPos)
        this.counter[ind]++
        nObject.name = ind.toString() + "_"  + this.counter[ind].toString();

        this.latestObj[ind] = nObject
        this.latestObjT[ind] = nObject.getTransform()

        print(nObject.name)
    }

    firstSpawn(ind, key) {
        let nObject = this.toolPrefabs[ind].instantiate(this.containerObj)
        
        // Get the stored offset (this is already relative to anchor)
        let storedOffset = this.storage.getVec3(key)
        
        nObject.enabled = true
        // Set as child of anchor first
        nObject.setParent(this.parentObj)
        print(`Parent is at ${this.parentObj.getTransform().getWorldPosition()}`)
        // Then set the local position using the stored offset
        nObject.getTransform().setLocalPosition(storedOffset)
        
        nObject.name = ind.toString() + "_" + this.counter[ind].toString()
    }
    // firstSpawn(ind, key) {
    //     let nObject = this.toolPrefabs[ind].instantiate(this.containerObj)

    //     let nObjectLocation = this.storage.getVec3(key)
    //     let anchorLocation = this.anchorObj.getTransform().getWorldPosition()

    //     let spawnPos = nObjectLocation.add(anchorLocation)


    //     nObject.enabled = true
    //     nObject.getTransform().setWorldPosition(spawnPos)
    //     nObject.name = ind.toString() + "_" + this.counter[ind].toString() ;

    //     nObject.setParent(this.parentObj)
    // }
}