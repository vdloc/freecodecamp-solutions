export type MonthlyVariance = {
  year: number;
  month: number;
  variance: number;
};

export type Dataset = {
  baseTemperature: number;
  monthlyVariance: MonthlyVariance[];
};
