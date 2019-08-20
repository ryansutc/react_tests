import React from 'react';
import './App.css';
import { Map } from '@esri/react-arcgis';

import FeatureLayer from './FeatureLayer';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      view: null,
      featureLayers: []
    };

    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleFail = this.handleFail.bind(this);
    this.createFeatureLayers = this.createFeatureLayers.bind(this);
    this.featureLayers = ["https://services8.arcgis.com/vVBb77z9fDbXITgG/ArcGIS/rest/services/SamplePoints/FeatureServer/0"];
  }

  render() {
    console.log("map is rendering: " + this.state)
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <Map
          onLoad={this.handleMapLoad}
          onFail={this.handleFail}
          mapProperties={{
            basemap: 'dark-gray',
          }}
          viewProperties={{
            center: [-123.1257, 49.249],
            zoom: 17
          }}>
            { this.createFeatureLayers() }
        </Map>
      </div>
    );
  }

  createFeatureLayers(){
    let featureLayerComponents = []
    for (var layer in this.state.featureLayers) {
      featureLayerComponents.push(<FeatureLayer layerID={ this.state.featureLayers[layer] }/>)
    }
    return featureLayerComponents
  }


  handleMapLoad(map, view) {
    console.log('Map Loaded.')
    this.setState({ map: map, view: view, featureLayers: this.featureLayers });
  }

  handleFail(e) {
    console.error(e);
    this.setState({ status: 'failed' });
  }
}

export default App;
