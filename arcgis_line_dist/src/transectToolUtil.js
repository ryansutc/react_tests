 import { addSamplePts, bufferPts, unionBuffers, 
  getValsAroundSamplePts, getPtIdsAroundSamplePts, fetchPtsIntersectingBuffers } from './MapUtils';
 import { addClientsideFeatureLayer, removeClientsideFeatureLayer} from './GraphicsLayerUtils';

 
 /**
   * This generates samplePt, bufferPt, graphics & updates
   * state with latest chartData.
   * 
   * Called by selectFeaturesForTransectLine & updateFeaturesForTransectLine methods
   */
export const generateTransectGraphicsAndChart = async function(view, samplePtGeoms, dist, lineLength ) {

  
  let map = view.map;
  //add the samplePtGeom coords to map view as graphics
  console.log("adding sample pts along transect..");
  await addSamplePts(
    samplePtGeoms, 
    map.findLayerById("samplePts"), //this.props.graphicsLayers.samplePts, 
    dist,
    lineLength
  );

  console.log("buffering Pts..");
  await bufferPts(
    map.findLayerById("samplePts"), //this.props.graphicsLayers.samplePts,
    map.findLayerById("bufferPts"), //this.props.graphicsLayers.bufferPts, 
    dist // this.props.transectDist
  );

  console.log("unioningBuffers..");
  // first lets get a union element for all buffers and zoom to that:
  let unionedBuffers = await unionBuffers(
    map.findLayerById("bufferPts").graphics.items //this.props.graphicsLayers.bufferPts.graphics.items
  );

  console.log("fetching Displacement data..");
  let results = await fetchPtsIntersectingBuffers(
    map.findLayerById("dataPts"), 
    unionedBuffers,
    "pt_id",
  )

  // create a csfl from results <featureSet>:
  addClientsideFeatureLayer("transect_csfl", results, map);

  console.log("zooming to Features..");  

  // we need to ensure that the pts data are loaded in view
  // especially if the user was zoomed out and the displacement points have not yet been drawn:
  const whenLayerViewAsync = async function() {
    return new Promise(resolve => {
      view.goTo(unionedBuffers).then(()=> {
        view.whenLayerView(map.findLayerById("transect_csfl")).then(
          transectPts_CSFL => resolve(transectPts_CSFL))
        });
    })
  }
  let transectPts_CSFL = await whenLayerViewAsync();

  console.log("getting PtIds for each buffer..")
  let bufferPtsTable = await getPtIdsAroundSamplePts(
    transectPts_CSFL, 
    map.findLayerById("bufferPts").graphics.items
  );
  
  console.log(bufferPtsTable); //this is an Object w. pt_ids for each buffer area.
  
  console.log("getting stats for buffer areas..");
  let sampleAreaVals = await getValsAroundSamplePts(
    transectPts_CSFL,
    map.findLayerById("bufferPts").graphics.items, 
    "pt_id"
  );

  return [bufferPtsTable, sampleAreaVals];
}



/**
 * VERSION 2: let some processes run concurrently!
   * This generates samplePt, bufferPt, graphics & updates
   * state with latest chartData.
   * 
   * Called by selectFeaturesForTransectLine & updateFeaturesForTransectLine methods
   */
  export const generateTransectGraphicsAndChart_v2 = async function(view, samplePtGeoms, dist, lineLength ) {

  
    let map = view.map;
    //add the samplePtGeom coords to map view as graphics
    console.log("adding sample pts along transect..");
    await addSamplePts(
      samplePtGeoms, 
      map.findLayerById("samplePts"), //this.props.graphicsLayers.samplePts, 
      dist,
      lineLength
    );
  
    console.log("buffering Pts..");
    await bufferPts(
      map.findLayerById("samplePts"), //this.props.graphicsLayers.samplePts,
      map.findLayerById("bufferPts"), //this.props.graphicsLayers.bufferPts, 
      dist // this.props.transectDist
    );
  
    console.log("unioningBuffers..");
    // first lets get a union element for all buffers and zoom to that:
    let unionedBuffers = await unionBuffers(
      map.findLayerById("bufferPts").graphics.items //this.props.graphicsLayers.bufferPts.graphics.items
    );
  
    console.log("fetching Displacement data..");
    let results = await fetchPtsIntersectingBuffers(
      map.findLayerById("dataPts"), 
      unionedBuffers,
      "rate", //val?
    )
  
    // create a csfl from results <featureSet>:
    await addClientsideFeatureLayer("transect_csfl", results, map);
  
    console.log("zooming to Features..");  
  
    // we need to ensure that the pts data are loaded in view
    // especially if the user was zoomed out and the displacement points have not yet been drawn:
    const whenLayerViewAsync = async function() {
      return new Promise(resolve => {
        //view.goTo(unionedBuffers);
        view.whenLayerView(map.findLayerById("transect_csfl")).then(
          transectPts_CSFL => resolve(transectPts_CSFL))
      });
    }
    let transectPts_CSFL = await whenLayerViewAsync();
  
    console.log("getting PtIds for each buffer..")
    let bufferPtsTable = await getPtIdsAroundSamplePts(
      transectPts_CSFL, 
      map.findLayerById("bufferPts").graphics.items
    );
    
    console.log(bufferPtsTable); //this is an Object w. pt_ids for each buffer area.
    
    console.log("getting stats for buffer areas..");
    let sampleAreaVals = await getValsAroundSamplePts(
      transectPts_CSFL,
      map.findLayerById("bufferPts").graphics.items, 
      "rate" //"pt_id"
    );
  
    return [bufferPtsTable, sampleAreaVals];
  }
