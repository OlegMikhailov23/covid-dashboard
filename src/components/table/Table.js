/* eslint-disable no-console */
let Tabulator = require('tabulator-tables');

Tabulator = Tabulator.default;

export default class Table {
  constructor(data, population) {
    this.data = data;
    this.population = population;
  }

  init() {
    this.tableData = document.querySelector('.content__table__data');
    this.swtchBtn = document.querySelector('.content__table__switcher').children;

    this.btnTotal = document.querySelector('.content__table__switcher__total');
    this.btnLastDay = document.querySelector('.content__table__switcher__last-day');
    this.btnTotalPer100 = document.querySelector('.content__table__switcher__per100-total');
    this.btnLastDayPer100 = document.querySelector('.content__table__switcher__per100-last-day');

    this.btnTotal.addEventListener('click', () => {
      this.toggleStyle(this.btnTotal);
      this.switchWindow(false, 'TotalConfirmed', 'TotalDeaths', 'TotalRecovered');
    });

    this.btnLastDay.addEventListener('click', () => {
      this.toggleStyle(this.btnLastDay);
      this.switchWindow(false, 'NewConfirmed', 'NewDeaths', 'NewRecovered');
    });

    this.btnTotalPer100.addEventListener('click', () => {
      this.toggleStyle(this.btnTotalPer100);
      this.switchWindow(true, 'TotalConfirmed', 'TotalDeaths', 'TotalRecovered');
    });

    this.btnLastDayPer100.addEventListener('click', () => {
      this.toggleStyle(this.btnLastDayPer100);
      this.switchWindow(true, 'NewConfirmed', 'NewDeaths', 'NewRecovered');
    });

    // console.log(this.population, typeof this.population)
    // for (let i = 0; i < this.data.Countries.length; i += 1) {
    //   for (let j = 0; j < this.population.length; j += 1) {
    //     if (this.data.Countries[i].Country === this.population[j].name) {
    //       console.log(this.population[j].population);
    //     }
    //   }
    // }

    return this;
  }

  switchWindow(isPer100, confirmend, deaths, recovered) {
    const tabledata = [];

    if (!isPer100) {
      for (let i = 0; i < this.data.Countries.length; i += 1) {
        tabledata[i] = {
          name: `${this.data.Countries[i].Country}`,
          totalConfirmed: `${this.data.Countries[i][confirmend]}`,
          totalDeaths: `${this.data.Countries[i][deaths]}`,
          totalRecovered: `${this.data.Countries[i][recovered]}`,
        };
      }
    } else {
      for (let i = 0; i < this.data.Countries.length; i += 1) {
        let people = null;

        for (let j = 0; j < this.population.length; j += 1) {
          if (this.data.Countries[i].Country === this.population[j].name) {
            people = this.population[j].population;

            tabledata[i] = {
              name: `${this.data.Countries[i].Country}`,
              totalConfirmed: `${((this.data.Countries[i][confirmend] * 100000) / people).toFixed(4)}`,
              totalDeaths: `${((this.data.Countries[i][deaths] * 100000) / people).toFixed(4)}`,
              totalRecovered: `${((this.data.Countries[i][recovered] * 100000) / people).toFixed(4)}`,
            };
          }
        }
        console.log(people);
      }
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
          headerSort: true,
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
  }

  toggleStyle(element) {
    for (let i = 0; i < this.swtchBtn.length; i += 1) {
      this.swtchBtn[i].classList.remove('active-button');
    }
    element.classList.add('active-button');
  }
}
