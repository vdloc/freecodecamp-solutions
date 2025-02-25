import { Dataset, ChartParams } from './types';
import { Axis } from 'd3-axis';
import { ScaleLinear } from 'd3-scale';
import { select, Selection } from 'd3-selection';

export default class Chart implements ChartParams {
  dataset: Dataset | null;
  title: string;
  margin: { top: number; right: number; bottom: number; left: number };
  xAxis: Axis<number> | null;
  yAxis: Axis<number> | null;
  xScale: ScaleLinear<number, number> | null;
  yScale: ScaleLinear<number, number> | null;
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
    this.svg = null;
    this.title = title;
    this.margin = margin;
    this.chartElement = chartElement;
    this.width = width;
    this.height = height;
  }

  async init() {
    this.dataset = await this.getDataset();
    this.svg = select(this.chartElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.createTitles();
  }

  createTitles() {
    this.svg
      ?.append('text')
      .text(this.title)
      .attr('x', this.width / 2)
      .attr('y', this.margin.top)
      .attr('id', 'title')
      .attr('text-anchor', 'middle')
      .style('font-size', '24px');
  }

  createAxes() {}

  async getDataset(): Promise<Dataset> {
    const response = await fetch(this.jsonUrl);
    const data = await response.json();
    return data;
  }
}
