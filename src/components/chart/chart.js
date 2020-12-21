import Chart from 'chart.js';

class CanvasChart {
  constructor() {
    this.ctx = document.getElementById('graph').getContext('2d');
    this.chrt = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: ['01.01.2020'], // labels
        datasets: [{
          data: [1], // covid cases
          backgroundColor: '#FFAA00',
        }],
      },
      options: {
        axes: {
          display: false,
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
    });
  }

  init() {
    console.log(this.chrt);
  }
}

export default CanvasChart;
