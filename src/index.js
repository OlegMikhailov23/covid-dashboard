import './sass/style.scss';

import sayHi from './components/some-component/component';

import getGLobalCases from './components/cases-by-region/CasesByRegion';

import toggle from './components/cases-by-region/toggle';

getGLobalCases().then(toggle);

sayHi();
