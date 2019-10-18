

//###################

const dummyGeom = [
  [-10, 0],
  [10, 5],
  [10, 10]
];
const sampleDist = 10;
const polylineLength = getLengthOfLine(dummyGeom);
let sampleDists = getSampleDistsForLength(polylineLength, sampleDist);
let sampleCoords = getSampleCoordsForPolyline(dummyGeom, sampleDist);
console.log("Length of Line: " + polylineLength);
console.log("sample dist: " + sampleDist);
console.log("Sample dists for line: " + sampleDists);
console.log("Sample coords are: " + JSON.stringify(sampleCoords));
// console.log(getCoordsAlongVector(
//   dummyGeom[0],
//   dummyGeom[1],
//   8
// ));