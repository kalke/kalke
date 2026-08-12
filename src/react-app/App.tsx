import { lazy, useEffect, useState, type ComponentType } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { detectLang, siteMeta, type Lang } from "./content";
import { PlaygroundShell } from "./dashboard/PlaygroundShell";
import { Home } from "./Home";
import "./App.css";

type LangPage = ComponentType<{ lang: Lang }>;

function lazyNamed(
	load: () => Promise<Record<string, LangPage>>,
	exportName: string,
) {
	return lazy(async () => {
		const mod = await load();
		const Comp = mod[exportName];
		if (!Comp) throw new Error(`Missing export ${exportName}`);
		return { default: Comp };
	});
}

const Overview = lazyNamed(() => import("./dashboard/Overview"), "Overview");
const Profile = lazyNamed(() => import("./dashboard/Profile"), "Profile");
const Extract = lazyNamed(() => import("./dashboard/Extract"), "Extract");
const ExtractCV = lazyNamed(() => import("./dashboard/ExtractCV"), "ExtractCV");
const SavedCVs = lazyNamed(() => import("./dashboard/SavedCVs"), "SavedCVs");
const SavedCV = lazyNamed(() => import("./dashboard/SavedCV"), "SavedCV");
const BankDashboard = lazyNamed(
	() => import("./dashboard/BankDashboard"),
	"BankDashboard",
);
const BankAccounts = lazyNamed(
	() => import("./dashboard/BankAccounts"),
	"BankAccounts",
);
const BankOnboarding = lazyNamed(
	() => import("./dashboard/BankOnboarding"),
	"BankOnboarding",
);
const BankTransfer = lazyNamed(
	() => import("./dashboard/BankTransfer"),
	"BankTransfer",
);
const BankActivity = lazyNamed(
	() => import("./dashboard/BankActivity"),
	"BankActivity",
);

function syncMeta(lang: Lang) {
	const meta = siteMeta[lang];
	document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
	document.title = meta.title;
	document
		.querySelector('meta[name="description"]')
		?.setAttribute("content", meta.description);
	document
		.querySelector('meta[property="og:title"]')
		?.setAttribute("content", meta.title);
	document
		.querySelector('meta[property="og:description"]')
		?.setAttribute("content", meta.description);
	document
		.querySelector('meta[name="twitter:title"]')
		?.setAttribute("content", meta.title);
	document
		.querySelector('meta[name="twitter:description"]')
		?.setAttribute("content", meta.description);
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute("content", "#15120F");
}

export default function App() {
	const [lang, setLang] = useState<Lang>(() => detectLang());

	useEffect(() => {
		syncMeta(lang);
		window.localStorage.setItem("kalke-lang", lang);
	}, [lang]);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home lang={lang} onLang={setLang} />} />
				<Route
					path="/playground"
					element={<PlaygroundShell lang={lang} onLang={setLang} />}
				>
					<Route index element={<Overview lang={lang} />} />
					<Route path="profile" element={<Profile lang={lang} />} />
					<Route
						path="api"
						element={<Navigate to="/playground/profile" replace />}
					/>
					<Route path="extract" element={<Extract lang={lang} />} />
					<Route path="cv" element={<ExtractCV lang={lang} />} />
					<Route path="cv/saved" element={<SavedCVs lang={lang} />} />
					<Route path="cv/saved/:id" element={<SavedCV lang={lang} />} />
					<Route path="bank" element={<BankDashboard lang={lang} />} />
					<Route path="bank/accounts" element={<BankAccounts lang={lang} />} />
					<Route
						path="bank/onboarding"
						element={<BankOnboarding lang={lang} />}
					/>
					<Route path="bank/transfer" element={<BankTransfer lang={lang} />} />
					<Route path="bank/activity" element={<BankActivity lang={lang} />} />
				</Route>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}
