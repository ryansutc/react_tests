import React from 'react';
import { loadModules } from 'esri-loader';
import { getRenderer, labelClass } from './RenderHelpers';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';

import { featuresToGraphics } from './MapUtils';


class SketchGraphic extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.onClick = this.onClick.bind(this);
    this.loadSketchViewLayers = this.loadSketchViewLayers.bind(this);
    this.shiftClickListener = this.shiftClickListener.bind(this);
    this.selectFeatures = this.selectFeatures.bind(this);
    this.SketchViewModel = null;
    this.graphicsLayer = null;
    this.loadSketchViewLayers();

    this.shift = false;
    this.state = {
      loading: true
    }
  }

  loadSketchViewLayers() {
    loadModules([
      'esri/widgets/Sketch/SketchViewModel',
      'esri/layers/GraphicsLayer',
      'esri/geometry',
      'esri/core/Collection'
    ])
      .then(([SketchViewModel, GraphicsLayer, geometry, Collection]) => {
        this.setState({ loading: false }); //change ui now that esri libraries are loaded
        this.graphicsLayer = new GraphicsLayer();
        this.props.map.add(this.graphicsLayer);

        this.sketchViewModel = new SketchViewModel({
          view: this.props.view,
          layer: this.graphicsLayer
        });

        this.sketchViewModel.on("create", function(event) {
          //when we do mouse up on the rectangle draw, lets check if shift was pressed
          let root = document.getElementById("root").addEventListener("mouseup", this.shiftClickListener, { once: true });
          if (event.state === "complete") {
            this.graphicsLayer.remove(event.graphic);
            this.selectFeatures(event.graphic.geometry);
          }

          if (event.state === "cancel") {
            console.log("selection was cancelled");
            document.getElementById("root").removeEventListener("mouseup", this.shiftClickListener.bind(this));
          }
        }.bind(this));
      })
  }

  selectFeatures(geometry) {
    /**
     * selectingFeatures from sketch geom is 3 steps:
     *  - get featureSet records from an an ArcGIS REST spatial qeury call
     *  - convert featureSet to ESRI Collection of graphics 
     *  - replace, or update view.graphics collection from new selection
     */

    this.props.view.graphics.removeAll()
    let ptsLayer = this.props.map.layers.items[0];
    ptsLayer.queryFeatures({
      geometry: geometry,
      spatialRelationship: "intersects",
      distance: 1, //should be scale based
      returnGeometry: true,
      outFields: ["pt_id"]
    })
      .then((featureSet) => {
        featuresToGraphics(featureSet.features).then((graphics) => {
          this.props.handleSelectPts(graphics, this.shift)
        });
      })
  }

  onClick() {
    this.sketchViewModel.create("rectangle");
  }
  render() {
    if (this.state.loading === false) {
      return (
        <Fab color="secondary" label="edit"
          onClick={this.onClick}
        >
          <EditIcon />
        </Fab >
      )
    }
    else {
      return (
        <div>
          <CircularProgress />
        </div>
      )
    }
  }

  shiftClickListener(event) {
    this.shift = event.shiftKey;

    if (event.ctrlKey) {
      console.log("control key was pressed");
    }
  }
}

export default SketchGraphic;