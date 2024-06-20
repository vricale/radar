const { createCanvas, Image } = require('canvas');
const { Chart, registerables } = require('chart.js');
Chart.register(...registerables);

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function generateCanvasForLogoAndText(score, roles) {
  // Define all valid roles and corresponding image file names
  const validRoles = {
    'creator1': 'creator1.png',
    'creator2': 'creator2.png',
    'creator3': 'creator3.png',
    'curator1': 'curator1.png',
    'curator2': 'curator2.png',
    'curator3': 'curator3.png',
    'influencer1': 'influencer1.png',
    'influencer2': 'influencer2.png',
    'influencer3': 'influencer3.png',
    'reviewer1': 'reviewer1.png',
    'reviewer2': 'reviewer2.png',
    'reviewer3': 'reviewer3.png'
  };

  const canvasHeight = 300 + (roles.length * 70); // Dynamically adjust the height based on the number of roles
  const canvas = createCanvas(350, 400);
  const ctx = canvas.getContext('2d');

  // Load and draw the logo
  try {
    const icon = await loadImage('./c3-logo.png');
    ctx.drawImage(icon, 90, 20, 60, 60); // Adjust positioning and size
  } catch (error) {
    console.error('Failed to load the logo:', error);
    return;
  }

  // Add text below the logo
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Connect3 Social Score: ' + score, 10, 105); // Adjust position

  // Load and draw role-specific images
  let yOffset = 120; // Starting position for the first role image
  for (const role of roles) {
    if (validRoles[role]) {
      try {
        const imagePath = `./${validRoles[role]}`; // Get the correct image path from the map
        const roleImage = await loadImage(imagePath);
        ctx.drawImage(roleImage, 70, yOffset, 100, 100); // Draw each image below the last
        yOffset += 110; // Increase the vertical offset for the next image
      } catch (error) {
        console.error(`Failed to load the role image for ${role}:`, error);
      }
    } else {
      console.log(`Invalid role ${role} specified, no image loaded.`);
    }
  }

  return canvas;
}

async function generateCanvasForRadarChart(data, labels, title) {
  const canvas = createCanvas(400, 300);
  const ctx = canvas.getContext('2d');
  const titleArray = title.split('|');

  // Drawing the radar chart
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: titleArray[0],
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
          display: true,
          position: 'bottom',
          // maxHeight: 300,
          labels: {
            boxPadding: 50, // Increase padding as needed
            boxHeight: 20,
            boxWidth:10,
            font: {
              size:10, // Adjust font size
            },
            textAlign: 'center',
            padding:20,
          },
        },
      },
      events: [], // Disable all interactions
    }
  });

  await new Promise(resolve => setTimeout(resolve, 100)); // Ensure chart is drawn
  return canvas;
}

async function combineCanvases(data, labels, score, roles, title) {
  const chartCanvas = await generateCanvasForRadarChart(data, labels, title);
  const logoTextCanvas = await generateCanvasForLogoAndText(score, roles);

  console.log("chartCanvas.width" ,chartCanvas.height, logoTextCanvas.height);

  const combinedCanvas = createCanvas(chartCanvas.width + logoTextCanvas.width, Math.max(chartCanvas.height, logoTextCanvas.height));
  const ctx = combinedCanvas.getContext('2d');

  ctx.drawImage(logoTextCanvas, 0, 0); // Draw logo and text canvas on the left
  ctx.drawImage(chartCanvas, logoTextCanvas.width, 0); // Draw radar chart canvas on the right

  return combinedCanvas.toDataURL(); // Returns base64 string of the image
}

module.exports = combineCanvases;