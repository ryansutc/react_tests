function getCoordsViaDegrees(x1, y1, angle, length=25) {
  var x2 = x1 + length * Math.cos(Math.PI * angle / 180.0)
  var y2 = y1 + length * Math.sin(Math.PI * angle / 180.0);
  return [x2, y2]
}

if (!SVG.supported) throw new Error("SVG is not supported!");
var draw = SVG('main').size(300, 300);
var rect = draw.rect(100, 100).attr({ fill: '#f06' });



var path = draw.path('m 25 50 a 25 25 0 1 1 50 0 a 25 25 0 1 1 -50 0');

var lineStart = [50,50];
var angle = 0;
var lineEnd = getCoordsViaDegrees(lineStart[0], lineStart[1], angle);
console.log(lineEnd);

var line = draw.line(`${lineStart.toString()},${lineEnd.toString()}`).stroke({ width: 1 })
path.fill('none');
path.stroke("black")




