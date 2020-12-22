/* eslint-disable no-console */
import getData from './table.main';

let Tabulator = require('tabulator-tables');

Tabulator = Tabulator.default;

const requestOptions = {
  method: 'GET',
  redirect: 'follow',
};

const buildNewTable = (data) => {
  const tabledata = [];

  for (let i = 0; i < data.Countries.length; i += 1) {
    tabledata[i] = {
      name: `${data.Countries[i].Country}`,
      newConfirmed: `${data.Countries[i].NewConfirmed}`,
      newDeaths: `${data.Countries[i].NewDeaths}`,
      newRecovered: `${data.Countries[i].NewRecovered}`,
    };
  }

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
        field: 'newConfirmed',
        width: '25%',
        sorter: 'number',
      },
      {
        title: 'Deaths',
        field: 'newDeaths',
        width: '25%',
        sorter: 'number',
      },
      {
        title: 'Recovered',
        field: 'newRecovered',
        width: '25%',
        sorter: 'number',
      },
    ],
  });

  return table;
};

function getNewData() {
  fetch('https://api.covid19api.com/summary', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      buildNewTable(result);
    })
    .catch((error) => console.log('error', error));
}

async function getPer100ThousandTotal() {
  const response = await fetch('https://api.covid19api.com/summary');
  const responsePopulation = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag');
  const population = await responsePopulation.json();
  const data = await response.json();
  const tabledata = [];

  for (let i = 0; i < data.Countries.length; i += 1) {
    tabledata[i] = {
      name: `${data.Countries[i].Country}`,
      per100ThousendConfirmed: `${Math.round((data.Countries[i].TotalConfirmed * 100000) / population[i].population)}`,
      per100ThousendDeath: `${Math.round((data.Countries[i].TotalDeaths * 100000) / population[i].population)}`,
      per100ThousendRecovered: `${Math.round((data.Countries[i].TotalRecovered * 100000) / population[i].population)}`,
    };
  }

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
      },
      {
        title: 'Confirmed',
        field: 'per100ThousendConfirmed',
        width: '25%',
        sorter: 'number',
      },
      {
        title: 'Death',
        field: 'per100ThousendDeath',
        width: '25%',
        sorter: 'number',
      },
      {
        title: 'Recovered',
        field: 'per100ThousendRecovered',
        width: '25%',
        sorter: 'number',
      },
    ],
  });

  return table;
}

async function getPer100ThosandLastDay() {
  const response = await fetch('https://api.covid19api.com/summary');
  const responsePopulation = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag');
  const population = await responsePopulation.json();
  const data = await response.json();
  const tabledata = [];

  for (let i = 0; i < data.Countries.length; i += 1) {
    tabledata[i] = {
      name: `${data.Countries[i].Country}`,
      per100ThousendConfirmed: `${Math.round((data.Countries[i].NewConfirmed * 100000) / population[i].population)}`,
      per100ThousendDeath: `${Math.round((data.Countries[i].NewDeaths * 100000) / population[i].population)}`,
      per100ThousendRecovered: `${Math.round((data.Countries[i].NewRecovered * 100000) / population[i].population)}`,
    };
  }

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
      },
      {
        title: 'Confirmed',
        field: 'per100ThousendConfirmed',
        width: '25%',
        sorter: 'number',
      },
      {
        title: 'Death',
        field: 'per100ThousendDeath',
        width: '25%',
        sorter: 'number',
      },
      {
        title: 'Recovered',
        field: 'per100ThousendRecovered',
        width: '25%',
        sorter: 'number',
      },
    ],
  });

  return table;
}

function toggle() {
  const newConfirmedButton = document.querySelector('.content__table__switcher__last-day');
  const totalConfirmed = document.querySelector('.content__table__switcher__total');
  const per100ThousandTotal = document.querySelector('.content__table__switcher__per100-total');
  const per100ThousandLastDay = document.querySelector('.content__table__switcher__per100-last-day');
  const tableWindow = document.querySelector('.content__table__data');
  const buttonsList = document.querySelector('.content__table__switcher').children;

  newConfirmedButton.addEventListener('click', () => {
    tableWindow.innerHTML = '';
    for (let i = 0; i < buttonsList.length; i += 1) {
      buttonsList[i].classList.remove('active-button');
    }
    newConfirmedButton.classList.add('active-button');
    getNewData();
  });

  totalConfirmed.addEventListener('click', () => {
    tableWindow.innerHTML = '';
    for (let i = 0; i < buttonsList.length; i += 1) {
      buttonsList[i].classList.remove('active-button');
    }
    totalConfirmed.classList.add('active-button');
    getData();
  });
  per100ThousandTotal.addEventListener('click', () => {
    tableWindow.innerHTML = '';
    for (let i = 0; i < buttonsList.length; i += 1) {
      buttonsList[i].classList.remove('active-button');
    }
    per100ThousandTotal.classList.add('active-button');
    getPer100ThousandTotal();
  });
  per100ThousandLastDay.addEventListener('click', () => {
    tableWindow.innerHTML = '';
    for (let i = 0; i < buttonsList.length; i += 1) {
      buttonsList[i].classList.remove('active-button');
    }
    per100ThousandLastDay.classList.add('active-button');
    getPer100ThosandLastDay();
  });
}

export default toggle;
