import {
  Axis,
  axisBottom,
  axisLeft,
  extent,
  NumberValue,
  ScaleLinear,
  scaleLinear,
} from 'd3';
import type { MonthlyVariance, Dataset, SVGSelection } from '../types';
import utils from '../utils/utils';

type RenderParams = {
  monthlyVariance: MonthlyVariance[];
  xScaleRange: [number, number];
  yScaleRange: [number, number];
  xAxisBottomOffset: number;
  yAxisLeftOffset: number;
};
export default class ChartAxes {
  private svg: SVGSelection;
  private utils: typeof utils;
  public xRange?: [number, number];
  public yRange?: [number, number];
  public xScale?: ScaleLinear<number, number>;
  public yScale?: ScaleLinear<number, number>;
  public xAxis?: Axis<NumberValue>;
  public yAxis?: Axis<NumberValue>;

  private static readonly X_AXIS_ID: string = 'x-axis';
  private static readonly Y_AXIS_ID: string = 'y-axis';

  constructor(svg: SVGSelection) {
    this.svg = svg;
    this.utils = utils;
  }

  set dataset(dataset: Dataset) {
    this.dataset = dataset;
  }

  getRange(
    monthlyVariance: MonthlyVariance[] | [],
    rangeField: keyof MonthlyVariance
  ): [number, number] {
    return extent(
      monthlyVariance || [],
      (d: MonthlyVariance) => d[rangeField as keyof MonthlyVariance]
    ) as [unknown, unknown] as [number, number];
  }

  getScale(
    domainRange: [number, number],
    scaleRange: [number, number]
  ): ScaleLinear<number, number> {
    return scaleLinear(domainRange, scaleRange);
  }

  getXAxis(scale: ScaleLinear<number, number>, ticks: Number[] = []) {
    return axisBottom(scale)
      .tickFormat((d: NumberValue) => d.toString())
      .tickValues(ticks);
  }

  getYAxis(scale: ScaleLinear<number, number>) {
    return axisLeft(scale)
      .tickFormat((monthNumber: NumberValue) =>
        this.utils.getMonthName(monthNumber)
      )
      .tickSizeOuter(10);
  }

  render({
    monthlyVariance,
    xScaleRange,
    yScaleRange,
    xAxisBottomOffset,
    yAxisLeftOffset,
  }: RenderParams) {
    this.xRange = this.getRange(monthlyVariance, 'year');
    this.yRange = this.getRange(monthlyVariance, 'month').toReversed() as [
      number,
      number
    ];
    this.xScale = this.getScale(this.xRange, xScaleRange);
    this.yScale = this.getScale(this.yRange, yScaleRange);
    this.xAxis = this.getXAxis(this.xScale, this.createYearTicks(this.xRange));
    this.yAxis = this.getYAxis(this.yScale);

    // Add X-axis to SVG
    this.svg
      ?.append('g')
      .attr('id', ChartAxes.X_AXIS_ID)
      .call(this.xAxis)
      .attr('transform', `translate(0, ${xAxisBottomOffset})`);

    // Add Y-axis to SVG
    this.svg
      ?.append('g')
      .attr('id', ChartAxes.Y_AXIS_ID)
      .call(this.yAxis)
      .attr('transform', `translate(${yAxisLeftOffset}, 0)`);
  }

  createYearTicks([min, max]: [number, number], stepSize: number = 10) {
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
}
