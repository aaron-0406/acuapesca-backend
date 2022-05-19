import express, { Application } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import passport from 'passport'

import './lib/passport';

//Routes
import IndexRoutes from "./routes/index.routes";
import AuthRouter from "./routes/auth.routes";

declare global {
  namespace Express {
    interface User {
      rango: string;
      correo: string;
      id: string;
      foto: string;
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
    this.app.use('/api/v1/auth/', AuthRouter);
    this.app.use(IndexRoutes);
  }

  async listen() {
    await this.app.listen(this.app.get("port"));
    console.log("Server on port ", this.app.get("port"));
  }
}
