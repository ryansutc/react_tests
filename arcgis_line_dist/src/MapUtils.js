import React from 'react';
import { loadModules } from 'esri-loader';
import { projectToLatLong, projectToXY  } from './GeomUtils';
import {transectSamplePtSymbol, transectBufferAreaSymbol, transectBufferAreaEmphasisSymbol} from './GraphicsLayerUtils';

export function getSymbolForPt() {
  let symbol = {
    type: "simple-marker",
    style: "circle",
    color: "red",
    opacity: 0.5,
    size: "20px",
    outline: {
      color: [255, 255, 0],
      width: 1
    }
  }
  return symbol;
}

export const featuresToGraphics = (features) => {
  return new Promise((resolve, reject) => {
    loadModules([
      'esri/Graphic',
      'esri/geometry/Point'
    ])
      .then(([Graphic, Point]) => {

        let graphics = [];
        features.forEach((feature) => {
          var graphic = new Graphic({
            geometry: feature.geometry,
            symbol: getSymbolForPt(),
            attributes: feature.attributes
          })
          graphics.push(graphic)
        })

        resolve(graphics);
      }).catch((err) => {
        console.error(err);
        reject(err);
      })
  })
}

export const updateSelectedPts = (_existingGraphics, newGraphics, shift = false) => {

  // we should have ESRI Collection class loaded by now:
  return new Promise(resolve => {
    loadModules(['esri/core/Collection']).then(([Collection]) => {
      let existingGraphics = _existingGraphics !== null ? _existingGraphics.clone() : new Collection(); // don't mutate existing prop!
      let newGraphicsSel = new Collection();
      newGraphicsSel.addMany(newGraphics);

      if (!shift) {
        existingGraphics.removeAll();
      }

      let newGraphicsSelClone = newGraphicsSel.clone();
      if (existingGraphics.length) {
        // if already selected points & shift select:
        newGraphicsSel.forEach((graphic, index) => {
          if (existingGraphics.some(pt => ptsAreEqual(graphic, pt))) {
            //if our point already exists remove it:
            let ptIndex = existingGraphics.findIndex(pt => ptsAreEqual(graphic, pt))
            existingGraphics.removeAt(ptIndex);
            newGraphicsSelClone.removeAt(index);
          }
        })
      }

      existingGraphics.addMany(newGraphicsSelClone);
      resolve(existingGraphics);
    })
  });
}

/**
   * Add Sample Point Graphics along sketched polyline
   * changes are applied to graphicsLayer passed to it (mutation)
   * @param {Object} ptGeoms array[][] of pt coords 
   * @param {*} GraphicsLayer map.view.graphics layer
   * @param {number} dist distance for each sample Pt
   * @param {number} ttlDist if not null, we are adding a samplePt at this dist, which is total length of our polyline
   * @returns {Promise} returns "done" when complete
   */
  export const addSamplePts = async function(ptGeoms, samplePtsGraphicsLayer, dist, ttlDist=null) {
    return new Promise((resolve)=> {
      loadModules([
        'esri/Graphic',
        'esri/geometry/SpatialReference'
      ])
        .then(([Graphic, SpatialReference]) => {
          let geom = ptGeoms;
          let graphicsAsyncRequests = []; // a list of all async project calls on our sampleGeoms
          
          // this is an async function variable we want to run below:
          const addGraphicAsync = (pt, samplePtId) => {
            return new Promise(resolve => {
              var pointGeom = {
                type: "point", 
                x: pt[0], 
                y: pt[1],
                SpatialReference: new SpatialReference({ wkid: 3857 })
              };
  
              projectToLatLong(pointGeom).then(pointGeomLatLong => {
                var ptAtts = {
                  id: samplePtId,
                  Name: "Sample Centroid for Transect"
                };

                var ptSymbol = transectSamplePtSymbol;
                var ptGraphic = new Graphic({
                  geometry: pointGeomLatLong,
                  symbol: ptSymbol,
                  attributes: ptAtts
                });
    
                samplePtsGraphicsLayer.add(ptGraphic);

                return resolve("done!")
              }); //end projectToLatLong
            })
          };

          let samplePtId = 0;
          for (var pt of geom) {
            graphicsAsyncRequests.push(addGraphicAsync(pt, samplePtId));
            if(JSON.stringify(geom[geom.length - 2]) === JSON.stringify(pt)) {
              //if this is the 2nd last point check if we need to assign it ttlDist for last pt:
              samplePtId = ttlDist ? ttlDist : samplePtId + dist; 
            }
            else {
              samplePtId += dist; 
            }
          } //end for

          Promise.all(graphicsAsyncRequests).then(() => {
            console.log("All graphics have been added!");
            return resolve(samplePtsGraphicsLayer);
          })
        });
    })
  }

  /**
   * Create Buffer Graphics in layer based on another Layer
   * @param {GraphicsLayer} samplePtsGraphicsLayer 
   * @param {GraphicsLayer} bufferPtsGraphicsLayer 
   * @param {number} dist 
   */
  export const bufferPts = async function(samplePtsGraphicsLayer, bufferPtsGraphicsLayer, dist) {
    return new Promise((resolve) => {
      loadModules([
        'esri/Graphic',
        "esri/geometry/geometryEngine",
      ])
        .then(([Graphic, GeometryEngine]) => {
          let graphicsAsyncRequests = []; // a list of all async call promises on our sampleGeoms

          // the async function we want to run on each item:
          const addGraphicsAsync = (pt) => {
            return new Promise(resolve => {
             
              projectToXY(pt.geometry).then((pointGeomXY) => {
                let geoBufferXY = GeometryEngine.buffer(pointGeomXY, dist / 2, "meters");
                let ptAtts = {
                  id: pt.attributes.id,
                  Name: "Transect Buffer Area"
                };
                var polygonGraphic = new Graphic({
                  geometry: geoBufferXY,
                  symbol: transectBufferAreaSymbol,
                  attributes: ptAtts
                });
                bufferPtsGraphicsLayer.add(polygonGraphic);
                return resolve("graphic Added");
              });
            });
          }

          for (var item of samplePtsGraphicsLayer.graphics.items) {
            graphicsAsyncRequests.push(addGraphicsAsync(item));             
          };

          Promise.all(graphicsAsyncRequests).then(() => {
            return resolve(bufferPtsGraphicsLayer);
          });
        })
        .catch(err => console.error(err)); //end load modules
    })
  } //end bufferPts

   /**
   * Take an array of buffers and union them clientside to a new graphic
   * @param {*} bufferGraphics 
   * @returns {Graphic} unioned Buffer graphic
   */
  export const unionBuffers = async function(bufferGraphics) {
    return new Promise(resolve => {
      loadModules([
        "esri/geometry/geometryEngine",
      ]).then(([GeometryEngine]) => {
        // get a union element for all buffers:
        let bufferGeoms = [];
        for (var bufferPt of bufferGraphics) {
          bufferGeoms.push(bufferPt.geometry);
        }
        let unionBuffer = GeometryEngine.union(bufferGeoms); 
        return resolve(unionBuffer);
      })
    })
  }

  /**
   * This gets all displacement points within our transect buffers in a single server fetch,
   * then adds them to our transectDisplacementPts featureLayer so they can be queried client-side.
   * 
   * @param {featureLayer} dataPtsLayerView: an esri featureLayerView with the dispacement data we want
   * @param {Graphic} unionedBuffers: a single esri graphic which is a union of all the buffers (for query)
   * @param {string} symbolField: the symbol field for our displacement def query
   */
  export const fetchPtsIntersectingBuffers = (displacementLayer, unionedBuffers, symbolField) => {
 
    // TODO: get a JSON object of PtIds for an array of Bufferareas in map
    return new Promise((resolve) => {
      // Query (server) displacement Layer for all points inside our unioned buffers:
 
      var query = displacementLayer.createQuery();
      query.geometry = unionedBuffers;
      query.spatialRelationship = "intersects";
      query.returnGeometry = true;
      query.outFields = ["*"];
      query.where = `${symbolField} <> 0`; 

      displacementLayer.queryFeatures(query).then(results => {
        return resolve(results);
      }).catch(err => console.error(err));
    });
  }

  /**
   * Get a JSON Object of ptIds for an array of BufferAreas in map
   * This is currently used by TransectTool and injested into Transect Chart
   * @param {layerView} dataPtsLayerView: esri LayerView 
   * @param {GraphicsLayer} bufferPtsGraphics esri GraphicsLayer
   * 
   * @returns {number[{}]} array of objects containing {dist: 20, pt_ids: [11764500, 545222343,...]}
   */
  export const getPtIdsAroundSamplePts = async function(dataPtsLayerView, bufferPtsGraphics) {
    return new Promise(resolve => {
      let transectPtData = [];  // array of data
      let graphicsAsyncRequests = [];

      const queryPtIdsAsync = (buffer) => {
        return new Promise(resolve => {
          dataPtsLayerView.queryFeatures({
            geometry: buffer.geometry,
            outFields: ["*"],
            spatialRelationship: "intersects",
            returnGeometry: false
          }).then(results => {
            let graphics = results.features;
            let pt_ids = graphics.map(graphic => {
              return graphic.attributes.pt_id;
            });
            transectPtData.push({dist: buffer.attributes.id, pt_ids: pt_ids })
            return resolve("complete");
          });
        })
      }

      for (var buffer of bufferPtsGraphics) {
        graphicsAsyncRequests.push(queryPtIdsAsync(buffer));
      } //end queryPtAsnyc
  
      Promise.all(graphicsAsyncRequests).then(() => {
        return resolve(transectPtData) // we've completed populating transectPtData
      });
    });
  }

  /**
   * Get a JSON Object of avgVal and related stats for each buffer in map
   * This is currently used by TransectTool and injested into Transect Chart
   * Row Schema: {"dist": <number>, "avgVal": <number>, "min": <number>,
   * "max": <number>, "count": <number>, stDev: <number>, nodata: <number>}
   * 
   * @param {layerView} dataPtsLayerView: esri LayerView 
   * @param {GraphicsLayer} bufferPtsGraphics esri GraphicsLayer
   * @param {string} dataField: data attribute diplacement field 
   * 
   * @returns {number[{}]} array of objects containing {dist: 20, avgVal: 4.2654}
   */
  export const getValsAroundSamplePts = async (dataPtsLayerView, bufferPtsGraphics, dataField) => {
    return new Promise((resolve) => {
     
      let transectPtData = []; //object of data
      let graphicsAsyncRequests = [];

      const queryFeaturesAsync = (bufferPt, dataField) => {
        return new Promise(resolve => {
          dataPtsLayerView.queryFeatures({
            geometry: bufferPt.geometry,
            outFields: ["*"],
            spatialRelationship: "intersects",
            returnGeometry: false
          }).then(results => {
            let graphics = results.features;
            let dataVals = graphics.map(graphic => {
              return graphic.attributes[dataField];
            });
     
            let sum = 0, avg = null, count = 0;
            let min, max = null;
            let nodata = 0; // 0 means nodata & will be where we plot its dot, null means we DO have data
            if (dataVals.length) {
              nodata = null;
              sum = dataVals.reduce((ttl,curr) => ttl + curr);
              count = dataVals.length;
              avg = sum / count;
              min = Math.min(...dataVals);
              max = Math.max(...dataVals);
              
            }
            transectPtData.push({
              "dist": bufferPt.attributes.id, 
              "avgVal": avg,
              "count": count,
              "min": min,
              "max": max,
              "stDev": getStandardDeviation(dataVals),
              "nodata": nodata
             });
            return resolve("queryFeaturesAsync complete!");
          });
        });
      }
      
      for (var bufferPt of bufferPtsGraphics) {
        graphicsAsyncRequests.push(queryFeaturesAsync(bufferPt, dataField));
      }

      Promise.all(graphicsAsyncRequests).then(() => {
        return resolve(transectPtData)
      });
    });
  }; //end getPtIdsAroundSamplePts

function ptsAreEqual(pt1, pt2) {
  if (JSON.stringify(pt1.attributes) === JSON.stringify(pt2.attributes)) {
    return true;
  }
  else {
    return false;
  }
}

function getStandardDeviation(values) {
  // https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

/**
 * internal function used by getStandardDeviation
 * @param {*} data 
 */
function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;

}