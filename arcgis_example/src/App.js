import React from 'react';
import './App.css';
import { Map } from '@esri/react-arcgis';
import { loadModules } from '@esri/react-arcgis';
import FeatureLayer from './FeatureLayer';

const loaderOptions = { url: 'http://js.arcgis.com/4.11' };

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      view: null,
      status: 'loading',
      layer: null
    };

    this.handleMapLoad = this.handleMapLoad.bind(this);
  }

  render() {

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <Map
          mapProperties={{
            basemap: 'hybrid',
            layers: this.props.layers,
            loaderOptions: { loaderOptions }
          }}
          viewProperties={{
            center: [-123.2, 49.32],
            zoom: 11
          }}
        >
          <FeatureLayer />
        </Map>
      </div>
    );
  }

  handleMapLoad(map, view) {
    if (this.props.layer) {
      console.log("we've got a layer, so we're good it")
    }
    else {
      console.log("we need to get a layer")
    }
  }
}

export default App;
