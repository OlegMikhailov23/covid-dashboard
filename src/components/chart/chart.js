import Chart from 'chart.js';

function getDayOfStat(before) {
  const date = new Date();
  date.setDate(date.getDate() - before);
  return date;
}

function toFullScreen() {
  const content = document.querySelector('.content__chart');
  const screenButton = document.querySelector('.chart__fullscreen-btn');
  content.classList.add('chart__top');
  screenButton.addEventListener('click', () => {
    content.classList.toggle('to-full-screen');
  });
}

async function getPromiseWithPopulationForCountry(iso2) {
  return fetch(`https://restcountries.eu/rest/v2/alpha/${iso2}`)
    .then((response) => response.json())
    .then((data) => data.population);
}

async function getPromiseWithPopulationForWorld() {
  return fetch('https://world-population.p.rapidapi.com/worldpopulation', {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'ccb64c06cemshdec83e276b95801p1c79fejsnefcc7e3a352d',
      'x-rapidapi-host': 'world-population.p.rapidapi.com',
    },
  })
    .then((response) => response.json())
    .then((data) => data.body.world_population);
}

async function getSlugFromCountryName(country) {
  return fetch('https://api.covid19api.com/countries')
    .then((response) => response.json())
    .then((arr) => {
      let slug;
      arr.forEach((v) => {
        if (v.Country === country) {
          slug = v.Slug;
        }
      });
      return slug;
    });
}

class CanvasChart {
  constructor() {
    this.ctx = document.getElementById('graph').getContext('2d');
    this.country = 'global';
    this.select = document.querySelector('.chart__select');
    this.firstRequest('https://api.covid19api.com/world');
    toFullScreen();
  }

  createBarGraph(data, labels, place = 'World') {
    this.configedChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels, // labels
        datasets: [{
          label: place,
          data, // covid cases
          backgroundColor: '#FFAA00',
        }],
      },
      options: {
        responsive: true,
        tooltips: {
          callbacks: {
            title: (tt) => tt[0].xLabel.slice(0, -12),
          },
        },
        legend: {
          onClick: false,
        },
        axes: {
          display: false,
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                quarter: 'MMM YYYY',
              },
            },
          }],
          yAxes: [{
            ticks: {
              min: 0,
              callback: (value) => {
                if (value > 999999) return `${String(value).slice(0, -6)}m`;
                if (value > 99999) return `${String(value).slice(0, -3)}k`;
                return String(value);
              },
            },
          }],
        },
      },
    });
  }

  firstRequest(url, key = 'TotalConfirmed') {
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const dataArr = result.sort((a, b) => a[key] - b[key]);
        const sortedArr = dataArr.map((a) => a[key]);
        this.createBarGraph(sortedArr, dataArr.map((v, i, arr) => getDayOfStat((arr.length - i - 1))), 'World');
        this.makeNewGraph();
      });
  }

  overallRequest(url, key, title) {
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const dataArr = result.sort((a, b) => a[key] - b[key]);
        const sortedArr = dataArr.map((a) => a[key]);
        this.configedChart.destroy();
        this.createBarGraph(sortedArr,
          dataArr.map((v, i, arr) => getDayOfStat((arr.length - i - 1))),
          title);
      });
  }

  dailyRequest(url, key, title) {
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const dataArr = result.sort((a, b) => a[key] - b[key]);
        const sortedArr = dataArr.map((a) => a[key]);
        const copy = [].concat(sortedArr);
        sortedArr.forEach((v, i, arr) => {
          if (i > 0) {
            copy[i] = arr[i] - arr[i - 1];
          }
        });
        copy.shift();
        this.configedChart.destroy();
        this.createBarGraph(copy,
          dataArr.map((v, i, arr) => getDayOfStat((arr.length - i - 1))),
          title);
      });
  }

  relativeOverallRequest(url, key, title) {
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const worldPopulationPromise = getPromiseWithPopulationForWorld();
        worldPopulationPromise
          .then((worldPopulation) => {
            const coefficient = worldPopulation / 100000;
            const dataArr = result.sort((a, b) => a[key] - b[key]);
            const sortedArr = dataArr.map((a) => Math.floor(a[key] / coefficient));
            this.configedChart.destroy();
            this.createBarGraph(sortedArr,
              dataArr.map((v, i, arr) => getDayOfStat((arr.length - i - 1))),
              title);
          });
      });
  }

  relativeDailyRequest(url, key, title) {
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const worldPopulationPromise = getPromiseWithPopulationForWorld();
        worldPopulationPromise
          .then((worldPopulation) => {
            const coefficient = worldPopulation / 100000;
            const dataArr = result.sort((a, b) => a[key] - b[key]);
            const sortedArr = dataArr.map((a) => Math.floor(a[key] / coefficient));
            const copy = [].concat(sortedArr);
            sortedArr.forEach((v, i, arr) => {
              if (i > 0) {
                copy[i] = arr[i] - arr[i - 1];
              }
            });
            copy.shift();
            this.configedChart.destroy();
            this.createBarGraph(copy,
              dataArr.map((v, i, arr) => getDayOfStat((arr.length - i - 1))),
              title);
          });
      });
  }

  buildGraphForCountry(country) {
    getSlugFromCountryName(country).then((slug) => {
      this.select.value = 'overall-cases';
      this.country = slug;
      this.overallCountryRequest(slug);
    });
  }

  overallCountryRequest(country) {
    let url;
    switch (this.select.value) {
      case 'overall-cases':
        url = `https://api.covid19api.com/dayone/country/${country}/status/confirmed`;
        break;
      case 'overall-deaths':
        url = `https://api.covid19api.com/dayone/country/${country}/status/deaths`;
        break;
      case 'overall-recovered':
        url = `https://api.covid19api.com/dayone/country/${country}/status/recovered`;
        break;
      default:
        break;
    }
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const cases = result.map((v) => v.Cases);
        const dates = result.map((v) => new Date(v.Date));
        this.configedChart.destroy();
        this.createBarGraph(cases, dates, country);
      });
  }

  dailyCountryRequest(country) {
    let url;
    switch (this.select.value) {
      case 'daily-cases':
        url = `https://api.covid19api.com/dayone/country/${country}/status/confirmed`;
        break;
      case 'daily-deaths':
        url = `https://api.covid19api.com/dayone/country/${country}/status/deaths`;
        break;
      case 'daily-recovered':
        url = `https://api.covid19api.com/dayone/country/${country}/status/recovered`;
        break;
      default:
        break;
    }
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const cases = result.map((v) => v.Cases);
        const dates = result.map((v) => new Date(v.Date));
        const copy = [].concat(cases);
        cases.forEach((v, i, arr) => {
          if (i > 0) {
            copy[i] = arr[i] - arr[i - 1];
          }
        });
        copy.shift();
        this.configedChart.destroy();
        this.createBarGraph(copy, dates, country);
      });
  }

  relativeOverallCountryRequest(country) {
    let url;
    switch (this.select.value) {
      case 'relative-overall-cases':
        url = `https://api.covid19api.com/dayone/country/${country}/status/confirmed`;
        break;
      case 'relative-overall-deaths':
        url = `https://api.covid19api.com/dayone/country/${country}/status/deaths`;
        break;
      case 'relative-overall-recovered':
        url = `https://api.covid19api.com/dayone/country/${country}/status/recovered`;
        break;
      default:
        break;
    }
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const iso2 = result[0].CountryCode;
        const populationPromise = getPromiseWithPopulationForCountry(iso2);
        populationPromise.then((population) => {
          const coefficient = population / 100000;
          const cases = result.map((v) => Math.floor(v.Cases / coefficient));
          const dates = result.map((v) => new Date(v.Date));
          this.configedChart.destroy();
          this.createBarGraph(cases, dates, country);
        });
      });
  }

  relativeDailyCountryRequest(country) {
    let url;
    switch (this.select.value) {
      case 'relative-daily-cases':
        url = `https://api.covid19api.com/dayone/country/${country}/status/confirmed`;
        break;
      case 'relative-daily-deaths':
        url = `https://api.covid19api.com/dayone/country/${country}/status/deaths`;
        break;
      case 'relative-daily-recovered':
        url = `https://api.covid19api.com/dayone/country/${country}/status/recovered`;
        break;
      default:
        break;
    }
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const iso2 = result[0].CountryCode;
        const populationPromise = getPromiseWithPopulationForCountry(iso2);
        populationPromise.then((population) => {
          const coefficient = population / 100000;
          const cases = result.map((v) => Math.floor(v.Cases / coefficient));
          const dates = result.map((v) => new Date(v.Date));
          const copy = [].concat(cases);
          cases.forEach((v, i, arr) => {
            if (i > 0) {
              copy[i] = arr[i] - arr[i - 1];
            }
          });
          copy.shift();
          this.configedChart.destroy();
          this.createBarGraph(copy, dates, country);
        });
      });
  }

  makeNewGraph() {
    this.select.addEventListener('change', (v) => {
      switch (v.target.value) {
        case 'overall-cases':
          if (this.country === 'global') this.overallRequest('https://api.covid19api.com/world', 'TotalConfirmed', 'World');
          else this.overallCountryRequest(this.country);
          break;
        case 'overall-deaths':
          if (this.country === 'global') this.overallRequest('https://api.covid19api.com/world', 'TotalDeaths', 'World');
          else this.overallCountryRequest(this.country);
          break;
        case 'overall-recovered':
          if (this.country === 'global') this.overallRequest('https://api.covid19api.com/world', 'TotalRecovered', 'World');
          else this.overallCountryRequest(this.country);
          break;
        case 'daily-cases':
          if (this.country === 'global') this.dailyRequest('https://api.covid19api.com/world', 'TotalConfirmed', 'World');
          else this.dailyCountryRequest(this.country);
          break;
        case 'daily-deaths':
          if (this.country === 'global') this.dailyRequest('https://api.covid19api.com/world', 'TotalDeaths', 'World');
          else this.dailyCountryRequest(this.country);
          break;
        case 'daily-recovered':
          if (this.country === 'global') this.dailyRequest('https://api.covid19api.com/world', 'TotalRecovered', 'World');
          else this.dailyCountryRequest(this.country);
          break;
        case 'relative-overall-cases':
          if (this.country === 'global') this.relativeOverallRequest('https://api.covid19api.com/world', 'TotalConfirmed', 'World');
          else this.relativeOverallCountryRequest(this.country);
          break;
        case 'relative-overall-deaths':
          if (this.country === 'global') this.relativeOverallRequest('https://api.covid19api.com/world', 'TotalDeaths', 'World');
          else this.relativeOverallCountryRequest(this.country);
          break;
        case 'relative-overall-recovered':
          if (this.country === 'global') this.relativeOverallRequest('https://api.covid19api.com/world', 'TotalRecovered', 'World');
          else this.relativeOverallCountryRequest(this.country);
          break;
        case 'relative-daily-cases':
          if (this.country === 'global') this.relativeDailyRequest('https://api.covid19api.com/world', 'TotalConfirmed', 'World');
          else this.relativeDailyCountryRequest(this.country);
          break;
        case 'relative-daily-deaths':
          if (this.country === 'global') this.relativeDailyRequest('https://api.covid19api.com/world', 'TotalDeaths', 'World');
          else this.relativeDailyCountryRequest(this.country);
          break;
        case 'relative-daily-recovered':
          if (this.country === 'global') this.relativeDailyRequest('https://api.covid19api.com/world', 'TotalRecovered', 'World');
          else this.relativeDailyCountryRequest(this.country);
          break;
        default:
          break;
      }
    });
  }
}

export default CanvasChart;
