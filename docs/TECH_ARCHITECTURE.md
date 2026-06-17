# Arquitetura Tecnica

## 1. Stack Alvo

- **Cliente 3D:** Unreal Engine 5, Nanite, Lumen, World Partition, Mass Entity, Chaos Vehicles.
- **Backend:** Node.js com TypeScript, arquitetura modular.
- **Banco principal:** PostgreSQL.
- **Cache e tempo real:** Redis.
- **Mensageria:** NATS ou Kafka para eventos.
- **Orquestracao:** Kubernetes.
- **Cloud:** AWS.
- **Observabilidade:** OpenTelemetry, Prometheus, Grafana, Loki.
- **CDN e assets:** S3 + CloudFront.
- **Autenticacao:** OAuth/email/senha com MFA opcional.
- **Voz:** Vivox, Dolby.io, Photon Voice ou solucao WebRTC dedicada.

## 2. Topologia Multiplayer

### Camadas

1. **Gateway**
   - Autenticacao.
   - Rate limit.
   - Anti-DDoS.
   - Roteamento para shard.

2. **World coordinator**
   - Escolhe shard/zona.
   - Controla presenca.
   - Mantem estado macro do mundo.

3. **Zone servers**
   - Simulam bairros, ruas, interiores e eventos.
   - Autoritativos para movimento, interacao e fisica critica.

4. **Instance servers**
   - Interiores, empresas, hospitais, audiencias, eventos e missoes.

5. **Economy services**
   - Transacoes, precos, estoque, salarios, impostos e contratos.

6. **Social services**
   - Chat, amigos, familias, organizacoes e moderacao.

7. **Persistence services**
   - Salvamento de personagens, inventario, empresas, veiculos e imoveis.

## 3. Meta de 100.000 Simultaneos

100.000 jogadores simultaneos devem ser tratados como meta de plataforma, nao como uma unica sala fisica.

Estrategia:

- Shards regionais.
- World Partition no cliente.
- Zone servers independentes.
- Interest management por celula, distancia e relevancia.
- Simulacao agregada para NPCs distantes.
- Eventos massivos com instancias paralelas.
- Servicos stateless quando possivel.
- Filas assíncronas para economia e logs.
- Escalabilidade horizontal em Kubernetes.

## 4. Autoridade e Seguranca

O servidor deve ser autoritativo para:

- Posicao validada.
- Dinheiro.
- Inventario.
- Empresas.
- Contratos.
- Veiculos.
- Imoveis.
- Missoes.
- Policia/justica.

O cliente pode prever:

- Movimento local.
- Animacao.
- UI.
- Efeitos climaticos.

## 5. Mapa de Manaus

### Pipeline de producao

1. Captura/licenciamento de dados GIS.
2. Separacao por bairros e zonas de streaming.
3. Geracao de malha urbana base.
4. Classificacao de vias, rios, areas verdes e quadras.
5. Criacao procedural assistida.
6. Modelagem manual dos marcos principais.
7. Otimizacao Nanite/HLOD.
8. Navmesh para pedestres, veiculos e emergencia.
9. Validacao local com referencias e QA.

### Marcos principais

- Centro.
- Praca da Saudade.
- Porto de Manaus.
- Aeroporto Internacional Eduardo Gomes.
- Rodoviaria.
- Distrito Industrial.
- Ponta Negra.
- Shoppings, universidades, hospitais, escolas, delegacias, foruns, bancos e postos.

## 6. Clima e Ambiente

Servicos:

- `weather-service`: calcula clima global e por zona.
- `flood-service`: aplica enchentes sazonais.
- `traffic-service`: simula transito, acidentes, obras e horarios de pico.
- `npc-simulation-service`: rotinas agregadas e detalhadas.

Eventos climaticos sao publicados em mensageria e consumidos por:

- Zone servers.
- Economia.
- Missoes.
- Transito.
- UI.

## 7. Economia

### Componentes

- Ledger financeiro imutavel.
- Carteiras.
- Contas bancarias.
- PIX interno.
- Cartao de credito.
- Emprestimos.
- Financiamentos.
- Bolsa ficticia.
- Estoque.
- Precos dinamicos.
- Impostos.

### Regra essencial

Toda transacao financeira deve ser gravada como lancamento contabil, nunca apenas alterando saldo final.

## 8. Banco de Dados

PostgreSQL:

- Conta.
- Personagem.
- Necessidades.
- Profissoes.
- Empresas.
- Imoveis.
- Veiculos.
- Itens.
- Transacoes.
- Contratos.
- Social.
- Governo.
- Auditoria.

Redis:

- Sessao.
- Presenca.
- Cache de perfil.
- Fila leve.
- Rate limit.
- Estado temporario de zona.

## 9. API

Padrao:

- REST para recursos administrativos e persistentes.
- WebSocket/gRPC para tempo real operacional.
- Protobuf para mensagens entre cliente e servidores de jogo.

Endpoints iniciais:

- `POST /auth/register`
- `POST /auth/login`
- `GET /players/me`
- `POST /characters`
- `GET /world/status`
- `GET /economy/prices`
- `POST /bank/pix`
- `GET /jobs`
- `POST /jobs/:id/start`
- `GET /companies`
- `POST /companies`

## 10. Estrutura de Backend

```text
backend/
  package.json
  src/
    server.js
    config.js
    routes/
      health.routes.js
      world.routes.js
      economy.routes.js
    services/
      world.service.js
      economy.service.js
```

Em producao, migrar para TypeScript e separar em servicos independentes.

## 11. Estrutura de Frontend

```text
frontend/
  package.json
  src/
    App.jsx
    main.jsx
    styles.css
```

O frontend inicial e um dashboard web, nao o cliente Unreal. Ele serve para apresentar status do mundo, economia, roadmap e operacao.

## 12. DevOps

Ambientes:

- Local.
- Desenvolvimento.
- Homologacao.
- Beta fechado.
- Producao.

CI/CD:

- Lint.
- Testes.
- Build.
- Scan de seguranca.
- Migrations.
- Deploy canario.

Kubernetes:

- Namespaces por ambiente.
- HPA por CPU, memoria e fila.
- Node pools para simulacao.
- Spot instances para jobs nao criticos.
- Logs centralizados.

## 13. Moderacao e Compliance

- Denuncias in-game.
- Replay/log de interacoes criticas.
- Filtro de chat.
- Bloqueio e mute.
- Revisao humana.
- LGPD: consentimento, exportacao e exclusao de dados pessoais.
- Politica clara para menores de 18 dentro da classificacao 16+.

