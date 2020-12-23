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
      })
      .catch((err) => console.error(err));
  }

  nextRequest(url, key, country) {
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const dataArr = result.sort((a, b) => a[key] - b[key]);
        const sortedArr = dataArr.map((a) => a[key]);
        this.configedChart.destroy();
        this.createBarGraph(sortedArr,
          dataArr.map((v, i, arr) => getDayOfStat((arr.length - i - 1))),
          country);
      });
  }

  makeNewGraph() {
    document.querySelector('.chart__select').addEventListener('change', (v) => {
      // Need to be refactor
      switch (v.target.value) {
        case 'overall-cases':
          this.nextRequest('https://api.covid19api.com/world', 'TotalConfirmed', 'World');
          break;
        case 'overall-deaths':
          this.nextRequest('https://api.covid19api.com/world', 'TotalDeaths', 'World');
          break;
        case 'overall-recovered':
          this.nextRequest('https://api.covid19api.com/world', 'TotalRecovered', 'World');
          break;
        case 'daily-cases':
          console.log('daily-cases');
          break;
        case 'daily-deaths':
          console.log('daily-deaths');
          break;
        case 'daily-recovered':
          console.log('daily-recovered');
          break;
        case 'relative-overall-cases':
          console.log('relative-overall-cases');
          break;
        case 'relative-overall-deaths':
          console.log('relative-overall-deaths');
          break;
        case 'relative-overall-recovered':
          console.log('relative-overall-recovered');
          break;
        case 'relative-daily-cases':
          console.log('relative-daily-cases');
          break;
        case 'relative-daily-deaths':
          console.log('relative-daily-d');
          break;
        case 'relative-daily-recovered':
          console.log('relative-daily-r');
          break;
        default:
          break;
      }
    });
  }
}

export default CanvasChart;
