var timeUntilStation = [1, 0.2, 0.8, 1, 0.1, 0.6, 0.9, 0.7, 0.3, 1, 0.2, 0.8, 1, 0.1, 0.6, 0.9, 0.7, 0.3, 0.4, 0.5, 0, 0.2, 0.8, 1, 0.1, 0.6, 0.9, 0.7, 0.3, 0.4, 0.5, 0.6, 1, 0.8, 0.9, 1];

createPolygonCoordinates(timeUntilStation);

function createPolygonCoordinates(timeUntilStation){

  numOfStations = timeUntilStation.length;

  var polygonAngle = (2*Math.PI)/numOfStations;

  var xPolygonCoordinate = timeUntilStation.map(function(radius, i){
    return ((radius+1)*Math.sin(polygonAngle*i)).toFixed(2);
  });

  var yPolygonCoordinate = timeUntilStation.map(function(radius, i){
    return ((radius+1)*Math.cos(polygonAngle*i)).toFixed(2);
  });

  var polygonCoordinates = zip([xPolygonCoordinate, yPolygonCoordinate]);

  var polygonCoordinatesObject = polygonCoordinates.map(function(point){
    var out = {
      x:Number(point[0]),
      y:Number(point[1])
    };
    //console.log(out);
    return out;
  });

createPolygon(polygonCoordinatesObject);

  // var polygonCoordinatesString = polygonCoordinates.map(function(array){
  //   return array.toString();
  // });
  // var formattedCoordinates = polygonCoordinatesString.join(' ');
  //   createPolygon(formattedCoordinates);
}

// console.log(createPolygon(createPolygonCoordinates(timeUntilStation)));
function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){
          return array[i];
        });
    });
  }
function createPolygon(poly){
  var visual = d3.select("#polygon").append("svg")
         .attr("width", 1000)
         .attr("height", 667),

scaleX = d3.scale.linear()
        .domain([-2,2])
        .range([0,100]),

scaleY = d3.scale.linear()
        .domain([-2, 2])
        .range([0,100]);

visual.selectAll("polygon")
    .data([poly])
  .enter().append("polygon")
    .attr("points",function(d) {
        return d.map(function(d) {
            return [scaleX(d.x),scaleY(d.y)].join(",");
        }).join(" ");
    });

}


























// function createPolygon(coordsArray){
//   console.log("this is createPolygon");
//   console.log(coordsArray);
//   var polygonDiv = document.getElementById('polygon');
//   polygonDiv.innerHTML+= "<svg width=\"500\" height=\"500\">" + "<polygon points=\"" + coordsArray + "\" "+" "+ "/> </svg>";
//   // polygonDiv.innerHTML+=coordsArray;
//   // polygonDiv.innerHTML+= "\" /> </svg>";
// }
  // <polygon fill="black" stroke="purple" stroke-width="3"
  // points=\"05,30
  //         15,10
  //         25,30
  //         35,10
  //         45,20
  //         25,40
  //         60,25
  //         80,40
  //         100,100
  //         125,60
  //         120,120
  //         90,90
  //         120,50
  //         100,150
  //         200,120
  //         200,10
  //         300,150
  //         50,100
  //         40,200
  //         180,180
  //         150,250
  //         100,190
  //         70,150
  //         150,70
  //         100,300
  //         120,150
  //         170,220
  //         150,10
  //         60,200" />
