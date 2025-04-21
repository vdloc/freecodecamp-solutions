import { Selection } from 'd3-selection';

export type MonthlyVariance = {
  year: number;
  month: number;
  variance: number;
};

export type Dataset = {
  baseTemperature: number;
  monthlyVariance: MonthlyVariance[];
};

export type ChartParams = {
  title: string;
  description: string;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  chartElement: HTMLElement;
  tooltipElement: HTMLElement;
};

export enum ChartColor {
  Blue = '#2A4F8A',
  LightBlue = '#6CAED1',
  Cyan = '#AEDDDE',
  LightYellow = '#FFF6B2',
  Yellow = '#FAD45D',
  LightOrange = '#F7B255',
  Orange = '#F48C42',
  RedOrange = '#F25B3F',
  Red = '#D73027',
}

export type SVGSelection = Selection<SVGSVGElement, unknown, null, any> | null;

export interface ColorDataEntry {
  color: string;
  start: number;
  end: number;
}
