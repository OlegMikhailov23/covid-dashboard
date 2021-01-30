/* eslint-disable no-console */
import Table from './Table';

async function getData() {
  const response = await fetch('https://api.covid19api.com/summary');
  const responsePopulation = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag');
  const population = await responsePopulation.json();
  const data = await response.json();

  new Table(data, population).init().switchWindow(false, 'TotalConfirmed', 'TotalDeaths', 'TotalRecovered');
}

export default getData;
