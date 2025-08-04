@component
export class PersistentStorage extends BaseScriptComponent {

    public store = global.persistentStorageSystem.store;
    //debug printing of the persistent storage system size and current contents
    onAwake() {
        let maxSize = this.store.getMaxSizeInBytes();
        print(`Persistent Storage Awake. Max Size: ${maxSize} bytes`);
        let currentSize = this.store.getSizeInBytes();
        print(`Persistent Storage Awake. Current Size: ${currentSize} bytes`);
    }
    //this clears the persistent storage system when the delete button is pressed
    deleteData() {
        this.store.clear();
    }
}

