import React from 'react';
import { loadModules } from 'esri-loader';

function getSymbolForPt() {
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

export const featureSetToGraphics = (featureSet) => {
  return new Promise((resolve, reject) => {
    loadModules([
      'esri/Graphic',
      'esri/geometry/Point'
    ])
      .then(([Graphic, Point]) => {
        // i assume we don't need to reload graphic from esri


        let graphics = [];
        featureSet.features.forEach((feature) => {
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