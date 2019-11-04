import React from 'react';
import { loadModules } from 'esri-loader';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';


class SketchGraphic extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.onClick = this.onClick.bind(this);
    this.loadSketchViewLayers = this.loadSketchViewLayers.bind(this);
    this.shiftClickListener = this.shiftClickListener.bind(this);
    this.SketchViewModel = null;
    this.loadSketchViewLayers();

    this.shift = false;
    this.state = {
      loading: true
    }
  }

  loadSketchViewLayers() {
    loadModules([
      'esri/widgets/Sketch/SketchViewModel',
      'esri/layers/GraphicsLayer'
    ])
      .then(([SketchViewModel, GraphicsLayer, ]) => {
        this.setState({ loading: false }); //change ui now that esri libraries are loaded
  
        this.sketchViewModel = new SketchViewModel({
          view: this.props.view,
          layer: this.props.transectLinesGraphicsLayer,
          enableRotation: false,
          updateOnGraphicClick: false,
        });

        this.sketchViewModel.on("create", this.props.create);

      });

  }

  
  onClick() {
    this.sketchViewModel.create("polyline");
  }
  render() {
    console.log("render called for sketchViewContainer");
      
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