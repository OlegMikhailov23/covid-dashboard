import { getCurrentCountry } from './toggle';

let Tabulator = require('tabulator-tables');

Tabulator = Tabulator.default;

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
    /* rowClick: function(i, index) {
      let rows = document.querySelectorAll('.tabulator-row');
      for(let i = 0; i < rows.length; i += 1){
        rows[i].classList.remove('select-row')
      }
      let currentRow = index._row.element;
      currentRow.classList.add('select-row');
      console.log(index._row.element.classList)
    } */
  });

  document.querySelector('input').placeholder = 'Search';

  getCurrentCountry();

  return table;
}

export default getGLobalCases;
