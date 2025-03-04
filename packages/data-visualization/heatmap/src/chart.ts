import { extent } from 'd3';
import { Dataset, ChartParams, MonthlyVariance, ChartColor } from './types';
import { Axis, axisBottom, axisLeft } from 'd3-axis';
import { NumberValue, scaleLinear, ScaleLinear } from 'd3-scale';
import { select, Selection } from 'd3-selection';

// Chart class implementing ChartParams interface for creating a temperature variance visualization
export default class Chart implements ChartParams {
  dataset: Dataset | null;
  title: string;
  description: string | null;
  margin: { top: number; right: number; bottom: number; left: number };
  xAxis: Axis<NumberValue> | null;
  yAxis: Axis<NumberValue> | null;
  xScale: ScaleLinear<number, number> | null;
  yScale: ScaleLinear<number, number> | null;
  temperatureRange: [number, number];
  svg: Selection<SVGSVGElement, unknown, null, any> | null;
  width: number;
  height: number;
  chartElement: HTMLElement;
  // URL containing global temperature data in JSON format
  jsonUrl =
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

  constructor({ title, margin, width, height, chartElement }: ChartParams) {
    this.dataset = null;
    this.xAxis = null;
    this.yAxis = null;
    this.xScale = null;
    this.yScale = null;
    this.temperatureRange = [0, 0];
    this.svg = null;
    this.title = title;
    this.margin = margin;
    this.chartElement = chartElement;
    this.width = width;
    this.height = height;
    this.description = null;
  }

  // Initialize the chart by fetching data and creating visual elements
  async init() {
    this.dataset = await this.getDataset();
    // Create SVG container with specified dimensions
    this.svg = select(this.chartElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.createTitles();
    this.createAxes();
    this.createPlots();
  }

  // Add title and description text to the chart
  createTitles() {
    // Add main title centered at top
    this.svg
      ?.append('text')
      .text(this.title)
      .attr('x', this.width / 2)
      .attr('y', this.margin.top / 3)
      .attr('id', 'title')
      .attr('text-anchor', 'middle')
      .style('font-size', '24px');

    // Add description below title
    this.svg
      ?.append('text')
      .text(this.getDescription())
      .attr('x', this.width / 2)
      .attr('y', this.margin.top / 1.3)
      .attr('id', 'description')
      .attr('text-anchor', 'middle')
      .style('font-size', '20px');
  }

  // Create X and Y axes with scales and tick marks
  createAxes() {
    // Get min/max years for X-axis
    const xRange = extent(
      this.dataset?.monthlyVariance || [],
      (d: MonthlyVariance) => {
        return d.year;
      }
    ) as [unknown, unknown] as [number, number];

    // Get min/max months for Y-axis
    const [yMin, yMax] = extent(
      this.dataset?.monthlyVariance || [],
      (d: MonthlyVariance) => {
        return d.month;
      }
    ) as [unknown, unknown] as [number, number];

    const xTicks = this.createYearTicks(xRange, 10);

    // Create linear scale for X-axis (years)
    this.xScale = scaleLinear()
      .domain([xRange[0], xRange[1]])
      .range([this.margin.left, this.width - this.margin.right]);

    // Create linear scale for Y-axis (months)
    this.yScale = scaleLinear()
      .domain([yMax + 0.5, yMin - 0.5])
      .range([this.height - this.margin.bottom, this.margin.top]);

    // Calculate temperature range for color scaling
    const partialExtent = extent(
      this.dataset?.monthlyVariance ?? [],
      (d: MonthlyVariance) => {
        return (this.dataset?.baseTemperature || 0) + d.variance;
      }
    );
    this.temperatureRange = [partialExtent[0] ?? 0, partialExtent[1] ?? 0];

    // Configure X-axis with year ticks
    this.xAxis = axisBottom(this.xScale)
      .tickFormat((d: NumberValue) => {
        return d.toString();
      })
      .tickValues(xTicks);

    // Configure Y-axis with month names
    this.yAxis = axisLeft(this.yScale).tickFormat((monthNumber: NumberValue) =>
      this.getMonthName(monthNumber)
    );

    // Add X-axis to SVG
    this.svg
      ?.append('g')
      .attr('id', 'y-axis')
      .call(this.xAxis)
      .attr(
        'transform',
        `translate(${0}, ${this.height - this.margin.bottom})`
      );

    // Add Y-axis to SVG
    this.svg
      ?.append('g')
      .attr('id', 'x-axis')
      .call(this.yAxis)
      .attr('transform', `translate(${this.margin.left}, ${0})`);
  }

  // Create rectangular cells representing temperature data
  createPlots() {
    let yAxisTicksDistance = this.getYAxisTicksDistance();
    let xAxisTicksDistance = this.getXAxisTicksDistance();

    // Bind data to rectangles and set their properties
    this.svg
      ?.selectAll('rect')
      .data(this.dataset?.monthlyVariance || [])
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (d: MonthlyVariance) => {
        return this.xScale ? this.xScale(d.year) : d.year;
      })
      .attr('y', (d: MonthlyVariance) => {
        return this.yScale ? this.yScale(d.month) : d.month;
      })
      .attr('width', xAxisTicksDistance / 10)
      .attr('height', yAxisTicksDistance)
      .attr('data-month', (d: MonthlyVariance) => d.month - 1)
      .attr('data-month-name', (d: MonthlyVariance) =>
        this.getMonthName(d.month)
      )
      .attr('data-year', (d: MonthlyVariance) => d.year)
      .attr('data-temp', (d: MonthlyVariance) => {
        return (this.dataset?.baseTemperature || 0) + d.variance;
      })
      .attr('transform', `translate(0, -${yAxisTicksDistance / 2})`)
      .attr('fill', (d: MonthlyVariance) => {
        let temperature = (this.dataset?.baseTemperature || 0) + d.variance;
        return this.getCellColor(temperature);
      });
  }

  // Generate array of year values for X-axis ticks
  createYearTicks([min, max]: [number, number], stepSize: number) {
    const ticks = [];
    let tick = min;
    while (tick <= max) {
      if (tick % stepSize === 0) {
        ticks.push(tick);
      }
      tick++;
    }
    return ticks;
  }

  // Calculate distance between Y-axis ticks
  getYAxisTicksDistance() {
    let ticks = this.yScale?.ticks();
    if (this.yScale && ticks && ticks.length > 1) {
      return Math.abs(this.yScale(ticks?.[1]) - this.yScale(ticks?.[0]));
    }
    return 0;
  }

  // Calculate distance between X-axis ticks
  getXAxisTicksDistance() {
    let ticks = this.xScale?.ticks();
    if (this.xScale && ticks && ticks.length > 1) {
      return Math.abs(this.xScale(ticks?.[1]) - this.xScale(ticks?.[0]));
    }
    return 0;
  }

  // Generate chart description with year range and base temperature
  getDescription() {
    const baseTemperature = this.dataset?.baseTemperature;
    const minYear = this.dataset?.monthlyVariance.reduce(
      (acc, curr) => Math.min(acc, curr.year),
      Infinity
    );
    const maxYear = this.dataset?.monthlyVariance.reduce(
      (acc, curr) => Math.max(acc, curr.year),
      -Infinity
    );

    return `${minYear} - ${maxYear}: base temperature ${baseTemperature}°C`;
  }

  // Convert month number to full month name
  getMonthName(monthNumber: NumberValue) {
    const monthNames = new Intl.DateTimeFormat('en-US', { month: 'long' });
    const date = new Date(2025, Number(monthNumber) - 1, 1);
    return monthNames.format(date);
  }

  // Fetch temperature dataset from JSON URL
  async getDataset(): Promise<Dataset> {
    const response = await fetch(this.jsonUrl);
    const data = await response.json();
    return data;
  }

  // Determine cell color based on temperature value
  getCellColor(temperature: number) {
    const colorsData = this.getTemparatureColors();

    for (const colorName in colorsData) {
      if (
        temperature >= colorsData[colorName].start &&
        temperature < colorsData[colorName].end
      ) {
        return colorsData[colorName].color;
      }
    }

    return ChartColor.VelvetRed; // Default color if no match found
  }

  // Create color scale based on temperature range
  getTemparatureColors() {
    const colors = Object.entries(ChartColor);
    const colorsCount = colors.length;
    const temperatureStep =
      (this.temperatureRange[1] - this.temperatureRange[0]) / colorsCount;
    interface ColorDataEntry {
      color: string;
      start: number;
      end: number;
    }

    return colors.reduce<Record<string, ColorDataEntry>>(
      (colorsData, [colorName, colorValue], index) => {
        colorsData[colorName] = {
          color: colorValue,
          start: this.temperatureRange[0] + index * temperatureStep,
          end: this.temperatureRange[0] + (index + 1) * temperatureStep,
        };
        return colorsData;
      },
      {}
    );
  }
}
