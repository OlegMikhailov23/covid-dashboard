import Chart from 'chart.js';

function getTodayDate(before) {
  const date = new Date();
  date.setDate(date.getDate() - before);
  return date;
}

class CanvasChart {
  constructor() {
    this.ctx = document.getElementById('graph').getContext('2d');
  }

  init() {
    this.request();
  }

  createBarGraph(data, labels, place) {
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
            title: (tt) => tt[0].xLabel.slice(0, -13),
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

  request() {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch('https://api.covid19api.com/world', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        this.worldJSON = JSON.parse(result).sort((a, b) => a.TotalConfirmed - b.TotalConfirmed);
        this.worldTotalConfirmed = this.worldJSON.map((a) => a.TotalConfirmed);
        this.createBarGraph(this.worldTotalConfirmed, this.worldJSON.map((v, i, arr) => getTodayDate((arr.length - i - 1))), 'World');
      })
      .catch((error) => console.log('error', error));
  }
}

export default CanvasChart;
