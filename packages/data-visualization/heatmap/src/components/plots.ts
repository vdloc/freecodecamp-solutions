import { ScaleLinear, extent } from 'd3';
import { MonthlyVariance, SVGSelection, ChartColor, Dataset } from '../types';
import utils from '../utils/utils';
import { Selection } from 'd3-selection';

type RenderParams = {
  monthlyVariance: MonthlyVariance[] | [];
  xScale?: ScaleLinear<number, number>;
  yScale?: ScaleLinear<number, number>;
  baseTemperature: number;
};

interface ColorDataEntry {
  color: string;
  start: number;
  end: number;
}

export default class ChartPlots {
  private svg: SVGSelection;
  private utils: typeof utils = utils;
  public cells?: Selection<
    SVGRectElement,
    MonthlyVariance,
    SVGSVGElement,
    undefined
  > | null;

  private static readonly CELL_CLASS: string = 'cell';
  constructor(svg: SVGSelection) {
    this.svg = svg;
  }

  render({ monthlyVariance, baseTemperature, xScale, yScale }: RenderParams) {
    if (!monthlyVariance || !xScale || !yScale || !this.svg) return;

    let xAxisTicksDistance = this.getTickDistance(xScale);
    let yAxisTicksDistance = this.getTickDistance(yScale);
    let cellWidth = xAxisTicksDistance / 20;
    let cellHeight = yAxisTicksDistance;
    console.log(' yAxisTicksDistance:', yAxisTicksDistance);

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
        this.getCellTemparature(baseTemperature, variance)
      )
      // .attr('transform', `translate(0, -${yAxisTicksDistance / 2})`)
      .attr('fill', ({ variance }: MonthlyVariance) =>
        this.getCellColor(this.getCellTemparature(baseTemperature, variance))
      )
      .attr('stroke', ({ variance }: MonthlyVariance) =>
        this.getCellColor(this.getCellTemparature(baseTemperature, variance))
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

  getCellTemparature(baseTemperature: number, variance: number) {
    return Number(baseTemperature || 0) + variance;
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

  // Create color scale based on temperature range
  getTemparatureColors(temperatureRange: [number, number] = [0, 0]) {
    let [startTemperature, endTemperature] = temperatureRange;
    const colors = Object.entries(ChartColor);
    const colorsCount = colors.length;
    const temperatureStep = (endTemperature - startTemperature) / colorsCount;

    return colors.reduce<Record<string, ColorDataEntry>>(
      (colorsData, [colorName, colorValue], index) => {
        colorsData[colorName] = {
          color: colorValue,
          start: startTemperature + index * temperatureStep,
          end: startTemperature + (index + 1) * temperatureStep,
        };
        return colorsData;
      },
      {}
    );
  }

  getTemparatureRange({ monthlyVariance, baseTemperature }: Dataset) {
    const partialExtent = extent(
      monthlyVariance ?? [],
      ({ variance }: MonthlyVariance) =>
        this.getCellTemparature(baseTemperature, variance)
    );
    return partialExtent;
  }
}
