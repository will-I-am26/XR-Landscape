if (script.onAwake) {
	script.onAwake();
	return;
};
function checkUndefined(property, showIfData){
   for (var i = 0; i < showIfData.length; i++){
       if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]){
           return;
       }
   }
   if (script[property] == undefined){
      throw new Error('Input ' + property + ' was not provided for the object ' + script.getSceneObject().name);
   }
}
// @input Asset.Material meshMaterial
checkUndefined("meshMaterial", []);
// @input Asset.RemoteServiceModule remoteServiceModule
checkUndefined("remoteServiceModule", []);
// @input Asset.Texture imageTexture
// @input bool advancedSettings
checkUndefined("advancedSettings", []);
// @input int _frameHeight = "100" {"label":"Frame Height", "hint":"The height of the image in AR space.", "showIf":"advancedSettings"}
checkUndefined("_frameHeight", [["advancedSettings",true]]);
// @input int _frameOffset = "-200" {"label":"Frame Offset", "hint":"The frameOffset, the focal point of the image.", "showIf":"advancedSettings"}
checkUndefined("_frameOffset", [["advancedSettings",true]]);
// @input int _depthScale = "100" {"label":"Depth Scale", "hint":"Reflects how deep the image appears.", "showIf":"advancedSettings"}
checkUndefined("_depthScale", [["advancedSettings",true]]);
// @input bool _fadeBorder = true {"label":"Fade Border", "hint":"Fades the border of the spatial image.", "showIf":"advancedSettings"}
checkUndefined("_fadeBorder", [["advancedSettings",true]]);
// @input bool _frameOn = true {"label":"Frame On", "hint":"Enables the image frame with rounded corners, that creates the viewing portal effect.", "showIf":"advancedSettings"}
checkUndefined("_frameOn", [["advancedSettings",true]]);
var scriptPrototype = Object.getPrototypeOf(script);
if (!global.BaseScriptComponent){
   function BaseScriptComponent(){}
   global.BaseScriptComponent = BaseScriptComponent;
   global.BaseScriptComponent.prototype = scriptPrototype;
   global.BaseScriptComponent.prototype.__initialize = function(){};
   global.BaseScriptComponent.getTypeName = function(){
       throw new Error("Cannot get type name from the class, not decorated with @component");
   }
}
var Module = require("../../../../../Modules/Src/Assets/Spatial Image.lsc/SpatialImage/Spatial Image");
Object.setPrototypeOf(script, Module.SpatialImage.prototype);
script.__initialize();
if (script.onAwake) {
   script.onAwake();
}
