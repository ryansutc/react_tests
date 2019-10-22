import React from 'react';
import ReactDOM from 'react-dom';
import { loadModules } from 'esri-loader';
import './App.css';

import SketchGraphicContainer from './SketchGraphicContainer';
import CoordinateWidget from './CoordinateWidget';
import StatusBox from './StatusBox';
import QueryButton from './QueryButton';
import { Map } from '@esri/react-arcgis';

import FeatureLayer from './FeatureLayer';
import { getSymbolForPt, updateSelectedPts, addSamplePts } from './MapUtils';
import { getLengthOfLine, getSampleCoordsForPolyline } from './GeomUtils';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dist: 20,
      map: null,
      view: null,
      featureLayers: [],
      selectedPts: null,
      sketchState: "not started",
      sketchLength: 0,
      samplePtsGeom: null,
      layerLoaded: false,
      samplePtsGraphicsLayer: null, 
      transectLinesGraphicsLayer: null
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
          {this.state.layerLoaded && this.state.samplePtsGraphicsLayer ?
            <QueryButton
              loading={false} //if we've got featureLayers, we're loaded?
              featureLayer={this.state.featureLayers[0]}
              samplePtsGraphicsLayer={this.state.samplePtsGraphicsLayer}
              dist={this.state.dist}
            /> : <div />
          }
          
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
        transectLinesGraphicsLayer={this.state.transectLinesGraphicsLayer}
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
    if (event.state === "complete") {
      if (this.state.sketchState !== "complete") {
        this.setState({ sketchState: "complete" });
        let polylineGeom = event.graphic.geometry.paths[0];
        let samplePtGeoms = getSampleCoordsForPolyline(polylineGeom, this.state.dist);

        this.setState({ samplePtsGeom: samplePtGeoms });
        //add the samplePtGeom coords to map view as graphics
        addSamplePts(samplePtGeoms, this.state.samplePtsGraphicsLayer, this.state.dist);
      }
    }
    if (event.state === "active") {
      if (this.state.sketchState !== "active") {
        this.setState({ sketchState: "active" });
      }
      if (event.toolEventInfo.type === "cursor-update") {
        this.setState({ sketchLength: getLengthOfLine(event.graphic.geometry.paths[0])})
      }
    }

    if (event.state === "cancel") {
      this.setState({ sketchState: "cancel" });
    }

    if (event.state === "start") {
      if (this.state.sketchState !== "start") {
        this.setState({ sketchState: "start" });
        this.state.samplePtsGraphicsLayer.removeAll();
        this.state.transectLinesGraphicsLayer.removeAll();
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
    console.log("create Feature layers called");
    for (var layer in this.featureLayers) {
      featureLayerComponents.push(
        <FeatureLayer key={"1"}
          layerID={this.featureLayers[layer]}
          layerLoaded={this.handleLayersLoaded.bind(this)}
        />)
    }
    return featureLayerComponents
  }

  handleLayersLoaded(featureLayer) {
    console.log("feature layer loaded " + featureLayer);
    this.setState({layerLoaded: true, featureLayers: [featureLayer]});
  }

  handleMapLoad(map, view) {
    loadModules([
      'esri/layers/GraphicsLayer'
    ])
    .then(([GraphicsLayer]) => {
      var samplePtsGraphicsLayer = new GraphicsLayer({
        graphics: [],
        title: "Sample Pt Centroids",
        id: "SamplePts"
      });

      var transectLinesGraphicsLayer = new GraphicsLayer({
        graphics: [],
        title: "Transect Lines",
        id: "TransectLines"
      });

      map.layers.addMany([samplePtsGraphicsLayer, transectLinesGraphicsLayer]);

      console.log('Map Loaded.')
      this.setState({ map: map, view: view, featureLayers: this.featureLayers, 
        samplePtsGraphicsLayer: samplePtsGraphicsLayer,
        transectLinesGraphicsLayer: transectLinesGraphicsLayer
      });
      this.handleViewLoad(view);
    });
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
