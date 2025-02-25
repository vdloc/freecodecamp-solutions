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
};
