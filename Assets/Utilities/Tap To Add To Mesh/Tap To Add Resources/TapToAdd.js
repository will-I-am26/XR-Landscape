//@ui {"label":"PLEASE READ README.JS"}
//@ui {"label":"BEFORE GETTING STARTED!"}
//@ui {"widget":"separator"}
//@input Asset.Texture uvTexture
//@input Component.BaseMeshVisual targetMesh
//@input SceneObject[] pinObjects
//@input bool growAnimation = true
//@input float growSpeed = 1 {"showIf":"growAnimation","showIfValue":"true"}
//@input float scale = 1

const SPEED = vec3.one().uniformScale(script.growSpeed);
var transformsToGrow = [];

function attachObject(uv) {
    
    var randomIndex = Math.floor(Math.random() * script.pinObjects.length);
    var so = script.getSceneObject().copyWholeHierarchy(script.pinObjects[randomIndex]);
    var pin = so.getFirstComponent("Component.PinToMeshComponent");
    pin.target = script.targetMesh;
    pin.pinUV = uv;
    var t = so.getTransform();
    var scale = (script.growAnimation) ? vec3.zero() : vec3.one().uniformScale(script.scale);
    t.setLocalScale(scale);
    var worldPos = t.getWorldPosition();
    transformsToGrow.push(t);
}

script.createEvent("TapEvent").bind(function(event) {
    
    if(script.uvTexture == null){
        print("ERROR! Please follow instructions in READ_ME to set up Render Target for UV Texture");
        return;
    }
    
    
    var newTex = ProceduralTextureProvider.createFromTexture(script.uvTexture);

    var w = ~~(newTex.getWidth() * event.getTapPosition().x);
    var h = ~~(newTex.getHeight() * (1-event.getTapPosition().y));
    
    var out = new Uint8Array(4);
    
    var tapPixel = newTex.control.getPixels(w, h, 1, 1, out);

    if (out[2] > 0 ) {
        attachObject(new vec2(out[0]/256.0, out[1]/256.0));
    } else {
        return 
    }
});

script.createEvent("UpdateEvent").bind(function() {
    if(script.growAnimation){
           transformsToGrow.forEach(function(t) {
           t.setLocalScale(t.getLocalScale().add(SPEED.uniformScale(getDeltaTime())));        
        });
        
        for (var i=transformsToGrow.length-1; i >=0; i--) {
            if (transformsToGrow[i].getLocalScale().x > script.scale) {
                transformsToGrow.splice(i,1);
            }
        }
    }

});
