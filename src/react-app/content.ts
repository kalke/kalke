export type Lang = "pt" | "en";

export const siteMeta = {
	brand: "kalke",
	pt: {
		title: "Henrique Kalke — engenheiro de software",
		description:
			"Henrique Kalke. Engenharia de software para sistemas financeiros, APIs e produtos digitais. Curitiba.",
	},
	en: {
		title: "Henrique Kalke — software engineer",
		description:
			"Henrique Kalke. Software engineering for financial systems, APIs, and digital products. Based in Curitiba.",
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
	accountMenu: string;
	accountClose: string;
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
	pathOverviewShort: string;
	pathApiShort: string;
	pathExtractShort: string;
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
	passwordWeak: string;
	passwordError: string;
	passwordRuleLen: string;
	passwordRuleLetter: string;
	passwordRuleNumber: string;
	passwordRuleMatch: string;
	capsOn: string;
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
	fieldLabels: Record<string, string>;
};

type Copy = {
	navAria: string;
	navMenu: string;
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
			cta?: string;
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
		navAria: "Navegação principal",
		navMenu: "Menu",
		nav: [
			{ label: "~/about", href: "#about" },
			{ label: "~/work", href: "#work" },
			{ label: "~/stack", href: "#stack" },
			{ label: "~/contact", href: "#contact" },
			{ label: "~/demo", href: "/playground" },
		],
		langSwitch: { pt: "PT", en: "EN" },
		hero: {
			headline: "Henrique Kalke",
			support:
				"Engenharia de software para finanças e produtos digitais. APIs, autenticação e demos que já rodam em produção.",
			primaryCta: { label: "Ver projetos", href: "#work" },
			secondaryCta: { label: "Contato", href: "#contact" },
			terminal: {
				prompt: "kalke@dev:~$",
				lines: [
					{
						cmd: "whoami",
						out: "Backend, auth e infra em ambientes regulados.",
						href: "#about",
					},
					{
						cmd: "ls ~/work",
						out: "document-extractor/  kalke-auth/  e-bank-api/",
						href: "#work",
					},
					{
						cmd: "cat contact.md",
						out: "henriquekalke@icloud.com",
						href: "#contact",
					},
				],
				hint: "Comandos: whoami · ls · contact",
				inputPlaceholder: "comando",
				unknown: "comando desconhecido — whoami | ls | contact",
			},
		},
		about: {
			eyebrow: "~/about",
			title: "Sobre mim",
			paragraphs: [
				"Sou o Henrique Kalke — kalke na rede. Há seis anos construo software em crédito, contábil e infraestrutura bancária, onde erro custa dinheiro e auditoria.",
				"Moro em Curitiba. Morei três anos no Reino Unido. Inglês fluente na leitura e na escrita desde cedo; isso ajuda em docs, código e times fora do Brasil.",
				"Já trabalhei com onboarding de contas sob compliance, boleto e liquidação em volume, motores de tarifa e checagem de documentos com LLM. Quero sistemas estáveis em torno de contas, PIX, boleto e regras do Banco Central.",
				"Também entrego sites comerciais em WordPress/Elementor quando prazo e autonomia editorial pesam. E apps próprios — este portfólio e o extrator — quando o produto precisa de código dedicado.",
			],
		},
		likes: {
			eyebrow: "~/likes",
			title: "Fora do teclado",
			items: [
				{
					title: "Zaia, Chico, Linhaça, Claire",
					text: "Quatro gatos em casa. Companhia fixa quando eu saio do código.",
				},
				{
					title: "Meg",
					text: "Cachorra da família. Queria Lurdinha — perdi a discussão e ficou Meg.",
				},
				{
					title: "Música",
					text: "Amo música no deslocamento, no treino, no trabalho e à noite.",
				},
				{
					title: "Treino",
					text: "Academia para manter a cabeça (e o corpo) depois de longas sessões.",
				},
				{
					title: "Games",
					text: "Meu jeito preferido de desligar quando o dia no teclado acaba.",
				},
			],
		},
		stack: {
			eyebrow: "~/stack",
			title: "Stack",
			intro: "Ferramentas do dia a dia, agrupadas por tipo de problema.",
			groups: [
				{ area: "Aplicações", items: ["Go", "Python", "FastAPI", "TypeScript", "React"] },
				{ area: "Dados", items: ["PostgreSQL", "Redis", "Kafka"] },
				{ area: "Cloud e runtime", items: ["AWS", "Docker", "Cloudflare Workers"] },
				{ area: "Identidade e APIs", items: ["OIDC", "Keycloak", "OpenAPI"] },
				{ area: "Sites comerciais", items: ["WordPress", "Elementor"] },
			],
		},
		builds: {
			eyebrow: "~/work",
			title: "Projetos",
			intro: "Repos públicos e uma demo ao vivo do extrator, autenticada em kalke.dev.",
			items: [
				{
					name: "Document extractor",
					href: "/playground",
					blurb:
						"Demo em produção: token de API, upload de PDF ou imagem, saída estruturada e consentimento LGPD.",
					tags: ["Live demo", "Go", "LLM", "OIDC"],
					featured: true,
					cta: "Abrir demo",
				},
				{
					name: "kalke-auth",
					href: "https://github.com/kalke/kalke-auth",
					blurb:
						"Auth com Keycloak/OIDC: sessão por cookie, PATs e introspect para serviços que consomem a API.",
					tags: ["Keycloak", "OIDC", "Go"],
				},
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"API Go de extração (RG, comprovante, NF) com LLM, Postgres e Redis. Base da demo ao vivo.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"API bancária de referência em FastAPI (depósito, saque, transferência), com OpenAPI e testes.",
					tags: ["Python", "FastAPI"],
				},
			],
		},
		contact: {
			eyebrow: "~/contact",
			title: "Contato",
			text: "Oportunidades, projetos e dúvidas técnicas. Preferência por email.",
			links: [
				{
					label: "Email",
					href: "mailto:henriquekalke@icloud.com",
					note: "henriquekalke@icloud.com",
				},
				{
					label: "LinkedIn",
					href: "https://www.linkedin.com/in/henriquekalke/",
					note: "linkedin.com/in/henriquekalke",
				},
				{
					label: "GitHub",
					href: "https://github.com/kalke",
					note: "github.com/kalke",
				},
				{
					label: "WhatsApp",
					href: "https://wa.me/5541991071908",
					note: "+55 41 99107-1908",
				},
			],
		},
		footer: "React · Vite · Cloudflare",
		playground: {
			pageTitle: "Live demo — kalke.dev",
			navAria: "Demo",
			backHome: "~/",
			eyebrow: "~/demo",
			title: "Acesso",
			intro:
				"Entre para gerenciar tokens de API e executar extrações. A demo usa um token de sessão automaticamente.",
			loading: "Carregando…",
			email: "Email",
			password: "Senha",
			name: "Nome",
			login: "Entrar",
			signup: "Criar conta",
			logout: "Encerrar sessão",
			signedInAs: "Conta",
			accountMenu: "Conta",
			accountClose: "Fechar",
			loginError: "Email ou senha inválidos.",
			signupError: "Não foi possível criar a conta. Verifique os dados.",
			signupOk: "Conta criada.",
			verifyTitle: "Verificação de email",
			verifyHint: "Código enviado para {email}.",
			verifyCode: "Código",
			verifySubmit: "Confirmar",
			verifyError: "Código inválido ou expirado.",
			verifyClose: "Fechar",
			resend: "Reenviar código",
			resendIn: "Reenviar em {seconds}s",
			resendWait: "Aguarde antes de solicitar outro código.",
			resendError: "Falha ao reenviar o código.",
			modeLogin: "Entrar",
			modeSignup: "Criar conta",
			pathOverview: "~/demo",
			pathApi: "~/demo/api",
			pathExtract: "~/demo/extract",
			pathOverviewShort: "Demo",
			pathApiShort: "API",
			pathExtractShort: "Extract",
			overviewTitle: "Demo ao vivo",
			overviewIntro:
				"Dois fluxos: credenciais Bearer para integração HTTP, ou upload de documento com resultado estruturado.",
			overviewApiCard: "Tokens de API",
			overviewApiHint: "Gerar, copiar e revogar credenciais Bearer.",
			overviewExtractCard: "Extração",
			overviewExtractHint: "Enviar documento e revisar o resultado.",
			passwordTitle: "Alterar senha",
			passwordHint: "A sessão permanece ativa após a alteração.",
			currentPassword: "Senha atual",
			newPassword: "Nova senha",
			confirmPassword: "Confirmar nova senha",
			changePassword: "Salvar senha",
			passwordOk: "Senha atualizada.",
			passwordMismatch: "A confirmação não coincide.",
			passwordSame: "A nova senha deve ser diferente da atual.",
			passwordShort: "Use pelo menos 10 caracteres.",
			passwordWeak: "A senha não atende aos requisitos.",
			passwordError: "Não foi possível alterar a senha. Verifique a senha atual.",
			passwordRuleLen: "Mínimo de 10 caracteres",
			passwordRuleLetter: "Pelo menos uma letra",
			passwordRuleNumber: "Pelo menos um número",
			passwordRuleMatch: "Confirmação igual à nova senha",
			capsOn: "Caps Lock ligado",
			tokensTitle: "Tokens de API",
			tokensHint:
				"O valor completo aparece uma vez. Guarde-o para uso fora deste site. O extrator da demo usa o token da sessão automaticamente.",
			tokenName: "Nome",
			createToken: "Gerar token",
			copyToken: "Copiar",
			copied: "Copiado",
			tokenOnce: "Copie agora — não será exibido de novo:",
			revoke: "Revogar",
			tokenError: "Falha na operação do token.",
			needToken: "Gere um token em ~/demo/api antes de extrair.",
			apiHowTitle: "Uso via HTTP",
			apiHowBody:
				"Header Authorization: Bearer <token>. POST multipart em /v1/extract com arquivo e consentimento LGPD.",
			pdeTitle: "Extrair documento",
			pdeHint:
				"Selecione o tipo, envie o arquivo e aceite o termo. O resultado aparece abaixo. O token de sessão é preparado automaticamente.",
			consentLabel:
				"O arquivo não é armazenado. O conteúdo pode ser processado por LLM; hash, resultado e auditoria (incl. IP) podem ser retidos.",
			consentRequired: "Aceite o termo para continuar.",
			docType: "Tipo",
			docTypeIdentity: "Documento de identidade",
			docTypeAddress: "Comprovante de endereço",
			docTypeInvoice: "Nota fiscal",
			chooseFile: "Arquivo",
			extract: "Extrair",
			extracting: "Extraindo…",
			extracted: "Extraído",
			extractError: "Falha na extração. Verifique o arquivo e tente de novo.",
			extractEmpty: "Nenhum resultado ainda. Envie um arquivo e execute Extrair.",
			resultSummary: "Resumo",
			resultJson: "JSON",
			resultHideJson: "Ocultar JSON",
			preparingToken: "Preparando acesso…",
			fieldLabels: {
				doc_type: "Tipo",
				full_name: "Nome completo",
				name: "Nome",
				nome: "Nome",
				document_number: "Documento",
				cpf: "CPF",
				rg: "RG",
				cnpj: "CNPJ",
				address: "Endereço",
				endereco: "Endereço",
				issue_date: "Emissão",
				expiry_date: "Validade",
				invoice_number: "Número da NF",
				total: "Total",
			},
		},
	},
	en: {
		navAria: "Primary",
		navMenu: "Menu",
		nav: [
			{ label: "~/about", href: "#about" },
			{ label: "~/work", href: "#work" },
			{ label: "~/stack", href: "#stack" },
			{ label: "~/contact", href: "#contact" },
			{ label: "~/demo", href: "/playground" },
		],
		langSwitch: { pt: "PT", en: "EN" },
		hero: {
			headline: "Henrique Kalke",
			support:
				"Software engineering for finance and digital products. APIs, authentication, and demos already running in production.",
			primaryCta: { label: "View projects", href: "#work" },
			secondaryCta: { label: "Contact", href: "#contact" },
			terminal: {
				prompt: "kalke@dev:~$",
				lines: [
					{
						cmd: "whoami",
						out: "Backend, auth, and infra in regulated environments.",
						href: "#about",
					},
					{
						cmd: "ls ~/work",
						out: "document-extractor/  kalke-auth/  e-bank-api/",
						href: "#work",
					},
					{
						cmd: "cat contact.md",
						out: "henriquekalke@icloud.com",
						href: "#contact",
					},
				],
				hint: "Commands: whoami · ls · contact",
				inputPlaceholder: "command",
				unknown: "unknown command — whoami | ls | contact",
			},
		},
		about: {
			eyebrow: "~/about",
			title: "About me",
			paragraphs: [
				"I'm Henrique Kalke — kalke online. For six years I've been building software in credit, accounting, and banking infrastructure, where mistakes cost money and audits.",
				"I live in Curitiba. I spent three years in the UK. Fluent English in reading and writing from early on; it helps with docs, code, and teams outside Brazil.",
				"I've worked on compliant account onboarding, high-volume boleto and settlement, fee engines, and LLM document checks. I care about stable systems around accounts, PIX, boleto, and Central Bank rules.",
				"I also ship commercial sites on WordPress/Elementor when timeline and editorial control matter. And purpose-built apps — this portfolio and the extractor — when the product needs its own codebase.",
			],
		},
		likes: {
			eyebrow: "~/likes",
			title: "Away from the keyboard",
			items: [
				{
					title: "Zaia, Chico, Linhaça, Claire",
					text: "Four house cats. Fixed company when I step away from the code.",
				},
				{
					title: "Meg",
					text: "Family dog. I wanted Lurdinha — lost the discussion, so she's Meg.",
				},
				{
					title: "Music",
					text: "I love music on the commute, at the gym, at work, and late at night.",
				},
				{
					title: "Training",
					text: "Gym time to reset my head (and body) after long sessions.",
				},
				{
					title: "Games",
					text: "My favorite way to switch off when the coding day is done.",
				},
			],
		},
		stack: {
			eyebrow: "~/stack",
			title: "Stack",
			intro: "Day-to-day tools, grouped by problem type.",
			groups: [
				{ area: "Applications", items: ["Go", "Python", "FastAPI", "TypeScript", "React"] },
				{ area: "Data", items: ["PostgreSQL", "Redis", "Kafka"] },
				{ area: "Cloud & runtime", items: ["AWS", "Docker", "Cloudflare Workers"] },
				{ area: "Identity & APIs", items: ["OIDC", "Keycloak", "OpenAPI"] },
				{ area: "Commercial sites", items: ["WordPress", "Elementor"] },
			],
		},
		builds: {
			eyebrow: "~/work",
			title: "Projects",
			intro: "Public repos and a live extractor demo, authenticated on kalke.dev.",
			items: [
				{
					name: "Document extractor",
					href: "/playground",
					blurb:
						"Production live demo: API token, PDF or image upload, structured output, and LGPD consent.",
					tags: ["Live demo", "Go", "LLM", "OIDC"],
					featured: true,
					cta: "Open live demo",
				},
				{
					name: "kalke-auth",
					href: "https://github.com/kalke/kalke-auth",
					blurb:
						"Auth on Keycloak/OIDC: cookie sessions, PATs, and introspect for services that call the API.",
					tags: ["Keycloak", "OIDC", "Go"],
				},
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"Go extraction API (ID, proof of address, invoice) with LLM, Postgres, and Redis. Powers the live demo.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"Reference banking API in FastAPI (deposit, withdraw, transfer) with OpenAPI and tests.",
					tags: ["Python", "FastAPI"],
				},
			],
		},
		contact: {
			eyebrow: "~/contact",
			title: "Contact",
			text: "Roles, projects, and technical questions. Email preferred.",
			links: [
				{
					label: "Email",
					href: "mailto:henriquekalke@icloud.com",
					note: "henriquekalke@icloud.com",
				},
				{
					label: "LinkedIn",
					href: "https://www.linkedin.com/in/henriquekalke/",
					note: "linkedin.com/in/henriquekalke",
				},
				{
					label: "GitHub",
					href: "https://github.com/kalke",
					note: "github.com/kalke",
				},
				{
					label: "WhatsApp",
					href: "https://wa.me/5541991071908",
					note: "+55 41 99107-1908",
				},
			],
		},
		footer: "React · Vite · Cloudflare",
		playground: {
			pageTitle: "Live demo — kalke.dev",
			navAria: "Demo",
			backHome: "~/",
			eyebrow: "~/demo",
			title: "Sign in",
			intro:
				"Sign in to manage API tokens and run extractions. The demo uses a session token automatically.",
			loading: "Loading…",
			email: "Email",
			password: "Password",
			name: "Name",
			login: "Sign in",
			signup: "Create account",
			logout: "Sign out",
			signedInAs: "Account",
			accountMenu: "Account",
			accountClose: "Close",
			loginError: "Invalid email or password.",
			signupError: "Could not create the account. Check the details.",
			signupOk: "Account created.",
			verifyTitle: "Email verification",
			verifyHint: "Code sent to {email}.",
			verifyCode: "Code",
			verifySubmit: "Confirm",
			verifyError: "Invalid or expired code.",
			verifyClose: "Close",
			resend: "Resend code",
			resendIn: "Resend in {seconds}s",
			resendWait: "Wait before requesting another code.",
			resendError: "Could not resend the code.",
			modeLogin: "Sign in",
			modeSignup: "Create account",
			pathOverview: "~/demo",
			pathApi: "~/demo/api",
			pathExtract: "~/demo/extract",
			pathOverviewShort: "Demo",
			pathApiShort: "API",
			pathExtractShort: "Extract",
			overviewTitle: "Live demo",
			overviewIntro:
				"Two flows: Bearer credentials for HTTP integration, or document upload with structured output.",
			overviewApiCard: "API tokens",
			overviewApiHint: "Generate, copy, and revoke Bearer credentials.",
			overviewExtractCard: "Extraction",
			overviewExtractHint: "Upload a document and review the result.",
			passwordTitle: "Change password",
			passwordHint: "Your session stays active after the change.",
			currentPassword: "Current password",
			newPassword: "New password",
			confirmPassword: "Confirm new password",
			changePassword: "Save password",
			passwordOk: "Password updated.",
			passwordMismatch: "Confirmation does not match.",
			passwordSame: "New password must differ from the current one.",
			passwordShort: "Use at least 10 characters.",
			passwordWeak: "Password does not meet the requirements.",
			passwordError: "Could not change the password. Check the current one.",
			passwordRuleLen: "At least 10 characters",
			passwordRuleLetter: "At least one letter",
			passwordRuleNumber: "At least one number",
			passwordRuleMatch: "Confirmation matches new password",
			capsOn: "Caps Lock on",
			tokensTitle: "API tokens",
			tokensHint:
				"The full value is shown once. Store it for use outside this site. The demo extractor uses the session token automatically.",
			tokenName: "Name",
			createToken: "Generate token",
			copyToken: "Copy",
			copied: "Copied",
			tokenOnce: "Copy now — it will not be shown again:",
			revoke: "Revoke",
			tokenError: "Token operation failed.",
			needToken: "Generate a token in ~/demo/api before extracting.",
			apiHowTitle: "HTTP usage",
			apiHowBody:
				"Authorization: Bearer <token> header. POST multipart to /v1/extract with file and LGPD consent.",
			pdeTitle: "Extract document",
			pdeHint:
				"Select a type, upload a file, and accept the terms. Results appear below. The session token is prepared automatically.",
			consentLabel:
				"The file is not stored. Content may be processed by an LLM; hash, result, and audit data (incl. IP) may be retained.",
			consentRequired: "Accept the terms to continue.",
			docType: "Type",
			docTypeIdentity: "Identity document",
			docTypeAddress: "Proof of address",
			docTypeInvoice: "Invoice",
			chooseFile: "File",
			extract: "Extract",
			extracting: "Extracting…",
			extracted: "Extracted",
			extractError: "Extraction failed. Check the file and try again.",
			extractEmpty: "No result yet. Upload a file and run Extract.",
			resultSummary: "Summary",
			resultJson: "JSON",
			resultHideJson: "Hide JSON",
			preparingToken: "Preparing access…",
			fieldLabels: {
				doc_type: "Type",
				full_name: "Full name",
				name: "Name",
				nome: "Name",
				document_number: "Document",
				cpf: "CPF",
				rg: "RG",
				cnpj: "CNPJ",
				address: "Address",
				endereco: "Address",
				issue_date: "Issued",
				expiry_date: "Expires",
				invoice_number: "Invoice number",
				total: "Total",
			},
		},
	},
};

export function detectLang(): Lang {
	if (typeof window === "undefined") return "en";
	const saved = window.localStorage.getItem("kalke-lang");
	if (saved === "pt" || saved === "en") return saved;
	return window.navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}
