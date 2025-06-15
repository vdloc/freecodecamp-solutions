import './style.css';
import {
  axisBottom,
  extent,
  geoIdentity,
  geoPath,
  hierarchy,
  json,
  scaleLinear,
  scaleOrdinal,
  ScaleOrdinal,
  ScaleQuantize,
  scaleQuantize,
  schemeBlues,
  select,
  Selection,
  treemap,
  ValueFn,
} from 'd3';

const textWrap = (window.d3plus as any).textWrap;

type Data = { children: Data[]; name: string; value?: string | number } | null;

class Chart {
  private static readonly DATA_URL =
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';
  private data: Data = null;

  public static readonly WIDTH = 900;
  public static readonly HEIGHT = 600;
  private legendWidth = 600;
  private legendHeight = 400;

  private chartElement: HTMLElement;
  private toolTipElement: HTMLElement;
  private svg: Selection<SVGSVGElement, unknown, null, any> | null;
  private colorScale: ScaleOrdinal<string, string> | null;

  constructor() {
    this.chartElement = document.getElementById('chart') as HTMLElement;
    this.toolTipElement = this.chartElement.querySelector(
      '#tooltip'
    ) as HTMLElement;
    this.svg = null;
    this.colorScale = null;
    this.data = null;
    this.init();
  }

  async init() {
    this.svg = select(this.chartElement)
      .append('svg')
      .attr('width', Chart.WIDTH)
      .attr('height', Chart.HEIGHT);
    this.data = (await json(Chart.DATA_URL)) as Data;
    this.colorScale = this.getColorScale();
    this.createLegend();
    this.createPlots();
  }

  getColorScale() {
    let children = this.data?.children ?? [];
    let devices = children.map((child) => child?.name ?? '');
    let colors = Array.from({ length: devices.length }, () =>
      this.getRandomColor()
    );

    return scaleOrdinal(devices as string[], colors);
  }

  createPlots() {
    if (!this.svg) return;
    const root = hierarchy(this.data)
      .sum((d) => Number(d?.value) || 0)
      .sort((a, b) => (b?.value ?? 0) - (a?.value ?? 0));
    const treeMap = treemap<unknown>()
      .size([Chart.WIDTH, Chart.HEIGHT - this.legendHeight])
      .padding(1);

    treeMap(root as any);
    const groups = this.svg
      .selectAll('g')
      .data(root.leaves() as any[])
      .enter()
      .append('g')
      .attr('transform', (d: any) => {
        console.log(' d:', d);
        return `translate(${d.x0}, ${d.y0})`;
      });

    groups
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => {
        return this.colorScale ? this.colorScale(d.data.category) : '';
      })
      .attr('class', 'tile')
      .attr('data-name', (d) => d.data.name)
      .attr('data-category', (d) => d.data.category)
      .attr('data-value', (d) => d.data.value)
      .on('mouseover', (event, d) => {
        this.toolTipElement.classList.add('visible');
        this.toolTipElement.style.left = `${event.pageX}px`;
        this.toolTipElement.style.top = `${event.pageY}px`;
        this.toolTipElement.innerHTML = `
          <div>
            <span class="tooltip-label">Name:</span>
            <span class="tooltip-value">${d.data.name}</span>
          </div>
          <div>
            <span class="tooltip-label">Category:</span>
            <span class="tooltip-value">${d.data.category}</span>
          </div>
          <div>
            <span class="tooltip-label">Value:</span>
            <span class="tooltip-value">${d.data.value}</span>
          </div>
        `;
        this.toolTipElement.setAttribute('data-value', d.data.value);
      })
      .on('mouseout', () => {
        this.toolTipElement.classList.remove('visible');
        this.toolTipElement.innerHTML = '';
      });

    groups
      .append('text')
      .text((d) => d.data.name)
      .attr('x', 5)
      .attr('y', 15)
      .attr('fill', 'white')
      .attr('font-size', '8px')
      .attr('pointer-events', 'none');
  }

  createLegend() {
    if (!this.svg) return;

    const legend = this.svg.append('g').attr('id', 'legend');
    legend
      .attr(
        'transform',
        `translate(${(Chart.WIDTH - this.legendWidth) / 2}, ${
          Chart.HEIGHT - this.legendHeight
        })`
      )
      .attr('width', this.legendWidth)
      .attr('height', this.legendHeight);

    const legendItem = legend
      .selectAll('g')
      .data(this.data?.children.map((child) => child?.name) || [])
      .join('g')
      .attr('width', this.legendWidth / 3)
      .attr('height', 20)
      .attr(
        'transform',
        (d, i) =>
          `translate(${(i % 3) * (this.legendWidth / 3)}, ${
            Math.floor(i / 3) * (20 + 10)
          })`
      );

    legendItem
      .append('rect')
      .attr('class', 'legend-item')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', (d) => {
        return this.colorScale ? this.colorScale(d as string) : '';
      });
    legendItem
      .append('text')
      .text((d) => d as string)
      .attr('x', 25)
      .attr('y', 15);

    const bbox = legend.node()?.getBBox();

    if (bbox) {
      this.legendWidth = bbox.width;
      this.legendHeight = bbox.height;
      legend.attr(
        'transform',
        `translate(${(Chart.WIDTH - this.legendWidth) / 2}, ${
          Chart.HEIGHT - this.legendHeight
        })`
      );
    }
  }

  getRandomColor() {
    return Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 256)
    ).reduce((colorString, part, index) => {
      return `${colorString}${part}${index < 2 ? ',' : ')'}`;
    }, 'rgb(');
  }
}

new Chart();
