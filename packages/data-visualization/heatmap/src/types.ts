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
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  chartElement: HTMLElement;
  tooltipElement: HTMLElement;
};

export enum ChartColor {
  DeepOceanBlue = '#1A2F4D',
  MidnightTeal = '#2A4C5E',
  SlateIndigo = '#3B5C7A',
  DuskPurple = '#4C5777',
  PlumShadow = '#6B4E71',
  WineBerry = '#883C5F',
  CrimsonDusk = '#9B2D4A',
  RubyGlow = '#B71C3A',
  VelvetRed = '#A0122F',
}

export type SVGSelection = Selection<SVGSVGElement, unknown, null, any> | null;
