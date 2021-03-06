import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { Request, Response } from "express";

import { Routes } from "./routes";

createConnection().then(async connection => {
    
    // create express app
    const app = express();
    app.use(cors())
    app.use(bodyParser.json());

    Routes.forEach(route => {
        (app as any)[route.method](route.route, route.middleware || [], (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // setup express app here
    // ...

    // start express server
    const port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`eVoucher API listening at http://localhost:${port}`);
    });


}).catch(error => console.log(error));
