import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const fetchData = async () => {
    const data = [];

    try {
        const res = await axios.get(
            "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
        );
        data.push(res.data);
        return data;
    } catch (err) {
        console.log(err);
    }
};

const render = async () => {
    const data = await fetchData();
    const dataset = data[0].data;

    const h = 500;
    const w = 825;

    const xScale = d3
        .scaleTime()
        .domain([
            new Date(d3.min(dataset, (d) => d[0])),
            new Date(d3.max(dataset, (d) => d[0])),
        ])
        .nice(d3.timeMonth.every(60))
        .range([0, w]);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .nice()
        .range([h, 0]);

    const svg = d3
        .select("body")
        .append("svg")
        .attr("id", "title")
        .attr("height", h)
        .attr("width", w);

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("id", (d, i) => i)
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("x", (d) => xScale(new Date(d[0])))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", 3)
        .attr("height", (d) => h - yScale(d[1]))
        .on("mouseover", (d, i) => {
            d3.select("body")
                .append("div")
                .attr("data-date", i[0])
                .attr("id", "tooltip")
                .style("opacity", 0.8)
                .style("position", "absolute")
                .style("top", yScale(i[1]) + "px")
                .style("left", xScale(new Date(i[0])) + 200 + "px")
                .text(() => {
                    const regex5 = /([\d]{5})/;
                    const regex4 = /([\d]{4})/;
                    if (regex5.test(i[1])) {
                        return `${i[0]} \n$${i[1].toString().slice(0, 2)},${i[1]
                            .toString()
                            .slice(2)} Billion`;
                    } else if (regex4.test(i[1])) {
                        return `${i[0]} \n$${i[1].toString().slice(0, 1)},${i[1]
                            .toString()
                            .slice(1)} Billion`;
                    } else {
                        return `${i[0]} \n$${i[1]} Billion`;
                    }
                });
        })
        .on("mouseout", () => d3.select("#tooltip").remove());

    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h})`)
        .call(xAxis);

    const yAxis = d3.axisLeft(yScale).ticks(20);
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(0, 0)`)
        .call(yAxis);
};

render();
