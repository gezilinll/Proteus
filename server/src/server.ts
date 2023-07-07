var https = require('https');
var fs = require('fs');
import { Server } from '@hocuspocus/server';

var express = require('express');
var expressWs = require('express-ws');

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
};
var app = express();
var server = https.createServer(options, app);
var expressWs = expressWs(app, server);

app.use(function (req: any, res: any, next: any) {
    console.log('middleware');
    req.testing = 'testing';
    return next();
});

app.get('/', function (req: any, res: any, next: any) {
    console.log('get route', req.testing);
    res.end();
});

app.ws('/', function (ws: any, req: any) {
    ws.on('message', function (msg: any) {
        console.log(msg);
    });
    console.log('socket', req.testing);
});

server.listen(3000, () => console.log('Listening...'));
