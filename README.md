# 🏎️ GM IMPORTS - Plataforma de Venda de Veículos de Luxo

Projeto front-end desenvolvido como requisito avaliativo para a disciplina de Desenvolvimento Web - Professor Adriano Ferrasa. A aplicação consiste em um sistema de e-commerce e gerenciamento de anúncios de carros, focado no consumo de uma API REST simulada.

## 👥 Equipe
* Ícaro Mikos
* Kauan Rodrigues

## 🛠️ Tecnologias e Ferramentas Utilizadas
* **Front-end:** ReactJS (criado com o template Vite)
* **Estilização:** CSS3 Vanilla
* **Back-end / Mock API:** JSON Server
* **Armazenamento de Sessão:** LocalStorage (para manter o login persistente)

## ⚙️ Como rodar o projeto na sua máquina

Para que a aplicação funcione corretamente com todas as funcionalidades do CRUD, é necessário rodar o servidor da API e o servidor do React simultaneamente.

**1. Instalação das dependências**
Abra o terminal na pasta raiz do projeto e execute:
`npm install`

**2. Inicializar a API REST (Banco de Dados Local)**
Em um terminal, rode o servidor na porta 3000 para habilitar os endpoints de veículos e usuários:
`npx json-server --watch db.json --port 3000`

**3. Inicializar a Aplicação React**
Mantenha o terminal anterior aberto, abra uma **nova aba de terminal** e rode o Vite:
`npm run dev`
Acesse a aplicação no navegador através de: `http://localhost:5173/`

## 📡 Descrição e Estrutura da API REST

O projeto consome uma Mock API através do `json-server`, simulando um banco de dados relacional. A comunicação é feita via `fetch` nativo do JavaScript.

### Endpoints de Veículos (`/veiculos`)
* `GET /veiculos`: Retorna o array contendo todos os veículos cadastrados na vitrine.
* `POST /veiculos`: Cadastra um novo anúncio de veículo.
* `PUT /veiculos/:id`: Atualiza dados específicos de um anúncio pré-existente.
* `DELETE /veiculos/:id`: Remove o anúncio do banco de dados.

### Endpoints de Usuários (`/usuarios`)
* `GET /usuarios`: Valida as credenciais de login informadas no formulário.
* `POST /usuarios`: Realiza o cadastro de uma nova conta no sistema.
* `PUT /usuarios/:id`: Atualiza os dados de perfil na aba "Minha Conta".
