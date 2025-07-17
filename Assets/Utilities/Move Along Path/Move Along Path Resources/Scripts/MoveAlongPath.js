// MoveAlongPath.js
// Version: 0.0.1
// Event: Initialized
// Description: This script will let you to define a path using sceneobjects
// and move a content based on the speed along the path.
// Pack: Refinement Pack

//@ui {"widget":"label", "label":"Path"}
// @input SceneObject[] paths
//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Object To Move Along Path"}
// @input SceneObject[] movableObjects 
//@ui {"widget":"separator"}
// @input string loopType = "none" {"label":"Loop Type", "widget":"combobox", "values":[{"label":"None", "value":"none"}, {"label":"Loop", "value":"loop"}, {"label":"Ping Pong", "value":"pingPong"}]}
// @input float speed = 200.0
// @input float delay = 0.0
// @input bool addPathRotation


var pathData = [];
var childCount;
var objectsTransform = [];
var pathIndex = 0;
var initialized = false;
const smoothingDist = 100;

function onLensTurnOn() {
    if (validateInputs()) {
        
    }
}

function setMovableTransform() {
    for (var i = 0; i < script.movableObjects.length; i++) {
        objectsTransform[i] = script.movableObjects[i].getTransform();
    }
}

function setPathData() {
    for (var i = 0; i < script.paths.length; i++) {
        pathData[i] = ({
            position: script.paths[i].getTransform().getWorldPosition(),
            rotation: script.paths[i].getTransform().getWorldRotation()
        });
    }
    pathIndex = script.paths.length - 1;
}

function pingPong(t, len) {
    var l = 2 * len;
    t = t % l;
    return (0 <= t && t < len) ? t : l - t;
}

function onUpdate() {
    
        setMovableTransform();
        setPathData();
        initialized = true;
    if (initialized) {
        var time = getTime();

        var totalDist = pathIndex * smoothingDist;
        var loopDuration = totalDist / Math.abs(script.speed);

        var localTime = Math.max(0, time - script.delay);
        if (script.loopType == "loop") {
            localTime = localTime % loopDuration;
        } else if (script.loopType == "pingPong") {
            localTime = pingPong(localTime, loopDuration);
        } else {
            localTime = Math.min(localTime, loopDuration);
        }

        var localT = localTime / loopDuration;
        if (script.speed < 0) {
            localT = 1 - localT;
        }

        var ind = localT * pathIndex;

        var adjustedPos = getEasedPosition(pathData, ind);
        var adjustedRot = getEasedRotation(pathData, ind);

        for (var i = 0; i < objectsTransform.length; i++) {
            objectsTransform[i].setWorldPosition(adjustedPos);

            if (script.addPathRotation) {
                objectsTransform[i].setWorldRotation(adjustedRot);
            }
        }
    }
}

function validateInputs() {
    if (script.paths.length < 2) {
        print("MoveAlongPath, ERROR: Please add at least two path to the  " + script.getSceneObject().name + " sceneobject");
        return false;
    }
    
    if (script.movableObjects.length == 0) {
        print("MoveAlongPath, ERROR: Please add at movable object(s) to  " + script.getSceneObject().name + " sceneobject");
        return false;
    }
    
    for (var i = 0; i < script.paths.length; i++) {
        if (script.paths[i] == null) {
            print("MoveAlongPath, ERROR: Please make sure that you set an object in the path and it's not null");
            return false;
        }
    }
    
    for (var i = 0; i < script.movableObjects.length; i++) {
        if (script.movableObjects[i] == null) {
            print("MoveAlongPath, ERROR: Please make sure that you set a movable object in the Objects to move along path and it's not null");
            return false;
        }
    }
    
    return true;
}

function getEasedPosition(array, index) {
    return getEasedValue(array, index, getPositionAtIndex, vecLerp, array.length);
}

function getEasedRotation(array, index) {
    return getEasedValue(array, index, getRotationAtIndex, quatSlerp, array.length);
}

function getEasedValue(array, index, getterFunc, easeFunc, length) {
    if (index <= 0) {
        return getterFunc(array, 0);
    }
    if (index >= length-1) {
        return getterFunc(array, length-1);
    }
    var fract = index % 1;
    var ind = Math.trunc(index);
    var prev = getterFunc(array, ind);
    var next = getterFunc(array, ind + 1);
    return easeFunc(prev, next, fract);
}

function getPositionAtIndex(array, index) {
    return array[index].position;
}

function getRotationAtIndex(array, index) {
    return array[index].rotation;
}

function vecLerp(a, b, t) {
    return vec3.lerp(a, b, t);
}

function quatSlerp(a, b, t) {
    return quat.slerp(a, b, t);
}

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOn);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);