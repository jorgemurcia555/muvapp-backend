import errorHandler from "errorhandler";
import app from "./app";
// import serverless from "serverless-http";

if (process.env.NODE_ENV === "dev") {
    app.use(errorHandler());
}
const server = app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop or CTRL + \\ for kill process \n");
});

// initSocketIOConnection(server);
export default server;
// module.exports.handler = serverless(app);

import "./config/realtimeDB";