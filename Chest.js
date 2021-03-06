function myChest() {
    var active   = chest.active ? false : true,
		  newOpacity = active ? 0 : 1;
    d3.select("#chest").style("opacity", newOpacity);
		// Update whether or not the elements are active
		chest.active = active;
}

var margin = {top: 50, right: 100, bottom: 120, left: 100},
    width = 560 - margin.left - margin.right,
    height = 377 - margin.top - margin.bottom;
    

// Define SVG. 
var chart2 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "chest")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define X and Y SCALE. 
var xScale = d3.scale.ordinal()
    .rangeRoundBands([0,width], 0.1);

var yScale = d3.scale.linear()
    .range([height,0]);

//Define tooltip
var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

// Define X and Y AXIS
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);

//csv contains the stretch(key) and rating(value)
d3.csv("Chest.csv",function(error, data){
    data.forEach(function(d) {
        d.key = d.key;
        d.value = +d.value;
    });
    
    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,10]);
    
    // Creating rectangular bars to represent the data. See D3 API Refrence
    // to learn more about Transitions
    chart2.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr("height", 0) 
        .attr("y", height)
//        .transition().duration(1000)
//        .delay( function(d,i) {
//			return i * 200;
//		})
        // attributes can be also combined under one .attr 
        .attr({
            "x": function(d) { return xScale(d.key); },
            "y": function(d) { return yScale(d.value); },
            "width": xScale.rangeBand(),
            "height": function(d) { return  height - yScale(d.value); },
            // create increasing to decreasing shade of blue
            "fill": function(d,i) { return 'rgb(' + ((i * 600)+ 120) + ', 0, 0)'}
        })
    .on("mouseover", function(d) {
        if(d3.select("#chest").style("opacity") != 0){
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html("Type of Stretch- " +d.type+"<br>"+"Directions: " +d.directions)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
        }
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);
            });
    
    // Label the data values(d.value)
    chart2.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .transition().duration(1000)
        .delay( function(d,i) {
			return i * 200;
		})
        .text(function(d){
            return d.value;
        })
        .attr({
            "x": function(d){ return xScale(d.key) + xScale.rangeBand()/2; },
            "y": function(d){ return yScale(d.value)+ 12; },
            "font-family": 'sans-serif',
            "font-size": '12px',
            "font-weight": 'bold',
            "fill": 'white',
            "text-anchor": 'middle'
        });
    
    // Draw xAxis and position the label
    chart2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .attr("transform", "rotate(-30)" )
        .style("text-anchor", "end")
        .attr("font-size", "10px");
        
    
    // Draw yAxis and postion the label
    chart2.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -110)
        .attr("dy", "-3em")
        .style("text-anchor", "middle")
        .text("Stretch Rating");
    
    //Graph Titles
        chart2.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "header")
        .style("font-size", "24px")
        .style('fill', '#000')
        .style("text-decoration", "underline")
        .text("Chest Stretches"); 
      
});