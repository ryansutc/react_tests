import React from 'react';
import { loadModules } from 'esri-loader';

function CoordinateWidget(props) {
  return new Promise(resolve => {
    loadModules([
      'esri/widgets/CoordinateConversion']).then(([CoordinateConversion]) => {
        var ccWidget = new CoordinateConversion({
          view: props.view
        });

        return resolve(ccWidget);
      }
    )
  }).catch((err) => console.error(err));
  
}

export default CoordinateWidget;
