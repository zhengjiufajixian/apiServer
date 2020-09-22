let http = require("http");
let app = require("../app");
let config = require("../config/sys_config");

let port = config.node_port;
app.set("port", port);

let server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onError(error) {
    console.log(error)
}

function onListening() {
    let address = server.address();
    console.log("Express server is running...on>>", address.port);
    console.log("process.env.NODE_ENV ==", config.node_env);
}
