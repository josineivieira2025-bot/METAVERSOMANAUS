# Especificacao AAA Unreal Engine 5

## Posicionamento

O alvo visual e de jogabilidade e um MMORPG RP urbano em terceira pessoa, inspirado em jogos modernos de mundo aberto. O projeto nao deve usar low poly, cartoon, Roblox, blocos geometricos ou assets placeholder.

## Realidade de Producao

Um jogo com qualidade semelhante a OneState RP, GTA V, FiveM, Ready or Not e Cyberpunk 2077 nao e gerado apenas por codigo. Ele exige:

- Unreal Engine 5.
- Equipe de arte 3D.
- Animadores.
- Technical artists.
- Pipeline GIS.
- Modelagem de cidade.
- Captura ou compra de assets humanos/veiculos.
- Otimizacao de mundo aberto.
- Servidores multiplayer dedicados.

## Render

Configurar no projeto:

- Nanite.
- Lumen.
- Ray Tracing.
- Virtual Shadow Maps.
- HDR.
- Volumetric Fog.
- Global Illumination.
- PBR Materials.
- Texture streaming.
- HLOD e World Partition.

## Personagens

Recomendacao:

- MetaHuman para personagens base.
- Groom para cabelo e barba.
- Chaos Cloth para roupas.
- Control Rig.
- IK Rig.
- Motion Matching.
- Facial animation via ARKit blendshapes ou equivalente.

Entregaveis:

- Masculino e feminino.
- Customizacao de corpo.
- Cabelo realista.
- Barba dinamica.
- Roupa com fisica.
- Animacoes locomotoras humanas.
- Estados: parado, andar, correr, pular, entrar em veiculo, dirigir, nadar, interagir.

## Manaus 1:1

Pipeline correto:

1. Obter dados OSM para ruas, quadras e POIs.
2. Obter dados GIS oficiais quando disponiveis.
3. Usar imagens de satelite apenas como referencia/licenciamento permitido.
4. Nao redistribuir dados do Google Earth sem licenca.
5. Converter ruas para splines Unreal.
6. Gerar terreno e hidrografia.
7. Produzir predios manualmente ou por pipeline procedural com revisao artistica.
8. Criar landmarks individualmente.
9. Dividir tudo em World Partition cells.
10. Criar HLOD e Nanite meshes.

Areas prioritarias:

- Ponta Negra.
- Centro.
- Distrito Industrial.
- Adrianopolis.
- Vieiralves.
- Cidade Nova.
- Aleixo.
- Taruma.
- Aeroporto Eduardo Gomes.
- Porto de Manaus.

## Predios

Nao usar cubos como resultado final.

Cada edificio importante deve ter:

- Modelagem propria.
- Fachada reconhecivel quando legalmente permitido.
- Materiais PBR 4K.
- LOD/Nanite.
- Colisao otimizada.
- Interiores apenas quando jogaveis.

## Veiculos

Usar Chaos Vehicles.

Sistemas:

- Suspensao.
- Cambio.
- Dano.
- Combustivel.
- Pneus.
- Som de motor.
- Buzina.
- Farol.
- Licenciamento.
- Seguro.

## NPCs

Usar Mass Entity/Mass AI:

- Rotina diaria.
- Casa.
- Trabalho.
- Compra.
- Direcao.
- Reacao a clima/transito.
- LOD de simulacao.

## Multiplayer

Meta tecnica:

- 1000 jogadores por servidor/shard.
- Servidor autoritativo.
- Replication Graph ou Iris.
- Interest management.
- Voice chat por proximidade.
- Persistencia no backend.
- Instanciamento de interiores/eventos.

## Audio

Camadas:

- Chuva amazonica.
- Transito.
- Rios/barcos.
- Multidoes.
- Comercio.
- Ambientes internos.
- Sirenes.
- Motores.

## Proxima Etapa Recomendada

1. Abrir o projeto `unreal/ManausMetaverse.uproject`.
2. Criar mapa `Manaus_WorldPartition`.
3. Importar OSM/GIS.
4. Criar prototipo jogavel em Ponta Negra com MetaHuman.
5. Integrar login/backend existente.
6. Substituir prototipo web por cliente Unreal.

