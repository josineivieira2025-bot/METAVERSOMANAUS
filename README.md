# Metaverso Brasileiro: Manaus Online

MMORPG online de mundo aberto inspirado na vida real em Manaus-AM, Brasil.

Este repositório inicia a fundação de produto, design e engenharia para um jogo 16+ com economia, profissões, empresas, politica, moradias, veiculos, interacao social e progressao de personagem.

## Artefatos

- `docs/GDD.md`: Game Design Document completo.
- `docs/TECH_ARCHITECTURE.md`: arquitetura tecnica, multiplayer, escalabilidade e pipeline de mapa.
- `docs/ROADMAP_COSTS_MVP.md`: roadmap de 5 anos, equipe, custos e MVP de 12 meses.
- `database/schema.sql`: schema inicial PostgreSQL para conta, personagem, economia, empresas, imoveis, veiculos e social.
- `backend/`: esqueleto Node.js/Express para API e servicos online.
- `frontend/`: dashboard web inicial para operacao, comunidade e planejamento.
- `unreal/`: base Unreal Engine 5 para o cliente AAA em terceira pessoa.
- `docs/UE5_AAA_PRODUCTION_SPEC.md`: especificacao de producao AAA, pipeline Manaus 1:1, personagens, veiculos, IA e multiplayer.

## MVP tecnico atual

O prototipo atual inclui:

- API de status do mundo.
- Distritos iniciais: Centro, Distrito Industrial e Ponta Negra.
- Mapa logico 2D do MVP com 19 zonas, 10 marcos e 6 rotas.
- Personagem demonstrativo com necessidades.
- Profissoes iniciais com missao, salario parcial e experiencia.
- Mercado dinamico em memoria.
- PIX interno entre personagens.
- Contas com registro/login e token de sessao.
- Fluxo jogavel web: login/cadastro, criacao de personagem, lobby e entrada no mapa 2D.
- Movimento do personagem entre bairros desbloqueados com impacto em energia, sede e estresse.
- Empresas, imoveis, veiculos, inventario, missoes, servicos publicos e moderacao no MongoDB.
- Dashboard React para acompanhar e acionar sistemas do MVP.

## Cliente AAA Unreal Engine 5

O alvo visual real do jogo fica em `unreal/ManausMetaverse.uproject`.

Esta base ja configura:

- Lumen.
- Nanite.
- Ray Tracing.
- Virtual Shadow Maps.
- Volumetric Fog.
- Enhanced Input.
- Chaos Vehicles.
- Mass AI.
- IKRig/Motion Warping.
- Camera terceira pessoa.

O prototipo web continua util para testar backend, login, mapa logico e economia, mas nao representa a qualidade visual final.

### Rodar localmente

Crie `backend/.env` com as variaveis do MongoDB. Use `backend/.env.example` como base.

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

## Principios do projeto

- Manaus como protagonista: bairros, clima amazonico, rios, porto, industria, comercio, cultura urbana e mobilidade local.
- Realismo jogavel: simulacao profunda sem sacrificar onboarding, performance e diversao.
- Economia dinamica: oferta e demanda, empresas de jogadores, bancos, impostos, contratos e mercado.
- Servidores distribuidos: arquitetura preparada para shards, zonas, instancias e eventos massivos.
- Conteudo 16+: foco adulto moderado, com politicas de conduta, seguranca, privacidade e moderacao.

## Escopo realista

Um MMORPG com replica urbana extremamente fiel e 100.000 jogadores simultaneos e um projeto AAA/multianual. O MVP de 12 meses deve validar:

1. Um recorte jogavel de Manaus.
2. Multiplayer persistente com economia simples.
3. Criacao de personagem e necessidades basicas.
4. Profissoes iniciais.
5. Imoveis e veiculos em versao reduzida.
6. Operacao online segura.
