let type = String(d3.select('#group-by').node().value);

//BAR CHART - COMPARING SCHOOLS TESTING
// set the dimensions and margins of the graph
var marginX = {top: 73, right: 30, bottom: 60, left: 70},
    widthX = 620 - marginX.left - marginX.right,
    heightX = 500 - marginX.top - marginX.bottom;

// append the svg object to the body of the page
var svgX = d3.select(".boston")
  .append("svg")
    .attr("width", widthX + marginX.left + marginX.right)
    .attr("height", heightX + marginX.top + marginX.bottom)
  .append("g")
    .attr("transform",
          "translate(" + marginX.left + "," + marginX.top + ")");

svgX.append("text")
    .attr("x", widthX / 2 )
    .attr("y", -40)
    .attr('font-size','20pt')
    .attr('font-weight','bold')
    .attr('fill','black')
    .style("text-anchor", "middle")
    .text("All Testing Performed in Fall 2020");

var x = d3.scaleBand()
    .rangeRound([0, widthX])
    .padding(0.3);

var y = d3.scaleLinear()
  .range([heightX, 0]);

var colorScale = d3.scaleOrdinal()
    .domain(['Boston College','Boston University','Tufts University','Northeastern University','MIT'])
    .range(['maroon','red','skyblue','black','firebrick'])

var yAx= svgX.append('g')
    .attr('class', 'axis y-axis')
    
var xAx= svgX.append('g')
    .attr('class', 'axis x-axis')
    .attr("transform", "translate(0," + heightX + ")")


function updateZ(data,type){
  var sortedData =data.sort(function(a, b) {
    return d3.ascending(a[type], b[type])
  })
  // Update scale domains
    x.domain(sortedData.map(sortedData=>sortedData['University']))
    y.domain([0,d3.max(sortedData, function (d) { return d.TestsPerformed})])

  // Implement the enter-update-exist sequence
    var barG = svgX.selectAll('.bar')
      .data(sortedData,id)
    
    barG.exit().transition().duration(300).remove()

    barG
      .enter().append('rect')
      .attr("opacity",.7)
      .attr("x", function(d) { return x(d['University']); })
      .attr("width", x.bandwidth())
      .on('mouseenter',(event,d) =>{
        var univ = d['University'];
        var days = d['Days of Testing'];
        var rates = d['Rate'];
        const pos = d3.pointer(event,window);

        var tooltip1 = d3.select('.tooltip')
            .attr("class", "tooltip")
            .style('display','block')
            .style('background-color','black')
            .style('color','white')
            .style('opacity',.8)
            .style('padding','10px')
            .style('font-size','10pt')
            .style("top",pos[1]-1850+'px')
            .style("left",pos[0]+'px')
            .html(univ
              + '<br>'+ '<br>'+
              'Total Days of Testing: '+days + ' days' +'<br>'+
              'Overall Positivity Rate: '+rates + '%'
            );    
   })
   .on("mouseleave", (event, d) => {
    // hide the tooltip
    d3.select('.tooltip')
        .style('display','none')
})
    .merge(barG)
    .transition()
    .ease(d3.easeBounceOut)
    .duration(1500)
    .attr("class", "bar")
    .delay(function (d, i) {
        return i * 50;
    })
    .attr("y", function(d) { return y(d['Total Testing']); })
    .attr("height", function(d) { return heightX - y(d['Total Testing'])})
    .attr("fill", function(d) { return colorScale(d['University']); })

;

    // Exit phase
    barG.exit().remove(); 

    xAx.call(d3.axisBottom(x));
       
    yAx.transition().duration(1000).call(d3.axisLeft(y)); 

    svgX.selectAll("text.bar")
        .data(sortedData)
        .enter().append("text")
        .attr("class", "bar")
        .attr("text-anchor", "middle")
       .text(function(d) {
         return d['Total Testing'];
       })
       .style("fill","gray")
       .attr('font-size','10pt')
       .attr("y", function(d) {
         return y(d['Total Testing'])-5;
       })
       .attr("x", function(d) {
         return x(d['University'])+30;
       });

    svgX.append("text")
       .attr('x', 0)
       .attr('y', -5)
       .text("Total Tests Performed")
       .attr("transform", "rotate(90)")
}

//BUBBLE CHART - COMPARING POSITIVITY RATES

var marginZ = {top: 73, right: 10, bottom: 60, left: 60},
    widthZ = 620 - marginZ.left - marginZ.right,
    heightZ = 500 - marginZ.top - marginZ.bottom;

var svgZ = d3.select(".bubble")
  .append("svg")
    .attr("width", widthZ + marginZ.left + marginZ.right)
    .attr("height", heightZ+ marginZ.top + marginZ.bottom)
  .append("g")
    .attr("transform",
          "translate(" + marginZ.left + "," + marginZ.top + ")");


svgZ.append("text")
    .attr("x", widthZ / 2 )
    .attr("y", -40)
    .attr('font-size','20pt')
    .attr('font-weight','bold')
    .attr('fill','black')
    .style("text-anchor", "middle")
    .text("Positive Cases in Fall 2020");

svgZ.append("text")
    .attr("x", widthZ / 2 )
    .attr("y", -25)
    .attr('font-size','8pt')
    .attr('fill','black')
    .style("text-anchor", "middle")
    .text("*Size and color adjusted to positivity rate");

var xB = d3.scaleBand()
    .rangeRound([0, widthZ+50])
    .padding(1);
      
var yB = d3.scaleLinear()
    .range([heightZ, 0]);
      
var color = d3.scaleLinear()
  .range(['white','orange','red']);

var size = d3.scaleSqrt()
    .range([10,35]);

var yAxisB= svgZ.append('g')
    .attr('class', 'axis y-axis')
    
var xAxisB= svgZ.append('g')
    .attr('class', 'axis x-axis')
    .attr("transform", "translate(0," + heightZ + ")")


function bubble(data,type){

  var sortedDataB =data.sort(function(a, b) {
    return d3.ascending(a[type], b[type])
  })
    //update scale domains
    xB.domain(sortedDataB.map(sortedDataB=>sortedDataB['University']))
    yB.domain([0,d3.max(sortedDataB, function (d) { return d['Total Positive']})])

    color.domain([0.1,0.15,0.3]);
    size.domain(d3.extent(sortedDataB,function(d){ return d['Rate']}));
    //call x and y azis
    xAxisB.call(d3.axisBottom(xB));
    yAxisB.transition().duration(1000).call(d3.axisLeft(yB)); 

    svgZ.append("text")
		.attr('x', 0)
		.attr('y', -5)
        .text("Total Positive Cases")
        .attr("transform", "rotate(90)")
    
    var circles = svgZ.selectAll('circle')
        .data(sortedDataB)

    circles.exit().transition().duration(300).remove()

    circles
        .enter()
        .append('circle')
        .attr('opacity',0.7)
        .attr('stroke','black')
        .attr('stroke-width',.6)
        .attr('pointer-events', 'all')
        .on('mouseenter',(event,d) =>{
          var uni = d['University'];
          var pos = d['Total Positive'];
          var rate = d['Rate'];
          
          console.log('enter bubble')
          var tooltipB = d3.select('.tooltipB')
              .attr("class", "tooltipB")
              .style('display','block')
              .style('background-color','darkred')
              .style('color','white')
              .style('opacity',.8)
              .style('padding','5px')
              .style('font-size','10pt')
              .style("top",(event.pageY-1850) + "px")
              .style("left",(event.pageX-200) + "px")
              .html(uni
          + '<br>'+ '<br>'+
          'Total Positive Cases: '+pos + '<br>'+
          'Overall Positivity Rate: '+rate + '%'
              ); 
     })
        .on("mouseleave", (event, d) => {
            // hide the tooltip
            console.log('left bubble')
            d3.select('.tooltipB')
                .style('display','none')
                  })
        .merge(circles)
        .transition()
        .ease(d3.easeBounceOut)
        .duration(1500)
        .attr('cx',d=>xB(d['University']))
        .attr('cy',d=>yB(d['Total Positive']))
        .attr('r',d=>size(d['Rate']))
        .attr('fill',d=>color(d['Rate']))

        // Exit phase
      circles.exit().remove(); 

                }


d3.csv('boston-schools.csv', d=>{
    return {
              ...d, // spread operator
              TestsPerformed: +d['Total Testing'],
              PositiveTests: +d['Total Positive']
            }
          }).then(data=>{
            updateZ(data,type);
            bubble(data,type);

            var eventHandler = function() {
              let type = String(d3.select('#group-by').node().value);
              updateZ(data,type);
              bubble(data,type);
              console.log('type change!');
          };
           d3.select('#group-by').node().addEventListener('change',eventHandler);

          })