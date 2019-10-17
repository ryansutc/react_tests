This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

### ArcGIS Line Distance Test

This project is a sandbox test to see how we can get the distance of a line drawn in ArcGIS JavaScript API 4x

### Notes:

ArcGIS Javascript API docs:
- ["Intro to Graphics"](https://developers.arcgis.com/javascript/latest/sample-code/intro-graphics/index.html)
- ["Draw Class"](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-draw-Draw.html)


```
"Adding graphics to a GraphicsLayer is convenient when working with features of various geometry types. If working exclusively with graphics of the same geometry type, however, we recommend you use a client-side FeatureLayer to take advantage of its rendering and querying capabilities"
```

```Map``` has layers, incl. 1+ ```GraphicLayer``` which contains 0:m ```Graphic```. 
A GraphicsLayer has a ```.graphics``` property which is an esri Collection.


