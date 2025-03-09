import { select, Selection } from 'd3-selection';
export default class Tooltip {
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

  display(): void {
    this.element.style.display = 'block';
  }
}
