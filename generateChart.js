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

  const canvasWidth = 350; // Fixed width for the canvas
  const maxCanvasHeight = 400; // Maximum height constraint for the canvas
  const canvas = createCanvas(canvasWidth, maxCanvasHeight);
  const ctx = canvas.getContext('2d');

  // Load and draw the logo
  try {
    const icon = await loadImage('./c3-logo.png');
    ctx.drawImage(icon, 30, 40, 24, 24); // Adjust positioning and size
  } catch (error) {
    console.error('Failed to load the logo:', error);
    return;
  }

  // Add title text below the logo
  ctx.font = 'bold 20px Outfit'; // Use custom font 'Outfit'
  ctx.fillStyle = '#1c1e26'; // Adjust text color
  ctx.textAlign = 'left';
  ctx.fillText('Connect3 Social Score', 70, 60); // Adjust position

  // Add score text
  ctx.font = '800 38px Outfit'; // Adjust font weight and size
  ctx.fillText(score.toString(), 30, 110); // Adjust position

  // Add stats items
  ctx.font = '400 12px Inter'; // Use custom font 'Inter' for stats items
  ctx.fillStyle = '#4A5067'; // Adjust text color
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const stats1 = [
    { count: 100, label: "Posts" },
    { count: 80, label: "Followers" },
    { count: 0, label: "Comments" },
  ];

  const stats2 = [
    { count: 80, label: "Likes" },
    { count: 80, label: "NFTs" },
  ];

  let xOffset = 30; // Starting position for the first stats item
  let yOffset = 140; // Vertical position for both rows
  const statsSpacing = 16; // Spacing between stats items

  // Draw stats1 in the first row
  for (const stat of stats1) {
    ctx.fillText(`${stat.count} ${stat.label}`, xOffset, yOffset);
    xOffset += ctx.measureText(`${stat.count} ${stat.label}`).width + statsSpacing;
  }

  xOffset = 30;

  // Draw stats2 in the second row
  for (const stat of stats2) {
    ctx.fillText(`${stat.count} ${stat.label}`, xOffset, yOffset + 8); // Adjust yOffset for the second row
    xOffset += ctx.measureText(`${stat.count} ${stat.label}`).width + statsSpacing;
  }

  // Add badges section
  ctx.font = '500 20px Outfit'; // Adjust font weight and size for badges header
  ctx.fillText('Badges', 30, maxCanvasHeight - 120); // Adjust position

  // Load and draw badge images
  let badgeX = 30; // Initial X position for badges
  const badgeY = maxCanvasHeight - 100; // Y position for badges
  const badgeWidth = 64; // Width of each badge
  const badgeHeight = 64; // Height of each badge
  for (let i = 0; i < roles.length && i < 4; i++) { // Only draw up to 4 badges
    const role = roles[i];
    if (validRoles[role]) {
      try {
        const imagePath = `./${validRoles[role]}`; // Get the correct image path from the map
        const roleImage = await loadImage(imagePath);
        ctx.drawImage(roleImage, badgeX, badgeY, badgeWidth, badgeHeight); // Draw badge image
        badgeX += badgeWidth + 8; // Adjust X position for the next badge
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
            boxWidth:0,
            font: {
              size:12, // Adjust font size
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
  // Create linear gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, combinedCanvas.height);
  gradient.addColorStop(0, 'rgba(104, 38, 240, 0.04)');
  gradient.addColorStop(1, 'rgba(104, 38, 240, 0.00)');

  // Apply gradient to the background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

  ctx.drawImage(logoTextCanvas, 0, 0); // Draw logo and text canvas on the left
  ctx.drawImage(chartCanvas, logoTextCanvas.width, 0); // Draw radar chart canvas on the right

  return combinedCanvas.toDataURL(); // Returns base64 string of the image
}

module.exports = combineCanvases;