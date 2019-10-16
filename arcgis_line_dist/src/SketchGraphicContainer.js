import React from 'react';
import { loadModules } from 'esri-loader';
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
      'esri/Graphic',
      'esri/geometry',
      'esri/core/Collection'
    ])
      .then(([SketchViewModel, GraphicsLayer, Graphic, geometry, Collection]) => {
        this.setState({ loading: false }); //change ui now that esri libraries are loaded
        this.graphicsLayer = new GraphicsLayer();
        this.props.map.add(this.graphicsLayer);

        // NEW: Create a Line:
        var polylineGeom = {
          type: "polyline", // autocasts as new Polyline()
          paths: [[ -44, 63], [-49, 67], [-45, 63.7]]
        };
        // Create a symbol for drawing the line
        var lineSymbol = {
          type: "simple-line", // autocasts as SimpleLineSymbol()
          color: [226, 119, 40],
          width: 4
        };

        var polylineGraphic = new Graphic({
          geometry: polylineGeom,
          symbol: lineSymbol,
        });
        this.props.view.graphics.add(polylineGraphic);

        this.sketchViewModel = new SketchViewModel({
          view: this.props.view,
          layer: this.graphicsLayer
        });

        this.sketchViewModel.on("create", function(event) {
          //when we do mouse up on the rectangle draw, lets check if shift was pressed
          let root = document.getElementById("root").addEventListener("mouseup", this.shiftClickListener, { once: true });
          if (event.state === "complete") {
            //this.graphicsLayer.remove(event.graphic);
          }

          if (event.state === "cancel") {
            console.log("selection was cancelled");
            document.getElementById("root").removeEventListener("mouseup", this.shiftClickListener.bind(this));
          }
        }.bind(this));
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