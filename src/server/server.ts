import express, { Router } from "express";
import dotenv from "dotenv";
import session from "express-session";
import fetch from "node-fetch";
import "../ts/express-session";
import oAuthRouter from "./oauth/routes";
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

dotenv.config();

const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("build"));
app.use(
    session({
        secret: "asdfjkl;",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", `http://localhost:${port}`);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers");
    next();
});

app.use(oAuthRouter);

if (process.env.ENV === "local") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const reload = require("reload");

    reload(app)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        .then((_reloadReturned: any) => {
            app.listen(port, () => {
                console.log(`Server started on port ${port}.`);
            });
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch(function (err: any) {
            console.error("Reload could not start, could not start server/sample app", err);
        });
} else {
    app.listen(port, () => {
        console.log(`Server started on port ${port}.`);
    });
}
