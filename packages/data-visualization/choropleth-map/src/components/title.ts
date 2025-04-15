import type { SVGSelection } from '../types';

type AppendParams = {
  text: string;
  offsetX: number;
  offsetY: number;
  id: string;
  fontSize: number;
};

type RenderParams = {
  title: string;
  offsetX: number;
  offsetY: number;
  description: string;
  descriptionOffsetX: number;
  descriptionOffsetY: number;
};

export default class ChartTitle {
  private svg: SVGSelection;

  private static readonly TITLE_ID: string = 'title';
  private static readonly DESCRIPTION_ID: string = 'description';
  private static readonly TITLE_FONT_SIZE: number = 24;
  private static readonly DESCRIPTION_FONT_SIZE: number = 20;

  constructor(svg: SVGSelection) {
    this.svg = svg;
  }

  render({
    title,
    offsetX,
    offsetY,
    description,
    descriptionOffsetX,
    descriptionOffsetY,
  }: RenderParams): void {
    // Add main title centered at top
    this.appendText({
      text: title,
      offsetX: offsetX,
      offsetY: offsetY,
      id: ChartTitle.TITLE_ID,
      fontSize: ChartTitle.TITLE_FONT_SIZE,
    });
    // Add description below title
    this.appendText({
      text: description,
      offsetX: descriptionOffsetX,
      offsetY: descriptionOffsetY,
      id: ChartTitle.DESCRIPTION_ID,
      fontSize: ChartTitle.DESCRIPTION_FONT_SIZE,
    });
  }

  appendText({ text, offsetX, offsetY, id, fontSize }: AppendParams): void {
    this.svg
      ?.append('text')
      .text(text)
      .attr('x', offsetX)
      .attr('y', offsetY)
      .attr('text-anchor', 'middle')
      .attr('id', id)
      .style('font-size', `${fontSize}px`);
  }
}
