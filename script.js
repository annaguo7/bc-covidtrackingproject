
const margin = ({top: 40, right: 20, bottom: 70, left: 50}),
width = 1200 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;


//BAR CHART - WEEKLY POSITIVE CASES COUNT

const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3
        .scaleBand()
        .rangeRound([0, width])
        .padding(0.1)

const yScale = d3
        .scaleLinear()
        .range([height, 0])

var yaxis= svg.append('g')
    .attr('class', 'axis y-axis')
    
var xaxis= svg.append('g')
    .attr('class', 'axis x-axis')
    .attr("transform", "translate(0," + height + ")")

var yaxistitle=svg.append("text")
    .attr("class", "y-axis-title")


function id(d){
    return d;
}

function update(data,type){

  if (type == 'Week #'){
    var sortData =data.sort(function(a, b) {
      return d3.ascending(a.WeekNum, b.WeekNum)
    });
  }
  else if (type == 'Positive Tests') {
    var sortData =data.sort(function(a, b) {
      return d3.ascending(a.PositiveTests, b.PositiveTests)
    });   
  }
  
  else{
    var sortData =data.sort(function(a, b) {
      return d3.ascending(a[type], b[type])
    });
  }
  
   // Update scale domains
   xScale.domain(sortData.map(sortData=>sortData['Week']))
   yScale.domain([0,d3.max(sortData, function (d) { return d.PositiveTests})])

  // Implement the enter-update-exist sequence
  var bars = svg.selectAll('.bar')
      .data(sortData,id)

  bars.exit().transition().duration(300).remove()

  bars
       .enter().append('rect')
       .attr("opacity",.1)
       .attr("x", function(d) { return xScale(d['Week']); })
       .attr("width", xScale.bandwidth())
       .on('mouseenter',(event,d) =>{
            var weeknum = d['Week #']
            var tests = d3.format(",")(d.TestsPerformed);
            var rate = d['BC Positivity Rate'];
            const pos = d3.pointer(event,window);

            var tooltip1 = d3.select('.tooltip')
                .attr("class", "tooltip")
                .style('display','block')
                .style('background-color','black')
                .style('color','white')
                .style('opacity',.8)
                .style('padding','10px')
                .style("top",pos[1]-820+'px')
                .style("left",pos[0]+'px')
                .html(
            'Week #: '+weeknum+ '<br>'+
            'Tests Performed: '+tests + '<br>'+
            'Positivity Rate: '+rate
                );    
       })
       .on("mouseleave", (event, d) => {
        // hide the tooltip
        d3.select('.tooltip')
            .style('display','none')
    })
    .merge(bars)
    .transition()
    .ease(d3.easeBounceOut)
    .duration(1600)
    .attr("class", "bar")
    .delay(function (d, i) {
        return i * 50;
    })
    .attr("class", "bar")
    .attr("opacity",.7)
    .attr("y", function(d) { return yScale(d['Positive Tests']); })
    .attr("height", function(d) { return height - yScale(d['Positive Tests'])})
    .attr("fill", "maroon")

    ;

  //exit stage
  bars.exit().remove(); 

  svg.selectAll("text.bar")
        .data(sortData)
        .enter().append("text")
        .attr("class", "bar")
        .attr("text-anchor", "middle")
       .text(function(d) {
         return d['Positive Tests'];
       })
       .style("fill","maroon")
       .attr("y", function(d) {
         return yScale(d['Positive Tests'])-15;
       })
       .attr("x", function(d) {
         return xScale(d['Week'])+25;
       });

   // Update axes and axis title
   xaxis.call(d3.axisBottom(xScale));
       
   yaxis.transition().duration(1000).call(d3.axisLeft(yScale)); 

   d3.selectAll(".y-axis-title")
       .attr('y', 5)
       .attr('dy', -10)
       .attr('x',30)
       .attr("text-anchor", "middle")
       .text('New Positive Cases')
       .style('font-size','11pt');

    svg.selectAll('circle')
      .data(sortData).enter()
      .append('circle')
      .attr('cx',600)
      .attr('cy',120)
      .attr('r',100)
      .style('opacity',0.1)
      .attr('fill','goldenrod')

    svg.append('text')
      .attr('x',520)
      .attr('y',100)
      .attr('font-weight','bold')
      .attr('fill','white')
      .attr('font-size','13pt')
      .text("Week 4 and Week 18")

    svg.append('text')
      .attr('x',525)
      .attr('y',130)
      .attr('fill','white')
      .attr('font-size','10pt')
      .text("had the highest positivity")
    svg.append('text')
      .attr('x',530)
      .attr('y',150)
      .attr('fill','white')
      .attr('font-size','10pt')
      .text("rates of the fall semster.")
        }



let select = String(d3.select('#sort-by').node().value);

d3.csv('bc-covid.csv', d=>{
            return {
              ...d, // spread operator
              TestsPerformed: +d['Tests Performed'],
              PositiveTests: +d['Positive Tests'],
              WeekNum: +d['Week #']
            }
          }).then(data=>{

            update(data,select);

    
          var eventH = function() {
              let select = String(d3.select('#sort-by').node().value);
              update(data,select)
              console.log(select);
          };
           d3.select('#sort-by').node().addEventListener('change',eventH);

            

          })
        ;



