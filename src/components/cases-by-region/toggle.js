import CanvasChart from '../chart/chart';

let Tabulator = require('tabulator-tables');

const graph = new CanvasChart();

Tabulator = Tabulator.default;

export function getCurrentCountry() {
  const list = document.querySelector('.tabulator-tableHolder');
  list.addEventListener('click', (e) => {
    const row = e.target.parentNode;
    const currentCountry = row.children[1].textContent;
    let slug = '';
    for (let i = 0; i < currentCountry.length; i += 1) {
      if (currentCountry[i] === ' ') {
        slug += '-';
      } else {
        slug += currentCountry[i];
      }
    }
    slug = slug.toLowerCase();
    graph.buildGraphForCountry(slug);
    return currentCountry;
  });
}

async function getNewConfirmedCases() {
  const response = await fetch('https://api.covid19api.com/summary');
  const content = await response.json();
  const tabledata = [];

  for (let i = 0; i < content.Countries.length; i += 1) {
    tabledata[i] = {
      flags: `https://www.countryflags.io/${content.Countries[i].CountryCode}/shiny/24.png`,
      name: `${content.Countries[i].Country}`,
      newConfirmed: `${content.Countries[i].NewConfirmed}`,
    };
  }

  const table = new Tabulator('#cases__cases-by-region__table', {
    columnMaxWidth: 300,
    data: tabledata,
    layout: 'fitColumns',
    columns: [
      {
        field: 'flags',
        width: '1%',
        formatter: 'image',
        headerSort: false,
      },
      {
        title: 'Country',
        field: 'name',
        width: '50%',
        headerFilter: 'input',
      },
      {
        title: 'Cases',
        field: 'newConfirmed',
        width: '31%',
        sorter: 'number',
      },
    ],
    rowClick(n, index) {
      /* eslint-disable */const currentRow = index._row.element;/* eslint-disable */
      const rows = document.querySelectorAll('.tabulator-row');
      for (let i = 0; i < rows.length; i += 1) {
        rows[i].classList.remove('select-row');
      }
      currentRow.classList.add('select-row');
      currentRow.classList.remove('tabulator-row-even');
    },
  });

  document.querySelector('input').placeholder = 'Search';

  getCurrentCountry();

  return table;
}

async function getGLobalCases() {
  const response = await fetch('https://api.covid19api.com/summary');
  const content = await response.json();
  const globalCases = content.Global.TotalConfirmed;
  const totalStats = document.querySelector('.cases__global-cases__total-cases');
  const tabledata = [];

  for (let i = 0; i < content.Countries.length; i += 1) {
    tabledata[i] = {
      flags: `https://www.countryflags.io/${content.Countries[i].CountryCode}/shiny/24.png`,
      name: `${content.Countries[i].Country}`,
      totalConfirmed: `${content.Countries[i].TotalConfirmed}`,
    };
  }

  totalStats.innerHTML = `${globalCases}`;

  const table = new Tabulator('#cases__cases-by-region__table', {
    columnMaxWidth: 300,
    data: tabledata,
    layout: 'fitColumns',
    columns: [
      {
        field: 'flags',
        width: '1%',
        formatter: 'image',
        headerSort: false,
      },
      {
        title: 'Country',
        field: 'name',
        width: '50%',
        headerFilter: 'input',
      },
      {
        title: 'Cases',
        field: 'totalConfirmed',
        width: '31%',
        sorter: 'number',
      },
    ],
    rowClick(n, index) {
      /* eslint-disable */const currentRow = index._row.element;/* eslint-disable */
      const rows = document.querySelectorAll('.tabulator-row');
      for (let i = 0; i < rows.length; i += 1) {
        rows[i].classList.remove('select-row');
      }
      currentRow.classList.add('select-row');
      currentRow.classList.remove('tabulator-row-even');
    },
  });

  document.querySelector('input').placeholder = 'Search';

  getCurrentCountry();

  return table;
}

async function getPer100ThosandCases() {
  const response = await fetch('https://api.covid19api.com/summary');
  const responsePopulation = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag');
  const population = await responsePopulation.json();
  const content = await response.json();
  const globalCases = content.Global.TotalConfirmed;
  const totalStats = document.querySelector('.cases__global-cases__total-cases');
  const tabledata = [];
  const removeBrackets = (str) => str.split('(')[0].trim();

  for (let i = 0; i < content.Countries.length; i += 1) {
    for (let j = 0; j < population.length; j += 1) {
      if (removeBrackets(content.Countries[i].Country) === removeBrackets(population[j].name)) {
        tabledata[i] = {
          flags: `https://www.countryflags.io/${content.Countries[i].CountryCode}/shiny/24.png`,
          name: `${content.Countries[i].Country}`,
          per100Thousend: `${Math.round((content.Countries[i].TotalConfirmed * 100000) / population[j].population)}`,
        };
      }
    }
  }

  totalStats.innerHTML = `${globalCases}`;

  const table = new Tabulator('#cases__cases-by-region__table', {
    columnMaxWidth: 300,
    data: tabledata,
    layout: 'fitColumns',
    columns: [
      {
        field: 'flags',
        width: '1%',
        formatter: 'image',
        headerSort: false,
      },
      {
        title: 'Country',
        field: 'name',
        width: '50%',
        headerFilter: 'input',
      },
      {
        title: 'Cases',
        field: 'per100Thousend',
        width: '31%',
        sorter: 'number',
      },
    ],
    rowClick(n, index) {
      /* eslint-disable */const currentRow = index._row.element;/* eslint-disable */
      const rows = document.querySelectorAll('.tabulator-row');
      for (let i = 0; i < rows.length; i += 1) {
        rows[i].classList.remove('select-row');
      }
      currentRow.classList.add('select-row');
      currentRow.classList.remove('tabulator-row-even');
    },
  });

  document.querySelector('input').placeholder = 'Search';

  getCurrentCountry();

  return table;
}

function toggle() {
  const newConfirmedButton = document.querySelector('.new-confirmed-button');
  const totalConfirmed = document.querySelector('.total-confirmed-button');
  const per100Thousand = document.querySelector('.per-100-button');
  const tableWindow = document.querySelector('#cases__cases-by-region__table');
  const buttonsList = document.querySelector('.cases__cases-by-region__statistics-buttons').children;

  newConfirmedButton.addEventListener('click', () => {
    tableWindow.innerHTML = '';
    for (let i = 0; i < buttonsList.length; i += 1) {
      buttonsList[i].classList.remove('active-button');
    }
    newConfirmedButton.classList.add('active-button');
    getNewConfirmedCases();
  });

  totalConfirmed.addEventListener('click', () => {
    tableWindow.innerHTML = '';
    for (let i = 0; i < buttonsList.length; i += 1) {
      buttonsList[i].classList.remove('active-button');
    }
    totalConfirmed.classList.add('active-button');
    getGLobalCases();
  });
  per100Thousand.addEventListener('click', () => {
    tableWindow.innerHTML = '';
    for (let i = 0; i < buttonsList.length; i += 1) {
      buttonsList[i].classList.remove('active-button');
    }
    per100Thousand.classList.add('active-button');
    getPer100ThosandCases();
  });
}

export default toggle;
