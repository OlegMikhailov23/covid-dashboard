import './sass/style.scss';
import './components/table/table.main.scss';

import sayHi from './components/some-component/component';

import getData from './components/table/table.main';
import toggle from './components/table/table.switch';

sayHi();

getData().then(toggle);
