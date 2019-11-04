import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import SketchGraphicContainer from './SketchGraphicContainer'
import { Map } from '@esri/react-arcgis';

import FeatureLayer from './FeatureLayer';
import Controller from './Controller';
import StatsForm from './StatsForm';
import { updateSelectedPts, featuresToGraphics, getSymbolForPt } from './MapUtils';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      view: null,
      featureLayers: [],
      minVal: -40,
      midVal: 0,
      maxVal: 40,
      selectedPts: null,
      selectionStats: null
    };
    this.getSummaryFromSelection = this.getSummaryFromSelection.bind(this);
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleSelectPts = this.handleSelectPts.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleFail = this.handleFail.bind(this);
    this.createFeatureLayers = this.createFeatureLayers.bind(this);
    this.renderViewContent = this.renderViewContent.bind(this);
    this.updateSymbol = this.updateSymbol.bind(this);
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
            zoom: 12
          }}>
          {this.createFeatureLayers()}
          <StatsForm
            selectionStats={this.state.selectionStats}
          />
        </Map>
      </div>
    );
  }

  renderViewContent(view) {
    const node = document.createElement("div");
    const node2 = document.createElement("div");
    view.ui.add(node, "bottom-right");

    ReactDOM.render(
      <SketchGraphicContainer
        map={this.state.map}
        view={this.state.view}
        selectPts={this.selectPts}
        handleSelectPts={this.handleSelectPts}
      />, node);

    view.ui.add(node2, "bottom-left");
    ReactDOM.render(
      <Controller
        onChange={this.updateSymbol}
        minVal={this.state.minVal}
        midVal={this.state.midVal}
        maxVal={this.state.maxVal}
      />, node2);
  }
  handleMapClick(event) {
    this.state.view.hitTest(event).then(response => {

      let features = response.results.filter(result => {
        return result.graphic.layer.layerId === 0
      })
      features.forEach(feature => feature.graphic.symbol = getSymbolForPt(feature));
      if (features.length) {
        this.handleSelectPts([features[0].graphic], event.native.shiftKey);
      }
      else {
        this.handleSelectPts(null, event.native.shiftKey);
      }

    });
  }

  handleSelectPts(newSelection, shift = false) {

    updateSelectedPts(this.state.selectedPts, newSelection, shift).then((updatedSelectedPts) => {
      this.state.view.graphics.removeAll();
      this.state.view.graphics.addMany(updatedSelectedPts);
      this.setState({ selectedPts: updatedSelectedPts });
      this.setState({ selectionStats: this.getSummaryFromSelection(updatedSelectedPts) });

    });
  }

  /**
   * Returns an object with {count: 5, min: 10, max:35, avg:15} structure for pt data
   * @param {graphics} selectedPtGraphics array of Graphics 
   */
  getSummaryFromSelection(selectedPtGraphics) {
    let count = 0;
    let max = -999;
    let min = 999;
    let total = 0;

    if (!selectedPtGraphics.items || !selectedPtGraphics.items.length) {
      return null;
    }

    for (var graphic of selectedPtGraphics.items) {
      let val = graphic.attributes.value;
      count += 1;
      max = val > max ? val : max;
      min = val < min ? val : min;
      total += val;
    }

    return { "count": count, "min": min, "max": max, "avg": total / count }

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
