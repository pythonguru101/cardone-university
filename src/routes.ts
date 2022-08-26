import { Router } from "express";

class RootRoutes {
	public router: Router;

	public constructor() {
		this.router = Router();
		this.routes();
	}

	public routes(): void {
		this.router.get("/", (_, res) => res.render('pages/index'));

		// Health check
		this.router.get("/about", (_, res) => res.render('pages/about'));
	}
}

const rootRoutes: RootRoutes = new RootRoutes();

export default rootRoutes.router;
