var timeUntilStation = [1, 0.2, 0.8, 1, 0.1, 0.6, 0.9, 0.7, 0.3, 1, 0.2, 0.8, 1, 0.1, 0.6, 0.9, 0.7, 0.3, 0.4, 0.5, 0, 0.2, 0.8, 1, 0.1, 0.6, 0.9, 0.7, 0.3, 0.4, 0.5, 0.6, 1, 0.8, 0.9, 1];
var blobCoords = createPolygonCoordinates(timeUntilStation);
drawPolygon(blobCoords);

function createPolygonCoordinates(values){
  var angleStep = (2*Math.PI)/values.length;
  return values.map(function(value, valueIndex) {
    var radius = value + 1;
    return [
      (radius*Math.sin(angleStep*valueIndex)),
      (radius*Math.cos(angleStep*valueIndex))
    ];
  });
}

function ourTransform(vectorArray) {
  return transform2D(vectorArray, [2, 2], [25, 25]);
}

function transform2D(vectorArray, transform, scale) {
  return vectorArray.map(function(vector) {
    return [
      (vector[0] + transform[0]) * scale[0],
      (vector[1] + transform[1]) * scale[1]
    ];
  });
}


function drawPolygon(poly){
  var scaling = 2;

  var container = d3.select("#polygon").append("svg")
    .attr("width", 1000)
    .attr("height", 667);

       var path = container.append("path")
        .data([ourTransform(poly)])
        // .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr("d", d3.svg.line()
          .tension(0.5)
          .interpolate("cardinal-closed")
        );

        poly.forEach(function(coord){
          var line = coord;
          var lineLength = Math.sqrt(line[0]*line[0] + line[1]*line[1]);
          line = [
            (line[0]/lineLength)*scaling,
            (line[1]/lineLength)*scaling
          ];
          var lineToDraw = ourTransform([[0, 0], line]);
          // console.log(data);
          container.append("path")
           .data([lineToDraw])
           .attr('fill', 'transparent')
           .attr('stroke', 'blue')
           .attr('stroke-width', 0.4)
           .attr('id', 'myLine')
           .attr('fill', 'none')
           .style("stroke-opacity", 0.1)
           .attr("d", d3.svg.line()
             .interpolate("linear")
           );
        });
}
