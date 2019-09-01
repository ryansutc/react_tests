import React from 'react';
import { loadModules } from 'esri-loader';
import { getRenderer, labelClass } from './RenderHelpers';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import { featureSetToGraphics } from './MapUtils';

class SketchGraphic extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.onClick = this.onClick.bind(this);
    this.loadSketchViewLayers = this.loadSketchViewLayers.bind(this);
    this.selectFeatures = this.selectFeatures.bind(this);
    this.SketchViewModel = null;
    this.graphicsLayer = null;
    this.loadSketchViewLayers();

  }

  loadSketchViewLayers() {
    loadModules([
      'esri/widgets/Sketch/SketchViewModel',
      'esri/layers/GraphicsLayer',
      'esri/geometry'
    ])
      .then(([SketchViewModel, GraphicsLayer, geometry]) => {
        this.graphicsLayer = new GraphicsLayer();
        this.props.map.add(this.graphicsLayer);

        this.sketchViewModel = new SketchViewModel({
          view: this.props.view,
          layer: this.graphicsLayer
        });

        this.sketchViewModel.on("create", function(event) {
          if (event.state === "complete") {
            this.graphicsLayer.remove(event.graphic);
            this.selectFeatures(event.graphic.geometry);
          }
        }.bind(this));
      })
  }

  selectFeatures(geometry) {
    console.log("select features!");
    let ptsLayer = this.props.map.layers.items[0];
    ptsLayer.queryFeatures({
      geometry: geometry,
      spatialRelationship: "intersects",
      distance: 1,
      returnGeometry: true,
      outFields: ["pt_id"]
    })
      .then((featureSet) => {
        featureSetToGraphics(featureSet).then((graphics) => {
          for (var graphic of graphics) {
            this.props.view.graphics.add(graphic);
          }
        });
      })
  }

  onClick() {
    this.sketchViewModel.create("rectangle");
  }
  render() {
    return (
      <Fab color="secondary" aria- label="edit"
        onClick={this.onClick}
      >
        <EditIcon />
      </Fab >
    )
  }
}

export default SketchGraphic;