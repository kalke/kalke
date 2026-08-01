import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono<{ Bindings: Env }>();

app.use(
	"*",
	secureHeaders({
		contentSecurityPolicy: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
			fontSrc: ["'self'", "https://fonts.gstatic.com"],
			imgSrc: ["'self'", "data:"],
			connectSrc: [
				"'self'",
				"https://auth.kalke.dev",
				"https://ebank.kalke.dev",
				"https://pde.kalke.dev",
			],
			frameAncestors: ["'none'"],
			baseUri: ["'self'"],
			formAction: ["'self'"],
		},
		xFrameOptions: "DENY",
		referrerPolicy: "no-referrer",
	}),
);

app.get("/api/health", (c) => c.json({ ok: true, site: "kalke.dev" }));

export default app;
