let Tabulator = require('tabulator-tables');

Tabulator = Tabulator.default;

async function getGLobalCases() {
  const response = await fetch('https://api.covid19api.com/summary');
  const content = await response.json();
  const globalCases = content.Global.TotalConfirmed;
  const totalStats = document.querySelector('.cases__global-cases__total-cases');
  const tabledata = [];

  for (let i = 0; i < content.Countries.length; i += 1) {
    tabledata[i] = { name: `${content.Countries[i].Country}`, totalConfirmed: `${content.Countries[i].TotalConfirmed}` };
  }

  totalStats.innerHTML = `${globalCases}`;

  const table = new Tabulator('#table', {
    height: '480px',
    data: tabledata,
    layout: 'fitColumns',
    columns: [
      {
        title: 'Country',
        field: 'name',
        width: '50%',
        headerFilter: 'input',
      },
      {
        title: 'Cases',
        field: 'totalConfirmed',
        width: '43%',
        sorter: 'number',
      },
    ],
  });

  document.querySelector('input').placeholder = 'Search';

  return table;
}

export default getGLobalCases;
