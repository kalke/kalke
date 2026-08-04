import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { detectLang, siteMeta, type Lang } from "./content";
import { ApiTokens } from "./dashboard/ApiTokens";
import { Extract } from "./dashboard/Extract";
import { ExtractCV } from "./dashboard/ExtractCV";
import { Overview } from "./dashboard/Overview";
import { PlaygroundShell } from "./dashboard/PlaygroundShell";
import { SavedCV } from "./dashboard/SavedCV";
import { SavedCVs } from "./dashboard/SavedCVs";
import { Home } from "./Home";
import "./App.css";

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
					<Route path="api" element={<ApiTokens lang={lang} />} />
					<Route path="extract" element={<Extract lang={lang} />} />
					<Route path="cv" element={<ExtractCV lang={lang} />} />
					<Route path="cv/saved" element={<SavedCVs lang={lang} />} />
					<Route path="cv/saved/:id" element={<SavedCV lang={lang} />} />
				</Route>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}
