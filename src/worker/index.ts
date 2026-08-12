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

app.use("/api/*", async (c, next) => {
	const path = new URL(c.req.url).pathname;
	const requestId = c.req.header("x-request-id") || crypto.randomUUID();
	c.header("X-Request-ID", requestId);
	if (path === "/api/health") {
		await next();
		return;
	}
	const start = Date.now();
	await next();
	const status = c.res.status;
	console.log(
		JSON.stringify({
			ts: new Date().toISOString(),
			service: "kalke-worker",
			event: "http.request",
			request_id: requestId,
			method: c.req.method,
			path,
			status_code: status,
			duration_ms: Date.now() - start,
			outcome: status >= 400 ? "error" : "ok",
		}),
	);
});

app.get("/api/health", (c) => c.json({ ok: true, site: "kalke.dev" }));

app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
