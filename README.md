# inteli.gente: demonstração da parte de arboviroses

Versão estática da inteli.gente, feita para a apresentação na ITU (12/11/2026). Ela abre as páginas
dos **645 municípios de São Paulo** sem servidor nem banco: as respostas da API foram exportadas para
arquivos JSON em `docs/dados/`. Os dados vão **até agosto de 2026**, da coleta de 08/11/2026.

O site da pasta `docs/` é o que vai para o GitHub Pages. Ele usa o endereço
`https://lvinaud.github.io/inteligente-demo-arboviroses/` e já foi gerado com esse prefixo.

## O que tem
- A página de cada município de SP, com as três abas ("Índices", "Caracterizações" e "Agente
  Inteligente").
- Na aba "Agente Inteligente":
  - card de previsão de dengue e chikungunya;
  - febre amarela, que não tem previsão: só casos confirmados e incidência;
  - fatores que influenciaram a previsão;
  - histórico de casos, comparação e vizinhos;
  - mapa e tabela de incidência do estado, 2015 a 2026;
  - projetos de lei do município e sugestões do Sonar Municipal.
- Busca de municípios, só os de SP.
- Português, inglês, francês e espanhol.
- Um aviso discreto no topo: "Versão de demonstração, dados até agosto de 2026".

## O que não tem
- **Zika:** a contagem está em revisão.
- **Assistente municipal, login e cadastro:** dependem do servidor.
- **Busca do Sonar ao vivo:** as sugestões de projetos de lei foram congeladas na exportação.
- **Municípios de fora de SP:** a página deles mostra "Disponível só na versão completa".
- **Buscadores:** o site não aparece neles (`noindex`), porque os dados ficam congelados.

## Testar no computador
Precisa do Node 18 ou mais novo. Não há nada para instalar.

```bash
node servir.mjs
# abra http://localhost:4000/inteligente-demo-arboviroses/
```

O `servir.mjs` imita o GitHub Pages: serve `docs/` sob o prefixo do repositório e, como o Pages,
responde com `404.html` aos endereços que não são arquivos. Por isso os links diretos, como
`/municipios/campinas-sp`, também abrem.

## Publicar no GitHub Pages
1. Antes, confira o plano da conta. Repositório **privado** só publica no Pages com GitHub Pro (o
   GitHub Student Pack inclui o Pro). Sem o Pro, é preciso deixar o repositório público.
2. Em **Settings → Pages → Build and deployment**:
   - Source: **Deploy from a branch**;
   - Branch: **main**;
   - Folder: **/docs**;
   - **Save**.
3. Em um ou dois minutos o site aparece em `https://lvinaud.github.io/inteligente-demo-arboviroses/`.
   O andamento fica na aba **Actions** ("pages build and deployment").

**O site publicado é público**, mesmo com o repositório privado: qualquer pessoa com o link abre.

Para tirar o site do ar: **Settings → Pages → Unpublish site**, ou trocar a Source para "None".

## Como foi gerado
- **Código:** repositório inteli.gente, branch `demo-estatica`. O commit exato está em
  `docs/dados/manifesto.json`, com a data e as contagens da exportação.
- **Comando:** com a API local rodando (banco e Sonar), `deploy/estatico/gerar.sh <pasta>/docs`.
  O script faz o build do frontend em modo estático (`VITE_MODO_ESTATICO=true`) e exporta da API as
  respostas que a página pede.
- **Testes:** ficam no mesmo diretório, `testar-roteiro.cjs` e `testar-municipios.cjs`.

## Dados pessoais e senhas
Não há nenhum.
- O exportador lê só as rotas públicas de leitura da API, nunca o banco.
- Os projetos de lei têm só ementa, município, data, tipo, número e link.
- Os indicadores são agregados por município.
