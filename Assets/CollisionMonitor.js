// CollisionLogger.ts
// @input Physics.ColliderComponent collider

// Make sure this runs as soon as the script awakes
script.createEvent("AwakeEvent").bind(() => {
    // Register a typed callback for every collision enter
    script.collider.onCollisionEnter.add((eventArgs: Physics.CollisionEvent) => {const otherName: string = eventArgs.collision.collider.getSceneObject().name;
            
        // Log it
        print(`💥 Collided with: ${otherName} (contacts=${eventArgs.collision.contactCount})`);
    });
});