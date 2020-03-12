"use strict";
exports.__esModule = true;
var http_1 = require("http");
var fs = require("fs");
var path = require("path");
var querystring_1 = require("querystring");
var API = {};
var apiFolder = './api/';
registerEndpoints();
http_1.createServer(function (request, response) {
    var route = getRoute(request);
    if (route == null) {
        noConfigFound(request, response);
    }
    else {
        console.log('#Request: ' + request.url);
        checkRouteParamMatch(request, response, route, function (res) {
            response.writeHead(res.status, { 'content-type': res.contentType });
            response.end(JSON.stringify(res.body));
        });
    }
}).listen(9001);
function noConfigFound(request, response, msg) {
    if (msg === void 0) { msg = null; }
    var err = msg || 'Could not find endpoint or route for this request: ' + request.url;
    response.writeHead(404, err, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
        errors: [err]
    }));
}
function checkRouteParamMatch(request, response, route, cb) {
    var data = [];
    request.on('data', function (chunk) {
        data.push(chunk);
    });
    request.on('end', function (_) {
        var requestBody = '';
        if (data.length > 0) {
            requestBody = JSON.stringify(JSON.parse(data.join('')));
        }
        route.requests.forEach(function (r) {
            var expectedMethod = r.method.toUpperCase();
            var expectedQuery = querystring_1.stringify(r.query);
            var expectedBody = r.body ? JSON.stringify(r.body) : '';
            var requestQuery = request.url.split('?')[1] || '';
            if (request.method.toUpperCase() === expectedMethod &&
                requestQuery === expectedQuery &&
                requestBody === expectedBody) {
                cb(r.reponse);
            }
            else {
                console.log('#MISMATCHED');
                console.log('#Expected: ' + JSON.stringify(r));
                console.log('#Actual: ' + JSON.stringify(requestBody));
                noConfigFound(request, response, 'Route mismatch');
            }
        });
    });
}
function getRoute(request) {
    var urlPaths = request.url.split('/');
    var endPointName = urlPaths[1];
    var routePath = '/' + urlPaths.slice(2).join('/');
    var endPoint = API[endPointName];
    if (endPoint) {
        var route = endPoint.find(function (e) { return e.path === routePath; });
        if (route != null) {
            return route;
        }
    }
    return undefined;
}
function registerEndpoints() {
    var endPoints = fs.readdirSync(apiFolder, {
        encoding: 'utf8'
    });
    endPoints.forEach(function (file) {
        var endpoint = path.basename(file, path.extname(file));
        API[endpoint] = require(apiFolder + file);
        // console.log(JSON.stringify(API));
    });
}
