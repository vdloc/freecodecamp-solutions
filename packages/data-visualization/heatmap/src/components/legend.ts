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
};

export class ChartLegend {
  svg: SVGSelection | null;
  utils: typeof utils;
  constructor() {
    this.utils = utils;
    this.svg = null;
  }

  render({ svg, dataset }: RenderParams) {
    this.svg = svg;
    if (!this.svg) return;
    const temparatureRange = this.getTemparatureRange(dataset);
    const colors = this.getTemparatureColors(temparatureRange);
    this.svg
      .select('g')
      .data(Object.entries(colors))
      .enter()
      .attr('id', 'legend')
      .append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', ([colorName, colorData]) => colorData.color);
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
