import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { detectLang, siteMeta, type Lang } from "./content";
import { Home } from "./Home";
import { Playground } from "./Playground";
import "./App.css";

export default function App() {
	const [lang, setLang] = useState<Lang>(() => detectLang());
	const meta = siteMeta[lang];

	useEffect(() => {
		document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
		document.title = meta.title;
		const description = document.querySelector('meta[name="description"]');
		description?.setAttribute("content", meta.description);
		window.localStorage.setItem("kalke-lang", lang);
	}, [lang, meta.description, meta.title]);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home lang={lang} onLang={setLang} />} />
				<Route
					path="/playground"
					element={<Playground lang={lang} onLang={setLang} />}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}
