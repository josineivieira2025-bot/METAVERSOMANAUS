# Game Design Document

## 1. Visao Geral

**Titulo de trabalho:** Metaverso Brasileiro: Manaus Online  
**Genero:** MMORPG de mundo aberto, simulacao de vida, economia e roleplay persistente  
**Publico:** maiores de 16 anos  
**Plataformas alvo:** PC primeiro; console e cloud gaming em fases futuras  
**Motor:** Unreal Engine 5  
**Cenario:** Manaus-AM, Brasil, com foco em realismo urbano, clima amazonico, rios, industria, comercio e vida social.

### Objetivo

Criar o jogo online mais realista do Brasil, simulando uma vida urbana completa em Manaus, com economia, profissoes, empresas, politica, imoveis, veiculos, interacao social e progressao persistente.

### Pilares

- **Manaus viva:** bairros reconheciveis, clima local, fluxo urbano, porto, aeroporto, distrito industrial, shoppings, universidades, hospitais e areas residenciais.
- **Vida real jogavel:** necessidades, trabalho, renda, familia, moradia, transporte, saude, seguranca e lazer.
- **Economia dos jogadores:** empresas, estoque, contratos, salarios, impostos, bancos, credito e investimentos.
- **Roleplay profundo:** voz, texto, organizacoes, eventos sociais, reputacao, casamento, namoro, familias e carreiras.
- **Escalabilidade:** arquitetura para shards, zonas, servidores regionais, observabilidade e protecao contra abuso.

## 2. Classificacao 16+

Conteudos permitidos:

- Simulacao social adulta moderada.
- Sistema economico, credito, dividas, impostos e conflitos profissionais.
- Roleplay policial, juridico e politico.
- Linguagem gerada por usuarios com moderacao.

Conteudos controlados:

- Violencia deve ser limitada por regras de roleplay e moderacao.
- Relacionamentos sem conteudo sexual explicito.
- Sem incentivo a crime real, fraude, assedio, odio ou exploracao.
- Sistemas de denuncia, logs, punicoes e filtros devem existir desde o MVP.

## 3. Mundo e Mapa

### Direcao de mapa

O mapa deve ser produzido por pipeline profissional de geodados:

- Dados GIS licenciados ou abertos.
- Fotogrametria e referencias locais quando permitido.
- Blocos modulares de arquitetura amazonense e urbana brasileira.
- Nomes reais somente quando juridicamente liberados; caso contrario, usar estabelecimentos ficticios inspirados.
- Revisao legal para marcas, fachadas, logos, predios privados e direitos de imagem.

### Areas prioritarias

- Centro de Manaus
- Distrito Industrial
- Ponta Negra
- Cidade Nova
- Alvorada
- Adrianopolis
- Vieiralves
- Flores
- Aleixo
- Taruma
- Compensa
- Sao Jose
- Jorge Teixeira
- Coroado
- Educandos
- Cachoeirinha
- Praca da Saudade
- Porto de Manaus
- Aeroporto Internacional Eduardo Gomes
- Rodoviaria
- Shoppings
- Universidades
- Hospitais
- Escolas
- Delegacias
- Foruns
- Bancos
- Postos de combustivel
- Empresas ficticias inspiradas na cidade

### Zonas funcionais

- **Centro historico:** comercio, turismo, bancos, cartorios, foruns, eventos publicos.
- **Distrito Industrial:** logistica, fabricas, almoxarifado, operador logistico, engenharia, transporte pesado.
- **Ponta Negra/Taruma:** lazer, moradias premium, eventos, marina, turismo e lanchas.
- **Cidade Nova/Jorge Teixeira/Sao Jose:** moradias populares, comercio local, escolas, servicos.
- **Adrianopolis/Vieiralves/Aleixo/Flores:** escritorios, clinicas, restaurantes, startups, apartamentos.
- **Compensa/Educandos/Cachoeirinha/Coroado:** comercio, mobilidade, comunidades, rotas de trabalho.

### Simulacao ambiental

- Ciclo dia/noite com horarios reais acelerados.
- Clima dinamico: sol forte, nublado, chuva leve, chuva intensa, tempestades.
- Chuva amazonica com impacto em visibilidade, transito, rios e entregas.
- Enchentes sazonais em areas definidas, afetando rotas, aluguel, logistica e missoes.
- Eventos climaticos: alagamentos, queda de energia localizada, alertas de defesa civil.
- Transito inteligente com horarios de pico, acidentes, obras e semaforos.
- Pedestres controlados por IA com rotina, trabalho, lazer e reacoes.

## 4. Personagem

### Criacao

- Homem e mulher.
- Personalizacao avancada de rosto e corpo.
- Altura, peso, aparencia, pele, cabelo, barba, tatuagens e voz.
- Roupas iniciais por estilo social e faixa de renda.
- Origem social opcional para roleplay, sem vantagem injusta.

### Necessidades

- Fome
- Sede
- Sono
- Energia
- Saude
- Higiene
- Estresse
- Felicidade

Necessidades afetam desempenho, humor, interacoes, produtividade, direcao, estudo e trabalho.

### Progressao

- Nivel geral.
- Experiencia por atividade.
- Habilidades por carreira.
- Especializacoes.
- Reputacao publica, profissional, financeira e social.
- Conquistas.
- Historico persistente de eventos importantes.

## 5. Profissoes

Cada profissao possui requisitos, progresso, salario, beneficios, promocoes, missoes, ranking, reputacao e riscos.

### Profissoes iniciais e futuras

- Motorista de caminhao
- Motorista de aplicativo
- Taxista
- Motoboy
- Policial
- Bombeiro
- Medico
- Enfermeiro
- Advogado
- Juiz
- Empresario
- Programador
- Engenheiro
- Professor
- Mecanico
- Vigilante
- Seguranca
- Operador logistico
- Conferente
- Almoxarife
- Frentista
- Pescador
- Agricultor
- Vendedor
- Corretor
- Bancario
- Influenciador digital
- Streamer

### Estrutura de carreira

- **Nivel 1:** aprendiz/autonomo iniciante.
- **Nivel 2:** profissional regular.
- **Nivel 3:** especialista.
- **Nivel 4:** lider/supervisor.
- **Nivel 5:** gestor, socio, autoridade ou referencia publica.

### Exemplos de loops

- **Motorista de aplicativo:** aceitar corrida, buscar passageiro, respeitar rota/transito, avaliar cliente, receber pagamento, manter nota.
- **Motoboy:** retirar pedido, otimizar rota, lidar com chuva, entregar no prazo, manter moto.
- **Operador logistico:** carregar estoque, conferir nota, separar mercadoria, coordenar docas no Distrito Industrial.
- **Medico/enfermeiro:** triagem, diagnostico simplificado, atendimento, plantao, prontuario.
- **Advogado/juiz:** processos, audiencias roleplay, contratos, multas, disputas empresariais.
- **Influenciador/streamer:** criar conteudo in-game, ganhar seguidores, publicidade, eventos.

## 6. Economia

### Sistemas

- Moeda virtual.
- Bancos.
- PIX.
- TED.
- Emprestimos.
- Financiamentos.
- Cartao de credito.
- Investimentos.
- Bolsa de valores ficticia.
- Impostos municipais/estaduais/federais ficticios.
- Empresas privadas e estatais ficticias.

### Oferta e demanda

Precos variam por:

- Estoque global e local.
- Rotas logisticas.
- Chuva, enchente e eventos.
- Consumo de NPCs e jogadores.
- Producao de empresas.
- Politicas publicas e impostos.
- Escassez por regiao.

### Anti-abuso

- Logs de transacoes.
- Limites para contas novas.
- Detecção de lavagem de dinheiro virtual.
- Auditoria de empresas.
- Congelamento temporario por moderacao.
- Ferramentas antifraude e antidupe.

## 7. Empresas

Jogadores podem criar e operar:

- Transportadoras
- Mercados
- Restaurantes
- Lojas
- Postos
- Escritorios
- Startups
- Industrias

### Sistemas empresariais

- CNPJ ficticio.
- Licencas.
- Funcionarios.
- Folha de pagamento.
- Cargos e permissoes.
- Estoque.
- Vendas.
- Contratos.
- Impostos.
- Reputacao.
- Alvara e fiscalizacao.

## 8. Imoveis

Tipos:

- Casas
- Apartamentos
- Mansoes
- Fazendas
- Galpoes
- Empresas

Operacoes:

- Compra
- Venda
- Aluguel
- Financiamento
- Reformas
- Decoracao
- Condominio
- IPTU ficticio

Imoveis devem funcionar como moradia, armazenamento, ponto social e sede de empresa.

## 9. Veiculos

Tipos:

- Carros populares
- SUVs
- Caminhoes
- Motos
- Onibus
- Barcos
- Lanchas
- Avioes

Sistemas:

- Combustivel.
- Seguro.
- Multas.
- Manutencao.
- Licenciamento.
- Financiamento.
- Documentacao.
- Desgaste por uso, clima, colisao e terreno.

## 10. Sistema Social

- Chat por voz.
- Chat por texto.
- Amigos.
- Namoro.
- Casamento.
- Familias.
- Organizacoes.
- Empresas.
- Faccoes legais, como sindicatos, associacoes e partidos.
- Eventos sociais.
- Calendario comunitario.
- Moderacao, denuncia, bloqueio, silenciamento e historico.

## 11. IA

NPCs devem possuir:

- Rotina diaria.
- Trabalho.
- Moradia.
- Necessidades.
- Reacoes emocionais.
- Memoria de eventos.
- Relacao com jogador.
- Consumo economico.
- Capacidade de chamar servicos, avaliar atendimento e reagir a clima/transito.

### Modelo de IA

- Behavior trees para rotina local.
- Utility AI para decisoes.
- Memoria resumida por eventos relevantes.
- LOD de IA: NPCs distantes usam simulacao agregada; NPCs proximos usam comportamento detalhado.

## 12. Interface

Estilo: moderna, limpa, densa quando necessario, semelhante aos melhores MMORPGs atuais, mas com identidade brasileira urbana.

Telas:

- Criacao de personagem.
- HUD de necessidades.
- Mapa/GPS.
- Celular in-game.
- Banco/PIX.
- Inventario.
- Profissoes.
- Empresas.
- Imoveis.
- Veiculos.
- Chat.
- Amigos/familia.
- Governo e politica.
- Marketplace.
- Suporte/moderacao.

## 13. Politica e Governo

- Eleicoes periodicas para cargos ficticios.
- Propostas de impostos e investimentos.
- Orcamento publico ficticio.
- Contratos publicos.
- Obras e eventos.
- Sistema anticorrupcao e auditoria para evitar abuso.

## 14. MVP de Design

O MVP deve focar em um recorte vertical:

- Area inicial: Centro + Ponta Negra compactados ou Centro + Distrito Industrial, em escala reduzida.
- 200 a 500 jogadores simultaneos por ambiente.
- Criacao de personagem basica.
- Necessidades: fome, sede, energia, saude.
- Profissoes: motorista de app, motoboy, operador logistico, vendedor, policial em beta fechado.
- Economia: carteira, banco, PIX interno, lojas NPC, estoque simples.
- Veiculos: carro popular, moto, caminhao pequeno.
- Imoveis: quarto/apartamento inicial e loja pequena.
- Chat texto e voz por proximidade.
- Eventos climaticos simples: chuva e alagamento em rotas.

