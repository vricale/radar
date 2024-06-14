const generateRadarChartImage = require('./generateChart');

const data = [20, 40, 60, 80, 100];
const labels = ['Performance', 'Efficiency', 'Quality', 'Speed', 'Reliability'];

const imageData = generateRadarChartImage(data, labels);
console.log(imageData);
