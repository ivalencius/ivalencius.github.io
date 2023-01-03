function halo(text) {
text
    .select(function() {
    return this.parentNode.insertBefore(this.cloneNode(true), this);
    })
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 4)
    .attr("stroke-linejoin", "round");
}

const data = [
    {year : 2001, age : 0}, 
    {year : 2002, age : 1},
    {year : 2003, age : 2},
    {year : 2004, age : 3},
    {year : 2005, age : 4},
    {year : 2006, age : 5},
    {year : 2007, age : 6},
    {year : 2008, age : 7},
    {year : 2009, age : 8},
    {year : 2010, age : 9},
    {year : 2011, age : 10},
    {year : 2012, age : 11},
    {year : 2013, age : 12},
    {year : 2014, age : 13},
    {year : 2015, age : 14},
    {year : 2016, age : 15},
    {year : 2017, age : 16},
    {year : 2018, age : 17},
    {year : 2019, age : 18},
    {year : 2020, age : 19},
    {year : 2021, age : 20},
    {year : 2022, age : 21},
    {year : 2023, age : 22},
    {year : 2024, age : 23},
    {year : 2025, age : 24},
    {year : 2026, age : 25}
]

const current_year = new Date().getFullYear()

const data_now = data.filter(d => d.year <= current_year)
const data_next = data.filter(d => d.year >= current_year)

const screenWidth = d3.select('#age-chart').node().getBoundingClientRect().width >3000 ? 3000 : d3.select('#age-chart').node().getBoundingClientRect().width
const margin = {top: 20, right: 20, bottom: 20, left: 50}
const width = screenWidth*.8 - margin.left - margin.right
const height = screenWidth*.4 - margin.top - margin.bottom

const svg = d3.select('#age-chart').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        // .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        // .attr("style", "outline: thin solid red;")
        // .style("background-color", "white")
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// Create axes
const x = d3.scaleLinear()
    .domain(d3.extent(data.map(d => d.year)))
    .range([0, width])
    .nice()

const y = d3.scaleLinear()
    .domain(d3.extent(data.map(d => d.age)))
    .range([height, 0])
    .nice()

// update axes and axis title
const xAx = d3.axisBottom(x)
    .tickFormat(d3.format(".4"))

const yAx = d3.axisLeft(y)
    // .tickFormat(d3.format("$.3r"))

// Create axis containers
const yGroup = svg.append("g")
        .attr("class","y-axis")
        .call(yAx)

const xGroup = svg.append("g")
        .attr("class","x-axis")
        .attr("transform",`translate(0, ${height})`)
        .call(xAx)

// Edit axes appearance
yGroup
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width)
        .attr("stroke-opacity", 0.1)
        )
xGroup
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
        .attr("y2", - height)
        .attr("stroke-opacity", 0.1)
        )

// X-axis title
svg.append("text")
        .attr('x', width)
        .attr('y', height-margin.bottom/2)
        .text("Year")
        .attr("text-anchor","end")
        .style("font-weight","bold")
        .call(halo)

// Y-axis title
svg.append("text")
        .attr('x', 10)
        .attr('y', 5)
        .text("Age")
        .style("font-weight","bold")
        .call(halo)

// Create circles
const points = svg.selectAll(".point")
    .data(data)
    .join(
        enter => enter.append("circle")
            .attr("class", "point")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.age))
            .attr("r", 5)
            .attr("fill", "red")
            .attr("stroke", "red")
    )

// Create labels
// const labels = svg.selectAll(".label")
//     .data(data)
//     .join(
//         enter => enter.append("text")
//             .attr("class", "label")
//             .attr("x", d => x(d.year))
//             .attr("y", d => y(d.age)-20)
//             .text(d => d.year)
//     )
//     .call(halo)

// Line path generator
const line = d3.line()
    .curve(d3.curveNatural)
    .x(d => x(d.year))
    .y(d => y(d.age))

// Create path
const path_now = svg.append("path")
    .datum(data_now)
    .style("stroke", "red")
    .style("fill", "none")
    .attr("d", line)

const path_next = svg.append("path")
    .datum(data_next)
    .style("stroke", "red")
    .style("stroke-dasharray", ("3, 3"))
    .style("fill", "none")
    .attr("d", line)

// const I = d3.range(data.map(d => d.year).length)
// // console.log('I', I)
// let duration = 5000

// // Measure the length of the given SVG path string.
// function length(path) {
//     return d3.create("svg:path").attr("d", path).node().getTotalLength();
// }
// // From https://observablehq.com/@d3/connected-scatterplot
// function animate() {
//     if (duration > 0) {
//         const l = length(line(data))
//         // console.log("l", l)
    
//         path
//             .interrupt()
//             .attr("stroke-dasharray", `0,${l}`)
//         .transition()
//             .duration(duration)
//             .ease(d3.easeLinear)
//             .attr("stroke-dasharray", `${l},${l}`);

//         // labels
//         //     .interrupt()
//         //     .attr("opacity", 0)
//         // .transition()
//         //     .delay(i => length(line(I.filter(j => j <= i))) / l * (duration - 125))
//         //     .attr("opacity", 1);
//     }    
// }

// animate()

const annotations = [
    {
        note: {
            title: "Consistency is key"
        },
        type: d3.annotationCallout,
        // subject: {
        //   radius: (label_node.y1 - label_node.y0)/2+5,         // circle radius
        //   // radiusPadding: 20   // white space around circle before connector
        // },
        x: x(2010),
        y: y(9),
        dy: -30,
        dx: -20
    }
  ]
  
  // Add annotation to the chart
  const makeAnnotations = d3.annotation()
    .annotations(annotations)
  svg
    .append("g")
    .style("color", "red")
    .attr("class", "annotation")
    .call(makeAnnotations)