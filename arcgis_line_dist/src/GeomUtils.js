import { loadModules } from 'esri-loader';

export function getLengthOfLine(geom) {
  let polylineLen = 0;

  for (var i = 1; i < geom.length; i++) {
    let deltaX = geom[i - 1][0] - geom[i][0];
    let deltaY = geom[i - 1][1] - geom[i][1];
    polylineLen += Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

  }
  return polylineLen;
}

function getCoordsAlongVector(coord1, coord2, distAlong) {
  if (distAlong === 0) return coord1;
  const x = 0;
  const y = 1;
  const distRatio = distAlong / getLengthOfLine([coord1, coord2]);
  let xDiff = coord1[x] - coord2[x];
  let yDiff = coord1[y] - coord2[y];

  const newX = (1 - distRatio) * coord1[x] + (coord2[x] * distRatio);
  const newY = (1 - distRatio) * coord1[y] + (coord2[y] * distRatio);

  return [newX, newY];

}

/**
 * Take a length value and return array of interval vals within it
 * @param {number} length length of polyline 
 * @param {number} interval interval value for sample pt
 * 
 * @returns {number[]} sampleDists[] as array
 */
function getSampleDistsForLength(length, interval) {
  let i = 0;
  let sampleDists = [];
  while (i < length) {
    sampleDists.push(i);
    i += interval;
  }
  // could be option to explictly add total of length here. -rs

  return sampleDists;
}

/**
 * Get SamplePts along a polyline at a set interval
 * @param {number[][]} polylineGeom 
 * @param {number} interval 
 * 
 * @returns {number[][]} coordinates as an array[][]
 */
export function getSampleCoordsForPolyline(polylineGeom, interval) {
  let vStart = 0; //id of vertice start
  let vEnd = 1; // id of vertice end
  let sampleCoords = []; // array of samplePt Coordinates along polyline
  let accumLen = 0; //
  const polylineLength = getLengthOfLine(polylineGeom);
  let sampleDists = getSampleDistsForLength(polylineLength, interval);
  if (!sampleDists.length) throw "sampleDists is an empty array!";

  while (vEnd < polylineGeom.length) { //loop through vertices
    if (!sampleDists.length) break;
    let verticeLen = getLengthOfLine(polylineGeom.slice(vStart, vEnd + 1)); // len of current vertice
    if ((verticeLen + accumLen) > sampleDists[0]) {
      // we've got a new samplePt to add:
      let distAlong = sampleDists[0] - accumLen;

      // add a sampleCoord to array:
      sampleCoords.push(getCoordsAlongVector(
        [polylineGeom[vStart][0], polylineGeom[vStart][1]],
        [polylineGeom[vEnd][0], polylineGeom[vEnd][1]],
        distAlong
      ));

      // remove pt from start of sampleDists
      sampleDists.shift();
    }
    else {
      // no sampleDists between vertice left, go to next vertice:
      accumLen += verticeLen;
      vStart++;
      vEnd++;
    }
  }

  return sampleCoords;
}

export function projectGeom2(geom) {
  return new Promise((resolve) => {
    loadModules([
      'esri/tasks/GeometryService',
      'esri/geometry/SpatialReference',
      'esri/tasks/support/ProjectParameters'
    ]).then(([GeometryService, SpatialReference, ProjectParameters]) => {
      var geomSer = new GeometryService({
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer'
      });

      var params = new ProjectParameters({
        geometries: [geom],
        outSpatialReference: new SpatialReference({ wkid: 102100 }),
        transformation: null
      })

      geomSer.project(params).then((projGeom) => {
        return resolve(projGeom);
      });
    }).catch((err) => console.error(err));
  })

}

/**
 * Converts WGS coords to Lat/Long
 * @param {} geom 
 */
export function projectToLatLong(geom) {
  return new Promise((resolve) => {
    loadModules([
      "esri/geometry/support/webMercatorUtils"
    ]).then(([webMercatorUtils]) => {
      let geomLatLong = webMercatorUtils.webMercatorToGeographic(geom);
      return resolve(geomLatLong);

    })
  }).catch(err => console.error(err));
}

/** 
 * Converts Lat/Long to WGS XY coords
 */
export function projectToXY(geom) {
  return new Promise((resolve) => {
    loadModules([
      "esri/geometry/support/webMercatorUtils"
    ]).then(([webMercatorUtils]) => {
      let geomXY = webMercatorUtils.geographicToWebMercator(geom);
      return resolve(geomXY);
    })
  }).catch(err => console.error(err));
}