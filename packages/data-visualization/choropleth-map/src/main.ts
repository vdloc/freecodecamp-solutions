import './style.css';
import {
  extent,
  geoIdentity,
  geoPath,
  json,
  ScaleQuantize,
  scaleQuantize,
  schemeBlues,
  select,
  Selection,
} from 'd3';
import * as topojson from 'topojson-client';
import {
  Topology,
  GeometryObject,
  Objects,
  Properties,
} from 'topojson-specification';

const CANVAS = {
  w: 900,
  h: 900,
};
const unemployment: (Record<string, any> | undefined)[] =
  (await json(
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
  )) ?? [];
const counties: any = await json(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
);
const geoData: Record<string, any> = {};
const keys = Object.keys(counties.objects);

keys.forEach((key) => {
  geoData[key] = topojson.feature(counties, counties.objects[key]);
});

const projection = geoIdentity().fitSize([CANVAS.w, CANVAS.h], geoData.nation);
const paths = geoPath(projection);
const colorScale = scaleQuantize().domain([3, 66]).range(schemeBlues[9]);
const svgContainer = select('#chart')
  .append('svg')
  .attr('viewBox', `0 0 ${CANVAS.w} ${CANVAS.h}`)
  .attr('width', CANVAS.w);
const groups = svgContainer
  .selectAll('g')
  .data(keys[0])
  .enter()
  .append('g')
  .attr('class', (d) => d);
const assets = groups
  .selectAll('path')
  .data(geoData.counties.features)
  .enter()
  .append('path')
  .attr('d', paths)
  .attr('class', 'county')
  .attr('fill', (d) => {
    let id = d.id;
    let percent = unemployment.find((item) => item.fips === id);
    return colorScale(percent?.bachelorsOrHigher ?? 4);
  })
  .attr('data-fips', (d) => {
    let id = d.id;
    let percent = unemployment.find((item) => item.fips === id);

    return percent?.fips || d.id;
  })
  .attr('data-education', (d) => {
    let id = d.id;
    let percent = unemployment.find((item) => item.fips === id);

    return percent?.bachelorsOrHigher ?? 4;
  });

type CountyEducation = {
  fips: number;
  state: string;
  area_name: string;
  bachelorsOrHigher: number;
};

class Chart {
  private static readonly UNEMPLOYEE_DATA_URL =
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
  private static readonly COUNTIES_DATA_URL =
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
  private unemployment: CountyEducation[] = [];
  private counties: Topology | null = null;
  private geoData: Record<string, any> = {};

  public width: number;
  public height: number;
  private chartElement: HTMLElement;
  private svg: Selection<SVGSVGElement, unknown, null, any> | null;
  private colorScale: ScaleQuantize<number, number> | null;

  constructor() {
    this.width = 900;
    this.height = 900;
    this.chartElement = document.getElementById('chart') as HTMLElement;
    this.svg = null;
    this.colorScale = null;
    this.init();
  }

  async init() {
    let [unemployment, counties] = await this.getData();
    this.counties = counties;
    this.unemployment = unemployment;
    this.geoData = this.getGeoData();
    this.colorScale = this.getColorScale();
    this.initChart();
  }

  async getData() {
    return await Promise.all(
      [Chart.UNEMPLOYEE_DATA_URL, Chart.COUNTIES_DATA_URL].map((url) =>
        fetch(url).then((res) => res.json())
      )
    );
  }

  getGeoData() {
    const objects = this.counties?.objects || {};
    const geoData: Record<keyof typeof objects, any> = {};

    for (let key in objects) {
      geoData[key as keyof typeof objects] = topojson.feature(
        counties,
        objects[key]
      );
    }

    return geoData;
  }

  getPaths() {
    const projection = geoIdentity().fitSize(
      [this.width, this.height],
      this.geoData.nation
    );
    return geoPath(projection);
  }

  getColorScale() {
    let dataRange = extent(
      this.unemployment.map((record) => record.bachelorsOrHigher)
    );

    return scaleQuantize()
      .domain(dataRange as number[])
      .range(schemeBlues[6].map(Number));
  }

  initChart() {
    this.svg = select(this.chartElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  createPlots() {
    topojson.feature(counties, counties.objects);
  }
}

new Chart();
