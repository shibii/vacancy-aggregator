"strict";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwtCookie = require("./jwt-cookie");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", require("./routes/authentication"));

app.use(
  jwtCookie.Middleware(process.env.JWT_SECRET_PRIVATE, {
    algorithms: ["RS256"]
  })
);

app.use("/api", require("./routes/vacancies"));

app.use(jwtCookie.ErrorHandler());

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log("listening on port %s", port);
});
