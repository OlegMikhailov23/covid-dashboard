import Chart from 'chart.js';

function getDayOfStat(before) {
  const date = new Date();
  date.setDate(date.getDate() - before);
  return date;
}

class CanvasChart {
  constructor() {
    this.ctx = document.getElementById('graph').getContext('2d');
  }

  init() {
    this.firstRequest('https://api.covid19api.com/world');
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
    // .catch((err) => console.error(err));
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
        const coefficient = 7600000000 / 100000;
        const dataArr = result.sort((a, b) => a[key] - b[key]);
        const sortedArr = dataArr.map((a) => Math.floor(a[key] / coefficient));
        this.configedChart.destroy();
        this.createBarGraph(sortedArr,
          dataArr.map((v, i, arr) => getDayOfStat((arr.length - i - 1))),
          title);
      });
  }

  relativeDailyRequest(url, key, title) {
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const coefficient = 7600000000 / 100000;
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
  }

  makeNewGraph() {
    document.querySelector('.chart__select').addEventListener('change', (v) => {
      // Need to be refactor
      switch (v.target.value) {
        case 'overall-cases':
          this.overallRequest('https://api.covid19api.com/world', 'TotalConfirmed', 'World');
          break;
        case 'overall-deaths':
          this.overallRequest('https://api.covid19api.com/world', 'TotalDeaths', 'World');
          break;
        case 'overall-recovered':
          this.overallRequest('https://api.covid19api.com/world', 'TotalRecovered', 'World');
          break;
        case 'daily-cases':
          this.dailyRequest('https://api.covid19api.com/world', 'TotalConfirmed', 'World');
          break;
        case 'daily-deaths':
          this.dailyRequest('https://api.covid19api.com/world', 'TotalDeaths', 'World');
          break;
        case 'daily-recovered':
          this.dailyRequest('https://api.covid19api.com/world', 'TotalRecovered', 'World');
          break;
        case 'relative-overall-cases':
          this.relativeOverallRequest('https://api.covid19api.com/world', 'TotalConfirmed', 'World');
          break;
        case 'relative-overall-deaths':
          this.relativeOverallRequest('https://api.covid19api.com/world', 'TotalDeaths', 'World');
          break;
        case 'relative-overall-recovered':
          this.relativeOverallRequest('https://api.covid19api.com/world', 'TotalRecovered', 'World');
          break;
        case 'relative-daily-cases':
          this.relativeDailyRequest('https://api.covid19api.com/world', 'TotalConfirmed', 'World');
          break;
        case 'relative-daily-deaths':
          this.relativeDailyRequest('https://api.covid19api.com/world', 'TotalDeaths', 'World');
          break;
        case 'relative-daily-recovered':
          this.relativeDailyRequest('https://api.covid19api.com/world', 'TotalRecovered', 'World');
          break;
        default:
          break;
      }
    });
  }
}

export default CanvasChart;
