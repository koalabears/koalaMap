var socket = io();
var container;
var poly;

function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        return obj.map(function(elem) {
          return arguments.callee(obj[i]);
        });
    }
}

window.onload = function() {
  container = d3.select("#polygon").append("svg")
    .attr("width", 1000)
    .attr("height", 580);
};

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

socket.on('update poly', function(poly){
  var newPoly = poly;
  pushNewBlob(JSON.parse(newPoly));
});

var blobData = [];

function pushNewBlob(newBlobData) {
  console.log(blobData);
  if (blobData.length === 0) {
    blobData = deepCopy(newBlobData);
    console.log('no blob!');
    blobCoordinates = createPolygonCoordinates(newBlobData);
    drawPolygon(blobCoordinates);
  }
  if (!newBlobData.equals(blobData)) {
    blobData = deepCopy(newBlobData);
    handleArrivalData(deepCopy(newBlobData));
  }
}

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
  poly = createPolygonCoordinates(arrivalData);
  // var blobCoordinates = createPolygonCoordinates(arrivalData);
  // console.log(blobCoordinates);

  animateFast(pathFunction);
}


function createPolygonCoordinates(values) {
  // console.log('values', values);
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

var pathFunction = d3.svg.line()
  .x(function(d) {
    return d[0];
  })
  .y(function(d) {
    return d[1];
  })
  .interpolate("cardinal-closed");


function drawPolygon(blobCoords_) {
  poly = blobCoords_;
  console.log(poly);

  var startData = ourTransform(poly);
  var newData = poly.map(function(point) {
    return [point[0]*0.5, point[1]*0.5];
  });
  newData = ourTransform(newData);

  var path = container.append("svg:path")
    .attr('id', "oldPath")
    .style("fill", "#0099CC")
    .attr("stroke-width", 5)
    .attr("d", pathFunction(startData));


  drawCentreCircleTo(container);

  poly.forEach(function(coord, index) {
    drawStationLine(coord, container);
    pos = ourTransform([coord])[0];

    drawArrivalCircle(pos, container, index);
  });

  animate();

  container.append("text")
    .attr("font-family", "futura")
    .attr("x", 214)
    .attr('font-size', "1.5em")
    .attr('fill', 'black')
    .attr('stroke', 'black')
    .attr("y", 308)
    .text("MIND THE MAP");

}

function drawStationLine(coord, container) {
  var scaling = 2;
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
    .attr('stroke-width', 1)
    .style("stroke-opacity", 0.5)
    .style("stroke-dasharray", ("3, 6"))
    .attr('id', 'myLine')
    .attr('fill', 'none')
    .attr("d", d3.svg.line()
      .interpolate("linear")
    );
}

function drawArrivalCircle(pos, container, index) {
var innerCircleId = 'innerCircleId' + index;
var outerCircleId = 'outerCircleId' + index;

  container.append("circle")
    .attr("class", "outerCircle")
    .attr("id", outerCircleId)
    .attr("r", 5)
    .attr("cx", pos[0])
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("cy", pos[1])
    .style("fill", "white");

  container.append("circle")
    .attr("class", "innerCircle")
    .attr("id", innerCircleId)
    .attr("r", 1)
    .attr("cx", pos[0])
    .attr("stroke", "none")
    .attr("cy", pos[1])
    .style("fill", "black");
}



function drawCentreCircleTo(container) {
  var circlePos = ourTransform([
    [0, 0]
  ])[0];



  container.append("circle")
    .attr("r", 120)
    .attr("cx", circlePos[0])
    .attr('stroke-width', 5)
    .attr('stroke', 'black')
    .attr("cy", circlePos[1])
    .style("fill", "white");

    container.append("circle")
      .attr("r", 110)
      .attr("cx", circlePos[0])
      .attr('stroke-width', 5)
      .attr('stroke', 'yellow')
      .attr("cy", circlePos[1])
      .style("fill", "#B6B6B4");

}

function animate() {
  setInterval(function() {
    poly = updatePoints(poly);
    newData =  ourTransform(poly);
    d3.select('#oldPath')
      .data([newData])
      .transition()
      .ease('linear')
      .duration(1000)
      .attr('d', pathFunction);

    d3.selectAll(".innerCircle")
      .transition()
      .attr("cx", function(d, i) {
        return newData[i][0];
      })
      .attr("cy", function(d, i) {
        return newData[i][1];
      })
      .ease('linear')
      .duration(1000);
      // .attr('d', pathFunction);

      d3.selectAll(".outerCircle")
        .transition()
        .attr("cx", function(d, i) {
          return newData[i][0];
        })
        .attr("cy", function(d, i) {
          return newData[i][1];
        })
        .ease('linear')
        .duration(1000);
        // .attr('d', pathFunction);  }, 1000);

  }, 1000);

}

function animateFast(pathCreate) {
  setInterval(function() {
    // poly = updatePoints(poly);
    newData =  ourTransform(poly);
    d3.select('#oldPath')
      .data([newData])
      .transition()
      .ease('linear')
      .duration(1000)
      .attr('d', pathFunction);

      d3.selectAll(".innerCircle")
        .transition()
        .attr("cx", function(d, i) {
          return newData[i][0];
        })
        .attr("cy", function(d, i) {
          return newData[i][1];
        })
        .ease('linear')
        .duration(1000);
        // .attr('d', pathFunction);

        d3.selectAll(".outerCircle")
          .transition()
          .attr("cx", function(d, i) {
            return newData[i][0];
          })
          .attr("cy", function(d, i) {
            return newData[i][1];
          })
          .ease('linear')
          .duration(1000);
        }, 1000);
}

function updatePoints(points) {
  console.log(points);
  var velocity = 1/600;
  return points.map(function (point) {
    var norm = vectorNormal(point);
    if (vectorLength(point) < 1 + velocity) {
      return norm;
    } else {
      return vectorPlus(point, vectorMult(norm, -1*velocity));
    }
  });
}

function vectorMult(vec, scalar) {
  return [
    vec[0]*scalar,
    vec[1]*scalar
  ];
}

function vectorPlus(vec1, vec2) {
  return [
    vec1[0] + vec2[0],
    vec1[1] + vec2[1]
  ];
}

function vectorLength(vec) {
  return Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
}

function vectorNormal(vec) {
  var len = vectorLength(vec);
  return [
    vec[0]/len,
    vec[1]/len
  ];
}
