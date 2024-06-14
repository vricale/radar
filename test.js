const generateRadarChartImage = require('./generateChart');

const normalizeData = (data) => {
    const maxVal = Math.max(...data);
    const normalized = data.map(val => (val / maxVal) * 100);
    console.log("Normalized Data:", normalized); // Add this line to log the output
    return normalized;
};


// Modify the data before passing it to the chart
const normalizedData = normalizeData([50, 50, 50, 90, 50]);

const labels = ['Articles', 'Followers', 'Comments', 'Likes', 'NFTs'];

const imageData = generateRadarChartImage(normalizedData, labels);
console.log(imageData);
