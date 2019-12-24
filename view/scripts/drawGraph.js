/****** Script graph *******/
const api = '/users/<%= name %>/metrics';

/** Loading data from API **/
function loadData(id) {
    fetch('/users/<%= name %>/metrics')
        .then(res => res.json())
        .then(res => {
            console.log(res);
            var parsedData = parseData(res);
            if (id === 0) {
                drawChart(parsedData);
            } else if (id === 1) {
                drawBarChart(parsedData);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

/** Parse data in array **/
function parseData(data) {
    var arr = [];
    const content = data.map(d => {
        arr.push({
            timestamp: d.timestamp,
            value: d.value,
        });
    });
    return arr;
}

/** Creates a chart using D3 **/
function drawChart(data) {
    var svgWidth = 900, svgHeight = 400;
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select('.line-chart')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function (d) {
            return x(d.timestamp)
        })
        .y(function (d) {
            return y(d.value)
        })
    x.domain(d3.extent(data, function (d) {
        return d.timestamp
    }));
    y.domain(d3.extent(data, function (d) {
        return d.value
    }));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
    ;

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Value");

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "RoyalBlue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}


/** Create a bar chart using D3 **/
function drawBarChart(data) {

    var svg = d3.select(".bar-chart"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin


    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
    var parseDate = d3.isoParse;
    d3.json(api, function (error, data) {
        if (error) {
            throw error;
        }

        data.forEach(function (d) {
            var dateObj = new Date(d.timestamp * 1000);
            var month = dateObj.getMonth() + 1; //months from 1-12
            var day = dateObj.getDate();
            var date = day + "/" + month;
            d.timestamp = date;
            d.value = +d.value;
        });
        console.log(data);

        xScale.domain(data.map(function (d) {
            return d.timestamp;
        }));
        yScale.domain([0, d3.max(data, function (d) {
            return d.value;
        })]);

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function (d) {
                return d;
            }).ticks(10));


        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "PaleVioletRed")
            .attr("x", function (d) {
                return xScale(d.timestamp);
            })
            .attr("y", function (d) {
                return yScale(d.value);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return height - yScale(d.value);
            });
    });
}