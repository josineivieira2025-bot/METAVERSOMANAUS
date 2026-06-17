# Deploy no Render

Este projeto usa dois servicos no Render:

- **Backend:** Web Service Node.js.
- **Frontend:** Static Site React/Vite.

O banco ja fica fora do Render, no MongoDB Atlas.

## 1. Backend

Na tela **New**, escolha **Web Services**.

Configuracao:

- **Name:** `metaverso-manaus-api`
- **Runtime:** Node
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free para teste inicial

Variaveis de ambiente:

```text
MONGO_URI=sua_uri_mongodb_atlas
MONGO_DATABASE=metaverso_manaus
WORLD_NAME=Manaus Online
NODE_ENV=production
JWT_SECRET=crie_um_segredo_grande
CORS_ORIGIN=*
```

Depois que o frontend estiver publicado, troque `CORS_ORIGIN=*` pela URL do frontend, por exemplo:

```text
CORS_ORIGIN=https://metaverso-manaus.onrender.com
```

Teste do backend:

```text
https://SEU_BACKEND.onrender.com/health
```

Deve responder:

```json
{
  "status": "ok"
}
```

## 2. Frontend

Na tela **New**, escolha **Static Sites**.

Configuracao:

- **Name:** `metaverso-manaus`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

Variaveis de ambiente:

```text
VITE_API_URL=https://SEU_BACKEND.onrender.com
```

Importante: depois de alterar `VITE_API_URL`, faca novo deploy do Static Site, porque o Vite grava essa variavel no build.

### Erro comum no Build Command

Se o Render mostrar algo como:

```text
npm error Missing script: "buildnpm"
```

o campo **Build Command** ficou com comandos colados, por exemplo:

```text
npm install; npm run buildnpm install && npm run build
```

Apague tudo e deixe exatamente:

```text
npm install && npm run build
```

Sem texto antes, sem `;`, sem outro `npm install` depois.

## 3. MongoDB Atlas

No Atlas, confira:

- Database user ativo.
- Senha correta.
- Network Access liberado.

Para teste rapido no Render, libere:

```text
0.0.0.0/0
```

Depois, para producao mais rigida, restrinja quando tiver IP/egress controlado.

## 4. Ordem certa

1. Criar o **Web Service** do backend.
2. Testar `/health`.
3. Criar o **Static Site** do frontend.
4. Colocar `VITE_API_URL` com a URL do backend.
5. Voltar no backend e ajustar `CORS_ORIGIN` com a URL do frontend.
6. Abrir o frontend e testar cadastro/login.
