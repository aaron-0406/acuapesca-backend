import express, { Application } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import passport from "passport";

import "./lib/passport";

//Routes
import IndexRoutes from "./routes/index.routes";
import AuthRouter from "./routes/auth.routes";
import UserRouter from "./routes/user.routes";
import ProcessRouter from "./routes/proceso.routes";
import ProcedureRouter from "./routes/procedure.routes";
import RangoRouter from "./routes/rango.routes";

import ClsBDConexion from "./class/ClsBDConexion";

declare global {
  namespace Express {
    interface User {
      rango: string;
      email: string;
      id: string;
      photo: string;
    }
  }
}

export class App {
  private app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    ClsBDConexion.connectBD();
  }

  settings() {
    dotenv.config();
    this.app.set("port", this.port || process.env.PORT || 4000);
  }

  middlewares() {
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(
      cors({
        origin: process.env.API, //Asi el frontend puede hacer peticiones
        credentials: true,
      })
    );
    this.app.use(passport.initialize());
    this.app.use(express.static(path.join(__dirname, "/public")));
    this.app.use(express.static(path.join(__dirname, "/public/build")));
  }
  routes() {
    this.app.use("/api/v1/auth/", AuthRouter);
    this.app.use("/api/v1/user/", UserRouter);
    this.app.use("/api/v1/proceso/", ProcessRouter);
    this.app.use("/api/v1/procedimiento/", ProcedureRouter);
    this.app.use("/api/v1/rango/", RangoRouter);
    this.app.use(IndexRoutes);
  }

  async listen() {
    await this.app.listen(this.app.get("port"));
    console.log("Server on port ", this.app.get("port"));
  }
}
