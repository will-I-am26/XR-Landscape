//---- SnapOnManipulation_DelayedLookup.js ----
// @input Component.MeshVisual   terrainMeshVisual   // Drag your terrain’s MeshVisual here (must have a Physics Collider)
// @input float                  yOffset = 0.0      // How far above the surface to hover

//
// This script uses an UpdateEvent to wait one frame before looking up the InteractableManipulation.
// By the time UpdateEvent runs, all components on this node (including InteractableManipulation) will be awake.
// Once we find it, we disable Y‐translation and bind the onManipulationUpdate callback.
//

var selfNode     = script.getSceneObject();
var manip        = null;
var initialized  = false;

// 1) Create a one‐time UpdateEvent that does our “late” lookup:
var initEvent = script.createEvent("UpdateEvent");
initEvent.bind(function () {
    if (initialized) {
        // We've already set up the Manipulation listener, so do nothing.
        return;
    }

    // A) Try to find the InteractableManipulation component on this very same node
    manip = selfNode.getComponent("Component.InteractableManipulation");
    if (!manip) {
        // Not yet found—maybe the component isn’t awake in the very first frame.
        // We’ll try again next frame.
        return;
    }

    // B) Found it! Now disable Y‐translation so pinch/drag only affects X/Z:
    manip.enableYTranslation = false;

    // C) Bind our callback so that whenever the user drags, we can snap Y to the terrain:
    manip.onManipulationUpdate.add(onManipUpdate);

    // Mark as initialized so we don’t do this again:
    initialized = true;

    // Optionally unbind this UpdateEvent now that we’re done initializing:
    initEvent.enabled = false;
});

//
// 2) When the user drags (pinches) this object, this callback runs each frame of manipulation.
//    We read the current X/Z (set by Manipulation), cast a Physics ray down, and snap Y.
//
function onManipUpdate(eventArgs) {
    // A) If there’s no terrain assigned, do nothing:
    if (!script.terrainMeshVisual) {
        return;
    }

    // B) Read this node’s current world position:
    var trans = selfNode.getTransform();
    var pos   = trans.getWorldPosition();

    // C) Build a ray from (pos.x, pos.y + R, pos.z) straight down to (pos.x, pos.y – R, pos.z).
    //    R must be above your terrain’s tallest point:
    var R        = 10.0;
    var rayStart = new vec3(pos.x, pos.y + R, pos.z);
    var rayEnd   = new vec3(pos.x, pos.y - R, pos.z);

    // D) Fire a Physics probe (raycast) against any collider in the scene.
    //    Since your terrain’s MeshVisual has a Physics Collider, it will catch this ray.
    var probe = Physics.createGlobalProbe();
    probe.rayCast(rayStart, rayEnd, function(hit) {
        if (hit) {
            // E1) We hit something (hopefully the terrain). Snap only Y = hit.position.y + yOffset:
            var hitY = hit.position.y;
            print("✅ Ray hit terrain at: " 
                  + hit.position.toString() 
                  + "  (Object: " + selfNode.name + ")");
            trans.setWorldPosition(new vec3(
                pos.x,
                hitY + script.yOffset,
                pos.z
            ));
        } else {
            // E2) Ray missed (object might be off the terrain or collider missing).
            print("⚠️ Ray did NOT hit terrain for Object: " 
                  + selfNode.name 
                  + "  (start=" + rayStart.toString() 
                  + ", end=" + rayEnd.toString() + ")");
        }
    });
}
