import { Dataset, ChartParams, MonthlyVariance, SVGSelection } from './types';
import { select } from 'd3-selection';
import ChartTooltip from './components/tooltip';
import ChartTitle from './components/title';
import ChartAxes from './components/axes';
import ChartPlots from './components/plots';
import utils from './utils/utils';
import chartLegend, { ChartLegend } from './components/legend';

// Chart class implementing ChartParams interface for creating a temperature variance visualization
export default class Chart {
  dataset: Dataset | null;
  margin: { top: number; right: number; bottom: number; left: number };
  svg: SVGSelection;
  width: number;
  height: number;
  chartElement: HTMLElement;
  tooltipElement: HTMLElement;
  title: string;
  chartTitle: ChartTitle;
  chartTooltip: ChartTooltip;
  chartAxes: ChartAxes;
  chartPlots: ChartPlots;
  chartLegend: ChartLegend;
  utils: typeof utils = utils;

  // URL containing global temperature data in JSON format
  private readonly educationJsonUrl =
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
  private readonly countiesJsonUrl =
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

  constructor({
    title,
    margin,
    width,
    height,
    chartElement,
    tooltipElement,
  }: ChartParams) {
    this.title = title;
    this.dataset = null;
    this.margin = margin;
    this.chartElement = chartElement;
    this.tooltipElement = tooltipElement;
    this.width = width;
    this.height = height;
    this.svg = select(this.chartElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.chartTooltip = new ChartTooltip(this.tooltipElement);
    this.chartTitle = new ChartTitle(this.svg);
    this.chartAxes = new ChartAxes(this.svg);
    this.chartPlots = new ChartPlots(this.svg);
    this.chartLegend = chartLegend;
  }

  // Initialize the chart by fetching data and creating visual elements
  async init() {
    this.dataset = await this.getDataset();
    this.chartTitle.render({
      title: this.title,
      offsetX: this.width / 2,
      offsetY: this.margin.top / 3,
      description: this.getDescription(),
      descriptionOffsetX: this.width / 2,
      descriptionOffsetY: this.margin.top / 2,
    });
    this.chartAxes.render({
      monthlyVariance: (this.dataset?.monthlyVariance || []).toReversed(),
      xScaleRange: [this.margin.left, this.width - this.margin.right],
      yScaleRange: [this.height - this.margin.bottom, this.margin.top],
      xAxisBottomOffset: this.height - this.margin.bottom,
      yAxisLeftOffset: this.margin.left,
    });
    this.chartPlots.render({
      ...this.dataset,
      xScale: this.chartAxes.xScale,
      yScale: this.chartAxes.yScale,
    });
    this.chartLegend.render({
      svg: this.svg,
      dataset: this.dataset,
      offsetX: this.margin.left,
      offsetY: this.height - this.margin.bottom / 2,
    });

    if (this.chartPlots.cells) {
      this.chartPlots.cells
        .on('mouseover', this.onPlotMouseOver)
        .on('mouseout', this.onPlotsMouseOut);
    }
  }

  onPlotMouseOver = (
    event: MouseEvent,
    { year, month, variance }: MonthlyVariance
  ) => {
    if (!this.chartAxes.xScale || !this.chartAxes.yScale) return;

    let offsetX = this.chartAxes.xScale(year);
    let offsetY = this.chartAxes.yScale(month);
    let target = event.target as SVGRectElement;
    let baseTemperature = this.dataset?.baseTemperature || 0;

    select(target).attr('stroke', 'black').attr('stroke-width', 1);
    this.chartTooltip.show({
      offsetX,
      offsetY,
      year,
      month: this.utils.getMonthName(month),
      temp: this.utils.getCellTemparature(baseTemperature, variance),
      variance: parseFloat(variance.toFixed(2)),
    });
  };

  onPlotsMouseOut = (event: MouseEvent) => {
    let target = event.target as SVGRectElement;
    let fillColor = target.getAttribute('fill');
    select(target).attr('stroke', fillColor).attr('stroke-width', 0);
    this.chartTooltip.hide();
  };

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

  // Fetch temperature dataset from JSON URL
  async getDataset(): Promise<Dataset> {
    const response = await fetch(this.jsonUrl);
    const data = await response.json();
    return data;
  }
}
