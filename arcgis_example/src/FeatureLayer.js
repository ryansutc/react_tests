import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { getRenderer, labelClass } from './RenderHelpers';

const FeatureLayer = (props) => {
  const [layer, setLayer] = useState(null);
  useEffect(() => {
    if (props.map.layers.length === 0) {
      loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
        const featureLayer = FeatureLayer({
          url: props.layerID,
          renderer: getRenderer(-40, 0, 40), // replace this with dynamic values.
          labelingInfo: [labelClass]
        });

        setLayer(featureLayer);
        props.map.add(layer);
        layer.when(() => {
          props.view.extent = layer.fullExtent;
        })

      }).catch((err) => console.error(err));
    }
    else if (props.map.layers.length > 0) {
      //props.view.extent = props.map.layers[0].fullExtent;
    }

    return () => props.map.remove(props.layer);
  });

  return null;
}

export default FeatureLayer;
