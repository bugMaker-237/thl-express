import { IncomingMessage, ServerResponse, STATUS_CODES } from 'http';
import { createServer } from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { stringify, parse } from 'querystring';
const API: {
  [x: string]: Route[];
} = {};

interface Route {
  path: string;
  requests: Array<{
    method: string;
    query?: {};
    body?: {};
    reponse: RouteResponse;
  }>;
}
interface RouteResponse {
  contentType: string;
  status: number;
  body?: {};
}
const apiFolder = './api/';

registerEndpoints();

createServer((request, response) => {
  const route = getRoute(request);
  if (route == null) {
    noConfigFound(request, response);
  } else {
    checkRouteParamMatch(request, route, res => {
      response.writeHead(res.status, { 'content-type': res.contentType });
      response.end(JSON.stringify(res.body));
    });
  }
}).listen(9001);

function noConfigFound(request: IncomingMessage, response: ServerResponse) {
  const err =
    'Could not find endpoint or route for this request: ' + request.url;
  response.writeHead(404, err, { 'Content-Type': 'application/json' });
  response.end(
    JSON.stringify({
      errors: [err]
    })
  );
}

function checkRouteParamMatch(
  request: IncomingMessage,
  route: Route,
  cb: (resp: RouteResponse) => void
) {
  const data = [];
  request.on('data', chunk => {
    data.push(chunk);
  });
  request.on('end', _ => {
    let requestBody = '';
    if (data.length > 0) {
      requestBody = JSON.stringify(JSON.parse(data.join('')));
    }

    route.requests.forEach(r => {
      const expectedMethod = r.method.toUpperCase();
      const expectedQuery = stringify(r.query);
      const expectedBody = r.body ? JSON.stringify(r.body) : '';
      const requestQuery = request.url.split('?')[1] || '';

      if (
        request.method.toUpperCase() === expectedMethod &&
        requestQuery === expectedQuery &&
        requestBody === expectedBody
      ) {
        cb(r.reponse);
      }
    });
  });
}

function getRoute(request: IncomingMessage): Route {
  const urlPaths = request.url.split('/');
  const endPointName = urlPaths[1];
  const routePath = '/' + urlPaths.slice(2).join('/');
  const endPoint = API[endPointName];
  if (endPoint) {
    const route = endPoint.find(e => e.path === routePath);
    if (route != null) {
      return route;
    }
  }
  return undefined;
}

function registerEndpoints() {
  const endPoints = fs.readdirSync(apiFolder, {
    encoding: 'utf8'
  });

  endPoints.forEach(file => {
    const endpoint = path.basename(file, path.extname(file));
    API[endpoint] = require(apiFolder + file);
    // console.log(JSON.stringify(API));
  });
}
