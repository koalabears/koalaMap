var socket = io();

socket.on('update poly', function(poly){
  var newPoly = poly;
  console.log(newPoly);
});

setInterval(getTFLArrivals(handleArrivalData), 3000);

function getTFLArrivals(callback) {
  var arrivalDataRequest = new XMLHttpRequest();
  arrivalDataRequest.open('GET', '/arrivalData');
  arrivalDataRequest.onreadystatechange = function() {
    var arrivalDataStatusCode = arrivalDataRequest.status;
    if (arrivalDataRequest.readyState === 4) {
      if (arrivalDataStatusCode === 200) {
        callback(JSON.parse(arrivalDataRequest.responseText));
      } else {
        console.log('request failed with status code' + arrivalDataStatusCode);
      }
    }
  };
  arrivalDataRequest.send();
}

function handleArrivalData(arrivalData) {
  console.log(arrivalData);
  var blobCoordinates = createPolygonCoordinates(arrivalData);
  console.log(blobCoordinates);
  drawPolygon(blobCoordinates);
}

// var timeUntilStation = [1, 0.2, 0.8, 1, 0.1, 0.6, 0.9, 0.7, 0.3, 1, 0.2, 0.8, 1, 0.1, 0.6, 0.9, 0.7, 0.3, 0.4, 0.5, 0, 0.2, 0.8, 1, 0.1, 0.6, 0.9, 0.7, 0.3, 0.4, 0.5, 0.6, 1, 0.8, 0.9, 1];
// var blobCoords = createPolygonCoordinates(timeUntilStation);
// drawPolygon(blobCoords);


function createPolygonCoordinates(values) {
  console.log('values', values);
  var angleStep = (2 * Math.PI) / values.length;
  return values.map(function(value, valueIndex) {
    var radius = value + 1;
    return [
      (radius * Math.sin(angleStep * valueIndex)), (radius * Math.cos(angleStep * valueIndex))
    ];
  });
}

function ourTransform(vectorArray) {
  return transform2D(vectorArray, [2.5, 2.5], [120, 120]);
}

function transform2D(vectorArray, transform, scale) {
  return vectorArray.map(function(vector) {
    return [
      (vector[0] + transform[0]) * scale[0], (vector[1] + transform[1]) * scale[1]
    ];
  });
}


function drawPolygon(poly) {
  var scaling = 2.5;

  var container = d3.select("#polygon").append("svg")
    .attr("width", 1000)
    .attr("height", 667);


  var pathFunction = d3.svg.line()
    .x(function(d) {
      return d[0];
    })
    .y(function(d) {
      return d[1];
    })
    .interpolate("cardinal-closed");

  var startData = ourTransform(poly);
  // var
  var newData = poly.map(function(point) {
    return [point[0]*0.5, point[1]*0.5];
  });
  newData = ourTransform(newData);
  var path = container.append("svg:path")
    .attr('id', "oldPath")
    .attr("d", pathFunction(startData));
  // .data([ourTransform(poly)])
  // .enter()
  // .attr('stroke-width', 4)
  // .style("fill", "grey")

  console.log('document: ', document.querySelector('#oldPath'));


  var newPoly = [
    [1, 1],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0.5, 1],
    [0.9, 1.0],
    [10, 10],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ];
  // document.getElementById("oldPath").remove();

  // setTimeout(function() {
    var toChange = d3.select('#oldPath');
    console.log(toChange);
    d3.select('#oldPath')
      .data([newData])
      .transition()
      .ease('linear')
      .duration(5000)
      .attr('d', pathFunction)
      // .transition()
      // .duration(1000);
  // }, 1500);
  // .delay(1500);
  // .transition()
  // .duration(750)
  // .style('fill', 'red')
  // .attr('stroke', 'green');

  // bundle | basis | linear | cardinal is also an option
  // .data([newPoly])

  console.log(d3.select('#oldPath'));
  // container.append("path")
  // .transition()
  // .delay(500)
  // .duration(750)
  // .attr('stroke-width', 4)
  // .style("fill", "pink")
  // .attr("d", d3.svg.line()
  //   .tension(0.5)
  //   .interpolate("cardinal-closed")
  // );


  circlePos = ourTransform([
    [0, 0]
  ])[0];


  container.append("circle")
    .attr("r", 240)
    .attr("cx", circlePos[0])
    .attr('stroke-width', 5)
    .attr('stroke', 'black')
    .attr("cy", circlePos[1])
    .style("fill", "none");

  poly.forEach(function(coord) {
    var line = coord;
    var lineLength = Math.sqrt(line[0] * line[0] + line[1] * line[1]);
    line = [
      (line[0] / lineLength) * scaling, (line[1] / lineLength) * scaling
    ];
    var lineToDraw = ourTransform([
      [0, 0], line
    ]);
    container.append("path")
      .data([lineToDraw])
      .attr('fill', 'transparent')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.4)
      .style("stroke-opacity", 0.4)
      .style("stroke-dasharray", ("3, 1"))
      .attr('id', 'myLine')
      .attr('fill', 'none')
      .attr("d", d3.svg.line()
        .interpolate("linear")
      );

    pos = ourTransform([coord])[0];

    container.append("circle")
      .attr("r", 12)
      .attr("cx", pos[0])
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("cy", pos[1])
      .style("fill", "white");

    container.append("circle")
      .attr("r", 6)
      .attr("cx", pos[0])
      .attr("stroke", "none")
      .attr("cy", pos[1])
      .style("fill", "black");
  });

}

function updatePoints(points) {

}
