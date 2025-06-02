const TouchGestures = require('TouchGestures');


//@input Component.MeshVisual landscapeVisual
//@input float brushRadius = 0.1
//@input float strength = 0.05

// 1) Subscribe to pinch on your mesh
TouchGestures.onPinch(script.landscapeVisual).subscribe(onPinch);

function onPinch(pinchData) {
    // pinchData.scale  > 1 → spread fingers (push up)
    // pinchData.scale  < 1 → pinch fingers (push down)
    const scale = pinchData.scale;

    // pinchData.currentTouchLocations is [vec2, vec2] in screen space
    const midScreen = pinchData.currentTouchLocations[0]
        .add(pinchData.currentTouchLocations[1])
        .uniformScale(0.5);

    // Convert screen point to a world‐space ray
    const camera = global.scene.getCamera();
    const ray = camera.screenSpaceToRay(midScreen);

    // Intersect that ray with the mesh's plane (assuming Y-up plane at y=0)
    const t = -ray.origin.y / ray.direction.y;
    const worldHit = ray.origin.add(ray.direction.uniformScale(t));

    // Transform into mesh-local coordinates
    const inv = script.landscapeVisual.getSceneObject()
          .getTransform()
          .getWorldToLocalMatrix();
    const localHit = inv.multiplyPoint(worldHit);

    // Finally, deform your mesh at this local point
    deformMeshAt(localHit, scale);
}