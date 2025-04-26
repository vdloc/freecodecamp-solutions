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
const unemployment: (Record<string, any> | undefined)[] =
  (await json(
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
  )) ?? [];
const counties: any = await json(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
);
console.log(' unemployment:', unemployment);

const geoData: Record<string, any> = {};
const keys = Object.keys(counties.objects);

keys.forEach((key) => {
  geoData[key] = topojson.feature(counties, counties.objects[key]);
});
console.log(' keys:', keys);
const projection = geoIdentity().fitSize([CANVAS.w, CANVAS.h], geoData.nation);
const paths = geoPath(projection);

const colorScale = scaleQuantize().domain([3, 66]).range(schemeBlues[9]);
console.log(' colorScale:', colorScale);

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
