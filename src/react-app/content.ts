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
		name: string;
		login: string;
		signup: string;
		logout: string;
		signedInAs: string;
		loginError: string;
		signupError: string;
		signupOk: string;
		verifyTitle: string;
		verifyHint: string;
		verifyCode: string;
		verifySubmit: string;
		verifyError: string;
		verifyClose: string;
		resend: string;
		resendIn: string;
		resendWait: string;
		resendError: string;
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
		consentLabel: string;
		consentRequired: string;
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
			primaryCta: { label: "Playground", href: "/playground" },
			secondaryCta: { label: "Sobre mim", href: "#about" },
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
			intro: "O dia a dia: backend, dados e cloud. O resto entra quando o projeto pede.",
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
				"No trampo é sistema que não pode cair. Em casa eu mexo no que me dá vontade — Go, LLM, API — no meu ritmo.",
			items: [
				{
					name: "kalke-auth",
					href: "https://github.com/kalke/kalke-auth",
					blurb:
						"Auth dos apps Kalke com Keycloak/OIDC. Login de gente e máquina, sem inventar chave esquisita.",
					tags: ["Keycloak", "OIDC", "Docker"],
				},
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"Joga um RG, comprovante ou NF e sai JSON. Go + LLM + Postgres + Redis.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"API bancária simples em FastAPI — depósito, saque, transferência. Tem Swagger e teste.",
					tags: ["Python", "FastAPI"],
				},
				{
					name: "personal-compose",
					href: "https://github.com/kalke/personal-compose",
					blurb:
						"Docker Compose pra subir banco e broker local sem encheção.",
					tags: ["Docker", "DX"],
				},
			],
		},
		contact: {
			eyebrow: "Contato",
			title: "Fala comigo",
			text: "Vaga, ideia, dúvida técnica ou só um oi. Respondo quando der — sério.",
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
			title: "Brincar com documentos",
			intro: "Só um cantinho pra testar a API de extração. Nada sério — entra, manda um arquivo e vê o JSON sair.",
			loading: "Carregando…",
			email: "Email",
			password: "Senha",
			name: "Nome",
			login: "Entrar",
			signup: "Criar conta",
			logout: "Sair",
			signedInAs: "Entrou como",
			loginError: "Não rolou entrar. Confere email e senha?",
			passwordTitle: "Trocar senha",
			passwordHint: "Mínimo 10 caracteres. A sessão continua aberta.",
			currentPassword: "Senha atual",
			newPassword: "Nova senha",
			confirmPassword: "Confirma a nova",
			changePassword: "Salvar senha",
			passwordOk: "Senha atualizada.",
			passwordMismatch: "A confirmação não bate com a nova senha.",
			passwordSame: "A nova senha tem que ser diferente da atual.",
			passwordShort: "A nova senha precisa ter pelo menos 10 caracteres.",
			passwordError: "Não rolou trocar a senha. Confere a senha atual?",
			signupError: "Não rolou criar a conta. Dá uma olhada nos dados.",
			signupOk: "Pronto — conta criada e você já tá dentro.",
			verifyTitle: "Confirma teu email",
			verifyHint: "Mandei um código pra {email}. Cola ele aqui.",
			verifyCode: "Código",
			verifySubmit: "Confirmar",
			verifyError: "Código errado ou já expirou.",
			verifyClose: "Fechar",
			resend: "Mandar de novo",
			resendIn: "Dá pra reenviar em {seconds}s",
			resendWait: "Calma — espera um pouco pra pedir outro.",
			resendError: "Não consegui reenviar o código.",
			modeLogin: "Entrar",
			modeSignup: "Criar conta",
			tokensTitle: "Tokens da API",
			tokensHint: "O token completo só aparece uma vez. Salva em algum lugar se for usar depois.",
			tokenName: "Nome do token",
			createToken: "Criar token",
			tokenOnce: "Copia agora — depois some: ",
			revoke: "Revogar",
			tokenError: "Deu ruim com o token.",
			needToken: "Cria um token antes de extrair.",
			pdeTitle: "Extrator",
			pdeHint: "Manda um PDF ou imagem e volta JSON. Qualquer conta logada serve.",
			consentLabel:
				"Beleza: o arquivo em si não fica salvo. O conteúdo pode passar por um LLM, e eu posso guardar hash, resultado e um registro de auditoria (com IP).",
			consentRequired: "Marca o aceite pra continuar.",
			docType: "Tipo",
			chooseFile: "Arquivo",
			extract: "Extrair",
			extractError: "A extração falhou.",
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
			primaryCta: { label: "Playground", href: "/playground" },
			secondaryCta: { label: "About me", href: "#about" },
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
			intro: "Day to day: backend, data, and cloud. Everything else shows up when the project needs it.",
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
				"At work it’s systems that can’t casually break. At home I tinker — Go, LLMs, APIs — at my own pace.",
			items: [
				{
					name: "kalke-auth",
					href: "https://github.com/kalke/kalke-auth",
					blurb:
						"Auth for Kalke apps with Keycloak/OIDC. People and machines, no weird proprietary keys.",
					tags: ["Keycloak", "OIDC", "Docker"],
				},
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"Drop in a Brazilian ID, address proof, or invoice — get JSON back. Go + LLM + Postgres + Redis.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"Tiny FastAPI bank API — deposit, withdraw, transfer. Swagger and tests included.",
					tags: ["Python", "FastAPI"],
				},
				{
					name: "personal-compose",
					href: "https://github.com/kalke/personal-compose",
					blurb:
						"Docker Compose to spin up local DB and broker without the usual pain.",
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
			title: "Mess around with documents",
			intro: "Just a corner to try the extraction API. Nothing fancy — sign in, drop a file, get JSON back.",
			loading: "Loading…",
			email: "Email",
			password: "Password",
			name: "Name",
			login: "Sign in",
			signup: "Create account",
			logout: "Sign out",
			signedInAs: "Signed in as",
			loginError: "Couldn’t sign in. Double-check email and password?",
			passwordTitle: "Change password",
			passwordHint: "At least 10 characters. You’ll stay signed in.",
			currentPassword: "Current password",
			newPassword: "New password",
			confirmPassword: "Confirm new password",
			changePassword: "Save password",
			passwordOk: "Password updated.",
			passwordMismatch: "Confirmation doesn’t match the new password.",
			passwordSame: "New password must be different from the current one.",
			passwordShort: "New password needs at least 10 characters.",
			passwordError: "Couldn’t change the password. Check the current one?",
			signupError: "Couldn’t create the account. Check what you typed.",
			signupOk: "You’re in — account created.",
			verifyTitle: "Confirm your email",
			verifyHint: "I sent a code to {email}. Paste it here.",
			verifyCode: "Code",
			verifySubmit: "Confirm",
			verifyError: "Wrong code, or it expired.",
			verifyClose: "Close",
			resend: "Send again",
			resendIn: "You can resend in {seconds}s",
			resendWait: "Give it a second before asking again.",
			resendError: "Couldn’t resend the code.",
			modeLogin: "Sign in",
			modeSignup: "Create account",
			tokensTitle: "API tokens",
			tokensHint: "The full token shows once. Save it if you’ll need it later.",
			tokenName: "Token name",
			createToken: "Create token",
			tokenOnce: "Copy now — it’s gone after this: ",
			revoke: "Revoke",
			tokenError: "Something went wrong with the token.",
			needToken: "Make a token before extracting.",
			pdeTitle: "Extractor",
			pdeHint: "Send a PDF or image, get JSON. Any signed-in account works.",
			consentLabel:
				"Cool: the file itself isn’t stored. Content may go through an LLM, and I may keep a hash, the result, and an audit trail (including IP).",
			consentRequired: "Tick the consent box to continue.",
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
