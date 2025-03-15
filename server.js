import wisp from "wisp-server-node";
import { createBareServer } from "@tomphttp/bare-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import cors from 'cors';
import bodyParser from 'body-parser';

const bare = createBareServer("/bare/");
const __dirname = join(fileURLToPath(import.meta.url), "..");
const app = express();
const publicPath = "public"; // If you renamed your directory to something else

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (ensure the path to the `public` folder is correct)
app.use(express.static(publicPath));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/baremod/", express.static(bareModulePath));

// Endpoint to handle form submissions
app.post('/api/endpoint', (req, res) => {
    const inputData = req.body.data;

    // Generate a response file
    const responseContent = `You submitted: ${inputData}`;
    res.setHeader('Content-Disposition', 'attachment; filename="response.txt"');
    res.setHeader('Content-Type', 'text/plain');
    res.send(responseContent);
});

// Endpoint to process URL input
app.post('/api/process-url', (req, res) => {
    const inputUrl = req.body.url;

    let processedUrl;
    const searchUrl = "https://www.google.com/search?q=";

    if (!inputUrl.includes(".")) {
        // If no periods are detected, search Google
        processedUrl = searchUrl + encodeURIComponent(inputUrl);
    } else {
        // Add https:// if not present
        if (!inputUrl.startsWith("http://") && !inputUrl.startsWith("https://")) {
            processedUrl = "https://" + inputUrl;
        } else {
            processedUrl = inputUrl;
        }
    }

    // Encode the URL for Ultraviolet
    const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(processedUrl);
    res.json({ encodedUrl });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404);
    res.sendFile(join(__dirname, publicPath, "404.html")); // Ensure 404 page exists
});

const server = createServer();

server.on("request", (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res); // Let Express handle static files
    }
});

server.on("upgrade", (req, socket, head) => {
    if (req.url.endsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
    } else if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080; // Default port

server.on("listening", () => {
    const address = server.address();
    console.log("Listening on:");
    console.log(`\thttp://localhost:${address.port}`);
    console.log(
        `\thttp://${
            address.family === "IPv6" ? `[${address.address}]` : address.address
        }:${address.port}`
    );
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close();
    bare.close();
    process.exit(0);
}

server.listen({ port });
