/* eslint-disable no-console */
let Tabulator = require('tabulator-tables');

Tabulator = Tabulator.default;

const requestOptions = {
  method: 'GET',
  redirect: 'follow',
};

const buildTable = (data) => {
  const tabledata = [];
  console.log(data.Countries);

  for (let i = 0; i < data.Countries.length; i += 1) {
    tabledata[i] = {
      name: `${data.Countries[i].Country}`,
      totalConfirmed: `${data.Countries[i].TotalConfirmed}`,
      totalDeaths: `${data.Countries[i].TotalDeaths}`,
      totalRecovered: `${data.Countries[i].TotalRecovered}`,
    };
  }
  // console.log(tabledata);

  const table = new Tabulator('.content__table__data', {
    height: '430px',
    columnMaxWidth: 300,
    data: tabledata,
    layout: 'fitColumns',
    columns: [
      {
        title: 'Country',
        field: 'name',
        width: '20%',
        headerSort: false,
      },
      {
        title: 'Confirmend',
        field: 'totalConfirmed',
        width: '25%',
        sorter: 'number',
      },
      {
        title: 'Deaths',
        field: 'totalDeaths',
        width: '25%',
        sorter: 'number',
      },
      {
        title: 'Recovered',
        field: 'totalRecovered',
        width: '25%',
        sorter: 'number',
      },
    ],
  });

  return table;
};

function getData() {
  fetch('https://api.covid19api.com/summary', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      buildTable(result);
    })
    .catch((error) => console.log('error', error));
}

export default getData;
