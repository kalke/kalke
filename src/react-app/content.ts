export type Lang = "pt" | "en";

export const siteMeta = {
	brand: "kalke",
	pt: {
		title: "Henrique Kalke — engenheiro de software",
		description:
			"Henrique Kalke, engenheiro de software em Curitiba. Sistemas bancários, APIs e um extrator de documentos ao vivo.",
	},
	en: {
		title: "Henrique Kalke — software engineer",
		description:
			"Henrique Kalke, software engineer in Curitiba. Banking systems, APIs, and a live document extractor.",
	},
};

export type PlaygroundCopy = {
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
	pathOverview: string;
	pathApi: string;
	pathExtract: string;
	overviewTitle: string;
	overviewIntro: string;
	overviewApiCard: string;
	overviewApiHint: string;
	overviewExtractCard: string;
	overviewExtractHint: string;
	passwordTitle: string;
	passwordHint: string;
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
	changePassword: string;
	passwordOk: string;
	passwordMismatch: string;
	passwordSame: string;
	passwordShort: string;
	passwordError: string;
	tokensTitle: string;
	tokensHint: string;
	tokenName: string;
	createToken: string;
	copyToken: string;
	copied: string;
	tokenOnce: string;
	revoke: string;
	tokenError: string;
	needToken: string;
	apiHowTitle: string;
	apiHowBody: string;
	pdeTitle: string;
	pdeHint: string;
	consentLabel: string;
	consentRequired: string;
	docType: string;
	docTypeIdentity: string;
	docTypeAddress: string;
	docTypeInvoice: string;
	chooseFile: string;
	extract: string;
	extracting: string;
	extracted: string;
	extractError: string;
	extractEmpty: string;
	resultSummary: string;
	resultJson: string;
	resultHideJson: string;
	preparingToken: string;
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
		terminal: {
			prompt: string;
			lines: { cmd: string; out: string; href?: string }[];
			hint: string;
			inputPlaceholder: string;
			unknown: string;
		};
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
			featured?: boolean;
		}[];
	};
	contact: {
		eyebrow: string;
		title: string;
		text: string;
		links: { label: string; href: string; note: string }[];
	};
	footer: string;
	playground: PlaygroundCopy;
};

export const copy: Record<Lang, Copy> = {
	pt: {
		navAria: "Principal",
		nav: [
			{ label: "~/about", href: "#about" },
			{ label: "~/work", href: "#work" },
			{ label: "~/stack", href: "#stack" },
			{ label: "~/contact", href: "#contact" },
			{ label: "~/dashboard", href: "/playground" },
		],
		langSwitch: { pt: "PT", en: "EN" },
		hero: {
			headline: "Henrique Kalke",
			support:
				"Engenheiro de software em Curitiba. Sistemas bancários, APIs e produtos que precisam funcionar de verdade.",
			primaryCta: { label: "Ver trabalho", href: "#work" },
			secondaryCta: { label: "Falar comigo", href: "#contact" },
			terminal: {
				prompt: "kalke@dev:~$",
				lines: [
					{
						cmd: "whoami",
						out: "Henrique Kalke — backend, auth e infra em fintech.",
						href: "#about",
					},
					{
						cmd: "ls ~/work",
						out: "document-extractor/  kalke-auth/  e-bank-api/",
						href: "#work",
					},
					{
						cmd: "cat contact.md",
						out: "email · github · linkedin · whatsapp",
						href: "#contact",
					},
				],
				hint: "Clique num comando ou digite whoami, ls, contact",
				inputPlaceholder: "comando…",
				unknown: "comando não encontrado. tente: whoami | ls | contact",
			},
		},
		about: {
			eyebrow: "~/about",
			title: "Quem sou",
			paragraphs: [
				"Me chama de Kalke ou Henrique. Há uns seis anos construo software — a maior parte em finanças: crédito, contabilidade e agora infraestrutura bancária de ponta a ponta.",
				"Moro em Curitiba. Já morei três anos na Inglaterra e aprendi a ler e escrever em inglês antes do português — então inglês nunca foi “segunda língua”.",
				"Gosto de sistemas que não podem falhar à toa: contas, PIX, boleto, regras do Banco Central. Já ajudei a automatizar abertura de conta (com compliance), a manter volume alto de boleto e liquidação, e a entregar coisas pouco glamourosas mas úteis — motor de tarifas, checagem de documentos com LLM.",
				"Também faço sites para clientes em WordPress/Elementor quando o projeto pede velocidade e autonomia editorial — e apps sob medida (como este) quando o problema precisa de código próprio. A faixa é o pitch: do page builder ao cluster.",
			],
		},
		likes: {
			eyebrow: "~/likes",
			title: "Fora do teclado",
			items: [
				{
					title: "Os gatos",
					text: "Zaia, Chico, Linhaça e Claire. Quatro personalidades. Casa quieta? Nem pensar.",
				},
				{
					title: "Meg",
					text: "Minha cachorra. Quase se chamou Lurdinha. Perdi essa discussão.",
				},
				{
					title: "Metal",
					text: "Metal a maior parte do tempo — no caminho, no trampo, codando e jogando de madrugada.",
				},
				{
					title: "Games",
					text: "Quando o laptop fecha, eu jogo. Jeito mais fácil de desligar a cabeça.",
				},
			],
		},
		stack: {
			eyebrow: "~/stack",
			title: "Com o que trabalho",
			intro: "Agrupado pelo tipo de problema — não por buzzword.",
			groups: [
				{ area: "Código sob medida", items: ["Go", "Python", "FastAPI", "TypeScript", "React"] },
				{ area: "Dados e eventos", items: ["PostgreSQL", "Redis", "Kafka"] },
				{ area: "Infra e hosting", items: ["AWS", "Docker", "Cloudflare Workers"] },
				{ area: "Auth e APIs", items: ["OIDC", "Keycloak", "OpenAPI"] },
				{ area: "Sites de cliente", items: ["WordPress", "Elementor"] },
			],
		},
		builds: {
			eyebrow: "~/work",
			title: "Trabalho",
			intro: "Projetos que dá pra clicar. O extrator é demo ao vivo — conta, token e documento de verdade.",
			items: [
				{
					name: "Document extractor",
					href: "/playground",
					blurb:
						"App autenticado: gera token, manda PDF ou imagem, recebe dados estruturados. LGPD explícito. Roda de verdade em kalke.dev.",
					tags: ["Live demo", "Go", "LLM", "OIDC"],
					featured: true,
				},
				{
					name: "kalke-auth",
					href: "https://github.com/kalke/kalke-auth",
					blurb:
						"Auth dos apps Kalke com Keycloak/OIDC. Login de pessoa e máquina, cookie de sessão, PAT e introspect.",
					tags: ["Keycloak", "OIDC", "Go"],
				},
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"API por trás do playground. Extrai RG, comprovante ou NF em JSON — Go, LLM, Postgres, Redis.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"API bancária simples em FastAPI — depósito, saque, transferência. Tem Swagger e testes.",
					tags: ["Python", "FastAPI"],
				},
			],
		},
		contact: {
			eyebrow: "~/contact",
			title: "Fala comigo",
			text: "Vaga, freela, dúvida técnica ou só um oi. Email é o caminho mais rápido.",
			links: [
				{
					label: "Email",
					href: "mailto:henriquekalke@icloud.com",
					note: "henriquekalke@icloud.com",
				},
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
			],
		},
		footer: "React · Vite · Cloudflare",
		playground: {
			pageTitle: "Henrique Kalke — dashboard",
			navAria: "Dashboard",
			backHome: "~/",
			eyebrow: "~/dashboard",
			title: "Dashboard",
			intro: "Tokens da API e o extrator de documentos — cada um no seu lugar.",
			loading: "Carregando…",
			email: "Email",
			password: "Senha",
			name: "Nome",
			login: "Entrar",
			signup: "Criar conta",
			logout: "Sair",
			signedInAs: "Sessão",
			loginError: "Não entrou. Confere email e senha.",
			signupError: "Não criou a conta. Confere os dados.",
			signupOk: "Conta criada. Você já está dentro.",
			verifyTitle: "Confirma o email",
			verifyHint: "Mandei um código para {email}. Cola ele aqui.",
			verifyCode: "Código",
			verifySubmit: "Confirmar",
			verifyError: "Código errado ou expirado. Pede outro se precisar.",
			verifyClose: "Fechar",
			resend: "Mandar de novo",
			resendIn: "Reenviar em {seconds}s",
			resendWait: "Espera um pouco antes de pedir outro código.",
			resendError: "Não reenviou o código. Tenta de novo.",
			modeLogin: "Entrar",
			modeSignup: "Criar conta",
			pathOverview: "~/dashboard",
			pathApi: "~/dashboard/api",
			pathExtract: "~/dashboard/extract",
			overviewTitle: "Visão geral",
			overviewIntro: "Escolhe o que quer fazer. Sem números inventados — só o que existe.",
			overviewApiCard: "API tokens",
			overviewApiHint: "Gerar, copiar e revogar tokens para chamar a API.",
			overviewExtractCard: "Extrator",
			overviewExtractHint: "Enviar um documento e ver o resultado estruturado.",
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
			passwordError: "Não trocou a senha. Confere a senha atual.",
			tokensTitle: "Tokens da API",
			tokensHint:
				"O token completo aparece uma vez. Copia agora se for usar fora do site. No extrator o token da sessão já é usado automaticamente.",
			tokenName: "Nome do token",
			createToken: "Gerar token",
			copyToken: "Copiar token",
			copied: "Copiado.",
			tokenOnce: "Copia agora — depois some:",
			revoke: "Revogar",
			tokenError: "Algo deu errado com o token. Tenta de novo.",
			needToken: "Gera um token em ~/dashboard/api antes de extrair.",
			apiHowTitle: "Como chamar",
			apiHowBody:
				"Authorization: Bearer <token> no header. POST multipart em /v1/extract com o arquivo e o consentimento LGPD.",
			pdeTitle: "Extrair documento",
			pdeHint: "Escolhe o tipo, manda PDF ou imagem, aceita o termo. O resultado aparece abaixo.",
			consentLabel:
				"O arquivo em si não fica salvo. O conteúdo pode passar por um LLM; posso guardar hash, resultado e auditoria (com IP).",
			consentRequired: "Marca o aceite para continuar.",
			docType: "Tipo de documento",
			docTypeIdentity: "Documento de identidade",
			docTypeAddress: "Comprovante de endereço",
			docTypeInvoice: "Nota fiscal",
			chooseFile: "Arquivo",
			extract: "Extrair",
			extracting: "Extraindo…",
			extracted: "Extraído",
			extractError: "A extração falhou. Confere o arquivo e tenta de novo.",
			extractEmpty: "Ainda sem resultado. Manda um arquivo e clica em Extrair.",
			resultSummary: "Resumo",
			resultJson: "Ver JSON",
			resultHideJson: "Esconder JSON",
			preparingToken: "Preparando acesso…",
		},
	},
	en: {
		navAria: "Primary",
		nav: [
			{ label: "~/about", href: "#about" },
			{ label: "~/work", href: "#work" },
			{ label: "~/stack", href: "#stack" },
			{ label: "~/contact", href: "#contact" },
			{ label: "~/dashboard", href: "/playground" },
		],
		langSwitch: { pt: "PT", en: "EN" },
		hero: {
			headline: "Henrique Kalke",
			support:
				"Software engineer in Curitiba. Banking systems, APIs, and products that have to actually work.",
			primaryCta: { label: "View work", href: "#work" },
			secondaryCta: { label: "Get in touch", href: "#contact" },
			terminal: {
				prompt: "kalke@dev:~$",
				lines: [
					{
						cmd: "whoami",
						out: "Henrique Kalke — backend, auth, and fintech infra.",
						href: "#about",
					},
					{
						cmd: "ls ~/work",
						out: "document-extractor/  kalke-auth/  e-bank-api/",
						href: "#work",
					},
					{
						cmd: "cat contact.md",
						out: "email · github · linkedin · whatsapp",
						href: "#contact",
					},
				],
				hint: "Click a command or type whoami, ls, contact",
				inputPlaceholder: "command…",
				unknown: "command not found. try: whoami | ls | contact",
			},
		},
		about: {
			eyebrow: "~/about",
			title: "Who I am",
			paragraphs: [
				"Call me Kalke or Henrique. I’ve been building software for about six years — mostly in finance: credit, accounting tech, and now full banking infrastructure.",
				"I’m based in Curitiba. I lived in England for three years and learned to read and write in English before Portuguese, so English never felt like a “second language.”",
				"I like systems that can’t casually break: accounts, PIX, boleto, Central Bank rules. I’ve helped automate account onboarding (with compliance), keep high boleto and settlement volume moving, and ship unglamorous but useful stuff — fee engines, LLM document checks.",
				"I also ship client sites on WordPress/Elementor when the job needs speed and editorial autonomy — and custom apps (like this one) when the problem needs real code. The range is the pitch: page builder to cluster.",
			],
		},
		likes: {
			eyebrow: "~/likes",
			title: "Off the keyboard",
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
			eyebrow: "~/stack",
			title: "What I work with",
			intro: "Grouped by the kind of problem — not by buzzword.",
			groups: [
				{ area: "Custom code", items: ["Go", "Python", "FastAPI", "TypeScript", "React"] },
				{ area: "Data & events", items: ["PostgreSQL", "Redis", "Kafka"] },
				{ area: "Infra & hosting", items: ["AWS", "Docker", "Cloudflare Workers"] },
				{ area: "Auth & APIs", items: ["OIDC", "Keycloak", "OpenAPI"] },
				{ area: "Client sites", items: ["WordPress", "Elementor"] },
			],
		},
		builds: {
			eyebrow: "~/work",
			title: "Work",
			intro: "Projects you can click. The extractor is a live demo — real account, token, and document.",
			items: [
				{
					name: "Document extractor",
					href: "/playground",
					blurb:
						"Authenticated app: generate a token, send a PDF or image, get structured data back. Explicit LGPD consent. Live on kalke.dev.",
					tags: ["Live demo", "Go", "LLM", "OIDC"],
					featured: true,
				},
				{
					name: "kalke-auth",
					href: "https://github.com/kalke/kalke-auth",
					blurb:
						"Auth for Kalke apps with Keycloak/OIDC. Human and machine login, session cookie, PAT, and introspect.",
					tags: ["Keycloak", "OIDC", "Go"],
				},
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"API behind the playground. Extract ID, proof of address, or invoice to JSON — Go, LLM, Postgres, Redis.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"Simple banking API in FastAPI — deposit, withdraw, transfer. Swagger and tests included.",
					tags: ["Python", "FastAPI"],
				},
			],
		},
		contact: {
			eyebrow: "~/contact",
			title: "Get in touch",
			text: "Job, freelance, technical question, or just hello. Email is the fastest path.",
			links: [
				{
					label: "Email",
					href: "mailto:henriquekalke@icloud.com",
					note: "henriquekalke@icloud.com",
				},
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
					note: "(41) 99107-1908",
				},
			],
		},
		footer: "React · Vite · Cloudflare",
		playground: {
			pageTitle: "Henrique Kalke — dashboard",
			navAria: "Dashboard",
			backHome: "~/",
			eyebrow: "~/dashboard",
			title: "Dashboard",
			intro: "API tokens and the document extractor — each in its own place.",
			loading: "Loading…",
			email: "Email",
			password: "Password",
			name: "Name",
			login: "Sign in",
			signup: "Create account",
			logout: "Sign out",
			signedInAs: "Session",
			loginError: "Couldn’t sign in. Check email and password.",
			signupError: "Couldn’t create the account. Check what you typed.",
			signupOk: "Account created. You’re in.",
			verifyTitle: "Confirm your email",
			verifyHint: "I sent a code to {email}. Paste it here.",
			verifyCode: "Code",
			verifySubmit: "Confirm",
			verifyError: "Wrong or expired code. Resend if you need to.",
			verifyClose: "Close",
			resend: "Send again",
			resendIn: "Resend in {seconds}s",
			resendWait: "Wait a bit before asking for another code.",
			resendError: "Couldn’t resend the code. Try again.",
			modeLogin: "Sign in",
			modeSignup: "Create account",
			pathOverview: "~/dashboard",
			pathApi: "~/dashboard/api",
			pathExtract: "~/dashboard/extract",
			overviewTitle: "Overview",
			overviewIntro: "Pick what you want to do. No fake stats — only what’s real.",
			overviewApiCard: "API tokens",
			overviewApiHint: "Generate, copy, and revoke tokens to call the API.",
			overviewExtractCard: "Extractor",
			overviewExtractHint: "Send a document and see structured results.",
			passwordTitle: "Change password",
			passwordHint: "At least 10 characters. You’ll stay signed in.",
			currentPassword: "Current password",
			newPassword: "New password",
			confirmPassword: "Confirm new password",
			changePassword: "Save password",
			passwordOk: "Password updated.",
			passwordMismatch: "Confirmation doesn’t match the new password.",
			passwordSame: "New password must differ from the current one.",
			passwordShort: "New password needs at least 10 characters.",
			passwordError: "Couldn’t change the password. Check the current one.",
			tokensTitle: "API tokens",
			tokensHint:
				"The full token shows once. Copy it now if you’ll use it outside this site. The extractor uses your session token automatically.",
			tokenName: "Token name",
			createToken: "Generate token",
			copyToken: "Copy token",
			copied: "Copied.",
			tokenOnce: "Copy now — it’s gone after this:",
			revoke: "Revoke",
			tokenError: "Something went wrong with the token. Try again.",
			needToken: "Generate a token in ~/dashboard/api before extracting.",
			apiHowTitle: "How to call it",
			apiHowBody:
				"Authorization: Bearer <token> header. POST multipart to /v1/extract with the file and LGPD consent.",
			pdeTitle: "Extract document",
			pdeHint: "Pick a type, send a PDF or image, accept the terms. Results show below.",
			consentLabel:
				"The file itself isn’t stored. Content may go through an LLM; I may keep a hash, the result, and an audit trail (including IP).",
			consentRequired: "Tick the consent box to continue.",
			docType: "Document type",
			docTypeIdentity: "Identity document",
			docTypeAddress: "Proof of address",
			docTypeInvoice: "Invoice",
			chooseFile: "File",
			extract: "Extract",
			extracting: "Extracting…",
			extracted: "Extracted",
			extractError: "Extraction failed. Check the file and try again.",
			extractEmpty: "No result yet. Upload a file and click Extract.",
			resultSummary: "Summary",
			resultJson: "Show JSON",
			resultHideJson: "Hide JSON",
			preparingToken: "Preparing access…",
		},
	},
};

export function detectLang(): Lang {
	if (typeof window === "undefined") return "en";
	const saved = window.localStorage.getItem("kalke-lang");
	if (saved === "pt" || saved === "en") return saved;
	return window.navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}
