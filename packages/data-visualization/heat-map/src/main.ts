import Chart from './chart';
import './style.css';

const chart = new Chart({
  title: 'Monthly Global Land-Surface Temperature',
  margin: { top: 150, right: 20, bottom: 200, left: 60 },
  width: 1200,
  height: 1110  ,
  chartElement: document.getElementById('chart') as HTMLElement,
  tooltipElement: document.getElementById('tooltip') as HTMLElement,
});

chart.init();
