import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { detectLang, siteMeta, type Lang } from "./content";
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
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}
