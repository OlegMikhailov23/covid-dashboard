import './sass/style.scss';

import getData from './components/data.map/data.map';

import map from './components/map/map.component';

map();
getData('https://api.covid19api.com/summary');
