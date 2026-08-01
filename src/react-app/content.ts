export type Lang = "pt" | "en";

export const siteMeta = {
	brand: "kalke",
	pt: {
		title: "kalke — pessoa que constrói coisas",
		description:
			"Kalke: engenheiro de software em Curitiba. Sistemas bancários, IA, gatos, metal e boxe.",
	},
	en: {
		title: "kalke — a person who builds things",
		description:
			"Kalke: software engineer in Curitiba. Banking systems, AI, cats, metal, and boxing.",
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
			headline: "Kalke — e às vezes Henrique.",
			support:
				"Passo o dia construindo sistemas que mexem com dinheiro de verdade. O resto do tempo é metal, boxe, videogame e uma casa lotada de bicho.",
			primaryCta: { label: "Quem sou", href: "#about" },
			secondaryCta: { label: "Fala comigo", href: "#contact" },
		},
		about: {
			eyebrow: "Quem sou",
			title: "Mais do que um LinkedIn com tema escuro",
			paragraphs: [
				"Me chama de Kalke. É sobrenome, mas é o jeito que a internet me encontrou — e eu me acostumei. Henrique também serve, sem drama. Desde moleque eu sabia que ia acabar mexendo com tecnologia; não foi revelação de palestra, foi só… óbvio.",
				"Morei três anos na Inglaterra. Foi lá que aprendi a ler e escrever — em inglês, antes do português. Até hoje o inglês não parece “segundo idioma”; parece o chão onde as palavras pousaram primeiro.",
				"Hoje estou em Curitiba, com uns seis anos construindo software no mundo financeiro: recuperação de crédito, accountingtech, e agora infraestrutura bancária de ponta a ponta. O tipo de sistema em que bug não é só ticket — é conta, PIX, boleto, regulação do Bacen.",
				"O que mais me orgulha não é a stack em si. É ter tirado onboarding de conta do processo manual e deixado rodando sozinho (com due diligence e conformidade), vendo a base crescer ~30% e cada conta nova já sair com PIX, boleto e TED. É ter ajudado a bancar mais de mil boletos por dia e mais de R$ 1 milhão liquidados diariamente. É um motor de tarifas que cobra sozinho e virou receita recorrente sem alguém apertar botão. É validar documento com LLM em vez de alguém reescrever PDF à mão.",
				"Antes disso, passei anos na fronteira entre plataformas e bancos: integrar API de credor, negociar contrato técnico, fazer o fluxo aguentar volume. Vi a operação saltar de milhões de boletos pagos e milhões de clientes a mais na base — e aprendi na prática que integração bem feita muda o negócio inteiro. Também mentorei júnior, revisei código com carinho (às vezes com rigor) e cortei custo de cloud redesenhando pipeline chato de remessa.",
				"No começo da carreira brinquei sério com ML: reconhecimento facial, chatbot com NER, modelo em produção na nuvem. Depois a vida puxou pra sistemas distribuídos, eventos, Kafka, Python, TypeScript — mas a curiosidade com IA nunca saiu. Fora do teclado: boxe, metal alto, jogo pra sumir um pouco, e quatro gatos mais uma cachorra que quase se chamou Lurdinha.",
			],
		},
		likes: {
			eyebrow: "Coisas que gosto",
			title: "A parte que não cabe no CV",
			items: [
				{
					title: "Zaia, Chico, Linhaça e Claire",
					text: "Quatro gatos. Quatro personalidades. Zero chance de silêncio absoluto em casa — e eu não trocaria.",
				},
				{
					title: "Meg (quase Lurdinha)",
					text: "Minha cachorrinha. Eu brigava internamente por Lurdinha. Ganhou Meg. Continua mandando na casa como se o nome fosse título nobiliárquico.",
				},
				{
					title: "Metal",
					text: "Música, sobretudo metal. Treino, foco, deslocamento, madrugada codeando — tem faixa pra cada estado de espírito, quase sempre com volume indecente.",
				},
				{
					title: "Videogame",
					text: "Quando solto o notebook, jogo. Não é “passar o tempo”: é pausar a cabeça de verdade. Atmosfera, história, ou só uma partida que exige presença.",
				},
				{
					title: "Boxe",
					text: "Luto boxe. Tem dia que o código não fecha a conta — o ringue fecha. Ritmo, corpo, e um jeito honesto de cansar.",
				},
			],
		},
		builds: {
			eyebrow: "O que construo",
			title: "Coisas que eu quis que existissem",
			intro:
				"No trabalho eu vivo de sistema crítico. Em casa, experimento — Go, LLM, API bancária de brinquedo — pra aprender do meu jeito, sem slide.",
			items: [
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"Uma obsessão profissional virou hobby: pegar documento brasileiro (RG, comprovante, NF) e devolver JSON limpo. Go, LLM, Postgres, Redis — o mesmo tipo de problema que já resolvi em produção, só que no meu ritmo.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"API bancária enxuta em FastAPI (depósito, saque, transferência) com Swagger e testes. Um playground pra modelar domínio sem o peso de um monólito real.",
					tags: ["Python", "FastAPI"],
				},
				{
					name: "personal-compose",
					href: "https://github.com/kalke",
					blurb:
						"Docker Compose pra subir banco e broker local sem ritual. DX chata, mas é a diferença entre “vou tentar” e “já estou rodando”.",
					tags: ["Docker", "DX"],
				},
			],
		},
		contact: {
			eyebrow: "Contato",
			title: "Se quiser puxar assunto",
			text: "Pode ser vaga, ideia, dúvida técnica, metal, gato, ou só um oi. Não prometo responder em cinco minutos — prometo responder de verdade.",
			links: [
				{
					label: "GitHub",
					href: "https://github.com/kalke",
					note: "código e experimentos",
				},
				{
					label: "LinkedIn",
					href: "https://www.linkedin.com/in/henriquekalke/",
					note: "o lado formal",
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
			headline: "Kalke — Henrique, sometimes.",
			support:
				"I spend my days building systems that move real money. The rest is metal, boxing, games, and a house full of animals.",
			primaryCta: { label: "About me", href: "#about" },
			secondaryCta: { label: "Say hi", href: "#contact" },
		},
		about: {
			eyebrow: "About",
			title: "More than a dark-mode LinkedIn",
			paragraphs: [
				"Call me Kalke. It’s my last name, but it’s how the internet found me — and it stuck. Henrique works too, no fuss. I’ve known since I was a kid that I’d end up in tech. Not a TED Talk moment. Just… obvious.",
				"I lived in England for three years. That’s where I learned to read and write — in English, before Portuguese. English still doesn’t feel like a “second language”; it feels like the first floor the words landed on.",
				"I’m based in Curitiba now, with about six years building software in finance: credit recovery, accountingtech, and lately full banking infrastructure. The kind of systems where a bug isn’t just a ticket — it’s an account, a PIX transfer, a boleto, Central Bank rules.",
				"What I’m proudest of isn’t the stack. It’s taking account onboarding off a manual track and making it run on its own (due diligence and compliance included), watching the customer base grow ~30%, and having every new account ship with PIX, boleto, and TED ready. It’s helping carry 1,000+ boletos a day and over R$1M settled daily. It’s a fee engine that bills itself and became recurring revenue without someone clicking a button. It’s validating documents with LLMs instead of rewriting PDFs by hand.",
				"Before that, I lived on the edge between platforms and banks: creditor APIs, technical contracts, flows that had to survive volume. I watched ops jump by millions of paid boletos and millions more customers — and learned the hard way that a solid integration can move the whole business. I also mentored juniors, reviewed code carefully (sometimes strictly), and cut cloud cost by redesigning a boring remittance pipeline.",
				"Early on I got serious with ML: facial recognition, a NER chatbot, models in production on the cloud. Life later pulled me into distributed systems, events, Kafka, Python, TypeScript — but the AI itch never left. Off the keyboard: boxing, loud metal, games to disappear for a bit, and four cats plus a dog who almost got named Lurdinha.",
			],
		},
		likes: {
			eyebrow: "Things I like",
			title: "The part that doesn’t fit on a résumé",
			items: [
				{
					title: "Zaia, Chico, Linhaça & Claire",
					text: "Four cats. Four personalities. Zero chance of absolute silence at home — and I wouldn’t trade it.",
				},
				{
					title: "Meg (almost Lurdinha)",
					text: "My dog. I fought hard internally for Lurdinha. Meg won. She still runs the house like the name came with a title.",
				},
				{
					title: "Metal",
					text: "Music, mostly metal. Training, focus, commuting, late-night coding — there’s a track for every mood, usually at an indecent volume.",
				},
				{
					title: "Video games",
					text: "When I put the laptop down, I play. Not “killing time” — actually parking my brain. Atmosphere, story, or a match that demands presence.",
				},
				{
					title: "Boxing",
					text: "I train boxing. Some days the code doesn’t settle the score — the ring does. Rhythm, body, an honest way to get tired.",
				},
			],
		},
		builds: {
			eyebrow: "What I build",
			title: "Things I wanted to exist",
			intro:
				"At work I live in critical systems. At home I experiment — Go, LLMs, a toy bank API — learning my way, without the slide deck.",
			items: [
				{
					name: "personal-document-extractor",
					href: "https://github.com/kalke/personal-document-extractor",
					blurb:
						"A work obsession turned hobby: take a Brazilian document (ID, proof of address, invoice) and return clean JSON. Go, LLM, Postgres, Redis — the same class of problem I’ve shipped in production, on my own clock.",
					tags: ["Go", "LLM", "Postgres"],
				},
				{
					name: "e-bank-api",
					href: "https://github.com/kalke/e-bank-api",
					blurb:
						"A lean FastAPI bank API (deposit, withdraw, transfer) with Swagger and tests. A playground for modeling domain without the weight of a real monolith.",
					tags: ["Python", "FastAPI"],
				},
				{
					name: "personal-compose",
					href: "https://github.com/kalke",
					blurb:
						"Docker Compose to spin up local databases and brokers without ritual. Unglamorous DX — and the difference between “I’ll try later” and “it’s already running.”",
					tags: ["Docker", "DX"],
				},
			],
		},
		contact: {
			eyebrow: "Contact",
			title: "If you want to talk",
			text: "A role, an idea, a technical question, metal, cats, or just hello. I won’t promise a five-minute reply — I will promise a real one.",
			links: [
				{
					label: "GitHub",
					href: "https://github.com/kalke",
					note: "code & experiments",
				},
				{
					label: "LinkedIn",
					href: "https://www.linkedin.com/in/henriquekalke/",
					note: "the formal side",
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
		footer: "built with React, Vite & Cloudflare",
	},
};

export function detectLang(): Lang {
	if (typeof window === "undefined") return "en";
	const saved = window.localStorage.getItem("kalke-lang");
	if (saved === "pt" || saved === "en") return saved;
	return window.navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}
