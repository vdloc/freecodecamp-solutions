import { select, Selection } from 'd3-selection';

export type ShowParams = {
  offsetX: number;
  offsetY: number;
  year: number;
  month: string;
  temp: number;
  variance: number;
};
export default class ChartTooltip {
  selection: Selection<HTMLElement, unknown, null, undefined>;
  content: string = `
            <span>@year @month</span>
            <br>
            <span>@temp&deg;C</span>
            <br>
            <span>@variance&deg;C</span>                       
          `;
  constructor(private element: HTMLElement) {
    this.element = element;
    this.selection = select(this.element);
  }

  show({ offsetX, offsetY, year, month, temp, variance }: ShowParams): void {
    this.selection
      .style('display', 'block')
      .style('opacity', 1)
      .style('visibility', 'visible')
      .style('left', `${offsetX}px`)
      .style('top', `${offsetY}px`)
      .style('text-align', 'center')
      .html(
        this.content
          .replace('@year', year.toString())
          .replace('@month', month.toString())
          .replace('@temp', temp.toString())
          .replace('@variance', variance.toString())
      )
      .attr('data-year', year.toString());
  }
  hide() {
    this.selection.style('opacity', 0).style('visibility', 'hidden');
  }
}
