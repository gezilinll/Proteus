import { Server } from "@hocuspocus/server";

const server = Server.configure({
  port: 3000,
  name: "example-document",

  async onConnect(data) {
    console.log("connections:", server.getConnectionsCount());
  },
});

server.listen();
