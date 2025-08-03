@component
export class PersistentStorage extends BaseScriptComponent {
    
    public store = global.persistentStorageSystem.store;
    
    onAwake() {
        let maxSize = this.store.getMaxSizeInBytes();
        print(`Persistent Storage Awake. Max Size: ${maxSize} bytes`);
        let currentSize = this.store.getSizeInBytes();
        print(`Persistent Storage Awake. Current Size: ${currentSize} bytes`);

    }

    deleteData() {
        this.store.clear();
    }
}
