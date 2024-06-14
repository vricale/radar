const { createCanvas } = require('canvas');
const { Chart, registerables } = require('chart.js');
Chart.register(...registerables);

function generateRadarChartImage(data, labels) {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');

  // Create a new chart instance directly without assigning it to a variable
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'ETH Address Metrics',
        data: data,
        fill: true,
        backgroundColor: 'rgba(172,154,220,0.5)',
        borderColor: 'rgb(71,9,129)',
        pointBackgroundColor: 'rgba(166,143,227,0.5)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(115,8,215)'
      }]
    },
    options: {
      scales: {
        r: {
          angleLines: {
            display: false
          },
          ticks: {
            display: false,
            beginAtZero: true,
            max: 100  // Set the maximum value of the scale
          },
          pointLabels: {
            display: true,
          },
          grid: {
            display: true,
            borderColor:  (context) => {
              // Only display the outermost grid line
              return context.tick.value === context.scale.max ? '#ccc' : 'rgba(0, 0, 0, 0)';
            }
          },
          suggestedMin: 0,
          suggestedMax: 100
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });

  return canvas.toDataURL(); // Returns base64 string of the image
}

module.exports = generateRadarChartImage;
