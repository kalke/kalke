# kalke.dev

Portfolio pessoal em React + Vite, publicado na Cloudflare Workers.

## Desenvolvimento

```bash
# carregar Node (nvm)
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"

npm install
npm run dev
```

## Deploy

```bash
npx wrangler login   # uma vez
npm run deploy
```

O domínio `kalke.dev` (e `www`) está configurado em `wrangler.json` como custom domain.

## Conteúdo

Textos e links ficam em [`src/react-app/content.ts`](src/react-app/content.ts) — edite ali para atualizar o site sem mexer no layout.
