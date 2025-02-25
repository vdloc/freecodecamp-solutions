import { Dataset } from './types';

class Chart {
  dataset: Dataset | null;
  jsonUrl =
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
  constructor() {
    this.dataset = null;
  }

  async init() {
    this.dataset = await this.getDataset();
  }
  async getDataset(): Promise<Dataset> {
    const response = await fetch(this.jsonUrl);
    const data = await response.json();
    return data;
  }
}
