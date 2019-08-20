import * as React from 'react';
import { loadModules } from 'esri-loader';

class FeatureLayer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        layer: null
      };
    } 
    render() {
      return null;
    }
  
    componentWillMount() {
      loadModules(['esri/layers/FeatureLayer']).then(([ FeatureLayer ]) => {
          const featureLayer = FeatureLayer({
            url: this.props.layerID
          });
          this.setState({layer: featureLayer});
          this.props.map.add(this.state.layer); 
        } 
      ).catch((err) => console.error(err));
    }
  
    componentWillUnmount() {
      this.props.map.remove(this.state.featureLayer);
    }
  }
  
  export default FeatureLayer;
