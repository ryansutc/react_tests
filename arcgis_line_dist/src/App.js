import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import SketchGraphicContainer from './SketchGraphicContainer';
import CoordinateWidget from './CoordinateWidget';
import StatusBox from './StatusBox';
import { Map } from '@esri/react-arcgis';

import FeatureLayer from './FeatureLayer';
import { getSymbolForPt, updateSelectedPts } from './MapUtils';
import { getLengthOfLine, getSampleCoordsForPolyline} from './GeomUtils';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      view: null,
      featureLayers: [],
      selectedPts: null,
      sketchState: "not started",
      sketchLength: 0,
      samplePtsGeom: null
    };

    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleFail = this.handleFail.bind(this);
    this.createFeatureLayers = this.createFeatureLayers.bind(this);
    this.renderViewContent = this.renderViewContent.bind(this);
    this.featureLayers = ["https://services8.arcgis.com/vVBb77z9fDbXITgG/ArcGIS/rest/services/SamplePoints/FeatureServer/0"];
  }

  render() {
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <Map
          onLoad={this.handleMapLoad}
          onFail={this.handleFail}
          mapProperties={{
            basemap: 'dark-gray',
          }}
          loadElement={"loading spacecraft..."}
          viewProperties={{
            center: [-123.1257, 49.249],
            zoom: 4
          }}>
          {this.createFeatureLayers()}

          <StatusBox
            status={this.state.sketchState}
            distance={this.state.sketchLength}
          />
        </Map>
      </div>
    );
  }
  /**
   * This method fires once the map view is loaded & ready.
   * It adds widgets and items to view
   * @param {*} view 
   */
  renderViewContent(view) {
    const node_br = document.createElement("div");
    view.ui.add(node_br, "bottom-right");

    ReactDOM.render(
      <SketchGraphicContainer
        map={this.state.map}
        view={this.state.view}
        selectPts={this.selectPts}
        handleSelectPts={this.handleSelectPts}
        create={this.handleSketchCreate.bind(this)}
        measure={this.handleMeasure.bind(this)}
        samplePtsGeom={this.state.samplePtsGeom}
      />, node_br
    );

    CoordinateWidget({
      map: this.state.map,
      view: this.state.view
    }).then((ccWidget) => {
      view.ui.add(ccWidget, "bottom-left")
    });
  }

  handleMapClick(event) {
    this.state.view.hitTest(event).then(response => {
      if (response.results.length) {
        let features = response.results.filter(result => {
          return result.graphic.layer.layerId === 0
        })
        features.forEach(feature => feature.graphic.symbol = getSymbolForPt(feature));
        this.handleSelectPts([features[0].graphic], event.native.shiftKey);
      }
    });
  };

  handleMeasure(event) {
    console.log("handle measure is firing!");
    console.log(getLengthOfLine(event.graphic.geometry.paths[0]));
  }

  handleSketchCreate(event) {
    console.log("sketch Create called");
    if (event.state === "complete") {
      if (this.state.sketchState !== "complete") {
        this.setState({ sketchState: "complete" });
        let polylineGeom = event.graphic.geometry.paths[0];
        let samplePts = getSampleCoordsForPolyline(polylineGeom, 20);
        //this.state.view.graphics.addMany(updatedSelectedPts)
        this.setState({samplePtsGeom: samplePts});
      }

    }
    if (event.state === "active") {
      if (this.state.sketchState !== "active") {
        this.setState({ sketchState: "active" });
      }
      if(event.toolEventInfo.type === "cursor-update") {
        this.setState({sketchLength: getLengthOfLine(event.graphic.geometry.paths[0]) })
      }
    }

    if (event.state === "cancel") {
      this.setState({ sketchState: "cancel" });
    }

    if (event.state === "start") {
      if (this.state.sketchState !== "start") {
        this.setState({ sketchState: "start"});
      }
    }
  }

  handleSelectPts(newSelection, shift = false) {

    updateSelectedPts(this.state.selectedPts, newSelection, shift).then((updatedSelectedPts) => {
      this.state.view.graphics.removeAll();
      this.state.view.graphics.addMany(updatedSelectedPts)
      this.setState({ selectedPts: updatedSelectedPts })
    });
  }

  createFeatureLayers() {
    let featureLayerComponents = []
    for (var layer in this.state.featureLayers) {
      featureLayerComponents.push(
        <FeatureLayer key={"1"}
          layerID={this.state.featureLayers[layer]}
        />)
    }
    return featureLayerComponents
  }


  handleMapLoad(map, view) {
    console.log('Map Loaded.')
    this.setState({ map: map, view: view, featureLayers: this.featureLayers })
    this.handleViewLoad(view);
  }

  handleViewLoad(view) {
    view.when(() => {
      view.on("click", this.handleMapClick);
      this.renderViewContent(view);
    })
  }

  handleFail(e) {
    console.error(e);
    this.setState({ status: 'failed' });
  }
}



export default App;
