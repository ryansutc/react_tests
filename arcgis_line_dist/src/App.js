import React from 'react';
import ReactDOM from 'react-dom';
import { loadModules } from 'esri-loader';
import './App.css';

import SketchGraphicContainer from './SketchGraphicContainer';
import CoordinateWidget from './CoordinateWidget';
import StatusBox from './StatusBox';
import QueryButton from './QueryButton';
import BufferButton from './BufferButton';
import DummyDataGrabber from './DummyDataGrabber';
import { Map } from '@esri/react-arcgis';

import FeatureLayer from './FeatureLayer';
import { getSymbolForPt, updateSelectedPts, addSamplePts } from './MapUtils';
import { getLengthOfLine, getSampleCoordsForPolyline } from './GeomUtils';
import {generateTransectGraphicsAndChart, generateTransectGraphicsAndChart_v2} from './transectToolUtil';
import { loadGraphicsLayers } from './GraphicsLayerUtils';
import {projectToLatLong} from './GeomUtils';
import moment from "moment";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dist: 40, 
      map: null,
      view: null,
      featureLayers: [],
      selectedPts: null,
      sketchState: "not started",
      sketchLength: 0,
      samplePtsGeom: null,
      layerLoaded: false,
      transectPtIds: null,
      transectPtData: null
    };

    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleFail = this.handleFail.bind(this);
    this.createFeatureLayers = this.createFeatureLayers.bind(this);
    this.renderViewContent = this.renderViewContent.bind(this);
    this.featureLayers = ["https://services8.arcgis.com/vVBb77z9fDbXITgG/ArcGIS/rest/services/SamplePoints/FeatureServer/0"]; //["http://35.182.66.117:6080/arcgis/rest/services/motionary2_public_dev/lapaz_disp/MapServer/0"]; 
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
            center: [-123.1257, 49.249], //[-68.1,-16.5]
            zoom: 4
          }}>
          {this.createFeatureLayers()}

          <StatusBox
            status={this.state.sketchState}
            distance={Math.round(this.state.sketchLength)}
          />

         {this.state.layerLoaded ?
            <SketchGraphicContainer
              map={this.state.map}
              view={this.state.view}
              selectPts={this.selectPts}
              handleSelectPts={this.handleSelectPts}
              create={this.handleSketchCreate.bind(this)}
              measure={this.handleMeasure.bind(this)}
              samplePtsGeom={this.state.samplePtsGeom}
              transectLinesGraphicsLayer={this.state.map.findLayerById("transectLines")}
            />
            : <div />
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
        let xyGuy = projectToLatLong(event.graphic.geometry).then((xyGuy) => {
          console.log(xyGuy);
        });
        let polylineGeom = event.graphic.geometry.paths[0];
        let samplePtGeoms = getSampleCoordsForPolyline(polylineGeom, this.state.dist);

        this.setState({ samplePtsGeom: samplePtGeoms });
        //add the samplePtGeom coords to map view as graphics
        let startTime = new Date();
        console.log(startTime);
        generateTransectGraphicsAndChart_v2(
          this.state.view, 
          samplePtGeoms, 
          this.state.dist,
          this.state.sketchLength
        ).then(results => {
          let ptIdData = results[0];
          let transectPtData = results[1];
          // totals pt_ids in all buffers
          
          let allPtIds = ptIdData.reduce((pt_ids = 0, ptIdGroup) => pt_ids += parseInt(ptIdGroup.pt_ids.length), 0); 

          if(allPtIds) {
            // we have at least 1 displacement pt somewhere along our transect:
            this.setState({
              transectPtIds: ptIdData,
              transectPtData: transectPtData
            });
            let endTime = new Date();
            console.log(endTime);
            alert(`complete! ${allPtIds} Points analyzed for ${transectPtData.length} transects in ${moment(endTime).diff(startTime, "seconds")} seconds`);
          } 
          else {
            // handle no data selected:
            this.props.enqueueSnackbar(
              "No points available along transect. You could try increasing the buffer size or you may need to move/zoom to an area of the map with point data.",
              { variant: "warning" }
            );
            this.setState({transectPtIds: null, transectPtData: null});
          // we do NOT remove transect graphics or deactivate TransectTools b/c user still could adjust buffer area
          }
        });
      }
    }
    if (event.state === "active") {
      if (this.state.sketchState !== "active") {
        this.setState({ sketchState: "active" });
      }
      if (event.toolEventInfo.type === "cursor-update") {
        this.setState({ sketchLength: getLengthOfLine(event.graphic.geometry.paths[0]) })
      }
    }

    if (event.state === "cancel") {
      this.setState({ sketchState: "cancel" });
    }

    if (event.state === "start") {
      if (this.state.sketchState !== "start") {
        this.setState({ sketchState: "start" });
        this.state.map.findLayerById("samplePts").removeAll();
        this.state.map.findLayerById("transectLines").removeAll();
        this.state.map.findLayerById("bufferPts").removeAll();
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
        />
      )
    }
    return featureLayerComponents
  }

  handleLayersLoaded(featureLayer) {
    console.log("feature layer loaded " + featureLayer);
    this.setState({ layerLoaded: true, featureLayers: [featureLayer] });
  }

  handleMapLoad(map, view) {
    loadGraphicsLayers(map);

    this.setState({
      map: map, view: view, featureLayers: this.featureLayers
    });
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
