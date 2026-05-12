# Skin_Deal
## Identificação do Problema
O mercado de skins e itens cosméticos em jogos digitais cresce cada vez mais, principalmente em plataformas como a Steam, onde milhares de transações são realizadas diariamente. Porém, ao vender uma skin dentro da plataforma, o usuário não recebe dinheiro real, apenas saldo interno que pode ser utilizado somente na própria Steam. Essa limitação reduz a liberdade financeira dos jogadores que desejam transformar seus ativos digitais em recursos monetários reais.

Além disso, cada jogo possui seu próprio mercado separado, dificultando a visualização centralizada de preços, ofertas e oportunidades de compra e venda. Isso faz com que os usuários precisem acessar diferentes páginas e plataformas para acompanhar o mercado, tornando o processo menos prático e organizado.

## Resumo do Problema
O mercado de skins digitais movimenta milhões de usuários e possui grande potencial econômico, mas ainda apresenta limitações importantes. A principal delas é a impossibilidade de sacar em dinheiro real os valores obtidos nas vendas realizadas dentro da Steam. Outro desafio é a fragmentação dos mercados entre diferentes jogos, dificultando o gerenciamento das transações em um único ambiente.

Diante desse cenário, surge a necessidade de uma plataforma web capaz de centralizar diferentes mercados de skins em um só lugar, permitindo ao usuário acompanhar preços, visualizar ofertas, comprar e vender itens de forma mais prática, organizada e acessível. A proposta busca melhorar a experiência dos jogadores, ampliar a visibilidade das negociações e oferecer um ambiente mais eficiente para o gerenciamento de ativos digitais.

## Telas do Projeto Front-End

### Páginas públicas:

Home (apresentação do site, destaque para jogos mais populares e últimas ofertas).

Listagem de Jogos (visualização geral dos jogos com mercados de skins).

Cadastro/Login (para acesso de usuários registrados).

### Páginas restritas (usuários cadastrados):

Dashboard do Usuário (resumo das skins, saldo e histórico de vendas/compras).

Marketplace (listagem de skins disponíveis para compra e venda, com filtros).

Perfil (dados do usuário, configurações de segurança e preferências).

Relatórios (estatísticas de uso, vendas e movimentações financeiras).

## Pesquisa Detalhada Sobre o Problema

O mercado de skins e itens cosméticos em jogos digitais cresceu significativamente nos últimos anos, tornando-se uma importante forma de comércio virtual. Jogos como Counter-Strike 2, Dota 2 e Rust possuem economias internas extremamente ativas, movimentando milhões de usuários diariamente por meio da compra, venda e troca de skins. Esses itens digitais possuem diferentes níveis de raridade, aparência e demanda, fazendo com que alguns alcancem valores elevados no mercado.

Atualmente, a principal plataforma utilizada para comercialização dessas skins é a Valve Corporation, através da plataforma Steam. Entretanto, o sistema apresenta uma limitação importante: quando o usuário vende uma skin dentro da Steam, o valor obtido não pode ser sacado em dinheiro real. O saldo permanece preso à carteira da plataforma, podendo ser utilizado apenas para compras internas, como jogos, DLCs e outros itens digitais. Isso reduz a liberdade financeira dos jogadores e dificulta a transformação desses ativos virtuais em recursos monetários reais.

Outro problema identificado é a fragmentação do mercado. Cada jogo possui seu próprio sistema de itens e negociações, dificultando a centralização das informações e o acompanhamento de preços, ofertas e oportunidades em um único ambiente. Além disso, muitos usuários acabam recorrendo a plataformas externas para tentar converter skins em dinheiro real, o que aumenta os riscos de golpes, fraudes e perda de itens digitais. Relatos de usuários em fóruns e comunidades online mostram problemas frequentes relacionados à segurança das transações e limitações impostas pela própria plataforma.

Diante desse cenário, torna-se necessária uma solução que centralize diferentes mercados de skins em uma única plataforma, oferecendo maior organização, praticidade e segurança para os usuários que desejam acompanhar preços, comprar, vender e gerenciar seus ativos digitais de forma mais eficiente.

## Definição do Padrão de Arquitetura do Software

Para o desenvolvimento da plataforma de marketplace de skins, será utilizado o padrão de arquitetura em camadas, conhecido como arquitetura cliente-servidor (Client-Server), combinado com o modelo MVC (Model-View-Controller). Esse padrão foi escolhido por oferecer melhor organização do sistema, facilidade de manutenção, escalabilidade e separação de responsabilidades entre as partes do software.

A arquitetura será dividida em três principais camadas:

- Camada de Apresentação (Front-End): responsável pela interface visual do sistema e pela interação com o usuário. Nessa camada estarão as páginas do projeto, como Home, Marketplace, Dashboard, Perfil e Relatórios. O front-end enviará requisições para o servidor e exibirá as informações de forma organizada e intuitiva.
- Camada de Aplicação (Back-End): responsável pelas regras de negócio do sistema. Essa camada fará o gerenciamento de usuários, autenticação, controle das transações de compra e venda de skins, processamento de pagamentos, histórico de operações e comunicação com o banco de dados.
- Camada de Dados (Banco de Dados): responsável pelo armazenamento das informações do sistema, como dados de usuários, skins cadastradas, jogos disponíveis, histórico de transações, saldo financeiro e registros de movimentações.

O padrão MVC será utilizado para melhorar a organização do código:

Model: representa os dados e regras de negócio;
View: representa as interfaces visuais apresentadas ao usuário;
Controller: faz a comunicação entre a interface e as regras do sistema.

Essa arquitetura permite que o sistema seja mais modular, facilitando futuras atualizações, integração com novos jogos e implementação de novas funcionalidades. Além disso, o modelo cliente-servidor possibilita que múltiplos usuários acessem a plataforma simultaneamente de forma segura e eficiente.

Por se tratar de um sistema com movimentação financeira e autenticação de usuários, a arquitetura também prevê mecanismos de segurança, como criptografia de senhas, autenticação segura e validação das transações realizadas dentro da plataforma.
