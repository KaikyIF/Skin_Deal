# Back-end PHP - SkinDeal

Implementacao da Etapa 04/05 baseada na estrutura MVC do projeto do professor, com PHP, PDO, sessoes e MySQL.

## Como preparar o banco

1. Crie/importe o banco usando `Mysql/skindeal.sql`.
2. A conexao padrao esta em `Config/Database.php`:
   - host: `mysql`
   - banco: `skindeal`
   - usuario: `root`
   - senha: `root`
   - porta: `3306`
3. Se estiver usando XAMPP/WAMP local, ajuste `HOST` para `localhost` e `PASS` para a senha do seu MySQL.

## Endpoints implementados

- `POST api.php?route=register`: cadastro de usuario com `password_hash`.
- `POST api.php?route=login`: autenticacao com sessao PHP e historico de login.
- `POST api.php?route=logout`: encerra a sessao.
- `GET api.php?route=me`: dados da conta logada.
- `GET api.php?route=skins`: listagem do marketplace.
- `GET api.php?route=skin&id=1`: detalhe de uma skin.
- `POST api.php?route=sale-proposals`: proposta de venda com taxa de 5%.
- `POST api.php?route=purchase`: confirmacao de compra via PIX.

## Telas integradas

- `.vscode/login.js`
- `.vscode/cadastro.js`
- `.vscode/home.js`
- `.vscode/comprar.js`
- `.vscode/vender-skin.js`
- `.vscode/finalizar-compra.js`
- `.vscode/minhaconta.js`

Usuario inicial para testes depois de importar o SQL: `teste@skindeal.com` com senha `123456`.
