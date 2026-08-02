export type Lang = "pt" | "en";

export const siteMeta = {
	brand: "kalke",
	pt: {
		title: "Henrique Kalke — engenheiro de software",
		description:
			"Henrique Kalke (kalke). Software para crédito, contabilidade e core banking. Curitiba.",
	},
	en: {
		title: "Henrique Kalke — software engineer",
		description:
			"Henrique Kalke (kalke). Software for credit, accounting, and core banking. Based in Curitiba.",
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
	continueWithGoogle: string;
	continueWithEmail: string;
	authOr: string;
	authOtherMethods: string;
	passwordOptional: string;
	passwordOptionalHint: string;
	usePassword: string;
	hidePassword: string;
	oauthError: string;
	forgotPassword: string;
	forgotTitle: string;
	forgotHint: string;
	forgotSubmit: string;
	forgotSent: string;
	forgotError: string;
	forgotBack: string;
	passwordless: string;
	passwordlessTitle: string;
	passwordlessHint: string;
	passwordlessSubmit: string;
	passwordlessError: string;
	passwordlessBack: string;
	resetTitle: string;
	resetHint: string;
	resetSubmit: string;
	resetError: string;
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
				"Software para os bastidores do mercado financeiro — crédito, contabilidade e core banking.",
			primaryCta: { label: "Ver projetos", href: "#work" },
			secondaryCta: { label: "Contato", href: "#contact" },
			terminal: {
				prompt: "kalke@dev:~$",
				lines: [
					{
						cmd: "whoami",
						out: "Backend, core banking e auth em ambientes regulados.",
						href: "#about",
					},
					{
						cmd: "ls ~/work",
						out: "document-extractor/  kalke-auth/  e-bank-api/",
						href: "#work",
					},
					{
						cmd: "cat contact.md",
						out: "henriquekalke@icloud.com · WhatsApp preferido",
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
				"E aí, sou o Henrique Kalke — ou só kalke. Moro em Curitiba e, nos últimos oito anos, tenho focado em construir software para os bastidores do mercado financeiro: sistemas de crédito, contabilidade e infraestrutura de core banking. Trabalho em ambientes onde um erro não gera só um log de falha — gera prejuízo e dor de cabeça com auditoria.",
				"Minha base acadêmica é em Sistemas de Informação (BSI) e Inteligência Artificial Aplicada (IAA). No dia a dia, construo ecossistemas com liquidação em volume, PIX, motores de tarifa, governança e onboarding sob regras rígidas de compliance — inclusive usando LLMs para checagem de documentos. Passei por Kanastra, Exati e QuiteJá, de perto com Go, Python e mensageria.",
				"Morei três anos no Reino Unido e fui alfabetizado em inglês, então não lido com ele só como segundo idioma. Isso ajuda na hora de levantar requisitos, ler documentação e implementar sistemas.",
			],
		},
		likes: {
			eyebrow: "~/likes",
			title: "Fora do teclado",
			items: [
				{
					title: "Zaia, Chico, Linhaça e Claire",
					text: "Meus quatro gatos. Sou outra pessoa com eles, e a casa nunca fica quieta.",
				},
				{
					title: "Meg",
					text: "A integrante mais alegre da família. Eu juro que queria Lurdinha, mas perdi a discussão.",
				},
				{
					title: "Games",
					text: "O jeito oficial de resetar a cabeça depois do expediente.",
				},
				{
					title: "Música",
					text: "Uma extensão de mim — trabalhando, jogando ou treinando.",
				},
			],
		},
		stack: {
			eyebrow: "~/stack",
			title: "Stack",
			intro: "As ferramentas que resolvem meus problemas hoje, agrupadas pelo papel na arquitetura:",
			groups: [
				{
					area: "Aplicações",
					items: ["Go", "Python", "FastAPI", "Flask", "TypeScript", "React", "Vue"],
				},
				{ area: "Dados", items: ["PostgreSQL", "MySQL", "Redis", "Kafka"] },
				{ area: "Cloud e runtime", items: ["AWS", "Docker", "Cloudflare Workers"] },
				{ area: "Identidade e APIs", items: ["OpenAPI", "OIDC", "Keycloak"] },
				{ area: "Sites comerciais", items: ["WordPress", "Elementor"] },
			],
		},
		builds: {
			eyebrow: "~/work",
			title: "Projetos",
			intro: "Alguns repositórios públicos e coisas que construo quando o produto exige código dedicado.",
			items: [
				{
					name: "Document extractor",
					href: "/playground",
					blurb:
						"Demo rodando em produção. Upload de PDF ou imagem, saída estruturada da extração, autenticação e consentimento LGPD.",
					tags: ["Live demo", "Go", "LLM", "OIDC"],
					featured: true,
					cta: "Abrir demo",
				},
				{
					name: "kalke-auth",
					href: "https://github.com/kalke/kalke-auth",
					blurb:
						"Motor de autenticação com Keycloak/OIDC: sessão por cookie, PATs e introspect para microsserviços que consomem a API.",
					tags: ["Keycloak", "OIDC", "Go"],
				},
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"API base da demo ao vivo. Extração de RG, comprovantes e NFs com LLM, PostgreSQL e Redis.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"API bancária de referência em FastAPI: depósito, saque e transferência, com OpenAPI e boa cobertura de testes.",
					tags: ["Python", "FastAPI"],
				},
			],
		},
		contact: {
			eyebrow: "~/contact",
			title: "Contato",
			text: "Quer bater um papo sobre código, infraestrutura bancária, projetos paralelos ou novas oportunidades? Me manda uma mensagem. Costumo ser mais rápido no WhatsApp.",
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
			continueWithGoogle: "Continuar com Google",
			continueWithEmail: "Continuar com email",
			authOr: "ou",
			authOtherMethods: "Outras opções",
			passwordOptional: "Senha (opcional)",
			passwordOptionalHint: "Deixe em branco para receber um código por email.",
			usePassword: "Usar senha",
			hidePassword: "Entrar com código",
			oauthError: "Não foi possível entrar com Google. Tente de novo.",
			forgotPassword: "Esqueci a senha",
			forgotTitle: "Redefinir senha",
			forgotHint:
				"Informe o email da conta. Se existir, enviaremos um código.",
			forgotSubmit: "Enviar código",
			forgotSent: "Se a conta existir, enviamos um código para {email}.",
			forgotError: "Não foi possível enviar o código. Tente de novo.",
			forgotBack: "Voltar ao login",
			passwordless: "Entrar sem senha",
			passwordlessTitle: "Entrar por email",
			passwordlessHint:
				"Enviaremos um código de 6 dígitos para o email da conta.",
			passwordlessSubmit: "Enviar código",
			passwordlessError: "Não foi possível enviar o código. Tente de novo.",
			passwordlessBack: "Voltar ao login",
			resetTitle: "Nova senha",
			resetHint: "Digite o código enviado para {email} e a nova senha.",
			resetSubmit: "Salvar e entrar",
			resetError: "Não foi possível redefinir a senha. Verifique o código.",
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
				"Software for the back office of financial markets — credit, accounting, and core banking.",
			primaryCta: { label: "View projects", href: "#work" },
			secondaryCta: { label: "Contact", href: "#contact" },
			terminal: {
				prompt: "kalke@dev:~$",
				lines: [
					{
						cmd: "whoami",
						out: "Backend, core banking, and auth in regulated environments.",
						href: "#about",
					},
					{
						cmd: "ls ~/work",
						out: "document-extractor/  kalke-auth/  e-bank-api/",
						href: "#work",
					},
					{
						cmd: "cat contact.md",
						out: "henriquekalke@icloud.com · WhatsApp preferred",
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
				"Hey — I'm Henrique Kalke, or just kalke. I live in Curitiba, and for the last eight years I've focused on software behind financial markets: credit systems, accounting, and core banking infrastructure. I work in places where a mistake isn't just a failed log line — it's money lost and an audit headache.",
				"My academic background is Information Systems (BSI) and Applied Artificial Intelligence (IAA). Day to day I build ecosystems around high-volume settlement, PIX, fee engines, governance, and onboarding under strict compliance rules — including LLMs for document checks. I've worked at Kanastra, Exati, and QuiteJá, close to Go, Python, and messaging.",
				"I lived three years in the UK and was raised literate in English, so it isn't just a second language I cope with. That helps a lot when gathering requirements, reading docs, and shipping systems.",
			],
		},
		likes: {
			eyebrow: "~/likes",
			title: "Away from the keyboard",
			items: [
				{
					title: "Zaia, Chico, Linhaça, and Claire",
					text: "My four cats. I'm a different person with them, and the house is never quiet.",
				},
				{
					title: "Meg",
					text: "The happiest member of the family. I swear I wanted Lurdinha — I lost that argument.",
				},
				{
					title: "Games",
					text: "The official way to reset my head after work.",
				},
				{
					title: "Music",
					text: "An extension of me — working, gaming, or training.",
				},
			],
		},
		stack: {
			eyebrow: "~/stack",
			title: "Stack",
			intro: "The tools that solve my problems today, grouped by their role in the architecture:",
			groups: [
				{
					area: "Applications",
					items: ["Go", "Python", "FastAPI", "Flask", "TypeScript", "React", "Vue"],
				},
				{ area: "Data", items: ["PostgreSQL", "MySQL", "Redis", "Kafka"] },
				{ area: "Cloud & runtime", items: ["AWS", "Docker", "Cloudflare Workers"] },
				{ area: "Identity & APIs", items: ["OpenAPI", "OIDC", "Keycloak"] },
				{ area: "Commercial sites", items: ["WordPress", "Elementor"] },
			],
		},
		builds: {
			eyebrow: "~/work",
			title: "Projects",
			intro: "A few public repos and things I build when the product needs dedicated code.",
			items: [
				{
					name: "Document extractor",
					href: "/playground",
					blurb:
						"Live demo in production. Upload a PDF or image, get structured extraction output, with auth and LGPD consent.",
					tags: ["Live demo", "Go", "LLM", "OIDC"],
					featured: true,
					cta: "Open live demo",
				},
				{
					name: "kalke-auth",
					href: "https://github.com/kalke/kalke-auth",
					blurb:
						"Auth engine on Keycloak/OIDC: cookie sessions, PATs, and introspect for microservices that call the API.",
					tags: ["Keycloak", "OIDC", "Go"],
				},
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"API behind the live demo. Extracts ID docs, proof of address, and invoices with an LLM, PostgreSQL, and Redis.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"Reference banking API in FastAPI: deposit, withdraw, and transfer, with OpenAPI and solid test coverage.",
					tags: ["Python", "FastAPI"],
				},
			],
		},
		contact: {
			eyebrow: "~/contact",
			title: "Contact",
			text: "Want to talk code, banking infrastructure, side projects, or new roles? Send a message. I'm usually fastest on WhatsApp.",
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
			continueWithGoogle: "Continue with Google",
			continueWithEmail: "Continue with email",
			authOr: "or",
			authOtherMethods: "Other options",
			passwordOptional: "Password (optional)",
			passwordOptionalHint: "Leave blank to get a code by email.",
			usePassword: "Use password",
			hidePassword: "Use email code",
			oauthError: "Could not sign in with Google. Try again.",
			forgotPassword: "Forgot password",
			forgotTitle: "Reset password",
			forgotHint:
				"Enter the account email. If it exists, we will send a code.",
			forgotSubmit: "Send code",
			forgotSent: "If the account exists, we sent a code to {email}.",
			forgotError: "Could not send the code. Try again.",
			forgotBack: "Back to sign in",
			passwordless: "Sign in without password",
			passwordlessTitle: "Email sign-in",
			passwordlessHint:
				"We will send a 6-digit code to the account email.",
			passwordlessSubmit: "Send code",
			passwordlessError: "Could not send the code. Try again.",
			passwordlessBack: "Back to sign in",
			resetTitle: "New password",
			resetHint: "Enter the code sent to {email} and your new password.",
			resetSubmit: "Save and sign in",
			resetError: "Could not reset the password. Check the code.",
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
