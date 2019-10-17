import React from 'react';
import { loadModules } from 'esri-loader';

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

function ptsAreEqual(pt1, pt2) {
  if (JSON.stringify(pt1.attributes) === JSON.stringify(pt2.attributes)) {
    return true;
  }
  else {
    return false;
  }
}

export function getLengthOfLine(geom) {
  let deltaX = geom[0][0] - geom[1][0];
  let deltaY = geom[0][1] - geom[1][1];

  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}