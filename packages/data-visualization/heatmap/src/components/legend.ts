import { extent } from 'd3';
import {
  ChartColor,
  SVGSelection,
  ColorDataEntry,
  MonthlyVariance,
  Dataset,
} from '../types';
import utils from '../utils/utils';

type RenderParams = {
  svg: SVGSelection;
  dataset: Dataset;
  offsetX: number;
  offsetY: number;
};

export class ChartLegend {
  private svg: SVGSelection | null;
  private utils: typeof utils;
  private static readonly LEGEND_ID: string = 'legend';
  private static readonly LEGEND_SIZE: number = 60;
  constructor() {
    this.utils = utils;
    this.svg = null;
  }

  render({ svg, dataset, offsetX, offsetY }: RenderParams) {
    this.svg = svg;
    if (!this.svg) return;
    const temparatureRange = this.getTemparatureRange(dataset);
    const colors = this.getTemparatureColors(temparatureRange);

    const group = this.svg
      .append('g')
      .attr('id', ChartLegend.LEGEND_ID)
      .attr('transform', `translate(${offsetX}, ${offsetY})`)
      .selectAll('rect')
      .data(Object.values(colors))
      .join('rect');

    group
      .attr('width', ChartLegend.LEGEND_SIZE)
      .attr('height', ChartLegend.LEGEND_SIZE)
      .attr('fill', (colorData, index) => {
        return colorData.color;
      })
      .attr('stroke', 'black')
      .attr('x', (_, index) => index * ChartLegend.LEGEND_SIZE)
      .attr('y', 0);

    console.log(' this.svg:', this.svg);
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
        utils.getCellTemparature(baseTemperature, variance)
    );
    return partialExtent as [unknown, unknown] as [number, number];
  }
}

const chartLegend = new ChartLegend();
export default chartLegend;
