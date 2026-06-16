# Como rodar o SkinDeal no Docker do professor

Esta pasta ja esta pronta com o SkinDeal dentro de `www/public`.

## Subir o ambiente

Abra um terminal nesta pasta (`Server-SkinDeal`) e rode:

```bash
docker compose up -d --build
```

## Acessos

- Site: http://localhost:8050/.vscode/login.html
- phpMyAdmin: http://localhost:8051

## Banco

O MySQL roda dentro do Docker com:

- Host interno usado pelo PHP: `mysql`
- Banco: `skindeal`
- Usuario root: `root`
- Senha root: `root`
- Porta no Windows: `3356`

O arquivo `mysql-init/01-skindeal.sql` e importado automaticamente na primeira criacao do volume do MySQL.

## Login de teste

- E-mail: `teste@skindeal.com`
- Senha: `password`

## Se o banco nao aparecer

Se voce ja tinha subido esse compose antes, o Docker pode reutilizar o volume antigo do MySQL e nao importar o SQL novo. Nesse caso, rode:

```bash
docker compose down -v
docker compose up -d --build
```

Atencao: `down -v` apaga os dados do banco desse ambiente Docker.
