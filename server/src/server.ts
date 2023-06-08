import { Server } from "@hocuspocus/server";

const server = Server.configure({
  address: "47.119.150.226",
  port: 3000,
  name: "example-document",

  async onConnect(data) {
    console.log("connections:", server.getConnectionsCount());
  },
});

server.listen();
