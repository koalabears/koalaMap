var numberOfPoints = 60;
var totalPoints = numberOfPoints;
var radius = 50;
var margin = {top: 20, left: 60};
var marginleft = margin.left;
var margintop = margin.top;
var lineLength = 2 * radius * Math.PI;
var lineDivision = lineLength/totalPoints;
var cx = 257.08;
var cy = 70;
var dur = 3000/numberOfPoints;

var circleStates = [];
for (i=0; i<totalPoints; i++){
    //circle portion
    var circleState = $.map(Array(numberOfPoints), function (d, j) {
      var x = marginleft + radius + lineDivision*i + radius * Math.sin(2 * j * Math.PI / (numberOfPoints - 1));
      var y =  margintop + radius - radius * Math.cos(2 * j * Math.PI / (numberOfPoints - 1));
      return { x: x, y: y};
    })
    circleState.splice(numberOfPoints-i);
    //line portion
    var lineState = $.map(Array(numberOfPoints), function (d, j) {
      var x = marginleft + radius + lineDivision*j;
      var y =  margintop;
      return { x: x, y: y};
    })
    lineState.splice(i);
    //together
    var individualState = lineState.concat(circleState);
    circleStates.push(individualState);
}
var lineData = $.map(Array(numberOfPoints), function (d, i) {
    var y = margin.top;
    var x = margin.left + i * lineLength / (numberOfPoints - 1);
    return {x: x, y: y};
});
var pathFunction = d3.svg.line()
    .x(function (d) {return d.x;})
    .y(function (d) {return d.y;})
    .interpolate("basis"); // bundle | basis | linear | cardinal is also an option
//The SVG Container
var svgContainer = d3.select("body").append("svg")
    .attr("width", 700)
    .attr("height", 400);
//The Circle SVG Path we draw
var circle = svgContainer.append("g")
    .append("path")
    .data([circleStates[0]])
    .attr("d", pathFunction)
    .attr("class", "circle");
function addLine(){
    console.log('getting here');
    svgContainer
      .append('line')
      .attr('x1', 150)
      .attr('y1', 25)
      .attr('x2', 150)
      .attr('y2', 45)
      .attr('class', 'addedLine');
}

(function all() {
    for(i=0; i<numberOfPoints; i++){
        console.log(circleStates[i]);
        circle.data([circleStates[i]])
            .transition()
            .delay(dur*i)
            .duration(dur)
            .ease("linear")
            .attr('d', pathFunction)
            .each('end', addLine());
    }
}());
function reverse() {
    for(i=0; i<numberOfPoints; i++){
        circle.data([circleStates[numberOfPoints-1-i]])
            .transition()
            .delay(dur*i)
            .duration(dur)
            .ease("linear")
            .attr('d', pathFunction);
    }
}
$('#a').on("click", all);
$('#b').on("click", reverse);
