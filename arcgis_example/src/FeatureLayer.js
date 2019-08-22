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
          renderer: getRenderer(props.minVal, props.midVal, props.maxVal), // replace this with dynamic values.
          labelingInfo: [labelClass]
        });

        setLayer(featureLayer);
        props.map.add(layer);
        featureLayer.when(() => {
          props.view.extent = featureLayer.fullExtent;
        })

      }).catch((err) => console.error(err));
    }
    else if (props.map.layers.length > 0) {
      props.map.layers.items[0].renderer = getRenderer(props.minVal, props.midVal, props.maxVal)
    }

    return () => props.map.remove(props.layer);
  });

  return null;
}

export default FeatureLayer;
