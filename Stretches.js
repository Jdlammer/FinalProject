//Define Margin
    var margin = {left: 90, right: 100, top: 60, bottom: 50 }, 
        width = 560 - margin.left -margin.right,
        height = 300 - margin.top - margin.bottom;

    //Define Color
    var colors = d3.scale.category10();

    //Define Scales   
    var xScale = d3.scale.linear()
        .domain([0,10]) //Need to redefine this after loading the data
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([0,5]) //Need to redfine this after loading the data
        .range([height, 0]);
    
    //Define Tooltip here
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
    
      
       //Define Axis
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickPadding(2);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").tickPadding(2);
    
    //Get Data
    d3.csv("s.csv", function(error, data) {
    if (error) throw error;
    data.forEach(function(d) {
        d.common = +d.common;     //+ sign changes string to number
        d.dif = +d.dif;
    });
    
    
    var zoom = d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
        .scaleExtent([1, 32])
        .on("zoom", zoomed);
    

    var svg = d3.select("body")
        .call(zoom)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        //Graph Titles
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "header")
        .style("font-size", "24px")
        .style('fill', 'steelblue')
        //.style("text-decoration", "underline")  
        .text("Static Stretches");  
        
    // Define domain for xScale and yScale
    
    xScale.domain(d3.extent(data, function(d) { return d.common; })).nice();
    yScale.domain(d3.extent(data, function(d) { return d.dif; })).nice();
   
    //Draw Scatterplot
        svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return Math.sqrt(d.total)/.1; })
        .attr("cx", function(d) {return xScale(d.common);})
        .attr("cy", function(d) {return yScale(d.dif);})
        .style("fill", function (d) { return colors(d.type); })
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(d.stretch + "<br/>"+ "Primary: " + d.type + "<br/>" + "Secondary: " + d.secondary + "<br/>" + "Difficulty: " + d.dif + "<br/>"  + "Commonness: " + d.common)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);
            });
    //Add .on("mouseover", .....
    //Add Tooltip.html with transition and style
    
    
    //Then Add .on("mouseout", ....
    
    //Scale Changes as we Zoom
    
    function zoomed() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        svg.selectAll(".dot")
        .attr("r", function(d) { return Math.sqrt(d.total)/.1; })
        .attr("cx", function(d) {return xScale(d.common);})
        .attr("cy", function(d) {return yScale(d.dif);});
//        svg.selectAll(".dot").attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
        svg.selectAll(".text")
            .attr("x", function(d) {return xScale(d.common);})
            .attr("y", function(d) {return yScale(d.dif);})
    }

    
    // Call the function d3.behavior.zoom to Add zoom

    //Draw Country Names
        svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.common);})
        .attr("y", function(d) {return yScale(d.dif);})
        .style("fill", "black")
        .text(function (d) {return d.stretch; });

 //x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Commonness");

    
    //Y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -70)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Difficulty");

    
       
});