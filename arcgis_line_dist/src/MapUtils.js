import React from 'react';
import { loadModules } from 'esri-loader';
import { projectGeom } from './GeomUtils';

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
 * @param {Object} ptGeoms array[][] of pt coords 
 * @param {*} viewGraphics map.view.graphics layer
 */
export function addSamplePts(ptGeoms, map) {
  loadModules([
    'esri/layers/GraphicsLayer',
    'esri/Graphic',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/geometry/SpatialReference'
  ])
    .then(([GraphicsLayer, Graphic, SimpleMarkerSymbol, SpatialReference]) => {
      let geom = ptGeoms;
      let pointGraphics = [];

      // Create a symbol for drawing the line
      var ptSymbol = {
        type: "simple-marker", // autocasts as SimpleLineSymbol()
        color: "blue",
        size: "8px",
        outline: {
          color: [255, 255, 0],
          width: 3
        }
      };

      var layer = new GraphicsLayer({
        graphics: [],
        title: "Sample Pt Centroids",
        id: "SamplePtCentroids_" + Math.random()
      });

      for (var pt of geom) {
        var pointGeom = {
          type: "point", // autocasts as new Polyline()
          x: pt[0], //not sure if this will work. latitude/longitude?
          y: pt[1],
          SpatialReference: new SpatialReference({ wkid: 3857 })
          //need to specify wkid https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-SpatialReference.html
        };

        // DO we need to project this to lat/long?
        projectGeom(pointGeom).then((pointGeomLatLong) => {
          var ptAtts = {
            Name: "Sample Centroid for Transect"
          };

          var ptGraphic = new Graphic({
            geometry: pointGeomLatLong,
            symbol: ptSymbol,
            attributes: ptAtts
          });

          layer.graphics.add(ptGraphic);
        });
      } //end for

      map.add(layer);

      //viewGraphics.addMany(pointGraphics);
    });
}

function ptsAreEqual(pt1, pt2) {
  if (JSON.stringify(pt1.attributes) === JSON.stringify(pt2.attributes)) {
    return true;
  }
  else {
    return false;
  }
}
