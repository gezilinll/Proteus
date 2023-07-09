import https from 'https';
import fs from 'fs';
import express from 'express';
import expressWs from 'express-ws';
import urlib from 'url';
import dotenv from 'dotenv';
import { Server } from '@hocuspocus/server';

dotenv.config();

const hocuspocus = Server.configure({
    async onConfigure(data: any) {
        console.log(`Server was configured!`);
    },
    async onListen(data: any) {
        console.log(`Server is listening on port "${data.port}"!`);
    },
    async onConnect(data: any) {
        console.log(`New websocket connection`);
    },
    async connected() {
        console.log('connections:', hocuspocus.getConnectionsCount());
    },
    async onDisconnect(data: any) {
        console.log(`"${data.context.user.name}" has disconnected.`);
    },
    async onDestroy(data: any) {
        console.log(`Server was shut down!`);
    },
});
const options = {
    key: fs.readFileSync(process.env.PRIVATE_KEY as string),
    cert: fs.readFileSync(process.env.CERTIFICATE as string),
};
const app = express();
const server = https.createServer(options, app);
const a = expressWs(app, server);

app.use(function (req: any, res: any, next: any) {
    return next();
});

app.get('/', function (req: any, res: any, next: any) {
    res.end();
});

//@ts-ignore
app.ws('/', function (ws: any, req: any) {
    var url = urlib.parse(req.url, true);
    var userID = url.query.userID;
    var userName = url.query.userName;

    const context = {
        user: {
            id: userID,
            name: userName,
        },
    };

    hocuspocus.handleConnection(ws, req, context);
    console.log('socket', req.url, userID, userName);
    console.log(hocuspocus.getConnectionsCount());
});

server.listen(3000, () => console.log('Listening...'));
