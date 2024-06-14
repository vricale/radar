const { createCanvas, Image } = require('canvas');
const { Chart, registerables } = require('chart.js');
Chart.register(...registerables);

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

async function generateRadarChartImage(data, labels) {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');

  try {
    const icon = await loadImage('./c3-logo.png'); // Ensure this path is correct
    ctx.drawImage(icon, 20, 20, 50, 50); // Adjust position and size as needed
  } catch (error) {
    console.error('Failed to load the image:', error);
    return; // Stop execution if the image cannot be loaded
  }

  // Add additional text
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Address stats on Base, Jun 13, 2024', 80, 60); // Adjust position and font as needed

  // Create a new chart instance
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
            max: 100,
            stepSize: 100
          },
          pointLabels: {
            display: true,
          },
          grid: {
            display: true,
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
