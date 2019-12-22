import { loadModules } from "esri-loader";

export function loadGraphicsLayers(map) {
  loadModules([
    "esri/layers/GraphicsLayer",
  ])
  .then(([GraphicsLayer]) => {
    
    let samplePtsGraphicsLayer = new GraphicsLayer({
      graphics: [],
      title: "TransectLine Sampling Centroids",
      id: "samplePts"
    });

    let transectLinesGraphicsLayer = new GraphicsLayer({
      graphics: [],
      title: "TransectLine Polyline",
      id: "transectLines"
    });

    let bufferPtsGraphicsLayer = new GraphicsLayer({
      graphics: [],
      title: "Buffer Pts",
      id: "bufferPts"
    });

    map.addMany([samplePtsGraphicsLayer, transectLinesGraphicsLayer, bufferPtsGraphicsLayer]);
  });
}

/**
 * Add a pre-defined clientside featureLayer (csfl) to our map.
 * If csfl already exists, it will be reset with new sourceFeatureSet (data)
 * 
 * <used by transectTool>
 * @param {string} id the id of the csfl (lookup val)
 * @param {*} sourceFeatureSet featureSet of data to add to csfl
 * @param {*} map map to add csfl to
 */
export const addClientsideFeatureLayer = async function(id, sourceFeatureSet, map) {
  return new Promise((resolve) => {
    loadModules(["esri/layers/FeatureLayer"])
    .then(([FeatureLayer]) => {
      const csfl_id = "transect_csfl"
      
      let csfl = new FeatureLayer({
        source: sourceFeatureSet.features,
        fields: sourceFeatureSet.fields,
        objectIdField: "objectid",
        id: id,
        renderer: {
          type: "simple",  // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
            size: 6,
            color: [ 255, 255, 255, 0.1 ],
          },
        },
        minScale: 2999
      });

      // test that csfl is not ALREADY in map:
      if(map.findLayerById(id)) { 
        map.remove(map.findLayerById(id));
      }
      map.add(csfl);
      return resolve("complete");
    });
  });
}

export const removeClientsideFeatureLayer = async function(id, map) {
  map.remove(map.findLayerById(id));
}

export const transectSamplePtSymbol = {
  type: "simple-marker", 
  color: "blue",
  size: "8px",
  outline: {
    color: [255, 255, 0],
    width: 3
  }
};

export const transectBufferAreaSymbol = {
  type: "simple-fill",
  color: [255, 255, 10, 0.2],
  style: "solid"
};

export const transectBufferAreaEmphasisSymbol = {
  type: "simple-fill",
  color: [255, 255, 10, 0.6],
  style: "solid"
};
