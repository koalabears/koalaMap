var timeUntilStation = [1, 0.2, 0.8, 1, 0.1, 0.6, 0.9, 0.7, 0.3, 1, 0.2, 0.8, 1, 0.1, 0.6, 0.9, 0.7, 0.3, 0.4, 0.5, 0, 0.2, 0.8, 1, 0.1, 0.6, 0.9, 0.7, 0.3, 0.4, 0.5, 0.6, 1, 0.8, 0.9, 1];
var blobCoords = createPolygonCoordinates(timeUntilStation);
drawPolygon(blobCoords);

function createPolygonCoordinates(values){
  var angleStep = (2*Math.PI)/values.length;
  return values.map(function(value, valueIndex) {
    var radius = value + 1;
    return [
      (radius*Math.sin(angleStep*valueIndex)+2)*25,
      (radius*Math.cos(angleStep*valueIndex)+2)*25
    ];
  });
}



function drawPolygon(poly){
  var visual = d3.select("#polygon").append("svg")
    .attr("width", 1000)
    .attr("height", 667);

  // var scaleX = d3.scale.linear()
  //   .domain([-2,2])
  //   .range([0,100]);
  //
  // var scaleY = d3.scale.linear()
  //   .domain([-2, 2])
  //   .range([0,100]);
console.log(poly);
 var path = visual.append("path")
  .data([poly])
  .attr("d", d3.svg.line()
    .tension(0.5)
    .interpolate("cardinal-closed")
  );

//
// visual.selectAll("polygon")
//   .data([poly])
//   .enter().append("polygon")
//   .attr("points",function(d) {
//     return d.map(function(d) {
//       return [scaleX(d.x),scaleY(d.y)].join(",");
//     }).join(" ");
//   });
}
