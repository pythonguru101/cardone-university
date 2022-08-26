import dotenv from "dotenv";
dotenv.config(); // Must be loaded before other imports
import express, { Application } from "express";
import "module-alias/register";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import config from "config";
import log from "@providers/logger.provider";
import connectMongo from "@providers/mongo.provider";
import router from "./routes";
import errorHandler from "@middlewares/errorHandler";
import { createServer, Server } from "http";

class App {
	public app: Application;
	public server: Server;
	public port: number | string;

	public constructor() {
		this.app = express();
		this.server = createServer(this.app);
		this.port = config.get<number>("port");

		this.initializeDatabaseConnections().catch((error) => console.error(error));
		this.initializeMiddlewares();
		this.initializeRoutes();
		this.initializeErrorHandling();
	}

	public listen = (): void => {
		this.server.listen(this.port, () => {
			log.info(`=========================================`);
			log.info(`Server started on port ${this.port}`);
			log.info(`=========================================`);
		});
	};

	private initializeDatabaseConnections = async (): Promise<void> => {
		await connectMongo();
	};

	private initializeMiddlewares = (): void => {
		this.app.use('/assets', express.static('assets'))	
		this.app.set('view engine', 'ejs')

		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		// Enable CORS
		this.app.use(
			cors({
				origin: "*",
			}),
		);
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(cookieParser());
	};

	private initializeRoutes = (): void => {
		this.app.use(router);
	};

	private initializeErrorHandling = (): void => {
		// Test global error handling
		this.app.get("/error", (_, res) => {
			throw new Error("Raise some error.");
		});

		// Error handler. Must be placed at the end of the middleware chain.
		this.app.use(errorHandler);

		// Catch all unmatched routes
		this.app.all("*", (_, res) => res.status(404).send("Route not found"));
	};
}

const app = new App();
app.listen();
