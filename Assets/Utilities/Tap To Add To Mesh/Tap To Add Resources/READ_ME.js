// Tap To Add Asset User Guide

/*
The Tap To Add Asset uses a UVSampler camera and a special reanderUV material
to get the uv position and object, then add new objects with PinToMesh
to the component.

The Sphere_UV object is used to render out uv position.
The Sphere_Object object is the object for items to be added on.

*-------IMPORTANT-------*

NOTE THE ASSET WOULD NOT WORK UNLESS LAYERS ARE SET UP CORRECTLY

Please create a new layer for UVSampler camera, and set the UVSampler camera
as well as the Sphere_UVSampler object to that layer, then refresh.


*Feel free to replace the Sphere_UV and Sphere_Object objects to any
custom mesh, but make sure they have the same position, scale & shape
*If you change your asset, make sure to replace the TargetMesh input 
in the TapToAdd script as well!

Thanks for using the Tap To Add asset :)
*/