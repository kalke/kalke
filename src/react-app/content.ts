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
	continueWithGitHub: string;
	continueWithEmail: string;
	authOr: string;
	authOtherMethods: string;
	authSocialHint: string;
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
	pathProfile: string;
	pathExtract: string;
	pathCv: string;
	pathCvSaved: string;
	pathBank: string;
	pathOverviewShort: string;
	pathApiShort: string;
	pathProfileShort: string;
	pathExtractShort: string;
	pathCvShort: string;
	pathCvSavedShort: string;
	pathBankShort: string;
	overviewTitle: string;
	overviewIntro: string;
	overviewApiCard: string;
	overviewApiHint: string;
	overviewProfileCard: string;
	overviewProfileHint: string;
	overviewExtractCard: string;
	overviewExtractHint: string;
	overviewCvCard: string;
	overviewCvHint: string;
	overviewCvSavedCard: string;
	overviewCvSavedHint: string;
	overviewBankCard: string;
	overviewBankHint: string;
	bankDemoBadge: string;
	bankTitle: string;
	bankIntro: string;
	bankBalance: string;
	bankAccountId: string;
	bankLoading: string;
	bankLoadError: string;
	bankNoAccount: string;
	bankOpenAccount: string;
	bankGoTransfer: string;
	bankGoActivity: string;
	bankGoOnboarding: string;
	bankOnboardingTitle: string;
	bankOnboardingIntro: string;
	bankDisclaimerTitle: string;
	bankTosTitle: string;
	bankTosLabel: string;
	bankTosRequired: string;
	bankContinue: string;
	bankDocsTitle: string;
	bankDocsHint: string;
	bankDocIdentity: string;
	bankDocAddress: string;
	bankDocUpload: string;
	bankDocUploaded: string;
	bankDocSkip: string;
	bankDocSkipHint: string;
	bankFinish: string;
	bankBootstrapping: string;
	bankOnboardingError: string;
	bankSkipDueDiligence: string;
	bankWizardIdHint: string;
	bankWizardExtract: string;
	bankWizardSkipId: string;
	bankWizardFullName: string;
	bankWizardDob: string;
	bankWizardAge: string;
	bankWizardDocument: string;
	bankWizardNameRequired: string;
	bankWizardDobRequired: string;
	bankWizardUnderage: string;
	bankWizardDocRequired: string;
	bankWizardCepRequired: string;
	bankWizardAddressRequired: string;
	bankWizardEmailRequired: string;
	bankWizardPhoneRequired: string;
	bankWizardCepLoading: string;
	bankWizardStreet: string;
	bankWizardNumber: string;
	bankWizardComplement: string;
	bankWizardNeighborhood: string;
	bankWizardCity: string;
	bankWizardPhone: string;
	bankWizardTermsSummary: string;
	bankWizardViewTerms: string;
	bankWizardEdit: string;
	bankWizardConfirm: string;
	bankWizardBack: string;
	bankWizardNext: string;
	bankAccountsTitle: string;
	bankAccountsIntro: string;
	bankAccountsEmpty: string;
	bankAccountsSearch: string;
	bankAccountsOpen: string;
	bankTransferResolve: string;
	bankTransferConfirm: string;
	bankTransferHolder: string;
	bankTransferTitle: string;
	bankTransferIntro: string;
	bankTransferDest: string;
	bankTransferAmount: string;
	bankTransferMemo: string;
	bankTransferSubmit: string;
	bankTransferOk: string;
	bankTransferError: string;
	bankTransferBack: string;
	bankActivityTitle: string;
	bankActivityIntro: string;
	bankActivityEmpty: string;
	bankActivityLoadError: string;
	bankActivityMore: string;
	bankActivityBack: string;
	bankTxType: string;
	bankTxAmount: string;
	bankTxMemo: string;
	bankTxCounterparty: string;
	bankTxWhen: string;
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
	profileMenuLink: string;
	profileTitle: string;
	profileIntro: string;
	profileIdentityTitle: string;
	profileIdentityHint: string;
	profileSaveName: string;
	profileNameOk: string;
	profileNameRequired: string;
	profileNameError: string;
	profileEmailTitle: string;
	profileEmailHint: string;
	profileNewEmail: string;
	profileEmailSendCode: string;
	profileEmailSent: string;
	profileEmailOk: string;
	profileEmailCancel: string;
	profileEmailInvalid: string;
	profileEmailTaken: string;
	profileEmailSame: string;
	profileEmailError: string;
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
	cvTitle: string;
	cvHint: string;
	cvPresent: string;
	cvSectionContact: string;
	cvSectionExperience: string;
	cvSectionEducation: string;
	cvSectionSkills: string;
	cvSkillCategories: Record<string, string>;
	cvSectionLanguages: string;
	cvSectionCertifications: string;
	cvConsentTitle: string;
	cvConsentLabel: string;
	cvHistoryTitle: string;
	cvHistoryHint: string;
	cvHistoryEmpty: string;
	cvHistoryOpen: string;
	cvHistoryLoadError: string;
	cvSavedAt: string;
	cvViewSaved: string;
	cvBackToSaved: string;
	cvBackToExtract: string;
	cvNotFound: string;
	consentTitle: string;
	consentLabel: string;
	consentRequired: string;
	docType: string;
	docTypeIdentity: string;
	docTypeAddress: string;
	docTypeInvoice: string;
	chooseFile: string;
	dropHint: string;
	dropBrowse: string;
	dropReplace: string;
	dropRemove: string;
	uploadProgress: string;
	extractProgress: string;
	extract: string;
	extracting: string;
	extracted: string;
	extractError: string;
	extractEmpty: string;
	resultSummary: string;
	resultJson: string;
	resultHideJson: string;
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
		links: { label: string; href: string; note: string; download?: string }[];
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
			primaryCta: { label: "Abrir demos", href: "/playground" },
			secondaryCta: { label: "Ver projetos", href: "#work" },
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
						out: "e-bank-api/  document-extractor/  kalke-auth/  playground/",
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
			intro:
				"Demos ao vivo no playground — banco, extração de documentos e CV — e os repositórios por trás.",
			items: [
				{
					name: "Playground",
					href: "/playground",
					blurb:
						"Hub ao vivo: demo bancária com onboarding e transferências, extração de RG/CNH/NF e currículos estruturados — tudo com auth OIDC.",
					tags: ["Live demo", "Bank", "LLM", "OIDC"],
					featured: true,
					cta: "Abrir demos",
				},
				{
					name: "e-bank-api",
					href: "/playground/bank",
					blurb:
						"Demo bancária em produção: conta vinculada ao usuário, ledger de partidas dobradas, onboarding e PIX fictício. Código em FastAPI.",
					tags: ["Live demo", "Python", "FastAPI"],
					cta: "Abrir demo bancária",
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
					href: "/playground/extract",
					blurb:
						"API de extração (RG, comprovantes, NFs) com LLM — uma das demos do playground, também no GitHub.",
					tags: ["Live demo", "Go", "LLM"],
					cta: "Abrir extração",
				},
			],
		},
		contact: {
			eyebrow: "~/contact",
			title: "Contato",
			text: "Quer bater um papo sobre código, infraestrutura bancária, projetos paralelos ou novas oportunidades? Me manda uma mensagem. Costumo ser mais rápido no WhatsApp. O currículo em PDF também está aqui.",
			links: [
				{
					label: "WhatsApp",
					href: "https://wa.me/5541991071908",
					note: "+55 41 99107-1908",
				},
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
					label: "Currículo (PDF)",
					href: "/cv/Henrique_Kalke_Engenheiro_de_Software_Senior.pdf",
					note: "Download",
					download: "Henrique_Kalke_Curriculo_PT.pdf",
				},
			],
		},
		footer: "React · Vite · Cloudflare",
		playground: {
			pageTitle: "Demos — kalke.dev",
			navAria: "Demo",
			backHome: "~/",
			eyebrow: "~/demo",
			title: "Acesso",
			intro:
				"Entre para o playground: demo bancária, extração de documentos, currículos e tokens de API.",
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
			continueWithGitHub: "Continuar com GitHub",
			continueWithEmail: "Continuar com email",
			authOr: "ou",
			authOtherMethods: "Outras opções",
			authSocialHint: "Se ainda não tiver conta, criamos na hora com o email do provedor.",
			passwordOptional: "Senha (opcional)",
			passwordOptionalHint: "Deixe em branco para receber um código por email.",
			usePassword: "Usar senha",
			hidePassword: "Entrar com código",
			oauthError: "Não foi possível entrar com Google ou GitHub. Tente de novo.",
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
			pathProfile: "~/demo/profile",
			pathExtract: "~/demo/extract",
			pathCv: "~/demo/cv",
			pathCvSaved: "~/demo/cv/saved",
			pathBank: "~/demo/bank",
			pathOverviewShort: "Demo",
			pathApiShort: "API",
			pathProfileShort: "Perfil",
			pathExtractShort: "Extract",
			pathCvShort: "CV",
			pathCvSavedShort: "Salvos",
			pathBankShort: "Bank",
			overviewTitle: "Demo ao vivo",
			overviewIntro:
				"Demo bancária, extração de documentos BR, curriculum vitae, e ajustes de conta.",
			overviewApiCard: "Tokens de API",
			overviewApiHint: "Gerar, copiar e revogar credenciais Bearer.",
			overviewProfileCard: "Perfil e API",
			overviewProfileHint: "Nome, email, senha e tokens de integração.",
			overviewExtractCard: "Extração",
			overviewExtractHint: "RG, CNH, comprovante e nota fiscal.",
			overviewCvCard: "Currículo",
			overviewCvHint:
				"Extrair e guardar CVs estruturados — abra os salvos em página própria.",
			overviewCvSavedCard: "Currículos salvos",
			overviewCvSavedHint: "Reabrir resultados já extraídos da sua conta.",
			overviewBankCard: "Demo bancária",
			overviewBankHint:
				"DEMO ONLY — conta com US$ 10.000 de boas-vindas; due diligence opcional.",
			bankDemoBadge: "DEMO ONLY",
			bankTitle: "Demo bancária",
			bankIntro:
				"Playground fictício. Saldo de boas-vindas US$ 10.000 — sem dinheiro real.",
			bankBalance: "Saldo",
			bankAccountId: "Conta",
			bankLoading: "Carregando conta…",
			bankLoadError: "Não foi possível carregar a conta demo.",
			bankNoAccount: "Ainda não há conta demo neste usuário.",
			bankOpenAccount: "Abrir conta demo",
			bankGoTransfer: "Transferir",
			bankGoActivity: "Extrato",
			bankGoOnboarding: "Onboarding",
			bankOnboardingTitle: "Onboarding demo",
			bankOnboardingIntro:
				"DEMO ONLY. Aceite os termos, envie documentos se quiser (DD pode ser pulada) e receba US$ 10.000 fictícios.",
			bankDisclaimerTitle: "Aviso",
			bankTosTitle: "Termos da demo",
			bankTosLabel:
				"Entendo que isto é só uma demo de portfólio (policy demo-bank-tos-v1): sem dinheiro real, sem crédito e sem obrigação bancária.",
			bankTosRequired: "Aceite os termos para continuar.",
			bankContinue: "Continuar",
			bankDocsTitle: "Due diligence (opcional)",
			bankDocsHint:
				"Envie identidade e comprovante via PDE, ou pule — a DD é skippable nesta demo.",
			bankDocIdentity: "Documento de identidade",
			bankDocAddress: "Comprovante de endereço",
			bankDocUpload: "Enviar e extrair",
			bankDocUploaded: "Anexado",
			bankDocSkip: "Pular due diligence",
			bankDocSkipHint:
				"Pular registra consentimento demo-dd-skip-v1 e segue para a conta.",
			bankFinish: "Concluir e abrir conta",
			bankBootstrapping: "Creditando fundos demo…",
			bankOnboardingError: "Falha no onboarding demo. Tente de novo.",
			bankSkipDueDiligence: "Pular e abrir conta demo",
			bankWizardIdHint:
				"Opcional: envie um documento de identidade para pré-preencher. Você pode editar tudo depois.",
			bankWizardExtract: "Extrair e continuar",
			bankWizardSkipId: "Pular upload",
			bankWizardFullName: "Nome completo",
			bankWizardDob: "Data de nascimento",
			bankWizardAge: "Idade",
			bankWizardDocument: "CPF",
			bankWizardNameRequired: "Informe o nome completo.",
			bankWizardDobRequired: "Informe a data de nascimento.",
			bankWizardUnderage: "É preciso ter 18 anos ou mais.",
			bankWizardDocRequired: "Informe um CPF válido.",
			bankWizardCepRequired: "Informe um CEP com 8 dígitos.",
			bankWizardAddressRequired: "Informe rua e número.",
			bankWizardEmailRequired: "Informe um e-mail válido.",
			bankWizardPhoneRequired: "Informe um telefone válido.",
			bankWizardCepLoading: "Consultando CEP…",
			bankWizardStreet: "Rua",
			bankWizardNumber: "Número",
			bankWizardComplement: "Complemento",
			bankWizardNeighborhood: "Bairro",
			bankWizardCity: "Cidade",
			bankWizardPhone: "Telefone",
			bankWizardTermsSummary:
				"Resumo: conta demo fictícia, sem dinheiro real. Aceite para abrir a conta.",
			bankWizardViewTerms: "Ver termos completos",
			bankWizardEdit: "Editar",
			bankWizardConfirm: "Confirmar e abrir conta",
			bankWizardBack: "Voltar",
			bankWizardNext: "Continuar",
			bankAccountsTitle: "Contas",
			bankAccountsIntro: "Sua conta demo com número, titular e saldo do ledger.",
			bankAccountsEmpty: "Nenhuma conta ainda — conclua o onboarding.",
			bankAccountsSearch: "Buscar por nome ou número",
			bankAccountsOpen: "Abrir",
			bankTransferResolve: "Resolver destinatário",
			bankTransferConfirm: "Confirmar transferência",
			bankTransferHolder: "Titular",
			bankTransferTitle: "Transferência demo",
			bankTransferIntro:
				"Envie saldo fictício para outro account id. DEMO ONLY — nada é liquidado de verdade.",
			bankTransferDest: "Conta destino",
			bankTransferAmount: "Valor",
			bankTransferMemo: "Memo (opcional)",
			bankTransferSubmit: "Transferir",
			bankTransferOk: "Transferência registrada na demo.",
			bankTransferError: "Não foi possível transferir.",
			bankTransferBack: "Voltar à demo bancária",
			bankActivityTitle: "Extrato demo",
			bankActivityIntro: "Movimentações desta conta playground.",
			bankActivityEmpty: "Nenhuma movimentação ainda.",
			bankActivityLoadError: "Não foi possível carregar o extrato.",
			bankActivityMore: "Carregar mais",
			bankActivityBack: "Voltar à demo bancária",
			bankTxType: "Tipo",
			bankTxAmount: "Valor",
			bankTxMemo: "Memo",
			bankTxCounterparty: "Contraparte",
			bankTxWhen: "Quando",
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
			profileMenuLink: "Perfil e API",
			profileTitle: "Perfil",
			profileIntro:
				"Atualize nome e email, troque a senha e gerencie tokens de API.",
			profileIdentityTitle: "Identidade",
			profileIdentityHint: "Nome exibido na conta. O email atual aparece abaixo.",
			profileSaveName: "Salvar nome",
			profileNameOk: "Nome atualizado.",
			profileNameRequired: "Informe um nome.",
			profileNameError: "Não foi possível salvar o nome.",
			profileEmailTitle: "Alterar email",
			profileEmailHint:
				"Enviamos um código de confirmação para o novo endereço antes de trocar.",
			profileNewEmail: "Novo email",
			profileEmailSendCode: "Enviar código",
			profileEmailSent: "Código enviado para {email}.",
			profileEmailOk: "Email atualizado.",
			profileEmailCancel: "Cancelar",
			profileEmailInvalid: "Email inválido.",
			profileEmailTaken: "Este email já está em uso.",
			profileEmailSame: "Informe um email diferente do atual.",
			profileEmailError: "Não foi possível iniciar a troca de email.",
			tokensTitle: "Tokens de API",
			tokensHint:
				"Tokens M2M para integrar via HTTP. O valor completo aparece uma vez — guarde-o. A extração no playground usa só a sessão (cookie), sem expor PAT.",
			tokenName: "Nome",
			createToken: "Gerar token",
			copyToken: "Copiar",
			copied: "Copiado",
			tokenOnce: "Copie agora — não será exibido de novo:",
			revoke: "Revogar",
			tokenError: "Falha na operação do token.",
			needToken: "Sessão expirada. Entre de novo para extrair.",
			apiHowTitle: "Uso via HTTP",
			apiHowBody:
				"Header Authorization: Bearer <token>. POST multipart em /v1/extract com arquivo e consentimento LGPD.",
			pdeTitle: "Extrair documento",
			pdeHint:
				"Escolha o tipo, envie o arquivo e confirme o consentimento. A autenticação é a sessão do site — nenhum token de API é criado ou mostrado aqui.",
			cvTitle: "Extrair currículo",
			cvHint:
				"Envie um CV em PDF ou imagem. O resultado estruturado fica salvo na sua conta para você consultar depois — autenticação só pela sessão.",
			cvPresent: "Atual",
			cvSectionContact: "Contato",
			cvSectionExperience: "Experiência",
			cvSectionEducation: "Formação",
			cvSectionSkills: "Skills",
			cvSkillCategories: {
				frontend: "Frontend",
				backend: "Backend",
				mobile: "Mobile",
				devops: "DevOps",
				cloud: "Cloud",
				data: "Data",
				tools: "Ferramentas",
				soft: "Soft skills",
				other: "Outros",
			},
			cvSectionLanguages: "Idiomas",
			cvSectionCertifications: "Certificações",
			cvConsentTitle: "Armazenar este currículo",
			cvConsentLabel:
				"O arquivo sobe para esta extração e o PDF/imagem não fica guardado. Um modelo de linguagem pode ler o conteúdo. O resultado estruturado (contato, experiência, formação, skills), o hash do arquivo e metadados técnicos (como IP) ficam salvos na sua conta para histórico e auditoria da demo.",
			cvHistoryTitle: "Currículos salvos",
			cvHistoryHint:
				"Resultados estruturados guardados na sua conta. Abra um item para ver o detalhe.",
			cvHistoryEmpty: "Nenhum currículo salvo ainda.",
			cvHistoryOpen: "Abrir",
			cvHistoryLoadError: "Não foi possível carregar os currículos salvos.",
			cvSavedAt: "Salvo em",
			cvViewSaved: "Ver currículos salvos",
			cvBackToSaved: "Voltar aos salvos",
			cvBackToExtract: "Extrair outro",
			cvNotFound: "Currículo não encontrado.",
			consentTitle: "Processamento deste documento",
			consentLabel:
				"O arquivo sobe só para esta extração e não fica armazenado. Um modelo de linguagem pode ler o conteúdo. Para operar e auditar a demo, podemos reter o hash, o resultado e metadados técnicos (como IP).",
			consentRequired: "Confirme o consentimento para extrair.",
			docType: "Tipo",
			docTypeIdentity: "Documento de identidade",
			docTypeAddress: "Comprovante de endereço",
			docTypeInvoice: "Nota fiscal",
			chooseFile: "Arquivo",
			dropHint: "Arraste o PDF ou a imagem para cá",
			dropBrowse: "escolher arquivo",
			dropReplace: "Trocar arquivo",
			dropRemove: "Remover",
			uploadProgress: "Enviando…",
			extractProgress: "Extraindo campos…",
			extract: "Extrair",
			extracting: "Extraindo…",
			extracted: "Extraído",
			extractError: "Falha na extração. Verifique o arquivo e tente de novo.",
			extractEmpty: "Nenhum resultado ainda. Envie um arquivo e execute Extrair.",
			resultSummary: "Resumo",
			resultJson: "JSON",
			resultHideJson: "Ocultar JSON",
			fieldLabels: {
				doc_type: "Tipo de documento",
				identity_document: "Documento de identidade",
				address_proof: "Comprovante de endereço",
				invoice_nf: "Nota fiscal",
				tipo: "Tipo",
				nome: "Nome",
				full_name: "Nome completo",
				name: "Nome",
				cpf: "CPF",
				rg: "RG",
				cnpj: "CNPJ",
				numero_documento: "Nº do documento",
				document_number: "Nº do documento",
				data_nascimento: "Nascimento",
				orgao_emissor: "Órgão emissor",
				validade: "Validade",
				expiry_date: "Validade",
				logradouro: "Logradouro",
				numero: "Número",
				bairro: "Bairro",
				cidade: "Cidade",
				uf: "UF",
				cep: "CEP",
				emissor: "Emissor",
				data: "Data",
				issue_date: "Emissão",
				serie: "Série",
				valor_total: "Valor total",
				total: "Total",
				invoice_number: "Número da NF",
				data_emissao: "Data de emissão",
				address: "Endereço",
				endereco: "Endereço",
				itens: "Itens",
				emitente_nome: "Emitente",
				emitente_cnpj: "CNPJ do emitente",
				curriculum_vitae: "Currículo",
				headline: "Título",
				email: "Email",
				phone: "Telefone",
				location: "Local",
				linkedin: "LinkedIn",
				github: "GitHub",
				website: "Site",
				summary: "Resumo",
				skills: "Skills",
				languages: "Idiomas",
				experience: "Experiência",
				education: "Formação",
				certifications: "Certificações",
				company: "Empresa",
				title: "Cargo",
				start_date: "Início",
				end_date: "Fim",
				institution: "Instituição",
				degree: "Curso",
				field: "Área",
				details: "Detalhes",
				issuer: "Emissor",
				level: "Nível",
				emitente_cpf: "CPF do emitente",
				destinatario_nome: "Destinatário",
				destinatario_cnpj: "CNPJ do destinatário",
				destinatario_cpf: "CPF do destinatário",
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
			primaryCta: { label: "Open demos", href: "/playground" },
			secondaryCta: { label: "View projects", href: "#work" },
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
						out: "e-bank-api/  document-extractor/  kalke-auth/  playground/",
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
			intro:
				"Live demos in the playground — bank, document extraction, and CVs — plus the repos behind them.",
			items: [
				{
					name: "Playground",
					href: "/playground",
					blurb:
						"Live hub: banking demo with onboarding and transfers, BR ID/invoice extraction, and structured CVs — all behind OIDC auth.",
					tags: ["Live demo", "Bank", "LLM", "OIDC"],
					featured: true,
					cta: "Open demos",
				},
				{
					name: "e-bank-api",
					href: "/playground/bank",
					blurb:
						"Banking demo in production: user-owned account, double-entry ledger, onboarding, and fictional transfers. FastAPI codebase.",
					tags: ["Live demo", "Python", "FastAPI"],
					cta: "Open banking demo",
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
					href: "/playground/extract",
					blurb:
						"Extraction API (IDs, address proofs, invoices) with an LLM — one of the playground demos, also on GitHub.",
					tags: ["Live demo", "Go", "LLM"],
					cta: "Open extraction",
				},
			],
		},
		contact: {
			eyebrow: "~/contact",
			title: "Contact",
			text: "Want to talk code, banking infrastructure, side projects, or new roles? Send a message. I'm usually fastest on WhatsApp. The résumé PDF is available below.",
			links: [
				{
					label: "WhatsApp",
					href: "https://wa.me/5541991071908",
					note: "+55 41 99107-1908",
				},
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
					label: "Resume (PDF)",
					href: "/cv/Henrique_Kalke_Senior_Software_Engineer.pdf",
					note: "Download",
					download: "Henrique_Kalke_Resume_EN.pdf",
				},
			],
		},
		footer: "React · Vite · Cloudflare",
		playground: {
			pageTitle: "Demos — kalke.dev",
			navAria: "Demo",
			backHome: "~/",
			eyebrow: "~/demo",
			title: "Sign in",
			intro:
				"Sign in to the playground: banking demo, document extraction, CVs, and API tokens.",
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
			continueWithGitHub: "Continue with GitHub",
			continueWithEmail: "Continue with email",
			authOr: "or",
			authOtherMethods: "Other options",
			authSocialHint: "If you don't have an account yet, we create one with the provider email.",
			passwordOptional: "Password (optional)",
			passwordOptionalHint: "Leave blank to get a code by email.",
			usePassword: "Use password",
			hidePassword: "Use email code",
			oauthError: "Could not sign in with Google or GitHub. Try again.",
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
			pathProfile: "~/demo/profile",
			pathExtract: "~/demo/extract",
			pathCv: "~/demo/cv",
			pathCvSaved: "~/demo/cv/saved",
			pathBank: "~/demo/bank",
			pathOverviewShort: "Demo",
			pathApiShort: "API",
			pathProfileShort: "Profile",
			pathExtractShort: "Extract",
			pathCvShort: "CV",
			pathCvSavedShort: "Saved",
			pathBankShort: "Bank",
			overviewTitle: "Live demo",
			overviewIntro:
				"Banking demo, Brazilian document extraction, structured CVs, and account settings.",
			overviewApiCard: "API tokens",
			overviewApiHint: "Generate, copy, and revoke Bearer credentials.",
			overviewProfileCard: "Profile & API",
			overviewProfileHint: "Name, email, password, and integration tokens.",
			overviewExtractCard: "Extraction",
			overviewExtractHint: "ID docs, proof of address, and invoices.",
			overviewCvCard: "Resume / CV",
			overviewCvHint:
				"Extract and store structured CVs — open saved ones on their own page.",
			overviewCvSavedCard: "Saved resumes",
			overviewCvSavedHint: "Reopen structured results already saved to your account.",
			overviewBankCard: "Banking demo",
			overviewBankHint:
				"DEMO ONLY — welcome US$ 10,000; due diligence is skippable.",
			bankDemoBadge: "DEMO ONLY",
			bankTitle: "Banking demo",
			bankIntro:
				"Fictional playground. Welcome balance US$ 10,000 — no real money.",
			bankBalance: "Balance",
			bankAccountId: "Account",
			bankLoading: "Loading account…",
			bankLoadError: "Could not load the demo account.",
			bankNoAccount: "No demo account for this user yet.",
			bankOpenAccount: "Open demo account",
			bankGoTransfer: "Transfer",
			bankGoActivity: "Activity",
			bankGoOnboarding: "Onboarding",
			bankOnboardingTitle: "Demo onboarding",
			bankOnboardingIntro:
				"DEMO ONLY. Accept the terms, optionally upload documents (DD is skippable), then receive fictional US$ 10,000.",
			bankDisclaimerTitle: "Disclaimer",
			bankTosTitle: "Demo terms",
			bankTosLabel:
				"I understand this is a portfolio demo only (policy demo-bank-tos-v1): no real money, no credit, no banking obligation.",
			bankTosRequired: "Accept the terms to continue.",
			bankContinue: "Continue",
			bankDocsTitle: "Due diligence (optional)",
			bankDocsHint:
				"Upload identity and proof of address via PDE, or skip — DD is skippable in this demo.",
			bankDocIdentity: "Identity document",
			bankDocAddress: "Proof of address",
			bankDocUpload: "Upload and extract",
			bankDocUploaded: "Attached",
			bankDocSkip: "Skip due diligence",
			bankDocSkipHint:
				"Skipping records demo-dd-skip-v1 consent and continues to the account.",
			bankFinish: "Finish and open account",
			bankBootstrapping: "Crediting demo funds…",
			bankOnboardingError: "Demo onboarding failed. Try again.",
			bankSkipDueDiligence: "Skip and open demo account",
			bankWizardIdHint:
				"Optional: upload an ID to pre-fill fields. Everything stays editable.",
			bankWizardExtract: "Extract and continue",
			bankWizardSkipId: "Skip upload",
			bankWizardFullName: "Full name",
			bankWizardDob: "Date of birth",
			bankWizardAge: "Age",
			bankWizardDocument: "CPF",
			bankWizardNameRequired: "Enter your full name.",
			bankWizardDobRequired: "Enter your date of birth.",
			bankWizardUnderage: "You must be at least 18.",
			bankWizardDocRequired: "Enter a valid CPF.",
			bankWizardCepRequired: "Enter an 8-digit CEP.",
			bankWizardAddressRequired: "Enter street and number.",
			bankWizardEmailRequired: "Enter a valid email.",
			bankWizardPhoneRequired: "Enter a valid phone number.",
			bankWizardCepLoading: "Looking up CEP…",
			bankWizardStreet: "Street",
			bankWizardNumber: "Number",
			bankWizardComplement: "Complement",
			bankWizardNeighborhood: "Neighborhood",
			bankWizardCity: "City",
			bankWizardPhone: "Phone",
			bankWizardTermsSummary:
				"Summary: fictional demo account, no real money. Accept to open the account.",
			bankWizardViewTerms: "View full terms",
			bankWizardEdit: "Edit",
			bankWizardConfirm: "Confirm and open account",
			bankWizardBack: "Back",
			bankWizardNext: "Continue",
			bankAccountsTitle: "Accounts",
			bankAccountsIntro: "Your demo account with number, holder, and ledger balance.",
			bankAccountsEmpty: "No account yet — finish onboarding.",
			bankAccountsSearch: "Search by name or number",
			bankAccountsOpen: "Open",
			bankTransferResolve: "Resolve recipient",
			bankTransferConfirm: "Confirm transfer",
			bankTransferHolder: "Holder",
			bankTransferTitle: "Demo transfer",
			bankTransferIntro:
				"Send fictional balance to another account id. DEMO ONLY — nothing settles for real.",
			bankTransferDest: "Destination account",
			bankTransferAmount: "Amount",
			bankTransferMemo: "Memo (optional)",
			bankTransferSubmit: "Transfer",
			bankTransferOk: "Transfer recorded in the demo.",
			bankTransferError: "Could not transfer.",
			bankTransferBack: "Back to banking demo",
			bankActivityTitle: "Demo activity",
			bankActivityIntro: "Movements on this playground account.",
			bankActivityEmpty: "No movements yet.",
			bankActivityLoadError: "Could not load activity.",
			bankActivityMore: "Load more",
			bankActivityBack: "Back to banking demo",
			bankTxType: "Type",
			bankTxAmount: "Amount",
			bankTxMemo: "Memo",
			bankTxCounterparty: "Counterparty",
			bankTxWhen: "When",
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
			profileMenuLink: "Profile & API",
			profileTitle: "Profile",
			profileIntro:
				"Update your name and email, change your password, and manage API tokens.",
			profileIdentityTitle: "Identity",
			profileIdentityHint: "Display name on your account. Current email is shown below.",
			profileSaveName: "Save name",
			profileNameOk: "Name updated.",
			profileNameRequired: "Enter a name.",
			profileNameError: "Could not save the name.",
			profileEmailTitle: "Change email",
			profileEmailHint:
				"We send a confirmation code to the new address before switching.",
			profileNewEmail: "New email",
			profileEmailSendCode: "Send code",
			profileEmailSent: "Code sent to {email}.",
			profileEmailOk: "Email updated.",
			profileEmailCancel: "Cancel",
			profileEmailInvalid: "Invalid email.",
			profileEmailTaken: "That email is already in use.",
			profileEmailSame: "Enter an email different from the current one.",
			profileEmailError: "Could not start the email change.",
			tokensTitle: "API tokens",
			tokensHint:
				"M2M tokens for HTTP integration. The full value is shown once — store it. Playground extract uses the site session cookie only; no PAT is exposed.",
			tokenName: "Name",
			createToken: "Generate token",
			copyToken: "Copy",
			copied: "Copied",
			tokenOnce: "Copy now — it will not be shown again:",
			revoke: "Revoke",
			tokenError: "Token operation failed.",
			needToken: "Session expired. Sign in again to extract.",
			apiHowTitle: "HTTP usage",
			apiHowBody:
				"Authorization: Bearer <token> header. POST multipart to /v1/extract with file and LGPD consent.",
			pdeTitle: "Extract document",
			pdeHint:
				"Pick a type, upload a file, and confirm consent. Auth is your site session — no API token is created or shown here.",
			cvTitle: "Extract resume",
			cvHint:
				"Upload a CV as PDF or image. The structured result is saved to your account so you can reopen it later — authenticated by site session only.",
			cvPresent: "Present",
			cvSectionContact: "Contact",
			cvSectionExperience: "Experience",
			cvSectionEducation: "Education",
			cvSectionSkills: "Skills",
			cvSkillCategories: {
				frontend: "Frontend",
				backend: "Backend",
				mobile: "Mobile",
				devops: "DevOps",
				cloud: "Cloud",
				data: "Data",
				tools: "Tools",
				soft: "Soft skills",
				other: "Other",
			},
			cvSectionLanguages: "Languages",
			cvSectionCertifications: "Certifications",
			cvConsentTitle: "Store this resume",
			cvConsentLabel:
				"The file is uploaded for this extraction and the PDF/image is not kept. A language model may read the content. The structured result (contact, experience, education, skills), file hash, and technical metadata (such as IP) are saved to your account for history and demo audit.",
			cvHistoryTitle: "Saved resumes",
			cvHistoryHint:
				"Structured results stored on your account. Open an item to see the full detail.",
			cvHistoryEmpty: "No saved resumes yet.",
			cvHistoryOpen: "Open",
			cvHistoryLoadError: "Could not load saved resumes.",
			cvSavedAt: "Saved",
			cvViewSaved: "View saved resumes",
			cvBackToSaved: "Back to saved",
			cvBackToExtract: "Extract another",
			cvNotFound: "Resume not found.",
			consentTitle: "Processing this document",
			consentLabel:
				"The file is uploaded only for this extraction and is not stored. A language model may read the content. To run and audit the demo, we may retain the hash, the result, and technical metadata (such as IP).",
			consentRequired: "Confirm consent to extract.",
			docType: "Type",
			docTypeIdentity: "Identity document",
			docTypeAddress: "Proof of address",
			docTypeInvoice: "Invoice",
			chooseFile: "File",
			dropHint: "Drop a PDF or image here",
			dropBrowse: "browse files",
			dropReplace: "Replace file",
			dropRemove: "Remove",
			uploadProgress: "Uploading…",
			extractProgress: "Extracting fields…",
			extract: "Extract",
			extracting: "Extracting…",
			extracted: "Extracted",
			extractError: "Extraction failed. Check the file and try again.",
			extractEmpty: "No result yet. Upload a file and run Extract.",
			resultSummary: "Summary",
			resultJson: "JSON",
			resultHideJson: "Hide JSON",
			fieldLabels: {
				doc_type: "Document type",
				identity_document: "Identity document",
				address_proof: "Proof of address",
				invoice_nf: "Invoice",
				tipo: "Type",
				nome: "Name",
				full_name: "Full name",
				name: "Name",
				cpf: "CPF",
				rg: "RG",
				cnpj: "CNPJ",
				numero_documento: "Document number",
				document_number: "Document number",
				data_nascimento: "Date of birth",
				orgao_emissor: "Issuing authority",
				validade: "Expiry",
				expiry_date: "Expiry",
				logradouro: "Street",
				numero: "Number",
				bairro: "District",
				cidade: "City",
				uf: "State",
				cep: "Postal code",
				emissor: "Issuer",
				data: "Date",
				issue_date: "Issued",
				serie: "Series",
				valor_total: "Total amount",
				total: "Total",
				invoice_number: "Invoice number",
				data_emissao: "Issue date",
				address: "Address",
				endereco: "Address",
				itens: "Line items",
				emitente_nome: "Issuer",
				emitente_cnpj: "Issuer CNPJ",
				emitente_cpf: "Issuer CPF",
				destinatario_nome: "Recipient",
				destinatario_cnpj: "Recipient CNPJ",
				destinatario_cpf: "Recipient CPF",
				curriculum_vitae: "Resume / CV",
				headline: "Headline",
				email: "Email",
				phone: "Phone",
				location: "Location",
				linkedin: "LinkedIn",
				github: "GitHub",
				website: "Website",
				summary: "Summary",
				skills: "Skills",
				languages: "Languages",
				experience: "Experience",
				education: "Education",
				certifications: "Certifications",
				company: "Company",
				title: "Title",
				start_date: "Start",
				end_date: "End",
				institution: "Institution",
				degree: "Degree",
				field: "Field",
				details: "Details",
				issuer: "Issuer",
				level: "Level",
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
