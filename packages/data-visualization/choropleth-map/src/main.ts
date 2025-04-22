// import Chart from './chart';
// import './style.css';

import { centroid, geo, plot } from '@observablehq/plot';
import { json } from 'd3';
import * as topojson from 'topojson-client';

// const chart = new Chart({
//   title: 'United States Educational Attainment',
//   description:
//     "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)",
//   margin: { top: 150, right: 20, bottom: 200, left: 60 },
//   width: 1200,
//   height: 1110,
//   chartElement: document.getElementById('chart') as HTMLElement,
//   tooltipElement: document.getElementById('tooltip') as HTMLElement,
// });

// chart.init();

const unemployment = await json(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
);
const counties = await json(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
);
console.log(' unemployment:', counties);

let states = topojson.feature(counties, counties.objects.states);

// plot({
//   width: 975,
//   height: 610,
//   projection: 'identity',
//   color: {
//     type: 'quantize',
//     n: 9,
//     domain: [1, 10],
//     scheme: 'blues',
//     label: 'Unemployment rate (%)',
//     legend: true,
//   },
//   marks: [
//     geo(
//       counties,
//       centroid({
//         fill: (d) => unemployment.get(d.id),
//         tip: true,
//         channels: {
//           County: (d) => d.properties.name,
//           State: (d) => statemap.get(d.id.slice(0, 2)).properties.name,
//         },
//       })
//     ),
//     geo(states, { stroke: 'white' }),
//   ],
// });
