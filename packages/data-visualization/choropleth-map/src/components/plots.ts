import { ScaleLinear } from 'd3';
import {
  MonthlyVariance,
  SVGSelection,
  ChartColor,
  ColorDataEntry,
} from '../types';
import utils from '../utils/utils';
import { Selection } from 'd3-selection';
import chartLegend, { ChartLegend } from './legend';


type RenderParams = {
  monthlyVariance: MonthlyVariance[] | [];
  xScale?: ScaleLinear<number, number>;
  yScale?: ScaleLinear<number, number>;
  baseTemperature: number;
};

export default class ChartPlots {
  private svg: SVGSelection;
  private utils: typeof utils = utils;
  legend: ChartLegend;
  public cells?: Selection<
    SVGRectElement,
    MonthlyVariance,
    SVGSVGElement,
    undefined
  > | null;

  private static readonly CELL_CLASS: string = 'cell';
  constructor(svg: SVGSelection) {
    this.svg = svg;
    this.legend = chartLegend;
    this.utils = utils;
  }

  render({ monthlyVariance, baseTemperature, xScale, yScale }: RenderParams) {
    if (!monthlyVariance || !xScale || !yScale || !this.svg) return;

    let xAxisTicksDistance = this.getTickDistance(xScale);
    let yAxisTicksDistance = this.getTickDistance(yScale);
    let cellWidth = xAxisTicksDistance / 20;
    let cellHeight = yAxisTicksDistance;
    let temparatureRange = chartLegend.getTemparatureRange({
      monthlyVariance,
      baseTemperature,
    });

    let colorRanges = chartLegend.getTemparatureColors(temparatureRange);

    this.cells = this.svg
      .selectAll('rect')
      .data(monthlyVariance)
      .enter()
      .append('rect')
      .attr('class', ChartPlots.CELL_CLASS)
      .attr('x', ({ year }: MonthlyVariance) => xScale(year))
      .attr('y', ({ month }: MonthlyVariance) => yScale(month))
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('transform', `translate(0, -${yAxisTicksDistance})`)
      .attr('data-month', ({ month }: MonthlyVariance) => month - 1)
      .attr('data-month-name', ({ month }: MonthlyVariance) =>
        this.utils.getMonthName(month)
      )
      .attr('data-year', ({ year }: MonthlyVariance) => year)
      .attr('data-temp', ({ variance }: MonthlyVariance) =>
        this.utils.getCellTemparature(baseTemperature, variance)
      )
      // .attr('transform', `translate(0, -${yAxisTicksDistance / 2})`)
      .attr('fill', ({ variance }: MonthlyVariance) =>
        this.getCellColor(
          this.utils.getCellTemparature(baseTemperature, variance),
          colorRanges
        )
      )
      .attr('stroke', ({ variance }: MonthlyVariance) =>
        this.getCellColor(
          this.utils.getCellTemparature(baseTemperature, variance),
          colorRanges
        )
      )
      .attr('stroke-width', 1);
  }

  getTickDistance(scale: ScaleLinear<number, number>) {
    let ticks = scale?.ticks();
    let [startTick, endTick] = ticks ?? [];

    if (ticks.length > 1) {
      return Math.abs(scale(startTick) - scale(endTick));
    }

    return 0;
  }

  getCellColor(
    temperature: number,
    colorsData: Record<string, ColorDataEntry>
  ) {
    for (const colorName in colorsData) {
      if (
        temperature >= colorsData[colorName].start &&
        temperature < colorsData[colorName].end
      ) {
        return colorsData[colorName].color;
      }
    }

    return ChartColor.Blue; // Default color if no match found
  }
}
