import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import SketchGraphicContainer from './SketchGraphicContainer'
import { Map } from '@esri/react-arcgis';

import FeatureLayer from './FeatureLayer';
import Controller from './Controller';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      view: null,
      featureLayers: [],
      minVal: -40,
      midVal: 0,
      maxVal: 40
    };

    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleFail = this.handleFail.bind(this);
    this.createFeatureLayers = this.createFeatureLayers.bind(this);
    this.updateSymbol = this.updateSymbol.bind(this);
    this.featureLayers = ["https://services8.arcgis.com/vVBb77z9fDbXITgG/ArcGIS/rest/services/SamplePoints/FeatureServer/0"];
  }

  render() {

    console.log("map is rendering: " + this.state)
    return (
      <div style={{ width: '100vw', height: '90vh' }}>
        <Map
          onLoad={this.handleMapLoad}
          onFail={this.handleFail}
          mapProperties={{
            basemap: 'dark-gray',
          }}
          loadElement={"loading spacecraft..."}
          viewProperties={{
            center: [-123.1257, 49.249],
            zoom: 12
          }}>
          {this.createFeatureLayers()}
          <Controller
            onChange={this.updateSymbol}
            minVal={this.state.minVal}
            midVal={this.state.midVal}
            maxVal={this.state.maxVal}
          />
        </Map>

      </div>
    );
  }

  createFeatureLayers() {
    let featureLayerComponents = []
    for (var layer in this.state.featureLayers) {
      featureLayerComponents.push(
        <FeatureLayer key={"1"}
          layerID={this.state.featureLayers[layer]}
          minVal={this.state.minVal}
          midVal={this.state.midVal}
          maxVal={this.state.maxVal}
          hide={true} />)
    }
    return featureLayerComponents
  }

  updateSymbol(e) {
    this.setState({ [e.target.id]: parseInt(e.target.value) })
    console.log(e.target.value);
  }

  handleMapLoad(map, view) {
    console.log('Map Loaded.')
    this.setState({ map: map, view: view, featureLayers: this.featureLayers })
    this.handleViewLoad(view);
  }

  handleViewLoad(view) {
    view.when(() => {
      console.log("handleViewLoad is being run");
      const node = document.createElement("div");
      view.ui.add(node, "bottom-right")
      ReactDOM.render(
        <SketchGraphicContainer
          map={this.state.map}
          view={this.state.view}
        />, node);
    })
  }

  handleFail(e) {
    console.error(e);
    this.setState({ status: 'failed' });
  }
}

export default App;
