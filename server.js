const express = require("express");
const chalk = require("chalk");
const app = express();
const cors = require("./middlewares/cors");
const logger = require("./logger/loggerService");
const router = require("./router/router");
const connectToDb = require("./DB/dbService");
const { handleError } = require("./utils/handleErrors");
require("dotenv").config();
const PORT = process.env.PORT || 8181;


app.use(cors);
app.use(logger);
app.use(express.json());
app.use(router);

app.use((err, req, res, next) => {
    handleError(res, 500, "internal error " + err.message);
});

app.listen(PORT, () => {
    console.log(chalk.yellow(`The server is listening to port ${PORT}`));
    connectToDb();
})