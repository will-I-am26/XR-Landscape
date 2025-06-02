// top-level sanity check
print("🔍 GridPlaneScript loaded!");

// @input Component.MeshVisual meshVisual
// @input float size = 1.0 {"widget":"slider","min":0.1,"max":1000,"step":0.1}
// @input int divisions = 10 {"widget":"stepper","min":1,"max":500,"step":1}

function createGridPlane() {
   print(
      "▶ OnStartEvent: size = " +
      script.size +
      ", divisions = " +
      script.divisions
    );
    var div     = script.divisions;
    var size    = script.size;
    var builder = new MeshBuilder([
        { name: "position", components: 3 },
        { name: "normal",   components: 3 },
        { name: "texture0", components: 2 }
    ]);
    builder.topology   = MeshTopology.Triangles;
    builder.indexType  = MeshIndexType.UInt16;

   

    // build vertices
    for (var y = 0; y <= div; y++) {
        for (var x = 0; x <= div; x++) {
            var u  = x/div, v = y/div;
            var px = (u - 0.5)*size, pz = (v - 0.5)*size;
            builder.appendVertices([[px,0,pz],[0,1,0],[u,v]]);
        }
    }
    // build indices
    for (var y = 0; y < div; y++) {
        for (var x = 0; x < div; x++) {
            var i0 = y*(div+1)+x, i1 = i0+1;
            var i2 = i0+(div+1),    i3 = i2+1;
            builder.appendIndices([i0,i2,i1]);
            builder.appendIndices([i1,i2,i3]);
        }
    }

    builder.updateMesh();
    script.meshVisual.mesh = builder.getMesh();
}

// Bind once at lens startup:
script.createEvent("OnStartEvent").bind(createGridPlane);
