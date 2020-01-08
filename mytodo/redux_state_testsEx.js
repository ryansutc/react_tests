import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import * as reducers from "./ducks";
import thunkMiddleware from "redux-thunk";
import { apiService } from "./middleware";

export default function configureStore(initialState) {
  const rootReducer = combineReducers(reducers);

  /**
   * Convert complex action payload objects (Map, View, Scene, ToolDrawer)
   * to blobs for improved performance.
   * @param {*} action 
   */
  const actionSanitizer = action => {
    let sanitizedAction = action;
    if (
      (action.type === "map/ADD_MAP" ||
        action.type === "map/ADD_VIEW" ||
        action.type === "threeDScene/ADD_SCENE" ||
        action.type === "threeDScene/ADD_SCENE_VIEW" ||
        action.type === "toolDrawer/tools/SET_ANCHOR_ELEMENT") &&
      action.payload
    ) {
      sanitizedAction = { ...action, payload: "<<LONG_BLOB>>" };
    }
    // if (action.type === "drawer/tools/SET_ANCHOR_ELEMENT") {
    //   sanitizedAction = {...action, anchorElement: "<<ANCHOR_ELEMENT>>"}
    // }

    return sanitizedAction;
  };

  /**
   * Convert complex redux state properties from objects
   * to blobs for better performance
   * @param {*} state 
   */
  const stateSanitizer = state => {
    let sanitizedState = state;
    if (sanitizedState.map) {
      sanitizedState = {
        ...sanitizedState,
        map: {
          ...sanitizedState.map,
          map: sanitizedState.map.map
            ? "<<LONG_BLOB>>"
            : sanitizedState.map.map,
          view: sanitizedState.map.view
            ? "<<LONG_BLOB>>"
            : sanitizedState.map.view,
          graphicsLayers: Object.keys(
            sanitizedState.map.graphicsLayers
          ), // just show the keys as an array
          sketchViewModels: Object.keys(
            sanitizedState.map.sketchViewModels
          )
        }
      };
    }
    if (sanitizedState.threeDScene) {
      sanitizedState = {
        ...sanitizedState,
        threeDScene: {
          ...sanitizedState.threeDScene,
          scene: sanitizedState.threeDScene.scene
            ? "<<LONG BLOB>>"
            : sanitizedState.threeDScene.scene,
          sceneView: sanitizedState.threeDScene.sceneView
            ? "<<LONG BLOB>>"
            : sanitizedState.threeDScene.sceneView
        }
      };
    }
    return sanitizedState;
  }

  const middlewares = [apiService, thunkMiddleware];

  let devTools; 
  if (process.env.NODE_ENV === "development" && process.env.REACT_APP_ENV !== "test" &&  window.__REDUX_DEVTOOLS_EXTENSION__) { // REACT_APP_ENV is set to 'test' when running with Selenium testing
    devTools = compose(
      applyMiddleware(...middlewares),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
        actionSanitizer,
        stateSanitizer
      })
    );
  }
  else {
    devTools = applyMiddleware(...middlewares);
  }      

  return createStore(rootReducer, initialState, devTools);
}
