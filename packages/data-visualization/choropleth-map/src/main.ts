import './style.css';
import {
  geoIdentity,
  geoPath,
  json,
  scaleQuantize,
  scaleThreshold,
  schemeBlues,
  select,
} from 'd3';
import * as topojson from 'topojson-client';

const CANVAS = {
  w: 700,
  h: 700,
};
const unemployment = await json(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
);
const counties: any = await json(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
);
console.log(' unemployment:', counties);

const geoData: Record<string, any> = {};
const keys = Object.keys(counties.objects);

keys.forEach((key) => {
  geoData[key] = topojson.feature(counties, counties.objects[key]);
});
console.log(' keys:', keys);
const projection = geoIdentity().fitSize([CANVAS.w, CANVAS.h], geoData.nation);
const paths = geoPath(projection);

const colorScale = scaleQuantize().domain([0, 100]).range(schemeBlues[6].map((d) => parseFloat(d)));

const svgContainer = select('#chart')
  .append('svg')
  .attr('viewBox', `0 0 ${CANVAS.w} ${CANVAS.h}`)
  .attr('width', CANVAS.w)
  .classed('floormap', true);

const groups = svgContainer
  .selectAll('g')
  .data(keys)
  .enter()
  .append('g')
  .attr('class', (d) => d);

// Create all paths for the separate g element
const assets = groups
  .selectAll('path')
  .data((d) => geoData[d]?.features)
  .enter()
  .append('path')
  .attr('d', paths)
  .attr('class', 'county');
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
