const http = require('http');
const url = require('url');
const combineCanvases = require('./generateChart');

const normalizeData = (data) => {
    const maxVal = Math.max(...data);
    return data.map(val => (val / maxVal) * 100);
};

// Set up HTTP server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true); // Parse the URL including query strings
    if (parsedUrl.pathname === '/image') {
        const query = parsedUrl.query;
        const data = query.data ? query.data.split(',').map(Number) : [50, 50, 50, 50, 50];
        const score = query.score ? Number(query.score) : 0;
        const labels = query.labels ? query.labels.split(',') : ['Articles', 'Followers', 'Comments', 'Likes', 'NFTs'];
        const roles = query.role ? query.role.split(',').map(role => role.trim()) : [];
        const title = query.title ? query.title.trim() : 'Your Social Data';

        try {
            const normalizedData = normalizeData(data);
            const imageData = await combineCanvases(normalizedData, labels, score, roles, title);

            // Respond with JSON containing the image data URL
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ data: imageData }));
        } catch (error) {
            console.error("Error generating image:", error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Failed to generate image" }));
        }
    } else {
        // Handle root or other paths
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
