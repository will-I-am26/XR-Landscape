@component
export class PersistentStorage extends BaseScriptComponent {
    
    public store = global.persistentStorageSystem.store;
    
    onAwake() {

    }

    deleteData() {
        this.store.clear();
    }
}
