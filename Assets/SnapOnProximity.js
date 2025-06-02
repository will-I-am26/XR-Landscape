//---- SnapOnProximity_Sticky.js ----
// @input SceneObject movable
// @input SceneObject[] targets
// @input float         snapDistance = 0.1
// @input float         yOffset      = 0

function onUpdate(event) {
    var t = script.movable.getTransform();
    var p = t.getWorldPosition();

    for (var i = 0; i < script.targets.length; i++) {
        var tp = script.targets[i].getTransform().getWorldPosition();
        var dx = p.x - tp.x, dz = p.z - tp.z;
        // only horizontal check, so dragging in XZ still works
        var horiz = Math.sqrt(dx*dx + dz*dz);
        if (horiz <= script.snapDistance) {
            t.setWorldPosition(new vec3(p.x, tp.y + script.yOffset, p.z));
            break;
        }
    }
}

script.createEvent("UpdateEvent").bind(onUpdate);
