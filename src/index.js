import './sass/style.scss';
import './components/table/table.main.scss';

import CanvasChart from './components/chart/chart';

import getGLobalCases from './components/cases-by-region/CasesByRegion';

import getData from './components/table/table.main';

import toggle from './components/cases-by-region/toggle';

import initMap from './components/map/mapInit.component';

const graph = new CanvasChart();

getGLobalCases().then(toggle);

initMap('https://disease.sh/v3/covid-19/countries');

getData();

graph.init();
