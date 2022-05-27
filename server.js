const express = require("express");
const app = express();
const dotenv = require("dotenv")
dotenv.config();
const cors = require("cors");
const PORT = process.env.PORT || process.env.APP_PORT ;
const path = require("path");
const helmet = require("helmet");
const { db_conn } = require("./api-v-1.0/configurations/database");

// middlewares
app.use(cors());
app.use(express.json({limit:'100mb'}));
app.use(
    helmet.contentSecurityPolicy({
      useDefaults: false,
      "block-all-mixed-content": true,
      "upgrade-insecure-requests": true,
      directives: {
        "default-src": [
            "'self'"
        ],
        "base-uri": "'self'",
        "font-src": [
            "'self'",
            "https:",
            "data:"
        ],
        "frame-ancestors": [
            "'self'"
        ],
        "img-src": [
            "'self'",
            "data:"
        ],
        "object-src": [
            "'none'"
        ],
        "script-src": [
            "'self'",
            "https://cdnjs.cloudflare.com"
        ],
        "script-src-attr": "'none'",
        "style-src": [
            "'self'",
            "https://cdnjs.cloudflare.com"
        ],
      },
    }),
    helmet.dnsPrefetchControl({
        allow: true
    }),
    helmet.frameguard({
        action: "deny"
    }),
    helmet.hidePoweredBy(),
    helmet.hsts({
        maxAge: 123456,
        includeSubDomains: false
    }),
    helmet.ieNoOpen(),
    helmet.noSniff(),
    helmet.referrerPolicy({
        policy: [ "origin", "unsafe-url" ]
    }),
    helmet.xssFilter()
)


// connect to mongo atlas
db_conn();

// root
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "react-client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "react-client", "build", "index.html"));
    })
} else {
    app.get("/", (req, res) => {
        res.send("server is running on development mode!");
    })
}

// api routes
const agentRoute = require("./api-v-1.0/routes/agent");
const hallRoute = require("./api-v-1.0/routes/hall");
const organizerRoute = require("./api-v-1.0/routes/organizer")

// api middlewares
app.use('/api/hall', hallRoute);
app.use('/api/agent', agentRoute);
app.use('/api/organizer', organizerRoute);


// server listen
app.listen(PORT, () => {
    console.log(`${process.env.APP_HOST + ":" + PORT}`);
})