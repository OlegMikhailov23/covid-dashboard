const removeBrackets = (str) => str.split('(')[0].trim();

class ModalTable {
  constructor(data, population, country) {
    this.data = data;
    this.population = population;

    this.country = country;
  }

  init() {
    this.content = document.querySelector('.content__table__modal-table__content');
    document.querySelector('.content__table__modal-table__close-btn').addEventListener('click', () => {
      document.querySelector('.content__table__modal-table').style.visibility = 'hidden';
    });

    this.buildModal();
  }

  findData() {
    for (let i = 0; i < this.data.Countries.length; i += 1) {
      if (removeBrackets(this.data.Countries[i].Country) === this.country) {
        return this.data.Countries[i]
      }
    }
  }

  findPopulation() {
    for (let i = 0; i < this.population.length; i += 1) {
      if (removeBrackets(this.population[i].name) === this.country) {
        return this.population[i];
      }
    }
  }

  buildModal() {
    this.currentData = this.findData();
    this.currentPopulation = this.findPopulation().population;
    this.content.innerHTML = `<div><span>Country: </span><span>${this.currentData.Country}</span></div>`;
    this.content.innerHTML += `<div><span>Total Confirmed: </span><span>${this.currentData.TotalConfirmed}</span></div>`;
    this.content.innerHTML += `<div><span>Total Deaths: </span><span>${this.currentData.TotalDeaths}</span></div>`;
    this.content.innerHTML += `<div><span>Total Recovered: </span><span>${this.currentData.TotalRecovered}</span></div>`;
    this.content.innerHTML += `<div><span>New Confirmed: </span><span>${this.currentData.NewConfirmed}</span></div>`;
    this.content.innerHTML += `<div><span>New Deaths: </span><span>${this.currentData.NewDeaths}</span></div>`;
    this.content.innerHTML += `<div><span>New Recovered: </span><span>${this.currentData.NewRecovered}</span></div>`;

    this.content.innerHTML += `<div><span>Total Confirmed per 100k people: </span><span>${((this.currentData.TotalConfirmed * 100000) / this.currentPopulation).toFixed(4)}</span></div>`;
    this.content.innerHTML += `<div><span>Total Deaths per 100k people: </span><span>${((this.currentData.TotalDeaths * 100000) / this.currentPopulation).toFixed(4)}</span></div>`;
    this.content.innerHTML += `<div><span>Total Recovered per 100k people: </span><span>${((this.currentData.TotalRecovered * 100000) / this.currentPopulation).toFixed(4)}</span></div>`;
    this.content.innerHTML += `<div><span>New Confirmed per 100k people: </span><span>${((this.currentData.NewConfirmed * 100000) / this.currentPopulation).toFixed(4)}</span></div>`;
    this.content.innerHTML += `<div><span>New Deaths per 100k people: </span><span>${((this.currentData.NewDeaths * 100000) / this.currentPopulation).toFixed(4)}</span></div>`;
    this.content.innerHTML += `<div><span>New Recovered per 100k people: </span><span>${((this.currentData.NewRecovered * 100000) / this.currentPopulation).toFixed(4)}</span></div>`;
  }
}

export default async function getDataTable(country) {
  document.querySelector('.content__table__modal-table').style.visibility = 'visible';
  const response = await fetch('https://api.covid19api.com/summary');
  const responsePopulation = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag');
  const population = await responsePopulation.json();
  const data = await response.json();

  new ModalTable(data, population, country).init();
}
