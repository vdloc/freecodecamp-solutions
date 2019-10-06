const dataURl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const getDataSet = async () => {
  const response = await fetch(dataURl);
  const chartData = await response.json();

  return chartData;
};

const tooltip = document.getElementById("tooltip");
const tooltipDate = tooltip.firstElementChild;
const tooltipGDP = tooltipDate.nextSibling;

const getTime = timeString => {
  return new Date(timeString).getTime();
};

const getYear = timeString => {
  return new Date(timeString).getFullYear();
};

const formatCurrency = currencyString => `$${currencyString} Billion`;

const drawChart = chartData => {
  let { data: dataset, from_date: fromDate, to_date: toDate } = chartData;

  const CHART_WIDTH = 900;
  const CHART_HEIGHT = 450;
  const PADDING = 50;
  const BAR_WIDTH = CHART_WIDTH / dataset.length;
  const chart = d3.select("#chart");
  const maxDate = new Date(toDate);
  maxDate.setMonth(maxDate.getMonth() + 3);

  const xScale = d3
    .scaleTime()
    .domain([new Date(fromDate), maxDate])
    .range([PADDING, CHART_WIDTH - PADDING]);

  const yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([CHART_HEIGHT - PADDING, 0]);

  const hScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([0, CHART_HEIGHT - PADDING]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yAxisScale);

  const svg = chart
    .append("svg")
    .attr("width", CHART_WIDTH)
    .attr("height", CHART_HEIGHT);

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", d => xScale(getTime(d[0]) + BAR_WIDTH))
    .attr("y", d => CHART_HEIGHT - PADDING / 2 - hScale(d[1]))
    .attr("width", BAR_WIDTH)
    .attr("height", d => hScale(d[1]))
    .attr("class", "bar")
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .on("mouseover", function(data) {
      const coordinate = d3.mouse(this);
      tooltip.classList.remove("is-hidden");
      tooltip.style.left = coordinate[0] + 50 + "px";
      tooltip.style.top = coordinate[1] - 50 + "px";
      tooltipDate.textContent = data[0];
      tooltipGDP.textContent = formatCurrency(data[1]);
      tooltip.setAttribute("data-date", data[0]);
    })
    .on("mouseout", () => {
      tooltip.classList.add("is-hidden");
    })
    .exit();

  svg
    .append("g")
    .attr("transform", `translate(0, ${CHART_HEIGHT - PADDING / 2})`)
    .attr("class", "tick")
    .attr("id", "x-axis")
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", `translate(${PADDING}, ${PADDING / 2}), rotate(360)`)
    .attr("class", "tick")
    .attr("id", "y-axis")
    .call(yAxis);
};

getDataSet().then(drawChart);
