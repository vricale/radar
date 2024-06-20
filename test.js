const http = require('http');
const url = require('url');
const {combineCanvases, generateBadgeMinterCanvas} = require("./generateChart");

// Set up HTTP server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true); // Parse the URL including query strings
    if (parsedUrl.pathname === '/image') {
        const query = parsedUrl.query;
        const data = query.data ? query.data.split(',').map(Number) : [50, 50, 50, 50, 50];
        const score = query.score ? Number(query.score) : 0;
        const labels = query.labels ? query.labels.split(',') : ['Posts', 'Followers', 'Comments', 'Likes', 'NFTs'];
        const roles = query.role ? query.role.split(',').map(role => role.trim()) : [];
        const title = query.title ? query.title.trim() : 'Your Social Data';

        try {
            const imageData = await combineCanvases(data, labels, score, roles, title);

            // Respond with JSON containing the image data URL
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ data: imageData }));
        } catch (error) {
            console.error("Error generating image:", error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Failed to generate image" }));
        }
    } else     if (parsedUrl.pathname === '/imageMinted') {
        const query = parsedUrl.query;
        const roles = query.role ? query.role.split(',').map(role => role.trim()) : [];
        try {
            const imageData = await generateBadgeMinterCanvas(roles);

            // Respond with JSON containing the image data URL
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ data: imageData }));
        } catch (error) {
            console.error("Error generating image:", error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Failed to generate image" }));
        }
    } else if (parsedUrl.pathname === '/html') {
        const query = parsedUrl.query;
        const data = query.data ? query.data.split(',').map(Number) : [50, 50, 50, 50, 50];
        const score = query.score ? Number(query.score) : 0;
        const labels = query.labels ? query.labels.split(',') : ['Posts', 'Followers', 'Comments', 'Likes', 'NFTs'];
        const roles = query.role ? query.role.split(',').map(role => role.trim()) : [];
        const title = query.title ? query.title.trim() : 'Your Social Data';

        try {
            const imageData = await combineCanvases(data, labels, score, roles, title);

            // Construct HTML response with embedded image
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Generated Image</title>
                </head>
                <body>
                    <img src="${imageData}" alt="Generated Image">
                </body>
                </html>
            `;

            // Respond with HTML content
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent);
        } catch (error) {
            console.error("Error generating image:", error);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`<html><body><h1>Error generating image</h1><p>${error.message}</p></body></html>`);
        }
    } else if (parsedUrl.pathname === '/htmlMinted') {
        const query = parsedUrl.query;
        const roles = query.role ? query.role.split(',').map(role => role.trim()) : [];

        try {
            const imageData = await generateBadgeMinterCanvas(roles);

            // Construct HTML response with embedded image
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Generated Image</title>
                </head>
                <body>
                    <img src="${imageData}" alt="Generated Image">
                </body>
                </html>
            `;

            // Respond with HTML content
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent);
        } catch (error) {
            console.error("Error generating image:", error);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`<html><body><h1>Error generating image</h1><p>${error.message}</p></body></html>`);
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
