const http = require('http');
const url = require('url');
const path = require('path');

// Import our API handlers
const indexHandler = require('./api/index.js').default;
const statsHandler = require('./api/stats.js').default;
const messageHandler = require('./api/message.js').default;
const dataHandler = require('./api/data.js').default;

const PORT = 3000;

// Mock response object to match Vercel's interface
function createMockRes(res) {
  return {
    status: (code) => ({
      send: (data) => {
        res.writeHead(code, { 'Content-Type': 'text/html' });
        res.end(data);
      },
      json: (data) => {
        res.writeHead(code, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      }
    }),
    setHeader: (key, value) => res.setHeader(key, value),
    json: (data) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
  };
}

// Parse JSON body
function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      req.body = body ? JSON.parse(body) : {};
      callback();
    } catch (error) {
      req.body = {};
      callback();
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Mock request object
  const mockReq = {
    ...req,
    method: req.method,
    url: req.url,
    query: parsedUrl.query
  };

  const mockRes = createMockRes(res);

  // Parse body for POST requests
  if (req.method === 'POST') {
    parseBody(req, () => {
      mockReq.body = req.body;
      routeRequest(pathname, mockReq, mockRes);
    });
  } else {
    routeRequest(pathname, mockReq, mockRes);
  }
});

function routeRequest(pathname, req, res) {
  switch (pathname) {
    case '/':
    case '/api/index':
      indexHandler(req, res);
      break;
    case '/api/stats':
      statsHandler(req, res);
      break;
    case '/api/message':
      messageHandler(req, res);
      break;
    case '/api/data':
      dataHandler(req, res);
      break;
    default:
      res.status(404).json({ error: 'Not found' });
  }
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});