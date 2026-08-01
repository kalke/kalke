export const site = {
	brand: "kalke",
	title: "kalke — pessoa que constrói coisas",
	description:
		"Portfolio pessoal de kalke: quem eu sou, o que gosto e o que construo.",
	lang: "pt-BR",
};

export const hero = {
	headline: "Curioso por natureza. Construtor por hábito.",
	support:
		"Aqui não é só um CV — é um pedaço de quem eu sou, do que me interessa e do que gosto de fazer com as mãos (e com o teclado).",
	primaryCta: { label: "Quem sou", href: "#sobre" },
	secondaryCta: { label: "Fala comigo", href: "#contato" },
};

export const about = {
	eyebrow: "Quem sou",
	title: "Uma pessoa atrás do username",
	paragraphs: [
		"Sou o kalke — alguém que gosta de entender como as coisas funcionam e, quando possível, construir a própria versão delas. Passo bastante tempo entre código, ideias pela metade e café.",
		"Profissionalmente caminho pelo backend e por sistemas que precisam funcionar de verdade. Pessoalmente, gosto de espaço pra aprender sem pressa, de projetos que fazem sentido pra mim e de conversas honestas sobre o processo — não só sobre o resultado.",
		"Este site é um rascunho vivo: dá pra melhorar o texto, trocar fotos, acrescentar obsessões novas. A ideia é que você me conheça um pouco além do LinkedIn.",
	],
};

export const likes = {
	eyebrow: "Coisas que gosto",
	title: "O que ocupa a cabeça (e o tempo livre)",
	items: [
		{
			title: "Construir sistemas",
			text: "APIs, automações, ferramentas pequenas que resolvem um problema chato. Tem algo satisfatório em ver uma ideia sair do caderno e rodar.",
		},
		{
			title: "Café e rotina calma",
			text: "Manhãs com café, música baixa e uma lista enxuta. Não preciso de caos pra me sentir produtivo — preciso de foco.",
		},
		{
			title: "Aprender na prática",
			text: "Documentação ajuda, mas eu aprendo melhor quebrando, consertando e explicando depois. Projetos pessoais são meu laboratório.",
		},
		{
			title: "Jogos e mundos",
			text: "Gosto de sumir um pouco em jogos — especialmente os que têm atmosfera, exploração ou uma história bem contada.",
		},
		{
			title: "Música de fundo",
			text: "Playlists longas enquanto programo. O gênero muda; o volume baixo e o ritmo constante quase sempre ficam.",
		},
	],
};

export const builds = {
	eyebrow: "O que construo",
	title: "Projetos que nasceram de curiosidade",
	intro:
		"Não é um showcase corporativo — são coisas que eu quis existir: extrair dados de documentos, brincar com auth, experimentar APIs bancárias.",
	items: [
		{
			name: "personal-document-extractor",
			blurb:
				"API em Go que extrai dados estruturados de documentos pessoais (identidade, comprovante, NF) com LLM e pré-processamento.",
			tags: ["Go", "LLM", "API"],
		},
		{
			name: "kalke-auth",
			blurb:
				"Experimento de autenticação — entender o fluxo de ponta a ponta em vez de só plugar um SDK.",
			tags: ["Auth", "Backend"],
		},
		{
			name: "e-bank-api",
			blurb:
				"API bancária de estudo: modelar domínio, regras e endpoints como se fosse um produto de verdade.",
			tags: ["Go", "API", "Domínio"],
		},
	],
};

export const contact = {
	eyebrow: "Contato",
	title: "Se quiser conversar",
	text: "Pode ser sobre código, um projeto, café, ou só dizer oi. Respondo quando der — de verdade.",
	links: [
		{
			label: "GitHub",
			href: "https://github.com/kalke",
			note: "código e experimentos",
		},
		{
			label: "Email",
			href: "mailto:ola@kalke.dev",
			note: "ola@kalke.dev",
		},
	],
};

export const nav = [
	{ label: "Sobre", href: "#sobre" },
	{ label: "Gostos", href: "#gostos" },
	{ label: "Projetos", href: "#projetos" },
	{ label: "Contato", href: "#contato" },
];
