# kalke.dev

Portfolio pessoal em [kalke.dev](https://kalke.dev).

Site simples, bilíngue (PT/EN), com quem eu sou, o que gosto, o que construo e como falar comigo.

## Por que existe

Dois motivos, no mesmo projeto:

1. **Estudar na prática** — React (Vite + TypeScript) e o ecossistema Cloudflare (Workers, Assets, Wrangler, domínio customizado).
2. **Ter um portfólio no ar** — um lugar próprio, com meu domínio, em vez de só um perfil no GitHub ou LinkedIn.

A ideia não era um template genérico. Era montar algo meu, publicar de verdade e aprender o caminho completo: código → build → deploy → DNS/TLS.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19, Vite, TypeScript |
| Edge | Cloudflare Workers + Static Assets |
| API mínima | Hono (`/api/health`) |
| Deploy | Wrangler |
| Domínio | `kalke.dev` / `www.kalke.dev` |

## Desenvolvimento

```bash
npm install
npm run dev      # local
npm run build    # build de produção
npm run deploy   # sobe para a Cloudflare
```

## Estrutura

```text
src/
  react-app/   # UI do portfólio
  worker/      # Worker (healthcheck + assets)
```

## Licença

Projeto pessoal. Código disponível para leitura e referência.
