import { useState, useEffect } from 'react';
import { loadModules } from '@esri/react-arcgis';


const FeatureLayer = (props) => {
  const [layers, setLayer] = useState([]);
  useEffect(() => {
    loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
      const mylayer = new FeatureLayer({
        url: "https://services8.arcgis.com/vVBb77z9fDbXITgG/ArcGIS/rest/services/SamplePoints/FeatureServer/0",
        outFields: ["value"]
      })

      setLayer([mylayer]);
      props.map.layers = [mylayer];
      props.view.map = props.map;
    })


    return () => props.view = null;
  }) // end useEffect

  return null;
}

export default FeatureLayer;