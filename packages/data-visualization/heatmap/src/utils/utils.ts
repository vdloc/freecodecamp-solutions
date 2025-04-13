import { NumberValue } from 'd3';

class Utils {

  getMonthName(monthNumber: NumberValue) {
    const monthNames = new Intl.DateTimeFormat('en-US', { month: 'long' });
    const date = new Date(2025, Number(monthNumber) - 1, 1);
    return monthNames.format(date);
  }


  getCellTemparature(baseTemperature: number, variance: number) {
    return (Number(baseTemperature || 0) + variance);
  }
}

let utils = new Utils();
export default utils;
