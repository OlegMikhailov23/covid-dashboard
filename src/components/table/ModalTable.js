const removeBrackets = (str) => str.split('(')[0].trim();

class ModalTable {
  constructor(data, population, country) {
    this.data = data;
    this.population = population;

    this.country = country;
  }

  init() {
    document.querySelector('.content__table__modal-table__close-btn').addEventListener('click', () => {
      document.querySelector('.content__table__modal-table').style.visibility = 'hidden';
    });

    this.findData();
    this.findPopulation();
  }

  findData() {
    for (let i = 0; i < this.data.Countries.length; i += 1) {
      if (removeBrackets(this.data.Countries[i].Country) === this.country) {
        // console.log(this.data.Countries[i]);
        return;
      }
    }
  }

  findPopulation() {
    for (let i = 0; i < this.data.Countries.length; i += 1) {
      if (removeBrackets(this.data.Countries[i].Country) === this.country) {
      // console.log(this.data.Countries[i]);
        return;
      }
    }
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
