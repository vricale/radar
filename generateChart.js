const { createCanvas } = require('canvas');
const Chart = require('chart.js');

function generateRadarChartImage(data, labels) {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');

  // Create a new chart instance
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'ETH Address Metrics',
        data: data,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
      }]
    },
    options: {
      scales: {
        r: {
          angleLines: {
            display: false
          },
          ticks: {
            display: false
          },
          grid: {
            display: false
          },
          pointLabels: {
            display: true
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  // Return the canvas as a base64 string
  return canvas.toDataURL();
}

module.exports = generateRadarChartImage;

