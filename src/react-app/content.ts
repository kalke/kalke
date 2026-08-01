export type Lang = "pt" | "en";

export const siteMeta = {
	brand: "kalke",
	pt: {
		title: "kalke — Henrique Kalke",
		description:
			"Henrique Kalke, software engineer em Curitiba. Sistemas bancários, APIs, gatos e metal.",
	},
	en: {
		title: "kalke — Henrique Kalke",
		description:
			"Henrique Kalke, software engineer in Curitiba. Banking systems, APIs, cats, and metal.",
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
	stack: {
		eyebrow: string;
		title: string;
		intro: string;
		groups: { area: string; items: string[] }[];
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
	playground: {
		pageTitle: string;
		navAria: string;
		backHome: string;
		eyebrow: string;
		title: string;
		intro: string;
		loading: string;
		email: string;
		password: string;
		inviteCode: string;
		login: string;
		signup: string;
		logout: string;
		signedInAs: string;
		loginError: string;
		signupError: string;
		signupOk: string;
		modeLogin: string;
		modeSignup: string;
		tokensTitle: string;
		tokensHint: string;
		tokenName: string;
		createToken: string;
		tokenOnce: string;
		revoke: string;
		tokenError: string;
		needToken: string;
		pdeTitle: string;
		pdeHint: string;
		docType: string;
		chooseFile: string;
		extract: string;
		extractError: string;
		result: string;
	};
};

export const copy: Record<Lang, Copy> = {
	pt: {
		navAria: "Principal",
		nav: [
			{ label: "Sobre", href: "#about" },
			{ label: "Stack", href: "#stack" },
			{ label: "Gostos", href: "#likes" },
			{ label: "Projetos", href: "#builds" },
			{ label: "Playground", href: "/playground" },
			{ label: "Contato", href: "#contact" },
		],
		langSwitch: { pt: "PT", en: "EN" },
		hero: {
			headline: "Henrique Kalke",
			support: "Ou só kalke. Software engineer em Curitiba.",
			primaryCta: { label: "Sobre mim", href: "#about" },
			secondaryCta: { label: "Contato", href: "#contact" },
		},
		about: {
			eyebrow: "Sobre",
			title: "Quem eu sou",
			paragraphs: [
				"Pode me chamar de Kalke ou Henrique — tanto faz. Trabalho com software faz uns seis anos, quase sempre no mercado financeiro: crédito, accountingtech e, agora, infra bancária de ponta a ponta.",
				"Morei três anos na Inglaterra. Aprendi a ler e escrever em inglês antes do português, então o inglês nunca me pareceu “segundo idioma”. Hoje moro em Curitiba.",
				"O que me anima no trabalho é sistema que não pode falhar: conta, PIX, boleto, regra do Bacen. Já ajudei a automatizar onboarding de conta (com compliance), a manter volume alto de boletos e liquidação, e a montar coisa chata mas útil — tipo motor de tarifas e validação de documento com LLM.",
				"No começo da carreira mexi bastante com ML. Depois a vida me puxou pra API, evento, Kafka, Python, TypeScript. Continuo curioso com IA, só que agora misturado com o resto.",
			],
		},
		likes: {
			eyebrow: "Fora do código",
			title: "O que preenche o resto",
			items: [
				{
					title: "Os gatos",
					text: "Zaia, Chico, Linhaça e Claire. Quatro personalidades, zero chance de casa quieta.",
				},
				{
					title: "Meg",
					text: "Minha cachorra. Quase se chamou Lurdinha. Eu perdi essa discussão.",
				},
				{
					title: "Metal",
					text: "Escuto metal o tempo todo — no trampo, no caminho, codando e jogando de madrugada.",
				},
				{
					title: "Games",
					text: "Quando largo o notebook, jogo. É o jeito mais fácil de desligar a cabeça.",
				},
			],
		},
		stack: {
			eyebrow: "Stack",
			title: "Com o que eu trabalho",
			intro: "Backend, dados e cloud — o dia a dia e o que aparece nos projetos.",
			groups: [
				{ area: "Backend", items: ["Go", "Python", "FastAPI", "TypeScript"] },
				{ area: "Data", items: ["PostgreSQL", "Redis", "Kafka"] },
				{ area: "Cloud", items: ["AWS", "Docker", "Cloudflare Workers / Containers"] },
				{ area: "Auth / APIs", items: ["OIDC", "OpenAPI"] },
				{ area: "Frontend", items: ["React", "Vite", "Hono"] },
			],
		},
		builds: {
			eyebrow: "Projetos",
			title: "O que eu ando construindo",
			intro:
				"No trabalho é sistema crítico. Em casa eu experimento — Go, LLM, API — no meu ritmo.",
			items: [
				{
					name: "kalke-auth",
					href: "https://github.com/kalke/kalke-auth",
					blurb:
						"IdP OIDC (Keycloak) pra autenticar os apps Kalke — humano e M2M, sem chave proprietária.",
					tags: ["Keycloak", "OIDC", "Docker"],
				},
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"Pega documento brasileiro (RG, comprovante, NF) e devolve JSON. Go, LLM, Postgres, Redis.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"API bancária simples em FastAPI: depósito, saque, transferência. Com Swagger e testes.",
					tags: ["Python", "FastAPI"],
				},
				{
					name: "personal-compose",
					href: "https://github.com/kalke/personal-compose",
					blurb:
						"Docker Compose pra subir banco e broker local sem drama.",
					tags: ["Docker", "DX"],
				},
			],
		},
		contact: {
			eyebrow: "Contato",
			title: "Fala comigo",
			text: "Vaga, ideia, dúvida técnica ou só um oi. Respondo quando der — de verdade.",
			links: [
				{
					label: "GitHub",
					href: "https://github.com/kalke",
					note: "código",
				},
				{
					label: "LinkedIn",
					href: "https://www.linkedin.com/in/henriquekalke/",
					note: "trabalho",
				},
				{
					label: "WhatsApp",
					href: "https://wa.me/5541991071908",
					note: "(41) 99107-1908",
				},
				{
					label: "Spotify",
					href: "https://open.spotify.com/user/12149692772?si=09f6c534878040e1",
					note: "o que eu escuto",
				},
				{
					label: "Email",
					href: "mailto:henriquekalke@icloud.com",
					note: "henriquekalke@icloud.com",
				},
			],
		},
		footer: "React · Vite · Cloudflare",
		playground: {
			pageTitle: "kalke — playground",
			navAria: "Playground",
			backHome: "Início",
			eyebrow: "Playground",
			title: "Área logada",
			intro: "Login privado pra gerar API tokens e testar o personal-document-extractor.",
			loading: "Carregando…",
			email: "Email",
			password: "Senha",
			inviteCode: "Código de convite",
			login: "Entrar",
			signup: "Criar conta",
			logout: "Sair",
			signedInAs: "Logado como",
			loginError: "Não deu pra entrar. Confere email e senha.",
			signupError: "Não deu pra criar a conta. Confere os dados e o código.",
			signupOk: "Conta criada. Você já está logado.",
			modeLogin: "Entrar",
			modeSignup: "Criar conta",
			tokensTitle: "API tokens",
			tokensHint: "O valor completo aparece uma vez. Guarda com cuidado.",
			tokenName: "Nome",
			createToken: "Criar token",
			tokenOnce: "Copia agora — não mostra de novo: ",
			revoke: "Revogar",
			tokenError: "Falha ao gerenciar token.",
			needToken: "Cria um token antes de extrair.",
			pdeTitle: "Document extractor",
			pdeHint: "Envia PDF/imagem e recebe JSON.",
			docType: "Tipo",
			chooseFile: "Arquivo",
			extract: "Extrair",
			extractError: "Falha na extração.",
			result: "Resposta",
		},
	},
	en: {
		navAria: "Primary",
		nav: [
			{ label: "About", href: "#about" },
			{ label: "Stack", href: "#stack" },
			{ label: "Likes", href: "#likes" },
			{ label: "Projects", href: "#builds" },
			{ label: "Playground", href: "/playground" },
			{ label: "Contact", href: "#contact" },
		],
		langSwitch: { pt: "PT", en: "EN" },
		hero: {
			headline: "Henrique Kalke",
			support: "Or just kalke. Software engineer in Curitiba.",
			primaryCta: { label: "About me", href: "#about" },
			secondaryCta: { label: "Contact", href: "#contact" },
		},
		about: {
			eyebrow: "About",
			title: "Who I am",
			paragraphs: [
				"Call me Kalke or Henrique — either works. I’ve been building software for about six years, mostly in finance: credit, accountingtech, and now full banking infrastructure.",
				"I lived in England for three years and learned to read and write in English before Portuguese, so English never felt like a “second language.” I’m based in Curitiba now.",
				"I like systems that can’t casually break: accounts, PIX, boleto, Central Bank rules. I’ve helped automate account onboarding (with compliance), keep high boleto and settlement volume moving, and ship unglamorous but useful stuff — fee engines, LLM document checks.",
				"Early on I did a lot of ML. Later the work pulled me into APIs, events, Kafka, Python, TypeScript. Still curious about AI — just mixed into everything else.",
			],
		},
		likes: {
			eyebrow: "Off the keyboard",
			title: "What fills the rest",
			items: [
				{
					title: "The cats",
					text: "Zaia, Chico, Linhaça, and Claire. Four personalities. Quiet house? Not happening.",
				},
				{
					title: "Meg",
					text: "My dog. Almost named Lurdinha. I lost that argument.",
				},
				{
					title: "Metal",
					text: "Metal most of the time — commuting, working, coding and gaming late at night.",
				},
				{
					title: "Games",
					text: "When the laptop’s down, I play. Easiest way to switch my brain off.",
				},
			],
		},
		stack: {
			eyebrow: "Stack",
			title: "What I work with",
			intro: "Backend, data, and cloud — day job and side projects.",
			groups: [
				{ area: "Backend", items: ["Go", "Python", "FastAPI", "TypeScript"] },
				{ area: "Data", items: ["PostgreSQL", "Redis", "Kafka"] },
				{ area: "Cloud", items: ["AWS", "Docker", "Cloudflare Workers / Containers"] },
				{ area: "Auth / APIs", items: ["OIDC", "OpenAPI"] },
				{ area: "Frontend", items: ["React", "Vite", "Hono"] },
			],
		},
		builds: {
			eyebrow: "Projects",
			title: "What I’ve been building",
			intro:
				"At work it’s critical systems. At home I experiment — Go, LLMs, APIs — at my own pace.",
			items: [
				{
					name: "kalke-auth",
					href: "https://github.com/kalke/kalke-auth",
					blurb:
						"OIDC IdP (Keycloak) that authenticates Kalke apps — human and M2M, no proprietary API keys.",
					tags: ["Keycloak", "OIDC", "Docker"],
				},
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"Brazilian documents (ID, address proof, invoices) in → clean JSON out. Go, LLM, Postgres, Redis.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"Small FastAPI bank API: deposit, withdraw, transfer. Swagger and tests included.",
					tags: ["Python", "FastAPI"],
				},
				{
					name: "personal-compose",
					href: "https://github.com/kalke/personal-compose",
					blurb:
						"Docker Compose to spin up local databases and brokers without fuss.",
					tags: ["Docker", "DX"],
				},
			],
		},
		contact: {
			eyebrow: "Contact",
			title: "Say hi",
			text: "A role, an idea, a technical question, or just hello. I’ll reply when I can — for real.",
			links: [
				{
					label: "GitHub",
					href: "https://github.com/kalke",
					note: "code",
				},
				{
					label: "LinkedIn",
					href: "https://www.linkedin.com/in/henriquekalke/",
					note: "work",
				},
				{
					label: "WhatsApp",
					href: "https://wa.me/5541991071908",
					note: "+55 41 99107-1908",
				},
				{
					label: "Spotify",
					href: "https://open.spotify.com/user/12149692772?si=09f6c534878040e1",
					note: "what I listen to",
				},
				{
					label: "Email",
					href: "mailto:henriquekalke@icloud.com",
					note: "henriquekalke@icloud.com",
				},
			],
		},
		footer: "React · Vite · Cloudflare",
		playground: {
			pageTitle: "kalke — playground",
			navAria: "Playground",
			backHome: "Home",
			eyebrow: "Playground",
			title: "Signed-in area",
			intro: "Private login to mint API tokens and try personal-document-extractor.",
			loading: "Loading…",
			email: "Email",
			password: "Password",
			inviteCode: "Invite code",
			login: "Sign in",
			signup: "Create account",
			logout: "Sign out",
			signedInAs: "Signed in as",
			loginError: "Could not sign in. Check email and password.",
			signupError: "Could not create the account. Check details and invite code.",
			signupOk: "Account created. You’re signed in.",
			modeLogin: "Sign in",
			modeSignup: "Create account",
			tokensTitle: "API tokens",
			tokensHint: "The full value is shown once. Store it carefully.",
			tokenName: "Name",
			createToken: "Create token",
			tokenOnce: "Copy now — it won’t be shown again: ",
			revoke: "Revoke",
			tokenError: "Could not manage token.",
			needToken: "Create a token before extracting.",
			pdeTitle: "Document extractor",
			pdeHint: "Upload a PDF/image and get JSON back.",
			docType: "Type",
			chooseFile: "File",
			extract: "Extract",
			extractError: "Extraction failed.",
			result: "Response",
		},
	},
};

export function detectLang(): Lang {
	if (typeof window === "undefined") return "en";
	const saved = window.localStorage.getItem("kalke-lang");
	if (saved === "pt" || saved === "en") return saved;
	return window.navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}
