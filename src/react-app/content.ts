export type Lang = "pt" | "en";

export const siteMeta = {
	brand: "kalke",
	pt: {
		title: "kalke — pessoa que constrói coisas",
		description:
			"Henrique Kalke: backend engineer em Curitiba. Gatos, metal, jogos, boxe — e sistemas que funcionam.",
	},
	en: {
		title: "kalke — a person who builds things",
		description:
			"Henrique Kalke: backend engineer in Curitiba. Cats, metal, games, boxing — and systems that hold up.",
	},
};

type Copy = {
	navAria: string;
	nav: { label: string; href: string }[];
	langSwitch: { pt: string; en: string };
	hero: {
		headline: string;
		support: string;
		primaryCta: { label: string; href: string };
		secondaryCta: { label: string; href: string };
	};
	about: {
		eyebrow: string;
		title: string;
		paragraphs: string[];
	};
	likes: {
		eyebrow: string;
		title: string;
		items: { title: string; text: string }[];
	};
	builds: {
		eyebrow: string;
		title: string;
		intro: string;
		items: {
			name: string;
			href: string;
			blurb: string;
			tags: string[];
		}[];
	};
	contact: {
		eyebrow: string;
		title: string;
		text: string;
		links: { label: string; href: string; note: string }[];
	};
	footer: string;
};

export const copy: Record<Lang, Copy> = {
	pt: {
		navAria: "Principal",
		nav: [
			{ label: "Sobre", href: "#about" },
			{ label: "Gostos", href: "#likes" },
			{ label: "Projetos", href: "#builds" },
			{ label: "Contato", href: "#contact" },
		],
		langSwitch: { pt: "PT", en: "EN" },
		hero: {
			headline: "Kalke. Henrique também serve.",
			support:
				"Backend engineer em Curitiba — mas este site é sobre a pessoa: gatos, metal, jogos, boxe e a teimosia de sempre ter sabido que ia mexer com tecnologia.",
			primaryCta: { label: "Quem sou", href: "#about" },
			secondaryCta: { label: "Fala comigo", href: "#contact" },
		},
		about: {
			eyebrow: "Quem sou",
			title: "Uma pessoa atrás do username",
			paragraphs: [
				"Pode me chamar de Kalke — é sobrenome, mas é o nome que carrega mais peso online. Henrique também está certo. Nasci pra construir coisas: sempre soube que ia mexer com tecnologia.",
				"Morei três anos na Inglaterra. Foi lá que fui alfabetizado — aprendi a ler e escrever em inglês antes do português. Isso ficou comigo: o inglês nunca foi “segundo idioma”, foi o primeiro chão da linguagem.",
				"Hoje vivo em Curitiba. Projeto e publico APIs, auth e infraestrutura — sobretudo Go e Python na AWS. Cuido de contratos limpos (OpenAPI), DX local decente e sistemas fáceis de rodar e difíceis de quebrar. Fora do teclado: boxe, metal alto, videogame e uma casa cheia de bichos.",
			],
		},
		likes: {
			eyebrow: "Coisas que gosto",
			title: "O que ocupa a cabeça (e o sofá)",
			items: [
				{
					title: "Zaia, Chico, Linhaça e Claire",
					text: "Meus gatos. Cada um com personalidade própria — e juntos transformam qualquer dia comum em bagunça boa.",
				},
				{
					title: "Meg (quase Lurdinha)",
					text: "Minha cachorrinha. Eu queria que o nome dela fosse Lurdinha. Não foi. Meg ficou — e ela manda na casa do mesmo jeito.",
				},
				{
					title: "Metal",
					text: "Adoro música, principalmente metal. É trilha de foco, de treino e de qualquer momento em que o volume precisa dizer alguma coisa.",
				},
				{
					title: "Videogame",
					text: "No tempo livre, jogo. Sumir um pouco em outro mundo é pausa séria — não distração sem sentido.",
				},
				{
					title: "Boxe",
					text: "Luto boxe. Ritmo, presença e um jeito de desligar a cabeça sem ficar parado.",
				},
			],
		},
		builds: {
			eyebrow: "O que construo",
			title: "Projetos que nasceram de curiosidade",
			intro:
				"Não é showcase corporativo — são coisas que eu quis existir. Backend, contratos claros, e um pouco de experimento.",
			items: [
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"API em Go que transforma documentos brasileiros (IDs, comprovantes, NFs) em JSON estruturado com LLM, Postgres e Redis.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"API bancária em memória com FastAPI — depósito, saque, transferência — com Swagger e testes.",
					tags: ["Python", "FastAPI"],
				},
				{
					name: "personal-compose",
					href: "https://github.com/kalke",
					blurb:
						"Docker Compose local pra bancos e brokers — a base chata (e essencial) pra desenvolver sem drama.",
					tags: ["Docker", "DX"],
				},
			],
		},
		contact: {
			eyebrow: "Contato",
			title: "Se quiser conversar",
			text: "Código, projetos, metal, gatos ou só um oi. Respondo quando der — de verdade.",
			links: [
				{
					label: "GitHub",
					href: "https://github.com/kalke",
					note: "código e experimentos",
				},
				{
					label: "LinkedIn",
					href: "https://www.linkedin.com/in/henriquekalke/",
					note: "lado profissional",
				},
				{
					label: "Spotify",
					href: "https://open.spotify.com/user/12149692772?si=09f6c534878040e1",
					note: "playlists e metal",
				},
				{
					label: "Email",
					href: "mailto:henriquekalke@icloud.com",
					note: "henriquekalke@icloud.com",
				},
			],
		},
		footer: "feito com React, Vite e Cloudflare",
	},
	en: {
		navAria: "Primary",
		nav: [
			{ label: "About", href: "#about" },
			{ label: "Likes", href: "#likes" },
			{ label: "Builds", href: "#builds" },
			{ label: "Contact", href: "#contact" },
		],
		langSwitch: { pt: "PT", en: "EN" },
		hero: {
			headline: "Kalke. Henrique works too.",
			support:
				"Backend engineer in Curitiba — but this site is about the person: cats, metal, games, boxing, and the stubborn feeling I’ve always known I’d work with technology.",
			primaryCta: { label: "About me", href: "#about" },
			secondaryCta: { label: "Say hi", href: "#contact" },
		},
		about: {
			eyebrow: "About",
			title: "The person behind the username",
			paragraphs: [
				"Call me Kalke — it’s my last name, but it’s the one that hits harder online. Henrique is fine too. I was built to build things: I’ve always known I’d work with technology.",
				"I lived in England for three years. That’s where I learned to read and write — in English, before Portuguese. English was never a “second language” for me; it was the first ground under my words.",
				"I now live in Curitiba. I design and ship APIs, auth, and cloud infrastructure — mostly Go and Python on AWS. I care about clean contracts (OpenAPI), solid local DX, and systems that are easy to run and hard to break. Off the keyboard: boxing, loud metal, video games, and a house full of animals.",
			],
		},
		likes: {
			eyebrow: "Things I like",
			title: "What fills my head (and the couch)",
			items: [
				{
					title: "Zaia, Chico, Linhaça & Claire",
					text: "My cats. Each with a full personality — together they turn any ordinary day into the good kind of chaos.",
				},
				{
					title: "Meg (almost Lurdinha)",
					text: "My dog. I wanted her name to be Lurdinha. It wasn’t. Meg stuck — and she still runs the house.",
				},
				{
					title: "Metal",
					text: "I love music, especially metal. It’s focus music, training music, and the soundtrack whenever the volume needs to mean something.",
				},
				{
					title: "Video games",
					text: "In my free time, I play. Disappearing into another world is a real break — not empty distraction.",
				},
				{
					title: "Boxing",
					text: "I train boxing. Rhythm, presence, and a way to shut my brain off without sitting still.",
				},
			],
		},
		builds: {
			eyebrow: "What I build",
			title: "Projects born from curiosity",
			intro:
				"Not a corporate showcase — just things I wanted to exist. Backend work, clear contracts, and a bit of experimentation.",
			items: [
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"Go API that turns Brazilian IDs, address proofs, and invoices into structured JSON with LLM, Postgres, and Redis.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"In-memory bank API with FastAPI — deposit, withdraw, transfer — plus Swagger and tests.",
					tags: ["Python", "FastAPI"],
				},
				{
					name: "personal-compose",
					href: "https://github.com/kalke",
					blurb:
						"Local Docker Compose for databases and brokers — the unglamorous (essential) base for calm development.",
					tags: ["Docker", "DX"],
				},
			],
		},
		contact: {
			eyebrow: "Contact",
			title: "If you want to talk",
			text: "Code, projects, metal, cats, or just a hello. I’ll reply when I can — for real.",
			links: [
				{
					label: "GitHub",
					href: "https://github.com/kalke",
					note: "code & experiments",
				},
				{
					label: "LinkedIn",
					href: "https://www.linkedin.com/in/henriquekalke/",
					note: "professional side",
				},
				{
					label: "Spotify",
					href: "https://open.spotify.com/user/12149692772?si=09f6c534878040e1",
					note: "playlists & metal",
				},
				{
					label: "Email",
					href: "mailto:henriquekalke@icloud.com",
					note: "henriquekalke@icloud.com",
				},
			],
		},
		footer: "built with React, Vite & Cloudflare",
	},
};

export function detectLang(): Lang {
	if (typeof window === "undefined") return "en";
	const saved = window.localStorage.getItem("kalke-lang");
	if (saved === "pt" || saved === "en") return saved;
	return window.navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}
