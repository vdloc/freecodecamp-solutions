import { extent, format, interpolateHcl } from 'd3';
import { Dataset, ChartParams, MonthlyVariance, ChartColor } from './types';
import { Axis, axisBottom, axisLeft } from 'd3-axis';
import {
  NumberValue,
  scaleLinear,
  ScaleLinear,
  ScaleSequential,
  scaleSequential,
} from 'd3-scale';
import { select, Selection } from 'd3-selection';

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

  async init() {
    this.dataset = await this.getDataset();
    this.svg = select(this.chartElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.createTitles();
    this.createAxes();
    this.createPlots();
  }

  createTitles() {
    this.svg
      ?.append('text')
      .text(this.title)
      .attr('x', this.width / 2)
      .attr('y', this.margin.top / 3)
      .attr('id', 'title')
      .attr('text-anchor', 'middle')
      .style('font-size', '24px');
    this.svg
      ?.append('text')
      .text(this.getDescription())
      .attr('x', this.width / 2)
      .attr('y', this.margin.top / 1.3)
      .attr('id', 'description')
      .attr('text-anchor', 'middle')
      .style('font-size', '20px');
  }

  createAxes() {
    const xRange = extent(
      this.dataset?.monthlyVariance || [],
      (d: MonthlyVariance) => {
        return d.year;
      }
    ) as [unknown, unknown] as [number, number];
    const [yMin, yMax] = extent(
      this.dataset?.monthlyVariance || [],
      (d: MonthlyVariance) => {
        return d.month;
      }
    ) as [unknown, unknown] as [number, number];

    const xTicks = this.createYearTicks(xRange, 10);

    this.xScale = scaleLinear()
      .domain([xRange[0], xRange[1]])
      .range([this.margin.left, this.width - this.margin.right]);
    this.yScale = scaleLinear()
      .domain([yMax + 0.5, yMin - 0.5])
      .range([this.height - this.margin.bottom, this.margin.top]);
    const partialExtent = extent(
      this.dataset?.monthlyVariance ?? [],
      (d: MonthlyVariance) => {
        return (this.dataset?.baseTemperature || 0) + d.variance;
      }
    );
    this.temperatureRange = [
      partialExtent[0] ?? 0, // Default min value
      partialExtent[1] ?? 0, // Default max value
    ];

    this.xAxis = axisBottom(this.xScale)
      .tickFormat((d: NumberValue) => {
        return d.toString();
      })
      .tickValues(xTicks);
    this.yAxis = axisLeft(this.yScale).tickFormat((monthNumber: NumberValue) =>
      this.getMonthName(monthNumber)
    );

    this.svg
      ?.append('g')
      .attr('id', 'y-axis')
      .call(this.xAxis)
      .attr(
        'transform',
        `translate(${0}, ${this.height - this.margin.bottom})`
      );
    this.svg
      ?.append('g')
      .attr('id', 'x-axis')
      .call(this.yAxis)
      .attr('transform', `translate(${this.margin.left}, ${0})`);
  }

  createPlots() {
    let yAxisTicksDistance = this.getYAxisTicksDistance();
    let xAxisTicksDistance = this.getXAxisTicksDistance();
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

  getYAxisTicksDistance() {
    let ticks = this.yScale?.ticks();
    if (this.yScale && ticks && ticks.length > 1) {
      return Math.abs(this.yScale(ticks?.[1]) - this.yScale(ticks?.[0]));
    }
    return 0;
  }

  getXAxisTicksDistance() {
    let ticks = this.xScale?.ticks();
    if (this.xScale && ticks && ticks.length > 1) {
      return Math.abs(this.xScale(ticks?.[1]) - this.xScale(ticks?.[0]));
    }
    return 0;
  }

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

  getMonthName(monthNumber: NumberValue) {
    const monthNames = new Intl.DateTimeFormat('en-US', { month: 'long' });
    const date = new Date(2025, Number(monthNumber) - 1, 1);
    return monthNames.format(date);
  }

  async getDataset(): Promise<Dataset> {
    const response = await fetch(this.jsonUrl);
    const data = await response.json();
    return data;
  }

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
