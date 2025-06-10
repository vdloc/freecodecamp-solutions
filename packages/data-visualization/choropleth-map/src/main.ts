import './style.css';
import {
  extent,
  geoIdentity,
  GeoPath,
  geoPath,
  GeoPermissibleObjects,
  json,
  ScaleQuantize,
  scaleQuantize,
  schemeBlues,
  select,
  Selection,
  ValueFn,
} from 'd3';
import * as topojson from 'topojson-client';
import {
  Topology,
  GeometryObject,
  Objects,
  Properties,
} from 'topojson-specification';

type CountyEducation = {
  fips: number;
  state: string;
  area_name: string;
  bachelorsOrHigher: number;
};

type CountyGeometry = {
  id: number;
  type: 'Feature';
  properties: {
    name: string;
    id: number;
    state: string;
    [key: string]: any;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: [number, number][][];
  };
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
  private toolTipElement: HTMLElement;
  private svg: Selection<SVGSVGElement, unknown, null, any> | null;
  private colorScale: ScaleQuantize<string, string> | null;
  private paths: ValueFn<SVGPathElement, unknown, any> | null;

  constructor() {
    this.width = 900;
    this.height = 900;
    this.chartElement = document.getElementById('chart') as HTMLElement;
    this.toolTipElement = this.chartElement.querySelector(
      '#tooltip'
    ) as HTMLElement;
    this.svg = null;
    this.colorScale = null;
    this.paths = null;
    this.init();
  }

  async init() {
    let [unemployment, counties] = await this.getData();
    this.counties = counties;
    this.unemployment = unemployment;
    this.geoData = this.getGeoData();
    this.colorScale = this.getColorScale();
    this.paths = this.getPaths();
    this.svg = select(this.chartElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.createPlots();
    this.createLegend();
  }

  async getData() {
    return await Promise.all(
      [Chart.UNEMPLOYEE_DATA_URL, Chart.COUNTIES_DATA_URL].map((url) =>
        fetch(url).then((res) => res.json())
      )
    );
  }

  getGeoData() {
    if (!this.counties) return {};

    const { objects } = this.counties as Topology;
    const geoData: Record<keyof typeof objects, any> = {};

    for (let key in objects) {
      geoData[key as keyof typeof objects] = topojson.feature(
        this.counties,
        objects[key]
      );
    }

    return geoData;
  }

  getPaths(): ValueFn<SVGPathElement, unknown, any> {
    const projection = geoIdentity().fitSize(
      [this.width, this.height],
      this.geoData.nation
    );
    return geoPath(projection) as ValueFn<SVGPathElement, unknown, any>;
  }

  getColorScale() {
    let dataRange = extent(
      this.unemployment.map((record) => Number(record.bachelorsOrHigher))
    );

    return scaleQuantize(dataRange as number[], schemeBlues[7]);
  }

  createPlots() {
    if (!this.svg) return;

    this.svg
      .selectAll('path')
      .data(this.geoData.counties.features)
      .enter()
      .append('path')
      .attr('d', this.paths)
      .attr('class', 'county')
      .attr('fill', (datum) => {
        const { id } = datum as CountyGeometry;
        const percent = this.unemployment.find((item) => item.fips === id);

        return this.colorScale
          ? this.colorScale(Number(percent?.bachelorsOrHigher) ?? 4)
          : null;
      })
      .attr('data-fips', (datum) => {
        const { id } = datum as CountyGeometry;
        const percent = this.unemployment.find((item) => item.fips === id);

        return percent?.fips || id;
      })
      .attr('data-education', (datum) => {
        const { id } = datum as CountyGeometry;
        const percent = this.unemployment.find((item) => item.fips === id);

        return percent?.bachelorsOrHigher ?? 4;
      })
      .on('mouseover', (event, datum) => {
        const { id } = datum as CountyGeometry;
        const percent = this.unemployment.find((item) => item.fips === id);
        const tooltip = select(this.toolTipElement);

        tooltip
          .style('opacity', 1)
          .style('visibility', 'visible')
          .attr('id', 'tooltip')
          .attr('data-education', percent?.bachelorsOrHigher ?? 4)
          .html(
            `${percent?.area_name}, ${percent?.state}: ${percent?.bachelorsOrHigher}%`
          )
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY}px`);
      })
      .on('mouseout', () => {
        const tooltip = select(this.toolTipElement);
        tooltip.style('opacity', 0).style('visibility', 'hidden');
      });
  }

  createLegend() {
    if (!this.svg) return;
  }
}

new Chart();
