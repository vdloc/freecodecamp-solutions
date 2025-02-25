import Chart from './chart';
import './style.css';

const chart = new Chart({
  title: 'Monthly Global Land-Surface Temperature',
  margin: { top: 20, right: 20, bottom: 50, left: 60 },
  width: 1500,
  height: 800,
  chartElement: document.getElementById('chart') as HTMLElement,
});

chart.init();
