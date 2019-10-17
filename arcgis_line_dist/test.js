function getLengthOfLine(geom) {
  let deltaX = geom[0][0] - geom[1][0];
  let deltaY = geom[0][1] - geom[1][1];

  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}

const dummyGeom1 = [
  [-13706264.797979908, 6317287.498162713],
  [-13706283.01149055, 6317333.031939314]
];

const dummyGeom = [
  [-10, 0],
  [10, 0]
];

console.log(getLengthOfLine(dummyGeom1));