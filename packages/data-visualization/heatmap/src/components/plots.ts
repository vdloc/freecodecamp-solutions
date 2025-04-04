import { ScaleLinear } from 'd3';
import { SVGSelection } from '../types';

class ChartPlots {
  private svg: SVGSelection;
  constructor(svg: SVGSelection) {
    this.svg = svg;
  }

  render() {
    console.log('Rendering chart plots');
  }

  getTickDistance(scale: ScaleLinear<number, number>) {
    let ticks = scale?.ticks();
    let [startTick, endTick] = ticks ?? [];

    if (ticks.length > 1) {
      return Math.abs(scale(startTick) - scale(endTick));
    }

    return 0;
  }
}
